import type {
  Appointment,
  BlogPost,
  ContractorProfile,
  Listing,
  Offer,
  PortfolioItem,
  Review,
  SavedSearch,
} from "@donusum-kapisi/db";
import type {
  AppointmentDTO,
  BlogPostDTO,
  ContractorProfileDTO,
  ListingDTO,
  OfferDTO,
  PortfolioItemDTO,
  ReviewDTO,
  SavedSearchDTO,
} from "@donusum-kapisi/shared";

/**
 * Eski seed verileri fotoğrafları web'in /public'inden göreli yolla
 * (örn. "/listings/kadikoy.jpg") sunuyor — bu tarayıcıda sayfa origin'ine göre
 * otomatik tamamlanır ama mobilde mutlak URL gerekir. Yeni yüklenen ilanlar
 * zaten Vercel Blob'un mutlak URL'ini kullanıyor, bu sadece geriye dönük.
 */
function resolveImageUrl(url: string, baseUrl: string): string {
  return /^https?:\/\//.test(url) ? url : new URL(url, baseUrl).toString();
}

export function toListingDTO(listing: Listing, baseUrl: string): ListingDTO {
  return {
    id: listing.id,
    listingNumber: listing.listingNumber,
    ownerId: listing.ownerId,
    title: listing.title,
    description: listing.description,
    province: listing.province,
    district: listing.district,
    squareMeters: listing.squareMeters,
    buildingAge: listing.buildingAge,
    floorCount: listing.floorCount,
    unitCount: listing.unitCount,
    priceMin: listing.priceMin,
    priceMax: listing.priceMax,
    coverImageUrl: listing.coverImageUrl
      ? resolveImageUrl(listing.coverImageUrl, baseUrl)
      : listing.coverImageUrl,
    photos: listing.photos.map((photo) => resolveImageUrl(photo, baseUrl)),
    latitude: listing.latitude,
    longitude: listing.longitude,
    viewCount: listing.viewCount,
    status: listing.status,
    createdAt: listing.createdAt.toISOString(),
    updatedAt: listing.updatedAt.toISOString(),
  };
}

export function toOfferDTO(offer: Offer): OfferDTO {
  return {
    id: offer.id,
    listingId: offer.listingId,
    contractorId: offer.contractorId,
    priceMin: offer.priceMin,
    priceMax: offer.priceMax,
    durationMonths: offer.durationMonths,
    note: offer.note,
    status: offer.status,
    contactResolvedAt: offer.contactResolvedAt?.toISOString() ?? null,
    createdAt: offer.createdAt.toISOString(),
    updatedAt: offer.updatedAt.toISOString(),
  };
}

export function toContractorProfileDTO(
  profile: ContractorProfile,
  ratingSummary: { averageRating: number | null; reviewCount: number } = {
    averageRating: null,
    reviewCount: 0,
  }
): ContractorProfileDTO {
  return {
    id: profile.id,
    userId: profile.userId,
    companyName: profile.companyName,
    about: profile.about,
    documentUrls: profile.documentUrls,
    verified: profile.verified,
    updatedAt: profile.updatedAt.toISOString(),
    averageRating: ratingSummary.averageRating,
    reviewCount: ratingSummary.reviewCount,
  };
}

export function toReviewDTO(review: Review, reviewerName: string | null): ReviewDTO {
  return {
    id: review.id,
    offerId: review.offerId,
    contractorId: review.contractorId,
    rating: review.rating,
    comment: review.comment,
    reviewerName,
    createdAt: review.createdAt.toISOString(),
  };
}

export function toSavedSearchDTO(search: SavedSearch): SavedSearchDTO {
  return {
    id: search.id,
    userId: search.userId,
    name: search.name,
    province: search.province,
    q: search.q,
    maxBuildingAge: search.maxBuildingAge,
    minSquareMeters: search.minSquareMeters,
    createdAt: search.createdAt.toISOString(),
  };
}

export function toPortfolioItemDTO(item: PortfolioItem): PortfolioItemDTO {
  return {
    id: item.id,
    contractorId: item.contractorId,
    title: item.title,
    description: item.description,
    beforeImageUrl: item.beforeImageUrl,
    afterImageUrl: item.afterImageUrl,
    createdAt: item.createdAt.toISOString(),
  };
}

export function toAppointmentDTO(appointment: Appointment): AppointmentDTO {
  return {
    id: appointment.id,
    offerId: appointment.offerId,
    scheduledAt: appointment.scheduledAt.toISOString(),
    location: appointment.location,
    note: appointment.note,
    status: appointment.status,
    createdAt: appointment.createdAt.toISOString(),
    updatedAt: appointment.updatedAt.toISOString(),
  };
}

export function toBlogPostDTO(post: BlogPost): BlogPostDTO {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    body: post.body,
    coverImageUrl: post.coverImageUrl,
    published: post.published,
    authorId: post.authorId,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
}
