import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Building2, FileStack, MapPin } from "lucide-react";
import type { AdminListing } from "@/lib/admin";
import { AdminCard, StatusPill } from "@/components/admin/admin-ui";
import { listingStatusTone } from "@/components/admin/status-tones";
import { ListingStatusActions } from "@/components/panel/listing-status-actions";
import { formatPriceRange } from "@/lib/format";

export async function AdminListingRow({ listing }: { listing: AdminListing }) {
  const t = await getTranslations("panelAdmin");

  // The action set follows the state machine: pending is a decision, the rest are corrections.
  const actions =
    listing.status === "PENDING"
      ? [
          { status: "APPROVED" as const, label: t("actionApprove"), variant: "cta" as const },
          { status: "REJECTED" as const, label: t("actionReject"), variant: "cta-red" as const },
        ]
      : listing.status === "APPROVED"
        ? [{ status: "CLOSED" as const, label: t("actionClose"), variant: "outline" as const }]
        : [{ status: "APPROVED" as const, label: t("actionReapprove"), variant: "outline" as const }];

  return (
    <AdminCard className="flex flex-wrap items-center gap-4">
      <Link
        href={`/panel/admin/ilanlar/${listing.listingNumber}`}
        className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-petrol/25 via-surface to-clay/20"
      >
        {listing.coverImageUrl ? (
          <Image src={listing.coverImageUrl} alt={listing.title} fill sizes="64px" className="object-cover" />
        ) : (
          <Building2 className="absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 text-ink-muted/50" />
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <p className="font-mono text-xs text-ink-muted">
          #{listing.listingNumber} · {formatPriceRange(listing.priceMin, listing.priceMax)}
        </p>
        <Link
          href={`/panel/admin/ilanlar/${listing.listingNumber}`}
          className="mt-0.5 block truncate font-display text-base text-ink hover:text-clay"
        >
          {listing.title}
        </Link>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3" />
            {listing.district}, {listing.province}
          </span>
          <span className="inline-flex items-center gap-1">
            <FileStack className="size-3" />
            {t("offerCount", { count: listing._count.offers })}
          </span>
          <span className="truncate">{listing.owner.name ?? listing.owner.email}</span>
        </p>
      </div>

      <StatusPill tone={listingStatusTone[listing.status]}>
        {t(`listingStatus.${listing.status}`)}
      </StatusPill>

      <ListingStatusActions listingId={listing.id} actions={actions} />
    </AdminCard>
  );
}
