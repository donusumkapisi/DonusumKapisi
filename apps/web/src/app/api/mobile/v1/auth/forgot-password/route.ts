import { NextResponse } from "next/server";
import { prisma } from "@donusum-kapisi/db";
import { forgotPasswordSchema } from "@donusum-kapisi/shared";
import { createPasswordResetCode } from "@/lib/password-reset";
import { sendPasswordResetEmail } from "@/lib/resend";
import { mobileErrorResponse } from "@/lib/mobile-api";

// Hesap var/yok bilgisini sızdırmamak için başarı/hata durumunda hep aynı
// genel mesajı dönüyoruz; e-posta yalnızca hesap ve şifresi varsa gönderilir.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Geçerli bir e-posta girin." },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (user?.passwordHash) {
      const code = await createPasswordResetCode(user.email);
      await sendPasswordResetEmail(user.email, code);
    }

    return NextResponse.json({
      message: "Hesabınız varsa şifre sıfırlama kodu e-postanıza gönderildi.",
    });
  } catch (error) {
    return mobileErrorResponse(error);
  }
}
