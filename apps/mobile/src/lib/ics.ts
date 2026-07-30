import { Directory, File, Paths } from "expo-file-system";
import { getStoredSession } from "./storage";

const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? "https://www.donusumkapisi.com").replace(
  /\/$/,
  ""
);

export async function downloadAndShareAppointmentIcs(appointmentId: string) {
  const session = await getStoredSession();
  if (!session) throw new Error("Giriş yapmalısınız.");

  const destination = new File(new Directory(Paths.cache), `randevu-${appointmentId}.ics`);
  const file = await File.downloadFileAsync(
    `${API_URL}/api/mobile/v1/appointments/${appointmentId}/ics`,
    destination,
    { headers: { Authorization: `Bearer ${session.token}` }, idempotent: true }
  );

  const Sharing = await import("expo-sharing");
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, { mimeType: "text/calendar" });
  }
}
