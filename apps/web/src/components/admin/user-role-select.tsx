"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import type { UserRole } from "@donusum-kapisi/db";
import { updateUserRoleAction } from "@/lib/actions/admin";

const ROLES: UserRole[] = ["HOMEOWNER", "CONTRACTOR", "ADMIN"];

export function UserRoleSelect({
  userId,
  role,
  disabled,
}: {
  userId: string;
  role: UserRole;
  disabled?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("panelAdmin");

  return (
    <div className="flex flex-col items-end gap-1">
      <select
        aria-label={t("changeRoleLabel")}
        value={role}
        disabled={disabled || isPending}
        onChange={(event) => {
          const next = event.target.value as UserRole;
          setError(null);
          startTransition(async () => {
            try {
              await updateUserRoleAction(userId, next);
            } catch {
              setError(t("changeRoleError"));
            }
          });
        }}
        className="h-8 rounded-lg border border-hairline bg-paper px-2 text-xs text-ink outline-none focus-visible:border-clay/40 focus-visible:ring-3 focus-visible:ring-clay/15 disabled:opacity-50 [&_option]:bg-paper [&_option]:text-ink"
      >
        {ROLES.map((value) => (
          <option key={value} value={value}>
            {t(`role.${value}`)}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
