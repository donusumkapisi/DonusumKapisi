import { getTranslations } from "next-intl/server";
import { AuthHeading } from "@/components/auth/auth-heading";
import { ResetPasswordForm } from "./reset-password-form";

export default async function ResetPasswordPage() {
  const t = await getTranslations("auth");

  return (
    <div>
      <AuthHeading
        eyebrow={t("resetEyebrow")}
        title={t("resetTitle")}
        description={t("resetBody")}
        linkHref="/giris"
        linkLabel={t("backToLogin")}
      />
      <ResetPasswordForm />
    </div>
  );
}
