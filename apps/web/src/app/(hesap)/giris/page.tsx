import { getTranslations } from "next-intl/server";
import { AuthHeading } from "@/components/auth/auth-heading";
import { LogInForm } from "./log-in-form";

export default async function LogInPage() {
  const t = await getTranslations("auth");

  return (
    <div>
      <AuthHeading
        eyebrow={t("loginEyebrow")}
        title={t("loginTitle")}
        linkBefore={t("noAccountBefore")}
        linkHref="/kayit"
        linkLabel={t("noAccountLink")}
      />
      <LogInForm
        googleClientId={process.env.GOOGLE_WEB_CLIENT_ID}
        appleClientId={
          process.env.NEXT_PUBLIC_APPLE_CLIENT_ID ?? process.env.APPLE_SERVICES_ID
        }
      />
    </div>
  );
}
