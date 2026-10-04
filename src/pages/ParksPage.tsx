import { useMemo, useState } from "react";
import FilterPanel from "../components/FilterPanel";
import ParkCard from "../components/ParkCard";
import ParkMap from "../components/ParkMap";
import { parks } from "../data/parks";
import {
  getParkExperienceMatch,
  parkExperiences,
  type ParkExperienceId,
  type ParkExperienceMatch,
} from "../data/parkExperiences";
import { getFilterById, parkMatchesAll } from "../utils/parkFiltering";
import { calculateDistanceMiles } from "../utils/distance";
import { useUserLocation } from "../utils/useUserLocation";

const RADIUS_OPTIONS = [5, 10, 25, 50] as const;

type RadiusSelection = number | "any";

function ParksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilterIds, setSelectedFilterIds] = useState<string[]>([]);
  const [selectedExperienceId, setSelectedExperienceId] =
    useState<ParkExperienceId | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [view, setView] = useState<"list" | "map">("list");
  const { location, status, error, requestLocation, clearLocation } =
    useUserLocation();
  const [radius, setRadius] = useState<RadiusSelection>(10);

  const locationActive = status === "active" && location !== null;
  const selectedExperience = parkExperiences.find(
    (experience) => experience.id === selectedExperienceId
  );

  const matchingParks = useMemo(
    () =>
      parks.filter((park) => {
        if (!parkMatchesAll(park, searchQuery, selectedFilterIds)) return false;
        if (locationActive && radius !== "any") {
          if (park.latitude === null || park.longitude === null) return false;
          const d = calculateDistanceMiles(
            location.latitude,
            location.longitude,
            park.latitude,
            park.longitude
          );
          if (d > radius) return false;
        }
        return true;
      }),
    [searchQuery, selectedFilterIds, locationActive, location, radius]
  );

  // Distance per park, only when location is active.
  const distances = useMemo(() => {
    const map = new Map<string, number>();
    if (locationActive) {
      for (const park of matchingParks) {
        if (park.latitude !== null && park.longitude !== null) {
          map.set(
            park.id,
            calculateDistanceMiles(
              location.latitude,
              location.longitude,
              park.latitude,
              park.longitude
            )
          );
        }
      }
    }
    return map;
  }, [locationActive, location, matchingParks]);

  const experienceMatches = useMemo(() => {
    const matches = new Map<string, ParkExperienceMatch>();
    if (!selectedExperience) return matches;

    for (const park of matchingParks) {
      const match = getParkExperienceMatch(park, selectedExperience);
      if (match) matches.set(park.id, match);
    }
    return matches;
  }, [matchingParks, selectedExperience]);

  // Experience determines rank; distance breaks ties and remains the
  // primary sort only when no experience is selected.
  const displayedParks = useMemo(() => {
    if (selectedExperience) {
      return matchingParks
        .filter((park) => experienceMatches.has(park.id))
        .sort((a, b) => {
          const scoreDifference =
            (experienceMatches.get(b.id)?.totalScore ?? 0) -
            (experienceMatches.get(a.id)?.totalScore ?? 0);
          if (scoreDifference !== 0) return scoreDifference;
          if (!locationActive) return 0;
          return (
            (distances.get(a.id) ?? Number.MAX_VALUE) -
            (distances.get(b.id) ?? Number.MAX_VALUE)
          );
        });
    }
    if (!locationActive) return matchingParks;
    return [...matchingParks].sort(
      (a, b) =>
        (distances.get(a.id) ?? Number.MAX_VALUE) -
        (distances.get(b.id) ?? Number.MAX_VALUE)
    );
  }, [
    selectedExperience,
    matchingParks,
    experienceMatches,
    locationActive,
    distances,
  ]);

  const toggleFilter = (id: string) => {
    setSelectedFilterIds((current) =>
      current.includes(id) ? current.filter((f) => f !== id) : [...current, id]
    );
  };

  const clearFilters = () => setSelectedFilterIds([]);

  const parkWord = displayedParks.length === 1 ? "park" : "parks";
  const resultCount = selectedExperience
    ? locationActive && radius !== "any"
      ? `${displayedParks.length} ${parkWord} for ${selectedExperience.name} within ${radius} miles`
      : `${displayedParks.length} ${parkWord} for ${selectedExperience.name}`
    : locationActive
      ? radius === "any"
        ? `${displayedParks.length} ${parkWord} found`
        : `${displayedParks.length} ${parkWord} within ${radius} miles`
      : `${displayedParks.length} ${parkWord} found`;

  return (
    <section>
      <h1>Explore Parks</h1>
      <p className="page-lead">
        Find a park that fits your family's next adventure.
      </p>

      <section
        className="experience-discovery"
        aria-labelledby="experience-title"
      >
        <div className="experience-heading">
          <div>
            <p className="experience-kicker">Find by Experience</p>
            <h2 id="experience-title">
              What kind of park day are you looking for?
            </h2>
            <p>
              Choose an outing to rank parks by fit, then filter for features
              every result must have.
            </p>
          </div>
          {selectedExperience && (
            <button
              type="button"
              className="experience-clear"
              onClick={() => setSelectedExperienceId(null)}
            >
              Clear experience
            </button>
          )}
        </div>
        <div className="experience-grid">
          {parkExperiences.map((experience) => (
            <button
              className={
                selectedExperienceId === experience.id
                  ? "experience-card selected"
                  : "experience-card"
              }
              type="button"
              key={experience.id}
              aria-pressed={selectedExperienceId === experience.id}
              onClick={() =>
                setSelectedExperienceId((current) =>
                  current === experience.id ? null : experience.id
                )
              }
            >
              <span className="experience-icon" aria-hidden="true">
                {experience.icon}
              </span>
              <span className="experience-name">{experience.name}</span>
              <span className="experience-description">
                {experience.description}
              </span>
            </button>
          ))}
        </div>
      </section>

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

      <div className="location-controls">
        {!locationActive ? (
          <button
            type="button"
            className="location-button"
            onClick={requestLocation}
            disabled={status === "loading"}
          >
            {status === "loading"
              ? "Finding your location..."
              : "Use My Location"}
          </button>
        ) : (
          <>
            <span className="location-status" role="status">
              <span aria-hidden="true">📍</span> Location on
            </span>
            <label htmlFor="radius-select" className="radius-label">
              Within
            </label>
            <select
              id="radius-select"
              className="radius-select"
              value={radius === "any" ? "any" : String(radius)}
              onChange={(e) =>
                setRadius(
                  e.target.value === "any" ? "any" : Number(e.target.value)
                )
              }
            >
              {RADIUS_OPTIONS.map((miles) => (
                <option key={miles} value={miles}>
                  {miles} miles
                </option>
              ))}
              <option value="any">Any distance</option>
            </select>
            <button
              type="button"
              className="clear-location"
              onClick={clearLocation}
            >
              Clear location
            </button>
          </>
        )}
        {status === "error" && error && (
          <p className="location-error" role="alert">
            {error}
          </p>
        )}
      </div>

      <button
        type="button"
        className="filters-toggle"
        aria-expanded={mobileFiltersOpen}
        aria-controls="mobile-filter-panel"
        onClick={() => setMobileFiltersOpen((open) => !open)}
      >
        Filter by Features
        {selectedFilterIds.length > 0 && (
          <span className="filters-toggle-count">
            ({selectedFilterIds.length})
          </span>
        )}
      </button>

      {mobileFiltersOpen && (
        <div id="mobile-filter-panel" className="mobile-filter-panel">
          <p className="filter-mode-label">Filter by Features</p>
          <div className="must-have-intro">
            <h2>Any must-haves?</h2>
            <p>Choose features that every result must have.</p>
          </div>
          <FilterPanel
            selectedFilterIds={selectedFilterIds}
            onToggle={toggleFilter}
          />
        </div>
      )}

      <div className="parks-layout">
        <aside className="parks-sidebar" aria-label="Park filters">
          <p className="filter-mode-label">Filter by Features</p>
          <div className="must-have-intro">
            <h2>Any must-haves?</h2>
            <p>Choose features that every result must have.</p>
          </div>
          <FilterPanel
            selectedFilterIds={selectedFilterIds}
            onToggle={toggleFilter}
          />
        </aside>

        <div className="parks-results">
          <div className="results-header">
            <p className="results-count" role="status">
              {resultCount}
            </p>
            <div className="view-toggle" role="group" aria-label="View">
              <button
                type="button"
                className={
                  view === "list" ? "view-toggle-btn active" : "view-toggle-btn"
                }
                aria-pressed={view === "list"}
                onClick={() => setView("list")}
              >
                List
              </button>
              <button
                type="button"
                className={
                  view === "map" ? "view-toggle-btn active" : "view-toggle-btn"
                }
                aria-pressed={view === "map"}
                onClick={() => setView("map")}
              >
                Map
              </button>
            </div>
          </div>

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
              <button
                type="button"
                className="clear-filters"
                onClick={clearFilters}
              >
                Clear all
              </button>
            </div>
          )}

          {displayedParks.length > 0 ? (
            view === "list" ? (
              <div className="park-grid">
                {displayedParks.map((park) => (
                  <ParkCard
                    key={park.id}
                    park={park}
                    distanceMiles={distances.get(park.id)}
                    experienceMatch={experienceMatches.get(park.id)}
                  />
                ))}
              </div>
            ) : (
              <ParkMap
                parks={displayedParks}
                userLocation={locationActive ? location : null}
                experienceMatches={experienceMatches}
              />
            )
          ) : (
            <div className="no-results">
              <p>
                {selectedExperience
                  ? `No parks have verified matches for ${selectedExperience.name} with these search and must-have filters.`
                  : "No parks match those filters."}
              </p>
              {selectedExperience ? (
                <button
                  type="button"
                  className="clear-filters"
                  onClick={() => setSelectedExperienceId(null)}
                >
                  Clear experience
                </button>
              ) : selectedFilterIds.length > 0 ? (
                <button
                  type="button"
                  className="clear-filters"
                  onClick={clearFilters}
                >
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
