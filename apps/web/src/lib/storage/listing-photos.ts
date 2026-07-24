import { put } from "@vercel/blob";

function extensionFor(mimeType: string) {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

export async function uploadListingPhotos(
  files: File[],
  listingNumber: string
): Promise<string[]> {
  const urls: string[] = [];
  for (const [index, file] of files.entries()) {
    const fileName = `listings/${listingNumber}/${index + 1}.${extensionFor(file.type)}`;
    const blob = await put(fileName, file, {
      access: "public",
      addRandomSuffix: false,
    });
    urls.push(blob.url);
  }
  return urls;
}
