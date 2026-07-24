"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createOfferAction, type OfferActionState } from "@/lib/actions/offer";

function SubmitButton({ hasExistingOffer }: { hasExistingOffer: boolean }) {
  const { pending } = useFormStatus();
  const t = useTranslations("listingDetail");
  return (
    <Button type="submit" variant="cta-orange" disabled={pending} className="h-10 px-5">
      {pending ? t("offerSubmitting") : hasExistingOffer ? t("offerSubmitUpdate") : t("offerSubmitCreate")}
    </Button>
  );
}

export function OfferForm({
  listingNumber,
  existingOffer,
}: {
  listingNumber: string;
  existingOffer: {
    priceMin: number;
    priceMax: number;
    durationMonths: number | null;
    note: string | null;
  } | null;
}) {
  const boundAction = createOfferAction.bind(null, listingNumber);
  const [state, formAction] = useActionState<OfferActionState, FormData>(boundAction, null);
  const t = useTranslations("listingDetail");

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="priceMin" className="text-ink-muted">
            {t("offerPriceMinLabel")}
          </Label>
          <Input
            id="priceMin"
            name="priceMin"
            type="number"
            min={0}
            required
            defaultValue={existingOffer?.priceMin}
            className="h-10"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="priceMax" className="text-ink-muted">
            {t("offerPriceMaxLabel")}
          </Label>
          <Input
            id="priceMax"
            name="priceMax"
            type="number"
            min={0}
            required
            defaultValue={existingOffer?.priceMax}
            className="h-10"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="durationMonths" className="text-ink-muted">
          {t("offerDurationLabel")}
        </Label>
        <Input
          id="durationMonths"
          name="durationMonths"
          type="number"
          min={0}
          defaultValue={existingOffer?.durationMonths ?? undefined}
          className="h-10"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="note" className="text-ink-muted">
          {t("offerNoteLabel")}
        </Label>
        <textarea
          id="note"
          name="note"
          rows={3}
          defaultValue={existingOffer?.note ?? undefined}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      {state && "error" in state && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state && "success" in state && (
        <p className="text-sm text-clay">{t("offerSuccess")}</p>
      )}

      <SubmitButton hasExistingOffer={Boolean(existingOffer)} />
    </form>
  );
}
