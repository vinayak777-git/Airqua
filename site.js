/**
 * AIRQUA Master Application Controller & Client-Side SPA Router
 * Coordinates page lifecycle, navbar state, telemetry polling, and smooth routing.
 */

import { renderNavbar, initNavbarEvents } from "./components/Navbar.js";
import { renderFooter } from "./components/Footer.js";

import { renderHomePage, initHomePageEvents } from "./pages/HomePage.js";
import { renderTechnologyPage, initTechnologyPageEvents } from "./pages/TechnologyPage.js";
import { renderSolutionsPage } from "./pages/SolutionsPage.js";
import { renderDashboardPage, initDashboardPageEvents } from "./pages/DashboardPage.js";
import { renderAIPage, initAIPageEvents } from "./pages/AIPage.js";
import { renderResearchPage } from "./pages/ResearchPage.js";
import { renderAboutPage } from "./pages/AboutPage.js";
import { renderContactPage, initContactPageEvents } from "./pages/ContactPage.js";

const PAGE_METADATA = {
  "/": {
    title: "AIRQUA — AI × ALGAE × IoT | Intelligent Environmental Systems",
    description: "AIRQUA combines microalgae photobioreactors, multi-parameter sensing, embedded IoT, and AI automation to monitor and optimize environmental conditions."
  },
  "/technology": {
    title: "Technology & Specs — AIRQUA Environmental Bioreactors",
    description: "Technical specifications of the Chlorella vulgaris biological core, 5-sensor probe array, ESP32 IoT controller, and AI closed-loop actuation."
  },
  "/solutions": {
    title: "Potential Applications — AIRQUA Scalability & Use Cases",
    description: "Prospective environmental applications: indoor atriums, malls, educational campuses, research facilities, and industrial monitoring."
  },
  "/dashboard": {
    title: "Command Center — AIRQUA Live Telemetry & Actuation",
    description: "Real-time command center monitoring CO2, Dissolved Oxygen, pH, Temperature, and Turbidity with closed-loop actuator relays and AI diagnostics."
  },
  "/ai": {
    title: "AI Diagnostic Engine & Advisory Console — AIRQUA",
    description: "Disciplined environmental machine learning: real-time monitoring, anomaly detection, time-series prediction, and interactive AI assistant."
  },
  "/research": {
    title: "Scientific Research & Experiments — AIRQUA Labs",
    description: "Transparent R&D documentation: Chlorella vulgaris kinetics, multi-sensor calibration, active benchtop experiments 001–003, and future roadmaps."
  },
  "/about": {
    title: "About AIRQUA — Biology, Sensors, IoT, and AI",
    description: "Why AIRQUA exists: the origin, problem, technological foundations, scalable vision, and the Sense-Understand-Predict-Act-Learn cycle."
  },
  "/contact": {
    title: "Contact & Collaboration — AIRQUA Environmental Tech",
    description: "Connect with the AIRQUA research team for academic collaboration, hardware inquiry, and biological telemetry datasets."
  }
};

class AppRouter {
  constructor() {
    this.currentCleanup = null;
    this.init();
  }

  init() {
    // Initial mount of persistent shell
    this.renderShell();

    // Listen to browser history changes
    window.addEventListener("popstate", () => this.handleRoute(this.getCurrentPath()));
    window.addEventListener("hashchange", () => this.handleRoute(this.getCurrentPath()));

    // Initial navigation
    this.handleRoute(this.getCurrentPath());

    // Global listener for data-route links inside pages
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a[data-route]");
      if (link) {
        e.preventDefault();
        const route = link.getAttribute("data-route");
        this.navigate(route);
      }
    });
  }

  getCurrentPath() {
    // Support hash routing (for file:// protocol or static previews) as well as pushState
    if (window.location.hash && window.location.hash.startsWith("#/")) {
      return window.location.hash.slice(1);
    }
    const path = window.location.pathname;
    return path === "" ? "/" : path;
  }

  navigate(route) {
    if (this.getCurrentPath() === route) return;

    if (window.location.protocol === "file:") {
      window.location.hash = route;
    } else {
      window.history.pushState({}, "", route);
      this.handleRoute(route);
    }
  }

  renderShell() {
    const headerMount = document.getElementById("header-mount");
    const footerMount = document.getElementById("footer-mount");

    if (headerMount) {
      headerMount.innerHTML = renderNavbar(this.getCurrentPath());
      initNavbarEvents((route) => this.navigate(route));
    }

    if (footerMount) {
      footerMount.innerHTML = renderFooter();
    }
  }

  updateNavbarActiveState(route) {
    const header = document.querySelector(".airqua-header");
    if (!header) return;

    header.querySelectorAll(".nav-link").forEach((link) => {
      const linkRoute = link.getAttribute("data-route");
      if (linkRoute === route) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  handleRoute(path) {
    const normalized = path === "" || path === "/index.html" ? "/" : path;

    // Execute cleanup of previous page if exists
    if (typeof this.currentCleanup === "function") {
      try {
        this.currentCleanup();
      } catch (err) {
        console.error("[AIRQUA Router] Error cleaning up previous page:", err);
      }
      this.currentCleanup = null;
    }

    // Update metadata
    const meta = PAGE_METADATA[normalized] || PAGE_METADATA["/"];
    document.title = meta.title;
    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) descTag.setAttribute("content", meta.description);

    this.updateNavbarActiveState(normalized);

    const mainContainer = document.getElementById("page-content");
    if (!mainContainer) return;

    window.scrollTo({ top: 0, behavior: "smooth" });

    // Render target page
    switch (normalized) {
      case "/":
        mainContainer.innerHTML = renderHomePage();
        this.currentCleanup = initHomePageEvents();
        break;

      case "/technology":
        mainContainer.innerHTML = renderTechnologyPage();
        initTechnologyPageEvents();
        break;

      case "/solutions":
        mainContainer.innerHTML = renderSolutionsPage();
        break;

      case "/dashboard":
        mainContainer.innerHTML = renderDashboardPage();
        this.currentCleanup = initDashboardPageEvents();
        break;

      case "/ai":
        mainContainer.innerHTML = renderAIPage();
        initAIPageEvents();
        break;

      case "/research":
        mainContainer.innerHTML = renderResearchPage();
        break;

      case "/about":
        mainContainer.innerHTML = renderAboutPage();
        break;

      case "/contact":
        mainContainer.innerHTML = renderContactPage();
        initContactPageEvents();
        break;

      default:
        // Default to Home
        mainContainer.innerHTML = renderHomePage();
        this.currentCleanup = initHomePageEvents();
        break;
    }
  }
}

// Boot application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new AppRouter();
});
