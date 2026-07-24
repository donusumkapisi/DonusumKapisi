import { prisma } from "@donusum-kapisi/db";
import type { CreateReviewInput } from "@donusum-kapisi/shared";

export class ReviewNotAllowedError extends Error {}

export async function createReview(
  offerId: string,
  reviewerId: string,
  input: CreateReviewInput
) {
  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    include: { listing: true, review: true },
  });

  if (!offer || offer.listing.ownerId !== reviewerId) {
    throw new ReviewNotAllowedError();
  }
  if (!offer.contactResolvedAt) {
    throw new ReviewNotAllowedError();
  }
  if (offer.review) {
    throw new ReviewNotAllowedError();
  }

  return prisma.review.create({
    data: {
      offerId,
      contractorId: offer.contractorId,
      reviewerId,
      rating: input.rating,
      comment: input.comment,
    },
  });
}

export async function getContractorRatingSummary(contractorId: string) {
  const result = await prisma.review.aggregate({
    where: { contractorId },
    _avg: { rating: true },
    _count: true,
  });

  return {
    averageRating: result._avg.rating,
    reviewCount: result._count,
  };
}

export async function getContractorRatingSummaries(contractorIds: string[]) {
  const summaries = new Map<string, { averageRating: number | null; reviewCount: number }>();
  for (const id of contractorIds) summaries.set(id, { averageRating: null, reviewCount: 0 });
  if (contractorIds.length === 0) return summaries;

  const grouped = await prisma.review.groupBy({
    by: ["contractorId"],
    where: { contractorId: { in: contractorIds } },
    _avg: { rating: true },
    _count: true,
  });

  for (const group of grouped) {
    summaries.set(group.contractorId, {
      averageRating: group._avg.rating,
      reviewCount: group._count,
    });
  }

  return summaries;
}

export async function getContractorReviews(contractorId: string) {
  return prisma.review.findMany({
    where: { contractorId },
    include: { reviewer: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
}
