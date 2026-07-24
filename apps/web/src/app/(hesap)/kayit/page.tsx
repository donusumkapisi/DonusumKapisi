import { getTranslations } from "next-intl/server";
import { AuthHeading } from "@/components/auth/auth-heading";
import { SignUpForm } from "./sign-up-form";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ rol?: string }>;
}) {
  const [{ rol }, t] = await Promise.all([searchParams, getTranslations("auth")]);
  const defaultRole = rol === "muteahhit" ? "CONTRACTOR" : "HOMEOWNER";

  return (
    <div>
      <AuthHeading
        eyebrow={t("signUpEyebrow")}
        title={t("signUpTitle")}
        description={t("signUpLead")}
        linkBefore={t("hasAccountBefore")}
        linkHref="/giris"
        linkLabel={t("hasAccountLink")}
      />
      <SignUpForm
        defaultRole={defaultRole}
        googleClientId={process.env.GOOGLE_WEB_CLIENT_ID}
        appleClientId={
          process.env.NEXT_PUBLIC_APPLE_CLIENT_ID ?? process.env.APPLE_SERVICES_ID
        }
      />
    </div>
  );
}
