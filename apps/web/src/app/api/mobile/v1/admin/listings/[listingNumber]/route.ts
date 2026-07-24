import { NextResponse } from "next/server";
import { updateListingStatusSchema } from "@donusum-kapisi/shared";
import { requireMobileUser } from "@/lib/mobile-auth";
import { mobileErrorResponse, getRequestOrigin } from "@/lib/mobile-api";
import { setListingStatus } from "@/lib/listings";
import { toListingDTO } from "@/lib/dto";

type Params = { params: Promise<{ listingNumber: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await requireMobileUser(request);
    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Bu alana erişiminiz yok." }, { status: 403 });
    }

    const { listingNumber } = await params;
    const body = await request.json().catch(() => null);
    const parsed = updateListingStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Form geçersiz." },
        { status: 400 }
      );
    }

    const listing = await setListingStatus({ listingNumber }, parsed.data.status);

    return NextResponse.json({ listing: toListingDTO(listing, getRequestOrigin(request)) });
  } catch (error) {
    return mobileErrorResponse(error);
  }
}
