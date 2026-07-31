"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, CircleAlert, CircleDashed, ExternalLink, FileText } from "lucide-react";
import type { ContractorVerificationStatus } from "@donusum-kapisi/db";
import { CONTRACTOR_DOCUMENT_TYPES, type ContractorDocumentTypeValue } from "@donusum-kapisi/shared";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { cn } from "@/lib/utils";
import {
  approveContractorAction,
  rejectContractorAction,
  reviewContractorDocumentAction,
} from "@/lib/actions/contractor-verification";

export type ReviewDocument = {
  id: string;
  type: ContractorDocumentTypeValue;
  url: string;
  fileName: string;
  size: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewNote: string | null;
};

export type ContractorReview = {
  profileId: string;
  companyName: string | null;
  contactName: string | null;
  email: string;
  phone: string | null;
  mybn: string | null;
  status: ContractorVerificationStatus;
  verificationNote: string | null;
  submittedAt: string | null;
  documents: ReviewDocument[];
};

const documentStatusStyles = {
  APPROVED: { icon: CheckCircle2, className: "text-clay" },
  REJECTED: { icon: CircleAlert, className: "text-danger" },
  PENDING: { icon: CircleDashed, className: "text-warning" },
} as const;

const profileStatusStyles: Record<ContractorVerificationStatus, string> = {
  INCOMPLETE: "bg-surface text-ink-muted",
  PENDING: "bg-warning/10 text-warning",
  APPROVED: "bg-clay/10 text-clay",
  REJECTED: "bg-danger/10 text-danger",
};

function formatSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function DocumentReviewRow({ document }: { document: ReviewDocument }) {
  const t = useTranslations("contractorDocs");
  const tAdmin = useTranslations("panelAdmin");
  const [isPending, startTransition] = useTransition();
  const [note, setNote] = useState(document.reviewNote ?? "");
  const [isRejecting, setIsRejecting] = useState(false);

  const { icon: StatusIcon, className } = documentStatusStyles[document.status];

  return (
    <div className="rounded-xl border border-hairline bg-surface/40 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink">{t(`type.${document.type}`)}</p>
          <a
            href={document.url}
            target="_blank"
            rel="noreferrer"
            className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-clay hover:underline"
          >
            <FileText className="size-3.5" />
            <span className="max-w-[16rem] truncate">{document.fileName}</span>
            <span className="text-ink-muted">· {formatSize(document.size)}</span>
          </a>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className={cn("flex items-center gap-1.5 text-xs", className)}>
            <StatusIcon className="size-3.5" />
            {t(`status.${document.status}`)}
          </span>
          {document.status !== "APPROVED" && (
            <Button
              type="button"
              variant="cta"
              size="sm"
              disabled={isPending}
              onClick={() =>
                startTransition(() => reviewContractorDocumentAction(document.id, "APPROVED"))
              }
            >
              {tAdmin("actionApprove")}
            </Button>
          )}
          {document.status !== "REJECTED" && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => setIsRejecting((value) => !value)}
            >
              {tAdmin("actionReject")}
            </Button>
          )}
        </div>
      </div>

      {document.reviewNote && !isRejecting && (
        <p className="mt-2 text-xs leading-relaxed text-danger">{document.reviewNote}</p>
      )}

      {isRejecting && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={t("rejectNotePlaceholder")}
            className="h-9 min-w-0 flex-1 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <Button
            type="button"
            variant="cta-red"
            size="sm"
            disabled={isPending || note.trim().length < 3}
            onClick={() =>
              startTransition(async () => {
                await reviewContractorDocumentAction(document.id, "REJECTED", note.trim());
                setIsRejecting(false);
              })
            }
          >
            {t("confirmReject")}
          </Button>
        </div>
      )}
    </div>
  );
}

export function ContractorReviewCard({ review }: { review: ContractorReview }) {
  const t = useTranslations("contractorDocs");
  const tAdmin = useTranslations("panelAdmin");
  const [isPending, startTransition] = useTransition();
  const [rejectNote, setRejectNote] = useState(review.verificationNote ?? "");
  const [isRejecting, setIsRejecting] = useState(false);

  const byType = new Map(review.documents.map((document) => [document.type, document]));
  const missing = CONTRACTOR_DOCUMENT_TYPES.filter((type) => !byType.has(type));

  return (
    <SpotlightCard className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-base text-ink">
            {review.companyName || review.contactName || review.email}
          </p>
          <p className="mt-0.5 text-xs text-ink-muted">
            {review.contactName ? `${review.contactName} · ` : ""}
            {review.email}
            {review.phone ? ` · ${review.phone}` : ""}
          </p>
          {review.mybn ? (
            <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
              <span>{t("mybnShort")}</span>
              <span className="rounded-md bg-surface px-2 py-0.5 font-mono text-ink">
                {review.mybn}
              </span>
              <a
                href="https://yambis.csb.gov.tr/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-clay hover:underline"
              >
                {t("mybnLookup")}
                <ExternalLink className="size-3" />
              </a>
            </p>
          ) : (
            <p className="mt-2 text-xs text-danger">{t("mybnMissing")}</p>
          )}
        </div>

        <span
          className={cn(
            "shrink-0 rounded-full px-3 py-1 text-xs font-medium",
            profileStatusStyles[review.status]
          )}
        >
          {t(`status.${review.status}`)}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {review.documents.map((document) => (
          <DocumentReviewRow key={document.id} document={document} />
        ))}
        {missing.length > 0 && (
          <p className="rounded-xl border border-dashed border-hairline px-3 py-2.5 text-xs text-ink-muted">
            {t("adminMissingDocuments", {
              list: missing.map((type) => t(`type.${type}`)).join(", "),
            })}
          </p>
        )}
      </div>

      {review.verificationNote && !isRejecting && (
        <p className="mt-3 rounded-lg bg-danger/8 px-3 py-2 text-xs leading-relaxed text-danger">
          {review.verificationNote}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-hairline pt-4">
        <Button
          type="button"
          variant="cta"
          size="sm"
          disabled={isPending || missing.length > 0 || review.status === "APPROVED"}
          onClick={() => startTransition(() => approveContractorAction(review.profileId))}
        >
          {t("approveAll")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => setIsRejecting((value) => !value)}
        >
          {t("rejectApplication")}
        </Button>
        {review.submittedAt && (
          <span className="ml-auto text-xs text-ink-muted">
            {tAdmin("submittedAtLabel", { date: review.submittedAt })}
          </span>
        )}
      </div>

      {isRejecting && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            value={rejectNote}
            onChange={(event) => setRejectNote(event.target.value)}
            placeholder={t("rejectNotePlaceholder")}
            className="h-9 min-w-0 flex-1 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <Button
            type="button"
            variant="cta-red"
            size="sm"
            disabled={isPending || rejectNote.trim().length < 3}
            onClick={() =>
              startTransition(async () => {
                await rejectContractorAction(review.profileId, rejectNote.trim());
                setIsRejecting(false);
              })
            }
          >
            {t("confirmReject")}
          </Button>
        </div>
      )}
    </SpotlightCard>
  );
}
