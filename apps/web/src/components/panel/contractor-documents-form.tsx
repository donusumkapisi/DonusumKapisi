"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { CheckCircle2, CircleAlert, CircleDashed, FileText, Upload } from "lucide-react";
import {
  ACCEPTED_DOCUMENT_ACCEPT_ATTR,
  CONTRACTOR_DOCUMENT_TYPES,
  MYBN_LENGTH,
  type ContractorDocumentTypeValue,
} from "@donusum-kapisi/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShineButton } from "@/components/ui/shine-button";
import { cn } from "@/lib/utils";
import {
  submitContractorDocumentsAction,
  type ContractorDocumentsActionState,
} from "@/lib/actions/contractor-verification";

export type ExistingDocument = {
  type: ContractorDocumentTypeValue;
  url: string;
  fileName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewNote: string | null;
};

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <ShineButton type="submit" disabled={pending}>
      {pending ? pendingLabel : label}
    </ShineButton>
  );
}

const statusStyles = {
  APPROVED: { icon: CheckCircle2, className: "text-clay" },
  REJECTED: { icon: CircleAlert, className: "text-danger" },
  PENDING: { icon: CircleDashed, className: "text-warning" },
} as const;

function DocumentRow({
  type,
  existing,
}: {
  type: ContractorDocumentTypeValue;
  existing?: ExistingDocument;
}) {
  const t = useTranslations("contractorDocs");
  const [selectedName, setSelectedName] = useState("");
  const status = existing ? statusStyles[existing.status] : null;
  const StatusIcon = status?.icon;

  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-colors",
        existing?.status === "REJECTED"
          ? "border-danger/30 bg-danger/[0.04]"
          : "border-hairline bg-surface/40"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <Label htmlFor={type} className="text-sm font-medium text-ink">
            {t(`type.${type}`)}
          </Label>
          <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">{t(`hint.${type}`)}</p>
        </div>
        {existing && StatusIcon ? (
          <span className={cn("flex shrink-0 items-center gap-1.5 text-xs", status.className)}>
            <StatusIcon className="size-3.5" />
            {t(`status.${existing.status}`)}
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-paper px-2 py-0.5 text-[0.7rem] text-ink-muted">
            {t("requiredBadge")}
          </span>
        )}
      </div>

      {existing && (
        <a
          href={existing.url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-xs text-clay hover:underline"
        >
          <FileText className="size-3.5" />
          {existing.fileName}
        </a>
      )}

      {existing?.reviewNote && (
        <p className="mt-2 rounded-lg bg-danger/8 px-3 py-2 text-xs leading-relaxed text-danger">
          {existing.reviewNote}
        </p>
      )}

      <div className="mt-3">
        <input
          id={type}
          name={type}
          type="file"
          accept={ACCEPTED_DOCUMENT_ACCEPT_ATTR}
          onChange={(event) => setSelectedName(event.target.files?.[0]?.name ?? "")}
          className="block w-full text-sm text-ink-muted file:mr-3 file:rounded-lg file:border-0 file:bg-paper file:px-3 file:py-2 file:text-sm file:font-medium file:text-ink hover:file:bg-surface"
        />
        {selectedName && existing && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-clay">
            <Upload className="size-3" />
            {t("willReplace")}
          </p>
        )}
      </div>
    </div>
  );
}

export function ContractorDocumentsForm({
  companyName,
  mybn,
  documents,
}: {
  companyName: string | null;
  mybn: string | null;
  documents: ExistingDocument[];
}) {
  const [state, formAction] = useActionState<ContractorDocumentsActionState, FormData>(
    submitContractorDocumentsAction,
    null
  );
  const t = useTranslations("contractorDocs");
  const byType = new Map(documents.map((document) => [document.type, document]));

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="companyName" className="text-ink-muted">
            {t("companyNameLabel")}
          </Label>
          <Input
            id="companyName"
            name="companyName"
            required
            defaultValue={companyName ?? ""}
            className="h-10"
            placeholder={t("companyNamePlaceholder")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="mybn" className="text-ink-muted">
            {t("mybnLabel")}
          </Label>
          <Input
            id="mybn"
            name="mybn"
            required
            inputMode="numeric"
            defaultValue={mybn ?? ""}
            className="h-10 font-mono"
            placeholder={"0".repeat(MYBN_LENGTH)}
          />
          <p className="text-xs leading-relaxed text-ink-muted/80">{t("mybnHint")}</p>
        </div>
      </div>

      <div className="space-y-3">
        {CONTRACTOR_DOCUMENT_TYPES.map((type) => (
          <DocumentRow key={type} type={type} existing={byType.get(type)} />
        ))}
      </div>

      <p className="text-xs leading-relaxed text-ink-muted/80">{t("formatHint")}</p>

      {state && "error" in state && (
        <div
          role="alert"
          className="rounded-xl border border-danger/25 bg-danger/8 px-3.5 py-3 text-sm text-danger"
        >
          {state.error}
        </div>
      )}
      {state && "success" in state && (
        <div className="rounded-xl border border-clay/25 bg-clay/8 px-3.5 py-3 text-sm text-clay">
          {t("submitSuccess")}
        </div>
      )}

      <SubmitButton label={t("submitButton")} pendingLabel={t("submitButtonPending")} />
    </form>
  );
}
