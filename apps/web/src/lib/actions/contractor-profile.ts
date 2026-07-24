"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { updateContractorProfileSchema, validateListingPhotos } from "@donusum-kapisi/shared";
import { auth } from "@/lib/auth";
import { updateContractorProfile, setContractorVerified } from "@/lib/contractor-profile";

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

  const documentFiles = formData
    .getAll("documents")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (documentFiles.length > 0) {
    const photoError = validateListingPhotos(documentFiles);
    if (photoError) return { error: photoError };
  }

  await updateContractorProfile(session.user.id, parsed.data, documentFiles);

  revalidatePath("/panel/muteahhit");
  return { success: true };
}

export async function verifyContractorAction(profileId: string, verified: boolean) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Yetkiniz yok.");
  }

  await setContractorVerified(profileId, verified);
  revalidatePath("/panel/admin");
}
