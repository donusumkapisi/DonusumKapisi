import { NextResponse } from "next/server";
import { ACCEPTED_PHOTO_TYPES, MAX_PHOTO_SIZE_BYTES, createPortfolioItemSchema } from "@donusum-kapisi/shared";
import { requireMobileUser } from "@/lib/mobile-auth";
import { mobileErrorResponse } from "@/lib/mobile-api";
import { createPortfolioItem, listPortfolioItems } from "@/lib/portfolio";
import { toPortfolioItemDTO } from "@/lib/dto";

function validateImage(file: File | null): string | null {
  if (!file) return null;
  if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
    return "Fotoğraflar yalnızca JPG, PNG veya WEBP formatında olabilir.";
  }
  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    return "Her fotoğraf en fazla 5MB olabilir.";
  }
  return null;
}

export async function GET(request: Request) {
  try {
    const session = await requireMobileUser(request);
    if (session.role !== "CONTRACTOR") {
      return NextResponse.json({ error: "Bu alana erişiminiz yok." }, { status: 403 });
    }

    const items = await listPortfolioItems(session.userId);
    return NextResponse.json({ items: items.map(toPortfolioItemDTO) });
  } catch (error) {
    return mobileErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireMobileUser(request);
    if (session.role !== "CONTRACTOR") {
      return NextResponse.json({ error: "Bu alana erişiminiz yok." }, { status: 403 });
    }

    const formData = await request.formData();
    const parsed = createPortfolioItemSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Form geçersiz." },
        { status: 400 }
      );
    }

    const beforeEntry = formData.get("beforeImage");
    const afterEntry = formData.get("afterImage");
    const beforeFile = beforeEntry instanceof File && beforeEntry.size > 0 ? beforeEntry : null;
    const afterFile = afterEntry instanceof File && afterEntry.size > 0 ? afterEntry : null;

    const imageError = validateImage(beforeFile) ?? validateImage(afterFile);
    if (imageError) {
      return NextResponse.json({ error: imageError }, { status: 400 });
    }

    const item = await createPortfolioItem(session.userId, parsed.data, beforeFile, afterFile);
    return NextResponse.json({ item: toPortfolioItemDTO(item) }, { status: 201 });
  } catch (error) {
    return mobileErrorResponse(error);
  }
}
