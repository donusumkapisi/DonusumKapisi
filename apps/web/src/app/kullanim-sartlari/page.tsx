import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("corporate");
  return { title: t("termsTitle") };
}

export default async function TermsPage() {
  const t = await getTranslations("corporate");

  return (
    <div>
      <PageHero eyebrow={t("legalEyebrow")} title={t("termsTitle")} subtitle={t("termsLead")} />
      <div className="mx-auto max-w-3xl space-y-5 px-6 py-12 text-sm leading-relaxed text-ink-muted">
        <p>{t("termsBody1")}</p>
        <p>{t("termsBody2")}</p>
        <p>{t("termsBody3")}</p>
      </div>
    </div>
  );
}
