"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import type { MonthlyTrendBucket } from "@/lib/analytics";

export function TrendChart({ trends }: { trends: MonthlyTrendBucket[] }) {
  const t = useTranslations("panel");
  const maxValue = Math.max(1, ...trends.map((t) => Math.max(t.listings, t.offers)));

  return (
    <div>
      <div className="flex items-end justify-between gap-3 rounded-2xl border border-hairline bg-paper p-6 shadow-[0_1px_2px_rgb(22_52_73_/_0.04)]">
        {trends.map((bucket, index) => (
          <div key={bucket.key} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-32 items-end gap-1.5">
              <motion.div
                className="w-3.5 rounded-full bg-gradient-to-t from-clay to-clay-soft"
                initial={{ height: 0 }}
                animate={{ height: `${(bucket.listings / maxValue) * 100}%` }}
                transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                title={t("trendChartListingsTitle", { n: bucket.listings })}
              />
              <motion.div
                className="w-3.5 rounded-full bg-gradient-to-t from-warning to-warning-soft"
                initial={{ height: 0 }}
                animate={{ height: `${(bucket.offers / maxValue) * 100}%` }}
                transition={{ duration: 0.6, delay: index * 0.05 + 0.05, ease: [0.16, 1, 0.3, 1] }}
                title={t("trendChartOffersTitle", { n: bucket.offers })}
              />
            </div>
            <span className="text-[11px] font-medium text-ink-muted">{bucket.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-ink-muted">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-clay" /> {t("trendChartListingsLabel")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-warning" /> {t("trendChartOffersLabel")}
        </span>
      </div>
    </div>
  );
}
