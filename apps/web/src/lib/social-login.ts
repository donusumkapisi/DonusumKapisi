import type { UserRole } from "@donusum-kapisi/db";
import { prisma } from "@donusum-kapisi/db";
import { verifyGoogleIdToken, GoogleTokenError } from "@/lib/google-auth";
import { verifyAppleIdentityToken, AppleTokenError } from "@/lib/apple-auth";

export class SocialAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SocialAuthError";
  }
}

export type SocialUser = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
};

async function linkAccount(
  userId: string,
  provider: "google" | "apple",
  providerAccountId: string
) {
  await prisma.account.upsert({
    where: { provider_providerAccountId: { provider, providerAccountId } },
    update: { userId },
    create: {
      userId,
      type: "oauth",
      provider,
      providerAccountId,
    },
  });
}

async function findUserByAppleId(appleId: string) {
  const account = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: { provider: "apple", providerAccountId: appleId },
    },
    include: { user: true },
  });
  return account?.user ?? null;
}

export async function authenticateWithGoogle(
  idToken: string,
  role?: UserRole
): Promise<SocialUser> {
  try {
    const { email, name, googleId } = await verifyGoogleIdToken(idToken);

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      if (!role) {
        throw new SocialAuthError(
          "Bu Google hesabıyla kayıtlı bir hesap bulunamadı. Önce kayıt olun."
        );
      }
      user = await prisma.user.create({
        data: { email, name, role },
      });
    }

    await linkAccount(user.id, "google", googleId);

    return { id: user.id, name: user.name, email: user.email, role: user.role };
  } catch (error) {
    if (error instanceof SocialAuthError) throw error;
    if (error instanceof GoogleTokenError) {
      throw new SocialAuthError(error.message);
    }
    throw error;
  }
}

export async function authenticateWithApple(
  identityToken: string,
  options: { role?: UserRole; name?: string } = {}
): Promise<SocialUser> {
  try {
    const { email, appleId } = await verifyAppleIdentityToken(identityToken);

    let user = await findUserByAppleId(appleId);

    if (!user && email) {
      user = await prisma.user.findUnique({ where: { email } });
    }

    if (!user) {
      if (!email) {
        throw new SocialAuthError(
          "Bu Apple hesabıyla kayıtlı bir hesap bulunamadı. Önce kayıt olun."
        );
      }
      if (!options.role) {
        throw new SocialAuthError(
          "Bu Apple hesabıyla kayıtlı bir hesap bulunamadı. Önce kayıt olun."
        );
      }
      user = await prisma.user.create({
        data: {
          email,
          name: options.name ?? null,
          role: options.role,
        },
      });
    } else if (options.name && !user.name) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { name: options.name },
      });
    }

    await linkAccount(user.id, "apple", appleId);

    return { id: user.id, name: user.name, email: user.email, role: user.role };
  } catch (error) {
    if (error instanceof SocialAuthError) throw error;
    if (error instanceof AppleTokenError) {
      throw new SocialAuthError(error.message);
    }
    throw error;
  }
}
