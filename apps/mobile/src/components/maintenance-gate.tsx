import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { usePathname, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/src/lib/auth-context";
import { api } from "@/src/lib/api";
import { useColors } from "@/src/lib/theme-context";
import { Button } from "@/src/components/button";

function isAuthPath(pathname: string | null) {
  if (!pathname) return false;
  return (
    pathname.includes("giris") ||
    pathname.includes("kayit") ||
    pathname.includes("sifremi-unuttum") ||
    pathname.includes("sifre-sifirla")
  );
}

export function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const colors = useColors();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [active, setActive] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const status = await api.getMaintenanceStatus();
      setActive(Boolean(status.maintenanceMode));
      setMessage(status.message);
    } catch {
      setActive(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, 60_000);
    return () => clearInterval(timer);
  }, [load]);

  const blocked =
    !authLoading &&
    !checking &&
    active &&
    user?.role !== "ADMIN" &&
    !isAuthPath(pathname);

  return (
    <View style={styles.root}>
      {children}
      {blocked && (
        <View style={[styles.overlay, { backgroundColor: colors.paper }]}>
          <View style={[styles.iconWrap, { backgroundColor: `${colors.ctaOrange}22` }]}>
            <Ionicons name="construct-outline" size={28} color={colors.ctaOrange} />
          </View>
          <Text style={[styles.title, { color: colors.ink }]}>{t("maintenance.title")}</Text>
          <Text style={[styles.body, { color: colors.inkMuted }]}>
            {message?.trim() || t("maintenance.defaultMessage")}
          </Text>
          <View style={styles.actions}>
            <Button
              title={t("maintenance.refresh")}
              variant="outline"
              size="sm"
              icon="refresh-outline"
              onPress={() => {
                setChecking(true);
                load();
              }}
            />
            <Button
              title={t("maintenance.adminLogin")}
              size="sm"
              icon="log-in-outline"
              onPress={() => router.push("/(auth)/giris")}
            />
          </View>
        </View>
      )}
      {(authLoading || checking) && !blocked && (
        <View style={[styles.boot, { backgroundColor: colors.paper }]} pointerEvents="none">
          <ActivityIndicator color={colors.turquoise} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  boot: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { marginTop: 16, fontSize: 22, fontWeight: "700", textAlign: "center" },
  body: { marginTop: 10, fontSize: 15, lineHeight: 22, textAlign: "center", maxWidth: 340 },
  actions: { marginTop: 20, gap: 10, width: "100%", maxWidth: 280 },
});
