import { OAuth2Client } from "google-auth-library";

export class GoogleTokenError extends Error {}

export async function verifyGoogleIdToken(idToken: string) {
  const clientId = process.env.GOOGLE_WEB_CLIENT_ID;
  if (!clientId) throw new Error("GOOGLE_WEB_CLIENT_ID tanımlı değil.");

  const client = new OAuth2Client(clientId);
  const ticket = await client.verifyIdToken({ idToken, audience: clientId }).catch(() => null);
  const payload = ticket?.getPayload();
  if (!payload?.email) {
    throw new GoogleTokenError("Google kimlik doğrulaması başarısız.");
  }

  return {
    email: payload.email,
    name: payload.name ?? null,
    googleId: payload.sub,
  };
}
