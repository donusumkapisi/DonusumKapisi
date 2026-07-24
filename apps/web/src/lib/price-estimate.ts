import { z } from "zod";
import type { PriceEstimateInput } from "@donusum-kapisi/shared";
import {
  getRebuildCostFloorPerSqm,
  getRebuildCostPerSqm,
} from "./construction-costs-tr";

export type PriceEstimateResult = {
  priceMin: number;
  priceMax: number;
  averagePrice: number;
  explanation?: string;
  source: "openai" | "local";
};

const llmEstimateSchema = z.object({
  priceMin: z.number().int().positive(),
  priceMax: z.number().int().positive(),
  averagePrice: z.number().int().positive(),
  explanation: z.string().min(20).max(800),
});

export class PriceEstimateFailedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PriceEstimateFailedError";
  }
}

function roundTo(value: number, step: number): number {
  return Math.max(step, Math.round(value / step) * step);
}

function buildBand(averageRaw: number): Pick<
  PriceEstimateResult,
  "priceMin" | "priceMax" | "averagePrice"
> {
  const step = averageRaw >= 20_000_000 ? 100_000 : 50_000;
  const averagePrice = roundTo(averageRaw, step);
  const priceMin = roundTo(averagePrice * 0.88, step);
  const priceMax = roundTo(averagePrice * 1.14, step);
  return {
    priceMin: Math.min(priceMin, averagePrice),
    priceMax: Math.max(priceMax, averagePrice),
    averagePrice,
  };
}

function isRealisticBand(
  input: PriceEstimateInput,
  band: Pick<PriceEstimateResult, "averagePrice" | "priceMin" | "priceMax">
): boolean {
  const floor = getRebuildCostFloorPerSqm(input.province, input.district);
  const perSqm = band.averagePrice / Math.max(1, input.squareMeters);
  if (perSqm < floor) return false;
  if (band.priceMin > band.priceMax) return false;
  if (band.averagePrice < band.priceMin || band.averagePrice > band.priceMax) return false;
  // Açıkça saçma üst sınır (m² başına 500k+ TRY) — model halüsinasyonu
  if (perSqm > 250_000) return false;
  return true;
}

/** Key yoksa veya OpenAI düşerse / saçma fiyat üretirse kullanılan yedek. */
export function estimatePriceLocally(input: PriceEstimateInput): PriceEstimateResult {
  let perSqm = getRebuildCostPerSqm(input.province, input.district);

  if (input.buildingAge >= 40) perSqm *= 1.1;
  else if (input.buildingAge >= 25) perSqm *= 1.05;

  if (input.floorCount >= 10) perSqm *= 1.08;
  else if (input.floorCount >= 6) perSqm *= 1.04;

  const avgUnitSize = input.squareMeters / Math.max(1, input.unitCount);
  // Büyük daireler (ör. 1200 m² / 4 daire ≈ 300 m²) premium yapı kalitesi varsayar
  if (avgUnitSize >= 200) perSqm *= 1.12;
  else if (avgUnitSize >= 140) perSqm *= 1.06;
  else if (avgUnitSize < 70) perSqm *= 1.04;

  return {
    ...buildBand(perSqm * input.squareMeters),
    source: "local",
  };
}

async function estimatePriceWithOpenAI(
  input: PriceEstimateInput,
  locale: "tr" | "en",
  apiKey: string
): Promise<PriceEstimateResult> {
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const language = locale === "en" ? "English" : "Turkish";
  const midPerSqm = getRebuildCostPerSqm(input.province, input.district);
  const floor = getRebuildCostFloorPerSqm(input.province, input.district);
  const localHint = estimatePriceLocally(input);

  const system = [
    "You are a Turkish urban-renewal (kentsel dönüşüm) COST advisor for DönüşümKapısı in 2026.",
    "Estimate a REALISTIC contractor PROJECT COST RANGE in Turkish Lira (TRY) for demolishing and rebuilding the described building.",
    "This is TOTAL project / construction cost for the whole building — NOT apartment sale price, NOT monthly rent, NOT kat karşılığı share %.",
    "Respond ONLY with valid JSON:",
    '{"priceMin":number,"priceMax":number,"averagePrice":number,"explanation":string}',
    "HARD RULES (must obey):",
    `- Location mid rebuild cost is about ${midPerSqm} TRY per m²; hard floor is ${floor} TRY/m². Never go below the floor.`,
    `- For this input, a sensible mid estimate is near ${localHint.averagePrice} TRY (band roughly ${localHint.priceMin}-${localHint.priceMax}). Stay within ±25% of that mid unless you have a strong reason.`,
    "- Istanbul premium districts (Beşiktaş, Kadıköy, Sarıyer, Bakırköy, Şişli, Üsküdar) are expensive: typically 60.000–90.000+ TRY/m² rebuild cost in 2026.",
    "- Example: İstanbul / Beşiktaş, 1200 m² → average should be tens of millions TRY (often 70M–100M+), NEVER ~2M TRY.",
    "- Integers only. priceMin <= averagePrice <= priceMax.",
    `- explanation: 2-4 short sentences in ${language}; mention location, m² and that this is a non-binding AI estimate.`,
  ].join("\n");

  const user = [
    `Province: ${input.province}`,
    `District: ${input.district}`,
    `Total area (m²): ${input.squareMeters}`,
    `Unit count (daire): ${input.unitCount}`,
    `Building age (years): ${input.buildingAge}`,
    `Floor count: ${input.floorCount}`,
    `Location mid TRY/m²: ${midPerSqm}`,
    `Hard floor TRY/m²: ${floor}`,
    `Reference mid estimate (TRY): ${localHint.averagePrice}`,
  ].join("\n");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new PriceEstimateFailedError(
      `OpenAI isteği başarısız (${response.status}): ${detail.slice(0, 200)}`
    );
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const raw = payload.choices?.[0]?.message?.content;
  if (!raw) {
    throw new PriceEstimateFailedError("Model boş yanıt döndü.");
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch {
    throw new PriceEstimateFailedError("Model geçersiz JSON döndü.");
  }

  const parsed = llmEstimateSchema.safeParse(parsedJson);
  if (!parsed.success) {
    throw new PriceEstimateFailedError("Model çıktısı şemaya uymuyor.");
  }

  let { priceMin, priceMax, averagePrice, explanation } = parsed.data;
  if (priceMin > priceMax) {
    [priceMin, priceMax] = [priceMax, priceMin];
  }

  const band = { priceMin, priceMax, averagePrice };
  if (!isRealisticBand(input, band)) {
    // Model çok düşük / saçma band ürettiyse yerel hesabı kullan
    throw new PriceEstimateFailedError("Model çıktısı gerçekçi maliyet tabanının altında.");
  }

  return {
    priceMin,
    priceMax,
    averagePrice,
    explanation,
    source: "openai",
  };
}

export type OpenAIFailureReason = "missing_key" | "quota" | "auth" | "other";

function classifyOpenAIFailure(err: unknown): OpenAIFailureReason {
  const message = err instanceof Error ? err.message : String(err);
  if (/insufficient_quota|429/i.test(message)) return "quota";
  if (/401|invalid_api_key|incorrect api key/i.test(message)) return "auth";
  return "other";
}

/**
 * Önce OpenAI; key yoksa, hata olursa veya fiyat gerçekçi değilse yerel formül.
 */
export async function estimatePrice(
  input: PriceEstimateInput,
  locale: "tr" | "en" = "tr"
): Promise<PriceEstimateResult & { openAIFailure?: OpenAIFailureReason }> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return { ...estimatePriceLocally(input), openAIFailure: "missing_key" };
  }

  try {
    return await estimatePriceWithOpenAI(input, locale, apiKey);
  } catch (err) {
    return {
      ...estimatePriceLocally(input),
      openAIFailure: classifyOpenAIFailure(err),
    };
  }
}
