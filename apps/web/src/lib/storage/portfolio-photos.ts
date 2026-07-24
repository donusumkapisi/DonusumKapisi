import { put } from "@vercel/blob";

function extensionFor(mimeType: string) {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

export async function uploadPortfolioImage(
  file: File,
  contractorId: string,
  itemId: string,
  label: "before" | "after"
): Promise<string> {
  const fileName = `portfolio/${contractorId}/${itemId}/${label}.${extensionFor(file.type)}`;
  const blob = await put(fileName, file, { access: "public", addRandomSuffix: false });
  return blob.url;
}
