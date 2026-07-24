import { NextResponse } from "next/server";
import { updateOfferStatusSchema } from "@donusum-kapisi/shared";
import { requireMobileUser } from "@/lib/mobile-auth";
import { mobileErrorResponse } from "@/lib/mobile-api";
import { updateOfferStatus, ForbiddenOfferActionError, ListingNotAvailableError } from "@/lib/offers";
import { toOfferDTO } from "@/lib/dto";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await requireMobileUser(request);
    if (session.role !== "HOMEOWNER" && session.role !== "CONTRACTOR") {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok." }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => null);
    const parsed = updateOfferStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Form geçersiz." },
        { status: 400 }
      );
    }

    const offer = await updateOfferStatus(
      id,
      { id: session.userId, role: session.role },
      parsed.data.status
    );
    return NextResponse.json({ offer: toOfferDTO(offer) });
  } catch (error) {
    if (error instanceof ListingNotAvailableError) {
      return NextResponse.json({ error: "Teklif bulunamadı." }, { status: 404 });
    }
    if (error instanceof ForbiddenOfferActionError) {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok." }, { status: 403 });
    }
    return mobileErrorResponse(error);
  }
}
