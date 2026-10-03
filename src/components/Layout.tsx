import { NavLink, Outlet } from "react-router-dom";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "nav-link nav-link-active" : "nav-link";

function Layout() {
  return (
    <div className="site-layout">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header className="site-header">
        <div className="container site-header-inner">
          <NavLink to="/" className="site-logo">
            Park Quest
          </NavLink>
          <nav className="site-nav" aria-label="Main navigation">
            <ul>
              <li>
                <NavLink to="/" end className={navLinkClass}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/parks" className={navLinkClass}>
                  Explore Parks
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className={navLinkClass}>
                  About
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="main-content" className="site-main">
        <div className="container">
          <Outlet />
        </div>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>
            Park Quest &mdash; helping neighbors discover local green spaces.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
