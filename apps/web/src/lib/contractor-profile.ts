import { prisma } from "@donusum-kapisi/db";
import type { UpdateContractorProfileInput } from "@donusum-kapisi/shared";
import { uploadContractorDocuments } from "@/lib/storage/contractor-documents";

export async function getContractorProfile(userId: string) {
  return prisma.contractorProfile.findUnique({ where: { userId } });
}

export async function updateContractorProfile(
  userId: string,
  input: UpdateContractorProfileInput,
  newDocuments: File[]
) {
  const uploadedUrls =
    newDocuments.length > 0 ? await uploadContractorDocuments(newDocuments, userId) : [];

  return prisma.contractorProfile.upsert({
    where: { userId },
    create: {
      userId,
      companyName: input.companyName,
      about: input.about,
      documentUrls: uploadedUrls,
    },
    update: {
      companyName: input.companyName,
      about: input.about,
      ...(uploadedUrls.length > 0 ? { documentUrls: { push: uploadedUrls } } : {}),
    },
  });
}

export async function setContractorVerified(profileId: string, verified: boolean) {
  return prisma.contractorProfile.update({ where: { id: profileId }, data: { verified } });
}
