import { NextResponse } from "next/server";
import { prisma } from "@donusum-kapisi/db";
import { requireMobileUser } from "@/lib/mobile-auth";
import { mobileErrorResponse } from "@/lib/mobile-api";
import { toAppointmentDTO, toOfferDTO } from "@/lib/dto";

export async function GET(request: Request) {
  try {
    const session = await requireMobileUser(request);
    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Bu alana erişiminiz yok." }, { status: 403 });
    }

    const offers = await prisma.offer.findMany({
      where: { status: "INTERESTED", contactResolvedAt: null },
      include: {
        listing: { select: { listingNumber: true, title: true, owner: { select: { name: true, email: true, phone: true } } } },
        contractor: { select: { name: true, email: true, phone: true } },
        appointments: { orderBy: { scheduledAt: "desc" }, take: 1 },
      },
      orderBy: { updatedAt: "asc" },
    });

    return NextResponse.json({
      offers: offers.map((offer) => ({
        ...toOfferDTO(offer),
        listing: {
          listingNumber: offer.listing.listingNumber,
          title: offer.listing.title,
          owner: offer.listing.owner,
        },
        contractor: offer.contractor,
        appointment: offer.appointments[0] ? toAppointmentDTO(offer.appointments[0]) : null,
      })),
    });
  } catch (error) {
    return mobileErrorResponse(error);
  }
}
