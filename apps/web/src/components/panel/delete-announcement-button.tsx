"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { deleteAnnouncementAction } from "@/lib/actions/announcement";

export function DeleteAnnouncementButton({ announcementId }: { announcementId: string }) {
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
        if (confirm(t("deleteAnnouncementConfirm"))) {
          startTransition(() => deleteAnnouncementAction(announcementId));
        }
      }}
    >
      {tCommon("delete")}
    </Button>
  );
}
