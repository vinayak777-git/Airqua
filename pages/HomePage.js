/**
 * AIRQUA Home Page
 * Hero, Problem, What is AIRQUA, How It Works, Technology Cards, Vision, and Call to Action.
 */

import { renderFlowDiagram } from "../components/FlowDiagram.js";
import { ReactorVisualizer } from "../components/ReactorVisualizer.js";
import { renderBendGallery, initBendGallery } from "../components/BendGallery.js";

export function renderHomePage() {
  return `
    <div class="page-home">
      <!-- HERO SECTION -->
      <section class="hero-section">
        <div class="hero-canvas-container" id="hero-canvas-wrap">
          <canvas id="hero-reactor-canvas" class="hero-reactor-canvas"></canvas>
        </div>

        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-icon">🌿</span>
            <span>AI × ALGAE × IoT</span>
            <span class="badge-sep">·</span>
            <span class="badge-sub">Chlorella vulgaris Prototype</span>
          </div>

          <h1 class="hero-title">
            <span class="title-accent">INTELLIGENT</span><br/>
            ENVIRONMENTAL SYSTEMS
          </h1>

          <p class="hero-supporting-text">
            AIRQUA combines algae-based biological systems, real-time sensing, IoT and AI to monitor and optimize environmental conditions.
          </p>

          <div class="hero-cta-group">
            <a href="/technology" class="btn-primary" data-route="/technology">
              <span>Explore AIRQUA</span>
              <span class="btn-arrow" aria-hidden="true">→</span>
            </a>
            <a href="/dashboard" class="btn-secondary" data-route="/dashboard">
              <span class="live-dot-mini"></span>
              <span>Launch Dashboard</span>
            </a>
          </div>

          <!-- Hero Metrics Strip -->
          <div class="hero-specs-strip">
            <div class="spec-item">
              <span class="spec-label">BIOLOGICAL AGENT</span>
              <span class="spec-val">Chlorella vulgaris</span>
            </div>
            <div class="spec-item-divider"></div>
            <div class="spec-item">
              <span class="spec-label">CORE TELEMETRY</span>
              <span class="spec-val">5 Sensors (CO₂, DO, pH, Temp, Turbidity)</span>
            </div>
            <div class="spec-item-divider"></div>
            <div class="spec-item">
              <span class="spec-label">EDGE CONTROLLER</span>
              <span class="spec-val">ESP32 240MHz MCU</span>
            </div>
            <div class="spec-item-divider"></div>
            <div class="spec-item">
              <span class="spec-label">SYSTEM CYCLE</span>
              <span class="spec-val">Closed-Loop AI Actuation</span>
            </div>
          </div>
        </div>
      </section>

      <!-- PROBLEM SECTION -->
      <section class="section section-problem">
        <div class="section-container">
          <div class="section-header center">
            <span class="section-eyebrow">— THE CHALLENGE</span>
            <h2 class="section-title">The Environmental Friction</h2>
            <p class="section-desc">
              Urban centers and industrial ecosystems face mounting environmental burdens that conventional, energy-intensive infrastructure struggles to balance efficiently.
            </p>
          </div>

          <div class="problem-grid">
            <div class="problem-card">
              <div class="problem-icon">🌫️</div>
              <h3 class="problem-title">Air Quality Degradation</h3>
              <p class="problem-text">
                Particulate emissions, volatile organic compounds, and localized carbon dioxide accumulation in indoor and dense urban spaces diminish human health and cognitive vitality.
              </p>
            </div>

            <div class="problem-card">
              <div class="problem-icon">💧</div>
              <h3 class="problem-title">Water Nutrient Surges</h3>
              <p class="problem-text">
                Industrial discharge and nutrient-dense runoff overburden municipal water bodies with unabsorbed nitrates and phosphates, causing severe eutrophication.
              </p>
            </div>

            <div class="problem-card">
              <div class="problem-icon">🌬️</div>
              <h3 class="problem-title">Carbon Dioxide Elevation</h3>
              <p class="problem-text">
                Enclosed work environments and transit hubs continuously accumulate localized CO₂ spikes above 1,000 ppm, impairing focus, sleep, and metabolic recovery.
              </p>
            </div>

            <div class="problem-card">
              <div class="problem-icon">📉</div>
              <h3 class="problem-title">Static Monitoring Gaps</h3>
              <p class="problem-text">
                Traditional environmental sensors only collect passive historical logs. They lack real-time biological remediation coupling and closed-loop automated response.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- WHAT IS AIRQUA SECTION -->
      <section class="section section-what">
        <div class="section-container">
          <div class="what-layout">
            <div class="what-content">
              <span class="section-eyebrow">— THE PARADIGM</span>
              <h2 class="section-title">What is AIRQUA?</h2>
              <p class="what-lead">
                AIRQUA is not simply an algae culture vessel or an isolated IoT gadget. It is an integrated environmental cyber-physical system where biology and silicon work in synchronized equilibrium.
              </p>

              <div class="formula-block">
                <div class="formula-pill">Algae</div>
                <span class="formula-op">+</span>
                <div class="formula-pill">Sensors</div>
                <span class="formula-op">+</span>
                <div class="formula-pill">IoT</div>
                <span class="formula-op">+</span>
                <div class="formula-pill">AI</div>
                <span class="formula-op">+</span>
                <div class="formula-pill">Automation</div>
                <span class="formula-eq">=</span>
                <div class="formula-pill result">Intelligent Environmental System</div>
              </div>

              <p class="what-details">
                By housing specialized microalgae—specifically <em>Chlorella vulgaris</em>—in an automated photobioreactor equipped with precision optical probes, an ESP32 edge processor, and an AI diagnostic layer, AIRQUA continuously senses, interprets, and responds to environmental changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- HOW AIRQUA WORKS SECTION -->
      <section class="section section-workflow">
        <div class="section-container">
          <div class="section-header center">
            <span class="section-eyebrow">— OPERATIONAL WORKFLOW</span>
            <h2 class="section-title">How AIRQUA Works</h2>
            <p class="section-desc">
              A continuous, automated feedback loop bridging living photosynthetic organisms with real-time digital intelligence.
            </p>
          </div>

          ${renderFlowDiagram("simple")}
        </div>
      </section>

      <!-- 3D BEND GALLERY: SCROLL-DRIVEN ARCHITECTURE -->
      ${renderBendGallery()}

      <!-- TECHNOLOGY CARDS SECTION -->
      <section class="section section-tech-cards">
        <div class="section-container">
          <div class="section-header">
            <span class="section-eyebrow">— CORE PILLARS</span>
            <h2 class="section-title">The Five Technological Pillars</h2>
            <p class="section-desc">
              Each discipline operates in precise coordination to maintain biological vitality and actionable environmental impact.
            </p>
          </div>

          <div class="five-pillars-grid">
            <!-- 1. Biology -->
            <div class="pillar-card">
              <div class="pillar-num">01</div>
              <div class="pillar-icon">🦠</div>
              <h3 class="pillar-title">Biology</h3>
              <div class="pillar-tag">Chlorella vulgaris Core</div>
              <p class="pillar-text">
                Robust unicellular green microalga possessing exceptional photosynthetic efficiency, rapid cell division, and natural resilience across diverse ambient temperature envelopes.
              </p>
              <ul class="pillar-list">
                <li>Carbon fixation via Calvin cycle</li>
                <li>Dissolved O₂ release</li>
                <li>Nitrate & phosphate bioremediation</li>
              </ul>
            </div>

            <!-- 2. Sensors -->
            <div class="pillar-card">
              <div class="pillar-num">02</div>
              <div class="pillar-icon">📊</div>
              <h3 class="pillar-title">Sensors</h3>
              <div class="pillar-tag">5-Channel Array</div>
              <p class="pillar-text">
                Galvanic and optical telemetry instrumentation providing high-fidelity readings of dissolved gases, acidity, optical density, and thermal state.
              </p>
              <ul class="pillar-list">
                <li>NDIR CO₂ gas probe</li>
                <li>Galvanic Dissolved Oxygen sensor</li>
                <li>Analog pH & 650nm optical turbidity</li>
              </ul>
            </div>

            <!-- 3. IoT -->
            <div class="pillar-card">
              <div class="pillar-num">03</div>
              <div class="pillar-icon">🔌</div>
              <h3 class="pillar-title">IoT & Embedded</h3>
              <div class="pillar-tag">ESP32 Edge Microcontroller</div>
              <p class="pillar-text">
                Dual-core 240MHz hardware running local ADC calibration polynomials, encrypted MQTT / WebSocket packet dispatch, and failsafe watchdog timers.
              </p>
              <ul class="pillar-list">
                <li>Sub-second sampling frequency</li>
                <li>Local offline ring-buffering</li>
                <li>Low-latency telemetry streaming</li>
              </ul>
            </div>

            <!-- 4. Artificial Intelligence -->
            <div class="pillar-card">
              <div class="pillar-num">04</div>
              <div class="pillar-icon">🤖</div>
              <h3 class="pillar-title">Artificial Intelligence</h3>
              <div class="pillar-tag">Reasoning & Anomaly Detection</div>
              <p class="pillar-text">
                Machine learning models trained to correlate multi-sensor drift, detect photoperiod anomalies, predict culture crashes, and recommend optimal actuation thresholds.
              </p>
              <ul class="pillar-list">
                <li>Multivariate anomaly detection</li>
                <li>Photosynthetic rate prediction</li>
                <li>Rigid empirical guardrails</li>
              </ul>
            </div>

            <!-- 5. Automation -->
            <div class="pillar-card">
              <div class="pillar-num">05</div>
              <div class="pillar-icon">⚙️</div>
              <h3 class="pillar-title">Automation</h3>
              <div class="pillar-tag">Closed-Loop Actuators</div>
              <p class="pillar-text">
                Optically-isolated relay hardware orchestrating micro-porous aeration spargers, peristaltic nutrient dosing, cooling fans, and Photosynthetically Active Radiation (PAR) LEDs.
              </p>
              <ul class="pillar-list">
                <li>Dynamic micro-bubble sparging</li>
                <li>Submersible medium circulation</li>
                <li>Automated day/night lighting cycles</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- VISION SECTION -->
      <section class="section section-vision">
        <div class="section-container">
          <div class="vision-card">
            <div class="vision-content">
              <span class="section-eyebrow">— LONG-TERM VISION</span>
              <h2 class="vision-title">Autonomous Environmental Infrastructure for Tomorrow's Cities</h2>
              <p class="vision-text">
                AIRQUA is driven by the conviction that future human habitats cannot rely solely on mechanical carbon scrubbing or static air filters. By embedding resilient photosynthetic biology inside intelligent, self-regulating cyber-physical enclosures, we aim to deploy modular living bioreactors across corporate towers, public atriums, universities, and industrial sites.
              </p>
              <div class="vision-quote">
                "Our goal is not merely to culture algae, but to build biological systems that understand their own conditions and self-optimize in real-time."
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CALL TO ACTION SECTION -->
      <section class="section section-cta">
        <div class="section-container center">
          <span class="section-eyebrow">— READY TO EXPLORE</span>
          <h2 class="cta-heading">Experience the Technology in Action</h2>
          <p class="cta-sub">
            Review detailed engineering architecture or monitor live simulated photobioreactor telemetry in the command center.
          </p>
          <div class="cta-btn-group">
            <a href="/technology" class="btn-primary" data-route="/technology">
              Explore the Technology →
            </a>
            <a href="/dashboard" class="btn-secondary" data-route="/dashboard">
              Launch Dashboard ↗
            </a>
          </div>
        </div>
      </section>
    </div>
  `;
}

export function initHomePageEvents() {
  const cleanups = [];

  const canvas = document.getElementById("hero-reactor-canvas");
  if (canvas) {
    const visualizer = new ReactorVisualizer(canvas);
    cleanups.push(() => visualizer.stop());
  }

  const galleryCleanup = initBendGallery(document);
  if (typeof galleryCleanup === "function") {
    cleanups.push(galleryCleanup);
  }

  return () => {
    cleanups.forEach((fn) => {
      try { fn(); } catch (_) {}
    });
  };
}
