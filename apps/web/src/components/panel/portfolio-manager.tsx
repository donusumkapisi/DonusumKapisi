"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import type { PortfolioItemDTO } from "@donusum-kapisi/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  createPortfolioItemAction,
  deletePortfolioItemAction,
  type PortfolioActionState,
} from "@/lib/actions/portfolio";

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("panel");
  return (
    <Button type="submit" variant="cta" disabled={pending} className="h-10 px-5">
      {pending ? t("portfolioAdding") : t("portfolioAddProject")}
    </Button>
  );
}

export function PortfolioManager({ items }: { items: PortfolioItemDTO[] }) {
  const [state, formAction] = useActionState<PortfolioActionState, FormData>(
    createPortfolioItemAction,
    null
  );
  const t = useTranslations("panel");

  return (
    <div className="space-y-6">
      {items.length > 0 && (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-3 rounded-2xl border border-hairline bg-paper p-3.5 shadow-[0_1px_2px_rgb(22_52_73_/_0.04)] transition-colors hover:border-clay/25"
            >
              <div className="flex min-w-0 flex-1 gap-3">
                <div className="flex shrink-0 gap-1">
                  {item.beforeImageUrl && (
                    <div className="relative size-14 overflow-hidden rounded-lg bg-surface">
                      <Image src={item.beforeImageUrl} alt={t("portfolioBeforeAlt")} fill sizes="56px" className="object-cover" />
                    </div>
                  )}
                  {item.afterImageUrl && (
                    <div className="relative size-14 overflow-hidden rounded-lg bg-surface">
                      <Image src={item.afterImageUrl} alt={t("portfolioAfterAlt")} fill sizes="56px" className="object-cover" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{item.title}</p>
                  {item.description && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-ink-muted">{item.description}</p>
                  )}
                </div>
              </div>
              <form action={deletePortfolioItemAction.bind(null, item.id)}>
                <button
                  type="submit"
                  className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-danger/10 hover:text-danger"
                  aria-label={t("portfolioDeleteLabel")}
                >
                  <Trash2 className="size-4" />
                </button>
              </form>
            </div>
          ))}
        </div>
      )}

      <form action={formAction} className="space-y-4 rounded-2xl border border-hairline bg-surface/40 p-4">
        <p className="text-sm font-medium text-ink">{t("portfolioAddTitle")}</p>
        <div className="space-y-1.5">
          <Label htmlFor="title" className="text-ink-muted">
            {t("portfolioTitleLabel")}
          </Label>
          <Input id="title" name="title" required className="h-10 bg-paper" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="description" className="text-ink-muted">
            {t("portfolioDescriptionLabel")}
          </Label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="w-full rounded-lg border border-input bg-paper px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="beforeImage" className="text-ink-muted">
              {t("portfolioBeforeImageLabel")}
            </Label>
            <input
              id="beforeImage"
              name="beforeImage"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="block w-full text-xs text-ink-muted file:mr-2 file:rounded-lg file:border-0 file:bg-surface file:px-2.5 file:py-1.5 file:text-xs file:font-medium file:text-ink"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="afterImage" className="text-ink-muted">
              {t("portfolioAfterImageLabel")}
            </Label>
            <input
              id="afterImage"
              name="afterImage"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="block w-full text-xs text-ink-muted file:mr-2 file:rounded-lg file:border-0 file:bg-surface file:px-2.5 file:py-1.5 file:text-xs file:font-medium file:text-ink"
            />
          </div>
        </div>

        {state && "error" in state && (
          <p role="alert" className="text-sm text-destructive">
            {state.error}
          </p>
        )}
        {state && "success" in state && <p className="text-sm text-clay">{t("portfolioSuccess")}</p>}

        <SubmitButton />
      </form>
    </div>
  );
}
