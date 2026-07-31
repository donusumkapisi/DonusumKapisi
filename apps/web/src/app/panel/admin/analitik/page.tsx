import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/motion/fade-in";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { StatCard } from "@/components/panel/stat-card";
import { TrendChart } from "@/components/panel/trend-chart";
import { getMonthlyTrends, getPlatformStats, getTopContractors } from "@/lib/analytics";
import {
  Building2,
  CheckCircle2,
  Clock,
  FileStack,
  Flame,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

export default async function AdminAnalyticsPage() {
  const [stats, topContractors, trends, t, tPanel] = await Promise.all([
    getPlatformStats(),
    getTopContractors(5),
    getMonthlyTrends(6),
    getTranslations("panelAnalytics"),
    getTranslations("panel"),
  ]);

  return (
    <div className="space-y-6">
      <FadeIn>
        <AdminPageHeader title={t("title")} description={t("subtitle")} />
      </FadeIn>

      <FadeIn delay={0.05} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Building2} label={t("statTotalListings")} value={stats.totalListings} />
        <StatCard icon={CheckCircle2} label={t("statLive")} value={stats.approvedListings} />
        <StatCard icon={Clock} label={t("statPending")} value={stats.pendingListings} />
        <StatCard icon={FileStack} label={t("statTotalOffers")} value={stats.totalOffers} />
        <StatCard icon={Flame} label={t("statInterestedOffers")} value={stats.interestedOffers} />
        <StatCard icon={TrendingUp} label={t("statConversionRate")} value={t("statConversionValue", { value: stats.conversionRate.toFixed(1) })} />
        <StatCard icon={Users} label={t("statContractorCount")} value={stats.totalContractors} />
        <StatCard icon={ShieldCheck} label={t("statVerified")} value={stats.verifiedContractors} />
      </FadeIn>

      <FadeIn delay={0.1} className="pt-4">
        <h3 className="font-display text-lg text-ink">{t("topContractorsTitle")}</h3>
        {topContractors.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted">{t("topContractorsEmpty")}</p>
        ) : (
          <div className="mt-4 space-y-2">
            {topContractors.map((contractor, index) => (
              <SpotlightCard
                key={contractor.contractorId}
                className="flex items-center justify-between gap-3 p-3.5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface font-mono text-xs font-semibold text-ink-muted">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-ink">
                    {contractor.name ?? tPanel("unnamedContractor")}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-sm text-ink-muted">
                  <Star className="size-3.5 fill-highlight text-highlight" />
                  {contractor.averageRating?.toFixed(1)} ({contractor.reviewCount})
                </span>
              </SpotlightCard>
            ))}
          </div>
        )}
      </FadeIn>

      <FadeIn delay={0.15} className="pt-4">
        <h3 className="font-display text-lg text-ink">{t("monthlyTrendTitle")}</h3>
        <div className="mt-4">
          <TrendChart trends={trends} />
        </div>
      </FadeIn>
    </div>
  );
}
