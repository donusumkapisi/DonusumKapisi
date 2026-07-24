import { NextResponse } from "next/server";
import { prisma } from "@donusum-kapisi/db";
import { requireMobileUser } from "@/lib/mobile-auth";
import { mobileErrorResponse } from "@/lib/mobile-api";
import { toOfferDTO } from "@/lib/dto";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await requireMobileUser(request);
    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Bu alana erişiminiz yok." }, { status: 403 });
    }

    const { id } = await params;
    const offer = await prisma.offer.update({
      where: { id },
      data: { contactResolvedAt: new Date() },
    });

    return NextResponse.json({ offer: toOfferDTO(offer) });
  } catch (error) {
    return mobileErrorResponse(error);
  }
}
