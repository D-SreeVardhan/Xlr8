"use client";

import { CircleMarker, MapContainer, TileLayer, Tooltip } from "react-leaflet";

import type { Ambulance, AmbulanceStatus } from "./operations-cockpit";

type Props = {
  ambulances: Ambulance[];
  hospital: [number, number];
  statusColor: (status: AmbulanceStatus) => string;
};

export function AmbulanceMap({ ambulances, hospital, statusColor }: Props) {
  return (
    <MapContainer
      center={hospital}
      zoom={12}
      scrollWheelZoom={false}
      zoomControl={false}
      style={{ height: "100%", width: "100%", background: "#0A0B0D" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap &copy; CARTO"
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      <CircleMarker
        center={hospital}
        radius={9}
        pathOptions={{ color: "#E04E2C", weight: 2, fillColor: "#E04E2C", fillOpacity: 0.65 }}
      >
        <Tooltip permanent direction="top" offset={[0, -10]}>
          <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            HQ Hospital
          </span>
        </Tooltip>
      </CircleMarker>

      {ambulances.map((amb) => {
        const color = statusColor(amb.status);
        return (
          <CircleMarker
            key={amb.id}
            center={[amb.lat, amb.lng]}
            radius={6}
            pathOptions={{
              color,
              weight: 2,
              fillColor: color,
              fillOpacity: 0.85,
            }}
          >
            <Tooltip direction="top" offset={[0, -8]}>
              <div style={{ fontSize: 11, lineHeight: 1.4 }}>
                <strong>{amb.callSign}</strong>
                <div style={{ textTransform: "uppercase", letterSpacing: "0.12em", fontSize: 9 }}>
                  {amb.status}
                </div>
                {amb.status === "enroute" || amb.status === "returning" ? (
                  <div>ETA {amb.etaMin}m</div>
                ) : null}
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
