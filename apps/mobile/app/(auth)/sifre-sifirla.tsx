import { useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { ApiError } from "@/src/lib/api";
import { useAuth } from "@/src/lib/auth-context";
import type { Colors } from "@/src/lib/theme";
import { useColors } from "@/src/lib/theme-context";
import { Button } from "@/src/components/button";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const params = useLocalSearchParams<{ email?: string }>();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState(params.email ?? "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit() {
    setIsSubmitting(true);
    setError(null);
    try {
      await resetPassword({ email, code, password });
      router.replace("/(tabs)/panel");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("auth.sifreSifirla.submitError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.icon}>
          <Ionicons name="lock-open-outline" size={28} color={colors.turquoise} />
        </View>
        <Text style={styles.title}>{t("auth.sifreSifirla.title")}</Text>
        <Text style={styles.subtitle}>{t("auth.sifreSifirla.subtitle")}</Text>

        <View style={styles.fieldWrap}>
          <Ionicons name="mail-outline" size={18} color={colors.inkMuted} />
          <TextInput
            style={styles.fieldInput}
            value={email}
            onChangeText={setEmail}
            placeholder={t("auth.sifreSifirla.emailPlaceholder")}
            placeholderTextColor={colors.inkMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
        </View>

        <View style={styles.fieldWrap}>
          <Ionicons name="keypad-outline" size={18} color={colors.inkMuted} />
          <TextInput
            style={styles.fieldInput}
            value={code}
            onChangeText={setCode}
            placeholder={t("auth.sifreSifirla.codePlaceholder")}
            placeholderTextColor={colors.inkMuted}
            keyboardType="number-pad"
            maxLength={6}
          />
        </View>

        <View style={styles.fieldWrap}>
          <Ionicons name="lock-closed-outline" size={18} color={colors.inkMuted} />
          <TextInput
            style={styles.fieldInput}
            value={password}
            onChangeText={setPassword}
            placeholder={t("auth.sifreSifirla.passwordPlaceholder")}
            placeholderTextColor={colors.inkMuted}
            secureTextEntry
            autoComplete="new-password"
          />
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <Button title={t("auth.sifreSifirla.submit")} onPress={submit} loading={isSubmitting} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.paper },
    container: { flexGrow: 1, padding: 24, justifyContent: "center", gap: 14 },
    icon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.mist,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      marginBottom: 4,
    },
    title: { fontSize: 22, fontWeight: "800", color: colors.ink, textAlign: "center" },
    subtitle: { fontSize: 13, color: colors.inkMuted, textAlign: "center", lineHeight: 19 },
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
    error: { fontSize: 13, color: colors.ctaRed },
  });
}
