import { NextResponse } from "next/server";
import { requireMobileUser } from "@/lib/mobile-auth";
import { mobileErrorResponse } from "@/lib/mobile-api";
import { deleteSavedSearch, SavedSearchNotFoundError } from "@/lib/saved-searches";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await requireMobileUser(request);
    const { id } = await params;
    await deleteSavedSearch(session.userId, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof SavedSearchNotFoundError) {
      return NextResponse.json({ error: "Kayıtlı arama bulunamadı." }, { status: 404 });
    }
    return mobileErrorResponse(error);
  }
}
