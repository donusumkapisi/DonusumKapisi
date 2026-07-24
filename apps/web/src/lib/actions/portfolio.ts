"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { ACCEPTED_PHOTO_TYPES, MAX_PHOTO_SIZE_BYTES, createPortfolioItemSchema } from "@donusum-kapisi/shared";
import { auth } from "@/lib/auth";
import { createPortfolioItem, deletePortfolioItem } from "@/lib/portfolio";

export type PortfolioActionState = { error: string } | { success: true } | null;

function validateImage(
  file: File | null,
  t: Awaited<ReturnType<typeof getTranslations<"panel">>>
): string | null {
  if (!file) return null;
  if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
    return t("errorPhotoFormat");
  }
  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    return t("errorPhotoSize");
  }
  return null;
}

export async function createPortfolioItemAction(
  _prevState: PortfolioActionState,
  formData: FormData
): Promise<PortfolioActionState> {
  const t = await getTranslations("panel");
  const session = await auth();
  if (!session || session.user.role !== "CONTRACTOR") {
    return { error: t("errorMustBeContractor") };
  }

  const parsed = createPortfolioItemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? t("errorFormInvalid") };
  }

  const beforeEntry = formData.get("beforeImage");
  const afterEntry = formData.get("afterImage");
  const beforeFile = beforeEntry instanceof File && beforeEntry.size > 0 ? beforeEntry : null;
  const afterFile = afterEntry instanceof File && afterEntry.size > 0 ? afterEntry : null;

  const imageError = validateImage(beforeFile, t) ?? validateImage(afterFile, t);
  if (imageError) return { error: imageError };

  await createPortfolioItem(session.user.id, parsed.data, beforeFile, afterFile);

  revalidatePath("/panel/muteahhit");
  return { success: true };
}

export async function deletePortfolioItemAction(id: string) {
  const session = await auth();
  if (!session || session.user.role !== "CONTRACTOR") return;

  await deletePortfolioItem(session.user.id, id);
  revalidatePath("/panel/muteahhit");
}
