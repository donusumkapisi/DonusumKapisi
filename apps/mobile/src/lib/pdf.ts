import { Directory, File, Paths } from "expo-file-system";
import { getStoredSession } from "./storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export async function downloadAndShareOffersPdf(listingNumber: string) {
  const session = await getStoredSession();
  if (!session) throw new Error("Giriş yapmalısınız.");

  const destination = new File(new Directory(Paths.cache), `ilan-${listingNumber}-teklifler.pdf`);
  const file = await File.downloadFileAsync(
    `${API_URL}/api/mobile/v1/panel/offers/pdf?listingNumber=${listingNumber}`,
    destination,
    { headers: { Authorization: `Bearer ${session.token}` }, idempotent: true }
  );

  const Sharing = await import("expo-sharing");
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, { mimeType: "application/pdf" });
  }
}
