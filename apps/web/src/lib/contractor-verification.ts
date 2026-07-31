import { Prisma, prisma } from "@donusum-kapisi/db";
import type {
  ContractorDocumentStatus,
  ContractorDocumentType,
  ContractorVerificationStatus,
} from "@donusum-kapisi/db";
import {
  CONTRACTOR_DOCUMENT_TYPES,
  type ContractorDocumentsInput,
  type ReviewContractorDocumentInput,
} from "@donusum-kapisi/shared";
import {
  deleteContractorDocument,
  uploadContractorDocument,
} from "@/lib/storage/contractor-documents";

export class MybnAlreadyUsedError extends Error {}

export type ContractorVerification = NonNullable<
  Awaited<ReturnType<typeof getContractorVerification>>
>;

export async function getContractorVerification(userId: string) {
  return prisma.contractorProfile.findUnique({
    where: { userId },
    include: { documents: { orderBy: { type: "asc" } } },
  });
}

/**
 * The profile status is never set by hand: it always follows the documents, so a
 * re-upload automatically pulls an approved contractor back into the review queue.
 */
function deriveVerificationStatus(
  documents: { type: ContractorDocumentType; status: ContractorDocumentStatus }[]
): ContractorVerificationStatus {
  const present = new Set(documents.map((document) => document.type));
  if (CONTRACTOR_DOCUMENT_TYPES.some((type) => !present.has(type))) return "INCOMPLETE";
  if (documents.some((document) => document.status === "REJECTED")) return "REJECTED";
  if (documents.every((document) => document.status === "APPROVED")) return "APPROVED";
  return "PENDING";
}

async function syncVerificationStatus(profileId: string) {
  const documents = await prisma.contractorDocument.findMany({
    where: { profileId },
    select: { type: true, status: true },
  });
  const status = deriveVerificationStatus(documents);

  return prisma.contractorProfile.update({
    where: { id: profileId },
    data: {
      verificationStatus: status,
      verified: status === "APPROVED",
      reviewedAt: status === "APPROVED" || status === "REJECTED" ? new Date() : null,
      submittedAt: status === "INCOMPLETE" ? null : undefined,
    },
  });
}

export async function submitContractorDocuments(
  userId: string,
  input: ContractorDocumentsInput,
  files: Partial<Record<ContractorDocumentType, File>>
) {
  let profile;
  try {
    profile = await prisma.contractorProfile.upsert({
      where: { userId },
      create: { userId, companyName: input.companyName, mybn: input.mybn },
      update: { companyName: input.companyName, mybn: input.mybn, verificationNote: null },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new MybnAlreadyUsedError();
    }
    throw error;
  }

  for (const type of CONTRACTOR_DOCUMENT_TYPES) {
    const file = files[type];
    if (!file) continue;

    const previous = await prisma.contractorDocument.findUnique({
      where: { profileId_type: { profileId: profile.id, type } },
      select: { url: true },
    });

    const url = await uploadContractorDocument(file, userId, type);
    const data = {
      url,
      fileName: file.name,
      mimeType: file.type,
      size: file.size,
      status: "PENDING" as const,
      reviewNote: null,
      reviewedAt: null,
    };

    await prisma.contractorDocument.upsert({
      where: { profileId_type: { profileId: profile.id, type } },
      create: { profileId: profile.id, type, ...data },
      update: data,
    });

    if (previous) await deleteContractorDocument(previous.url);
  }

  const documentCount = await prisma.contractorDocument.count({ where: { profileId: profile.id } });
  if (documentCount === CONTRACTOR_DOCUMENT_TYPES.length && !profile.submittedAt) {
    await prisma.contractorProfile.update({
      where: { id: profile.id },
      data: { submittedAt: new Date() },
    });
  }

  return syncVerificationStatus(profile.id);
}

export async function reviewContractorDocument(
  documentId: string,
  input: ReviewContractorDocumentInput
) {
  const document = await prisma.contractorDocument.update({
    where: { id: documentId },
    data: {
      status: input.status,
      reviewNote: input.reviewNote || null,
      reviewedAt: new Date(),
    },
    select: { profileId: true },
  });

  return syncVerificationStatus(document.profileId);
}

export async function approveAllContractorDocuments(profileId: string) {
  await prisma.contractorDocument.updateMany({
    where: { profileId },
    data: { status: "APPROVED", reviewNote: null, reviewedAt: new Date() },
  });
  await prisma.contractorProfile.update({
    where: { id: profileId },
    data: { verificationNote: null },
  });

  return syncVerificationStatus(profileId);
}

/** Rejects the whole application with one note, without singling out a document. */
export async function rejectContractorVerification(profileId: string, note: string) {
  await prisma.contractorProfile.update({
    where: { id: profileId },
    data: {
      verificationStatus: "REJECTED",
      verificationNote: note,
      verified: false,
      reviewedAt: new Date(),
    },
  });
}

export async function listContractorVerifications() {
  return prisma.contractorProfile.findMany({
    include: {
      user: { select: { name: true, email: true, phone: true } },
      documents: { orderBy: { type: "asc" } },
    },
    orderBy: [{ submittedAt: "asc" }, { updatedAt: "desc" }],
  });
}

export async function isContractorApproved(userId: string) {
  const profile = await prisma.contractorProfile.findUnique({
    where: { userId },
    select: { verificationStatus: true },
  });
  return profile?.verificationStatus === "APPROVED";
}
