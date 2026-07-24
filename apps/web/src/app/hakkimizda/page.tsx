import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("corporate");
  return { title: t("aboutTitle") };
}

export default async function AboutPage() {
  const t = await getTranslations("corporate");

  return (
    <div>
      <PageHero eyebrow={t("aboutEyebrow")} title={t("aboutTitle")} subtitle={t("aboutLead")} />
      <div className="mx-auto max-w-3xl space-y-6 px-6 py-12 text-sm leading-relaxed text-ink-muted">
        <p>{t("aboutBody1")}</p>
        <p>{t("aboutBody2")}</p>
        <p>{t("aboutBody3")}</p>
      </div>
    </div>
  );
}
