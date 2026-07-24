import { getTranslations } from "next-intl/server";
import type { SavedSearch } from "@donusum-kapisi/db";
import { Bell, Trash2 } from "lucide-react";
import { deleteSavedSearchAction } from "@/lib/actions/saved-search";

function describeSearch(
  search: SavedSearch,
  t: Awaited<ReturnType<typeof getTranslations<"panel">>>
) {
  const parts: string[] = [];
  if (search.province) parts.push(search.province);
  if (search.q) parts.push(`"${search.q}"`);
  if (search.maxBuildingAge !== null) parts.push(t("savedSearchMaxAge", { age: search.maxBuildingAge }));
  if (search.minSquareMeters !== null) parts.push(t("savedSearchMinSqm", { sqm: search.minSquareMeters }));
  return parts.length > 0 ? parts.join(" · ") : t("savedSearchAllListings");
}

export async function SavedSearchesSection({ searches }: { searches: SavedSearch[] }) {
  if (searches.length === 0) return null;

  const t = await getTranslations("panel");

  return (
    <div className="mt-10">
      <h2 className="flex items-center gap-2 font-display text-xl text-ink">
        <Bell className="size-5 text-clay" /> {t("savedSearchesTitle")}
      </h2>
      <p className="mt-1 text-sm text-ink-muted">
        {t("savedSearchesSubtitle")}
      </p>

      <div className="mt-4 space-y-2">
        {searches.map((search) => (
          <div
            key={search.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-hairline bg-paper p-3.5 shadow-[0_1px_2px_rgb(22_52_73_/_0.04)] transition-colors hover:border-clay/25"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-clay/10">
                <Bell className="size-3.5 text-clay" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{search.name}</p>
                <p className="mt-0.5 truncate text-xs text-ink-muted">{describeSearch(search, t)}</p>
              </div>
            </div>
            <form
              action={async () => {
                "use server";
                await deleteSavedSearchAction(search.id);
              }}
            >
              <button
                type="submit"
                className="shrink-0 rounded-lg p-2 text-ink-muted transition-colors hover:bg-danger/10 hover:text-danger"
                aria-label={t("deleteSavedSearchLabel")}
              >
                <Trash2 className="size-4" />
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
