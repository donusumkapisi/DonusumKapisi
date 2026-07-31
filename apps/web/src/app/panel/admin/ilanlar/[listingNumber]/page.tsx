import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import {
  ArrowLeft,
  Building2,
  CalendarClock,
  ExternalLink,
  Eye,
  Handshake,
  Layers,
  Mail,
  MapPin,
  Phone,
  Ruler,
  Star,
  StickyNote,
} from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { PanelEmptyState } from "@/components/panel/panel-empty-state";
import { ListingStatusActions } from "@/components/panel/listing-status-actions";
import { ProposeAppointmentForm } from "@/components/panel/propose-appointment-form";
import { AdminCard, DetailRow, StatusPill } from "@/components/admin/admin-ui";
import { CancelAppointmentButton } from "@/components/admin/cancel-appointment-button";
import { ContactToggle } from "@/components/admin/contact-toggle";
import {
  appointmentStatusTone,
  listingStatusTone,
  offerStatusTone,
  verificationStatusTone,
} from "@/components/admin/status-tones";
import { getAdminListingDetail } from "@/lib/admin";
import { formatPrice, formatPriceRange } from "@/lib/format";

export default async function AdminListingDetailPage({
  params,
}: {
  params: Promise<{ listingNumber: string }>;
}) {
  const { listingNumber } = await params;
  const [listing, t, tDocs, format] = await Promise.all([
    getAdminListingDetail(listingNumber),
    getTranslations("panelAdmin"),
    getTranslations("contractorDocs"),
    getFormatter(),
  ]);

  if (!listing) notFound();

  const gallery = [listing.coverImageUrl, ...listing.photos].filter(
    (url): url is string => Boolean(url)
  );

  // Same state machine as the list rows, spelled out here so the detail page is self-contained.
  const statusActions =
    listing.status === "PENDING"
      ? [
          { status: "APPROVED" as const, label: t("actionApprove"), variant: "cta" as const },
          { status: "REJECTED" as const, label: t("actionReject"), variant: "cta-red" as const },
        ]
      : listing.status === "APPROVED"
        ? [
            { status: "CLOSED" as const, label: t("actionClose"), variant: "outline" as const },
            { status: "REJECTED" as const, label: t("actionReject"), variant: "cta-red" as const },
          ]
        : [{ status: "APPROVED" as const, label: t("actionReapprove"), variant: "cta" as const }];

  return (
    <div className="space-y-8">
      <FadeIn>
        <Link
          href="/panel/admin/ilanlar"
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-clay"
        >
          <ArrowLeft className="size-3.5" />
          {t("backToListings")}
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-mono text-xs text-ink-muted">
              #{listing.listingNumber} · {format.dateTime(listing.createdAt, { dateStyle: "medium" })}
            </p>
            <h2 className="mt-1 font-display text-2xl text-ink">{listing.title}</h2>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" />
                {listing.district}, {listing.province}
              </span>
              <span className="inline-flex items-center gap-1">
                <Eye className="size-3.5" />
                {t("viewCount", { count: listing.viewCount })}
              </span>
              {listing.status === "APPROVED" && (
                <Link
                  href={`/ilanlar/${listing.listingNumber}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-clay hover:underline"
                >
                  {t("viewPublicPage")}
                  <ExternalLink className="size-3" />
                </Link>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone={listingStatusTone[listing.status]}>
              {t(`listingStatus.${listing.status}`)}
            </StatusPill>
            <ListingStatusActions listingId={listing.id} actions={statusActions} />
          </div>
        </div>
      </FadeIn>

      {gallery.length > 0 && (
        <FadeIn delay={0.05} className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {gallery.slice(0, 8).map((url, index) => (
            <div
              key={url}
              className="relative aspect-4/3 overflow-hidden rounded-xl border border-hairline bg-surface"
            >
              <Image
                src={url}
                alt={`${listing.title} ${index + 1}`}
                fill
                sizes="(min-width: 640px) 20vw, 45vw"
                className="object-cover"
              />
            </div>
          ))}
        </FadeIn>
      )}

      <FadeIn delay={0.08} className="grid gap-4 lg:grid-cols-2">
        <AdminCard>
          <h3 className="font-display text-base text-ink">{t("propertyFactsTitle")}</h3>
          <div className="mt-2">
            <DetailRow label={t("factPriceRange")}>
              {formatPriceRange(listing.priceMin, listing.priceMax)}
            </DetailRow>
            <DetailRow label={t("factSquareMeters")}>
              <span className="inline-flex items-center gap-1">
                <Ruler className="size-3.5 text-ink-muted" />
                {t("squareMetersValue", { value: listing.squareMeters })}
              </span>
            </DetailRow>
            <DetailRow label={t("factBuildingAge")}>
              {t("yearsValue", { value: listing.buildingAge })}
            </DetailRow>
            <DetailRow label={t("factFloorCount")}>
              <span className="inline-flex items-center gap-1">
                <Layers className="size-3.5 text-ink-muted" />
                {listing.floorCount}
              </span>
            </DetailRow>
            <DetailRow label={t("factUnitCount")}>
              <span className="inline-flex items-center gap-1">
                <Building2 className="size-3.5 text-ink-muted" />
                {listing.unitCount}
              </span>
            </DetailRow>
            <DetailRow label={t("factPricePerUnit")}>
              {formatPrice(Math.round(listing.priceMax / Math.max(listing.unitCount, 1)))}
            </DetailRow>
          </div>
        </AdminCard>

        <AdminCard>
          <h3 className="font-display text-base text-ink">{t("ownerTitle")}</h3>
          <div className="mt-2">
            <DetailRow label={t("ownerName")}>{listing.owner.name ?? "—"}</DetailRow>
            <DetailRow label={t("ownerEmail")}>
              <a
                href={`mailto:${listing.owner.email}`}
                className="inline-flex items-center gap-1 hover:text-clay"
              >
                <Mail className="size-3.5 text-ink-muted" />
                {listing.owner.email}
              </a>
            </DetailRow>
            <DetailRow label={t("ownerPhone")}>
              {listing.owner.phone ? (
                <a
                  href={`tel:${listing.owner.phone}`}
                  className="inline-flex items-center gap-1 hover:text-clay"
                >
                  <Phone className="size-3.5 text-ink-muted" />
                  {listing.owner.phone}
                </a>
              ) : (
                "—"
              )}
            </DetailRow>
            <DetailRow label={t("ownerJoined")}>
              {format.dateTime(listing.owner.createdAt, { dateStyle: "medium" })}
            </DetailRow>
          </div>

          <h4 className="mt-4 text-xs tracking-wide text-ink-muted uppercase">
            {t("descriptionTitle")}
          </h4>
          <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-line text-ink-muted">
            {listing.description}
          </p>
        </AdminCard>
      </FadeIn>

      <FadeIn delay={0.1}>
        <h3 className="font-display text-xl text-ink">
          {t("offersTitle", { count: listing.offers.length })}
        </h3>
        <p className="mt-1 text-sm text-ink-muted">{t("offersSubtitle")}</p>

        {listing.offers.length === 0 ? (
          <PanelEmptyState
            icon={Handshake}
            title={t("offersEmptyTitle")}
            subtitle={t("offersEmptySubtitle")}
          />
        ) : (
          <div className="mt-4 space-y-3">
            {listing.offers.map((offer) => {
              const profile = offer.contractor.contractorProfile;
              const needsContact = offer.status === "INTERESTED";

              return (
                <AdminCard key={offer.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-2 font-display text-base text-ink">
                        <Link
                          href={`/muteahhitler/${offer.contractor.id}`}
                          className="hover:text-clay"
                        >
                          {profile?.companyName ?? offer.contractor.name ?? offer.contractor.email}
                        </Link>
                        {profile && (
                          <StatusPill tone={verificationStatusTone[profile.verificationStatus]}>
                            {tDocs(`status.${profile.verificationStatus}`)}
                          </StatusPill>
                        )}
                      </p>
                      <p className="mt-1 text-xs text-ink-muted">
                        {offer.contractor.email}
                        {offer.contractor.phone ? ` · ${offer.contractor.phone}` : ""}
                      </p>
                      <p className="mt-2 text-sm text-ink">
                        {formatPriceRange(offer.priceMin, offer.priceMax)}
                        {offer.durationMonths
                          ? ` · ${t("durationMonths", { n: offer.durationMonths })}`
                          : ""}
                      </p>
                    </div>

                    <StatusPill tone={offerStatusTone[offer.status]}>
                      {t(`offerStatus.${offer.status}`)}
                    </StatusPill>
                  </div>

                  {offer.note && (
                    <p className="mt-3 flex gap-2 rounded-xl bg-surface/60 px-3 py-2.5 text-sm leading-relaxed text-ink-muted">
                      <StickyNote className="mt-0.5 size-3.5 shrink-0 text-clay" />
                      {offer.note}
                    </p>
                  )}

                  {offer.review && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-muted">
                      <Star className="size-3.5 fill-highlight text-highlight" />
                      {t("reviewLabel", { rating: offer.review.rating })}
                      {offer.review.comment ? ` · ${offer.review.comment}` : ""}
                    </p>
                  )}

                  {offer.appointments.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {offer.appointments.map((appointment) => (
                        <li
                          key={appointment.id}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-surface/60 px-3 py-2"
                        >
                          <span className="inline-flex items-center gap-2 text-sm text-ink">
                            <CalendarClock className="size-3.5 shrink-0 text-clay" />
                            {format.dateTime(appointment.scheduledAt, {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                            {appointment.location ? ` · ${appointment.location}` : ""}
                          </span>
                          <span className="flex items-center gap-2">
                            <StatusPill tone={appointmentStatusTone[appointment.status]}>
                              {t(`appointmentStatus.${appointment.status}`)}
                            </StatusPill>
                            {appointment.status !== "CANCELLED" && (
                              <CancelAppointmentButton appointmentId={appointment.id} />
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {needsContact && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-hairline pt-3">
                      <ProposeAppointmentForm offerId={offer.id} />
                      <ContactToggle offerId={offer.id} resolved={Boolean(offer.contactResolvedAt)} />
                      {offer.contactResolvedAt && (
                        <span className="text-xs text-ink-muted">
                          {t("contactResolvedAt", {
                            date: format.dateTime(offer.contactResolvedAt, { dateStyle: "medium" }),
                          })}
                        </span>
                      )}
                    </div>
                  )}
                </AdminCard>
              );
            })}
          </div>
        )}
      </FadeIn>
    </div>
  );
}
