"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { createSavedSearchSchema } from "@donusum-kapisi/shared";
import { auth } from "@/lib/auth";
import { createSavedSearch, deleteSavedSearch } from "@/lib/saved-searches";

export type SavedSearchActionState = { error: string } | { success: true } | null;

export async function createSavedSearchAction(
  _prevState: SavedSearchActionState,
  formData: FormData
): Promise<SavedSearchActionState> {
  const t = await getTranslations("panel");
  const session = await auth();
  if (!session) {
    return { error: t("errorSaveSearchMustLogin") };
  }

  const parsed = createSavedSearchSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? t("errorFormInvalid") };
  }

  await createSavedSearch(session.user.id, parsed.data);

  revalidatePath("/panel/ev-sahibi");
  revalidatePath("/panel/muteahhit");
  return { success: true };
}

export async function deleteSavedSearchAction(id: string) {
  const session = await auth();
  if (!session) return;

  await deleteSavedSearch(session.user.id, id);

  revalidatePath("/panel/ev-sahibi");
  revalidatePath("/panel/muteahhit");
}
