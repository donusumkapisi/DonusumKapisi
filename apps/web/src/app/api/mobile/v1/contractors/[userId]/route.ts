import { NextResponse } from "next/server";
import { prisma } from "@donusum-kapisi/db";
import { getContractorRatingSummary, getContractorReviews } from "@/lib/reviews";
import { listPortfolioItems } from "@/lib/portfolio";
import { toContractorProfileDTO, toPortfolioItemDTO, toReviewDTO } from "@/lib/dto";

type Params = { params: Promise<{ userId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { userId } = await params;

  const [profile, user, ratingSummary, reviews, portfolio] = await Promise.all([
    // Documents are deliberately not loaded: this endpoint is public and the
    // uploads contain tax certificates and signature circulars.
    prisma.contractorProfile.findUnique({ where: { userId } }),
    prisma.user.findUnique({ where: { id: userId }, select: { name: true, role: true } }),
    getContractorRatingSummary(userId),
    getContractorReviews(userId),
    listPortfolioItems(userId),
  ]);

  if (!user || user.role !== "CONTRACTOR") {
    return NextResponse.json({ error: "Müteahhit bulunamadı." }, { status: 404 });
  }

  return NextResponse.json({
    name: user.name,
    profile: profile ? toContractorProfileDTO(profile, ratingSummary) : null,
    ratingSummary,
    reviews: reviews.map((review) => toReviewDTO(review, review.reviewer.name)),
    portfolio: portfolio.map(toPortfolioItemDTO),
  });
}
