"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { getTranslations } from "next-intl/server";
import { signIn } from "@/lib/auth";
import {
  forgotPasswordSchema,
  logInSchema,
  resetPasswordSchema,
  signUpSchema,
} from "@donusum-kapisi/shared";
import { createUser, UserAlreadyExistsError } from "@/lib/user";
import { createPasswordResetCode, consumePasswordResetCode } from "@/lib/password-reset";
import { sendPasswordResetEmail } from "@/lib/resend";
import { prisma } from "@donusum-kapisi/db";

export type AuthActionState = { error?: string; success?: string } | null;

function redirectForRole(role: "HOMEOWNER" | "CONTRACTOR" | "ADMIN") {
  // New contractors land on the second signup step: yetki belgesi ve evraklar.
  if (role === "CONTRACTOR") return "/panel/muteahhit/belgeler";
  if (role === "ADMIN") return "/panel/admin";
  return "/panel/ev-sahibi";
}

export async function signUpAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const t = await getTranslations("auth");
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? t("errorFormInvalid") };
  }
  const { email, password, role } = parsed.data;

  try {
    await createUser(parsed.data);
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return { error: t("errorEmailInUse") };
    }
    throw error;
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: redirectForRole(role),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: t("errorSignedUpNoLogin") };
    }
    throw error;
  }

  return null;
}

export async function logInAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const t = await getTranslations("auth");
  const parsed = logInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? t("errorFormInvalid") };
  }

  try {
    await signIn("credentials", {
      ...parsed.data,
      redirectTo: "/panel",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: t("errorInvalidCredentials") };
    }
    throw error;
  }

  return null;
}

export async function forgotPasswordAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const t = await getTranslations("auth");
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? t("errorFormInvalid") };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (user?.passwordHash) {
    try {
      const code = await createPasswordResetCode(user.email);
      await sendPasswordResetEmail(user.email, code);
    } catch {
      return { error: t("errorForgotEmailFailed") };
    }
  }

  return { success: t("forgotSuccess") };
}

export async function resetPasswordAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const t = await getTranslations("auth");
  const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? t("errorFormInvalid") };
  }

  const { email, code, password } = parsed.data;
  const isValid = await consumePasswordResetCode(email, code);
  if (!isValid) {
    return { error: "Kod geçersiz veya süresi dolmuş." };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.update({ where: { email }, data: { passwordHash } });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/panel",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: t("errorInvalidCredentials") };
    }
    throw error;
  }

  return null;
}
