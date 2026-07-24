import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("corporate");
  return { title: t("privacyTitle") };
}

export default async function PrivacyPage() {
  const t = await getTranslations("corporate");

  return (
    <div>
      <PageHero eyebrow={t("legalEyebrow")} title={t("privacyTitle")} subtitle={t("privacyLead")} />
      <div className="mx-auto max-w-3xl space-y-5 px-6 py-12 text-sm leading-relaxed text-ink-muted">
        <p>{t("privacyBody1")}</p>
        <p>{t("privacyBody2")}</p>
        <p>{t("privacyBody3")}</p>
      </div>
    </div>
  );
}
