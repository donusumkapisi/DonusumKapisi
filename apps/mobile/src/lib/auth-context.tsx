import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type {
  AuthUserDTO,
  ForgotPasswordInput,
  ResetPasswordInput,
  SignUpInput,
  UserRole,
} from "@donusum-kapisi/shared";
import { api } from "./api";
import { clearStoredSession, getStoredSession, setStoredSession } from "./storage";
import { registerForPushNotifications } from "./push";

type AuthContextValue = {
  user: AuthUserDTO | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  loginWithGoogle: (idToken: string, rememberMe?: boolean, role?: UserRole) => Promise<void>;
  loginWithApple: (
    identityToken: string,
    rememberMe?: boolean,
    name?: string,
    role?: UserRole
  ) => Promise<void>;
  register: (input: SignUpInput) => Promise<void>;
  forgotPassword: (input: ForgotPasswordInput) => Promise<string>;
  resetPassword: (input: ResetPasswordInput) => Promise<void>;
  logout: () => Promise<void>;
  unlockStoredSession: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStoredSession().then((session) => {
      if (session && !session.remember) {
        // Kullanıcı "Beni Hatırla"yı işaretlememişti; uygulama yeniden
        // başlatıldığında (soğuk başlangıç) oturumu unutuyoruz.
        clearStoredSession();
        setUser(null);
      } else {
        setUser(session?.user ?? null);
        if (session) registerForPushNotifications();
      }
      setIsLoading(false);
    });
  }, []);

  async function applySession(response: { token: string; user: AuthUserDTO }, rememberMe: boolean) {
    await setStoredSession({ ...response, remember: rememberMe });
    setUser(response.user);
    registerForPushNotifications();
  }

  async function login(email: string, password: string, rememberMe = true) {
    const response = await api.login({ email, password });
    await applySession(response, rememberMe);
  }

  async function loginWithGoogle(idToken: string, rememberMe = true, role?: UserRole) {
    const response = await api.googleAuth(idToken, role);
    await applySession(response, rememberMe);
  }

  async function loginWithApple(
    identityToken: string,
    rememberMe = true,
    name?: string,
    role?: UserRole
  ) {
    const response = await api.appleAuth(identityToken, name, role);
    await applySession(response, rememberMe);
  }

  async function register(input: SignUpInput) {
    const response = await api.register(input);
    await applySession(response, true);
  }

  async function forgotPassword(input: ForgotPasswordInput) {
    const response = await api.forgotPassword(input);
    return response.message;
  }

  async function resetPassword(input: ResetPasswordInput) {
    const response = await api.resetPassword(input);
    await applySession(response, true);
  }

  async function logout() {
    await clearStoredSession();
    setUser(null);
  }

  async function unlockStoredSession() {
    const session = await getStoredSession();
    if (!session) return false;
    setUser(session.user);
    registerForPushNotifications();
    return true;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        loginWithGoogle,
        loginWithApple,
        register,
        forgotPassword,
        resetPassword,
        logout,
        unlockStoredSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth, AuthProvider içinde kullanılmalı.");
  return ctx;
}
