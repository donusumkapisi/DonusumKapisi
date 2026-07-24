import { useMemo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import type { ListingDTO } from "@donusum-kapisi/shared";
import { formatPriceRange, type Colors } from "@/src/lib/theme";
import { useColors } from "@/src/lib/theme-context";

export function ListingCard({
  listing,
  onPress,
  variant = "row",
}: {
  listing: ListingDTO;
  onPress: () => void;
  variant?: "row" | "grid" | "featured";
}) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (variant === "featured") {
    return (
      <Pressable
        style={({ pressed }) => [styles.featuredCard, pressed && styles.cardPressed]}
        onPress={onPress}
      >
        <View style={styles.featuredImageWrap}>
          {listing.coverImageUrl ? (
            <Image source={{ uri: listing.coverImageUrl }} style={styles.thumbImage} />
          ) : (
            <Ionicons name="business-outline" size={40} color={colors.turquoiseSoft} />
          )}
          <View style={styles.featuredOverlay}>
            <SaleTag tone="light" />
            <Text style={styles.featuredTitle} numberOfLines={1}>
              {listing.title}
            </Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={12} color="rgba(255,255,255,0.75)" />
              <Text style={styles.featuredMeta} numberOfLines={1}>
                {listing.district}, {listing.province}
              </Text>
            </View>
            <Text style={styles.featuredPrice}>
              {formatPriceRange(listing.priceMin, listing.priceMax)}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  }

  if (variant === "grid") {
    return (
      <Pressable
        style={({ pressed }) => [styles.gridCard, pressed && styles.cardPressed]}
        onPress={onPress}
      >
        <View style={styles.gridThumb}>
          {listing.coverImageUrl ? (
            <Image source={{ uri: listing.coverImageUrl }} style={styles.thumbImage} />
          ) : (
            <Ionicons name="business-outline" size={28} color={colors.turquoise} />
          )}
        </View>
        <View style={styles.gridInfo}>
          <Text style={styles.gridTitle} numberOfLines={1}>
            {listing.title}
          </Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={10} color={colors.inkMuted} />
            <Text style={styles.cardMetaSmall} numberOfLines={1}>
              {listing.district}, {listing.province}
            </Text>
          </View>
          <View style={styles.gridFooter}>
            <Text style={styles.gridPrice} numberOfLines={1}>
              {formatPriceRange(listing.priceMin, listing.priceMax)}
            </Text>
          </View>
          <SaleTag tone="dark" style={{ marginTop: 6 }} />
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]} onPress={onPress}>
      <View style={styles.thumb}>
        {listing.coverImageUrl ? (
          <Image source={{ uri: listing.coverImageUrl }} style={styles.thumbImage} />
        ) : (
          <Ionicons name="business-outline" size={26} color={colors.turquoise} />
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {listing.title}
        </Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={12} color={colors.inkMuted} />
          <Text style={styles.cardMeta}>
            {listing.district}, {listing.province}
          </Text>
        </View>
        <View style={styles.tagsRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{listing.squareMeters} m²</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{listing.buildingAge} yıl</Text>
          </View>
        </View>
        <Text style={styles.cardPrice}>
          {formatPriceRange(listing.priceMin, listing.priceMax)}
        </Text>
      </View>
    </Pressable>
  );
}

function SaleTag({ tone, style }: { tone: "light" | "dark"; style?: object }) {
  const colors = useColors();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isLight = tone === "light";
  return (
    <View
      style={[
        styles.saleTag,
        { backgroundColor: isLight ? "rgba(255,255,255,0.14)" : colors.mist },
        style,
      ]}
    >
      <View style={styles.saleDot} />
      <Text style={[styles.saleTagText, { color: isLight ? "#fff" : colors.ink }]}>
        {t("listingCard.forSale")}
      </Text>
    </View>
  );
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
    card: {
      flexDirection: "row",
      gap: 12,
      borderRadius: 18,
      backgroundColor: colors.paper,
      padding: 12,
      alignItems: "center",
      shadowColor: colors.ink,
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },
    cardPressed: { opacity: 0.85 },
    thumb: {
      width: 76,
      height: 76,
      borderRadius: 14,
      backgroundColor: colors.mist,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    thumbImage: { width: "100%", height: "100%" },
    info: { flex: 1, gap: 4 },
    cardTitle: { fontSize: 15, fontWeight: "700", color: colors.ink },
    locationRow: { flexDirection: "row", alignItems: "center", gap: 4 },
    cardMeta: { fontSize: 12, color: colors.inkMuted },
    cardMetaSmall: { flex: 1, fontSize: 11, color: colors.inkMuted },
    tagsRow: { flexDirection: "row", gap: 6, marginTop: 2 },
    tag: {
      backgroundColor: colors.mist,
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    tagText: { fontSize: 11, fontWeight: "600", color: colors.inkMuted },
    cardPrice: { marginTop: 2, fontSize: 14, fontWeight: "700", color: colors.turquoise },

    gridCard: {
      flex: 1,
      borderRadius: 16,
      backgroundColor: colors.paper,
      borderWidth: 1,
      borderColor: colors.hairline,
      overflow: "hidden",
    },
    gridThumb: {
      width: "100%",
      aspectRatio: 0.85,
      backgroundColor: colors.mist,
      alignItems: "center",
      justifyContent: "center",
    },
    gridInfo: { padding: 12, gap: 4 },
    gridTitle: { fontSize: 13.5, fontWeight: "500", color: colors.ink },
    gridFooter: { marginTop: 4 },
    gridPrice: { fontSize: 15.5, fontWeight: "600", color: colors.ink },

    featuredCard: {
      borderRadius: 20,
      overflow: "hidden",
      backgroundColor: colors.deep,
    },
    featuredImageWrap: {
      width: "100%",
      aspectRatio: 1.5,
      backgroundColor: colors.deep,
      alignItems: "center",
      justifyContent: "center",
    },
    featuredOverlay: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(14,52,70,0.82)",
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 14,
      gap: 4,
    },
    featuredTitle: { fontSize: 16, fontWeight: "600", color: "#fff" },
    featuredMeta: { flex: 1, fontSize: 12, color: "rgba(255,255,255,0.75)" },
    featuredPrice: {
      marginTop: 2,
      fontSize: 18,
      fontWeight: "600",
      color: "#fff",
    },

    saleTag: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      borderRadius: 999,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    saleDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.ctaRed },
    saleTagText: { fontSize: 9.5, fontWeight: "700", letterSpacing: 0.4, textTransform: "uppercase" },
  });
}
