import type {
  AppointmentDTO,
  AuthResponseDTO,
  BlogPostDTO,
  ContractorProfileDTO,
  CreateOfferInput,
  CreateReviewInput,
  CreateSavedSearchInput,
  ForgotPasswordInput,
  ListingDTO,
  ListingStatus,
  LogInInput,
  NotificationPreferencesDTO,
  OfferDTO,
  OfferStatus,
  PortfolioItemDTO,
  ProposeAppointmentInput,
  ResetPasswordInput,
  ReviewDTO,
  SavedSearchDTO,
  SignUpInput,
  UserRole,
} from "@donusum-kapisi/shared";
import { getStoredSession } from "./storage";

const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? "https://www.donusumkapisi.com").replace(
  /\/$/,
  ""
);

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  requireAuth = false
): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (requireAuth) {
    const session = await getStoredSession();
    if (session) headers.set("Authorization", `Bearer ${session.token}`);
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(data?.error ?? "Bir hata oluştu.", response.status);
  }
  return data as T;
}

export type RatingSummary = { averageRating: number | null; reviewCount: number };

export type OfferWithListing = OfferDTO & {
  listing: { listingNumber: string; title: string };
  contractor: { id: string; name: string | null };
  contractorRating: RatingSummary;
  hasReview: boolean;
  appointment: AppointmentDTO | null;
};

export type PublicContractorProfile = {
  name: string | null;
  profile: ContractorProfileDTO | null;
  ratingSummary: RatingSummary;
  reviews: ReviewDTO[];
  portfolio: PortfolioItemDTO[];
};

export type ListingWithOwner = ListingDTO & {
  owner: { name: string | null; email: string };
};

export type ContactQueueEntry = OfferDTO & {
  listing: {
    listingNumber: string;
    title: string;
    owner: { name: string | null; email: string; phone: string | null };
  };
  contractor: { name: string | null; email: string; phone: string | null };
  appointment: AppointmentDTO | null;
};

export type ContractorProfileWithUser = ContractorProfileDTO & {
  user: { name: string | null; email: string };
};

export const api = {
  login: (input: LogInInput) =>
    request<AuthResponseDTO>("/api/mobile/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  register: (input: SignUpInput) =>
    request<AuthResponseDTO>("/api/mobile/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  googleAuth: (idToken: string, role?: UserRole) =>
    request<AuthResponseDTO>("/api/mobile/v1/auth/google", {
      method: "POST",
      body: JSON.stringify({ idToken, role }),
    }),

  appleAuth: (identityToken: string, name?: string, role?: UserRole) =>
    request<AuthResponseDTO>("/api/mobile/v1/auth/apple", {
      method: "POST",
      body: JSON.stringify({ identityToken, name, role }),
    }),

  forgotPassword: (input: ForgotPasswordInput) =>
    request<{ message: string }>("/api/mobile/v1/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  resetPassword: (input: ResetPasswordInput) =>
    request<AuthResponseDTO>("/api/mobile/v1/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  listListings: (params: { il?: string; q?: string; maxYas?: string; minYas?: string; minM2?: string } = {}) => {
    const entries = Object.entries(params).filter(
      (entry): entry is [string, string] => Boolean(entry[1])
    );
    const qs = new URLSearchParams(entries).toString();
    return request<{ listings: ListingDTO[] }>(`/api/mobile/v1/listings${qs ? `?${qs}` : ""}`);
  },

  getListing: (listingNumber: string) =>
    request<{ listing: ListingDTO }>(`/api/mobile/v1/listings/${listingNumber}`),

  createListing: (formData: FormData) =>
    request<{ listing: ListingDTO }>(
      "/api/mobile/v1/listings",
      { method: "POST", body: formData },
      true
    ),

  myListings: () => request<{ listings: ListingDTO[] }>("/api/mobile/v1/panel/listings", {}, true),

  myOffers: () => request<{ offers: OfferWithListing[] }>("/api/mobile/v1/panel/offers", {}, true),

  createOffer: (listingNumber: string, input: CreateOfferInput) =>
    request<{ offer: OfferDTO }>(
      `/api/mobile/v1/listings/${listingNumber}/offers`,
      { method: "POST", body: JSON.stringify(input) },
      true
    ),

  updateOfferStatus: (offerId: string, status: OfferStatus) =>
    request<{ offer: OfferDTO }>(
      `/api/mobile/v1/offers/${offerId}`,
      { method: "PATCH", body: JSON.stringify({ status }) },
      true
    ),

  adminListings: () =>
    request<{ listings: ListingWithOwner[] }>("/api/mobile/v1/admin/listings", {}, true),

  updateListingStatus: (listingNumber: string, status: ListingStatus) =>
    request<{ listing: ListingDTO }>(
      `/api/mobile/v1/admin/listings/${listingNumber}`,
      { method: "PATCH", body: JSON.stringify({ status }) },
      true
    ),

  registerPushToken: (token: string) =>
    request<{ success: true }>(
      "/api/mobile/v1/push-tokens",
      { method: "POST", body: JSON.stringify({ token }) },
      true
    ),

  adminContactQueue: () =>
    request<{ offers: ContactQueueEntry[] }>("/api/mobile/v1/admin/contact-queue", {}, true),

  resolveOfferContact: (offerId: string) =>
    request<{ offer: OfferDTO }>(
      `/api/mobile/v1/admin/offers/${offerId}/resolve`,
      { method: "PATCH" },
      true
    ),

  getContractorProfile: () =>
    request<{ profile: ContractorProfileDTO | null }>(
      "/api/mobile/v1/contractor/profile",
      {},
      true
    ),

  updateContractorProfile: (formData: FormData) =>
    request<{ profile: ContractorProfileDTO }>(
      "/api/mobile/v1/contractor/profile",
      { method: "PATCH", body: formData },
      true
    ),

  adminContractors: () =>
    request<{ contractors: ContractorProfileWithUser[] }>(
      "/api/mobile/v1/admin/contractors",
      {},
      true
    ),

  verifyContractor: (profileId: string, verified: boolean) =>
    request<{ profile: ContractorProfileDTO }>(
      `/api/mobile/v1/admin/contractors/${profileId}/verify`,
      { method: "PATCH", body: JSON.stringify({ verified }) },
      true
    ),

  listBlogPosts: () => request<{ posts: BlogPostDTO[] }>("/api/mobile/v1/blog"),

  getBlogPost: (slug: string) =>
    request<{ post: BlogPostDTO }>(`/api/mobile/v1/blog/${slug}`),

  submitReview: (offerId: string, input: CreateReviewInput) =>
    request<{ review: ReviewDTO }>(
      `/api/mobile/v1/offers/${offerId}/review`,
      { method: "POST", body: JSON.stringify(input) },
      true
    ),

  getPublicContractorProfile: (userId: string) =>
    request<PublicContractorProfile>(`/api/mobile/v1/contractors/${userId}`),

  listSavedSearches: () =>
    request<{ searches: SavedSearchDTO[] }>("/api/mobile/v1/saved-searches", {}, true),

  createSavedSearch: (input: CreateSavedSearchInput) =>
    request<{ search: SavedSearchDTO }>(
      "/api/mobile/v1/saved-searches",
      { method: "POST", body: JSON.stringify(input) },
      true
    ),

  deleteSavedSearch: (id: string) =>
    request<{ success: true }>(
      `/api/mobile/v1/saved-searches/${id}`,
      { method: "DELETE" },
      true
    ),

  listPortfolioItems: () =>
    request<{ items: PortfolioItemDTO[] }>("/api/mobile/v1/contractor/portfolio", {}, true),

  createPortfolioItem: (formData: FormData) =>
    request<{ item: PortfolioItemDTO }>(
      "/api/mobile/v1/contractor/portfolio",
      { method: "POST", body: formData },
      true
    ),

  deletePortfolioItem: (id: string) =>
    request<{ success: true }>(
      `/api/mobile/v1/contractor/portfolio/${id}`,
      { method: "DELETE" },
      true
    ),

  proposeAppointment: (offerId: string, input: ProposeAppointmentInput) =>
    request<{ appointment: AppointmentDTO }>(
      `/api/mobile/v1/admin/offers/${offerId}/appointments`,
      { method: "POST", body: JSON.stringify(input) },
      true
    ),

  updateAppointmentStatus: (id: string, status: "CONFIRMED" | "CANCELLED") =>
    request<{ appointment: AppointmentDTO }>(
      `/api/mobile/v1/appointments/${id}`,
      { method: "PATCH", body: JSON.stringify({ status }) },
      true
    ),

  getNotificationPreferences: () =>
    request<{ preferences: NotificationPreferencesDTO }>(
      "/api/mobile/v1/notification-preferences",
      {},
      true
    ),

  updateNotificationPreferences: (preferences: NotificationPreferencesDTO) =>
    request<{ preferences: NotificationPreferencesDTO }>(
      "/api/mobile/v1/notification-preferences",
      { method: "PATCH", body: JSON.stringify(preferences) },
      true
    ),

  getAdminAnalytics: () =>
    request<{
      stats: {
        totalListings: number;
        approvedListings: number;
        pendingListings: number;
        totalOffers: number;
        interestedOffers: number;
        conversionRate: number;
        totalContractors: number;
        verifiedContractors: number;
        totalReviews: number;
      };
      topContractors: {
        contractorId: string;
        name: string | null;
        averageRating: number | null;
        reviewCount: number;
      }[];
      trends: { key: string; label: string; listings: number; offers: number }[];
    }>("/api/mobile/v1/admin/analytics", {}, true),

  getLatestAnnouncement: () =>
    request<{
      announcement: {
        id: string;
        title: string;
        body: string;
        imageUrl: string | null;
        linkUrl: string | null;
        createdAt: string;
      } | null;
    }>("/api/mobile/v1/announcements/latest"),

  getMaintenanceStatus: () =>
    request<{
      maintenanceMode: boolean;
      message: string | null;
      updatedAt: string | null;
    }>("/api/mobile/v1/maintenance"),

  setMaintenanceMode: (maintenanceMode: boolean, message?: string | null) =>
    request<{
      maintenanceMode: boolean;
      message: string | null;
      updatedAt: string | null;
    }>(
      "/api/mobile/v1/admin/maintenance",
      { method: "POST", body: JSON.stringify({ maintenanceMode, message }) },
      true
    ),
};
