import { NextResponse } from "next/server";
import { prisma } from "@donusum-kapisi/db";
import { requireMobileUser } from "@/lib/mobile-auth";
import { mobileErrorResponse } from "@/lib/mobile-api";
import { getContractorRatingSummaries } from "@/lib/reviews";
import { renderOffersPdf } from "@/lib/offer-pdf";

export async function GET(request: Request) {
  try {
    const session = await requireMobileUser(request);
    const { searchParams } = new URL(request.url);
    const listingNumber = searchParams.get("listingNumber");
    if (!listingNumber) {
      return NextResponse.json({ error: "listingNumber gerekli." }, { status: 400 });
    }

    const listing = await prisma.listing.findUnique({
      where: { listingNumber },
      include: {
        offers: {
          include: { contractor: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!listing || listing.ownerId !== session.userId) {
      return NextResponse.json({ error: "İlan bulunamadı." }, { status: 404 });
    }

    const ratingSummaries = await getContractorRatingSummaries(
      listing.offers.map((offer) => offer.contractorId)
    );

    const offersWithRating = listing.offers.map((offer) => ({
      ...offer,
      rating: ratingSummaries.get(offer.contractorId) ?? { averageRating: null, reviewCount: 0 },
    }));

    const buffer = await renderOffersPdf(listing, offersWithRating);

    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="ilan-${listing.listingNumber}-teklifler.pdf"`,
      },
    });
  } catch (error) {
    return mobileErrorResponse(error);
  }
}
