import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Handshake, ShieldCheck, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { Magnetic } from "@/components/motion/magnetic";
import { ListingCard } from "@/components/listings/listing-card";
import { HeroListingSearch } from "@/components/listings/hero-listing-search";
import { AiPriceEstimate } from "@/components/home/ai-price-estimate";
import { InvestorsHomeTeaser } from "@/components/home/investors-home-teaser";
import { getFeaturedListings } from "@/lib/listings";

export default async function Home() {
  const [featuredListings, t] = await Promise.all([
    getFeaturedListings(6),
    getTranslations("home"),
  ]);

  const roles = [
    {
      icon: Building2,
      title: t("roleHomeownerTitle"),
      body: t("roleHomeownerBody"),
      href: "/ilan-ver",
      cta: t("roleHomeownerCta"),
      variant: "cta-red" as const,
    },
    {
      icon: Handshake,
      title: t("roleContractorTitle"),
      body: t("roleContractorBody"),
      href: "/kayit?rol=muteahhit",
      cta: t("roleContractorCta"),
      variant: "cta-blue" as const,
    },
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
            maskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-[-20%] right-[-10%] size-[40rem] rounded-full bg-clay/[0.14] blur-[120px]"
        />

        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 pt-14 pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pt-20 lg:pb-28">
          <div>
            <FadeIn>
              <p className="font-display text-2xl tracking-tight text-white sm:text-3xl">
                Dönüşüm<span className="text-clay-soft">Kapısı</span>
              </p>
            </FadeIn>

            <FadeIn
              delay={0.06}
              as="h1"
              className="mt-6 max-w-xl font-display text-4xl leading-[1.08] text-balance text-white sm:text-5xl"
            >
              {t("heroTitle")}
            </FadeIn>

            <FadeIn
              delay={0.12}
              as="p"
              className="mt-5 max-w-lg text-base leading-relaxed text-white/65 sm:text-lg"
            >
              {t("heroSubtitle")}
            </FadeIn>

            <FadeIn delay={0.18} className="mt-9 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Button asChild variant="cta-red" size="lg" className="h-12 px-7 text-base">
                  <Link href="/ilan-ver">{t("ctaPostListing")}</Link>
                </Button>
              </Magnetic>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 border-white/20 bg-white/5 px-6 text-[0.95rem] text-white hover:border-white/40 hover:bg-white/10 hover:text-white"
              >
                <Link href="/ilanlar">{t("ctaBrowseListings")}</Link>
              </Button>
            </FadeIn>

            <FadeIn
              delay={0.24}
              className="mt-8 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 sm:max-w-lg"
            >
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-clay-soft" />
              <p className="text-sm leading-relaxed text-white/70">{t("mediationBanner")}</p>
            </FadeIn>
          </div>

          <FadeIn delay={0.14}>
            <HeroListingSearch />
          </FadeIn>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-paper"
          style={{ clipPath: "ellipse(75% 100% at 50% 100%)" }}
        />
      </section>

      <section className="bg-paper">
        <div className="mx-auto grid max-w-6xl gap-4 px-6 py-16 sm:grid-cols-2 sm:py-20">
          {roles.map((role, i) => (
            <FadeIn key={role.title} delay={i * 0.08}>
              <div className="flex h-full flex-col border-l-4 border-clay bg-surface/60 px-6 py-7">
                <role.icon className="size-6 text-clay" />
                <h2 className="mt-4 font-display text-xl text-ink">{role.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{role.body}</p>
                <Button asChild variant={role.variant} className="mt-6 h-10 w-fit px-5">
                  <Link href={role.href}>{role.cta}</Link>
                </Button>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="border-t border-hairline bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <FadeIn>
            <AiPriceEstimate />
          </FadeIn>
        </div>
      </section>

      <section className="border-t border-hairline bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <FadeIn>
              <div>
                <p className="font-mono text-xs tracking-[0.2em] text-clay uppercase">
                  {t("featuredEyebrow")}
                </p>
                <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
                  {t("featuredTitle")}
                </h2>
              </div>
            </FadeIn>
            <FadeIn delay={0.08}>
              <Link
                href="/ilanlar"
                className="text-sm font-medium text-clay underline-offset-4 hover:underline"
              >
                {t("viewAllListings")}
              </Link>
            </FadeIn>
          </div>

          {featuredListings.length > 0 ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredListings.map((listing, i) => (
                <FadeIn key={listing.id} delay={i * 0.05}>
                  <ListingCard
                    listing={listing}
                    variant={i === 0 ? "featured" : "grid"}
                  />
                </FadeIn>
              ))}
            </div>
          ) : (
            <p className="mt-10 text-sm text-ink-muted">{t("noListingsYet")}</p>
          )}
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <FadeIn>
            <p className="font-mono text-xs tracking-[0.2em] text-clay uppercase">
              {t("howItWorksEyebrow")}
            </p>
            <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
              {t("howItWorksTitle")}
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-ink-muted">{t("howItWorksSubtitle")}</p>
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

      <InvestorsHomeTeaser />

      <section className="relative overflow-hidden bg-surface-strong">
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 size-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-clay/[0.1] blur-[120px]"
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 py-20 sm:flex-row sm:items-center sm:justify-between">
          <FadeIn>
            <h2 className="max-w-md font-display text-3xl text-white">{t("finalCtaTitle")}</h2>
            <p className="mt-3 max-w-md text-sm text-white/60">{t("finalCtaSubtitle")}</p>
          </FadeIn>
          <FadeIn delay={0.1} className="flex flex-wrap gap-3">
            <Magnetic>
              <Button asChild variant="cta-red" size="lg" className="h-11 px-6">
                <Link href="/ilan-ver">{t("finalCtaButton")}</Link>
              </Button>
            </Magnetic>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 border-white/20 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/kayit?rol=muteahhit">{t("finalCtaContractor")}</Link>
            </Button>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
