import type { Park } from "../types/park";
import {
  filterCategories,
  parkMatchesFilter,
  type FilterDefinition,
} from "../data/filterDefinitions";

const allFilters: FilterDefinition[] = filterCategories.flatMap(
  (category) => category.filters
);

/** Find a filter definition by id, or undefined if it doesn't exist. */
export function getFilterById(id: string): FilterDefinition | undefined {
  return allFilters.find((filter) => filter.id === id);
}

/** Case-insensitive match on park name or city. Empty query matches all. */
export function parkMatchesSearch(park: Park, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q === "") return true;
  return (
    park.name.toLowerCase().includes(q) || park.city.toLowerCase().includes(q)
  );
}

/**
 * A park matches when it passes the search AND every selected filter.
 * Unknown filter ids are ignored.
 */
export function parkMatchesAll(
  park: Park,
  query: string,
  selectedFilterIds: string[]
): boolean {
  if (!parkMatchesSearch(park, query)) return false;

  return selectedFilterIds.every((id) => {
    const filter = getFilterById(id);
    return filter === undefined || parkMatchesFilter(park, filter);
  });
}
