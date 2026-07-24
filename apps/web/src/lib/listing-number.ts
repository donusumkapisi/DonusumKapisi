import { prisma } from "@donusum-kapisi/db";

/** Sahibinden tarzı 9 haneli rastgele, benzersiz ilan numarası üretir. */
export async function generateListingNumber(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = String(Math.floor(100_000_000 + Math.random() * 900_000_000));
    const existing = await prisma.listing.findUnique({
      where: { listingNumber: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
  }
  throw new Error("İlan numarası oluşturulamadı, lütfen tekrar deneyin.");
}
