import { NextResponse } from "next/server";
import { priceEstimateSchema } from "@donusum-kapisi/shared";
import { estimatePrice } from "@/lib/price-estimate";
import { mobileErrorResponse } from "@/lib/mobile-api";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = priceEstimateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Form geçersiz." },
      { status: 400 }
    );
  }

  const localeRaw = typeof body?.locale === "string" ? body.locale : "tr";
  const locale = localeRaw === "en" ? "en" : "tr";

  try {
    const band = await estimatePrice(parsed.data, locale);
    return NextResponse.json({
      priceMin: band.priceMin,
      priceMax: band.priceMax,
      averagePrice: band.averagePrice,
      explanation: band.explanation ?? null,
      source: band.source,
      openAIFailure: band.openAIFailure ?? null,
    });
  } catch (error) {
    return mobileErrorResponse(error);
  }
}
