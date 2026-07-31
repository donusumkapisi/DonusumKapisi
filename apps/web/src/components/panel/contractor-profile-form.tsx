"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  updateContractorProfileAction,
  type ContractorProfileActionState,
} from "@/lib/actions/contractor-profile";

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("common");
  return (
    <Button type="submit" variant="cta" disabled={pending} className="h-10 px-5">
      {pending ? t("saving") : t("save")}
    </Button>
  );
}

export function ContractorProfileForm({
  companyName,
  about,
}: {
  companyName: string | null;
  about: string | null;
}) {
  const [state, formAction] = useActionState<ContractorProfileActionState, FormData>(
    updateContractorProfileAction,
    null
  );
  const t = useTranslations("panel");

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="companyName" className="text-ink-muted">
          {t("contractorProfileCompanyName")}
        </Label>
        <Input id="companyName" name="companyName" defaultValue={companyName ?? ""} className="h-10" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="about" className="text-ink-muted">
          {t("contractorProfileAbout")}
        </Label>
        <textarea
          id="about"
          name="about"
          rows={4}
          defaultValue={about ?? ""}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      {state && "error" in state && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state && "success" in state && (
        <p className="text-sm text-clay">{t("contractorProfileSuccess")}</p>
      )}

      <SubmitButton />
    </form>
  );
}
