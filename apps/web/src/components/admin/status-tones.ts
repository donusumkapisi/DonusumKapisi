import type {
  AppointmentStatus,
  ContractorVerificationStatus,
  ListingStatus,
  OfferStatus,
  UserRole,
} from "@donusum-kapisi/db";
import type { PillTone } from "@/components/admin/admin-ui";

export const listingStatusTone: Record<ListingStatus, PillTone> = {
  PENDING: "pending",
  APPROVED: "success",
  REJECTED: "danger",
  CLOSED: "muted",
};

export const offerStatusTone: Record<OfferStatus, PillTone> = {
  PENDING: "pending",
  INTERESTED: "success",
  DECLINED: "muted",
  WITHDRAWN: "muted",
};

export const appointmentStatusTone: Record<AppointmentStatus, PillTone> = {
  PROPOSED: "pending",
  CONFIRMED: "success",
  CANCELLED: "muted",
};

export const verificationStatusTone: Record<ContractorVerificationStatus, PillTone> = {
  INCOMPLETE: "muted",
  PENDING: "pending",
  APPROVED: "success",
  REJECTED: "danger",
};

export const roleTone: Record<UserRole, PillTone> = {
  HOMEOWNER: "info",
  CONTRACTOR: "success",
  ADMIN: "danger",
};
