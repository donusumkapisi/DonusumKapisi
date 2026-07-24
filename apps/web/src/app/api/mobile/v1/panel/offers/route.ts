import { NextResponse } from "next/server";
import { prisma } from "@donusum-kapisi/db";
import { requireMobileUser } from "@/lib/mobile-auth";
import { mobileErrorResponse } from "@/lib/mobile-api";
import { getContractorRatingSummaries } from "@/lib/reviews";
import { toAppointmentDTO, toOfferDTO } from "@/lib/dto";

export async function GET(request: Request) {
  try {
    const session = await requireMobileUser(request);

    const offers = await prisma.offer.findMany({
      where:
        session.role === "CONTRACTOR"
          ? { contractorId: session.userId }
          : { listing: { ownerId: session.userId } },
      include: {
        listing: { select: { listingNumber: true, title: true } },
        contractor: { select: { name: true } },
        review: true,
        appointments: { orderBy: { scheduledAt: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });

    const ratingSummaries = await getContractorRatingSummaries(
      offers.map((offer) => offer.contractorId)
    );

    return NextResponse.json({
      offers: offers.map((offer) => ({
        ...toOfferDTO(offer),
        listing: offer.listing,
        contractor: { id: offer.contractorId, name: offer.contractor.name },
        contractorRating: ratingSummaries.get(offer.contractorId) ?? {
          averageRating: null,
          reviewCount: 0,
        },
        hasReview: Boolean(offer.review),
        appointment: offer.appointments[0] ? toAppointmentDTO(offer.appointments[0]) : null,
      })),
    });
  } catch (error) {
    return mobileErrorResponse(error);
  }
}
