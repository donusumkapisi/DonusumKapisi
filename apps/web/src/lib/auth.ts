import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@donusum-kapisi/db";
import { logInSchema } from "@donusum-kapisi/shared";
import { verifyCredentials } from "@/lib/credentials";
import { verifySocialProof } from "@/lib/social-proof";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/giris",
  },
  providers: [
    Credentials({
      id: "credentials",
      credentials: {
        email: { label: "E-posta" },
        password: { label: "Şifre", type: "password" },
      },
      authorize: async (raw) => {
        const parsed = logInSchema.safeParse(raw);
        if (!parsed.success) return null;
        return verifyCredentials(parsed.data.email, parsed.data.password);
      },
    }),
    Credentials({
      id: "social",
      credentials: {
        proof: { label: "Proof" },
      },
      authorize: async (raw) => {
        const proof = typeof raw?.proof === "string" ? raw.proof : "";
        const userId = verifySocialProof(proof);
        if (!userId) return null;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
});
