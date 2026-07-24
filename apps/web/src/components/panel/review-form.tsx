"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createReviewAction, type ReviewActionState } from "@/lib/actions/review";
import { cn } from "@/lib/utils";

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("panel");
  return (
    <Button type="submit" variant="cta" size="sm" disabled={pending}>
      {pending ? t("reviewSubmitting") : t("reviewSubmit")}
    </Button>
  );
}

export function ReviewForm({ offerId }: { offerId: string }) {
  const boundAction = createReviewAction.bind(null, offerId);
  const [state, formAction] = useActionState<ReviewActionState, FormData>(boundAction, null);
  const [rating, setRating] = useState(5);
  const t = useTranslations("panel");

  if (state && "success" in state) {
    return <p className="text-sm text-clay">{t("reviewSuccess")}</p>;
  }

  return (
    <form action={formAction} className="space-y-3 rounded-xl bg-surface/60 p-3">
      <input type="hidden" name="rating" value={rating} />
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            aria-label={t("reviewStarLabel", { value })}
          >
            <Star
              className={cn(
                "size-5",
                value <= rating ? "fill-highlight text-highlight" : "text-hairline"
              )}
            />
          </button>
        ))}
      </div>
      <textarea
        name="comment"
        rows={2}
        placeholder={t("reviewCommentPlaceholder")}
        className="w-full rounded-lg border border-hairline bg-paper px-2.5 py-2 text-sm outline-none focus-visible:border-clay/50"
      />
      {state && "error" in state && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}
