import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { CalendarClock, MessagesSquare, StickyNote } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { PanelEmptyState } from "@/components/panel/panel-empty-state";
import { ProposeAppointmentForm } from "@/components/panel/propose-appointment-form";
import { AdminCard, AdminPageHeader, FilterTabs, StatusPill, type FilterTab } from "@/components/admin/admin-ui";
import { ContactToggle } from "@/components/admin/contact-toggle";
import { appointmentStatusTone, offerStatusTone } from "@/components/admin/status-tones";
import { getAdminMessages, getMessageFilterCounts, type MessageFilter } from "@/lib/admin";
import { formatPriceRange } from "@/lib/format";

const FILTERS = ["OPEN", "NOTES", "ALL"] as const;

function parseFilter(value: string | undefined): MessageFilter {
  return FILTERS.find((filter) => filter === value) ?? "OPEN";
}

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ kutu?: string }>;
}) {
  const { kutu } = await searchParams;
  const filter = parseFilter(kutu);

  const [messages, counts, t, format] = await Promise.all([
    getAdminMessages(filter),
    getMessageFilterCounts(),
    getTranslations("panelAdmin"),
    getFormatter(),
  ]);

  const tabs: FilterTab[] = FILTERS.map((value) => ({
    value,
    label: t(`messageFilter.${value}`),
    count: counts[value],
    href: `/panel/admin/mesajlar?kutu=${value}`,
  }));

  return (
    <div className="space-y-6">
      <FadeIn>
        <AdminPageHeader title={t("messagesTitle")} description={t("messagesSubtitle")} />
      </FadeIn>

      <FadeIn delay={0.05}>
        <FilterTabs tabs={tabs} active={filter} />
      </FadeIn>

      {messages.length === 0 ? (
        <PanelEmptyState
          icon={MessagesSquare}
          title={t("messagesEmptyTitle")}
          subtitle={t("messagesEmptySubtitle")}
        />
      ) : (
        <div className="space-y-3">
          {messages.map((offer, index) => {
            const appointment = offer.appointments[0];
            const resolved = Boolean(offer.contactResolvedAt);

            return (
              <FadeIn key={offer.id} delay={Math.min(index * 0.03, 0.24)}>
                <AdminCard>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-ink-muted">
                        #{offer.listing.listingNumber} · {offer.listing.district}, {offer.listing.province}
                      </p>
                      <Link
                        href={`/panel/admin/ilanlar/${offer.listing.listingNumber}`}
                        className="mt-0.5 block truncate font-display text-base text-ink hover:text-clay"
                      >
                        {offer.listing.title}
                      </Link>
                      <p className="mt-1 text-sm text-ink">
                        {formatPriceRange(offer.priceMin, offer.priceMax)}
                        {offer.durationMonths
                          ? ` · ${t("durationMonths", { n: offer.durationMonths })}`
                          : ""}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill tone={offerStatusTone[offer.status]}>
                        {t(`offerStatus.${offer.status}`)}
                      </StatusPill>
                      {resolved && <StatusPill tone="muted">{t("contactResolvedBadge")}</StatusPill>}
                    </div>
                  </div>

                  {offer.note ? (
                    <p className="mt-3 flex gap-2 rounded-xl bg-surface/60 px-3 py-2.5 text-sm leading-relaxed text-ink">
                      <StickyNote className="mt-0.5 size-3.5 shrink-0 text-clay" />
                      {offer.note}
                    </p>
                  ) : (
                    <p className="mt-3 text-xs text-ink-muted italic">{t("noteEmpty")}</p>
                  )}

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-xl bg-surface/40 px-3 py-2">
                      <p className="text-xs text-ink-muted">{t("ownerTitle")}</p>
                      <p className="mt-0.5 truncate text-sm text-ink">
                        {offer.listing.owner.name ?? offer.listing.owner.email}
                      </p>
                      <p className="truncate text-xs text-ink-muted">
                        {offer.listing.owner.email}
                        {offer.listing.owner.phone ? ` · ${offer.listing.owner.phone}` : ""}
                      </p>
                    </div>
                    <div className="rounded-xl bg-surface/40 px-3 py-2">
                      <p className="text-xs text-ink-muted">{t("contractorTitle")}</p>
                      <p className="mt-0.5 truncate text-sm text-ink">
                        {offer.contractor.contractorProfile?.companyName ??
                          offer.contractor.name ??
                          offer.contractor.email}
                      </p>
                      <p className="truncate text-xs text-ink-muted">
                        {offer.contractor.email}
                        {offer.contractor.phone ? ` · ${offer.contractor.phone}` : ""}
                      </p>
                    </div>
                  </div>

                  {appointment && (
                    <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-ink">
                      <CalendarClock className="size-3.5 shrink-0 text-clay" />
                      {format.dateTime(appointment.scheduledAt, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                      {appointment.location ? ` · ${appointment.location}` : ""}
                      <StatusPill tone={appointmentStatusTone[appointment.status]}>
                        {t(`appointmentStatus.${appointment.status}`)}
                      </StatusPill>
                    </p>
                  )}

                  {offer.status === "INTERESTED" && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-hairline pt-3">
                      <ProposeAppointmentForm offerId={offer.id} />
                      <ContactToggle offerId={offer.id} resolved={resolved} />
                    </div>
                  )}
                </AdminCard>
              </FadeIn>
            );
          })}
        </div>
      )}
    </div>
  );
}
