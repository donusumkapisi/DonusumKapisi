"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { CONTRACTOR_DOCUMENT_TYPES, type ContractorDocumentTypeValue } from "@donusum-kapisi/shared";
import { cn } from "@/lib/utils";

export type ChecklistEntry = {
  type: ContractorDocumentTypeValue;
  status: "PENDING" | "APPROVED" | "REJECTED";
};

/** Missing and rejected both mean "upload this", so both get a cross. */
const rowStyles = {
  APPROVED: { icon: CheckCircle2, tone: "text-clay", label: "status.APPROVED" },
  PENDING: { icon: Clock, tone: "text-warning", label: "status.PENDING" },
  REJECTED: { icon: XCircle, tone: "text-danger", label: "status.REJECTED" },
  MISSING: { icon: XCircle, tone: "text-danger", label: "missingStatus" },
} as const;

export function DocumentChecklist({
  documents,
  className,
}: {
  documents: ChecklistEntry[];
  className?: string;
}) {
  const t = useTranslations("contractorDocs");
  const byType = new Map(documents.map((document) => [document.type, document.status]));
  const uploaded = CONTRACTOR_DOCUMENT_TYPES.filter((type) => byType.get(type) === "APPROVED" || byType.get(type) === "PENDING").length;

  return (
    <div className={cn("rounded-xl border border-hairline bg-surface/40 p-4", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-medium text-ink">{t("uploadedTitle")}</p>
        <p className="font-mono text-xs text-ink-muted">
          {t("uploadedCount", { done: uploaded, total: CONTRACTOR_DOCUMENT_TYPES.length })}
        </p>
      </div>

      <ul className="mt-3 space-y-2">
        {CONTRACTOR_DOCUMENT_TYPES.map((type) => {
          const { icon: Icon, tone, label } = rowStyles[byType.get(type) ?? "MISSING"];
          return (
            <li key={type} className="flex items-center gap-2.5 text-sm">
              <Icon className={cn("size-4 shrink-0", tone)} />
              <span className="min-w-0 flex-1 truncate text-ink">{t(`type.${type}`)}</span>
              <span className={cn("shrink-0 text-xs", tone)}>{t(label)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
