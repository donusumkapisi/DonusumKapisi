"use client";

import { useTransition } from "react";
import type { OfferStatus } from "@donusum-kapisi/db";
import { Button } from "@/components/ui/button";
import { updateOfferStatusAction } from "@/lib/actions/offer";

export function OfferStatusActions({
  offerId,
  actions,
}: {
  offerId: string;
  actions: { status: OfferStatus; label: string; variant: "cta" | "outline" | "ghost" }[];
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <Button
          key={action.status}
          type="button"
          variant={action.variant}
          size="sm"
          disabled={isPending}
          onClick={() => startTransition(() => updateOfferStatusAction(offerId, action.status))}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
