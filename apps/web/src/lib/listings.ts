import { prisma } from "@donusum-kapisi/db";
import type { ListingStatus, Prisma } from "@donusum-kapisi/db";
import { sendPushNotification } from "@/lib/push";
import { notifySavedSearchMatches } from "@/lib/saved-searches";

export async function getFeaturedListings(limit = 3) {
  return prisma.listing.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getListingForDetail(listingNumber: string) {
  const listing = await prisma.listing.findUnique({ where: { listingNumber } });
  if (!listing || listing.status !== "APPROVED") return null;

  return prisma.listing.update({
    where: { listingNumber },
    data: { viewCount: { increment: 1 } },
  });
}

export { formatPriceRange } from "./format";

const STATUS_MESSAGES: Partial<Record<ListingStatus, { title: string; body: (title: string) => string }>> = {
  APPROVED: {
    title: "İlanınız onaylandı",
    body: (title) => `"${title}" ilanınız yayına alındı.`,
  },
  REJECTED: {
    title: "İlanınız reddedildi",
    body: (title) => `"${title}" ilanınız onaylanmadı.`,
  },
};

export async function setListingStatus(
  where: Prisma.ListingWhereUniqueInput,
  status: ListingStatus
) {
  const listing = await prisma.listing.update({ where, data: { status } });

  const message = STATUS_MESSAGES[status];
  if (message) {
    await sendPushNotification(
      listing.ownerId,
      {
        title: message.title,
        body: message.body(listing.title),
        data: { listingNumber: listing.listingNumber },
      },
      "LISTING_STATUS"
    );
  }

  if (status === "APPROVED") {
    await notifySavedSearchMatches(listing);
  }

  return listing;
}
