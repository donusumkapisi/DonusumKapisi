import { useEffect, useMemo, useState } from "react";
import { Link, useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as AppleAuthentication from "expo-apple-authentication";
import { useTranslation } from "react-i18next";
import { ApiError } from "@/src/lib/api";
import { useAuth } from "@/src/lib/auth-context";
import type { Colors } from "@/src/lib/theme";
import { useColors } from "@/src/lib/theme-context";
import { Button } from "@/src/components/button";
import { getGoogleIdToken, GoogleSignInCancelledError } from "@/src/lib/google-signin";
import { getAppleIdentityToken, AppleSignInCancelledError } from "@/src/lib/apple-signin";
import { authenticateWithBiometrics, isBiometricAvailable } from "@/src/lib/biometrics";
import { getStoredSession } from "@/src/lib/storage";

export default function LogInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { login, loginWithGoogle, loginWithApple, unlockStoredSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [isAppleSubmitting, setIsAppleSubmitting] = useState(false);
  const [canUseApple, setCanUseApple] = useState(false);
  const [canUseBiometrics, setCanUseBiometrics] = useState(false);
  const [isBiometricSubmitting, setIsBiometricSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const session = await getStoredSession();
      if (!session?.remember) return;
      setCanUseBiometrics(await isBiometricAvailable());
    })();
  }, []);

  useEffect(() => {
    if (Platform.OS !== "ios") return;
    AppleAuthentication.isAvailableAsync().then(setCanUseApple);
  }, []);

  async function submitWithBiometrics() {
    setError(null);
    setIsBiometricSubmitting(true);
    try {
      const success = await authenticateWithBiometrics();
      if (!success) return;
      const unlocked = await unlockStoredSession();
      if (unlocked) {
        router.replace("/(tabs)/panel");
      } else {
        setCanUseBiometrics(false);
      }
    } finally {
      setIsBiometricSubmitting(false);
    }
  }

  async function submit() {
    setIsSubmitting(true);
    setError(null);
    try {
      await login(email, password, rememberMe);
      router.replace("/(tabs)/panel");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("auth.giris.loginError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitWithGoogle() {
    setError(null);
    setIsGoogleSubmitting(true);
    try {
      const idToken = await getGoogleIdToken();
      await loginWithGoogle(idToken, rememberMe);
      router.replace("/(tabs)/panel");
    } catch (err) {
      if (err instanceof GoogleSignInCancelledError) return;
      setError(err instanceof ApiError ? err.message : t("auth.giris.googleError"));
    } finally {
      setIsGoogleSubmitting(false);
    }
  }

  async function submitWithApple() {
    setError(null);
    setIsAppleSubmitting(true);
    try {
      const { identityToken } = await getAppleIdentityToken();
      await loginWithApple(identityToken, rememberMe);
      router.replace("/(tabs)/panel");
    } catch (err) {
      if (err instanceof AppleSignInCancelledError) return;
      setError(err instanceof ApiError ? err.message : t("auth.giris.appleError"));
    } finally {
      setIsAppleSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={[styles.hero, { paddingTop: insets.top + 64 }]}>
          <View style={[styles.ring, styles.ringOne]} />
          <View style={[styles.ring, styles.ringTwo]} />
          <View style={[styles.ring, styles.ringThree]} />
          <Text style={styles.headline}>
            {t("auth.giris.headlineBefore")}
            <Text style={styles.headlineAccent}>{t("auth.giris.headlineAccent")}</Text>
            {t("auth.giris.headlineAfter")}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>{t("auth.giris.title")}</Text>
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>{t("auth.giris.noAccount")}</Text>
            <Link href="/(auth)/kayit" style={styles.signupLink}>
              {t("auth.giris.signUp")}
            </Link>
          </View>

          <IconField
            icon="mail-outline"
            value={email}
            onChangeText={setEmail}
            placeholder={t("auth.giris.emailPlaceholder")}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />

          {canUseBiometrics && (
            <Button
              title={t("auth.giris.faceId")}
              variant="outline"
              icon="scan-outline"
              loading={isBiometricSubmitting}
              onPress={submitWithBiometrics}
            />
          )}

          <IconField
            icon="lock-closed-outline"
            value={password}
            onChangeText={setPassword}
            placeholder={t("auth.giris.passwordPlaceholder")}
            secureTextEntry
            autoComplete="current-password"
          />

          <View style={styles.optionsRow}>
            <Pressable style={styles.rememberRow} onPress={() => setRememberMe((value) => !value)}>
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Ionicons name="checkmark" size={13} color="#fff" />}
              </View>
              <Text style={styles.rememberText}>{t("auth.giris.rememberMe")}</Text>
            </Pressable>

            <Link href="/(auth)/sifremi-unuttum" style={styles.forgotLink}>
              {t("auth.giris.forgotPassword")}
            </Link>
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <Button title={t("auth.giris.submit")} onPress={submit} loading={isSubmitting} />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t("auth.giris.or")}</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            {canUseApple && (
              <View style={{ flex: 1 }}>
                <Button
                  title={t("auth.giris.apple")}
                  variant="dark"
                  icon="logo-apple"
                  loading={isAppleSubmitting}
                  onPress={submitWithApple}
                />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Button
                title={t("auth.giris.google")}
                variant="ghost"
                icon="logo-google"
                loading={isGoogleSubmitting}
                onPress={submitWithGoogle}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function IconField({
  icon,
  ...props
}: TextInputProps & { icon: keyof typeof Ionicons.glyphMap }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.fieldWrap}>
      <Ionicons name={icon} size={18} color={colors.inkMuted} />
      <TextInput style={styles.fieldInput} placeholderTextColor={colors.inkMuted} {...props} />
    </View>
  );
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.deep },
    scroll: { flexGrow: 1 },
    hero: {
      paddingHorizontal: 28,
      paddingBottom: 56,
      backgroundColor: colors.deep,
      overflow: "hidden",
    },
    ring: {
      position: "absolute",
      borderRadius: 999,
      borderWidth: 1.5,
      borderColor: "rgba(255,255,255,0.14)",
    },
    ringOne: { width: 220, height: 220, top: -70, right: -60 },
    ringTwo: { width: 150, height: 150, top: 30, right: 10 },
    ringThree: { width: 90, height: 90, bottom: -30, left: -20 },
    headline: { fontSize: 26, fontWeight: "800", color: colors.onDark, lineHeight: 34 },
    headlineAccent: { color: colors.turquoiseSoft },
    card: {
      flex: 1,
      marginTop: -28,
      backgroundColor: colors.paper,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      padding: 24,
      paddingTop: 28,
      gap: 14,
    },
    title: { fontSize: 24, fontWeight: "800", color: colors.ink },
    signupRow: { flexDirection: "row", marginBottom: 8 },
    signupText: { fontSize: 13, color: colors.inkMuted },
    signupLink: { fontSize: 13, color: colors.turquoise, fontWeight: "700" },
    fieldWrap: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      height: 52,
      borderRadius: 16,
      backgroundColor: colors.mist,
      paddingHorizontal: 16,
    },
    fieldInput: { flex: 1, fontSize: 15, color: colors.ink },
    optionsRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: -2,
    },
    rememberRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 6,
      borderWidth: 1.5,
      borderColor: colors.hairline,
      alignItems: "center",
      justifyContent: "center",
    },
    checkboxChecked: { backgroundColor: colors.turquoise, borderColor: colors.turquoise },
    rememberText: { fontSize: 13, color: colors.inkMuted, fontWeight: "500" },
    forgotLink: { fontSize: 13, color: colors.turquoise, fontWeight: "700" },
    error: { fontSize: 13, color: colors.ctaRed },
    dividerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 2 },
    dividerLine: { flex: 1, height: 1, backgroundColor: colors.hairline },
    dividerText: { fontSize: 12, color: colors.inkMuted, fontWeight: "600" },
    socialRow: { flexDirection: "row", gap: 12 },
  });
}
