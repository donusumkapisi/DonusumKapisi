import { NextResponse } from "next/server";
import { prisma } from "@donusum-kapisi/db";
import { createListingSchema, validateListingPhotos } from "@donusum-kapisi/shared";
import { buildListingWhere } from "@/lib/listing-filters";
import { generateListingNumber } from "@/lib/listing-number";
import { uploadListingPhotos } from "@/lib/storage/listing-photos";
import { requireMobileUser } from "@/lib/mobile-auth";
import { mobileErrorResponse, getRequestOrigin } from "@/lib/mobile-api";
import { toListingDTO } from "@/lib/dto";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = getRequestOrigin(request);
  const where = buildListingWhere({
    il: searchParams.get("il") ?? undefined,
    q: searchParams.get("q") ?? undefined,
    maxYas: searchParams.get("maxYas") ?? undefined,
    minYas: searchParams.get("minYas") ?? undefined,
    minM2: searchParams.get("minM2") ?? undefined,
  });

  const listings = await prisma.listing.findMany({ where, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ listings: listings.map((listing) => toListingDTO(listing, origin)) });
}

export async function POST(request: Request) {
  try {
    const session = await requireMobileUser(request);
    if (session.role !== "HOMEOWNER") {
      return NextResponse.json(
        { error: "İlan vermek için ev sahibi hesabıyla giriş yapmalısınız." },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const parsed = createListingSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Form geçersiz." },
        { status: 400 }
      );
    }

    const photoFiles = formData
      .getAll("photos")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    const photoError = validateListingPhotos(photoFiles);
    if (photoError) {
      return NextResponse.json({ error: photoError }, { status: 400 });
    }

    const listingNumber = await generateListingNumber();
    const photoUrls = await uploadListingPhotos(photoFiles, listingNumber);

    const listing = await prisma.listing.create({
      data: {
        ...parsed.data,
        listingNumber,
        ownerId: session.userId,
        coverImageUrl: photoUrls[0],
        photos: photoUrls,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      { listing: toListingDTO(listing, getRequestOrigin(request)) },
      { status: 201 }
    );
  } catch (error) {
    return mobileErrorResponse(error);
  }
}
