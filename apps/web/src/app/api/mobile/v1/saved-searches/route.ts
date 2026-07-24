import { NextResponse } from "next/server";
import { createSavedSearchSchema } from "@donusum-kapisi/shared";
import { requireMobileUser } from "@/lib/mobile-auth";
import { mobileErrorResponse } from "@/lib/mobile-api";
import { createSavedSearch, listSavedSearches } from "@/lib/saved-searches";
import { toSavedSearchDTO } from "@/lib/dto";

export async function GET(request: Request) {
  try {
    const session = await requireMobileUser(request);
    const searches = await listSavedSearches(session.userId);
    return NextResponse.json({ searches: searches.map(toSavedSearchDTO) });
  } catch (error) {
    return mobileErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireMobileUser(request);
    const body = await request.json().catch(() => null);
    const parsed = createSavedSearchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Form geçersiz." },
        { status: 400 }
      );
    }

    const search = await createSavedSearch(session.userId, parsed.data);
    return NextResponse.json({ search: toSavedSearchDTO(search) }, { status: 201 });
  } catch (error) {
    return mobileErrorResponse(error);
  }
}
