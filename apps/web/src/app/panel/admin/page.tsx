import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock,
  FileStack,
  Flame,
  Handshake,
  MessagesSquare,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { StatCard } from "@/components/panel/stat-card";
import { PanelEmptyState } from "@/components/panel/panel-empty-state";
import { AdminCard, AdminPageHeader, StatusPill } from "@/components/admin/admin-ui";
import { AdminListingRow } from "@/components/admin/admin-listing-row";
import { getAdminActivity, getAdminListings, getAdminMessages, getAdminQueueCounts } from "@/lib/admin";
import { getPlatformStats } from "@/lib/analytics";
import { formatPriceRange } from "@/lib/format";
import type { AdminActivity } from "@/lib/admin";

const activityIcons = {
  listing: Building2,
  offer: Handshake,
  user: UserPlus,
  verification: ShieldCheck,
} as const;

export default async function AdminOverviewPage() {
  const [stats, counts, pendingListings, openMessages, activity, t, format] = await Promise.all([
    getPlatformStats(),
    getAdminQueueCounts(),
    getAdminListings({ status: "PENDING" }),
    getAdminMessages("OPEN"),
    getAdminActivity(8),
    getTranslations("panelAdmin"),
    getFormatter(),
  ]);

  const queueTotal = counts.listings + counts.messages + counts.verifications;

  function activityLabel(item: AdminActivity) {
    if (item.kind !== "user") return item.subtitle;
    return t(`role.${item.subtitle}`);
  }

  return (
    <div className="space-y-10">
      <FadeIn>
        <AdminPageHeader
          title={t("overviewTitle")}
          description={queueTotal > 0 ? t("overviewQueue", { count: queueTotal }) : t("overviewClear")}
        />
      </FadeIn>

      <FadeIn delay={0.05} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard icon={Clock} label={t("statPendingListings")} value={counts.listings} />
        <StatCard icon={MessagesSquare} label={t("statPendingContact")} value={counts.messages} />
        <StatCard icon={ShieldCheck} label={t("statPendingVerification")} value={counts.verifications} />
        <StatCard icon={CheckCircle2} label={t("statLiveListings")} value={stats.approvedListings} />
        <StatCard icon={FileStack} label={t("statTotalOffers")} value={stats.totalOffers} />
        <StatCard icon={Flame} label={t("statInterestedOffers")} value={stats.interestedOffers} />
      </FadeIn>

      <FadeIn delay={0.1}>
        <AdminPageHeader
          title={t("pendingListingsTitle")}
          description={t("pendingListingsSubtitle")}
          action={
            <Link
              href="/panel/admin/ilanlar"
              className="inline-flex items-center gap-1 text-sm text-clay hover:underline"
            >
              {t("seeAllListings")}
              <ArrowUpRight className="size-3.5" />
            </Link>
          }
        />

        {pendingListings.length === 0 ? (
          <PanelEmptyState
            icon={CheckCircle2}
            title={t("pendingListingsEmptyTitle")}
            subtitle={t("pendingListingsEmptySubtitle")}
          />
        ) : (
          <div className="mt-4 space-y-3">
            {pendingListings.slice(0, 5).map((listing) => (
              <AdminListingRow key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </FadeIn>

      <FadeIn delay={0.12}>
        <AdminPageHeader
          title={t("openMessagesTitle")}
          description={t("openMessagesSubtitle")}
          action={
            <Link
              href="/panel/admin/mesajlar"
              className="inline-flex items-center gap-1 text-sm text-clay hover:underline"
            >
              {t("seeAllMessages")}
              <ArrowUpRight className="size-3.5" />
            </Link>
          }
        />

        {openMessages.length === 0 ? (
          <PanelEmptyState
            icon={MessagesSquare}
            title={t("contactQueueEmptyTitle")}
            subtitle={t("contactQueueEmptySubtitle")}
          />
        ) : (
          <div className="mt-4 space-y-3">
            {openMessages.slice(0, 3).map((offer) => (
              <AdminCard key={offer.id} className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-ink-muted">
                    #{offer.listing.listingNumber} · {formatPriceRange(offer.priceMin, offer.priceMax)}
                  </p>
                  <Link
                    href={`/panel/admin/ilanlar/${offer.listing.listingNumber}`}
                    className="mt-0.5 block truncate font-display text-base text-ink hover:text-clay"
                  >
                    {offer.listing.title}
                  </Link>
                  <p className="mt-1 truncate text-xs text-ink-muted">
                    {t("partiesLabel", {
                      owner: offer.listing.owner.name ?? offer.listing.owner.email,
                      contractor: offer.contractor.name ?? offer.contractor.email,
                    })}
                  </p>
                </div>
                <StatusPill tone="pending">{t("needsContact")}</StatusPill>
              </AdminCard>
            ))}
          </div>
        )}
      </FadeIn>

      <FadeIn delay={0.15}>
        <AdminPageHeader title={t("activityTitle")} description={t("activitySubtitle")} />

        {activity.length === 0 ? (
          <PanelEmptyState
            icon={Clock}
            title={t("activityEmptyTitle")}
            subtitle={t("activityEmptySubtitle")}
          />
        ) : (
        <AdminCard className="mt-4 p-0">
          <ul className="divide-y divide-hairline">
            {activity.map((item) => {
              const Icon = activityIcons[item.kind];
              return (
                <li key={item.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface">
                    <Icon className="size-4 text-clay" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-ink">
                      <span className="text-ink-muted">{t(`activity.${item.kind}`)} · </span>
                      {item.href ? (
                        <Link href={item.href} className="hover:text-clay">
                          {item.title}
                        </Link>
                      ) : (
                        item.title
                      )}
                    </p>
                    <p className="truncate text-xs text-ink-muted">{activityLabel(item)}</p>
                  </div>
                  <time className="shrink-0 text-xs text-ink-muted" dateTime={item.at.toISOString()}>
                    {format.relativeTime(item.at)}
                  </time>
                </li>
              );
            })}
          </ul>
        </AdminCard>
        )}
      </FadeIn>
    </div>
  );
}
