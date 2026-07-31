import { NextResponse } from "next/server";
import { createOfferSchema } from "@donusum-kapisi/shared";
import { requireMobileUser } from "@/lib/mobile-auth";
import { mobileErrorResponse } from "@/lib/mobile-api";
import {
  upsertOffer,
  ListingNotAvailableError,
  ContractorNotVerifiedError,
} from "@/lib/offers";
import { toOfferDTO } from "@/lib/dto";

type Params = { params: Promise<{ listingNumber: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const session = await requireMobileUser(request);
    if (session.role !== "CONTRACTOR") {
      return NextResponse.json(
        { error: "Teklif vermek için müteahhit hesabıyla giriş yapmalısınız." },
        { status: 403 }
      );
    }

    const { listingNumber } = await params;
    const body = await request.json().catch(() => null);
    const parsed = createOfferSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Form geçersiz." },
        { status: 400 }
      );
    }

    const offer = await upsertOffer(listingNumber, session.userId, parsed.data);
    return NextResponse.json({ offer: toOfferDTO(offer) }, { status: 201 });
  } catch (error) {
    if (error instanceof ContractorNotVerifiedError) {
      return NextResponse.json(
        { error: "Teklif verebilmek için evrak doğrulamanızın onaylanması gerekir." },
        { status: 403 }
      );
    }
    if (error instanceof ListingNotAvailableError) {
      return NextResponse.json({ error: "İlan bulunamadı veya yayında değil." }, { status: 404 });
    }
    return mobileErrorResponse(error);
  }
}
