"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Listing } from "@donusum-kapisi/db";
import { formatPriceRange } from "@/lib/format";

export function ListingCard({
  listing,
  variant = "grid",
}: {
  listing: Listing;
  variant?: "grid" | "featured";
}) {
  const t = useTranslations("listings");
  const isFeatured = variant === "featured";

  return (
    <Link
      href={`/ilanlar/${listing.listingNumber}`}
      className={
        isFeatured
          ? "group block overflow-hidden rounded-2xl border border-hairline bg-paper transition-colors hover:border-clay/40 sm:col-span-2"
          : "group block overflow-hidden rounded-2xl border border-hairline bg-paper transition-colors hover:border-clay/40"
      }
    >
      <div
        className={
          isFeatured
            ? "relative h-52 overflow-hidden bg-surface sm:h-64"
            : "relative h-40 overflow-hidden bg-surface"
        }
      >
        {listing.coverImageUrl ? (
          <Image
            src={listing.coverImageUrl}
            alt={listing.title}
            fill
            sizes={
              isFeatured
                ? "(min-width: 640px) 66vw, 100vw"
                : "(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            }
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-surface-strong/30 via-surface to-clay/15" />
        )}
        <span className="absolute top-3 left-3 rounded-full bg-surface-strong/85 px-2.5 py-1 font-mono text-[0.65rem] tracking-wide text-white">
          #{listing.listingNumber}
        </span>
      </div>

      <div className={isFeatured ? "p-6" : "p-5"}>
        <p className="font-mono text-xs tracking-wide text-clay uppercase">
          {listing.district}, {listing.province}
        </p>
        <h3
          className={
            isFeatured
              ? "mt-2 font-display text-2xl text-ink transition-colors group-hover:text-clay"
              : "mt-2 font-display text-lg text-ink transition-colors group-hover:text-clay"
          }
        >
          {listing.title}
        </h3>

        <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-hairline pt-4 font-mono text-xs text-ink-muted">
          <div>
            <dt className="text-[0.65rem] text-ink-muted/70 uppercase">{t("cardSquareMeters")}</dt>
            <dd className="mt-0.5 text-ink">{listing.squareMeters}</dd>
          </div>
          <div>
            <dt className="text-[0.65rem] text-ink-muted/70 uppercase">{t("cardFloor")}</dt>
            <dd className="mt-0.5 text-ink">{listing.floorCount}</dd>
          </div>
          <div>
            <dt className="text-[0.65rem] text-ink-muted/70 uppercase">{t("cardUnit")}</dt>
            <dd className="mt-0.5 text-ink">{listing.unitCount}</dd>
          </div>
        </dl>

        <p className="mt-4 text-sm font-medium text-ink">
          {formatPriceRange(listing.priceMin, listing.priceMax)}
        </p>
      </div>
    </Link>
  );
}
