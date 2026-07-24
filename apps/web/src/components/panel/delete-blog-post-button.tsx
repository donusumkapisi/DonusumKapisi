"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { deleteBlogPostAction } from "@/lib/actions/blog";

export function DeleteBlogPostButton({ postId }: { postId: string }) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("panel");
  const tCommon = useTranslations("common");

  return (
    <Button
      type="button"
      variant="cta-red"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (confirm(t("deleteBlogConfirm"))) {
          startTransition(() => deleteBlogPostAction(postId));
        }
      }}
    >
      {tCommon("delete")}
    </Button>
  );
}
