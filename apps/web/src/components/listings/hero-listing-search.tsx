"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, Hash, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TURKISH_PROVINCES } from "@donusum-kapisi/shared";

/**
 * İlan numarası girilirse doğrudan detaya, aksi halde /ilanlar filtrelerine.
 * Yaş filtresi mobil ile aynı: minYas (bina yaşı ≥ N).
 */
export function HeroListingSearch() {
  const router = useRouter();
  const t = useTranslations("listings");
  const [il, setIl] = useState("");
  const [listingNumber, setListingNumber] = useState("");
  const [minBuildingAge, setMinBuildingAge] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedNumber = listingNumber.trim();
    if (trimmedNumber) {
      router.push(`/ilanlar/${encodeURIComponent(trimmedNumber)}`);
      return;
    }
    const params = new URLSearchParams();
    if (il) params.set("il", il);
    if (minBuildingAge) params.set("minYas", minBuildingAge);
    const query = params.toString();
    router.push(query ? `/ilanlar?${query}` : "/ilanlar");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-2xl border border-hairline bg-paper shadow-[0_24px_60px_-28px_rgb(0_0_0_/_0.45)]"
    >
      <div className="px-6 pt-6">
        <p className="font-mono text-xs tracking-[0.2em] text-clay uppercase">
          {t("heroEyebrow")}
        </p>
        <h2 className="mt-2 font-display text-xl text-ink">{t("heroTitle")}</h2>
      </div>

      <div className="mt-5 divide-y divide-hairline border-t border-hairline">
        <label className="flex items-center gap-3 px-6 py-3.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-clay/15 text-clay">
            <Hash className="size-4" />
          </span>
          <span className="flex w-full flex-col">
            <span className="font-mono text-[0.65rem] tracking-[0.1em] text-ink-muted/70 uppercase">
              {t("heroListingNumberLabel")}
            </span>
            <input
              type="text"
              value={listingNumber}
              onChange={(e) => setListingNumber(e.target.value)}
              placeholder={t("heroOptionalPlaceholder")}
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted/50"
            />
          </span>
        </label>

        <label className="flex items-center gap-3 px-6 py-3.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-clay/15 text-clay">
            <MapPin className="size-4" />
          </span>
          <span className="flex w-full flex-col">
            <span className="font-mono text-[0.65rem] tracking-[0.1em] text-ink-muted/70 uppercase">
              {t("heroProvinceLabel")}
            </span>
            <span className="flex items-center gap-2">
              <select
                value={il}
                onChange={(e) => setIl(e.target.value)}
                className="w-full appearance-none bg-transparent text-sm text-ink outline-none"
              >
                <option value="">{t("heroAllProvinces")}</option>
                {TURKISH_PROVINCES.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
              <ChevronDown className="size-3.5 shrink-0 text-ink-muted/50" />
            </span>
          </span>
        </label>

        <fieldset className="px-6 py-3.5">
          <legend className="font-mono text-[0.65rem] tracking-[0.1em] text-ink-muted/70 uppercase">
            {t("heroMinAgeLabel")}
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {[
              { value: "", label: t("ageChipAll") },
              { value: "20", label: t("ageChipMin", { n: 20 }) },
              { value: "30", label: t("ageChipMin", { n: 30 }) },
              { value: "40", label: t("ageChipMin", { n: 40 }) },
            ].map((chip) => (
              <button
                key={chip.value || "all"}
                type="button"
                onClick={() => setMinBuildingAge(chip.value)}
                className={
                  minBuildingAge === chip.value
                    ? "rounded-full bg-clay px-3 py-1 text-sm text-white"
                    : "rounded-full border border-hairline px-3 py-1 text-sm text-ink-muted hover:border-clay/40"
                }
              >
                {chip.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="px-6 pt-4 pb-6">
        <Button type="submit" variant="cta" size="lg" className="h-11 w-full text-[0.95rem]">
          <Search className="size-4" />
          {t("heroSearchButton")}
        </Button>
      </div>
    </form>
  );
}
