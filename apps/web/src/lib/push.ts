import { Expo, type ExpoPushMessage } from "expo-server-sdk";
import { prisma } from "@donusum-kapisi/db";

const expo = new Expo();

export type NotificationCategory = "LISTING_STATUS" | "OFFERS" | "APPOINTMENTS" | "SAVED_SEARCH";

const CATEGORY_FIELD = {
  LISTING_STATUS: "notifyListingStatus",
  OFFERS: "notifyOffers",
  APPOINTMENTS: "notifyAppointments",
  SAVED_SEARCH: "notifySavedSearch",
} as const;

export async function sendPushNotification(
  userId: string,
  message: { title: string; body: string; data?: Record<string, unknown> },
  category: NotificationCategory
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { pushTokens: true },
  });
  if (!user || !user[CATEGORY_FIELD[category]]) return;

  const messages: ExpoPushMessage[] = user.pushTokens
    .filter((t) => Expo.isExpoPushToken(t.token))
    .map((t) => ({
      to: t.token,
      title: message.title,
      body: message.body,
      data: message.data,
      sound: "default",
    }));

  if (messages.length === 0) return;

  try {
    const chunks = expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk);
    }
  } catch (error) {
    console.error("Push bildirimi gönderilemedi:", error);
  }
}
