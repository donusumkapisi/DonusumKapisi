import * as SecureStore from "expo-secure-store";
import type { AuthUserDTO } from "@donusum-kapisi/shared";

const SESSION_KEY = "donusumkapisi_session";

export type StoredSession = { token: string; user: AuthUserDTO; remember: boolean };

export async function getStoredSession(): Promise<StoredSession | null> {
  const raw = await SecureStore.getItemAsync(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

export async function setStoredSession(session: StoredSession) {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function clearStoredSession() {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
