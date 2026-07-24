import { NextResponse } from "next/server";
import { prisma } from "@donusum-kapisi/db";
import { appleAuthSchema, type AuthResponseDTO } from "@donusum-kapisi/shared";
import { verifyAppleIdentityToken, AppleTokenError } from "@/lib/apple-auth";
import { signMobileToken } from "@/lib/mobile-auth";
import { mobileErrorResponse } from "@/lib/mobile-api";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = appleAuthSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "İstek geçersiz." },
      { status: 400 }
    );
  }

  try {
    const { email, appleId } = await verifyAppleIdentityToken(parsed.data.identityToken);

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      if (!parsed.data.role) {
        return NextResponse.json(
          { error: "Bu Apple hesabıyla kayıtlı bir hesap bulunamadı. Önce kayıt olun." },
          { status: 404 }
        );
      }
      user = await prisma.user.create({
        data: { email, name: parsed.data.name ?? null, role: parsed.data.role },
      });
    }

    await prisma.account.upsert({
      where: { provider_providerAccountId: { provider: "apple", providerAccountId: appleId } },
      update: { userId: user.id },
      create: {
        userId: user.id,
        type: "oauth",
        provider: "apple",
        providerAccountId: appleId,
      },
    });

    const token = await signMobileToken(user);
    const response: AuthResponseDTO = {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof AppleTokenError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return mobileErrorResponse(error);
  }
}
