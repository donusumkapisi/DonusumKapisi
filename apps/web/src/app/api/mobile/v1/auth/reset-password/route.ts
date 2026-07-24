import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@donusum-kapisi/db";
import { resetPasswordSchema, type AuthResponseDTO } from "@donusum-kapisi/shared";
import { consumePasswordResetCode } from "@/lib/password-reset";
import { signMobileToken } from "@/lib/mobile-auth";
import { mobileErrorResponse } from "@/lib/mobile-api";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Formu kontrol edin." },
      { status: 400 }
    );
  }

  const { email, code, password } = parsed.data;

  try {
    const isValid = await consumePasswordResetCode(email, code);
    if (!isValid) {
      return NextResponse.json({ error: "Kod geçersiz veya süresi dolmuş." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.update({ where: { email }, data: { passwordHash } });

    const token = await signMobileToken(user);
    const response: AuthResponseDTO = {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
    return NextResponse.json(response);
  } catch (error) {
    return mobileErrorResponse(error);
  }
}
