"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@donusum-kapisi/db";
import type { ListingStatus } from "@donusum-kapisi/db";
import { auth } from "@/lib/auth";
import { setListingStatus } from "@/lib/listings";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Yetkiniz yok.");
  }
}

export async function updateListingStatusAction(listingId: string, status: ListingStatus) {
  await requireAdmin();

  await setListingStatus({ id: listingId }, status);

  revalidatePath("/panel/admin");
  revalidatePath("/ilanlar");
}

export async function resolveOfferContactAction(offerId: string) {
  await requireAdmin();

  await prisma.offer.update({ where: { id: offerId }, data: { contactResolvedAt: new Date() } });

  revalidatePath("/panel/admin");
}
