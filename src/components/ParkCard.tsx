import { Link } from "react-router-dom";
import type { Park } from "../types/park";
import { getParkHighlights } from "../utils/parkHighlights";
import { formatDistanceMiles } from "../utils/distance";
import type { ParkExperienceMatch } from "../data/parkExperiences";

interface ParkCardProps {
  park: Park;
  /** Distance from the user in miles; shown only when provided. */
  distanceMiles?: number;
  experienceMatch?: ParkExperienceMatch;
  compact?: boolean;
}

function ParkCard({
  park,
  distanceMiles,
  experienceMatch,
  compact = false,
}: ParkCardProps) {
  const highlights = getParkHighlights(park);
  const cardClassName = compact
    ? `park-card park-card-compact${experienceMatch ? " park-card-compact-recommended" : ""}`
    : "park-card";

  return (
    <article className={cardClassName}>
      {park.mainImage.src ? (
        <img
          className="park-card-image"
          src={park.mainImage.src}
          alt={park.mainImage.alt}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div
          className="park-card-image park-card-image-placeholder"
          role="img"
          aria-label={park.mainImage.alt}
        >
          <span aria-hidden="true">🌳</span>
        </div>
      )}
      <div className="park-card-body">
        <h2 className="park-card-name">{park.name}</h2>
        <p className="park-card-city">{park.city}</p>
        {distanceMiles !== undefined && (
          <p className="park-card-distance">
            {formatDistanceMiles(distanceMiles)}
          </p>
        )}
        {experienceMatch && (
          <div className="park-card-experience">
            <p className="park-card-match">
              {experienceMatch.quality.label} for{" "}
              {experienceMatch.experienceName}
            </p>
            <p className="park-card-why">Why it matches</p>
            <ul className="park-card-match-reasons">
              {experienceMatch.contributingFeatures
                .slice(0, compact ? 3 : 4)
                .map((feature) => (
                <li key={feature.label}>
                  <span aria-hidden="true">✓</span> {feature.label}
                </li>
                ))}
            </ul>
          </div>
        )}
        {highlights.length > 0 && (
          <ul className="park-card-features">
            {highlights.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
        )}
        <Link
          to={`/parks/${park.id}`}
          className="park-card-link"
          aria-label={`View ${park.name}`}
        >
          View Park
        </Link>
      </div>
    </article>
  );
}

export default ParkCard;
