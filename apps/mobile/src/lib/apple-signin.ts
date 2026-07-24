import * as AppleAuthentication from "expo-apple-authentication";

export class AppleSignInCancelledError extends Error {}

export async function getAppleIdentityToken(): Promise<{
  identityToken: string;
  name: string | null;
}> {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!credential.identityToken) {
      throw new Error("Apple kimlik bilgisi alınamadı.");
    }
    const name = [credential.fullName?.givenName, credential.fullName?.familyName]
      .filter(Boolean)
      .join(" ")
      .trim();
    return { identityToken: credential.identityToken, name: name || null };
  } catch (error) {
    const code = (error as { code?: string } | null)?.code;
    if (code === "ERR_REQUEST_CANCELED") {
      throw new AppleSignInCancelledError();
    }
    throw error;
  }
}
