import { prisma } from "@donusum-kapisi/db";
import type { CreatePortfolioItemInput } from "@donusum-kapisi/shared";
import { uploadPortfolioImage } from "@/lib/storage/portfolio-photos";

export class PortfolioItemNotFoundError extends Error {}

export async function createPortfolioItem(
  contractorId: string,
  input: CreatePortfolioItemInput,
  beforeFile: File | null,
  afterFile: File | null
) {
  const item = await prisma.portfolioItem.create({
    data: { contractorId, title: input.title, description: input.description ?? null },
  });

  const [beforeImageUrl, afterImageUrl] = await Promise.all([
    beforeFile ? uploadPortfolioImage(beforeFile, contractorId, item.id, "before") : null,
    afterFile ? uploadPortfolioImage(afterFile, contractorId, item.id, "after") : null,
  ]);

  if (!beforeImageUrl && !afterImageUrl) return item;

  return prisma.portfolioItem.update({
    where: { id: item.id },
    data: {
      ...(beforeImageUrl ? { beforeImageUrl } : {}),
      ...(afterImageUrl ? { afterImageUrl } : {}),
    },
  });
}

export async function listPortfolioItems(contractorId: string) {
  return prisma.portfolioItem.findMany({ where: { contractorId }, orderBy: { createdAt: "desc" } });
}

export async function deletePortfolioItem(contractorId: string, id: string) {
  const item = await prisma.portfolioItem.findUnique({ where: { id } });
  if (!item || item.contractorId !== contractorId) {
    throw new PortfolioItemNotFoundError("Portföy öğesi bulunamadı.");
  }
  await prisma.portfolioItem.delete({ where: { id } });
}
