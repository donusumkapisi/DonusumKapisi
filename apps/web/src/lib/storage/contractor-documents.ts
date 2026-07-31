import { del, put } from "@vercel/blob";
import type { ContractorDocumentType } from "@donusum-kapisi/db";

function extensionFor(mimeType: string) {
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

export async function uploadContractorDocument(
  file: File,
  userId: string,
  type: ContractorDocumentType
): Promise<string> {
  const fileName = `contractors/${userId}/${type.toLowerCase()}.${extensionFor(file.type)}`;
  const blob = await put(fileName, file, { access: "public", addRandomSuffix: true });
  return blob.url;
}

/** Replacing a document leaves the previous blob behind; drop it so storage stays tidy. */
export async function deleteContractorDocument(url: string) {
  try {
    await del(url);
  } catch {
    // A missing or already-deleted blob must not fail the upload that replaced it.
  }
}
