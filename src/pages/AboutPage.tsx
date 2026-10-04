import { Link } from "react-router-dom";

const parkFeatures = [
  {
    title: "Play",
    icon: "🛝",
    items: ["Playgrounds", "Swings and slides", "Climbing structures", "Splash pads"],
  },
  {
    title: "Move",
    icon: "🥾",
    items: ["Walking paths", "Bike paths", "Basketball", "Soccer and other sports"],
  },
  {
    title: "Enjoy",
    icon: "🌳",
    items: ["Shade and grass", "Ponds and nature areas", "Scenic spaces"],
  },
  {
    title: "Plan",
    icon: "🧺",
    items: ["Restrooms", "Pavilions", "Picnic tables and grills", "Parking"],
  },
];

function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-intro" aria-labelledby="about-title">
        <p className="about-eyebrow">A better day at the park starts here</p>
        <h1 id="about-title">About Park Quest</h1>
        <p className="about-intro-heading">Find the park that fits your day.</p>
        <p className="about-intro-copy">
          Find local parks by what you actually want to do—not just what’s
          closest. Compare playgrounds, baby swings, splash pads, walking paths,
          sports facilities, accessible play equipment, shade, and pavilions to
          find a spot that suits your plans.
        </p>
      </section>

      <section className="about-why" aria-labelledby="about-why-title">
        <div className="about-section-mark" aria-hidden="true">
          <span>✳</span>
        </div>
        <div>
          <h2 id="about-why-title">Why Park Quest?</h2>
          <p>
            Choosing a park isn’t always as simple as finding the closest one.
            Parks offer different experiences, and details about playgrounds,
            trails, sports, accessibility, and amenities can be hard to find in
            one place.
          </p>
          <p>
            We visit local parks, take photos, and document their features so
            families can compare options and choose a park that fits their day.
          </p>
        </div>
      </section>

      <section className="about-find" aria-labelledby="about-find-title">
        <div className="about-section-heading">
          <p className="about-eyebrow">Make the day your own</p>
          <h2 id="about-find-title">What you can find</h2>
        </div>
        <div className="about-feature-grid">
          {parkFeatures.map((category) => (
            <article className="about-feature-card" key={category.title}>
              <span className="about-feature-icon" aria-hidden="true">
                {category.icon}
              </span>
              <h3>{category.title}</h3>
              <ul>
                {category.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section
        className="about-information"
        aria-labelledby="about-information-title"
      >
        <h2 id="about-information-title">How Park Information Is Collected</h2>
        <p>
          Park details come from firsthand visits and official park information
          when available. Amenities and conditions can change, so check the
          official park website when planning around a specific feature.
        </p>
      </section>

      <section className="about-cta" aria-labelledby="about-cta-title">
        <div>
          <p className="about-eyebrow">Your next outing awaits</p>
          <h2 id="about-cta-title">Ready to find your park?</h2>
          <p>Explore local parks and find the features that matter to you.</p>
        </div>
        <Link to="/parks" className="button-link about-cta-button">
          Explore Parks <span aria-hidden="true">→</span>
        </Link>
      </section>
    </div>
  );
}

export default AboutPage;
