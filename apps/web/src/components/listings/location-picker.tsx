"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const TURKEY_CENTER: [number, number] = [39.0, 35.0];

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function LocationPicker({
  latitude,
  longitude,
  onChange,
}: {
  latitude?: number;
  longitude?: number;
  onChange: (lat: number, lng: number) => void;
}) {
  const hasPoint = latitude !== undefined && longitude !== undefined;
  const center: [number, number] = hasPoint ? [latitude, longitude] : TURKEY_CENTER;

  return (
    <MapContainer
      center={center}
      zoom={hasPoint ? 14 : 6}
      style={{ height: 220, width: "100%", borderRadius: 12 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <ClickHandler onPick={onChange} />
      {hasPoint && <Marker position={[latitude, longitude]} icon={markerIcon} />}
    </MapContainer>
  );
}
