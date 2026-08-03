"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { BLOG_CATEGORIES, slugify } from "@donusum-kapisi/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { BlogActionState } from "@/lib/actions/blog";

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("common");
  return (
    <Button type="submit" variant="cta" disabled={pending} className="h-10 px-5">
      {pending ? t("saving") : t("save")}
    </Button>
  );
}

export function BlogPostForm({
  action,
  initialValues,
}: {
  action: (prevState: BlogActionState, formData: FormData) => Promise<BlogActionState>;
  initialValues?: {
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    coverImageUrl: string | null;
    category: string;
    tags: string[];
    metaDescription: string | null;
    province: string | null;
    district: string | null;
    published: boolean;
  };
}) {
  const [state, formAction] = useActionState<BlogActionState, FormData>(action, null);
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValues));
  const t = useTranslations("panelBlogAdmin");

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="title" className="text-ink-muted">
          {t("titleLabel")}
        </Label>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className="h-10"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="slug" className="text-ink-muted">
          {t("slugLabel")}
        </Label>
        <Input
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
          className="h-10"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="excerpt" className="text-ink-muted">
          {t("excerptLabel")}
        </Label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          defaultValue={initialValues?.excerpt}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="body" className="text-ink-muted">
          {t("bodyLabel")}
        </Label>
        <textarea
          id="body"
          name="body"
          rows={14}
          defaultValue={initialValues?.body}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="category" className="text-ink-muted">
            {t("categoryLabel")}
          </Label>
          <select
            id="category"
            name="category"
            defaultValue={initialValues?.category ?? ""}
            className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 [&_option]:bg-paper [&_option]:text-ink"
          >
            <option value="" disabled>
              {t("categoryPlaceholder")}
            </option>
            {BLOG_CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tags" className="text-ink-muted">
            {t("tagsLabel")}
          </Label>
          <Input
            id="tags"
            name="tags"
            placeholder={t("tagsPlaceholder")}
            defaultValue={initialValues?.tags?.join(", ") ?? ""}
            className="h-10"
          />
          <p className="text-xs text-ink-muted">{t("tagsHint")}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="province" className="text-ink-muted">
            {t("provinceLabel")}
          </Label>
          <Input
            id="province"
            name="province"
            defaultValue={initialValues?.province ?? ""}
            className="h-10"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="district" className="text-ink-muted">
            {t("districtLabel")}
          </Label>
          <Input
            id="district"
            name="district"
            defaultValue={initialValues?.district ?? ""}
            className="h-10"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="metaDescription" className="text-ink-muted">
          {t("metaDescriptionLabel")}
        </Label>
        <textarea
          id="metaDescription"
          name="metaDescription"
          rows={2}
          maxLength={160}
          defaultValue={initialValues?.metaDescription ?? ""}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <p className="text-xs text-ink-muted">{t("metaDescriptionHint")}</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="coverImage" className="text-ink-muted">
          {t("coverImageLabel")}
        </Label>
        {initialValues?.coverImageUrl && (
          <div className="relative mb-2 h-32 w-56 overflow-hidden rounded-lg border border-hairline">
            <Image src={initialValues.coverImageUrl} alt={t("coverImageAlt")} fill className="object-cover" />
          </div>
        )}
        <input
          id="coverImage"
          name="coverImage"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="block w-full text-sm text-ink-muted file:mr-3 file:rounded-lg file:border-0 file:bg-surface file:px-3 file:py-2 file:text-sm file:font-medium file:text-ink"
        />
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
