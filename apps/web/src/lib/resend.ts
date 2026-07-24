import { Resend } from "resend";

function getClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY tanımlı değil.");
  return new Resend(apiKey);
}

export async function sendPasswordResetEmail(email: string, code: string) {
  const resend = getClient();
  const from = process.env.EMAIL_FROM ?? "DönüşümKapısı <onboarding@resend.dev>";

  await resend.emails.send({
    from,
    to: email,
    subject: "DönüşümKapısı Şifre Sıfırlama Kodu",
    html: `
      <p>Şifrenizi sıfırlamak için aşağıdaki kodu uygulamaya girin:</p>
      <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px;">${code}</p>
      <p>Bu kod 30 dakika içinde geçerliliğini yitirir. Bu isteği siz yapmadıysanız bu e-postayı yok sayabilirsiniz.</p>
    `,
  });
}
