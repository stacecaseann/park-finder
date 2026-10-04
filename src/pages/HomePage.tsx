import { useState } from "react";
import { Link } from "react-router-dom";
import ParkCard from "../components/ParkCard";
import { parks } from "../data/parks";

/**
 * Featured parks shown on the home page, by park id.
 * Edit this list to change which parks are featured.
 */
const featuredParkIds = [
  "adventure-heights",
  "north-park",
  "hobble-creek-park",
];

const featuredParks = featuredParkIds
  .map((id) => parks.find((park) => park.id === id))
  .filter((park): park is (typeof parks)[number] => park !== undefined);

const quickExploreLinks = [
  { label: "Playgrounds", icon: "🛝" },
  { label: "Splash Pads", icon: "💦" },
  { label: "Walking & Trails", icon: "🥾" },
  { label: "Sports", icon: "🏀" },
  { label: "Accessible Play", icon: "♿" },
  { label: "Parks with Restrooms", icon: "🚻" },
];

function HomePage() {
  const [heroPark] = useState(() => {
    const parksWithPhotos = parks.filter((park) => park.mainImage.src);
    return parksWithPhotos[Math.floor(Math.random() * parksWithPhotos.length)];
  });

  return (
    <>
      <section className="home-hero">
        <div className="home-hero-content">
          <h1>Find the park that fits your adventure.</h1>
          <p className="home-hero-lead">
            Discover local parks based on the things that matter to you —
            playgrounds, trails, sports, water features, amenities,
            accessibility, and more.
          </p>
          <Link to="/parks" className="button-link home-hero-cta">
            Find a Park <span aria-hidden="true">→</span>
          </Link>
        </div>

        {heroPark && (
          <Link
            to={`/parks/${heroPark.id}`}
            className="home-hero-photo-link"
            aria-label={`Explore ${heroPark.name}`}
          >
            <img
              className="home-hero-image"
              src={heroPark.mainImage.src}
              alt={heroPark.mainImage.alt}
              fetchPriority="high"
              decoding="async"
            />
            <span className="home-hero-photo-label">
              <span>Explore</span>
              <strong>
                {heroPark.name} <span aria-hidden="true">→</span>
              </strong>
            </span>
          </Link>
        )}

        <svg
          className="home-hero-landscape"
          viewBox="0 0 1440 190"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className="home-hill-back"
            d="M0 112 88 40l105 86 123-54 130 82 112-87 147 75 117-56 137 44 108-73 132 83 141-61v111H0Z"
          />
          <path
            className="home-hill-front"
            d="m0 127 151-34 129 54 156-39 157 43 146-31 141 38 165-45 153 42 142-32v67H0Z"
          />
          <path
            className="home-trail"
            d="M300 163c90-66 126 45 220-2s124-55 208-5 110 9 182-38"
          />
          <g className="home-decoration-tree" transform="translate(50 56)">
            <path d="M28 106V56" />
            <path d="M28 0 3 42h14L0 65h56L39 42h14Z" />
          </g>
          <g
            className="home-decoration-tree home-decoration-tree-small"
            transform="translate(129 104) scale(.65)"
          >
            <path d="M28 106V56" />
            <path d="M28 0 3 42h14L0 65h56L39 42h14Z" />
          </g>
          <g
            className="home-decoration-tree"
            transform="translate(645 78) scale(.8)"
          >
            <path d="M28 106V56" />
            <path d="M28 0 3 42h14L0 65h56L39 42h14Z" />
          </g>
        </svg>
      </section>

      {/* Quick explore */}
      <section className="home-section">
        <h2>How do you want to play?</h2>
        <div className="quick-explore-grid">
          {quickExploreLinks.map((link) => (
            <Link key={link.label} to="/parks" className="quick-explore-card">
              <span className="quick-explore-icon" aria-hidden="true">
                {link.icon}
              </span>
              <span className="quick-explore-label">{link.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured parks */}
      <section className="home-section">
        <h2>Featured Parks</h2>
        <div className="park-grid">
          {featuredParks.map((park) => (
            <ParkCard key={park.id} park={park} />
          ))}
        </div>
      </section>

      {/* Why Park Quest */}
      <section className="home-section home-why">
        <h2>Find more than just the closest park.</h2>
        <p>
          Every park offers a different experience. Park Quest helps your family
          find parks based on the features you actually want — whether that's
          playground equipment, walking trails, sports fields, splash pads and
          water features, accessible play, or simple amenities like restrooms
          and shade.
        </p>
      </section>

      {/* Final CTA */}
      <section className="home-section home-final-cta">
        <h2>Ready to explore?</h2>
        <Link to="/parks" className="button-link">
          Explore Parks
        </Link>
      </section>
    </>
  );
}

export default HomePage;
