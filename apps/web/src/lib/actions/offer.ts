"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { createOfferSchema } from "@donusum-kapisi/shared";
import type { OfferStatus } from "@donusum-kapisi/db";
import {
  upsertOffer,
  updateOfferStatus,
  ListingNotAvailableError,
  ForbiddenOfferActionError,
} from "@/lib/offers";

export type OfferActionState = { error: string } | { success: true } | null;

export async function createOfferAction(
  listingNumber: string,
  _prevState: OfferActionState,
  formData: FormData
): Promise<OfferActionState> {
  const t = await getTranslations("listingDetail");
  const session = await auth();
  if (!session || session.user.role !== "CONTRACTOR") {
    return { error: t("errorMustBeContractor") };
  }

  const parsed = createOfferSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? t("errorFormInvalid") };
  }

  try {
    await upsertOffer(listingNumber, session.user.id, parsed.data);
  } catch (error) {
    if (error instanceof ListingNotAvailableError) {
      return { error: t("errorListingUnavailable") };
    }
    throw error;
  }

  revalidatePath(`/ilanlar/${listingNumber}`);
  return { success: true };
}

export async function updateOfferStatusAction(offerId: string, status: OfferStatus) {
  const session = await auth();
  if (!session || (session.user.role !== "HOMEOWNER" && session.user.role !== "CONTRACTOR")) {
    throw new Error("Yetkiniz yok.");
  }

  try {
    await updateOfferStatus(offerId, { id: session.user.id, role: session.user.role }, status);
  } catch (error) {
    if (error instanceof ForbiddenOfferActionError || error instanceof ListingNotAvailableError) {
      throw new Error("Bu işlem gerçekleştirilemedi.");
    }
    throw error;
  }

  revalidatePath("/panel/ev-sahibi");
  revalidatePath("/panel/muteahhit");
}
