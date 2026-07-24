"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions/sign-out";

export function SignOutButton({ className }: { className?: string }) {
  const t = useTranslations("panel");
  return (
    <form action={signOutAction}>
      <Button type="submit" variant="outline" size="sm" className={className}>
        {t("signOut")}
      </Button>
    </form>
  );
}
