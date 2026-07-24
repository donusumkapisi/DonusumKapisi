import { NextResponse } from "next/server";
import { updateContractorProfileSchema, validateListingPhotos } from "@donusum-kapisi/shared";
import { requireMobileUser } from "@/lib/mobile-auth";
import { mobileErrorResponse } from "@/lib/mobile-api";
import { getContractorProfile, updateContractorProfile } from "@/lib/contractor-profile";
import { toContractorProfileDTO } from "@/lib/dto";

export async function GET(request: Request) {
  try {
    const session = await requireMobileUser(request);
    if (session.role !== "CONTRACTOR") {
      return NextResponse.json({ error: "Bu alana erişiminiz yok." }, { status: 403 });
    }

    const profile = await getContractorProfile(session.userId);
    return NextResponse.json({ profile: profile ? toContractorProfileDTO(profile) : null });
  } catch (error) {
    return mobileErrorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireMobileUser(request);
    if (session.role !== "CONTRACTOR") {
      return NextResponse.json({ error: "Bu alana erişiminiz yok." }, { status: 403 });
    }

    const formData = await request.formData();
    const parsed = updateContractorProfileSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Form geçersiz." },
        { status: 400 }
      );
    }

    const documentFiles = formData
      .getAll("documents")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (documentFiles.length > 0) {
      const photoError = validateListingPhotos(documentFiles);
      if (photoError) {
        return NextResponse.json({ error: photoError }, { status: 400 });
      }
    }

    const profile = await updateContractorProfile(session.userId, parsed.data, documentFiles);
    return NextResponse.json({ profile: toContractorProfileDTO(profile) });
  } catch (error) {
    return mobileErrorResponse(error);
  }
}
