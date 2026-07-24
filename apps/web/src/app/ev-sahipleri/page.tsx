import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Banknote, HelpCircle, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { Magnetic } from "@/components/motion/magnetic";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("homeowners");
  return { title: t("metaTitle") };
}

export default async function HomeownersPage() {
  const t = await getTranslations("homeowners");

  const painPoints = [
    { icon: ShieldCheck, title: t("pain1Title"), body: t("pain1Body") },
    { icon: Users, title: t("pain2Title"), body: t("pain2Body") },
    { icon: Banknote, title: t("pain3Title"), body: t("pain3Body") },
    { icon: HelpCircle, title: t("pain4Title"), body: t("pain4Body") },
  ];

  const steps = [
    { n: "01", title: t("step1Title"), body: t("step1Body") },
    { n: "02", title: t("step2Title"), body: t("step2Body") },
    { n: "03", title: t("step3Title"), body: t("step3Body") },
  ];

  const processSteps = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
    title: t(`process${n}Title` as "process1Title"),
    body: t(`process${n}Body` as "process1Body"),
  }));

  return (
    <>
      <section className="relative overflow-hidden border-b border-hairline">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 size-[32rem] rounded-full bg-danger/[0.07] blur-[120px]"
        />
        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center">
          <FadeIn>
            <p className="font-mono text-xs tracking-[0.25em] text-danger uppercase">
              {t("heroEyebrow")}
            </p>
          </FadeIn>
          <FadeIn delay={0.08} as="h1" className="mt-5 font-display text-4xl leading-[1.1] text-ink sm:text-5xl">
            {t("heroTitle")}
          </FadeIn>
          <FadeIn delay={0.16} as="p" className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-muted">
            {t("heroSubtitle")}
          </FadeIn>
          <FadeIn delay={0.24} className="mt-9">
            <Magnetic>
              <Button asChild variant="cta-red" size="lg" className="h-12 px-7 text-base">
                <Link href="/ilan-ver">{t("heroCta")}</Link>
              </Button>
            </Magnetic>
          </FadeIn>
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <FadeIn>
            <h2 className="font-display text-3xl text-ink sm:text-4xl">
              {t("painPointsTitle")}
            </h2>
          </FadeIn>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {painPoints.map(({ icon: Icon, title, body }, i) => (
              <FadeIn key={title} delay={i * 0.08}>
                <SpotlightCard className="h-full p-7">
                  <Icon className="size-5 text-danger" />
                  <h3 className="mt-4 font-display text-xl text-ink">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{body}</p>
                </SpotlightCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <FadeIn>
            <h2 className="font-display text-3xl text-ink sm:text-4xl">
              {t("howTitle")}
            </h2>
          </FadeIn>
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {steps.map((step, i) => (
              <FadeIn key={step.n} delay={i * 0.1}>
                <span className="font-mono text-sm text-danger">{step.n}</span>
                <h3 className="mt-3 font-display text-lg text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.body}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Genel bilgilendirme: platform kullanım akışımızla karışmaması için
          ayrı, daha sade bir bölümde ve daraltılabilir liste olarak sunulur. */}
      <section className="border-t border-hairline bg-surface">
        <div className="mx-auto max-w-3xl px-6 py-24">
          <FadeIn>
            <p className="font-mono text-xs tracking-[0.2em] text-ink-muted uppercase">
              {t("generalInfoEyebrow")}
            </p>
            <h2 className="mt-3 font-display text-2xl text-ink sm:text-3xl">
              {t("generalInfoTitle")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              {t("generalInfoBody")}
            </p>
          </FadeIn>

          <FadeIn delay={0.1} className="mt-8">
            <Accordion type="single" collapsible>
              {processSteps.map((step, i) => (
                <AccordionItem key={step.title} value={step.title} className="border-hairline">
                  <AccordionTrigger className="text-ink hover:no-underline">
                    <span className="font-mono text-xs text-ink-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="ml-3">{step.title}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pl-9 text-ink-muted">{step.body}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="mt-6 text-sm text-ink-muted">
              {t("moreInfoBefore")}{" "}
              <Link href="/sss" className="text-clay underline underline-offset-4">
                {t("moreInfoLink")}
              </Link>{" "}
              {t("moreInfoAfter")}
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="relative overflow-hidden bg-surface-strong">
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-danger/[0.08] blur-[140px]"
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 py-24 sm:flex-row sm:items-center sm:justify-between">
          <FadeIn>
            <h2 className="max-w-md font-display text-3xl text-white">
              {t("finalCtaTitle")}
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Magnetic>
              <Button asChild variant="cta-red" size="lg" className="h-11 shrink-0 px-6 text-[0.95rem]">
                <Link href="/ilan-ver">{t("finalCtaButton")}</Link>
              </Button>
            </Magnetic>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
