"use server";

import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { priceEstimateSchema } from "@donusum-kapisi/shared";
import { estimatePrice, toPriceEstimateLocale } from "@/lib/price-estimate";
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, isSupportedLocale } from "@/i18n/locales";

export type PriceEstimateActionState =
  | {
      error: string;
      result?: undefined;
    }
  | {
      error?: undefined;
      result: {
        priceMin: number;
        priceMax: number;
        averagePrice: number;
        explanation: string;
        source: "openai" | "local";
        sourceNote?: string;
      };
    }
  | null;

export async function estimatePriceAction(
  _prev: PriceEstimateActionState,
  formData: FormData
): Promise<PriceEstimateActionState> {
  const t = await getTranslations("priceEstimate");

  const parsed = priceEstimateSchema.safeParse({
    province: formData.get("province"),
    district: formData.get("district"),
    squareMeters: formData.get("squareMeters"),
    unitCount: formData.get("unitCount"),
    buildingAge: formData.get("buildingAge"),
    floorCount: formData.get("floorCount"),
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message;
    return { error: first || t("errorValidation") };
  }

  const cookieStore = await cookies();
  const stored = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  const locale = stored && isSupportedLocale(stored) ? stored : DEFAULT_LOCALE;

  const band = await estimatePrice(parsed.data, toPriceEstimateLocale(locale));
  const explanation =
    band.explanation ??
    t("explanation", {
      province: parsed.data.province,
      district: parsed.data.district,
      m2: parsed.data.squareMeters,
      units: parsed.data.unitCount,
      age: parsed.data.buildingAge,
      floors: parsed.data.floorCount,
    });

  let sourceNote: string | undefined;
  if (band.source === "openai") {
    sourceNote = t("sourceOpenAI");
  } else if (band.openAIFailure === "quota") {
    sourceNote = t("sourceQuota");
  } else if (band.openAIFailure === "auth") {
    sourceNote = t("sourceAuth");
  } else if (band.openAIFailure === "missing_key") {
    sourceNote = t("sourceMissingKey");
  } else {
    sourceNote = t("sourceLocal");
  }

  return {
    result: {
      priceMin: band.priceMin,
      priceMax: band.priceMax,
      averagePrice: band.averagePrice,
      explanation,
      source: band.source,
      sourceNote,
    },
  };
}
