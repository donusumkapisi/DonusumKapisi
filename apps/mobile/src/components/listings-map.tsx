import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import type { ListingDTO } from "@donusum-kapisi/shared";
import { formatPriceRange, type Colors } from "@/src/lib/theme";
import { useColors } from "@/src/lib/theme-context";

const TURKEY_REGION = {
  latitude: 39.0,
  longitude: 35.0,
  latitudeDelta: 12,
  longitudeDelta: 12,
};

export function ListingsMap({
  listings,
  onSelect,
}: {
  listings: ListingDTO[];
  onSelect: (listing: ListingDTO) => void;
}) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const withCoords = listings.filter(
    (listing): listing is ListingDTO & { latitude: number; longitude: number } =>
      listing.latitude !== null && listing.longitude !== null
  );

  if (withCoords.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Konumu işaretlenmiş ilan bulunmuyor.</Text>
      </View>
    );
  }

  const initialRegion =
    withCoords.length > 0
      ? {
          latitude: withCoords[0].latitude,
          longitude: withCoords[0].longitude,
          latitudeDelta: 8,
          longitudeDelta: 8,
        }
      : TURKEY_REGION;

  return (
    <MapView style={styles.map} initialRegion={initialRegion}>
      {withCoords.map((listing) => (
        <Marker
          key={listing.id}
          coordinate={{ latitude: listing.latitude, longitude: listing.longitude }}
          pinColor={colors.turquoise}
          onCalloutPress={() => onSelect(listing)}
        >
          <Callout>
            <View style={{ maxWidth: 200 }}>
              <Text style={styles.calloutMeta}>
                {listing.district}, {listing.province}
              </Text>
              <Text style={styles.calloutTitle}>{listing.title}</Text>
              <Text style={styles.calloutPrice}>
                {formatPriceRange(listing.priceMin, listing.priceMax)}
              </Text>
            </View>
          </Callout>
        </Marker>
      ))}
    </MapView>
  );
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
    map: { flex: 1 },
    empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
    emptyText: { color: colors.inkMuted, fontSize: 14, textAlign: "center" },
    calloutMeta: { fontSize: 10, color: colors.inkMuted },
    calloutTitle: { fontSize: 13, fontWeight: "700", color: colors.ink, marginTop: 2 },
    calloutPrice: { fontSize: 12, color: colors.turquoise, marginTop: 2 },
  });
}
