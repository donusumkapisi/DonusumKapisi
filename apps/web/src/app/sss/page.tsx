import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("faq");
  return { title: t("metaTitle") };
}

export default async function FaqPage() {
  const t = await getTranslations("faq");

  const steps = [1, 2, 3, 4, 5, 6, 7].map((n) =>
    t(`cat2Step${n}` as "cat2Step1"),
  );

  const categories: { title: string; items: { q: string; a: ReactNode }[] }[] = [
    {
      title: t("cat1Title"),
      items: [
        { q: t("cat1q1"), a: t("cat1a1") },
        { q: t("cat1q2"), a: t("cat1a2") },
        { q: t("cat1q3"), a: t("cat1a3") },
      ],
    },
    {
      title: t("cat2Title"),
      items: [
        {
          q: t("cat2q1"),
          a: (
            <ol className="list-decimal space-y-1 pl-4">
              {steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          ),
        },
        { q: t("cat2q2"), a: t("cat2a2") },
        { q: t("cat2q3"), a: t("cat2a3") },
      ],
    },
    {
      title: t("cat3Title"),
      items: [
        { q: t("cat3q1"), a: t("cat3a1") },
        { q: t("cat3q2"), a: t("cat3a2") },
      ],
    },
    {
      title: t("cat4Title"),
      items: [
        { q: t("cat4q1"), a: t("cat4a1") },
        { q: t("cat4q2"), a: t("cat4a2") },
        { q: t("cat4q3"), a: t("cat4a3") },
      ],
    },
    {
      title: t("cat5Title"),
      items: [
        { q: t("cat5q1"), a: t("cat5a1") },
        {
          q: t("cat5q2"),
          a: (
            <>
              <Link href="/iletisim" className="text-clay underline underline-offset-4">
                {t("cat5a2LinkText")}
              </Link>{" "}
              {t("cat5a2After")}
            </>
          ),
        },
        { q: t("cat5q3"), a: t("cat5a3") },
        { q: t("cat5q4"), a: t("cat5a4") },
        { q: t("cat5q5"), a: t("cat5a5") },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-mono text-xs tracking-[0.2em] text-clay uppercase">
        {t("eyebrow")}
      </p>
      <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
        {t("pageTitle")}
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
        {t("introBefore")}{" "}
        <Link href="/iletisim" className="text-clay underline underline-offset-4">
          {t("introLinkText")}
        </Link>
        {t("introAfter")}
      </p>

      <div className="mt-12 space-y-12">
        {categories.map((category) => (
          <section key={category.title}>
            <h2 className="font-display text-xl text-ink">{category.title}</h2>
            <Accordion type="single" collapsible className="mt-4">
              {category.items.map((item) => (
                <AccordionItem key={item.q} value={item.q} className="border-hairline">
                  <AccordionTrigger className="text-ink hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-ink-muted">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}
      </div>
    </div>
  );
}
