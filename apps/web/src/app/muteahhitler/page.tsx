import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { FileCheck2, MessagesSquare, ShieldCheck, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { Magnetic } from "@/components/motion/magnetic";
import { SpotlightCard } from "@/components/motion/spotlight-card";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contractors");
  return { title: t("metaTitle") };
}

export default async function ContractorsPage() {
  const t = await getTranslations("contractors");

  const valueProps = [
    { icon: FileCheck2, title: t("value1Title"), body: t("value1Body") },
    { icon: Timer, title: t("value2Title"), body: t("value2Body") },
    { icon: ShieldCheck, title: t("value3Title"), body: t("value3Body") },
    { icon: MessagesSquare, title: t("value4Title"), body: t("value4Body") },
  ];

  const steps = [
    { n: "01", title: t("step1Title"), body: t("step1Body") },
    { n: "02", title: t("step2Title"), body: t("step2Body") },
    { n: "03", title: t("step3Title"), body: t("step3Body") },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-hairline">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 size-[32rem] rounded-full bg-info/[0.08] blur-[120px]"
        />
        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center">
          <FadeIn>
            <p className="font-mono text-xs tracking-[0.25em] text-info uppercase">
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
              <Button asChild variant="cta-blue" size="lg" className="h-12 px-7 text-base">
                <Link href="/kayit?rol=muteahhit">{t("heroCta")}</Link>
              </Button>
            </Magnetic>
          </FadeIn>
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <FadeIn>
            <h2 className="font-display text-3xl text-ink sm:text-4xl">
              {t("whyTitle")}
            </h2>
          </FadeIn>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {valueProps.map(({ icon: Icon, title, body }, i) => (
              <FadeIn key={title} delay={i * 0.08}>
                <SpotlightCard className="h-full p-7">
                  <Icon className="size-5 text-info" />
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
                <span className="font-mono text-sm text-info">{step.n}</span>
                <h3 className="mt-3 font-display text-lg text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.body}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-surface-strong">
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-info/[0.1] blur-[140px]"
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 py-24 sm:flex-row sm:items-center sm:justify-between">
          <FadeIn>
            <h2 className="max-w-md font-display text-3xl text-on-strong">
              {t("finalCtaTitle")}
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Magnetic>
              <Button asChild variant="cta-blue" size="lg" className="h-11 shrink-0 px-6 text-[0.95rem]">
                <Link href="/kayit?rol=muteahhit">{t("finalCtaButton")}</Link>
              </Button>
            </Magnetic>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
