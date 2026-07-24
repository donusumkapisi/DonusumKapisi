import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("corporate");
  return { title: t("kvkkTitle") };
}

export default async function KvkkPage() {
  const t = await getTranslations("corporate");

  return (
    <div>
      <PageHero eyebrow={t("legalEyebrow")} title={t("kvkkTitle")} subtitle={t("kvkkLead")} />
      <div className="mx-auto max-w-3xl space-y-5 px-6 py-12 text-sm leading-relaxed text-ink-muted">
        <p>{t("kvkkBody1")}</p>
        <p>{t("kvkkBody2")}</p>
        <p>{t("kvkkBody3")}</p>
      </div>
    </div>
  );
}
