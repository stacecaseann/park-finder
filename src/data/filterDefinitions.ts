import type {
  ActivityFeatures,
  AmenityFeatures,
  Park,
  PlaygroundFeatures,
  TrailFeatures,
  WaterFeatures,
} from "../types/park";

/**
 * All valid dotted paths to a boolean flag on Park
 * (e.g. 'playground', 'water.splashPad').
 * The `path` of every filter definition is checked against this union,
 * so a filter can never point at a property that doesn't exist on Park.
 */
export type BooleanParkPath =
  | "playground"
  | `playgroundFeatures.${keyof PlaygroundFeatures & string}`
  | `water.${keyof WaterFeatures & string}`
  | `activities.${keyof ActivityFeatures & string}`
  | `trails.${keyof TrailFeatures & string}`
  | `amenities.${keyof AmenityFeatures & string}`;

/** A single filterable attribute of a park. */
export interface FilterDefinition {
  /** Stable identifier, used for keys and URL/query state. */
  id: string;
  /** User-friendly label shown in the filter UI. */
  label: string;
  /** Dotted path to the boolean property on Park this filter checks. */
  path: BooleanParkPath;
}

/** A named group of related filter definitions. */
export interface FilterCategory {
  id: string;
  label: string;
  filters: FilterDefinition[];
}

/**
 * Centralized filter definitions for the Explore Parks page.
 * The filter UI is generated from this structure — add or edit
 * entries here rather than inside components.
 */
export const filterCategories: FilterCategory[] = [
  {
    id: "playground",
    label: "Playground",
    filters: [
      { id: "has-playground", label: "Playground", path: "playground" },
      {
        id: "toddler-area",
        label: "Toddler Area",
        path: "playgroundFeatures.toddlerArea",
      },
      {
        id: "separate-age-areas",
        label: "Separate Age Areas",
        path: "playgroundFeatures.separateAgeAreas",
      },
      { id: "swings", label: "Swings", path: "playgroundFeatures.swings" },
      {
        id: "baby-swings",
        label: "Baby Swings",
        path: "playgroundFeatures.babySwings",
      },
      {
        id: "accessible-swings",
        label: "Accessible Swings",
        path: "playgroundFeatures.accessibleSwings",
      },
      { id: "slides", label: "Slides", path: "playgroundFeatures.slides" },
      {
        id: "tall-slide",
        label: "Tall Slide",
        path: "playgroundFeatures.tallSlide",
      },
      {
        id: "monkey-bars",
        label: "Monkey Bars",
        path: "playgroundFeatures.monkeyBars",
      },
      {
        id: "climbing-structure",
        label: "Climbing Structure",
        path: "playgroundFeatures.climbingStructure",
      },
      { id: "zipline", label: "Zipline", path: "playgroundFeatures.zipline" },
      {
        id: "interactive-play",
        label: "Interactive Play",
        path: "playgroundFeatures.interactivePlay",
      },
      {
        id: "inclusive-play",
        label: "Inclusive / All-Abilities Play",
        path: "playgroundFeatures.inclusivePlay",
      },
      {
        id: "fenced-playground",
        label: "Fenced Playground",
        path: "playgroundFeatures.fenced",
      },
    ],
  },
  {
    id: "water",
    label: "Water",
    filters: [
      { id: "splash-pad", label: "Splash Pad", path: "water.splashPad" },
      { id: "creek", label: "Creek", path: "water.creek" },
      { id: "river", label: "River", path: "water.river" },
      { id: "pond", label: "Pond", path: "water.pond" },
    ],
  },
  {
    id: "sports-activities",
    label: "Sports & Activities",
    filters: [
      { id: "basketball", label: "Basketball", path: "activities.basketball" },
      { id: "volleyball", label: "Volleyball", path: "activities.volleyball" },
      { id: "soccer", label: "Soccer", path: "activities.soccer" },
      { id: "baseball", label: "Baseball", path: "activities.baseball" },
      {
        id: "fitness-area",
        label: "Fitness Area",
        path: "activities.fitnessArea",
      },
      {
        id: "open-field",
        label: "Open / Multi-Use Field",
        path: "activities.openField",
      },
    ],
  },
  {
    id: "trails",
    label: "Trails",
    filters: [
      { id: "walking-path", label: "Walking Path", path: "trails.walkingPath" },
      {
        id: "paved-walking-path",
        label: "Paved Walking Path",
        path: "trails.pavedWalkingPath",
      },
      { id: "bike-path", label: "Bike Path", path: "trails.bikePath" },
      { id: "nature-walk", label: "Nature Walk", path: "trails.natureWalk" },
    ],
  },
  {
    id: "amenities",
    label: "Amenities",
    filters: [
      { id: "restrooms", label: "Restrooms", path: "amenities.restrooms" },
      {
        id: "water-fountain",
        label: "Water Fountain",
        path: "amenities.waterFountain",
      },
      {
        id: "picnic-tables",
        label: "Picnic Tables",
        path: "amenities.picnicTables",
      },
      { id: "grills", label: "Grills", path: "amenities.grills" },
      { id: "pavilion", label: "Pavilion", path: "amenities.pavilion" },
      {
        id: "rentable-pavilion",
        label: "Rentable Pavilion",
        path: "amenities.rentablePavilion",
      },
      { id: "shade", label: "Shade", path: "amenities.shade" },
      { id: "parking", label: "Parking", path: "amenities.parking" },
      { id: "camping", label: "Camping", path: "amenities.camping" },
    ],
  },
];

/**
 * Check whether a park satisfies a filter definition
 * by resolving the filter's dotted path (e.g. 'water.splashPad').
 */
export function parkMatchesFilter(
  park: Park,
  filter: FilterDefinition
): boolean {
  const [root, nested] = filter.path.split(".");
  const value: unknown =
    nested === undefined
      ? park[root as "playground"]
      : (park[root as keyof Park] as unknown as Record<string, boolean>)[
          nested
        ];
  return value === true;
}
