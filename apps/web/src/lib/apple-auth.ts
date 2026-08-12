import { createRemoteJWKSet, jwtVerify } from "jose";

const APPLE_ISSUER = "https://appleid.apple.com";
const APPLE_JWKS = createRemoteJWKSet(new URL("https://appleid.apple.com/auth/keys"));

export class AppleTokenError extends Error {}

function appleAudiences() {
  const audiences = [
    process.env.APPLE_BUNDLE_ID,
    // Current App Store / EAS iOS bundle id
    "com.donusumkapisi.app",
    // Legacy bundle id (older builds / TestFlight leftovers)
    "com.donusumkapisi.mobile",
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

  if (typeof payload.sub !== "string" || !payload.sub) {
    throw new AppleTokenError("Apple kimlik doğrulaması başarısız.");
  }

  // Apple only includes email on the first authorization.
  const email = typeof payload.email === "string" ? payload.email : null;

  return {
    email,
    appleId: payload.sub,
  };
}
