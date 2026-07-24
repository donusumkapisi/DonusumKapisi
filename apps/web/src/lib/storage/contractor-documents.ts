import { put } from "@vercel/blob";

function extensionFor(mimeType: string) {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

export async function uploadContractorDocuments(files: File[], userId: string): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const fileName = `contractors/${userId}/${Date.now()}.${extensionFor(file.type)}`;
    const blob = await put(fileName, file, {
      access: "public",
      addRandomSuffix: true,
    });
    urls.push(blob.url);
  }
  return urls;
}
