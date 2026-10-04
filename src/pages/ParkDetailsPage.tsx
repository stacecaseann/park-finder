import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Park } from "../types/park";
import {
  filterCategories,
  parkMatchesFilter,
  type FilterDefinition,
} from "../data/filterDefinitions";
import { parks } from "../data/parks";

const dogsPolicyLabels: Record<Park["dogs"], string> = {
  allowed: "Dogs allowed",
  "leash-only": "Dogs allowed on leash",
  "not-allowed": "Dogs not allowed",
  unknown: "Dog policy unknown",
};

/** Details-page sections, mapped to centralized filter categories. */
const detailsSections = [
  { title: "Amenities", categoryIds: ["amenities"] },
  { title: "Playground", categoryIds: ["playground"] },
  { title: "Water", categoryIds: ["water"] },
  {
    title: "Trails & Activities",
    categoryIds: ["sports-activities", "trails"],
  },
];

/**
 * Free-text `features[]` entries that duplicate a boolean-derived label
 * (lowercased substring match) are omitted to avoid repetition.
 */
const featureDedupeOverrides = ["inclusive play", "interactive play"];

function normalizeLabel(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function FeatureItem({ label }: { label: string }) {
  return (
    <li>
      <span className="feature-check" aria-hidden="true">
        ✓
      </span>
      {label}
    </li>
  );
}

function ParkDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const park = parks.find((p) => p.id === id);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const photoDialogRef = useRef<HTMLDialogElement>(null);
  const selectedImage =
    selectedImageIndex === null ? null : park?.images[selectedImageIndex] ?? null;

  useEffect(() => {
    if (selectedImage && photoDialogRef.current && !photoDialogRef.current.open) {
      photoDialogRef.current.showModal();
    }
  }, [selectedImage]);

  if (!park) {
    return (
      <section>
        <h1>Park not found</h1>
        <p>We couldn't find that park.</p>
        <Link to="/parks" className="button-link">
          Back to Explore Parks
        </Link>
      </section>
    );
  }

  const directionsUrl =
    park.latitude !== null && park.longitude !== null
      ? `https://www.google.com/maps/dir/?api=1&destination=${park.latitude},${park.longitude}`
      : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
          park.address
        )}`;

  // Resolve each details section to the subset of its categories'
  // filters that are true for this park. Empty sections are dropped.
  const sections = detailsSections
    .map((section) => {
      const features = section.categoryIds.flatMap((categoryId) => {
        const category = filterCategories.find((c) => c.id === categoryId);
        return (category?.filters ?? []).filter((f: FilterDefinition) =>
          parkMatchesFilter(park, f)
        );
      });
      return { ...section, features };
    })
    .filter((section) => section.features.length > 0);

  // Free-text features that don't duplicate a boolean label already shown.
  const shownLabels = new Set(
    sections.flatMap((s) => s.features.map((f) => normalizeLabel(f.label)))
  );
  const extraFeatures = park.features.filter((feature) => {
    const normalized = normalizeLabel(feature);
    return (
      !shownLabels.has(normalized) &&
      !featureDedupeOverrides.some((o) =>
        normalized.includes(normalizeLabel(o))
      )
    );
  });

  return (
    <article className="park-details">
      <nav aria-label="Breadcrumb" className="park-details-back">
        <Link to="/parks">← Back to Explore Parks</Link>
      </nav>

      {park.mainImage.src ? (
        <img
          className="park-hero-image"
          src={park.mainImage.src}
          alt={park.mainImage.alt}
          fetchPriority="high"
          decoding="async"
        />
      ) : (
        <div
          className="park-hero-image park-hero-placeholder"
          role="img"
          aria-label={park.mainImage.alt}
        >
          <span aria-hidden="true">🌳</span>
        </div>
      )}

      <header className="park-details-header">
        <h1>{park.alternateName ?? park.name}</h1>
        <p className="park-details-location">
          {park.city}, {park.state}
        </p>
        <div className="park-details-actions">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="button-link"
          >
            Get Directions
          </a>
          <a
            href={park.website}
            target="_blank"
            rel="noopener noreferrer"
            className="button-link button-link-secondary"
          >
            Official Website
          </a>
        </div>
      </header>

      <section className="park-details-section">
        <h2>About This Park</h2>
        <p>{park.description}</p>
        <p className="park-details-address">{park.address}</p>
      </section>

      {sections.map((section) => (
        <section key={section.title} className="park-details-section">
          <h2>{section.title}</h2>
          <ul className="feature-list">
            {section.features.map((f) => (
              <FeatureItem key={f.id} label={f.label} />
            ))}
            {section.categoryIds.includes("amenities") && (
              <FeatureItem label={dogsPolicyLabels[park.dogs]} />
            )}
          </ul>
        </section>
      ))}

      {extraFeatures.length > 0 && (
        <section className="park-details-section">
          <h2>More Features</h2>
          <ul className="feature-list">
            {extraFeatures.map((feature) => (
              <FeatureItem key={feature} label={feature} />
            ))}
          </ul>
        </section>
      )}

      {park.notices && park.notices.length > 0 && (
        <section
          className="park-details-section park-notices"
          aria-label="Current notices"
        >
          <h2>Current Notices</h2>
          <ul className="park-notes">
            {park.notices.map((notice, i) => (
              <li key={i}>{notice}</li>
            ))}
          </ul>
        </section>
      )}

      {park.images.length > 0 && (
        <section className="park-details-section">
          <h2>Photos</h2>
          <div className="park-photos">
            {park.images.map((image, i) => (
              <figure key={i}>
                <button
                  type="button"
                  className="park-photo-button"
                  aria-label={`Enlarge ${image.alt}`}
                  onClick={() => setSelectedImageIndex(i)}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </button>
                {image.caption && <figcaption>{image.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </section>
      )}

      <dialog
        ref={photoDialogRef}
        className="photo-viewer"
        aria-label={selectedImage?.caption ?? selectedImage?.alt}
        onClose={() => setSelectedImageIndex(null)}
        onKeyDown={(event) => {
          if (selectedImageIndex === null || park.images.length < 2) return;
          if (event.key === "ArrowRight") {
            event.preventDefault();
            setSelectedImageIndex((selectedImageIndex + 1) % park.images.length);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            setSelectedImageIndex(
              (selectedImageIndex - 1 + park.images.length) % park.images.length
            );
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            event.currentTarget.close();
          }
        }}
      >
        {selectedImage && (
          <>
            <button
              type="button"
              className="photo-viewer-close"
              aria-label="Close enlarged photo"
              onClick={() => photoDialogRef.current?.close()}
            >
              Close ×
            </button>
            {park.images.length > 1 && (
              <>
                <button
                  type="button"
                  className="photo-viewer-nav photo-viewer-previous"
                  aria-label="Previous photo"
                  onClick={() =>
                    setSelectedImageIndex(
                    ((selectedImageIndex ?? 0) - 1 + park.images.length) %
                        park.images.length
                    )
                  }
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="photo-viewer-nav photo-viewer-next"
                  aria-label="Next photo"
                  onClick={() =>
                    setSelectedImageIndex(
                    ((selectedImageIndex ?? 0) + 1) % park.images.length
                    )
                  }
                >
                  ›
                </button>
                <p className="photo-viewer-count" aria-live="polite">
                  {(selectedImageIndex ?? 0) + 1} / {park.images.length}
                </p>
              </>
            )}
            <img
              src={selectedImage.largeSrc ?? selectedImage.src}
              alt={selectedImage.alt}
              decoding="async"
            />
            {selectedImage.caption && (
              <p className="photo-viewer-caption">{selectedImage.caption}</p>
            )}
          </>
        )}
      </dialog>

      {park.notes.length > 0 && (
        <section className="park-details-section">
          <h2>Notes</h2>
          <ul className="park-notes">
            {park.notes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

export default ParkDetailsPage;
