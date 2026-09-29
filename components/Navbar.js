/**
 * AIRQUA Navbar Component
 * Responsive, accessible navigation bar with live status indicator,
 * route awareness, and mobile drawer.
 */

export function renderNavbar(activeRoute = "/") {
  const routes = [
    { path: "/", label: "Home" },
    { path: "/technology", label: "Technology" },
    { path: "/solutions", label: "Solutions" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/ai", label: "AI" },
    { path: "/research", label: "Research" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  const normalized = activeRoute === "" ? "/" : activeRoute;

  const navLinksHtml = routes
    .map((r) => {
      const isActive = normalized === r.path;
      return `<a href="${r.path}" class="nav-link ${isActive ? "active" : ""}" data-route="${r.path}">${r.label}</a>`;
    })
    .join("");

  return `
    <header class="airqua-header" id="airqua-header">
      <div class="header-container">
        <a href="/" class="brand-link" data-route="/" aria-label="AIRQUA Home">
          <div class="brand-mark-wrapper">
            <span class="brand-glyph">⬡</span>
            <span class="brand-pulse"></span>
          </div>
          <div class="brand-titles">
            <span class="brand-title">AIRQUA</span>
            <span class="brand-caption">BIOLOGY × IoT × AI</span>
          </div>
        </a>

        <nav class="desktop-nav" aria-label="Primary navigation">
          ${navLinksHtml}
        </nav>

        <div class="header-right">
          <div class="live-status-pill" title="Telemetry data simulation / stream active">
            <span class="status-dot online"></span>
            <span class="status-text">DEMO LIVE</span>
          </div>
          <a href="/dashboard" class="nav-cta-btn" data-route="/dashboard">
            <span>Launch Dashboard</span>
            <span class="cta-arrow" aria-hidden="true">→</span>
          </a>
          <button class="mobile-toggle-btn" id="mobile-menu-btn" aria-label="Toggle navigation menu" aria-expanded="false">
            <span class="hamburger-bar"></span>
            <span class="hamburger-bar"></span>
            <span class="hamburger-bar"></span>
          </button>
        </div>
      </div>

      <div class="mobile-nav-drawer" id="mobile-nav-drawer" aria-hidden="true">
        <div class="mobile-nav-inner">
          <nav class="mobile-nav-links">
            ${navLinksHtml}
          </nav>
          <div class="mobile-nav-footer">
            <a href="/dashboard" class="mobile-cta-btn" data-route="/dashboard">
              Launch Dashboard →
            </a>
          </div>
        </div>
      </div>
    </header>
  `;
}

export function initNavbarEvents(onNavigate) {
  const header = document.getElementById("airqua-header");
  if (!header) return;

  const toggleBtn = document.getElementById("mobile-menu-btn");
  const drawer = document.getElementById("mobile-nav-drawer");

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener("click", () => {
      const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
      toggleBtn.setAttribute("aria-expanded", String(!isExpanded));
      toggleBtn.classList.toggle("open", !isExpanded);
      drawer.classList.toggle("open", !isExpanded);
      drawer.setAttribute("aria-hidden", String(isExpanded));
    });
  }

  // Intercept navigation clicks
  header.querySelectorAll("[data-route]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetRoute = link.getAttribute("data-route");
      if (drawer && drawer.classList.contains("open")) {
        drawer.classList.remove("open");
        toggleBtn?.classList.remove("open");
        toggleBtn?.setAttribute("aria-expanded", "false");
      }
      if (typeof onNavigate === "function") {
        onNavigate(targetRoute);
      }
    });
  });

  // Sticky header scroll elevation
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }, { passive: true });
}
