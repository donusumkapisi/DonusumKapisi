import { useMemo } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/src/lib/auth-context";
import { buildCallUrl, buildMailUrl, buildWhatsAppUrl } from "@/src/lib/contact";
import type { Colors } from "@/src/lib/theme";
import { useColors, useTheme } from "@/src/lib/theme-context";
import { Button } from "@/src/components/button";
import { PageHero } from "@/src/components/page-hero";
import { LanguagePickerField } from "@/src/components/language-picker";

const THEME_OPTIONS = [
  { key: "system", labelKey: "settings.themeSystem", icon: "phone-portrait-outline" },
  { key: "light", labelKey: "settings.themeLight", icon: "sunny-outline" },
  { key: "dark", labelKey: "settings.themeDark", icon: "moon-outline" },
] as const;

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.screen}>
      <PageHero title={t("settings.title")} subtitle={user?.email} compact />

      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <SectionTitle icon="language-outline" title={t("settings.languageLabel")} />
          <LanguagePickerField />
        </View>

        <View>
          <SectionTitle icon="contrast-outline" title={t("settings.themeLabel")} />
          <ThemeSelector />
        </View>

        {user && (
          <View>
            <SectionTitle icon="person-circle-outline" title={t("settings.accountLabel")} />
            <Button title={t("settings.logout")} variant="danger" icon="log-out-outline" onPress={logout} />
          </View>
        )}

        <View>
          <SectionTitle icon="call-outline" title={t("settings.contactLabel")} />
          <Text style={styles.contactSubtitle}>{t("settings.contactSubtitle")}</Text>
          <View style={styles.contactRow}>
            <ContactAction
              icon="call-outline"
              label={t("listingDetail.contactCall")}
              onPress={() => Linking.openURL(buildCallUrl())}
            />
            <ContactAction
              icon="logo-whatsapp"
              label={t("listingDetail.contactWhatsApp")}
              onPress={() => Linking.openURL(buildWhatsAppUrl(t("settings.contactWhatsAppMessage")))}
            />
            <ContactAction
              icon="mail-outline"
              label={t("listingDetail.contactEmail")}
              onPress={() =>
                Linking.openURL(
                  buildMailUrl(t("settings.contactEmailSubject"), t("settings.contactWhatsAppMessage"))
                )
              }
            />
          </View>
        </View>

        <View>
          <SectionTitle icon="information-circle-outline" title={t("settings.aboutLabel")} />
          <Text style={styles.aboutBody}>{t("settings.aboutBody")}</Text>
          <Text style={styles.versionText}>
            {t("settings.versionLabel", { version: Constants.expoConfig?.version ?? "1.0.0" })}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function ThemeSelector() {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { preference, setPreference } = useTheme();

  return (
    <View style={styles.themeRow}>
      {THEME_OPTIONS.map((option) => {
        const active = option.key === preference;
        return (
          <Pressable
            key={option.key}
            style={[styles.themeOption, active && styles.themeOptionActive]}
            onPress={() => setPreference(option.key)}
          >
            <Ionicons name={option.icon} size={18} color={active ? colors.turquoise : colors.inkMuted} />
            <Text style={[styles.themeOptionText, active && styles.themeOptionTextActive]}>
              {t(option.labelKey)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function SectionTitle({ icon, title }: { icon: keyof typeof Ionicons.glyphMap; title: string }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.sectionTitleRow}>
      <Ionicons name={icon} size={16} color={colors.turquoise} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function ContactAction({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <Pressable
      style={({ pressed }) => [styles.contactAction, pressed && styles.contactActionPressed]}
      onPress={onPress}
    >
      <View style={styles.contactIconCircle}>
        <Ionicons name={icon} size={19} color={colors.ink} />
      </View>
      <Text style={styles.contactActionLabel}>{label}</Text>
    </Pressable>
  );
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.paper },
    container: { padding: 20, paddingTop: 24, gap: 28 },
    sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
    sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.ink },
    themeRow: { flexDirection: "row", gap: 10 },
    themeOption: {
      flex: 1,
      alignItems: "center",
      gap: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.hairline,
      backgroundColor: colors.mist,
      paddingVertical: 14,
    },
    themeOptionActive: { borderColor: colors.turquoise, backgroundColor: `${colors.turquoise}1a` },
    themeOptionText: { fontSize: 12, fontWeight: "600", color: colors.inkMuted },
    themeOptionTextActive: { color: colors.turquoise },
    contactSubtitle: { fontSize: 13, color: colors.inkMuted, marginTop: -4, marginBottom: 14 },
    contactRow: { flexDirection: "row", justifyContent: "space-around" },
    contactAction: { alignItems: "center", gap: 6 },
    contactActionPressed: { opacity: 0.55 },
    contactIconCircle: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: colors.paper,
      borderWidth: 1,
      borderColor: colors.hairline,
      alignItems: "center",
      justifyContent: "center",
    },
    contactActionLabel: { fontSize: 11, fontWeight: "500", color: colors.inkMuted },
    aboutBody: { fontSize: 13, lineHeight: 20, color: colors.inkMuted, marginBottom: 8 },
    versionText: { fontSize: 13, color: colors.inkMuted },
  });
}
