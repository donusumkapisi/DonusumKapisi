import { NativeModules, Platform } from "react-native";

export function getDeviceLanguage(): string {
  let locale = "tr";
  try {
    if (Platform.OS === "ios") {
      locale =
        NativeModules.SettingsManager?.settings?.AppleLocale ||
        NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ||
        "tr";
    } else if (Platform.OS === "android") {
      locale = NativeModules.I18nManager?.localeIdentifier || "tr";
    }
  } catch {
    locale = "tr";
  }
  return locale.split(/[-_]/)[0].toLowerCase();
}
