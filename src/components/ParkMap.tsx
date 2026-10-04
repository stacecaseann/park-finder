import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import type { Park } from "../types/park";
import { getParkHighlights } from "../utils/parkHighlights";
import type { ParkExperienceMatch } from "../data/parkExperiences";

/**
 * Leaflet's default marker icons are referenced by relative URL and break
 * under Vite. Re-point them at the bundled asset URLs so markers render.
 */
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

/** Default center over the Utah County collection (Springville–Spanish Fork). */
const DEFAULT_CENTER: [number, number] = [40.11, -111.62];
const SINGLE_PARK_ZOOM = 14;

/**
 * Parks that have verified coordinates. Parks with null coordinates
 * are skipped — only mappable parks get markers.
 */
function mappableParks(parks: Park[]) {
  return parks.filter(
    (park): park is Park & { latitude: number; longitude: number } =>
      park.latitude !== null && park.longitude !== null
  );
}

interface FitBoundsProps {
  parks: Park[];
  userLocation?: { latitude: number; longitude: number } | null;
}

/**
 * Adjust the map view to fit the displayed markers whenever the
 * collection of mappable parks (or the user location) changes.
 * Does not respond to manual pan/zoom — only to meaningful changes
 * in which parks are shown.
 */
function FitBounds({ parks, userLocation }: FitBoundsProps) {
  const map = useMap();
  const mappable = mappableParks(parks);
  const signature =
    mappable.map((p) => p.id).join(",") +
    (userLocation
      ? `|u:${userLocation.latitude},${userLocation.longitude}`
      : "");

  useEffect(() => {
    const points: [number, number][] = mappable.map((p) => [
      p.latitude,
      p.longitude,
    ]);
    if (userLocation) {
      points.push([userLocation.latitude, userLocation.longitude]);
    }

    if (points.length === 0) return;

    if (points.length === 1) {
      map.setView(points[0], SINGLE_PARK_ZOOM);
      return;
    }

    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [40, 40] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, map]);

  return null;
}

interface ParkMapProps {
  parks: Park[];
  userLocation?: { latitude: number; longitude: number } | null;
  experienceMatches?: ReadonlyMap<string, ParkExperienceMatch>;
}

function ParkMap({
  parks,
  userLocation = null,
  experienceMatches,
}: ParkMapProps) {
  const mappable = mappableParks(parks);
  const skipped = parks.length - mappable.length;

  if (mappable.length === 0) {
    return (
      <div className="park-map-empty">
        <p>No parks with location data to show on the map.</p>
      </div>
    );
  }

  return (
    <div className="park-map-wrapper">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={12}
        className="park-map"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds parks={parks} userLocation={userLocation} />
        {userLocation && (
          <CircleMarker
            center={[userLocation.latitude, userLocation.longitude]}
            radius={10}
            pathOptions={{
              color: "#ffffff",
              weight: 2,
              fillColor: "#2563eb",
              fillOpacity: 1,
            }}
          >
            <Popup>Your location</Popup>
          </CircleMarker>
        )}
        {mappable.map((park) => {
          const match = experienceMatches?.get(park.id);
          const highlights = getParkHighlights(park, 3);

          return (
            <Marker key={park.id} position={[park.latitude, park.longitude]}>
              <Popup>
                <div className="park-popup">
                  <strong className="park-popup-name">{park.name}</strong>
                  <span className="park-popup-city">{park.city}</span>
                  {match && (
                    <span className="park-popup-match">
                      {match.quality.label} for {match.experienceName}
                    </span>
                  )}
                  {highlights.length > 0 && (
                    <span className="park-popup-features">
                      {highlights.join(" · ")}
                    </span>
                  )}
                  <Link to={`/parks/${park.id}`}>View Park</Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      {skipped > 0 && (
        <p className="park-map-note">
          {skipped} {skipped === 1 ? "park" : "parks"} not shown (no location
          data yet).
        </p>
      )}
    </div>
  );
}

export default ParkMap;
