import { z } from "zod";

export const updateNotificationPreferencesSchema = z.object({
  notifyListingStatus: z.boolean(),
  notifyOffers: z.boolean(),
  notifyAppointments: z.boolean(),
  notifySavedSearch: z.boolean(),
});

export type UpdateNotificationPreferencesInput = z.infer<typeof updateNotificationPreferencesSchema>;
