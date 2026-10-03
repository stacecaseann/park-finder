import { useMemo, useState } from "react";
import FilterPanel from "../components/FilterPanel";
import ParkCard from "../components/ParkCard";
import { parks } from "../data/parks";
import { getFilterById, parkMatchesAll } from "../utils/parkFiltering";

function ParksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilterIds, setSelectedFilterIds] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const matchingParks = useMemo(
    () => parks.filter((park) => parkMatchesAll(park, searchQuery, selectedFilterIds)),
    [searchQuery, selectedFilterIds]
  );

  const toggleFilter = (id: string) => {
    setSelectedFilterIds((current) =>
      current.includes(id) ? current.filter((f) => f !== id) : [...current, id]
    );
  };

  const clearFilters = () => setSelectedFilterIds([]);

  const resultCount = `${matchingParks.length} ${
    matchingParks.length === 1 ? "park" : "parks"
  } found`;

  return (
    <section>
      <h1>Explore Parks</h1>
      <p className="page-lead">Find a park that fits your family's next adventure.</p>

      <div className="parks-search">
        <label htmlFor="park-search" className="visually-hidden">
          Search parks by name or city
        </label>
        <input
          id="park-search"
          type="search"
          placeholder="Search parks by name or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <button
        type="button"
        className="filters-toggle"
        aria-expanded={mobileFiltersOpen}
        aria-controls="mobile-filter-panel"
        onClick={() => setMobileFiltersOpen((open) => !open)}
      >
        Filters
        {selectedFilterIds.length > 0 && (
          <span className="filters-toggle-count">({selectedFilterIds.length})</span>
        )}
      </button>

      {mobileFiltersOpen && (
        <div id="mobile-filter-panel" className="mobile-filter-panel">
          <FilterPanel selectedFilterIds={selectedFilterIds} onToggle={toggleFilter} />
        </div>
      )}

      <div className="parks-layout">
        <aside className="parks-sidebar" aria-label="Park filters">
          <FilterPanel selectedFilterIds={selectedFilterIds} onToggle={toggleFilter} />
        </aside>

        <div className="parks-results">
          <p className="results-count" role="status">
            {resultCount}
          </p>

          {selectedFilterIds.length > 0 && (
            <div className="active-filters">
              <ul className="active-filter-chips">
                {selectedFilterIds.map((id) => {
                  const filter = getFilterById(id);
                  if (!filter) return null;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        className="filter-chip"
                        aria-label={`Remove filter ${filter.label}`}
                        onClick={() => toggleFilter(id)}
                      >
                        {filter.label}
                        <span aria-hidden="true"> ×</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <button type="button" className="clear-filters" onClick={clearFilters}>
                Clear all
              </button>
            </div>
          )}

          {matchingParks.length > 0 ? (
            <div className="park-grid">
              {matchingParks.map((park) => (
                <ParkCard key={park.id} park={park} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No parks match those filters.</p>
              {selectedFilterIds.length > 0 ? (
                <button type="button" className="clear-filters" onClick={clearFilters}>
                  Clear filters
                </button>
              ) : (
                <button
                  type="button"
                  className="clear-filters"
                  onClick={() => setSearchQuery("")}
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ParksPage;
