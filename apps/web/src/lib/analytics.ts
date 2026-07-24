import { prisma } from "@donusum-kapisi/db";

export async function getPlatformStats() {
  const [
    totalListings,
    approvedListings,
    pendingListings,
    totalOffers,
    interestedOffers,
    totalContractors,
    verifiedContractors,
    totalReviews,
  ] = await Promise.all([
    prisma.listing.count(),
    prisma.listing.count({ where: { status: "APPROVED" } }),
    prisma.listing.count({ where: { status: "PENDING" } }),
    prisma.offer.count(),
    prisma.offer.count({ where: { status: "INTERESTED" } }),
    prisma.user.count({ where: { role: "CONTRACTOR" } }),
    prisma.contractorProfile.count({ where: { verified: true } }),
    prisma.review.count(),
  ]);

  const conversionRate = totalOffers > 0 ? (interestedOffers / totalOffers) * 100 : 0;

  return {
    totalListings,
    approvedListings,
    pendingListings,
    totalOffers,
    interestedOffers,
    conversionRate,
    totalContractors,
    verifiedContractors,
    totalReviews,
  };
}

export async function getTopContractors(limit = 5) {
  const grouped = await prisma.review.groupBy({
    by: ["contractorId"],
    _avg: { rating: true },
    _count: { rating: true },
    orderBy: { _avg: { rating: "desc" } },
    take: limit,
  });

  const users = await prisma.user.findMany({
    where: { id: { in: grouped.map((g) => g.contractorId) } },
    select: { id: true, name: true },
  });

  return grouped.map((g) => ({
    contractorId: g.contractorId,
    name: users.find((u) => u.id === g.contractorId)?.name ?? null,
    averageRating: g._avg.rating,
    reviewCount: g._count.rating,
  }));
}

export type MonthlyTrendBucket = { key: string; label: string; listings: number; offers: number };

export async function getMonthlyTrends(months = 6): Promise<MonthlyTrendBucket[]> {
  const since = new Date();
  since.setMonth(since.getMonth() - (months - 1));
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const [listings, offers] = await Promise.all([
    prisma.listing.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.offer.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
  ]);

  const buckets: MonthlyTrendBucket[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    buckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString("tr-TR", { month: "short", year: "2-digit" }),
      listings: 0,
      offers: 0,
    });
  }

  function bucketFor(date: Date) {
    return buckets.find((b) => b.key === `${date.getFullYear()}-${date.getMonth()}`);
  }

  for (const l of listings) {
    const bucket = bucketFor(l.createdAt);
    if (bucket) bucket.listings++;
  }
  for (const o of offers) {
    const bucket = bucketFor(o.createdAt);
    if (bucket) bucket.offers++;
  }

  return buckets;
}
