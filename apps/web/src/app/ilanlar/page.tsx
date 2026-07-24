import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { prisma } from "@donusum-kapisi/db";
import { auth } from "@/lib/auth";
import { buildListingWhere } from "@/lib/listing-filters";
import { ListingsResults } from "@/components/listings/listings-results";
import { ListingSearchBar } from "@/components/listings/listing-search-bar";
import { SaveSearchForm } from "@/components/listings/save-search-form";
import { AgeFilterChips } from "@/components/listings/age-filter-chips";
import { PageHero } from "@/components/layout/page-hero";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("listings");
  return { title: t("metaTitle") };
}

type Props = {
  searchParams: Promise<{
    il?: string;
    q?: string;
    maxYas?: string;
    minYas?: string;
    minM2?: string;
  }>;
};

export default async function ListingsPage({ searchParams }: Props) {
  const { il, q, maxYas, minYas, minM2 } = await searchParams;
  const where = buildListingWhere({ il, q, maxYas, minYas, minM2 });

  const [listings, session, t] = await Promise.all([
    prisma.listing.findMany({ where, orderBy: { createdAt: "desc" } }),
    auth(),
    getTranslations("listings"),
  ]);

  const hasFilters = Boolean(il || q || maxYas || minYas || minM2);

  return (
    <div>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("pageTitle")}
        subtitle={t("pageSubtitle", { count: listings.length })}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-20">
        <div className="-mt-6 space-y-4">
          <ListingSearchBar defaultIl={il ?? ""} defaultQ={q ?? ""} />
          <AgeFilterChips
            currentMinYas={minYas}
            il={il ?? ""}
            q={q ?? ""}
            minM2={minM2 ?? ""}
          />
          {session && hasFilters ? (
            <SaveSearchForm province={il ?? ""} q={q ?? ""} />
          ) : null}
        </div>

        {listings.length === 0 ? (
          <p className="mt-16 text-sm text-ink-muted">
            {hasFilters ? t("emptyFiltered") : t("emptyDefault")}
          </p>
        ) : (
          <div className="mt-10">
            <ListingsResults listings={listings} />
          </div>
        )}
      </div>
    </div>
  );
}
