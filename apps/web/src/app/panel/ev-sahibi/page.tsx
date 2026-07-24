import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@donusum-kapisi/db";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { FileDown, Building2, Eye, FileStack, PlusCircle } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { Magnetic } from "@/components/motion/magnetic";
import { StatCard } from "@/components/panel/stat-card";
import { PanelEmptyState } from "@/components/panel/panel-empty-state";
import { ListingOffersSection, type OfferForSection } from "@/components/panel/listing-offers-section";
import { SavedSearchesSection } from "@/components/panel/saved-searches-section";
import { NotificationPreferencesForm } from "@/components/panel/notification-preferences-form";
import { getContractorRatingSummaries } from "@/lib/reviews";
import { listSavedSearches } from "@/lib/saved-searches";
import { getNotificationPreferences } from "@/lib/notification-preferences";

export default async function HomeownerPanelPage() {
  const session = await auth();
  if (!session) redirect("/giris");
  if (session.user.role !== "HOMEOWNER") redirect("/panel");

  const [listings, t, tPanel] = await Promise.all([
    prisma.listing.findMany({
      where: { ownerId: session.user.id },
      include: {
        offers: {
          include: {
            contractor: { select: { id: true, name: true } },
            review: true,
            appointments: { orderBy: { scheduledAt: "desc" }, take: 1 },
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    getTranslations("panelEvSahibi"),
    getTranslations("panel"),
  ]);

  const statusLabels: Record<string, { label: string; className: string }> = {
    PENDING: { label: tPanel("listingStatusPending"), className: "bg-warning/10 text-warning" },
    APPROVED: { label: tPanel("listingStatusApproved"), className: "bg-clay/10 text-clay" },
    REJECTED: { label: tPanel("listingStatusRejected"), className: "bg-danger/10 text-danger" },
    CLOSED: { label: tPanel("listingStatusClosed"), className: "bg-surface text-ink-muted" },
  };

  const contractorIds = [
    ...new Set(listings.flatMap((listing) => listing.offers.map((offer) => offer.contractorId))),
  ];
  const ratingSummaries = await getContractorRatingSummaries(contractorIds);
  const savedSearches = await listSavedSearches(session.user.id);
  const notificationPreferences = await getNotificationPreferences(session.user.id);

  const totalOffers = listings.reduce((sum, listing) => sum + listing.offers.length, 0);
  const totalViews = listings.reduce((sum, listing) => sum + listing.viewCount, 0);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <FadeIn className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-clay uppercase">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 font-display text-3xl text-ink">
            {tPanel("welcomeBack", { name: session.user.name ?? "" })}
          </h1>
        </div>
        <SignOutButton className="h-9 px-4" />
      </FadeIn>

      {listings.length > 0 && (
        <FadeIn delay={0.05} className="mt-8 grid grid-cols-3 gap-3">
          <StatCard icon={Building2} label={t("statListings")} value={listings.length} />
          <StatCard icon={FileStack} label={t("statTotalOffers")} value={totalOffers} />
          <StatCard icon={Eye} label={t("statViews")} value={totalViews} />
        </FadeIn>
      )}

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-xl text-ink">{t("myListingsTitle")}</h2>
        <Magnetic>
          <Button asChild variant="cta-red" size="sm">
            <Link href="/ilan-ver">{t("newListingButton")}</Link>
          </Button>
        </Magnetic>
      </div>

      {listings.length === 0 ? (
        <PanelEmptyState
          icon={Building2}
          title={t("emptyTitle")}
          subtitle={t("emptySubtitle")}
          action={
            <Button asChild variant="cta-red" size="sm" className="mt-2">
              <Link href="/ilan-ver">
                <PlusCircle className="size-4" /> {t("newListingButton")}
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="mt-6 space-y-4">
          {listings.map((listing, index) => {
            const status = statusLabels[listing.status];
            return (
              <FadeIn key={listing.id} delay={Math.min(index * 0.06, 0.3)}>
                <SpotlightCard className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-petrol/25 via-surface to-clay/20">
                      {listing.coverImageUrl && (
                        <Image
                          src={listing.coverImageUrl}
                          alt={listing.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs text-ink-muted">
                        #{listing.listingNumber} · {listing.district}, {listing.province}
                      </p>
                      <h3 className="mt-0.5 truncate font-display text-base text-ink">
                        {listing.title}
                      </h3>
                      <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
                        <Eye className="size-3.5" /> {t("viewCount", { n: listing.viewCount })}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  {listing.offers.length > 0 && (
                    <>
                      <div className="mt-4 flex justify-end border-t border-hairline pt-4">
                        <a
                          href={`/api/panel/offers/pdf?listingNumber=${listing.listingNumber}`}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-clay hover:underline"
                        >
                          <FileDown className="size-3.5" /> {t("downloadPdf")}
                        </a>
                      </div>
                      <ListingOffersSection
                        offers={listing.offers.map(
                          (offer): OfferForSection => ({
                            id: offer.id,
                            contractorId: offer.contractorId,
                            contractorName: offer.contractor.name,
                            priceMin: offer.priceMin,
                            priceMax: offer.priceMax,
                            durationMonths: offer.durationMonths,
                            note: offer.note,
                            status: offer.status,
                            hasReview: Boolean(offer.review),
                            canReview: Boolean(offer.contactResolvedAt) && !offer.review,
                            rating: ratingSummaries.get(offer.contractorId) ?? {
                              averageRating: null,
                              reviewCount: 0,
                            },
                            appointment: offer.appointments[0] ?? null,
                          })
                        )}
                      />
                    </>
                  )}
                </SpotlightCard>
              </FadeIn>
            );
          })}
        </div>
      )}

      <FadeIn>
        <SavedSearchesSection searches={savedSearches} />
      </FadeIn>

      <FadeIn className="mt-10">
        <h2 className="font-display text-xl text-ink">{tPanel("notificationPreferencesTitle")}</h2>
        <div className="mt-4">
          <NotificationPreferencesForm preferences={notificationPreferences} />
        </div>
      </FadeIn>
    </div>
  );
}
