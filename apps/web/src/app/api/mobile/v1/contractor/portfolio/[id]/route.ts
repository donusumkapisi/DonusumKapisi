import { NextResponse } from "next/server";
import { requireMobileUser } from "@/lib/mobile-auth";
import { mobileErrorResponse } from "@/lib/mobile-api";
import { deletePortfolioItem, PortfolioItemNotFoundError } from "@/lib/portfolio";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await requireMobileUser(request);
    if (session.role !== "CONTRACTOR") {
      return NextResponse.json({ error: "Bu alana erişiminiz yok." }, { status: 403 });
    }

    const { id } = await params;
    await deletePortfolioItem(session.userId, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof PortfolioItemNotFoundError) {
      return NextResponse.json({ error: "Portföy öğesi bulunamadı." }, { status: 404 });
    }
    return mobileErrorResponse(error);
  }
}
