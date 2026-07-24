"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { Listing } from "@donusum-kapisi/db";
import { List, Map as MapIcon } from "lucide-react";
import { ListingCard } from "@/components/listings/listing-card";
import { cn } from "@/lib/utils";

const ListingsMap = dynamic(
  () => import("@/components/listings/listings-map").then((m) => m.ListingsMap),
  { ssr: false }
);

export function ListingsResults({ listings }: { listings: Listing[] }) {
  const [view, setView] = useState<"list" | "map">("list");
  const t = useTranslations("listings");

  return (
    <div>
      <div className="mt-8 inline-flex rounded-full border border-hairline bg-surface/60 p-1">
        <button
          type="button"
          onClick={() => setView("list")}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            view === "list" ? "bg-paper text-ink shadow-sm" : "text-ink-muted"
          )}
        >
          <List className="size-4" /> {t("viewList")}
        </button>
        <button
          type="button"
          onClick={() => setView("map")}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            view === "map" ? "bg-paper text-ink shadow-sm" : "text-ink-muted"
          )}
        >
          <MapIcon className="size-4" /> {t("viewMap")}
        </button>
      </div>

      {view === "list" ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <ListingsMap listings={listings} />
      )}
    </div>
  );
}
