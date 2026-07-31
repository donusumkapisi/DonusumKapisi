import { prisma } from "@donusum-kapisi/db";
import type { UpdateContractorProfileInput } from "@donusum-kapisi/shared";
import {
  approveAllContractorDocuments,
  rejectContractorVerification,
} from "@/lib/contractor-verification";

export async function getContractorProfile(userId: string) {
  return prisma.contractorProfile.findUnique({
    where: { userId },
    include: { documents: { select: { url: true } } },
  });
}

/** Company details only — evraklar `contractor-verification` üzerinden yönetilir. */
export async function updateContractorProfile(
  userId: string,
  input: UpdateContractorProfileInput
) {
  await prisma.contractorProfile.upsert({
    where: { userId },
    create: { userId, companyName: input.companyName, about: input.about },
    update: { companyName: input.companyName, about: input.about },
  });

  return prisma.contractorProfile.findUniqueOrThrow({
    where: { userId },
    include: { documents: { select: { url: true } } },
  });
}

export async function setContractorVerified(profileId: string, verified: boolean) {
  if (verified) {
    return approveAllContractorDocuments(profileId);
  }

  await rejectContractorVerification(profileId, "Doğrulama yönetici tarafından geri alındı.");
  return prisma.contractorProfile.findUniqueOrThrow({ where: { id: profileId } });
}
