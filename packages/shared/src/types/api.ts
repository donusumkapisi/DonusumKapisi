export type UserRole = "HOMEOWNER" | "CONTRACTOR" | "ADMIN";
export type ListingStatus = "PENDING" | "APPROVED" | "REJECTED" | "CLOSED";
export type OfferStatus = "PENDING" | "INTERESTED" | "DECLINED" | "WITHDRAWN";

export type AuthUserDTO = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
};

export type AuthResponseDTO = {
  token: string;
  user: AuthUserDTO;
};

export type ListingDTO = {
  id: string;
  listingNumber: string;
  ownerId: string;
  title: string;
  description: string;
  province: string;
  district: string;
  squareMeters: number;
  buildingAge: number;
  floorCount: number;
  unitCount: number;
  priceMin: number;
  priceMax: number;
  coverImageUrl: string | null;
  photos: string[];
  latitude: number | null;
  longitude: number | null;
  viewCount: number;
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
};

export type OfferDTO = {
  id: string;
  listingId: string;
  contractorId: string;
  priceMin: number;
  priceMax: number;
  durationMonths: number | null;
  note: string | null;
  status: OfferStatus;
  contactResolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ContractorProfileDTO = {
  id: string;
  userId: string;
  companyName: string | null;
  about: string | null;
  mybn: string | null;
  verificationStatus: "INCOMPLETE" | "PENDING" | "APPROVED" | "REJECTED";
  verificationNote: string | null;
  /** @deprecated Use the typed verification endpoints; kept for older mobile builds. */
  documentUrls: string[];
  verified: boolean;
  updatedAt: string;
  averageRating: number | null;
  reviewCount: number;
};

export type ReviewDTO = {
  id: string;
  offerId: string;
  contractorId: string;
  rating: number;
  comment: string | null;
  reviewerName: string | null;
  createdAt: string;
};

export type SavedSearchDTO = {
  id: string;
  userId: string;
  name: string;
  province: string | null;
  q: string | null;
  maxBuildingAge: number | null;
  minSquareMeters: number | null;
  createdAt: string;
};

export type PortfolioItemDTO = {
  id: string;
  contractorId: string;
  title: string;
  description: string | null;
  beforeImageUrl: string | null;
  afterImageUrl: string | null;
  createdAt: string;
};

export type AppointmentStatus = "PROPOSED" | "CONFIRMED" | "CANCELLED";

export type AppointmentDTO = {
  id: string;
  offerId: string;
  scheduledAt: string;
  location: string | null;
  note: string | null;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
};

export type NotificationPreferencesDTO = {
  notifyListingStatus: boolean;
  notifyOffers: boolean;
  notifyAppointments: boolean;
  notifySavedSearch: boolean;
};

export type BlogPostDTO = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImageUrl: string | null;
  published: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
};
