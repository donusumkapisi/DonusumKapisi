import { NextResponse } from "next/server";
import { prisma } from "@donusum-kapisi/db";
import { googleAuthSchema, type AuthResponseDTO } from "@donusum-kapisi/shared";
import { verifyGoogleIdToken, GoogleTokenError } from "@/lib/google-auth";
import { signMobileToken } from "@/lib/mobile-auth";
import { mobileErrorResponse } from "@/lib/mobile-api";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = googleAuthSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "İstek geçersiz." },
      { status: 400 }
    );
  }

  try {
    const { email, name, googleId } = await verifyGoogleIdToken(parsed.data.idToken);

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      if (!parsed.data.role) {
        return NextResponse.json(
          { error: "Bu Google hesabıyla kayıtlı bir hesap bulunamadı. Önce kayıt olun." },
          { status: 404 }
        );
      }
      user = await prisma.user.create({
        data: { email, name, role: parsed.data.role },
      });
    }

    await prisma.account.upsert({
      where: { provider_providerAccountId: { provider: "google", providerAccountId: googleId } },
      update: { userId: user.id },
      create: {
        userId: user.id,
        type: "oauth",
        provider: "google",
        providerAccountId: googleId,
      },
    });

    const token = await signMobileToken(user);
    const response: AuthResponseDTO = {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof GoogleTokenError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return mobileErrorResponse(error);
  }
}
