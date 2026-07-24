import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

const AGE_CHIPS = [
  { key: "all", minYas: undefined as number | undefined },
  { key: "20", minYas: 20 },
  { key: "30", minYas: 30 },
  { key: "40", minYas: 40 },
] as const;

/**
 * Mobil vitrin ile aynı semantik: bina yaşı ≥ N (minYas).
 * Mevcut il / q / minM2 query parametrelerini korur.
 */
export async function AgeFilterChips({
  currentMinYas,
  il = "",
  q = "",
  minM2 = "",
}: {
  currentMinYas?: string;
  il?: string;
  q?: string;
  minM2?: string;
}) {
  const t = await getTranslations("listings");
  const active = currentMinYas ?? "";

  function hrefFor(minYas: number | undefined) {
    const params = new URLSearchParams();
    if (il) params.set("il", il);
    if (q) params.set("q", q);
    if (minM2) params.set("minM2", minM2);
    if (minYas !== undefined) params.set("minYas", String(minYas));
    const qs = params.toString();
    return qs ? `/ilanlar?${qs}` : "/ilanlar";
  }

  return (
    <div className="flex flex-wrap gap-2">
      {AGE_CHIPS.map((chip) => {
        const value = chip.minYas !== undefined ? String(chip.minYas) : "";
        const isActive = active === value;
        const label =
          chip.key === "all"
            ? t("ageChipAll")
            : t("ageChipMin", { n: chip.minYas! });

        return (
          <Link
            key={chip.key}
            href={hrefFor(chip.minYas)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm transition-colors",
              isActive
                ? "bg-clay text-white"
                : "border border-hairline bg-paper text-ink-muted hover:border-clay/40 hover:text-ink"
            )}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
