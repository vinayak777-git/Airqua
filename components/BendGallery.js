/**
 * AIRQUA 3D Bend Gallery Component
 * Scroll-driven 3D perspective fold-over gallery.
 * Each tile bends flat at focal center and sinks away into depth at the edges.
 * Inspired by React Bits Pro, engineered in vanilla JS & CSS for zero-latency performance.
 */

export const BEND_GALLERY_TILES = [
  {
    id: "biocore",
    num: "01",
    tag: "BIOLOGICAL CORE",
    title: "Chlorella vulgaris Photobioreactor",
    subtitle: "High-density monoculture vessel engineered for rapid Calvin-cycle carbon fixation, dissolved oxygen release, and continuous biomass accretion.",
    spec: "Photosynthetic Velocity: 92.4% · Cell Density: ~1.2g/L",
    img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200&auto=format&fit=crop",
    color: "#10b981", // emerald
    route: "/technology"
  },
  {
    id: "sensors",
    num: "02",
    tag: "TELEMETRY ARRAY",
    title: "5-Channel Multi-Parameter Sentry",
    subtitle: "NDIR optical CO₂ absorption, galvanic dissolved oxygen, industrial gel-electrolyte pH, and 650nm nephelometric optical turbidity probes.",
    spec: "Sampling Rate: 1 Hz · Multi-Channel Kalman Filtered",
    img: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=1200&auto=format&fit=crop",
    color: "#38bdf8", // cyan
    route: "/technology"
  },
  {
    id: "edge",
    num: "03",
    tag: "EDGE HARDWARE",
    title: "ESP32 Cyber-Physical Edge Gateway",
    subtitle: "Dual-core 240MHz Xtensa processor managing sub-second analog sensor polling, polynomial calibration curves, and encrypted telemetry dispatch.",
    spec: "GPIO Opto-Isolation · MQTT/WebSocket Streaming · Hardware Watchdog",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    color: "#a855f7", // violet
    route: "/technology"
  },
  {
    id: "ai",
    num: "04",
    tag: "AI DIAGNOSTICS",
    title: "Heuristic Anomaly & Monod Kinetics Engine",
    subtitle: "Local edge neural models running multivariate cross-sensor anomaly detection, diurnal drift compensation, and early culture crash prevention.",
    spec: "Inference Engine: Ollama / llama3.2:3b · Anomaly Score: 0.04 (Nominal)",
    img: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1200&auto=format&fit=crop",
    color: "#f59e0b", // amber
    route: "/ai"
  },
  {
    id: "automation",
    num: "05",
    tag: "ACTUATOR SUITE",
    title: "Closed-Loop Closed-Vessel Automation",
    subtitle: "Dynamic micro-bubble spargers for gas mass transfer, magnetic circulation pumps for cell suspension, and PAR spectrum LED illumination.",
    spec: "Autonomous Aeration Duty Cycle · pH Buffer Balancing · Thermal Exhaust",
    img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop",
    color: "#4ade80", // mint
    route: "/dashboard"
  },
  {
    id: "urban",
    num: "06",
    tag: "SCALABLE VISION",
    title: "Urban Architecture & Living Bio-Curtains",
    subtitle: "Modular photobioreactor installations configured for corporate atriums, public transport terminals, educational campuses, and smart eco-cities.",
    spec: "Modular Pod Architecture · Carbon Scavenging: Scalable Biomass Yield",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
    color: "#06b6d4", // light cyan
    route: "/solutions"
  }
];

export function renderBendGallery() {
  return `
    <section class="section section-bend-gallery" id="airqua-bend-gallery">
      <div class="section-container">
        <!-- Section Header -->
        <div class="section-header center">
          <div class="bend-eyebrow-pill">
            <span class="bend-pulse-dot"></span>
            <span>SCROLL-DRIVEN 3D PERSPECTIVE · AIRQUA ARCHITECTURE</span>
          </div>
          <h2 class="section-title">The Living System in 3D Motion</h2>
          <p class="section-desc">
            Scroll down to explore how biological processes, multi-spectral sensing, and edge AI fold together in synchronized harmony. Each subsystem bends flat into focus as you navigate.
          </p>
        </div>

        <!-- 3D Perspective Bend Gallery Column -->
        <div class="bend-gallery-wrapper">
          <div class="bend-gallery-column" id="bend-gallery-column">
            ${BEND_GALLERY_TILES.map(
              (tile, i) => `
              <div class="bend-tile" data-index="${i}" data-color="${tile.color}">
                <div class="bend-tile-inner">
                  <!-- Visual Container -->
                  <div class="bend-tile-media">
                    <img 
                      src="${tile.img}" 
                      alt="${tile.title}" 
                      loading="lazy" 
                      class="bend-tile-img" 
                    />
                    
                    <!-- Ambient Gradients -->
                    <div class="bend-tile-gradient-bottom"></div>
                    <div class="bend-tile-gradient-top"></div>
                    <div class="bend-tile-sheen"></div>

                    <!-- Top Bar Badges -->
                    <div class="bend-tile-header">
                      <div class="bend-num-badge" style="border-color:${tile.color}40; background:${tile.color}15; color:${tile.color}">
                        ${tile.num}
                      </div>
                      <div class="bend-tag-badge">
                        ${tile.tag}
                      </div>
                      <div class="bend-pulse-badge">
                        <span class="pulse-beacon" style="background:${tile.color}; box-shadow:0 0 10px ${tile.color}"></span>
                        <span>ONLINE</span>
                      </div>
                    </div>

                    <!-- Bottom Info Card -->
                    <div class="bend-tile-body">
                      <h3 class="bend-tile-title">${tile.title}</h3>
                      <p class="bend-tile-subtitle">${tile.subtitle}</p>
                      
                      <div class="bend-tile-footer">
                        <span class="bend-spec-text" style="color:${tile.color}">
                          ⚡ ${tile.spec}
                        </span>
                        <a href="${tile.route}" class="bend-explore-btn" data-route="${tile.route}">
                          <span>Inspect</span>
                          <span class="bend-arrow">→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `
            ).join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initBendGallery(container = document) {
  const column = container.querySelector("#bend-gallery-column");
  if (!column) return () => {};

  const tiles = Array.from(column.querySelectorAll(".bend-tile"));
  if (!tiles.length) return () => {};

  let isTicking = false;

  function update3DPositions() {
    const vh = window.innerHeight || 800;
    const vCenter = vh * 0.5;

    tiles.forEach((tile) => {
      const rect = tile.getBoundingClientRect();
      const tileCenter = rect.top + rect.height * 0.5;
      
      // Normalized distance from viewport center: -1.0 (top) to +1.0 (bottom)
      const distance = (tileCenter - vCenter) / (vh * 0.6);
      const clampedDist = Math.max(-1.5, Math.min(1.5, distance));

      // 3D Bending Calculation:
      // When at center (clampedDist = 0): rotateX = 0, z = 0, scale = 1.0, opacity = 1.0
      // When moving to top (clampedDist < 0): folds backward, sinks in Z
      // When moving to bottom (clampedDist > 0): folds upward, sinks in Z
      let rotateX = 0;
      let translateZ = 0;
      let scale = 1;
      let opacity = 1;

      if (clampedDist < 0) {
        // Exiting / moving towards top
        rotateX = Math.min(48, Math.abs(clampedDist) * 42); // tilts back
        translateZ = -Math.abs(clampedDist) * 260; // sinks into depth
        scale = Math.max(0.82, 1 - Math.abs(clampedDist) * 0.16);
        opacity = Math.max(0.15, 1 - Math.pow(Math.abs(clampedDist), 1.6) * 0.85);
      } else {
        // Entering / moving from bottom
        rotateX = -Math.min(42, clampedDist * 36); // tilts up from bottom
        translateZ = -clampedDist * 200;
        scale = Math.max(0.85, 1 - clampedDist * 0.14);
        opacity = Math.max(0.2, 1 - Math.pow(clampedDist, 1.5) * 0.8);
      }

      // Apply 3D transform with hardware acceleration
      const inner = tile.querySelector(".bend-tile-inner");
      if (inner) {
        inner.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) translateZ(${translateZ.toFixed(1)}px) scale(${scale.toFixed(3)})`;
        inner.style.opacity = opacity.toFixed(3);
      }
    });

    isTicking = false;
  }

  function onScroll() {
    if (!isTicking) {
      window.requestAnimationFrame(update3DPositions);
      isTicking = true;
    }
  }

  // Initial calculation
  window.requestAnimationFrame(update3DPositions);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  // Cleanup handler
  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
  };
}
