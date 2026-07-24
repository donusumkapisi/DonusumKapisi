import { prisma } from "@donusum-kapisi/db";
import type { UpdateNotificationPreferencesInput } from "@donusum-kapisi/shared";

const PREFERENCE_SELECT = {
  notifyListingStatus: true,
  notifyOffers: true,
  notifyAppointments: true,
  notifySavedSearch: true,
} as const;

export async function getNotificationPreferences(userId: string) {
  return prisma.user.findUniqueOrThrow({ where: { id: userId }, select: PREFERENCE_SELECT });
}

export async function updateNotificationPreferences(
  userId: string,
  input: UpdateNotificationPreferencesInput
) {
  return prisma.user.update({ where: { id: userId }, data: input, select: PREFERENCE_SELECT });
}
