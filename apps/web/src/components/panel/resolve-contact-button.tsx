"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { resolveOfferContactAction } from "@/lib/actions/admin";

export function ResolveContactButton({ offerId }: { offerId: string }) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("panel");

  return (
    <Button
      type="button"
      variant="cta"
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(() => resolveOfferContactAction(offerId))}
    >
      {t("resolveContactDone")}
    </Button>
  );
}
