import { NextResponse } from "next/server";
import { getRequestOrigin } from "@/lib/mobile-api";
import { getListingForDetail } from "@/lib/listings";
import { toListingDTO } from "@/lib/dto";

type Params = { params: Promise<{ listingNumber: string }> };

export async function GET(request: Request, { params }: Params) {
  const { listingNumber } = await params;
  const listing = await getListingForDetail(listingNumber);

  if (!listing) {
    return NextResponse.json({ error: "İlan bulunamadı." }, { status: 404 });
  }

  return NextResponse.json({ listing: toListingDTO(listing, getRequestOrigin(request)) });
}
