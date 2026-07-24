import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Building2, DoorOpen, LandPlot, MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";

export async function InvestorsHomeTeaser() {
  const t = await getTranslations("investors");

  const cards = [
    { icon: LandPlot, title: t("opp1Title"), body: t("homeCard1Body") },
    { icon: DoorOpen, title: t("opp4Title"), body: t("homeCard4Body") },
    { icon: Building2, title: t("opp2Title"), body: t("homeCard2Body") },
    { icon: MapPinned, title: t("opp3Title"), body: t("homeCard3Body") },
  ];

  return (
    <section className="border-t border-hairline bg-surface/50">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <FadeIn>
            <p className="font-mono text-xs tracking-[0.2em] text-clay uppercase">
              {t("homeEyebrow")}
            </p>
            <h2 className="mt-2 max-w-xl font-display text-3xl text-ink sm:text-4xl">
              {t("homeTitle")}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
              {t("homeSubtitle")}
            </p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <Button asChild variant="cta-blue" className="h-11 px-5">
              <Link href="/yatirimcilar">{t("homeCta")}</Link>
            </Button>
          </FadeIn>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon: Icon, title, body }, i) => (
            <FadeIn key={title} delay={i * 0.06}>
              <div className="h-full border-l-4 border-clay bg-paper px-5 py-6">
                <Icon className="size-5 text-clay" />
                <h3 className="mt-4 font-display text-lg text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
