import type {
  ActivityFeatures,
  AmenityFeatures,
  Park,
  PlaygroundFeatures,
  TrailFeatures,
  WaterFeatures,
} from "../types/park";

type ExperienceFeaturePath =
  | "playground"
  | `playgroundFeatures.${keyof PlaygroundFeatures & string}`
  | `water.${keyof WaterFeatures & string}`
  | `activities.${keyof ActivityFeatures & string}`
  | `trails.${keyof TrailFeatures & string}`
  | `amenities.${keyof AmenityFeatures & string}`
  | "dogs";

interface ExperienceFeatureWeight {
  path: ExperienceFeaturePath;
  label: string;
  weight: number;
}

interface ParkExperienceDefinition {
  id: string;
  name: string;
  icon: string;
  description: string;
  features: ExperienceFeatureWeight[];
}

export const parkExperiences = [
  {
    id: "little-kids",
    name: "Little Kids",
    icon: "🧸",
    description: "Baby swings, smaller play areas, shade and family-friendly amenities.",
    features: [
      { path: "playgroundFeatures.toddlerArea", label: "Toddler Area", weight: 3 },
      { path: "playgroundFeatures.babySwings", label: "Baby Swings", weight: 3 },
      { path: "playgroundFeatures.separateAgeAreas", label: "Separate Age Areas", weight: 2 },
      { path: "playgroundFeatures.swings", label: "Swings", weight: 1 },
      { path: "playgroundFeatures.slides", label: "Slides", weight: 1 },
      { path: "playgroundFeatures.fenced", label: "Fenced Play Area", weight: 2 },
      { path: "amenities.restrooms", label: "Restrooms", weight: 1 },
      { path: "amenities.shade", label: "Shade", weight: 1 },
    ],
  },
  {
    id: "playground-adventure",
    name: "Playground Adventure",
    icon: "🛝",
    description: "Big play features, climbing, slides and exciting equipment.",
    features: [
      { path: "playground", label: "Playground", weight: 2 },
      { path: "playgroundFeatures.climbingStructure", label: "Climbing Structure", weight: 3 },
      { path: "playgroundFeatures.tallSlide", label: "Tall Slide", weight: 3 },
      { path: "playgroundFeatures.zipline", label: "Zipline", weight: 3 },
      { path: "playgroundFeatures.interactivePlay", label: "Interactive Play", weight: 3 },
      { path: "playgroundFeatures.monkeyBars", label: "Monkey Bars", weight: 1 },
      { path: "playgroundFeatures.slides", label: "Slides", weight: 1 },
      { path: "playgroundFeatures.swings", label: "Swings", weight: 1 },
    ],
  },
  {
    id: "water-day",
    name: "Water Day",
    icon: "💦",
    description: "Splash pads, creeks, ponds and other water features.",
    features: [
      { path: "water.splashPad", label: "Splash Pad", weight: 4 },
      { path: "water.creek", label: "Creek", weight: 3 },
      { path: "water.river", label: "River", weight: 3 },
      { path: "water.pond", label: "Pond", weight: 2 },
    ],
  },
  {
    id: "get-moving",
    name: "Get Moving",
    icon: "🏀",
    description: "Courts, fields, fitness areas and active recreation.",
    features: [
      { path: "activities.basketball", label: "Basketball", weight: 2 },
      { path: "activities.volleyball", label: "Volleyball", weight: 2 },
      { path: "activities.soccer", label: "Soccer", weight: 2 },
      { path: "activities.baseball", label: "Baseball", weight: 2 },
      { path: "activities.fitnessArea", label: "Fitness Area", weight: 3 },
      { path: "trails.bikePath", label: "Bike Path", weight: 1 },
    ],
  },
  {
    id: "picnic-relax",
    name: "Picnic & Relax",
    icon: "🧺",
    description: "Shade, picnic areas, grass and places to gather.",
    features: [
      { path: "amenities.shade", label: "Shade", weight: 3 },
      { path: "amenities.picnicTables", label: "Picnic Tables", weight: 3 },
      { path: "amenities.pavilion", label: "Pavilion", weight: 2 },
      { path: "amenities.rentablePavilion", label: "Reservable Pavilion", weight: 1 },
      { path: "amenities.grills", label: "Grills", weight: 2 },
      { path: "amenities.restrooms", label: "Restrooms", weight: 1 },
    ],
  },
  {
    id: "walk-explore",
    name: "Walk & Explore",
    icon: "🥾",
    description: "Walking paths, bike paths and nature areas.",
    features: [
      { path: "trails.walkingPath", label: "Walking Path", weight: 2 },
      { path: "trails.pavedWalkingPath", label: "Paved Walking Path", weight: 2 },
      { path: "trails.natureWalk", label: "Nature Walk", weight: 3 },
      { path: "trails.bikePath", label: "Bike Path", weight: 2 },
      { path: "water.creek", label: "Creek", weight: 1 },
      { path: "water.river", label: "River", weight: 1 },
      { path: "water.pond", label: "Pond", weight: 1 },
    ],
  },
  {
    id: "accessible-play",
    name: "Accessible Play",
    icon: "♿",
    description: "Accessible play features and easier ways for more families to enjoy the park.",
    features: [
      { path: "playgroundFeatures.inclusivePlay", label: "Inclusive / All-Abilities Play", weight: 4 },
      { path: "playgroundFeatures.accessibleSwings", label: "Accessible Swings", weight: 4 },
      { path: "trails.pavedWalkingPath", label: "Paved Walking Path", weight: 1 },
    ],
  },
  {
    id: "bring-the-dog",
    name: "Bring the Dog",
    icon: "🐕",
    description: "Find parks where dogs are welcome.",
    features: [
      { path: "dogs", label: "Dogs Allowed", weight: 4 },
    ],
  },
] as const satisfies readonly ParkExperienceDefinition[];

export type ParkExperience = (typeof parkExperiences)[number];
export type ParkExperienceId = ParkExperience["id"];

export const experienceMatchThresholds = {
  great: 0.65,
  good: 0.35,
} as const;

export type ExperienceMatchQuality =
  | { label: "Great Match"; ratio: number }
  | { label: "Good Match"; ratio: number }
  | { label: "Some Features"; ratio: number };

export interface ScoredExperienceFeature {
  label: string;
  points: number;
}

export interface ParkExperienceScore {
  totalScore: number;
  maximumScore: number;
  contributingFeatures: ScoredExperienceFeature[];
}

export interface ParkExperienceMatch extends ParkExperienceScore {
  experienceId: ParkExperienceId;
  experienceName: string;
  quality: ExperienceMatchQuality;
}

function getBooleanFeatureValue(
  park: Park,
  path: ExperienceFeaturePath
): boolean {
  if (path === "playground") return park.playground;
  if (path === "dogs") {
    return park.dogs === "allowed" || park.dogs === "leash-only";
  }

  const [group, key] = path.split(".");
  switch (group) {
    case "playgroundFeatures":
      return park.playgroundFeatures[key as keyof PlaygroundFeatures];
    case "water":
      return park.water[key as keyof WaterFeatures];
    case "activities":
      return park.activities[key as keyof ActivityFeatures];
    case "trails":
      return park.trails[key as keyof TrailFeatures];
    case "amenities":
      return park.amenities[key as keyof AmenityFeatures];
    default:
      return false;
  }
}

export function scoreParkForExperience(
  park: Park,
  experience: ParkExperience
): ParkExperienceScore {
  const contributingFeatures = experience.features
    .filter(({ path }) => getBooleanFeatureValue(park, path))
    .map(({ path, label, weight }) => ({
      label:
        path === "dogs" && park.dogs === "leash-only"
          ? "Dogs Welcome on Leash"
          : label,
      points: weight,
    }))
    .sort((a, b) => b.points - a.points);

  return {
    totalScore: contributingFeatures.reduce(
      (total, feature) => total + feature.points,
      0
    ),
    maximumScore: experience.features.reduce(
      (total, feature) => total + feature.weight,
      0
    ),
    contributingFeatures,
  };
}

export function getExperienceMatchQuality(
  totalScore: number,
  maximumScore: number
): ExperienceMatchQuality | null {
  if (totalScore <= 0 || maximumScore <= 0) return null;

  const ratio = totalScore / maximumScore;
  if (ratio >= experienceMatchThresholds.great) {
    return { label: "Great Match", ratio };
  }
  if (ratio >= experienceMatchThresholds.good) {
    return { label: "Good Match", ratio };
  }
  return { label: "Some Features", ratio };
}

export function getParkExperienceMatch(
  park: Park,
  experience: ParkExperience
): ParkExperienceMatch | null {
  const score = scoreParkForExperience(park, experience);
  const quality = getExperienceMatchQuality(
    score.totalScore,
    score.maximumScore
  );
  if (!quality) return null;

  return {
    ...score,
    experienceId: experience.id,
    experienceName: experience.name,
    quality,
  };
}
