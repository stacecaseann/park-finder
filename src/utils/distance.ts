/**
 * Straight-line distance between two coordinates, in miles.
 * No external API, no driving distance — pure Haversine.
 */

const EARTH_RADIUS_MILES = 3958.8;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Haversine formula: great-circle distance between two lat/lng points.
 * https://en.wikipedia.org/wiki/Haversine_formula
 */
export function calculateDistanceMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_MILES * c;
}

/** Format a distance for display, rounded to one decimal place. */
export function formatDistanceMiles(miles: number): string {
  return `${miles.toFixed(1)} miles away`;
}
