import type { ParkImage } from "./parkImage";

/** Playground equipment and layout flags. */
export interface PlaygroundFeatures {
  toddlerArea: boolean;
  separateAgeAreas: boolean;
  swings: boolean;
  babySwings: boolean;
  accessibleSwings: boolean;
  slides: boolean;
  tallSlide: boolean;
  monkeyBars: boolean;
  climbingStructure: boolean;
  zipline: boolean;
  interactivePlay: boolean;
  /** Inclusive / all-abilities playground design. */
  inclusivePlay: boolean;
  fenced: boolean;
}

/** Water features at the park. */
export interface WaterFeatures {
  splashPad: boolean;
  creek: boolean;
  river: boolean;
  pond: boolean;
}

/** Sports courts, fields, and activity areas. */
export interface ActivityFeatures {
  basketball: boolean;
  volleyball: boolean;
  soccer: boolean;
  baseball: boolean;
  pickleball: boolean;
  futsal: boolean;
  fitnessArea: boolean;
  /** Open / multi-use grassy field (not a dedicated sport field). */
  openField: boolean;
}

/** Paths and trails. */
export interface TrailFeatures {
  walkingPath: boolean;
  pavedWalkingPath: boolean;
  bikePath: boolean;
  natureWalk: boolean;
}

/** General amenities and facilities. */
export interface AmenityFeatures {
  restrooms: boolean;
  waterFountain: boolean;
  picnicTables: boolean;
  grills: boolean;
  pavilion: boolean;
  rentablePavilion: boolean;
  shade: boolean;
  parking: boolean;
  /** Tent or group camping is available. */
  camping: boolean;
}

/** Dog policy at the park. */
export type DogsPolicy = "allowed" | "leash-only" | "not-allowed" | "unknown";

/**
 * Core domain type for Park Quest.
 */
export interface Park {
  id: string;
  name: string;
  /** Alternate or full official name (e.g. "Adventure Heights All-Abilities Park"). */
  alternateName?: string;
  city: string;
  state: string;
  zip: string;
  address: string;
  /** Null until verified coordinates are available. */
  latitude: number | null;
  longitude: number | null;
  /** Official city page for the park. */
  website: string;
  /** Visitor-facing highlight summary. */
  description: string;
  mainImage: ParkImage;
  images: ParkImage[];
  playground: boolean;
  playgroundFeatures: PlaygroundFeatures;
  water: WaterFeatures;
  activities: ActivityFeatures;
  trails: TrailFeatures;
  amenities: AmenityFeatures;
  dogs: DogsPolicy;
  features: string[];
  /** Temporary conditions or project updates, separate from permanent features. */
  notices?: string[];
  notes: string[];
}
