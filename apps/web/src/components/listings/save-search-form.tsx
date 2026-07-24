"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { BookmarkPlus } from "lucide-react";
import { createSavedSearchAction, type SavedSearchActionState } from "@/lib/actions/saved-search";
import { Button } from "@/components/ui/button";

export function SaveSearchForm({ province, q }: { province: string; q: string }) {
  const [state, formAction, isPending] = useActionState<SavedSearchActionState, FormData>(
    createSavedSearchAction,
    null
  );
  const t = useTranslations("listings");

  if (state && "success" in state) {
    return (
      <p className="mt-3 flex items-center gap-1.5 text-sm text-clay">
        <BookmarkPlus className="size-4" /> {t("saveSearchSuccess")}
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-3 flex flex-wrap items-center gap-2">
      <input type="hidden" name="province" value={province} />
      <input type="hidden" name="q" value={q} />
      <input
        type="text"
        name="name"
        placeholder={t("saveSearchNamePlaceholder")}
        required
        className="min-w-0 flex-1 rounded-xl border border-hairline bg-paper px-3 py-2 text-sm text-ink outline-none placeholder:text-ink-muted/60"
      />
      <Button type="submit" variant="outline" size="sm" disabled={isPending}>
        <BookmarkPlus className="size-4" /> {t("saveSearchButton")}
      </Button>
      {state && "error" in state && <p className="w-full text-xs text-danger">{state.error}</p>}
    </form>
  );
}
