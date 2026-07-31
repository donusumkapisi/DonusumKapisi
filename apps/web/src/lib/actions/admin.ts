"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@donusum-kapisi/db";
import type { ListingStatus, UserRole } from "@donusum-kapisi/db";
import { auth } from "@/lib/auth";
import { cancelAppointmentAsAdmin } from "@/lib/appointments";
import { setListingStatus } from "@/lib/listings";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Yetkiniz yok.");
  }
  return session;
}

/** Every admin screen reads from the same tables, so they all refresh together. */
function revalidateAdmin() {
  revalidatePath("/panel/admin", "layout");
}

export async function updateListingStatusAction(listingId: string, status: ListingStatus) {
  await requireAdmin();

  await setListingStatus({ id: listingId }, status);

  revalidateAdmin();
  revalidatePath("/ilanlar");
}

export async function resolveOfferContactAction(offerId: string) {
  await requireAdmin();

  await prisma.offer.update({ where: { id: offerId }, data: { contactResolvedAt: new Date() } });

  revalidateAdmin();
}

export async function reopenOfferContactAction(offerId: string) {
  await requireAdmin();

  await prisma.offer.update({ where: { id: offerId }, data: { contactResolvedAt: null } });

  revalidateAdmin();
}

export async function cancelAppointmentAsAdminAction(appointmentId: string) {
  await requireAdmin();

  await cancelAppointmentAsAdmin(appointmentId);

  revalidateAdmin();
  revalidatePath("/panel/ev-sahibi");
  revalidatePath("/panel/muteahhit");
}

export async function updateUserRoleAction(userId: string, role: UserRole) {
  const session = await requireAdmin();

  // Demoting yourself would lock you out of the panel mid-session.
  if (session.user.id === userId) {
    throw new Error("Kendi rolünüzü değiştiremezsiniz.");
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });

  revalidateAdmin();
}
