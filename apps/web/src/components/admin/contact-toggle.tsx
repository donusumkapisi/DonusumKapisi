"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reopenOfferContactAction, resolveOfferContactAction } from "@/lib/actions/admin";

/** One control for the two directions of the contact queue: close it, or put it back. */
export function ContactToggle({ offerId, resolved }: { offerId: string; resolved: boolean }) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("panelAdmin");

  return (
    <Button
      type="button"
      variant={resolved ? "outline" : "cta"}
      size="sm"
      disabled={isPending}
      onClick={() =>
        startTransition(() =>
          resolved ? reopenOfferContactAction(offerId) : resolveOfferContactAction(offerId)
        )
      }
    >
      {resolved ? <Undo2 className="size-3.5" /> : <CheckCircle2 className="size-3.5" />}
      {resolved ? t("contactReopen") : t("contactResolve")}
    </Button>
  );
}
