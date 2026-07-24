import { useCallback, useMemo, useState } from "react";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import type { ListingDTO } from "@donusum-kapisi/shared";
import { api, ApiError, type OfferWithListing } from "@/src/lib/api";
import { useAuth } from "@/src/lib/auth-context";
import { formatPriceRange, type Colors } from "@/src/lib/theme";
import { useColors } from "@/src/lib/theme-context";
import { buildCallUrl, buildMailUrl, buildWhatsAppUrl } from "@/src/lib/contact";
import { TextField } from "@/src/components/text-field";
import { Button } from "@/src/components/button";
import { ListingGallery } from "@/src/components/listing-gallery";

const SPECS: Array<{
  labelKey: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: (l: ListingDTO) => string | number;
}> = [
  { labelKey: "listingDetail.specSquareMeters", icon: "resize-outline", value: (l) => `${l.squareMeters} m²` },
  { labelKey: "listingDetail.specBuildingAge", icon: "time-outline", value: (l) => `${l.buildingAge} yıl` },
  { labelKey: "listingDetail.specFloorCount", icon: "layers-outline", value: (l) => l.floorCount },
  { labelKey: "listingDetail.specUnitCount", icon: "home-outline", value: (l) => l.unitCount },
];

export default function ListingDetailScreen() {
  const { listingNumber } = useLocalSearchParams<{ listingNumber: string }>();
  const { user } = useAuth();
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [listing, setListing] = useState<ListingDTO | null>(null);
  const [existingOffer, setExistingOffer] = useState<OfferWithListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.getListing(listingNumber);
      setListing(response.listing);

      if (user?.role === "CONTRACTOR") {
        const offers = await api.myOffers();
        setExistingOffer(
          offers.offers.find((offer) => offer.listing.listingNumber === listingNumber) ?? null
        );
      }
    } catch {
      setListing(null);
    } finally {
      setIsLoading(false);
    }
  }, [listingNumber, user]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (isLoading) {
    return <ActivityIndicator style={{ marginTop: 32 }} color={colors.turquoise} />;
  }

  if (!listing) {
    return <Text style={styles.message}>{t("listingDetail.notFound")}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ListingGallery photos={listing.photos} />

      <Text style={styles.meta}>{t("listingDetail.listingNumber", { number: listing.listingNumber })}</Text>
      <Text style={styles.title}>{listing.title}</Text>
      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={14} color={colors.inkMuted} />
        <Text style={styles.location}>
          {listing.district}, {listing.province}
        </Text>
      </View>

      <View style={styles.specs}>
        {SPECS.map((spec) => (
          <View key={spec.labelKey} style={styles.specItem}>
            <Ionicons name={spec.icon} size={18} color={colors.turquoise} />
            <Text style={styles.specValue}>{spec.value(listing)}</Text>
            <Text style={styles.specLabel}>{t(spec.labelKey)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.priceCard}>
        <Text style={styles.priceLabel}>{t("listingDetail.priceLabel")}</Text>
        <Text style={styles.price}>{formatPriceRange(listing.priceMin, listing.priceMax)}</Text>
      </View>

      <Text style={styles.sectionLabel}>{t("listingDetail.descriptionLabel")}</Text>
      <Text style={styles.description}>{listing.description}</Text>

      {user?.role === "CONTRACTOR" ? (
        <OfferSection listingNumber={listing.listingNumber} existingOffer={existingOffer} onSubmitted={load} />
      ) : (
        <View style={styles.noticeBox}>
          <View style={styles.noticeTextRow}>
            <Ionicons name="information-circle-outline" size={18} color={colors.inkMuted} />
            <Text style={styles.noticeText}>{t("listingDetail.notice")}</Text>
          </View>

          <View style={styles.contactRow}>
            <ContactAction
              icon="call-outline"
              label={t("listingDetail.contactCall")}
              onPress={() => Linking.openURL(buildCallUrl())}
            />
            <ContactAction
              icon="logo-whatsapp"
              label={t("listingDetail.contactWhatsApp")}
              onPress={() =>
                Linking.openURL(
                  buildWhatsAppUrl(t("listingDetail.whatsAppMessage", { number: listing.listingNumber }))
                )
              }
            />
            <ContactAction
              icon="mail-outline"
              label={t("listingDetail.contactEmail")}
              onPress={() =>
                Linking.openURL(
                  buildMailUrl(
                    t("listingDetail.emailSubject", { number: listing.listingNumber }),
                    t("listingDetail.whatsAppMessage", { number: listing.listingNumber })
                  )
                )
              }
            />
          </View>
        </View>
      )}
    </ScrollView>
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

function OfferSection({
  listingNumber,
  existingOffer,
  onSubmitted,
}: {
  listingNumber: string;
  existingOffer: OfferWithListing | null;
  onSubmitted: () => void;
}) {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [priceMin, setPriceMin] = useState(existingOffer ? String(existingOffer.priceMin) : "");
  const [priceMax, setPriceMax] = useState(existingOffer ? String(existingOffer.priceMax) : "");
  const [durationMonths, setDurationMonths] = useState(
    existingOffer?.durationMonths ? String(existingOffer.durationMonths) : ""
  );
  const [note, setNote] = useState(existingOffer?.note ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function submit() {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      await api.createOffer(listingNumber, {
        priceMin: Number(priceMin),
        priceMax: Number(priceMax),
        durationMonths: durationMonths ? Number(durationMonths) : undefined,
        note: note || undefined,
      });
      setSuccess(true);
      onSubmitted();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("listingDetail.offerError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.offerBox}>
      <Text style={styles.offerTitle}>
        {existingOffer ? t("listingDetail.offerTitleUpdate") : t("listingDetail.offerTitleNew")}
      </Text>
      <Text style={styles.noticeText}>{t("listingDetail.offerNotice")}</Text>

      <View style={styles.offerRow}>
        <View style={{ flex: 1 }}>
          <TextField
            label={t("listingDetail.offerPriceMin")}
            keyboardType="numeric"
            value={priceMin}
            onChangeText={setPriceMin}
          />
        </View>
        <View style={{ flex: 1 }}>
          <TextField
            label={t("listingDetail.offerPriceMax")}
            keyboardType="numeric"
            value={priceMax}
            onChangeText={setPriceMax}
          />
        </View>
      </View>

      <TextField
        label={t("listingDetail.offerDuration")}
        keyboardType="numeric"
        value={durationMonths}
        onChangeText={setDurationMonths}
      />
      <TextField label={t("listingDetail.offerNote")} value={note} onChangeText={setNote} multiline />

      {error && <Text style={styles.errorText}>{error}</Text>}
      {success && <Text style={styles.successText}>{t("listingDetail.offerSuccess")}</Text>}

      <Button
        title={existingOffer ? t("listingDetail.offerUpdate") : t("listingDetail.offerSubmit")}
        onPress={submit}
        loading={isSubmitting}
      />
    </View>
  );
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
    container: { padding: 16, gap: 4, backgroundColor: colors.paper },
    message: { marginTop: 32, textAlign: "center", color: colors.inkMuted },
    meta: { marginTop: 12, fontSize: 11, fontWeight: "600", color: colors.turquoise, letterSpacing: 1 },
    title: { marginTop: 4, fontSize: 22, fontWeight: "700", color: colors.ink },
    locationRow: { marginTop: 4, flexDirection: "row", alignItems: "center", gap: 4 },
    location: { fontSize: 13, color: colors.inkMuted },
    specs: {
      marginTop: 18,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    specItem: {
      flexBasis: "47%",
      flexGrow: 1,
      borderRadius: 14,
      backgroundColor: colors.mist,
      padding: 12,
      gap: 4,
    },
    specValue: { fontSize: 15, fontWeight: "700", color: colors.ink },
    specLabel: { fontSize: 11, color: colors.inkMuted },
    priceCard: {
      marginTop: 16,
      borderRadius: 16,
      backgroundColor: colors.deep,
      padding: 16,
      gap: 4,
    },
    priceLabel: {
      fontSize: 11,
      fontWeight: "600",
      color: colors.turquoiseSoft,
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },
    price: { fontSize: 20, fontWeight: "800", color: colors.onDark },
    sectionLabel: {
      marginTop: 20,
      fontSize: 12,
      fontWeight: "700",
      color: colors.turquoise,
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },
    description: { marginTop: 8, fontSize: 14, lineHeight: 20, color: colors.inkMuted },
    noticeBox: {
      marginTop: 24,
      gap: 14,
      backgroundColor: colors.mist,
      borderRadius: 16,
      padding: 16,
    },
    noticeTextRow: { flexDirection: "row", gap: 10 },
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
    noticeText: { flex: 1, fontSize: 13, lineHeight: 19, color: colors.inkMuted },
    offerBox: { marginTop: 24, backgroundColor: colors.mist, borderRadius: 16, padding: 16, gap: 12 },
    offerTitle: { fontSize: 16, fontWeight: "700", color: colors.ink },
    offerRow: { flexDirection: "row", gap: 12 },
    errorText: { fontSize: 13, color: colors.ctaRed },
    successText: { fontSize: 13, color: colors.turquoise },
  });
}
