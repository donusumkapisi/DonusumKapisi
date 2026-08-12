import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";

let isConfigured = false;

function ensureConfigured() {
  if (isConfigured) return;
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  if (!webClientId) {
    throw new Error("Google Web Client ID yapılandırılmamış.");
  }
  GoogleSignin.configure({
    webClientId,
    iosClientId,
  });
  isConfigured = true;
}

export class GoogleSignInCancelledError extends Error {}

export async function getGoogleIdToken(): Promise<string> {
  ensureConfigured();
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  try {
    const response = await GoogleSignin.signIn();
    if (response.type === "cancelled") {
      throw new GoogleSignInCancelledError();
    }
    if (!response.data.idToken) {
      throw new Error("Google kimlik bilgisi alınamadı.");
    }
    return response.data.idToken;
  } catch (error) {
    const code = (error as { code?: string } | null)?.code;
    if (code === statusCodes.SIGN_IN_CANCELLED) {
      throw new GoogleSignInCancelledError();
    }
    throw error;
  }
}
