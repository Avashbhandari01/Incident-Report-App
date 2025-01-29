"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  {
    ssr: false,
  }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  {
    ssr: false,
  }
);
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), {
  ssr: false,
});
import { useMapEvents } from "react-leaflet";

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onCoordinatesChange: (lat: number, lng: number) => void;
}

export function LocationInput({
  value,
  onChange,
  onCoordinatesChange,
}: LocationInputProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  function LocationMarker() {
    const MapEvents = useMapEvents as unknown as typeof useMapEvents;

    MapEvents({
      click(event) {
        const { lat, lng } = event.latlng;
        setPosition([lat, lng]);
        onCoordinatesChange(lat, lng);
        onChange(`Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`);
      },
    });

    const customIcon = new L.Icon({
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    return position ? (
      <Marker position={position} icon={customIcon}>
        <Popup>{`Latitude: ${position[0].toFixed(
          6
        )}, Longitude: ${position[1].toFixed(6)}`}</Popup>
      </Marker>
    ) : null;
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-zinc-400 mb-2">
        Location
      </label>
      <div className="relative">
        <MapContainer
          center={[27.7172, 85.324]}
          zoom={13}
          style={{ height: "300px", width: "100%", borderRadius: "1rem" }}
          scrollWheelZoom={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker />
        </MapContainer>
      </div>

      {position && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl bg-zinc-900/50 border border-zinc-800 px-4 py-3.5 text-white"
          readOnly
        />
      )}
    </div>
  );
}

export default LocationInput;
