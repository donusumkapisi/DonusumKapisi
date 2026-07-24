import { prisma } from "@donusum-kapisi/db";
import type { CreateSavedSearchInput } from "@donusum-kapisi/shared";
import type { Listing, SavedSearch } from "@donusum-kapisi/db";
import { sendPushNotification } from "@/lib/push";

export class SavedSearchNotFoundError extends Error {}

export async function createSavedSearch(userId: string, input: CreateSavedSearchInput) {
  return prisma.savedSearch.create({
    data: {
      userId,
      name: input.name,
      province: input.province || null,
      q: input.q || null,
      maxBuildingAge: input.maxBuildingAge ?? null,
      minSquareMeters: input.minSquareMeters ?? null,
    },
  });
}

export async function listSavedSearches(userId: string) {
  return prisma.savedSearch.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export async function deleteSavedSearch(userId: string, id: string) {
  const search = await prisma.savedSearch.findUnique({ where: { id } });
  if (!search || search.userId !== userId) {
    throw new SavedSearchNotFoundError("Kayıtlı arama bulunamadı.");
  }
  await prisma.savedSearch.delete({ where: { id } });
}

function matchesListing(search: SavedSearch, listing: Listing) {
  if (search.province && search.province !== listing.province) return false;
  if (search.maxBuildingAge !== null && listing.buildingAge > search.maxBuildingAge) return false;
  if (search.minSquareMeters !== null && listing.squareMeters < search.minSquareMeters) return false;
  if (search.q) {
    const needle = search.q.toLowerCase();
    const haystack = `${listing.title} ${listing.district}`.toLowerCase();
    if (!haystack.includes(needle)) return false;
  }
  return true;
}

export async function notifySavedSearchMatches(listing: Listing) {
  const searches = await prisma.savedSearch.findMany({ where: { userId: { not: listing.ownerId } } });
  const matches = searches.filter((search) => matchesListing(search, listing));

  await Promise.all(
    matches.map((search) =>
      sendPushNotification(
        search.userId,
        {
          title: "Kayıtlı aramanızla eşleşen yeni ilan",
          body: `"${search.name}" aramanıza uyan yeni bir ilan yayınlandı: ${listing.title}`,
          data: { listingNumber: listing.listingNumber },
        },
        "SAVED_SEARCH"
      )
    )
  );
}
