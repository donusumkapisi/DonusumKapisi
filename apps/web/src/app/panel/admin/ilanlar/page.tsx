import { getTranslations } from "next-intl/server";
import type { ListingStatus } from "@donusum-kapisi/db";
import { Building2 } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { PanelEmptyState } from "@/components/panel/panel-empty-state";
import { AdminPageHeader, FilterTabs, SearchField, type FilterTab } from "@/components/admin/admin-ui";
import { AdminListingRow } from "@/components/admin/admin-listing-row";
import { getAdminListings, getListingStatusCounts } from "@/lib/admin";

const STATUSES = ["PENDING", "APPROVED", "REJECTED", "CLOSED"] as const;

function parseStatus(value: string | undefined): ListingStatus | undefined {
  return STATUSES.find((status) => status === value);
}

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ durum?: string; q?: string }>;
}) {
  const { durum, q } = await searchParams;
  const status = parseStatus(durum);
  const query = q?.trim() || undefined;

  const [listings, counts, t] = await Promise.all([
    getAdminListings({ status, q: query }),
    getListingStatusCounts(),
    getTranslations("panelAdmin"),
  ]);

  const tabs: FilterTab[] = [
    { value: "ALL", label: t("filterAll"), count: counts.ALL, href: "/panel/admin/ilanlar" },
    ...STATUSES.map((value) => ({
      value,
      label: t(`listingStatus.${value}`),
      count: counts[value],
      href: `/panel/admin/ilanlar?durum=${value}`,
    })),
  ];

  return (
    <div className="space-y-6">
      <FadeIn>
        <AdminPageHeader title={t("listingsTitle")} description={t("listingsSubtitle")} />
      </FadeIn>

      <FadeIn delay={0.05} className="flex flex-wrap items-center justify-between gap-3">
        <FilterTabs tabs={tabs} active={status ?? "ALL"} />
        <SearchField
          action="/panel/admin/ilanlar"
          placeholder={t("listingsSearchPlaceholder")}
          defaultValue={query}
          hidden={{ durum: status }}
        />
      </FadeIn>

      {listings.length === 0 ? (
        <PanelEmptyState
          icon={Building2}
          title={t("listingsEmptyTitle")}
          subtitle={query ? t("noSearchResults", { q: query }) : t("listingsEmptySubtitle")}
        />
      ) : (
        <div className="space-y-3">
          {listings.map((listing, index) => (
            <FadeIn key={listing.id} delay={Math.min(index * 0.03, 0.24)}>
              <AdminListingRow listing={listing} />
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
