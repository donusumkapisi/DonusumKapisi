import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Kısa ömürlü imza — Google/Apple doğrulaması server action'da yapıldıktan
 * sonra NextAuth session açmak için kullanılır.
 */
export function createSocialProof(userId: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET tanımlı değil.");

  const exp = Date.now() + 60_000;
  const payload = `${userId}.${exp}`;
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifySocialProof(proof: string): string | null {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;

  const parts = proof.split(".");
  if (parts.length !== 3) return null;
  const [userId, expStr, sig] = parts;
  if (!userId || !expStr || !sig) return null;

  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now()) return null;

  const payload = `${userId}.${expStr}`;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");

  try {
    const a = Buffer.from(sig, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  return userId;
}
