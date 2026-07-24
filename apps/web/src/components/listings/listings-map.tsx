"use client";

import Link from "next/link";
import type { Listing } from "@donusum-kapisi/db";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslations } from "next-intl";
import { formatPriceRange } from "@/lib/format";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const TURKEY_CENTER: [number, number] = [39.0, 35.0];

export function ListingsMap({ listings }: { listings: Listing[] }) {
  const t = useTranslations("listings");
  const withCoords = listings.filter(
    (listing): listing is Listing & { latitude: number; longitude: number } =>
      listing.latitude !== null && listing.longitude !== null
  );

  if (withCoords.length === 0) {
    return (
      <p className="mt-10 text-sm text-ink-muted">
        {t("noMappedListings")}
      </p>
    );
  }

  const center: [number, number] =
    withCoords.length > 0 ? [withCoords[0].latitude, withCoords[0].longitude] : TURKEY_CENTER;

  return (
    <MapContainer
      center={center}
      zoom={6}
      style={{ height: 520, width: "100%", borderRadius: 16 }}
      className="mt-6"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {withCoords.map((listing) => (
        <Marker key={listing.id} position={[listing.latitude, listing.longitude]} icon={markerIcon}>
          <Popup>
            <div className="min-w-[180px]">
              <p className="text-xs text-ink-muted">
                {listing.district}, {listing.province}
              </p>
              <Link
                href={`/ilanlar/${listing.listingNumber}`}
                className="mt-1 block text-sm font-semibold text-ink hover:text-clay"
              >
                {listing.title}
              </Link>
              <p className="mt-1 text-xs text-ink-muted">
                {formatPriceRange(listing.priceMin, listing.priceMax)}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
