import { put } from "@vercel/blob";

function extensionFor(mimeType: string) {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

export async function uploadBlogCoverImage(file: File, slug: string): Promise<string> {
  const fileName = `blog/${slug}/cover.${extensionFor(file.type)}`;
  const blob = await put(fileName, file, { access: "public", addRandomSuffix: true });
  return blob.url;
}
