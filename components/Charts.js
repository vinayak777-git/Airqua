/**
 * AIRQUA Interactive High-Performance Telemetry Charts
 * Renders real-time responsive SVG time-series graphs for:
 * CO2, Dissolved Oxygen, pH, Temperature, and Turbidity
 * Supports metric selection tabs, hover coordinate tooltips, and target reference bands.
 */

import { SENSOR_METRICS } from "../data/demo-data.js";
import { ICONS } from "./Icons.js";

const METRIC_COLORS = {
  co2: "#e8b355", // warm amber
  dissolvedOxygen: "#38bdf8", // bright cyan
  ph: "#10b981", // vibrant emerald
  temperature: "#f43f5e", // coral rose
  turbidity: "#a855f7", // violet
  algaeHealth: "#4ade80" // mint green
};

export class TelemetryChart {
  constructor(containerElement, initialHistory = []) {
    this.container = containerElement;
    this.history = initialHistory;
    this.activeMetric = "co2"; // Default
    this.hoverIndex = null;
    this.init();
  }

  init() {
    this.renderLayout();
    this.bindEvents();
    this.renderChart();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="chart-panel-card">
        <div class="chart-panel-header">
          <div class="chart-header-left">
            <span class="chart-tag">— REAL-TIME TELEMETRY TRENDS</span>
            <h3 class="chart-title" id="chart-active-title">CO₂ Concentration History</h3>
            <span class="chart-demo-badge">DEMO DATA STREAM</span>
          </div>
          <div class="chart-metric-tabs" role="tablist">
            <button class="metric-tab active" data-metric="co2">
              ${ICONS.co2("tab-vector-icon", 14)}
              <span>CO₂</span>
            </button>
            <button class="metric-tab" data-metric="dissolvedOxygen">
              ${ICONS.dissolvedOxygen("tab-vector-icon", 14)}
              <span>DO (O₂)</span>
            </button>
            <button class="metric-tab" data-metric="ph">
              ${ICONS.ph("tab-vector-icon", 14)}
              <span>pH</span>
            </button>
            <button class="metric-tab" data-metric="temperature">
              ${ICONS.temperature("tab-vector-icon", 14)}
              <span>Temp</span>
            </button>
            <button class="metric-tab" data-metric="turbidity">
              ${ICONS.turbidity("tab-vector-icon", 14)}
              <span>Turbidity</span>
            </button>
          </div>
        </div>

        <div class="chart-stats-banner" id="chart-stats-banner">
          <!-- Dynamically updated stats -->
        </div>

        <div class="chart-canvas-wrapper" id="chart-svg-container">
          <svg id="telemetry-svg" class="telemetry-svg" preserveAspectRatio="none" viewBox="0 0 800 320"></svg>
          <div id="chart-tooltip" class="chart-tooltip" style="display:none;"></div>
        </div>

        <div class="chart-footer-row">
          <div class="chart-legend-wrap">
            <span class="legend-color-dot" id="legend-dot" style="background:${METRIC_COLORS.co2}"></span>
            <span class="legend-text" id="legend-label">CO₂ Concentration (ppm)</span>
            <span class="legend-target" id="legend-target">Normal envelope: 380–520 ppm</span>
          </div>
          <div class="chart-timeframe-info">
            <span>Sampling: 1 Hz avg</span> · <span>Window: 24 Hours</span>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const tabs = this.container.querySelectorAll(".metric-tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        this.activeMetric = tab.getAttribute("data-metric");
        this.renderChart();
      });
    });

    const svgWrap = this.container.querySelector("#chart-svg-container");
    const svg = this.container.querySelector("#telemetry-svg");
    const tooltip = this.container.querySelector("#chart-tooltip");

    if (svgWrap && svg && tooltip) {
      svgWrap.addEventListener("mousemove", (e) => {
        const rect = svgWrap.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const width = rect.width;
        const pts = this.history;
        if (!pts.length) return;

        const fraction = Math.max(0, Math.min(1, mouseX / width));
        const index = Math.round(fraction * (pts.length - 1));
        const point = pts[index];

        if (point) {
          const meta = SENSOR_METRICS[this.activeMetric];
          const val = point[this.activeMetric];
          const color = METRIC_COLORS[this.activeMetric];

          tooltip.style.display = "block";
          tooltip.style.left = `${mouseX}px`;
          tooltip.style.top = `30px`;
          tooltip.innerHTML = `
            <div class="tooltip-time">${point.label || point.timestamp}</div>
            <div class="tooltip-val" style="color:${color}">
              ${typeof val === "number" ? val.toFixed(meta.decimals) : val} ${meta.unit}
            </div>
            <div class="tooltip-sub">${meta.label}</div>
          `;
        }
      });

      svgWrap.addEventListener("mouseleave", () => {
        tooltip.style.display = "none";
      });
    }

    window.addEventListener("resize", () => {
      this.renderChart();
    });
  }

  updateHistory(newHistory) {
    this.history = newHistory;
    this.renderChart();
  }

  renderChart() {
    const svg = this.container.querySelector("#telemetry-svg");
    if (!svg) return;

    const metric = this.activeMetric;
    const meta = SENSOR_METRICS[metric];
    const color = METRIC_COLORS[metric];
    const pts = this.history;

    // Update banner & labels
    const titleEl = this.container.querySelector("#chart-active-title");
    const legendDot = this.container.querySelector("#legend-dot");
    const legendLabel = this.container.querySelector("#legend-label");
    const legendTarget = this.container.querySelector("#legend-target");
    const statsBanner = this.container.querySelector("#chart-stats-banner");

    if (titleEl) titleEl.textContent = `${meta.label} Telemetry History`;
    if (legendDot) legendDot.style.background = color;
    if (legendLabel) legendLabel.textContent = `${meta.label} (${meta.unit})`;
    if (legendTarget) legendTarget.textContent = `Normal envelope: ${meta.normalRange[0]}–${meta.normalRange[1]} ${meta.unit}`;

    if (!pts.length) {
      svg.innerHTML = `<text x="400" y="160" text-anchor="middle" fill="#64748b">No telemetry points recorded</text>`;
      return;
    }

    // Min / max calculations with padding
    const values = pts.map((p) => p[metric]).filter((v) => typeof v === "number");
    const curVal = values[values.length - 1];
    const minVal = Math.min(...values, meta.normalRange[0] * 0.95);
    const maxVal = Math.max(...values, meta.normalRange[1] * 1.05);
    const avgVal = values.reduce((a, b) => a + b, 0) / (values.length || 1);

    if (statsBanner) {
      statsBanner.innerHTML = `
        <div class="stat-pill"><span class="stat-pill-label">CURRENT</span><span class="stat-pill-val" style="color:${color}">${curVal.toFixed(meta.decimals)} ${meta.unit}</span></div>
        <div class="stat-pill"><span class="stat-pill-label">AVERAGE</span><span class="stat-pill-val">${avgVal.toFixed(meta.decimals)} ${meta.unit}</span></div>
        <div class="stat-pill"><span class="stat-pill-label">24H MIN</span><span class="stat-pill-val">${Math.min(...values).toFixed(meta.decimals)} ${meta.unit}</span></div>
        <div class="stat-pill"><span class="stat-pill-label">24H MAX</span><span class="stat-pill-val">${Math.max(...values).toFixed(meta.decimals)} ${meta.unit}</span></div>
      `;
    }

    // SVG coordinates: viewbox 0 0 800 320
    const padTop = 30;
    const padBottom = 40;
    const padLeft = 60;
    const padRight = 30;
    const chartW = 800 - padLeft - padRight;
    const chartH = 320 - padTop - padBottom;

    const getY = (val) => {
      const pct = (val - minVal) / (maxVal - minVal || 1);
      return padTop + chartH * (1 - pct);
    };

    const getX = (idx) => {
      return padLeft + (chartW / (pts.length - 1 || 1)) * idx;
    };

    // Build target normal range band
    const targetYTop = getY(meta.normalRange[1]);
    const targetYBottom = getY(meta.normalRange[0]);
    const targetBandH = Math.max(2, targetYBottom - targetYTop);

    // Build path coordinates
    const pointsCoords = pts.map((p, i) => ({
      x: getX(i),
      y: getY(p[metric])
    }));

    let pathD = `M ${pointsCoords[0].x} ${pointsCoords[0].y}`;
    for (let i = 1; i < pointsCoords.length; i++) {
      const prev = pointsCoords[i - 1];
      const cur = pointsCoords[i];
      const cpx1 = prev.x + (cur.x - prev.x) * 0.4;
      const cpy1 = prev.y;
      const cpx2 = prev.x + (cur.x - prev.x) * 0.6;
      const cpy2 = cur.y;
      pathD += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${cur.x} ${cur.y}`;
    }

    const areaD = `${pathD} L ${pointsCoords[pointsCoords.length - 1].x} ${padTop + chartH} L ${pointsCoords[0].x} ${padTop + chartH} Z`;

    // Horizontal grid lines
    const gridLines = [0, 0.25, 0.5, 0.75, 1.0].map((step) => {
      const val = minVal + (maxVal - minVal) * step;
      const y = getY(val);
      return `
        <line x1="${padLeft}" y1="${y}" x2="${800 - padRight}" y2="${y}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3" />
        <text x="${padLeft - 10}" y="${y + 4}" fill="#64748b" font-size="11" text-anchor="end" font-family="'JetBrains Mono', monospace">
          ${val.toFixed(meta.decimals)}
        </text>
      `;
    }).join("");

    // Horizontal time labels at bottom
    const stepCount = 5;
    const timeLabels = [];
    for (let i = 0; i < stepCount; i++) {
      const idx = Math.floor((pts.length - 1) * (i / (stepCount - 1)));
      const p = pts[idx];
      if (p) {
        const x = getX(idx);
        timeLabels.push(`
          <text x="${x}" y="${320 - 14}" fill="#64748b" font-size="11" text-anchor="middle" font-family="'JetBrains Mono', monospace">
            ${p.label || ""}
          </text>
        `);
      }
    }

    svg.innerHTML = `
      <defs>
        <linearGradient id="chartGradient-${metric}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.32" />
          <stop offset="70%" stop-color="${color}" stop-opacity="0.04" />
          <stop offset="100%" stop-color="${color}" stop-opacity="0.0" />
        </linearGradient>
      </defs>

      <!-- Target Operating Band -->
      <rect x="${padLeft}" y="${targetYTop}" width="${chartW}" height="${targetBandH}" fill="rgba(16, 185, 129, 0.05)" />
      <line x1="${padLeft}" y1="${targetYTop}" x2="${800 - padRight}" y2="${targetYTop}" stroke="rgba(16, 185, 129, 0.2)" stroke-dasharray="2,2" />
      <line x1="${padLeft}" y1="${targetYBottom}" x2="${800 - padRight}" y2="${targetYBottom}" stroke="rgba(16, 185, 129, 0.2)" stroke-dasharray="2,2" />

      <!-- Grid lines & labels -->
      ${gridLines}
      ${timeLabels.join("")}

      <!-- Shaded Area -->
      <path d="${areaD}" fill="url(#chartGradient-${metric})" />

      <!-- Primary Spline Path -->
      <path d="${pathD}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Pulsing Current Node -->
      <circle cx="${pointsCoords[pointsCoords.length - 1].x}" cy="${pointsCoords[pointsCoords.length - 1].y}" r="5" fill="${color}" />
      <circle cx="${pointsCoords[pointsCoords.length - 1].x}" cy="${pointsCoords[pointsCoords.length - 1].y}" r="10" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.6">
        <animate attributeName="r" values="5;14" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0" dur="2s" repeatCount="indefinite" />
      </circle>
    `;
  }
}
