import { useCallback, useState } from "react";

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export type LocationStatus = "idle" | "loading" | "active" | "error";

interface UseUserLocationResult {
  location: UserLocation | null;
  status: LocationStatus;
  error: string | null;
  requestLocation: () => void;
  clearLocation: () => void;
}

/**
 * Browser geolocation, requested only on explicit user action.
 * Coordinates live only in React state — never persisted to storage,
 * URL, or any server.
 */
export function useUserLocation(): UseUserLocationResult {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setStatus("error");
      setError("Your browser doesn't support location services.");
      return;
    }

    setStatus("loading");
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setStatus("active");
      },
      (err) => {
        setLocation(null);
        setStatus("error");
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError(
              "Location permission was denied. You can still browse and filter parks."
            );
            break;
          case err.POSITION_UNAVAILABLE:
            setError(
              "Your location is currently unavailable. Please try again."
            );
            break;
          case err.TIMEOUT:
            setError("Finding your location timed out. Please try again.");
            break;
          default:
            setError("We couldn't determine your location. Please try again.");
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const clearLocation = useCallback(() => {
    setLocation(null);
    setStatus("idle");
    setError(null);
  }, []);

  return { location, status, error, requestLocation, clearLocation };
}
