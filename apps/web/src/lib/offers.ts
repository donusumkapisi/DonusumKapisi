import { prisma } from "@donusum-kapisi/db";
import type { OfferStatus } from "@donusum-kapisi/db";
import type { CreateOfferInput } from "@donusum-kapisi/shared";
import { sendPushNotification } from "@/lib/push";

export class ListingNotAvailableError extends Error {}
export class ForbiddenOfferActionError extends Error {}

export async function upsertOffer(
  listingNumber: string,
  contractorId: string,
  input: CreateOfferInput
) {
  const listing = await prisma.listing.findUnique({ where: { listingNumber } });
  if (!listing || listing.status !== "APPROVED") {
    throw new ListingNotAvailableError();
  }

  const existing = await prisma.offer.findUnique({
    where: { listingId_contractorId: { listingId: listing.id, contractorId } },
  });

  const offer = await prisma.offer.upsert({
    where: { listingId_contractorId: { listingId: listing.id, contractorId } },
    create: {
      listingId: listing.id,
      contractorId,
      priceMin: input.priceMin,
      priceMax: input.priceMax,
      durationMonths: input.durationMonths,
      note: input.note,
    },
    update: {
      priceMin: input.priceMin,
      priceMax: input.priceMax,
      durationMonths: input.durationMonths,
      note: input.note,
      status: "PENDING",
    },
  });

  await sendPushNotification(
    listing.ownerId,
    {
      title: existing ? "Teklif güncellendi" : "Yeni teklif aldınız",
      body: `"${listing.title}" ilanınız için bir teklif ${existing ? "güncellendi" : "geldi"}.`,
      data: { listingNumber: listing.listingNumber },
    },
    "OFFERS"
  );

  return offer;
}

const HOMEOWNER_ALLOWED_STATUSES = new Set<OfferStatus>(["INTERESTED", "DECLINED"]);
const CONTRACTOR_ALLOWED_STATUSES = new Set<OfferStatus>(["WITHDRAWN"]);

export async function updateOfferStatus(
  offerId: string,
  actor: { id: string; role: "HOMEOWNER" | "CONTRACTOR" },
  status: OfferStatus
) {
  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    include: { listing: true },
  });
  if (!offer) throw new ListingNotAvailableError();

  if (actor.role === "HOMEOWNER") {
    if (offer.listing.ownerId !== actor.id) throw new ForbiddenOfferActionError();
    if (!HOMEOWNER_ALLOWED_STATUSES.has(status)) throw new ForbiddenOfferActionError();
  } else {
    if (offer.contractorId !== actor.id) throw new ForbiddenOfferActionError();
    if (!CONTRACTOR_ALLOWED_STATUSES.has(status)) throw new ForbiddenOfferActionError();
  }

  const updated = await prisma.offer.update({ where: { id: offerId }, data: { status } });

  if (actor.role === "HOMEOWNER") {
    await sendPushNotification(
      offer.contractorId,
      {
        title: status === "INTERESTED" ? "Teklifinizle ilgileniliyor" : "Teklifiniz değerlendirildi",
        body:
          status === "INTERESTED"
            ? `"${offer.listing.title}" ilanının sahibi teklifinizle ilgileniyor.`
            : `"${offer.listing.title}" ilanının sahibi teklifinizle ilgilenmiyor.`,
        data: { listingNumber: offer.listing.listingNumber },
      },
      "OFFERS"
    );
  }

  return updated;
}
