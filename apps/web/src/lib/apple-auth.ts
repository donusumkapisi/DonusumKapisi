import { createRemoteJWKSet, jwtVerify } from "jose";

const APPLE_ISSUER = "https://appleid.apple.com";
const APPLE_JWKS = createRemoteJWKSet(new URL("https://appleid.apple.com/auth/keys"));

export class AppleTokenError extends Error {}

function appleAudiences() {
  const audiences = [
    process.env.APPLE_BUNDLE_ID ?? "com.donusumkapisi.mobile",
    process.env.APPLE_SERVICES_ID,
    process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
  ].filter((value): value is string => Boolean(value));

  return [...new Set(audiences)];
}

export async function verifyAppleIdentityToken(identityToken: string) {
  const audiences = appleAudiences();

  const { payload } = await jwtVerify(identityToken, APPLE_JWKS, {
    issuer: APPLE_ISSUER,
    audience: audiences,
  }).catch(() => {
    throw new AppleTokenError("Apple kimlik doğrulaması başarısız.");
  });

  if (typeof payload.email !== "string" || typeof payload.sub !== "string") {
    throw new AppleTokenError("Apple kimlik doğrulaması başarısız.");
  }

  return {
    email: payload.email,
    appleId: payload.sub,
  };
}
