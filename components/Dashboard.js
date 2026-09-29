/**
 * AIRQUA Command Center (Dashboard Component) - Next-Gen Industrial SCADA Edition
 * Professional vector icons, aerospace relay switches, real-time micro-gauges,
 * and mission-control telemetry visualization.
 */

import { telemetryService } from "../services/telemetry-service.js";
import { renderSensorGrid, updateSensorCardValues } from "./SensorCard.js";
import { TelemetryChart } from "./Charts.js";
import { ICONS } from "./Icons.js";

export class Dashboard {
  constructor(containerElement) {
    this.container = containerElement;
    this.unsubscribe = null;
    this.chartInstance = null;
    this.alerts = [
      { id: 1, type: "info", time: "Just now", code: "STREAM-01", text: "Continuous 1 Hz telemetry sampling active. Signal integrity 100%." },
      { id: 2, type: "success", time: "2m ago", code: "DO-SAT", text: "Dissolved oxygen maintained above 6.5 mg/L baseline threshold." },
      { id: 3, type: "info", time: "8m ago", code: "ACT-AER", text: "Closed-loop micro-aeration sparger engaged. Bubble size 1–2 mm." },
      { id: 4, type: "info", time: "15m ago", code: "PH-BUF", text: "Carbonate buffer equilibrium stabilized within 6.80–7.80 target band." }
    ];
    this.init();
  }

  init() {
    this.render();
    this.initChart();
    this.bindEvents();
    this.subscribeToTelemetry();
  }

  render() {
    const snap = telemetryService.getSnapshot();
    const cur = snap.current;
    const st = snap.statuses;

    this.container.innerHTML = `
      <div class="dashboard-wrapper">
        <!-- Top Mission Control Telemetry Notice Banner -->
        <div class="demo-data-banner">
          <div class="banner-left">
            <span class="banner-badge">MOCK PURPOSE DATA</span>
            <span class="banner-text">
              <strong>Notice:</strong> This telemetry console displays simulated mock evaluation data. Real-time serial bridge will automatically engage upon ESP32 hardware handshake.
            </span>
          </div>
          <div class="banner-right">
            <div class="hardware-standby-badge">
              ${ICONS.radio("radio-pulse-icon", 16)}
              <span>HARDWARE STANDBY · AUTO-SWITCH ON CONNECT</span>
            </div>
          </div>
        </div>

        <!-- Command Center Top Bar -->
        <div class="dashboard-hero-bar">
          <div class="dash-title-group">
            <div class="dash-eyebrow">
              <span class="eyebrow-dot"></span>
              <span>STATION ID: ND-AIRQUA-01 · MISSION CONTROL</span>
            </div>
            <h1 class="dash-title">AIRQUA COMMAND CENTER</h1>
            <p class="dash-subtitle">High-frequency biological telemetry, IoT actuator automation, and predictive kinetics.</p>
          </div>
          <div class="dash-controls-group">
            <div class="system-status-indicator online">
              <span class="pulse-ring-outer"></span>
              <span class="pulse-ring-inner"></span>
              <span class="status-label-text">TELEMETRY:</span>
              <strong id="dash-system-status">LIVE (1 Hz MOCK)</strong>
            </div>
            <div class="sync-time-badge">
              <span class="sync-label">SYNC:</span>
              <strong id="dash-sync-time">${new Date().toLocaleTimeString()}</strong>
            </div>
            <button class="btn-refresh" id="dash-refresh-btn" title="Force telemetry poll">
              ${ICONS.refresh("refresh-vector-icon", 16)}
              <span>SYNC NOW</span>
              <span class="btn-sheen"></span>
            </button>
          </div>
        </div>

        <!-- 5 Core Sensors Grid -->
        <section class="dash-section">
          <div class="mock-purpose-alert-strip">
            <div class="mock-alert-left">
              <span class="mock-alert-icon-wrap">
                ${ICONS.alert("alert-vector-icon", 18)}
              </span>
              <div class="mock-alert-text">
                <strong>Simulated Telemetry Stream:</strong> Sensors are executing calibrated Monod biological trajectories. When physical probe hardware is plugged in, live analog values replace this simulated data.
              </div>
            </div>
            <div class="mock-alert-right">
              <span class="mock-stream-badge">
                ${ICONS.activity("activity-vector-icon", 14)}
                <span>1 Hz SAMPLING</span>
              </span>
            </div>
          </div>

          <div class="section-title-row">
            <div>
              <div class="section-pre-title">PRIMARY TELEMETRY ARRAY</div>
              <h3 class="dash-section-title">Core Environmental Parameters</h3>
              <p class="dash-section-desc">Chlorella vulgaris photobioreactor multi-channel telemetry streams.</p>
            </div>
            <div class="telemetry-meta-pills">
              <span class="stream-rate-badge">CHANNELS: 6 ACTIVE</span>
              <span class="stream-status-pill">KALMAN FILTERED</span>
            </div>
          </div>
          <div id="dashboard-sensor-grid-wrap">
            ${renderSensorGrid(cur, st)}
          </div>
        </section>

        <!-- Status & Automation Twin Columns -->
        <section class="dash-section">
          <div class="status-automation-grid">
            <!-- AI Status Panel -->
            <div class="control-panel-card">
              <div class="panel-header">
                <div class="panel-title-wrap">
                  <div class="panel-icon-frame">
                    ${ICONS.cpu("panel-vector-icon", 20)}
                  </div>
                  <div>
                    <h4 class="panel-title">AI Diagnostic Engine</h4>
                    <span class="panel-sub">Heuristic Anomaly Detection & Kinetics</span>
                  </div>
                </div>
                <span class="panel-badge-good">ACTIVE INFERENCE</span>
              </div>
              <div class="ai-status-metrics">
                <div class="status-stat-row">
                  <span class="stat-name">Reactor Condition</span>
                  <div class="stat-value-group">
                    <span class="stat-indicator-led emerald"></span>
                    <strong class="stat-value text-emerald" id="ai-reactor-cond">${cur.reactorCondition.toUpperCase()}</strong>
                  </div>
                </div>
                <div class="status-stat-row">
                  <span class="stat-name">Signal Quality</span>
                  <div class="stat-value-group">
                    <span class="stat-indicator-led cyan"></span>
                    <strong class="stat-value text-cyan" id="ai-data-qual">${cur.dataQuality}</strong>
                  </div>
                </div>
                <div class="status-stat-row">
                  <span class="stat-name">Multivariate Anomaly Score</span>
                  <div class="stat-value-group">
                    <strong class="stat-value text-emerald" id="ai-anomaly-status">0.04 (NOMINAL)</strong>
                  </div>
                </div>
                <div class="status-stat-row">
                  <span class="stat-name">Biological Phase</span>
                  <strong class="stat-value">Vegetative Exponential</strong>
                </div>
                <div class="status-stat-row">
                  <span class="stat-name">Base Model Provider</span>
                  <strong class="stat-value text-cyan">Ollama · llama3.2:3b</strong>
                </div>
              </div>
              <div class="panel-footer-note">
                ${ICONS.check("note-check-icon", 14)}
                <span>Edge inference running locally; real-time JSON guardrails enforced.</span>
              </div>
            </div>

            <!-- Automation Relays Panel -->
            <div class="control-panel-card">
              <div class="panel-header">
                <div class="panel-title-wrap">
                  <div class="panel-icon-frame">
                    ${ICONS.sliders("panel-vector-icon", 20)}
                  </div>
                  <div>
                    <h4 class="panel-title">Actuator Automation</h4>
                    <span class="panel-sub">Closed-Loop Relay Driver (GPIO)</span>
                  </div>
                </div>
                <span class="panel-badge-auto">CLOSED-LOOP AUTO</span>
              </div>
              <p class="panel-desc">Interactive aerospace relay switches. Toggle to override actuator state manually.</p>
              
              <div class="relays-list">
                <!-- Aeration -->
                <div class="relay-row">
                  <div class="relay-info">
                    <div class="relay-icon-frame ${cur.relays.aeration ? "active" : ""}">
                      ${ICONS.aeration("relay-icon-svg", 18)}
                    </div>
                    <div>
                      <div class="relay-label">Aeration Sparger</div>
                      <div class="relay-desc">Micro-bubble O₂/CO₂ mass transfer</div>
                    </div>
                  </div>
                  <button class="relay-toggle-btn ${cur.relays.aeration ? "active" : ""}" data-relay="aeration">
                    <span class="relay-switch-track">
                      <span class="relay-switch-thumb"></span>
                    </span>
                    <span class="relay-text">${cur.relays.aeration ? "ARMED [ON]" : "STANDBY"}</span>
                  </button>
                </div>

                <!-- Pump -->
                <div class="relay-row">
                  <div class="relay-info">
                    <div class="relay-icon-frame ${cur.relays.pump ? "active" : ""}">
                      ${ICONS.pump("relay-icon-svg", 18)}
                    </div>
                    <div>
                      <div class="relay-label">Circulation Pump</div>
                      <div class="relay-desc">Hydrodynamic fluid mixing & suspension</div>
                    </div>
                  </div>
                  <button class="relay-toggle-btn ${cur.relays.pump ? "active" : ""}" data-relay="pump">
                    <span class="relay-switch-track">
                      <span class="relay-switch-thumb"></span>
                    </span>
                    <span class="relay-text">${cur.relays.pump ? "ARMED [ON]" : "STANDBY"}</span>
                  </button>
                </div>

                <!-- Fan -->
                <div class="relay-row">
                  <div class="relay-info">
                    <div class="relay-icon-frame ${cur.relays.fan ? "active" : ""}">
                      ${ICONS.fan("relay-icon-svg", 18)}
                    </div>
                    <div>
                      <div class="relay-label">Exhaust Cooling Fan</div>
                      <div class="relay-desc">Thermal dissipation & humidity extraction</div>
                    </div>
                  </div>
                  <button class="relay-toggle-btn ${cur.relays.fan ? "active" : ""}" data-relay="fan">
                    <span class="relay-switch-track">
                      <span class="relay-switch-thumb"></span>
                    </span>
                    <span class="relay-text">${cur.relays.fan ? "ARMED [ON]" : "STANDBY"}</span>
                  </button>
                </div>

                <!-- Lighting -->
                <div class="relay-row">
                  <div class="relay-info">
                    <div class="relay-icon-frame ${cur.relays.lighting ? "active" : ""}">
                      ${ICONS.lighting("relay-icon-svg", 18)}
                    </div>
                    <div>
                      <div class="relay-label">Spectrum Lighting Array</div>
                      <div class="relay-desc">PAR photosynthetic LED illumination</div>
                    </div>
                  </div>
                  <button class="relay-toggle-btn ${cur.relays.lighting ? "active" : ""}" data-relay="lighting">
                    <span class="relay-switch-track">
                      <span class="relay-switch-thumb"></span>
                    </span>
                    <span class="relay-text">${cur.relays.lighting ? "ARMED [ON]" : "STANDBY"}</span>
                  </button>
                </div>
              </div>

              <div class="panel-footer-note">
                ${ICONS.check("note-check-icon", 14)}
                <span>Mapped to ESP32 optically-isolated relays on GPIO 25, 26, 27, 14.</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Real-Time Telemetry Charts Section -->
        <section class="dash-section">
          <div id="dashboard-chart-mount"></div>
        </section>

        <!-- System Alerts & Diagnostic Log -->
        <section class="dash-section">
          <div class="alerts-feed-card">
            <div class="alerts-feed-header">
              <div class="alerts-feed-title">
                <div class="feed-icon-frame">
                  ${ICONS.terminal("terminal-vector-icon", 18)}
                </div>
                <div>
                  <h4 class="feed-title-text">System Telemetry & Automation Feed</h4>
                  <span class="feed-sub-text">Chronological SCADA Audit Log</span>
                </div>
              </div>
              <span class="alerts-count">4 EVENT ENTRIES</span>
            </div>
            <div class="alerts-feed-list" id="alerts-feed-list">
              ${this.alerts
                .map(
                  (a) => `
                <div class="alert-item alert-${a.type}">
                  <span class="alert-code-tag">${a.code || "EVENT"}</span>
                  <span class="alert-text">${a.text}</span>
                  <span class="alert-time">${a.time}</span>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </section>
      </div>
    `;
  }

  initChart() {
    const mount = this.container.querySelector("#dashboard-chart-mount");
    if (mount) {
      const snap = telemetryService.getSnapshot();
      this.chartInstance = new TelemetryChart(mount, snap.history);
    }
  }

  bindEvents() {
    // Refresh button with tactile animation
    const refreshBtn = this.container.querySelector("#dash-refresh-btn");
    refreshBtn?.addEventListener("click", () => {
      refreshBtn.classList.add("rotating");
      telemetryService.tick();
      setTimeout(() => {
        refreshBtn.classList.remove("rotating");
      }, 600);
    });

    // Relay toggles
    const relayBtns = this.container.querySelectorAll(".relay-toggle-btn");
    relayBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const relayKey = btn.getAttribute("data-relay");
        if (relayKey) {
          const newState = telemetryService.toggleRelay(relayKey);
          btn.classList.toggle("active", newState);
          const textEl = btn.querySelector(".relay-text");
          if (textEl) {
            textEl.textContent = newState ? "ARMED [ON]" : "STANDBY";
          }
          const iconFrame = btn.closest(".relay-row")?.querySelector(".relay-icon-frame");
          if (iconFrame) {
            iconFrame.classList.toggle("active", newState);
          }
        }
      });
    });
  }

  subscribeToTelemetry() {
    this.unsubscribe = telemetryService.subscribe((snapshot) => {
      const cur = snapshot.current;
      const st = snapshot.statuses;

      // Update sensor card metrics and micro-gauges
      updateSensorCardValues(cur, st);

      // Update Top Status & Time
      const timeEl = this.container.querySelector("#dash-sync-time");
      if (timeEl) {
        timeEl.textContent = new Date().toLocaleTimeString();
      }

      // Update AI Status indicators
      const condEl = this.container.querySelector("#ai-reactor-cond");
      if (condEl) condEl.textContent = cur.reactorCondition.toUpperCase();

      const qualEl = this.container.querySelector("#ai-data-qual");
      if (qualEl) qualEl.textContent = cur.dataQuality;

      // Update relay buttons if changed externally
      Object.keys(cur.relays).forEach((key) => {
        const btn = this.container.querySelector(`.relay-toggle-btn[data-relay="${key}"]`);
        if (btn) {
          const active = cur.relays[key];
          btn.classList.toggle("active", active);
          const textEl = btn.querySelector(".relay-text");
          if (textEl) {
            textEl.textContent = active ? "ARMED [ON]" : "STANDBY";
          }
        }
      });

      // Update dynamic SVG chart
      if (this.chartInstance) {
        this.chartInstance.updateData(snapshot.history);
      }
    });
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
