import type { Park } from "../types/park";
import {
  filterCategories,
  parkMatchesFilter,
  type FilterDefinition,
} from "../data/filterDefinitions";

const allFilters: FilterDefinition[] = filterCategories.flatMap(
  (category) => category.filters
);

/**
 * Filter ids that make good card highlights, in priority order.
 * Sourced from the centralized filter definitions — no labels or
 * property paths are duplicated here.
 */
const highlightPriorityIds = [
  "splash-pad",
  "inclusive-play",
  "has-playground",
  "accessible-swings",
  "baby-swings",
  "zipline",
  "paved-walking-path",
  "walking-path",
  "bike-path",
  "nature-walk",
  "creek",
  "basketball",
  "soccer",
  "baseball",
  "pickleball",
  "futsal",
  "volleyball",
  "fitness-area",
  "open-field",
  "restrooms",
  "pavilion",
  "grills",
  "picnic-tables",
  "camping",
  "shade",
  "parking",
];

const highlightFilters: FilterDefinition[] = highlightPriorityIds
  .map((id) => allFilters.find((filter) => filter.id === id))
  .filter((filter): filter is FilterDefinition => filter !== undefined);

/**
 * Pick a small set of useful, true-for-this-park feature labels
 * for display on a ParkCard. Dog policy is included when known.
 */
export function getParkHighlights(park: Park, max = 5): string[] {
  const labels: string[] = [];

  for (const filter of highlightFilters) {
    if (labels.length >= max) break;
    if (parkMatchesFilter(park, filter)) {
      labels.push(filter.label);
    }
  }

  if (labels.length < max) {
    if (park.dogs === "allowed") {
      labels.push("Dog Friendly");
    } else if (park.dogs === "leash-only") {
      labels.push("Dogs on Leash");
    }
  }

  return labels;
}
