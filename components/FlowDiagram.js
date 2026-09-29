/**
 * AIRQUA Flow Diagram Component
 * Renders the simple workflow and the comprehensive interactive architecture:
 * AIR / WATER INPUT → ALGAE REACTOR → SENSOR LAYER → ESP32 → DATA → AI ENGINE → ANALYSIS → CONTROL → REACTOR
 * Clicking any node reveals detailed technical specifications.
 */

export const ARCHITECTURE_NODES = [
  {
    id: "input",
    step: "01",
    name: "Air / Water Input",
    category: "Intake",
    icon: "🌬️💧",
    summary: "Air stream with elevated CO₂ or water requiring nutrient balancing enters the treatment loop.",
    techDetails: "Filtered air is drawn via variable-speed intake fans. Particulates and dust are pre-filtered to protect microalgal culture integrity before entering gas-transfer spargers.",
    specs: ["Flow Rate: 0.2–1.5 LPM", "Pre-filtration: 5 µm mechanical mesh", "Gas Enrichment: Ambient or flue gas blend"]
  },
  {
    id: "reactor",
    step: "02",
    name: "Algae Reactor",
    category: "Biological Core",
    icon: "🧪🌿",
    summary: "Enclosed photobioreactor containing dense Chlorella vulgaris microalgae culture.",
    techDetails: "Light-driven biological engine utilizing photosystem II to fix dissolved inorganic carbon (DIC) and generate dissolved and gaseous oxygen while accumulating clean algal biomass.",
    specs: ["Species: Chlorella vulgaris", "Vessel: 10 L Borosilicate / Acrylic column", "Illumination: 450nm & 660nm PAR spectrum"]
  },
  {
    id: "sensors",
    step: "03",
    name: "Sensor Layer",
    category: "Telemetry Ingestion",
    icon: "📊⚡",
    summary: "Continuous multi-parameter probe array monitoring primary chemical and physical indices.",
    techDetails: "Submerged and head-space probes take continuous readings of Dissolved Oxygen, pH, Temperature, Optical Turbidity, and ambient CO₂ with galvanic and optical isolation.",
    specs: ["DO Probe: Galvanic Optical (mg/L)", "pH: Analog Glass BNC Electrode", "Temp: Waterproof DS18B20 (1-Wire)", "Turbidity: 650nm Infrared Scattering"]
  },
  {
    id: "esp32",
    step: "04",
    name: "ESP32 / IoT Layer",
    category: "Embedded Processing",
    icon: "🔌📟",
    summary: "Dual-core microcontroller executing analog-to-digital sampling and encrypted telemetry dispatch.",
    techDetails: "Filters raw ADC values, applies calibration polynomials, and dispatches JSON telemetry packets to local edge gateways and cloud broker over Wi-Fi / MQTT with offline ring-buffer fallback.",
    specs: ["MCU: Xtensa 32-bit LX6 240MHz", "Sampling Frequency: 1 Hz averaging", "Protocols: MQTT / WebSockets / REST"]
  },
  {
    id: "data",
    step: "05",
    name: "Data Processing",
    category: "Telemetry Broker",
    icon: "💾📈",
    summary: "Time-series database ingestion, validation, and historical trend structuring.",
    techDetails: "Persists millisecond-timestamped telemetry, detects sensor disconnects or drift, and feeds normalized snapshots to the AI analytical engine.",
    specs: ["Storage: Time-series / MongoDB", "Retention: Rolling 30-day high-resolution", "Data Format: Normalized JSON schema"]
  },
  {
    id: "ai",
    step: "06",
    name: "AI Engine",
    category: "Intelligence Layer",
    icon: "🤖🧠",
    summary: "Machine learning and heuristic reasoning model analyzing biological health and trends.",
    techDetails: "Combines domain physiological models with anomaly detection to interpret multi-sensor cross-correlations (e.g. pH rise coinciding with DO production during photoperiod).",
    specs: ["Model Type: Anomaly Isolation Forest & Advisory LLM", "Inference: Real-time edge / Cloud hybrid", "Confidence Metric: 0–100% calibration index"]
  },
  {
    id: "analysis",
    step: "07",
    name: "Condition Analysis",
    category: "Decision Support",
    icon: "🔍📋",
    summary: "Separates measured observations, calculated yields, predictive trajectories, and biological causes.",
    techDetails: "Assesses whether the reactor is in steady-state, photo-inhibited, carbon-limited, or thermally stressed, and calculates required actuator setpoints.",
    specs: ["Evaluation: Multi-objective optimization", "Output: Relay setpoints & diagnostic alerts", "Safety Thresholds: Hard-coded override limits"]
  },
  {
    id: "control",
    step: "08",
    name: "Automated Control",
    category: "Hardware Actuation",
    icon: "⚙️🎛️",
    summary: "Micro-relay array actuating spargers, fluid dosing valves, cooling fans, and lighting.",
    techDetails: "Translates AI advisory targets into pulse-width modulation (PWM) and digital relay signals to maintain optimal biological equilibrium inside the reactor.",
    specs: ["Aeration Pump: 12V Diaphragm", "Lighting: PWM Spectrum LED", "Circulation: Brushless Submersible Pump", "Cooling: Brushless 12V Exhaust Fan"]
  },
  {
    id: "optimized",
    step: "09",
    name: "Optimized System",
    category: "Closed-Loop Equilibrium",
    icon: "🔄✨",
    summary: "Continuous self-regulating bioreactor maintaining high biological efficiency and reliability.",
    techDetails: "The closed-loop cycle guarantees that Chlorella vulgaris cultures remain at peak photosynthetic capacity, extending culture longevity and preventing crashes.",
    specs: ["Target DO: > 6.5 mg/L", "Target pH: 7.0–7.4", "Operating Temp: 25°C–28°C"]
  }
];

export function renderFlowDiagram(variant = "full") {
  if (variant === "simple") {
    const simpleSteps = [
      { name: "AIR / WATER", sub: "Environmental Input", icon: "🌬️" },
      { name: "ALGAE REACTOR", sub: "Chlorella vulgaris", icon: "🧪" },
      { name: "SENSORS", sub: "5 Core Telemetry", icon: "📊" },
      { name: "ESP32 / IoT", sub: "Edge Telemetry", icon: "🔌" },
      { name: "AI ANALYSIS", sub: "Anomaly & Trends", icon: "🤖" },
      { name: "AUTOMATION", sub: "Closed-Loop Control", icon: "⚙️" },
      { name: "OPTIMIZED SYSTEM", sub: "Stable Bioreactor", icon: "✨" }
    ];

    return `
      <div class="simple-flow-container">
        <div class="flow-track">
          ${simpleSteps
            .map(
              (step, i) => `
              <div class="flow-card">
                <div class="flow-card-num">0${i + 1}</div>
                <div class="flow-card-icon">${step.icon}</div>
                <div class="flow-card-title">${step.name}</div>
                <div class="flow-card-sub">${step.sub}</div>
              </div>
              ${
                i < simpleSteps.length - 1
                  ? `<div class="flow-arrow-divider" aria-hidden="true">
                       <span class="flow-line"></span>
                       <span class="flow-arrow-head">→</span>
                     </div>`
                  : ""
              }
            `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  // Full Interactive Architecture Diagram
  return `
    <div class="interactive-architecture" id="interactive-architecture">
      <div class="architecture-header">
        <div class="arch-badge">INTERACTIVE ARCHITECTURE</div>
        <h3 class="arch-title">Closed-Loop Biological & Digital Infrastructure</h3>
        <p class="arch-caption">Click any component below to inspect hardware specifications, telemetry layers, and operational parameters.</p>
      </div>

      <div class="arch-grid">
        ${ARCHITECTURE_NODES.map(
          (node) => `
          <button class="arch-node-card" data-node-id="${node.id}" aria-label="Inspect ${node.name}">
            <div class="arch-node-top">
              <span class="arch-step-badge">${node.step}</span>
              <span class="arch-cat">${node.category}</span>
            </div>
            <div class="arch-node-icon">${node.icon}</div>
            <h4 class="arch-node-name">${node.name}</h4>
            <p class="arch-node-summary">${node.summary}</p>
            <div class="arch-node-footer">
              <span>View Specs</span>
              <span class="arch-action-icon">⊕</span>
            </div>
          </button>
        `
        ).join("")}
      </div>

      <div class="arch-detail-modal" id="arch-modal" aria-hidden="true">
        <div class="arch-modal-backdrop" id="arch-modal-backdrop"></div>
        <div class="arch-modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-node-title">
          <button class="arch-modal-close" id="arch-modal-close" aria-label="Close dialog">✕</button>
          <div id="arch-modal-body"></div>
        </div>
      </div>
    </div>
  `;
}

export function initFlowDiagramEvents() {
  const container = document.getElementById("interactive-architecture");
  if (!container) return;

  const modal = document.getElementById("arch-modal");
  const modalBody = document.getElementById("arch-modal-body");
  const closeBtn = document.getElementById("arch-modal-close");
  const backdrop = document.getElementById("arch-modal-backdrop");

  function openNodeModal(nodeId) {
    const node = ARCHITECTURE_NODES.find((n) => n.id === nodeId);
    if (!node || !modal || !modalBody) return;

    modalBody.innerHTML = `
      <div class="node-modal-header">
        <div class="node-modal-step">${node.step} // ${node.category.toUpperCase()}</div>
        <div class="node-modal-icon">${node.icon}</div>
        <h3 id="modal-node-title" class="node-modal-title">${node.name}</h3>
      </div>
      <div class="node-modal-summary">${node.summary}</div>
      <div class="node-modal-section">
        <h5>Detailed Engineering Operation</h5>
        <p>${node.techDetails}</p>
      </div>
      <div class="node-modal-section">
        <h5>Technical Specifications & Protocols</h5>
        <ul class="node-specs-list">
          ${node.specs.map((s) => `<li><span class="spec-bullet">▹</span> ${s}</li>`).join("")}
        </ul>
      </div>
    `;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }

  container.querySelectorAll(".arch-node-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      const nodeId = btn.getAttribute("data-node-id");
      openNodeModal(nodeId);
    });
  });

  closeBtn?.addEventListener("click", closeModal);
  backdrop?.addEventListener("click", closeModal);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}
