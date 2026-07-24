import { StyleSheet, View } from "react-native";
import MapView, { Marker, type MapPressEvent } from "react-native-maps";
import { useColors } from "@/src/lib/theme-context";

const TURKEY_REGION = {
  latitude: 39.0,
  longitude: 35.0,
  latitudeDelta: 12,
  longitudeDelta: 12,
};

export function LocationPicker({
  latitude,
  longitude,
  onChange,
}: {
  latitude?: number;
  longitude?: number;
  onChange: (lat: number, lng: number) => void;
}) {
  const colors = useColors();
  const hasPoint = latitude !== undefined && longitude !== undefined;
  const initialRegion = hasPoint
    ? { latitude, longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 }
    : TURKEY_REGION;

  function handlePress(event: MapPressEvent) {
    const { latitude: lat, longitude: lng } = event.nativeEvent.coordinate;
    onChange(lat, lng);
  }

  return (
    <View style={styles.wrapper}>
      <MapView style={styles.map} initialRegion={initialRegion} onPress={handlePress}>
        {hasPoint && <Marker coordinate={{ latitude, longitude }} pinColor={colors.turquoise} />}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { height: 200, borderRadius: 12, overflow: "hidden" },
  map: { flex: 1 },
});
