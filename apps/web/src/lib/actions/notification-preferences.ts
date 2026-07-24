"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { updateNotificationPreferences } from "@/lib/notification-preferences";

export type NotificationPreferencesActionState = { error: string } | { success: true } | null;

export async function updateNotificationPreferencesAction(
  _prevState: NotificationPreferencesActionState,
  formData: FormData
): Promise<NotificationPreferencesActionState> {
  const t = await getTranslations("panel");
  const session = await auth();
  if (!session) return { error: t("errorMustLogin") };

  await updateNotificationPreferences(session.user.id, {
    notifyListingStatus: formData.get("notifyListingStatus") === "on",
    notifyOffers: formData.get("notifyOffers") === "on",
    notifyAppointments: formData.get("notifyAppointments") === "on",
    notifySavedSearch: formData.get("notifySavedSearch") === "on",
  });

  revalidatePath("/panel/ev-sahibi");
  revalidatePath("/panel/muteahhit");
  return { success: true };
}
