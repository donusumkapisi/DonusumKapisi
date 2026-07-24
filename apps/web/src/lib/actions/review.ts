"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { createReviewSchema } from "@donusum-kapisi/shared";
import { auth } from "@/lib/auth";
import { createReview, ReviewNotAllowedError } from "@/lib/reviews";

export type ReviewActionState = { error: string } | { success: true } | null;

export async function createReviewAction(
  offerId: string,
  _prevState: ReviewActionState,
  formData: FormData
): Promise<ReviewActionState> {
  const t = await getTranslations("panel");
  const session = await auth();
  if (!session || session.user.role !== "HOMEOWNER") {
    return { error: t("errorMustBeHomeownerReview") };
  }

  const parsed = createReviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? t("errorFormInvalid") };
  }

  try {
    await createReview(offerId, session.user.id, parsed.data);
  } catch (error) {
    if (error instanceof ReviewNotAllowedError) {
      return { error: t("errorReviewNotAllowed") };
    }
    throw error;
  }

  revalidatePath("/panel/ev-sahibi");
  return { success: true };
}
