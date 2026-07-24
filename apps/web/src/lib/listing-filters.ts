import type { Prisma } from "@donusum-kapisi/db";

export type ListingFilterParams = {
  il?: string;
  q?: string;
  /** Bina yaşı üst sınırı (≤) — eski URL'ler için korunur */
  maxYas?: string;
  /** Bina yaşı alt sınırı (≥) — mobil vitrin chip semantiği */
  minYas?: string;
  minM2?: string;
};

export function buildListingWhere({
  il,
  q,
  maxYas,
  minYas,
  minM2,
}: ListingFilterParams): Prisma.ListingWhereInput {
  const maxBuildingAge = maxYas ? Number(maxYas) : undefined;
  const minBuildingAge = minYas ? Number(minYas) : undefined;
  const minSquareMeters = minM2 ? Number(minM2) : undefined;

  const where: Prisma.ListingWhereInput = { status: "APPROVED" };
  if (il) where.province = il;
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { district: { contains: q, mode: "insensitive" } },
    ];
  }

  const ageFilter: Prisma.IntFilter = {};
  if (minBuildingAge !== undefined && Number.isFinite(minBuildingAge)) {
    ageFilter.gte = minBuildingAge;
  }
  if (maxBuildingAge !== undefined && Number.isFinite(maxBuildingAge)) {
    ageFilter.lte = maxBuildingAge;
  }
  if (Object.keys(ageFilter).length > 0) {
    where.buildingAge = ageFilter;
  }

  if (minSquareMeters !== undefined && Number.isFinite(minSquareMeters)) {
    where.squareMeters = { gte: minSquareMeters };
  }
  return where;
}
