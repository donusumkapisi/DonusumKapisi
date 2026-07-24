"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { verifyContractorAction } from "@/lib/actions/contractor-profile";

export function VerifyContractorButton({
  profileId,
  verified,
}: {
  profileId: string;
  verified: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("panel");

  return (
    <Button
      type="button"
      variant={verified ? "outline" : "cta"}
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(() => verifyContractorAction(profileId, !verified))}
    >
      {verified ? t("verifyContractorRemove") : t("verifyContractorVerify")}
    </Button>
  );
}
