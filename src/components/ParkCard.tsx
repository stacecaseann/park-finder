import { Link } from "react-router-dom";
import type { Park } from "../types/park";
import { getParkHighlights } from "../utils/parkHighlights";

interface ParkCardProps {
  park: Park;
}

function ParkCard({ park }: ParkCardProps) {
  const highlights = getParkHighlights(park);

  return (
    <article className="park-card">
      {park.mainImage.src ? (
        <img
          className="park-card-image"
          src={park.mainImage.src}
          alt={park.mainImage.alt}
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
