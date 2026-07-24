import { NextResponse } from "next/server";
import { prisma } from "@donusum-kapisi/db";
import { requireMobileUser } from "@/lib/mobile-auth";
import { mobileErrorResponse, getRequestOrigin } from "@/lib/mobile-api";
import { toListingDTO } from "@/lib/dto";

export async function GET(request: Request) {
  try {
    const session = await requireMobileUser(request);
    if (session.role !== "HOMEOWNER") {
      return NextResponse.json({ error: "Bu alana erişiminiz yok." }, { status: 403 });
    }

    const listings = await prisma.listing.findMany({
      where: { ownerId: session.userId },
      orderBy: { createdAt: "desc" },
    });

    const origin = getRequestOrigin(request);
    return NextResponse.json({ listings: listings.map((listing) => toListingDTO(listing, origin)) });
  } catch (error) {
    return mobileErrorResponse(error);
  }
}
