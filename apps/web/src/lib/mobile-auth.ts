import { SignJWT, jwtVerify } from "jose";
import type { UserRole } from "@donusum-kapisi/shared";

const MOBILE_TOKEN_TTL = "30d";

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET tanımlı değil.");
  return new TextEncoder().encode(secret);
}

export class MobileAuthError extends Error {
  status = 401;
}

export async function signMobileToken(user: { id: string; role: UserRole }) {
  return new SignJWT({ role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(MOBILE_TOKEN_TTL)
    .sign(getSecret());
}

export type MobileSession = {
  userId: string;
  role: UserRole;
};

export async function requireMobileUser(request: Request): Promise<MobileSession> {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) throw new MobileAuthError("Yetkilendirme başlığı eksik.");

  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.sub !== "string" || typeof payload.role !== "string") {
      throw new MobileAuthError("Geçersiz oturum.");
    }
    return { userId: payload.sub, role: payload.role as UserRole };
  } catch (error) {
    if (error instanceof MobileAuthError) throw error;
    throw new MobileAuthError("Geçersiz veya süresi dolmuş oturum.");
  }
}
