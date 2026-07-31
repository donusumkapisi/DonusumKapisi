"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { updateContractorProfileSchema } from "@donusum-kapisi/shared";
import { auth } from "@/lib/auth";
import { updateContractorProfile } from "@/lib/contractor-profile";

export type ContractorProfileActionState = { error: string } | { success: true } | null;

export async function updateContractorProfileAction(
  _prevState: ContractorProfileActionState,
  formData: FormData
): Promise<ContractorProfileActionState> {
  const t = await getTranslations("panel");
  const session = await auth();
  if (!session || session.user.role !== "CONTRACTOR") {
    return { error: t("errorMustBeContractor") };
  }

  const parsed = updateContractorProfileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? t("errorFormInvalid") };
  }

  await updateContractorProfile(session.user.id, parsed.data);

  revalidatePath("/panel/muteahhit");
  return { success: true };
}