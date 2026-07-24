"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import type { UserRole } from "@donusum-kapisi/db";
import { socialAuthAction } from "@/lib/actions/social-auth";
import { SITE_URL } from "@/lib/site";
import {
  GOOGLE_CALLBACK_PATH,
  GOOGLE_MODE_KEY,
  GOOGLE_NONCE_KEY,
  GOOGLE_ROLE_KEY,
} from "@/lib/google-oauth";
import { cn } from "@/lib/utils";

type AppleAuthResponse = {
  authorization: { id_token: string };
  user?: { name?: { firstName?: string; lastName?: string } };
};

declare global {
  interface Window {
    AppleID?: {
      auth: {
        init: (config: {
          clientId: string;
          scope: string;
          redirectURI: string;
          usePopup: boolean;
        }) => void;
        signIn: () => Promise<AppleAuthResponse>;
      };
    };
  }
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M16.7 12.6c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.1.8-.7 0-1.7-.7-2.8-.7-1.4 0-2.8.9-3.5 2.2-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.7.7 2.8.7c1.2 0 1.9-1 2.6-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.2-.8-2.2-3.7zM14.6 6.3c.6-.7 1-1.7.9-2.7-0.9.1-1.9.6-2.5 1.3-.6.6-1.1 1.7-1 2.6 1 .1 1.9-.5 2.6-1.2z" />
    </svg>
  );
}

function SocialDivider() {
  const t = useTranslations("auth");
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center" aria-hidden>
        <div className="w-full border-t border-hairline" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-paper px-3 text-[0.7rem] font-medium tracking-wide text-ink-muted uppercase">
          {t("socialDivider")}
        </span>
      </div>
    </div>
  );
}

function startGoogleRedirect(input: {
  clientId: string;
  mode: "login" | "signup";
  role?: UserRole;
}) {
  const nonce =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`;

  sessionStorage.setItem(GOOGLE_NONCE_KEY, nonce);
  sessionStorage.setItem(GOOGLE_MODE_KEY, input.mode);
  if (input.mode === "signup" && input.role) {
    sessionStorage.setItem(GOOGLE_ROLE_KEY, input.role);
  } else {
    sessionStorage.removeItem(GOOGLE_ROLE_KEY);
  }

  const redirectUri = `${window.location.origin}${GOOGLE_CALLBACK_PATH}`;
  const params = new URLSearchParams({
    client_id: input.clientId,
    redirect_uri: redirectUri,
    response_type: "id_token",
    scope: "openid email profile",
    nonce,
    prompt: "select_account",
  });

  window.location.assign(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}

function AppleSignInButton({
  mode,
  disabled,
  appleClientId,
  onComplete,
  onError,
}: {
  mode: "login" | "signup";
  disabled?: boolean;
  appleClientId: string;
  onComplete: (input: { idToken: string; name?: string }) => void;
  onError: (message: string) => void;
}) {
  const t = useTranslations("auth");
  const [isAppleReady, setIsAppleReady] = useState(false);
  const [isApplePending, setIsApplePending] = useState(false);

  useEffect(() => {
    const scriptId = "apple-signin-sdk";
    function initApple() {
      if (!window.AppleID) return;
      window.AppleID.auth.init({
        clientId: appleClientId,
        scope: "name email",
        redirectURI: `${SITE_URL}/api/auth/callback/apple`,
        usePopup: true,
      });
      setIsAppleReady(true);
    }

    if (window.AppleID) {
      initApple();
      return;
    }

    const existing = document.getElementById(scriptId);
    if (existing) {
      existing.addEventListener("load", initApple);
      return () => existing.removeEventListener("load", initApple);
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src =
      "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    script.async = true;
    script.onload = initApple;
    document.body.appendChild(script);
  }, [appleClientId]);

  async function handleApple() {
    if (!window.AppleID || !isAppleReady) {
      onError(t("errorAppleUnavailable"));
      return;
    }
    onError("");
    setIsApplePending(true);
    try {
      const response = await window.AppleID.auth.signIn();
      const idToken = response.authorization.id_token;
      const first = response.user?.name?.firstName ?? "";
      const last = response.user?.name?.lastName ?? "";
      const name = `${first} ${last}`.trim() || undefined;
      onComplete({ idToken, name });
    } catch {
      // iptal
    } finally {
      setIsApplePending(false);
    }
  }

  return (
    <button
      type="button"
      disabled={disabled || isApplePending || !isAppleReady}
      onClick={handleApple}
      className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-hairline bg-ink text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      <AppleIcon className="size-4" />
      {isApplePending
        ? t("socialPending")
        : mode === "signup"
          ? t("continueWithAppleSignUp")
          : t("continueWithApple")}
    </button>
  );
}

export function SocialAuthButtons({
  mode,
  role,
  googleClientId,
  appleClientId,
  onError,
}: {
  mode: "login" | "signup";
  role?: UserRole;
  googleClientId?: string;
  appleClientId?: string;
  onError: (message: string) => void;
}) {
  const t = useTranslations("auth");
  const [isPending, startTransition] = useTransition();
  const [isGoogleStarting, setIsGoogleStarting] = useState(false);

  if (!googleClientId && !appleClientId) return null;

  function completeSocial(input: {
    provider: "google" | "apple";
    idToken: string;
    name?: string;
  }) {
    onError("");
    startTransition(async () => {
      const result = await socialAuthAction({
        provider: input.provider,
        idToken: input.idToken,
        role: mode === "signup" ? role : undefined,
        name: input.name,
      });
      if (result?.error) onError(result.error);
    });
  }

  function handleGoogle() {
    if (!googleClientId) return;
    onError("");
    setIsGoogleStarting(true);
    try {
      startGoogleRedirect({ clientId: googleClientId, mode, role });
    } catch {
      setIsGoogleStarting(false);
      onError(t("errorGoogleFailed"));
    }
  }

  const busy = isPending || isGoogleStarting;

  return (
    <>
      <SocialDivider />
      <div className={cn("space-y-3", busy && "pointer-events-none opacity-60")}>
        {googleClientId ? (
          <button
            type="button"
            disabled={busy}
            onClick={handleGoogle}
            className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-hairline bg-paper text-sm font-semibold text-ink transition-colors hover:bg-surface disabled:opacity-50"
          >
            <GoogleIcon className="size-4" />
            {isGoogleStarting
              ? t("socialPending")
              : mode === "signup"
                ? t("continueWithGoogleSignUp")
                : t("continueWithGoogle")}
          </button>
        ) : null}

        {appleClientId ? (
          <AppleSignInButton
            mode={mode}
            disabled={busy}
            appleClientId={appleClientId}
            onError={onError}
            onComplete={({ idToken, name }) =>
              completeSocial({ provider: "apple", idToken, name })
            }
          />
        ) : null}
      </div>
    </>
  );
}
