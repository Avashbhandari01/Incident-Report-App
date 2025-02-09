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

  // Function to fetch location name from OpenCage API
  const getLocationName = async (lat: number, lng: number) => {
    const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results.length > 0) {
        return data.results[0].formatted;
      }
      return "Location not found";
    } catch (error) {
      console.error("Error fetching location data:", error);
      return "Error fetching location";
    }
  };

  function LocationMarker() {
    const MapEvents = useMapEvents as unknown as typeof useMapEvents;

    MapEvents({
      async click(event) {
        const { lat, lng } = event.latlng;
        setPosition([lat, lng]);
        onCoordinatesChange(lat, lng);

        // Fetch location name from OpenCage API and update input field
        const locationName = await getLocationName(lat, lng);
        onChange(locationName); // Set the location name as the value in input field
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
