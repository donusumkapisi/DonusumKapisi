"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { List, Rows3, Star } from "lucide-react";
import type { Appointment, OfferStatus } from "@donusum-kapisi/db";
import { OfferStatusActions } from "@/components/panel/offer-status-actions";
import { ReviewForm } from "@/components/panel/review-form";
import { AppointmentCard } from "@/components/panel/appointment-card";
import { formatPriceRange } from "@/lib/format";

export type OfferForSection = {
  id: string;
  contractorId: string;
  contractorName: string | null;
  priceMin: number;
  priceMax: number;
  durationMonths: number | null;
  note: string | null;
  status: OfferStatus;
  hasReview: boolean;
  canReview: boolean;
  rating: { averageRating: number | null; reviewCount: number };
  appointment: Appointment | null;
};

export function ListingOffersSection({ offers }: { offers: OfferForSection[] }) {
  const [view, setView] = useState<"list" | "compare">("list");
  const t = useTranslations("panel");

  const offerStatusLabels: Record<string, { label: string; className: string }> = {
    PENDING: { label: t("offerStatusPendingOwner"), className: "bg-warning/10 text-warning" },
    INTERESTED: { label: t("offerStatusInterestedOwner"), className: "bg-clay/10 text-clay" },
    DECLINED: { label: t("offerStatusDeclinedOwner"), className: "bg-surface text-ink-muted" },
    WITHDRAWN: { label: t("offerStatusWithdrawn"), className: "bg-surface text-ink-muted" },
  };

  return (
    <div className="mt-4 space-y-3 border-t border-hairline pt-4">
      {offers.length >= 2 && (
        <div className="flex justify-end">
          <div className="inline-flex rounded-full border border-hairline bg-surface/60 p-1">
            <button
              type="button"
              onClick={() => setView("list")}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                view === "list" ? "bg-paper text-ink shadow-sm" : "text-ink-muted"
              }`}
            >
              <List className="size-3.5" /> {t("offersViewList")}
            </button>
            <button
              type="button"
              onClick={() => setView("compare")}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                view === "compare" ? "bg-paper text-ink shadow-sm" : "text-ink-muted"
              }`}
            >
              <Rows3 className="size-3.5" /> {t("offersViewCompare")}
            </button>
          </div>
        </div>
      )}

      {view === "compare" && offers.length >= 2 ? (
        <div className="overflow-x-auto rounded-xl border border-hairline">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-hairline bg-surface/60 text-xs text-ink-muted">
                <th className="px-3 py-2 font-medium">{t("compareTableContractor")}</th>
                <th className="px-3 py-2 font-medium">{t("compareTableOffer")}</th>
                <th className="px-3 py-2 font-medium">{t("compareTableDuration")}</th>
                <th className="px-3 py-2 font-medium">{t("compareTableRating")}</th>
                <th className="px-3 py-2 font-medium">{t("compareTableStatus")}</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => {
                const offerStatus = offerStatusLabels[offer.status];
                return (
                  <tr key={offer.id} className="border-b border-hairline last:border-0">
                    <td className="px-3 py-2">
                      <Link
                        href={`/muteahhitler/${offer.contractorId}`}
                        className="font-medium text-ink hover:text-clay"
                      >
                        {offer.contractorName ?? t("unnamedContractor")}
                      </Link>
                    </td>
                    <td className="px-3 py-2 text-ink">
                      {formatPriceRange(offer.priceMin, offer.priceMax)}
                    </td>
                    <td className="px-3 py-2 text-ink-muted">
                      {offer.durationMonths ? t("durationMonths", { n: offer.durationMonths }) : "—"}
                    </td>
                    <td className="px-3 py-2">
                      {offer.rating.reviewCount > 0 ? (
                        <span className="flex items-center gap-1 text-ink-muted">
                          <Star className="size-3.5 fill-highlight text-highlight" />
                          {offer.rating.averageRating?.toFixed(1)} ({offer.rating.reviewCount})
                        </span>
                      ) : (
                        <span className="text-ink-muted">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${offerStatus.className}`}
                      >
                        {offerStatus.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        offers.map((offer) => {
          const offerStatus = offerStatusLabels[offer.status];
          return (
            <div key={offer.id} className="rounded-xl bg-surface/60 p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-ink">
                    <Link href={`/muteahhitler/${offer.contractorId}`} className="hover:text-clay">
                      {offer.contractorName ?? t("unnamedContractor")}
                    </Link>
                    {offer.rating.reviewCount > 0 && (
                      <span className="flex items-center gap-0.5 text-xs text-ink-muted">
                        <Star className="size-3.5 fill-highlight text-highlight" />
                        {offer.rating.averageRating?.toFixed(1)}
                      </span>
                    )}
                    <span>· {formatPriceRange(offer.priceMin, offer.priceMax)}</span>
                  </div>
                  {offer.note && <p className="mt-0.5 text-xs text-ink-muted">{offer.note}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${offerStatus.className}`}>
                    {offerStatus.label}
                  </span>
                  {(offer.status === "PENDING" || offer.status === "INTERESTED") && (
                    <OfferStatusActions
                      offerId={offer.id}
                      actions={
                        offer.status === "PENDING"
                          ? [
                              { status: "INTERESTED", label: t("offerActionInterested"), variant: "cta" },
                              { status: "DECLINED", label: t("offerActionNotInterested"), variant: "ghost" },
                            ]
                          : [{ status: "DECLINED", label: t("offerActionNotInterested"), variant: "ghost" }]
                      }
                    />
                  )}
                </div>
              </div>

              {offer.appointment && <AppointmentCard appointment={offer.appointment} />}

              {offer.canReview && (
                <div className="mt-3">
                  <ReviewForm offerId={offer.id} />
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
