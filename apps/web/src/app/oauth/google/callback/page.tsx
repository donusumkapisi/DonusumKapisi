"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { UserRole } from "@donusum-kapisi/db";
import { socialAuthAction } from "@/lib/actions/social-auth";
import {
  GOOGLE_MODE_KEY,
  GOOGLE_NONCE_KEY,
  GOOGLE_ROLE_KEY,
} from "@/lib/google-oauth";
import { BrandMark } from "@/components/brand/brand-logo";

function readHashParams() {
  if (typeof window === "undefined") return new URLSearchParams();
  const raw = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  return new URLSearchParams(raw);
}

export default function GoogleCallbackPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const params = readHashParams();
    const idToken = params.get("id_token");
    const oauthError = params.get("error");

    if (oauthError) {
      setError(t("errorGoogleFailed"));
      return;
    }

    if (!idToken) {
      setError(t("errorGoogleFailed"));
      return;
    }

    const storedNonce = sessionStorage.getItem(GOOGLE_NONCE_KEY);
    const mode = sessionStorage.getItem(GOOGLE_MODE_KEY);
    const roleRaw = sessionStorage.getItem(GOOGLE_ROLE_KEY);
    const role =
      roleRaw === "HOMEOWNER" || roleRaw === "CONTRACTOR"
        ? (roleRaw as UserRole)
        : undefined;

    // Hash'i URL'den temizle
    window.history.replaceState(null, "", window.location.pathname);

    startTransition(async () => {
      const result = await socialAuthAction({
        provider: "google",
        idToken,
        role: mode === "signup" ? role : undefined,
      });

      sessionStorage.removeItem(GOOGLE_NONCE_KEY);
      sessionStorage.removeItem(GOOGLE_MODE_KEY);
      sessionStorage.removeItem(GOOGLE_ROLE_KEY);

      if (result?.error) {
        setError(result.error);
        return;
      }

      // signIn redirect etmezse (edge case) panele gönder
      router.replace("/panel");
    });

    void storedNonce;
  }, [router, t]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 py-16">
      <BrandMark className="size-12" />
      {error ? (
        <div className="mt-8 max-w-sm text-center">
          <p className="text-sm text-danger">{error}</p>
          <Link
            href="/giris"
            className="mt-4 inline-block text-sm font-medium text-clay underline-offset-4 hover:underline"
          >
            {t("backToLogin")}
          </Link>
        </div>
      ) : (
        <p className="mt-8 text-sm text-ink-muted">
          {isPending ? t("socialPending") : t("socialPending")}
        </p>
      )}
    </div>
  );
}
