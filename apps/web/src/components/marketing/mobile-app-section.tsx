import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Apple, BatteryFull, Bell, FileText, LineChart, PlayCircle, SignalHigh, Wifi } from "lucide-react";
import { ThresholdMark } from "@/components/brand/threshold-mark";
import { FadeIn } from "@/components/motion/fade-in";

/**
 * Uygulama henüz mağazalarda yayında değil; rozetler bilinçli olarak
 * anasayfaya (`/`) yönlendiriyor, gerçek bir mağaza hedefine değil.
 */
export async function MobileAppSection() {
  const t = await getTranslations("mobileApp");

  const appFeatures = [
    { icon: Bell, label: t("feature1") },
    { icon: FileText, label: t("feature2") },
    { icon: LineChart, label: t("feature3") },
  ];

  return (
    <section className="bg-paper">
      <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 py-24 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <FadeIn>
            <span className="inline-flex items-center rounded-full bg-clay px-3 py-1 font-mono text-xs tracking-[0.15em] text-white uppercase">
              {t("badge")}
            </span>
          </FadeIn>
          <FadeIn delay={0.08} as="h2" className="mt-5 font-display text-3xl text-ink sm:text-4xl">
            {t("title")}
          </FadeIn>
          <FadeIn delay={0.16} as="p" className="mt-4 max-w-lg text-base leading-relaxed text-ink-muted">
            {t("description")}
          </FadeIn>

          <FadeIn delay={0.22} className="mt-7 flex flex-wrap gap-3">
            {appFeatures.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-2 rounded-full border border-hairline bg-surface/60 px-3 py-1.5 text-sm text-ink"
              >
                <Icon className="size-4 text-clay" />
                {label}
              </span>
            ))}
          </FadeIn>

          <FadeIn delay={0.3} className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-xl bg-ink px-4 py-2.5 text-white transition-colors hover:bg-surface-strong"
            >
              <Apple className="size-6 shrink-0" />
              <span className="leading-none">
                <span className="block text-[0.6rem] text-white/70">{t("downloadLabel")}</span>
                <span className="block text-sm font-medium">App Store</span>
              </span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-xl bg-ink px-4 py-2.5 text-white transition-colors hover:bg-surface-strong"
            >
              <PlayCircle className="size-6 shrink-0" />
              <span className="leading-none">
                <span className="block text-[0.6rem] text-white/70">{t("downloadLabel")}</span>
                <span className="block text-sm font-medium">Google Play</span>
              </span>
            </Link>
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <PhoneMockup />
        </FadeIn>
      </div>
    </section>
  );
}

async function PhoneMockup() {
  const t = await getTranslations("mobileApp");

  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 scale-90 rounded-[3.5rem] bg-clay/15 blur-3xl"
      />

      {/* Gövde */}
      <div className="relative rounded-[3rem] bg-ink p-2 shadow-[0_40px_70px_-20px_rgb(22_52_73_/_0.45)]">
        {/* Yan tuşlar */}
        <span aria-hidden className="absolute top-[92px] -left-[3px] h-7 w-[3px] rounded-l-sm bg-white/15" />
        <span aria-hidden className="absolute top-[140px] -left-[3px] h-10 w-[3px] rounded-l-sm bg-white/15" />
        <span aria-hidden className="absolute top-[188px] -left-[3px] h-10 w-[3px] rounded-l-sm bg-white/15" />
        <span aria-hidden className="absolute top-[128px] -right-[3px] h-16 w-[3px] rounded-r-sm bg-white/15" />

        {/* Ekran */}
        <div className="relative overflow-hidden rounded-[2.4rem] bg-paper">
          <div
            aria-hidden
            className="absolute top-2.5 left-1/2 z-10 h-6 w-[6.5rem] -translate-x-1/2 rounded-full bg-black"
          />

          <div className="bg-surface-strong px-6 pt-4 pb-10 text-white">
            <div className="flex items-center justify-between text-[0.7rem] font-medium">
              <span>9:41</span>
              <div className="flex items-center gap-1 text-white/90">
                <SignalHigh className="size-3.5" />
                <Wifi className="size-3.5" />
                <BatteryFull className="size-4" />
              </div>
            </div>
            <div className="mt-9 flex flex-col items-center">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-paper shadow-lg shadow-black/20">
                <ThresholdMark className="size-6 text-surface-strong" />
              </span>
              <p className="mt-2.5 font-display text-base">DönüşümKapısı</p>
              <p className="text-[0.65rem] text-white/60">{t("mockupTagline")}</p>
            </div>
          </div>

          <div className="space-y-3 bg-surface/50 px-4 py-5">
            <div className="rounded-2xl border border-hairline bg-paper p-3.5 shadow-[0_6px_16px_-10px_rgb(22_52_73_/_0.25)]">
              <div className="flex items-center gap-1.5 text-xs font-medium text-ink">
                <span className="size-1.5 rounded-full bg-clay" />
                {t("newRequestLabel")}
              </div>
              <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-surface">
                <div className="h-full w-2/3 rounded-full bg-clay" />
              </div>
              <p className="mt-1.5 text-[0.65rem] text-ink-muted">{t("reviewingStatus")}</p>
            </div>

            <div className="rounded-2xl border border-hairline bg-paper p-3.5 shadow-[0_6px_16px_-10px_rgb(22_52_73_/_0.25)]">
              <div className="flex items-center gap-1.5 text-xs font-medium text-ink">
                <span className="size-1.5 rounded-full bg-warning" />
                {t("newOffersLabel", { n: 2 })}
              </div>
              <p className="mt-1.5 text-[0.65rem] text-clay">{t("compareOffersStatus")}</p>
            </div>
          </div>

          <div className="flex justify-center bg-surface/50 pb-2">
            <span aria-hidden className="h-1 w-28 rounded-full bg-ink/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
