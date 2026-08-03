import { getTranslations } from "next-intl/server";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TURKISH_PROVINCES } from "@donusum-kapisi/shared";

/**
 * Plain GET form — no client JS needed. Submits straight to /ilanlar with
 * `il` and `q` query params, which the listings page reads to filter.
 */
export async function ListingSearchBar({
  defaultIl = "",
  defaultQ = "",
}: {
  defaultIl?: string;
  defaultQ?: string;
}) {
  const t = await getTranslations("listings");

  return (
    <form
      action="/ilanlar"
      method="GET"
      className="flex flex-col gap-3 rounded-2xl border border-hairline bg-paper p-3 shadow-[0_12px_32px_-16px_rgb(22_52_73_/_0.18)] sm:flex-row sm:items-center"
    >
      <label className="flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2.5 sm:border-r sm:border-hairline">
        <MapPin className="size-4 shrink-0 text-highlight" />
        <select
          name="il"
          defaultValue={defaultIl}
          className="w-full appearance-none bg-transparent text-sm text-ink outline-none [&_option]:bg-paper [&_option]:text-ink"
        >
          <option value="">{t("allProvinces")}</option>
          {TURKISH_PROVINCES.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-[1.4] items-center gap-2.5 rounded-xl px-3 py-2.5">
        <Search className="size-4 shrink-0 text-highlight" />
        <input
          type="text"
          name="q"
          defaultValue={defaultQ}
          placeholder={t("searchPlaceholder")}
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted/60"
        />
      </label>

      <Button type="submit" variant="cta-yellow" size="lg" className="h-11 px-7 text-[0.95rem]">
        {t("searchButton")}
      </Button>
    </form>
  );
}
