import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Building2,
  DoorOpen,
  Globe2,
  Handshake,
  LandPlot,
  MapPinned,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { Magnetic } from "@/components/motion/magnetic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("investors");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function InvestorsPage() {
  const t = await getTranslations("investors");

  const opportunities = [
    {
      icon: LandPlot,
      title: t("opp1Title"),
      tag: t("opp1Tag"),
      body: t("opp1Body"),
      href: "/ilanlar",
      cta: t("opp1Cta"),
    },
    {
      icon: DoorOpen,
      title: t("opp4Title"),
      tag: t("opp4Tag"),
      body: t("opp4Body"),
      href: "/ilanlar",
      cta: t("opp4Cta"),
    },
    {
      icon: Building2,
      title: t("opp2Title"),
      tag: t("opp2Tag"),
      body: t("opp2Body"),
      href: "/ilanlar",
      cta: t("opp2Cta"),
    },
    {
      icon: MapPinned,
      title: t("opp3Title"),
      tag: t("opp3Tag"),
      body: t("opp3Body"),
      href: "/ilanlar",
      cta: t("opp3Cta"),
    },
  ];

  const reasons = [
    { icon: Globe2, title: t("why1Title"), body: t("why1Body") },
    { icon: ShieldCheck, title: t("why2Title"), body: t("why2Body") },
    { icon: Handshake, title: t("why3Title"), body: t("why3Body") },
  ];

  const steps = [
    { n: "01", title: t("step1Title"), body: t("step1Body") },
    { n: "02", title: t("step2Title"), body: t("step2Body") },
    { n: "03", title: t("step3Title"), body: t("step3Body") },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-surface-strong">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 75% 65% at 50% 35%, black, transparent)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-[-15%] right-[-8%] size-[36rem] rounded-full bg-clay/[0.16] blur-[120px]"
        />

        <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <FadeIn>
            <p className="font-mono text-xs tracking-[0.22em] text-clay-soft uppercase">
              {t("heroEyebrow")}
            </p>
          </FadeIn>
          <FadeIn
            delay={0.06}
            as="h1"
            className="mt-5 max-w-3xl font-display text-4xl leading-[1.08] text-balance text-white sm:text-5xl lg:text-6xl"
          >
            {t("heroTitle")}
          </FadeIn>
          <FadeIn
            delay={0.12}
            as="p"
            className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg"
          >
            {t("heroSubtitle")}
          </FadeIn>
          <FadeIn delay={0.18} className="mt-9 flex flex-wrap gap-3">
            <Magnetic>
              <Button asChild variant="cta-red" size="lg" className="h-12 px-7 text-base">
                <Link href="/ilanlar">{t("heroCtaListings")}</Link>
              </Button>
            </Magnetic>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 border-white/20 bg-white/5 px-6 text-white hover:border-white/40 hover:bg-white/10 hover:text-white"
            >
              <Link href="/iletisim">{t("heroCtaContact")}</Link>
            </Button>
          </FadeIn>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-paper"
          style={{ clipPath: "ellipse(75% 100% at 50% 100%)" }}
        />
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <FadeIn>
            <p className="font-mono text-xs tracking-[0.2em] text-clay uppercase">
              {t("opportunitiesEyebrow")}
            </p>
            <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
              {t("opportunitiesTitle")}
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-ink-muted">{t("opportunitiesSubtitle")}</p>
          </FadeIn>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {opportunities.map(({ icon: Icon, title, tag, body, href, cta }, i) => (
              <FadeIn key={title} delay={i * 0.08}>
                <article className="flex h-full flex-col border-t-2 border-clay bg-surface/50 px-6 py-7">
                  <Icon className="size-6 text-clay" />
                  <h3 className="mt-5 font-display text-xl text-ink">{title}</h3>
                  <p className="mt-1.5 font-mono text-[0.7rem] tracking-[0.18em] text-clay uppercase">
                    {tag}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{body}</p>
                  <Link
                    href={href}
                    className="mt-6 text-sm font-medium text-clay underline-offset-4 hover:underline"
                  >
                    {cta}
                  </Link>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-hairline bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <FadeIn>
            <h2 className="font-display text-3xl text-ink sm:text-4xl">{t("whyTitle")}</h2>
          </FadeIn>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {reasons.map(({ icon: Icon, title, body }, i) => (
              <FadeIn key={title} delay={i * 0.08}>
                <div>
                  <span className="flex size-10 items-center justify-center rounded-xl bg-clay/15 text-clay">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-display text-lg text-ink">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <FadeIn>
            <p className="font-mono text-xs tracking-[0.2em] text-clay uppercase">
              {t("howEyebrow")}
            </p>
            <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">{t("howTitle")}</h2>
          </FadeIn>
          <ol className="mt-12 grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <FadeIn key={step.n} delay={i * 0.08}>
                <li className="list-none">
                  <span className="font-mono text-sm text-clay">{step.n}</span>
                  <h3 className="mt-3 font-display text-xl text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.body}</p>
                </li>
              </FadeIn>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative overflow-hidden bg-surface-strong">
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-clay/[0.12] blur-[110px]"
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 py-20 sm:flex-row sm:items-center sm:justify-between">
          <FadeIn>
            <h2 className="max-w-lg font-display text-3xl text-white">{t("finalTitle")}</h2>
            <p className="mt-3 max-w-md text-sm text-white/60">{t("finalSubtitle")}</p>
          </FadeIn>
          <FadeIn delay={0.1} className="flex flex-wrap gap-3">
            <Magnetic>
              <Button asChild variant="cta-red" size="lg" className="h-11 px-6">
                <Link href="/ilanlar">{t("finalCtaListings")}</Link>
              </Button>
            </Magnetic>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 border-white/20 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/iletisim">{t("finalCtaContact")}</Link>
            </Button>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
