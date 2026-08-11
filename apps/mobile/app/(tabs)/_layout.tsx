import { View, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { useColors } from "@/src/lib/theme-context";
import { SiteAnnouncementModal } from "@/src/components/site-announcement-modal";

export default function TabsLayout() {
  const colors = useColors();
  const { t } = useTranslation();
  return (
    <View style={styles.root}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.turquoise,
          tabBarInactiveTintColor: colors.inkMuted,
          tabBarStyle: { backgroundColor: colors.paper, borderTopColor: colors.hairline },
        }}
      >
        <Tabs.Screen
          name="ilanlar"
          options={{
            title: t("tabs.vitrin"),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="storefront-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="arama"
          options={{
            title: t("tabs.arama"),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="ilan-ver"
          options={{
            title: t("tabs.ilanVer"),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="blog"
          options={{
            title: t("tabs.blog"),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="book-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="panel"
          options={{
            title: t("tabs.panel"),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="ayarlar"
          options={{
            title: t("tabs.ayarlar"),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
      <SiteAnnouncementModal />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
