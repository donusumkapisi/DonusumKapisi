import { useEffect, useMemo, useState } from "react";
import { Link, useRouter } from "expo-router";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import * as AppleAuthentication from "expo-apple-authentication";
import type { UserRole } from "@donusum-kapisi/shared";
import { ApiError } from "@/src/lib/api";
import { useAuth } from "@/src/lib/auth-context";
import type { Colors } from "@/src/lib/theme";
import { useColors } from "@/src/lib/theme-context";
import { TextField } from "@/src/components/text-field";
import { Button } from "@/src/components/button";
import { getGoogleIdToken, GoogleSignInCancelledError } from "@/src/lib/google-signin";
import { getAppleIdentityToken, AppleSignInCancelledError } from "@/src/lib/apple-signin";

const logo = require("../../assets/logo.png");

const ROLES: { value: UserRole; labelKey: string }[] = [
  { value: "HOMEOWNER", labelKey: "auth.kayit.roleHomeowner" },
  { value: "CONTRACTOR", labelKey: "auth.kayit.roleContractor" },
];

export default function SignUpScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { register, loginWithGoogle, loginWithApple } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("HOMEOWNER");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [isAppleSubmitting, setIsAppleSubmitting] = useState(false);
  const [canUseApple, setCanUseApple] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "ios") return;
    AppleAuthentication.isAvailableAsync().then(setCanUseApple);
  }, []);

  async function submit() {
    setIsSubmitting(true);
    setError(null);
    try {
      await register({ name, email, password, role: role as "HOMEOWNER" | "CONTRACTOR" });
      router.replace("/(tabs)/panel");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("auth.kayit.submitError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitWithGoogle() {
    setError(null);
    setIsGoogleSubmitting(true);
    try {
      const idToken = await getGoogleIdToken();
      await loginWithGoogle(idToken, true, role);
      router.replace("/(tabs)/panel");
    } catch (err) {
      if (err instanceof GoogleSignInCancelledError) return;
      setError(err instanceof ApiError ? err.message : t("auth.kayit.googleError"));
    } finally {
      setIsGoogleSubmitting(false);
    }
  }

  async function submitWithApple() {
    setError(null);
    setIsAppleSubmitting(true);
    try {
      const { identityToken, name: appleName } = await getAppleIdentityToken();
      await loginWithApple(identityToken, true, appleName ?? undefined, role);
      router.replace("/(tabs)/panel");
    } catch (err) {
      if (err instanceof AppleSignInCancelledError) return;
      setError(err instanceof ApiError ? err.message : t("auth.kayit.appleError"));
    } finally {
      setIsAppleSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>{t("auth.kayit.title")}</Text>
        <Text style={styles.subtitle}>{t("auth.kayit.subtitle")}</Text>

        <View style={styles.roleRow}>
          {ROLES.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => setRole(option.value)}
              style={[styles.roleOption, role === option.value && styles.roleOptionActive]}
            >
              <Text
                style={[styles.roleLabel, role === option.value && styles.roleLabelActive]}
              >
                {t(option.labelKey)}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.card}>
          <TextField label={t("auth.kayit.labelName")} value={name} onChangeText={setName} autoComplete="name" />
          <TextField
            label={t("auth.kayit.labelEmail")}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <TextField
            label={t("auth.kayit.labelPassword")}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="new-password"
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <Button title={t("auth.kayit.submit")} onPress={submit} loading={isSubmitting} />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t("auth.kayit.or")}</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            {canUseApple && (
              <View style={{ flex: 1 }}>
                <Button
                  title={t("auth.kayit.apple")}
                  variant="dark"
                  icon="logo-apple"
                  loading={isAppleSubmitting}
                  onPress={submitWithApple}
                />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Button
                title={t("auth.kayit.google")}
                variant="ghost"
                icon="logo-google"
                loading={isGoogleSubmitting}
                onPress={submitWithGoogle}
              />
            </View>
          </View>
        </View>

        <Link href="/(auth)/giris" style={styles.link}>
          {t("auth.kayit.haveAccount")}
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.paper },
    container: { flexGrow: 1, padding: 24, justifyContent: "center" },
    logo: { width: 72, height: 72, alignSelf: "center" },
    title: { marginTop: 16, fontSize: 22, fontWeight: "800", color: colors.ink, textAlign: "center" },
    subtitle: { marginTop: 6, fontSize: 13, color: colors.inkMuted, textAlign: "center" },
    roleRow: { marginTop: 24, flexDirection: "row", gap: 8 },
    roleOption: {
      flex: 1,
      height: 44,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.mist,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.hairline,
    },
    roleOptionActive: { backgroundColor: colors.turquoise, borderColor: colors.turquoise },
    roleLabel: { fontSize: 13, color: colors.inkMuted, fontWeight: "600" },
    roleLabelActive: { color: colors.onDark },
    card: {
      marginTop: 16,
      gap: 16,
      backgroundColor: colors.paper,
      borderRadius: 20,
      padding: 20,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.hairline,
    },
    error: { fontSize: 13, color: colors.ctaRed },
    link: { marginTop: 20, textAlign: "center", fontSize: 13, color: colors.turquoise, fontWeight: "600" },
    dividerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 2 },
    dividerLine: { flex: 1, height: 1, backgroundColor: colors.hairline },
    dividerText: { fontSize: 12, color: colors.inkMuted, fontWeight: "600" },
    socialRow: { flexDirection: "row", gap: 12 },
  });
}
