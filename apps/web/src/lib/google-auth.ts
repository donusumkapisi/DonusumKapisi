import { OAuth2Client } from "google-auth-library";

export class GoogleTokenError extends Error {}

function getGoogleAudiences(): string[] {
  const values = [
    process.env.GOOGLE_WEB_CLIENT_ID,
    process.env.GOOGLE_MOBILE_WEB_CLIENT_ID,
    // Fallback so mobile tokens verify even if only one env var is set on older deploys
    "827109488884-e09bjgmopej6e2qj16fgt307eoiar2hc.apps.googleusercontent.com",
    "827109488884-2titt9ro97ftv5vbrr8h3g2pjoim2m1t.apps.googleusercontent.com",
  ]
    .filter((value): value is string => Boolean(value?.trim()))
    .flatMap((value) => value.split(",").map((part) => part.trim()).filter(Boolean));

  return [...new Set(values)];
}

export async function verifyGoogleIdToken(idToken: string) {
  const audiences = getGoogleAudiences();
  if (audiences.length === 0) {
    throw new Error("GOOGLE_WEB_CLIENT_ID tanımlı değil.");
  }

  const client = new OAuth2Client(audiences[0]);
  const ticket = await client
    .verifyIdToken({
      idToken,
      audience: audiences.length === 1 ? audiences[0] : audiences,
    })
    .catch(() => null);
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
