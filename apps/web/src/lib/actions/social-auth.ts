"use server";

import { AuthError } from "next-auth";
import { getTranslations } from "next-intl/server";
import type { UserRole } from "@donusum-kapisi/db";
import { signIn } from "@/lib/auth";
import {
  authenticateWithApple,
  authenticateWithGoogle,
  SocialAuthError,
} from "@/lib/social-login";
import { createSocialProof } from "@/lib/social-proof";
import { getContractorVerification } from "@/lib/contractor-verification";

type AuthActionState = { error?: string; success?: string } | null;

async function redirectForUser(id: string, role: "HOMEOWNER" | "CONTRACTOR" | "ADMIN") {
  if (role === "ADMIN") return "/panel/admin";
  if (role !== "CONTRACTOR") return "/panel/ev-sahibi";

  // A contractor who has never filed documents still owes the second signup step.
  const profile = await getContractorVerification(id);
  return profile?.submittedAt ? "/panel/muteahhit" : "/panel/muteahhit/belgeler";
}

export async function socialAuthAction(input: {
  provider: "google" | "apple";
  idToken: string;
  role?: UserRole;
  name?: string;
}): Promise<AuthActionState> {
  const t = await getTranslations("auth");

  try {
    const user =
      input.provider === "google"
        ? await authenticateWithGoogle(input.idToken, input.role)
        : await authenticateWithApple(input.idToken, {
            role: input.role,
            name: input.name,
          });

    const proof = createSocialProof(user.id);
    await signIn("social", {
      proof,
      redirectTo: await redirectForUser(user.id, user.role),
    });
  } catch (error) {
    if (error instanceof SocialAuthError) {
      return { error: error.message };
    }
    if (error instanceof AuthError) {
      return { error: t("errorSocialFailed") };
    }
    throw error;
  }

  return null;
}
