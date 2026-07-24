import * as LocalAuthentication from "expo-local-authentication";

export async function isBiometricAvailable() {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) return false;
  return LocalAuthentication.isEnrolledAsync();
}

export async function authenticateWithBiometrics() {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Giriş yapmak için kimliğinizi doğrulayın",
    cancelLabel: "Vazgeç",
    disableDeviceFallback: false,
  });
  return result.success;
}
