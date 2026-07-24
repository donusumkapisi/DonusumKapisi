import { getTranslations } from "next-intl/server";
import { AuthHeading } from "@/components/auth/auth-heading";
import { ForgotPasswordForm } from "./forgot-password-form";

export default async function ForgotPasswordPage() {
  const t = await getTranslations("auth");

  return (
    <div>
      <AuthHeading
        eyebrow={t("forgotEyebrow")}
        title={t("forgotTitle")}
        description={t("forgotBody")}
        linkHref="/giris"
        linkLabel={t("backToLogin")}
      />
      <ForgotPasswordForm />
    </div>
  );
}
