import { put } from "@vercel/blob";

function extensionFor(mimeType: string) {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

export async function uploadAnnouncementImage(
  file: File,
  announcementId: string
): Promise<string> {
  const fileName = `announcements/${announcementId}/image.${extensionFor(file.type)}`;
  const blob = await put(fileName, file, { access: "public", addRandomSuffix: true });
  return blob.url;
}
