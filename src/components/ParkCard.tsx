import { Link } from "react-router-dom";
import type { Park } from "../types/park";
import { getParkHighlights } from "../utils/parkHighlights";
import { formatDistanceMiles } from "../utils/distance";

interface ParkCardProps {
  park: Park;
  /** Distance from the user in miles; shown only when provided. */
  distanceMiles?: number;
}

function ParkCard({ park, distanceMiles }: ParkCardProps) {
  const highlights = getParkHighlights(park);

  return (
    <article className="park-card">
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
