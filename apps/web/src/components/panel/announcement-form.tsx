"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { AnnouncementActionState } from "@/lib/actions/announcement";

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("common");
  return (
    <Button type="submit" variant="cta" disabled={pending} className="h-10 px-5">
      {pending ? t("saving") : t("save")}
    </Button>
  );
}

export function AnnouncementForm({
  action,
  initialValues,
}: {
  action: (
    prevState: AnnouncementActionState,
    formData: FormData
  ) => Promise<AnnouncementActionState>;
  initialValues?: {
    title: string;
    body: string;
    imageUrl: string | null;
    linkUrl: string | null;
    published: boolean;
  };
}) {
  const [state, formAction] = useActionState<AnnouncementActionState, FormData>(
    action,
    null
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const t = useTranslations("panelAnnouncementAdmin");

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="title" className="text-ink-muted">
          {t("titleLabel")}
        </Label>
        <Input
          id="title"
          name="title"
          defaultValue={initialValues?.title}
          required
          className="h-10"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="body" className="text-ink-muted">
          {t("bodyLabel")}
        </Label>
        <textarea
          id="body"
          name="body"
          rows={8}
          defaultValue={initialValues?.body}
          required
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="image" className="text-ink-muted">
          {t("imageLabel")}
        </Label>
        {(previewUrl || initialValues?.imageUrl) && (
          <div className="relative mb-2 h-40 w-full max-w-md overflow-hidden rounded-xl border border-hairline">
            <Image
              src={previewUrl ?? initialValues!.imageUrl!}
              alt={t("imageAlt")}
              fill
              className="object-cover"
              unoptimized={Boolean(previewUrl)}
            />
          </div>
        )}
        <input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) {
              setPreviewUrl(null);
              return;
            }
            setPreviewUrl(URL.createObjectURL(file));
          }}
          className="block w-full text-sm text-ink-muted file:mr-3 file:rounded-lg file:border-0 file:bg-surface file:px-3 file:py-2 file:text-sm file:font-medium file:text-ink"
        />
        <p className="text-xs text-ink-muted">{t("imageHint")}</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="linkUrl" className="text-ink-muted">
          {t("linkUrlLabel")}
        </Label>
        <Input
          id="linkUrl"
          name="linkUrl"
          type="url"
          placeholder="https://"
          defaultValue={initialValues?.linkUrl ?? ""}
          className="h-10"
        />
        <p className="text-xs text-ink-muted">{t("linkUrlHint")}</p>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          name="published"
          value="true"
          defaultChecked={initialValues?.published ?? false}
        />
        {t("publishCheckbox")}
      </label>

      {state && "error" in state && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
