"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import type { ContractorDocumentType } from "@donusum-kapisi/db";
import {
  CONTRACTOR_DOCUMENT_TYPES,
  contractorDocumentsSchema,
  reviewContractorDocumentSchema,
  validateContractorDocumentFile,
} from "@donusum-kapisi/shared";
import { auth } from "@/lib/auth";
import {
  approveAllContractorDocuments,
  getContractorVerification,
  MybnAlreadyUsedError,
  rejectContractorVerification,
  reviewContractorDocument,
  submitContractorDocuments,
} from "@/lib/contractor-verification";

export type ContractorDocumentsActionState = { error: string } | { success: true } | null;

export async function submitContractorDocumentsAction(
  _prevState: ContractorDocumentsActionState,
  formData: FormData
): Promise<ContractorDocumentsActionState> {
  const t = await getTranslations("contractorDocs");
  const session = await auth();
  if (!session || session.user.role !== "CONTRACTOR") {
    return { error: t("errorMustBeContractor") };
  }

  const parsed = contractorDocumentsSchema.safeParse({
    companyName: formData.get("companyName"),
    mybn: formData.get("mybn"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? t("errorFormInvalid") };
  }

  const files: Partial<Record<ContractorDocumentType, File>> = {};
  for (const type of CONTRACTOR_DOCUMENT_TYPES) {
    const entry = formData.get(type);
    if (!(entry instanceof File) || entry.size === 0) continue;

    const fileError = validateContractorDocumentFile(entry);
    if (fileError) return { error: `${t(`type.${type}`)}: ${fileError}` };
    files[type] = entry;
  }

  const existing = await getContractorVerification(session.user.id);
  const alreadyUploaded = new Set(existing?.documents.map((document) => document.type) ?? []);
  const missing = CONTRACTOR_DOCUMENT_TYPES.filter(
    (type) => !files[type] && !alreadyUploaded.has(type)
  );
  if (missing.length > 0) {
    return { error: t("errorMissingDocuments", { list: missing.map((type) => t(`type.${type}`)).join(", ") }) };
  }

  try {
    await submitContractorDocuments(session.user.id, parsed.data, files);
  } catch (error) {
    if (error instanceof MybnAlreadyUsedError) {
      return { error: t("errorMybnInUse") };
    }
    throw error;
  }

  revalidatePath("/panel/muteahhit");
  revalidatePath("/panel/muteahhit/belgeler");
  revalidatePath("/panel/admin/dogrulama");
  return { success: true };
}

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Yetkiniz yok.");
  }
}

function revalidateReview() {
  revalidatePath("/panel/admin/dogrulama");
  revalidatePath("/panel/admin");
  revalidatePath("/panel/muteahhit");
}

export async function reviewContractorDocumentAction(
  documentId: string,
  status: "APPROVED" | "REJECTED",
  reviewNote?: string
) {
  await requireAdmin();

  const parsed = reviewContractorDocumentSchema.safeParse({ status, reviewNote });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Geçersiz karar.");
  }

  await reviewContractorDocument(documentId, parsed.data);
  revalidateReview();
}

export async function approveContractorAction(profileId: string) {
  await requireAdmin();
  await approveAllContractorDocuments(profileId);
  revalidateReview();
}

export async function rejectContractorAction(profileId: string, note: string) {
  await requireAdmin();

  const trimmed = note.trim();
  if (trimmed.length < 3) {
    throw new Error("Ret gerekçesi yazın.");
  }

  await rejectContractorVerification(profileId, trimmed);
  revalidateReview();
}
