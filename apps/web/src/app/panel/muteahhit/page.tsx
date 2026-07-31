import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@donusum-kapisi/db";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { BadgeCheck, FileStack, Search, Zap } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { Magnetic } from "@/components/motion/magnetic";
import { StatCard } from "@/components/panel/stat-card";
import { PanelEmptyState } from "@/components/panel/panel-empty-state";
import { OfferStatusActions } from "@/components/panel/offer-status-actions";
import { AppointmentCard } from "@/components/panel/appointment-card";
import { ContractorProfileForm } from "@/components/panel/contractor-profile-form";
import { PortfolioManager } from "@/components/panel/portfolio-manager";
import { SavedSearchesSection } from "@/components/panel/saved-searches-section";
import { NotificationPreferencesForm } from "@/components/panel/notification-preferences-form";
import { formatPriceRange } from "@/lib/listings";
import { getContractorVerification } from "@/lib/contractor-verification";
import { VerificationStatusBanner } from "@/components/panel/verification-status-banner";
import { DocumentChecklist } from "@/components/panel/document-checklist";
import { listPortfolioItems } from "@/lib/portfolio";
import { listSavedSearches } from "@/lib/saved-searches";
import { getNotificationPreferences } from "@/lib/notification-preferences";
import { toPortfolioItemDTO } from "@/lib/dto";

export default async function ContractorPanelPage() {
  const session = await auth();
  if (!session) redirect("/giris");
  if (session.user.role !== "CONTRACTOR") redirect("/panel");

  const [offers, t, tPanel, tDocs] = await Promise.all([
    prisma.offer.findMany({
      where: { contractorId: session.user.id },
      include: {
        listing: true,
        appointments: { orderBy: { scheduledAt: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    }),
    getTranslations("panelMuteahhit"),
    getTranslations("panel"),
    getTranslations("contractorDocs"),
  ]);

  const offerStatusLabels: Record<string, { label: string; className: string }> = {
    PENDING: { label: tPanel("offerStatusPendingContractor"), className: "bg-warning/10 text-warning" },
    INTERESTED: { label: tPanel("offerStatusInterestedContractor"), className: "bg-clay/10 text-clay" },
    DECLINED: { label: tPanel("offerStatusDeclinedContractor"), className: "bg-surface text-ink-muted" },
    WITHDRAWN: { label: tPanel("offerStatusWithdrawn"), className: "bg-surface text-ink-muted" },
  };

  const profile = await getContractorVerification(session.user.id);
  const verificationStatus = profile?.verificationStatus ?? "INCOMPLETE";
  const savedSearches = await listSavedSearches(session.user.id);
  const portfolioItems = await listPortfolioItems(session.user.id);
  const notificationPreferences = await getNotificationPreferences(session.user.id);

  const activeOfferCount = offers.filter(
    (offer) => offer.status === "PENDING" || offer.status === "INTERESTED"
  ).length;

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

      <FadeIn delay={0.05} className="mt-8 grid grid-cols-3 gap-3">
        <StatCard icon={FileStack} label={t("statTotalOffers")} value={offers.length} />
        <StatCard icon={Zap} label={t("statActiveOffers")} value={activeOfferCount} />
        <StatCard
          icon={BadgeCheck}
          label={t("statVerification")}
          value={tDocs(`status.${verificationStatus}`)}
        />
      </FadeIn>

      <FadeIn delay={0.08} className="mt-10">
        <h2 className="font-display text-xl text-ink">{tDocs("panelSectionTitle")}</h2>
        <VerificationStatusBanner
          status={verificationStatus}
          note={profile?.verificationNote}
          className="mt-4"
        />
        <DocumentChecklist
          documents={
            profile?.documents.map((document) => ({
              type: document.type,
              status: document.status,
            })) ?? []
          }
          className="mt-3"
        />
        <div className="mt-3">
          <Button asChild variant={verificationStatus === "APPROVED" ? "outline" : "cta"} size="sm">
            <Link href="/panel/muteahhit/belgeler">
              {verificationStatus === "APPROVED" ? tDocs("panelReview") : tDocs("panelComplete")}
            </Link>
          </Button>
        </div>
      </FadeIn>

      <FadeIn delay={0.1} className="mt-10">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-xl text-ink">{t("profileTitle")}</h2>
          {profile?.verified && (
            <span className="flex items-center gap-1 rounded-full bg-clay/10 px-3 py-1 text-xs font-medium text-clay">
              <BadgeCheck className="size-3.5" /> {t("documentsVerifiedBadge")}
            </span>
          )}
        </div>

        <SpotlightCard className="mt-4 p-6">
          <ContractorProfileForm
            companyName={profile?.companyName ?? null}
            about={profile?.about ?? null}
          />
        </SpotlightCard>
      </FadeIn>

      <FadeIn className="mt-10">
        <h2 className="font-display text-xl text-ink">{t("portfolioTitle")}</h2>
        <p className="mt-1 text-sm text-ink-muted">
          {t("portfolioSubtitle")}
        </p>
        <div className="mt-4">
          <PortfolioManager items={portfolioItems.map(toPortfolioItemDTO)} />
        </div>
      </FadeIn>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-xl text-ink">{t("offersTitle")}</h2>
        <Magnetic>
          <Button asChild variant="cta-orange" size="sm">
            <Link href="/ilanlar">{t("browseListingsButton")}</Link>
          </Button>
        </Magnetic>
      </div>

      {offers.length === 0 ? (
        <PanelEmptyState
          icon={Search}
          title={t("emptyTitle")}
          subtitle={t("emptySubtitle")}
          action={
            <Button asChild variant="cta-orange" size="sm" className="mt-2">
              <Link href="/ilanlar">{t("browseListingsButton")}</Link>
            </Button>
          }
        />
      ) : (
        <div className="mt-6 space-y-3">
          {offers.map((offer, index) => {
            const offerStatus = offerStatusLabels[offer.status];
            return (
              <FadeIn key={offer.id} delay={Math.min(index * 0.06, 0.3)}>
                <SpotlightCard className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-ink-muted">
                      #{offer.listing.listingNumber} · {offer.listing.district},{" "}
                      {offer.listing.province}
                    </p>
                    <Link
                      href={`/ilanlar/${offer.listing.listingNumber}`}
                      className="mt-0.5 block truncate font-display text-base text-ink hover:text-clay"
                    >
                      {offer.listing.title}
                    </Link>
                    <p className="mt-1 text-sm text-ink-muted">
                      {t("yourOfferLabel", { price: formatPriceRange(offer.priceMin, offer.priceMax) })}
                    </p>
                    {offer.appointments[0] && (
                      <AppointmentCard appointment={offer.appointments[0]} />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${offerStatus.className}`}
                    >
                      {offerStatus.label}
                    </span>
                    {offer.status !== "WITHDRAWN" && (
                      <OfferStatusActions
                        offerId={offer.id}
                        actions={[{ status: "WITHDRAWN", label: tPanel("offerActionWithdraw"), variant: "outline" }]}
                      />
                    )}
                  </div>
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
