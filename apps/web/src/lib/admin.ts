import { cache } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@donusum-kapisi/db";
import type { AppointmentStatus, ListingStatus, Prisma, UserRole } from "@donusum-kapisi/db";
import { auth } from "@/lib/auth";

/**
 * Cached so the admin shell and the page it renders share a single session read
 * instead of hitting the session store twice per request.
 */
export const requireAdmin = cache(async () => {
  const session = await auth();
  if (!session) redirect("/giris");
  if (session.user.role !== "ADMIN") redirect("/panel");
  return session;
});

const contains = (q: string): Prisma.StringFilter => ({ contains: q, mode: "insensitive" });

/** Badge counts for the sidebar: the three queues that need a human decision. */
export async function getAdminQueueCounts() {
  const [listings, messages, verifications] = await Promise.all([
    prisma.listing.count({ where: { status: "PENDING" } }),
    prisma.offer.count({ where: { status: "INTERESTED", contactResolvedAt: null } }),
    prisma.contractorProfile.count({ where: { verificationStatus: "PENDING" } }),
  ]);

  return { listings, messages, verifications };
}

export async function getListingStatusCounts() {
  const grouped = await prisma.listing.groupBy({ by: ["status"], _count: { _all: true } });

  const counts: Record<ListingStatus | "ALL", number> = {
    ALL: 0,
    PENDING: 0,
    APPROVED: 0,
    REJECTED: 0,
    CLOSED: 0,
  };
  for (const row of grouped) {
    counts[row.status] = row._count._all;
    counts.ALL += row._count._all;
  }

  return counts;
}

export async function getAdminListings({ status, q }: { status?: ListingStatus; q?: string }) {
  const where: Prisma.ListingWhereInput = {};
  if (status) where.status = status;
  if (q) {
    where.OR = [
      { title: contains(q) },
      { listingNumber: contains(q) },
      { province: contains(q) },
      { district: contains(q) },
      { owner: { is: { OR: [{ name: contains(q) }, { email: contains(q) }] } } },
    ];
  }

  return prisma.listing.findMany({
    where,
    include: {
      owner: { select: { name: true, email: true } },
      _count: { select: { offers: true } },
    },
    // ListingStatus is declared PENDING-first, so ascending puts the queue on top.
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });
}

export type AdminListing = Awaited<ReturnType<typeof getAdminListings>>[number];

export async function getAdminListingDetail(listingNumber: string) {
  return prisma.listing.findUnique({
    where: { listingNumber },
    include: {
      owner: {
        select: { id: true, name: true, email: true, phone: true, createdAt: true },
      },
      offers: {
        include: {
          contractor: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              contractorProfile: { select: { companyName: true, verificationStatus: true } },
            },
          },
          appointments: { orderBy: { scheduledAt: "desc" } },
          review: { select: { rating: true, comment: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export type AdminListingDetail = NonNullable<Awaited<ReturnType<typeof getAdminListingDetail>>>;

/** Messages = what the two sides told us: offer notes plus the contact requests they trigger. */
export type MessageFilter = "OPEN" | "NOTES" | "ALL";

export async function getAdminMessages(filter: MessageFilter) {
  const where: Prisma.OfferWhereInput =
    filter === "OPEN"
      ? { status: "INTERESTED", contactResolvedAt: null }
      : filter === "NOTES"
        ? { NOT: { note: null } }
        : {};

  return prisma.offer.findMany({
    where,
    include: {
      listing: {
        select: {
          listingNumber: true,
          title: true,
          province: true,
          district: true,
          owner: { select: { name: true, email: true, phone: true } },
        },
      },
      contractor: {
        select: {
          name: true,
          email: true,
          phone: true,
          contractorProfile: { select: { companyName: true } },
        },
      },
      appointments: { orderBy: { scheduledAt: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });
}

export type AdminMessage = Awaited<ReturnType<typeof getAdminMessages>>[number];

export async function getMessageFilterCounts() {
  const [open, notes, all] = await Promise.all([
    prisma.offer.count({ where: { status: "INTERESTED", contactResolvedAt: null } }),
    prisma.offer.count({ where: { NOT: { note: null } } }),
    prisma.offer.count(),
  ]);

  return { OPEN: open, NOTES: notes, ALL: all } satisfies Record<MessageFilter, number>;
}

export async function getAdminAppointments(status?: AppointmentStatus) {
  return prisma.appointment.findMany({
    where: status ? { status } : {},
    include: {
      offer: {
        select: {
          listing: { select: { listingNumber: true, title: true, owner: { select: { name: true, phone: true } } } },
          contractor: { select: { name: true, phone: true } },
        },
      },
    },
    orderBy: { scheduledAt: "desc" },
    take: 100,
  });
}

export type AdminAppointment = Awaited<ReturnType<typeof getAdminAppointments>>[number];

export async function getAppointmentStatusCounts() {
  const grouped = await prisma.appointment.groupBy({ by: ["status"], _count: { _all: true } });

  const counts: Record<AppointmentStatus | "ALL", number> = {
    ALL: 0,
    PROPOSED: 0,
    CONFIRMED: 0,
    CANCELLED: 0,
  };
  for (const row of grouped) {
    counts[row.status] = row._count._all;
    counts.ALL += row._count._all;
  }

  return counts;
}

export async function getAdminContractors(q?: string) {
  const users = await prisma.user.findMany({
    where: {
      role: "CONTRACTOR",
      ...(q
        ? { OR: [{ name: contains(q) }, { email: contains(q) }, { contractorProfile: { is: { companyName: contains(q) } } }] }
        : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      contractorProfile: {
        select: {
          companyName: true,
          mybn: true,
          verificationStatus: true,
          submittedAt: true,
          _count: { select: { documents: true } },
        },
      },
      _count: { select: { offers: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const ratings = await prisma.review.groupBy({
    by: ["contractorId"],
    where: { contractorId: { in: users.map((user) => user.id) } },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return users.map((user) => {
    const rating = ratings.find((row) => row.contractorId === user.id);
    return {
      ...user,
      averageRating: rating?._avg.rating ?? null,
      reviewCount: rating?._count.rating ?? 0,
    };
  });
}

export type AdminContractor = Awaited<ReturnType<typeof getAdminContractors>>[number];

export async function getAdminUsers({ role, q }: { role?: UserRole; q?: string }) {
  return prisma.user.findMany({
    where: {
      ...(role ? { role } : {}),
      ...(q ? { OR: [{ name: contains(q) }, { email: contains(q) }, { phone: contains(q) }] } : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      image: true,
      createdAt: true,
      _count: { select: { listings: true, offers: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
}

export type AdminUser = Awaited<ReturnType<typeof getAdminUsers>>[number];

export async function getUserRoleCounts() {
  const grouped = await prisma.user.groupBy({ by: ["role"], _count: { _all: true } });

  const counts: Record<UserRole | "ALL", number> = {
    ALL: 0,
    HOMEOWNER: 0,
    CONTRACTOR: 0,
    ADMIN: 0,
  };
  for (const row of grouped) {
    counts[row.role] = row._count._all;
    counts.ALL += row._count._all;
  }

  return counts;
}

export type AdminActivity = {
  id: string;
  kind: "listing" | "offer" | "user" | "verification";
  at: Date;
  title: string;
  subtitle: string;
  href?: string;
};

/**
 * A single "what happened lately" feed. Each source is trimmed to `limit` before
 * merging, so one busy table cannot crowd the others out.
 */
export async function getAdminActivity(limit = 8): Promise<AdminActivity[]> {
  const [listings, offers, users, verifications] = await Promise.all([
    prisma.listing.findMany({
      select: { id: true, listingNumber: true, title: true, status: true, createdAt: true, owner: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    prisma.offer.findMany({
      select: {
        id: true,
        createdAt: true,
        listing: { select: { listingNumber: true, title: true } },
        contractor: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    prisma.contractorProfile.findMany({
      where: { NOT: { submittedAt: null } },
      select: {
        id: true,
        companyName: true,
        submittedAt: true,
        user: { select: { name: true, email: true } },
      },
      orderBy: { submittedAt: "desc" },
      take: limit,
    }),
  ]);

  const feed: AdminActivity[] = [
    ...listings.map((listing) => ({
      id: `listing-${listing.id}`,
      kind: "listing" as const,
      at: listing.createdAt,
      title: listing.title,
      subtitle: listing.owner.name ?? listing.owner.email,
      href: `/panel/admin/ilanlar/${listing.listingNumber}`,
    })),
    ...offers.map((offer) => ({
      id: `offer-${offer.id}`,
      kind: "offer" as const,
      at: offer.createdAt,
      title: offer.listing.title,
      subtitle: offer.contractor.name ?? offer.contractor.email,
      href: `/panel/admin/ilanlar/${offer.listing.listingNumber}`,
    })),
    ...users.map((user) => ({
      id: `user-${user.id}`,
      kind: "user" as const,
      at: user.createdAt,
      title: user.name ?? user.email,
      subtitle: user.role,
    })),
    ...verifications.map((profile) => ({
      id: `verification-${profile.id}`,
      kind: "verification" as const,
      at: profile.submittedAt as Date,
      title: profile.companyName ?? profile.user.name ?? profile.user.email,
      subtitle: profile.user.email,
      href: "/panel/admin/dogrulama",
    })),
  ];

  return feed.sort((a, b) => b.at.getTime() - a.at.getTime()).slice(0, limit);
}
