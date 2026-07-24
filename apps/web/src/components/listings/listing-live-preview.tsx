"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

const priceFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

export function ListingLivePreview({
  title,
  province,
  district,
  squareMeters,
  floorCount,
  unitCount,
  priceMin,
  priceMax,
  photoPreview,
}: {
  title: string;
  province: string;
  district: string;
  squareMeters: string;
  floorCount: string;
  unitCount: string;
  priceMin: string;
  priceMax: string;
  photoPreview?: string;
}) {
  const t = useTranslations("listingWizard");
  const hasLocation = province || district;
  const hasPrice = Number(priceMin) > 0 && Number(priceMax) > 0;

  return (
    <div className="lg:sticky lg:top-24">
      <p className="font-mono text-[0.65rem] tracking-[0.2em] text-on-strong/40 uppercase">
        {t("livePreviewEyebrow")}
      </p>
      <p className="mt-1 text-xs text-on-strong/50">
        {t("livePreviewSubtitle")}
      </p>

      <div className="mt-4 overflow-hidden rounded-2xl border border-hairline-invert bg-paper shadow-2xl shadow-black/40">
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-petrol/25 via-surface to-clay/20">
          {photoPreview ? (
            <Image src={photoPreview} alt={title || t("livePreviewImageAlt")} fill unoptimized className="object-cover" />
          ) : (
            <div
              aria-hidden
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, var(--hairline) 0, var(--hairline) 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, var(--hairline) 0, var(--hairline) 1px, transparent 1px, transparent 20px)",
              }}
            />
          )}
          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 font-mono text-[0.65rem] text-ink-muted">
            {t("livePreviewNewBadge")}
          </span>
        </div>

        <div className="p-6">
          <p className="font-mono text-xs tracking-wide text-clay uppercase">
            {hasLocation ? [district, province].filter(Boolean).join(", ") : t("livePreviewNoLocation")}
          </p>
          <motion.h3
            key={title}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            className="mt-2 min-h-14 font-display text-xl leading-snug text-ink"
          >
            {title || t("livePreviewTitlePlaceholder")}
          </motion.h3>

          <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-hairline pt-4 font-mono text-xs text-ink-muted">
            <div>
              <dt className="text-[0.65rem] text-ink-muted/70 uppercase">{t("livePreviewSquareMeters")}</dt>
              <dd className="mt-0.5 text-sm text-ink">{squareMeters || "—"}</dd>
            </div>
            <div>
              <dt className="text-[0.65rem] text-ink-muted/70 uppercase">{t("livePreviewFloor")}</dt>
              <dd className="mt-0.5 text-sm text-ink">{floorCount || "—"}</dd>
            </div>
            <div>
              <dt className="text-[0.65rem] text-ink-muted/70 uppercase">{t("livePreviewUnit")}</dt>
              <dd className="mt-0.5 text-sm text-ink">{unitCount || "—"}</dd>
            </div>
          </dl>

          <p className="mt-4 text-base font-medium text-ink">
            {hasPrice
              ? `${priceFormatter.format(Number(priceMin))} – ${priceFormatter.format(Number(priceMax))}`
              : t("livePreviewNoPrice")}
          </p>
        </div>
      </div>
    </div>
  );
}
