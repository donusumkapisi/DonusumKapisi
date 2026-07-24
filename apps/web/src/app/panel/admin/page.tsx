import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@donusum-kapisi/db";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ListingStatusActions } from "@/components/panel/listing-status-actions";
import { ResolveContactButton } from "@/components/panel/resolve-contact-button";
import { ProposeAppointmentForm } from "@/components/panel/propose-appointment-form";
import { VerifyContractorButton } from "@/components/panel/verify-contractor-button";
import { FadeIn } from "@/components/motion/fade-in";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { StatCard } from "@/components/panel/stat-card";
import { PanelEmptyState } from "@/components/panel/panel-empty-state";
import { formatPriceRange } from "@/lib/listings";
import { BadgeCheck, Building2, PhoneCall, ShieldCheck } from "lucide-react";

export default async function AdminPanelPage() {
  const session = await auth();
  if (!session) redirect("/giris");
  if (session.user.role !== "ADMIN") redirect("/panel");

  const [listings, contactQueue, contractorProfiles, t, tPanel] = await Promise.all([
    prisma.listing.findMany({
      include: { owner: { select: { name: true, email: true } } },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    }),
    prisma.offer.findMany({
      where: { status: "INTERESTED", contactResolvedAt: null },
      include: {
        listing: { select: { listingNumber: true, title: true, owner: { select: { name: true, email: true, phone: true } } } },
        contractor: { select: { name: true, email: true, phone: true } },
      },
      orderBy: { updatedAt: "asc" },
    }),
    prisma.contractorProfile.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: [{ verified: "asc" }, { updatedAt: "desc" }],
    }),
    getTranslations("panelAdmin"),
    getTranslations("panel"),
  ]);

  const statusLabels: Record<string, { label: string; className: string }> = {
    PENDING: { label: tPanel("listingStatusPending"), className: "bg-warning/10 text-warning" },
    APPROVED: { label: tPanel("listingStatusApproved"), className: "bg-clay/10 text-clay" },
    REJECTED: { label: tPanel("listingStatusRejected"), className: "bg-danger/10 text-danger" },
    CLOSED: { label: tPanel("listingStatusClosed"), className: "bg-surface text-ink-muted" },
  };

  const pendingListings = listings.filter((listing) => listing.status === "PENDING").length;
  const pendingVerifications = contractorProfiles.filter((profile) => !profile.verified).length;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <FadeIn className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-clay uppercase">
            {tPanel("adminEyebrow")}
          </p>
          <h1 className="mt-3 font-display text-3xl text-ink">{t("title")}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/panel/admin/analitik">{t("analyticsButton")}</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/panel/admin/blog">{t("blogButton")}</Link>
          </Button>
          <SignOutButton className="h-9 px-4" />
        </div>
      </FadeIn>

      <FadeIn delay={0.05} className="mt-8 grid grid-cols-3 gap-3">
        <StatCard icon={Building2} label={t("statPendingListings")} value={pendingListings} />
        <StatCard icon={PhoneCall} label={t("statPendingContact")} value={contactQueue.length} />
        <StatCard icon={ShieldCheck} label={t("statPendingVerification")} value={pendingVerifications} />
      </FadeIn>

      <FadeIn delay={0.1} className="mt-10">
        <h2 className="font-display text-xl text-ink">{t("contactQueueTitle")}</h2>
        <p className="mt-1 text-sm text-ink-muted">
          {t("contactQueueSubtitle")}
        </p>

        {contactQueue.length === 0 ? (
          <PanelEmptyState icon={PhoneCall} title={t("contactQueueEmptyTitle")} subtitle={t("contactQueueEmptySubtitle")} />
        ) : (
          <div className="mt-4 space-y-3">
            {contactQueue.map((offer) => (
              <SpotlightCard key={offer.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-ink-muted">
                    #{offer.listing.listingNumber} · {formatPriceRange(offer.priceMin, offer.priceMax)}
                  </p>
                  <p className="mt-0.5 font-display text-base text-ink">{offer.listing.title}</p>
                  <p className="mt-1 text-xs text-ink-muted">
                    {t("ownerLabel", { name: offer.listing.owner.name ?? "", email: offer.listing.owner.email })}
                    {offer.listing.owner.phone ? ` · ${offer.listing.owner.phone}` : ""}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {t("contractorLabel", { name: offer.contractor.name ?? "", email: offer.contractor.email })}
                    {offer.contractor.phone ? ` · ${offer.contractor.phone}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <ProposeAppointmentForm offerId={offer.id} />
                  <ResolveContactButton offerId={offer.id} />
                </div>
              </SpotlightCard>
            ))}
          </div>
        )}
      </FadeIn>

      <FadeIn className="mt-12">
        <h2 className="font-display text-xl text-ink">{t("verificationsTitle")}</h2>

        {contractorProfiles.length === 0 ? (
          <PanelEmptyState icon={ShieldCheck} title={t("verificationsEmptyTitle")} subtitle={t("verificationsEmptySubtitle")} />
        ) : (
          <div className="mt-4 space-y-3">
            {contractorProfiles.map((profile) => (
              <SpotlightCard key={profile.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="font-display text-base text-ink">
                    {profile.companyName || profile.user.name}
                  </p>
                  <p className="text-xs text-ink-muted">{profile.user.email}</p>
                  {profile.documentUrls.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {profile.documentUrls.map((url) => (
                        <a
                          key={url}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="relative size-12 overflow-hidden rounded-lg border border-hairline transition-transform hover:scale-105"
                        >
                          <Image src={url} alt={tPanel("documentAlt")} fill sizes="48px" className="object-cover" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {profile.verified && (
                    <span className="flex items-center gap-1 rounded-full bg-clay/10 px-3 py-1 text-xs font-medium text-clay">
                      <BadgeCheck className="size-3.5" /> {tPanel("verifiedBadge")}
                    </span>
                  )}
                  <VerifyContractorButton profileId={profile.id} verified={profile.verified} />
                </div>
              </SpotlightCard>
            ))}
          </div>
        )}
      </FadeIn>

      <FadeIn className="mt-12">
        <h2 className="font-display text-xl text-ink">{t("listingsTitle")}</h2>

        {listings.length === 0 ? (
          <PanelEmptyState icon={Building2} title={t("listingsEmptyTitle")} subtitle={t("listingsEmptySubtitle")} />
        ) : (
          <div className="mt-6 space-y-4">
            {listings.map((listing) => {
              const status = statusLabels[listing.status];
              return (
                <SpotlightCard key={listing.id} className="flex flex-wrap items-center gap-4 p-4">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-petrol/25 via-surface to-clay/20">
                    {listing.coverImageUrl && (
                      <Image
                        src={listing.coverImageUrl}
                        alt={listing.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs text-ink-muted">
                      #{listing.listingNumber} · {listing.district}, {listing.province}
                    </p>
                    <Link
                      href={`/ilanlar/${listing.listingNumber}`}
                      className="mt-0.5 block truncate font-display text-base text-ink hover:text-clay"
                    >
                      {listing.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      {listing.owner.name} · {listing.owner.email}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
                  >
                    {status.label}
                  </span>
                  <ListingStatusActions
                    listingId={listing.id}
                    actions={
                      listing.status === "PENDING"
                        ? [
                            { status: "APPROVED", label: t("actionApprove"), variant: "cta" },
                            { status: "REJECTED", label: t("actionReject"), variant: "cta-red" },
                          ]
                        : listing.status === "APPROVED"
                          ? [{ status: "CLOSED", label: t("actionClose"), variant: "outline" }]
                          : [{ status: "APPROVED", label: t("actionReapprove"), variant: "outline" }]
                    }
                  />
                </SpotlightCard>
              );
            })}
          </div>
        )}
      </FadeIn>
    </div>
  );
}
