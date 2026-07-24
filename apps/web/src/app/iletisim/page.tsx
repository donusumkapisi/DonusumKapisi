import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Mail, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import {
  buildCallUrl,
  buildMailUrl,
  buildWhatsAppUrl,
  CONTACT_EMAIL,
  CONTACT_PHONE,
} from "@/lib/contact";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("corporate");
  return { title: t("contactTitle") };
}

export default async function ContactPage() {
  const t = await getTranslations("corporate");

  return (
    <div>
      <PageHero
        eyebrow={t("contactEyebrow")}
        title={t("contactTitle")}
        subtitle={t("contactLead")}
      />
      <div className="mx-auto max-w-3xl space-y-6 px-6 py-12">
        <p className="text-sm leading-relaxed text-ink-muted">{t("contactBody")}</p>
        <ul className="space-y-4">
          <li>
            <a
              href={buildCallUrl()}
              className="inline-flex items-center gap-3 text-ink transition-colors hover:text-clay"
            >
              <Phone className="size-4 text-clay" />
              {CONTACT_PHONE}
            </a>
          </li>
          <li>
            <a
              href={buildMailUrl(t("contactMailSubject"), t("contactMailBody"))}
              className="inline-flex items-center gap-3 text-ink transition-colors hover:text-clay"
            >
              <Mail className="size-4 text-clay" />
              {CONTACT_EMAIL}
            </a>
          </li>
          <li>
            <a
              href={buildWhatsAppUrl(t("contactWhatsApp"))}
              className="inline-flex items-center gap-3 text-ink transition-colors hover:text-clay"
            >
              WhatsApp
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
