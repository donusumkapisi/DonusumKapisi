"use client";

import { useTransition } from "react";
import type { ListingStatus } from "@donusum-kapisi/db";
import { Button } from "@/components/ui/button";
import { updateListingStatusAction } from "@/lib/actions/admin";

export function ListingStatusActions({
  listingId,
  actions,
}: {
  listingId: string;
  actions: { status: ListingStatus; label: string; variant: "cta" | "outline" | "ghost" | "cta-red" }[];
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
          onClick={() => startTransition(() => updateListingStatusAction(listingId, action.status))}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
