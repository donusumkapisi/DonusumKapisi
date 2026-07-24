import { NextResponse } from "next/server";
import { z } from "zod";
import { requireMobileUser } from "@/lib/mobile-auth";
import { mobileErrorResponse } from "@/lib/mobile-api";
import { setContractorVerified } from "@/lib/contractor-profile";
import { toContractorProfileDTO } from "@/lib/dto";

const verifySchema = z.object({ verified: z.boolean() });

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await requireMobileUser(request);
    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Bu alana erişiminiz yok." }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => null);
    const parsed = verifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Form geçersiz." }, { status: 400 });
    }

    const profile = await setContractorVerified(id, parsed.data.verified);
    return NextResponse.json({ profile: toContractorProfileDTO(profile) });
  } catch (error) {
    return mobileErrorResponse(error);
  }
}
