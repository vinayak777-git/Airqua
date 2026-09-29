/**
 * AIRQUA Sensor Card Component - Next-Gen Industrial SCADA Edition
 * Professional vector icons, live micro-gauges, precision typography,
 * and illuminated hardware telemetry status.
 */

import { SENSOR_METRICS } from "../data/demo-data.js";
import { ICONS } from "./Icons.js";

export function renderSensorCard(metricKey, value, status = "normal") {
  const meta = SENSOR_METRICS[metricKey];
  if (!meta) return "";

  const numVal = typeof value === "number" ? value : meta.baseline;
  const formattedVal = numVal.toFixed(meta.decimals);

  const statusColor =
    status === "alert"
      ? "status-alert"
      : status === "watch"
      ? "status-watch"
      : "status-normal";

  const statusLabel =
    status === "alert" ? "Alert" : status === "watch" ? "Watch" : "Nominal";

  // Calculate position percentage along the [min, max] range
  const span = Math.max(0.001, meta.max - meta.min);
  const valPct = Math.max(0, Math.min(100, ((numVal - meta.min) / span) * 100));
  const targetLeft = Math.max(0, Math.min(100, ((meta.normalRange[0] - meta.min) / span) * 100));
  const targetWidth = Math.max(0, Math.min(100 - targetLeft, ((meta.normalRange[1] - meta.normalRange[0]) / span) * 100));

  const iconRenderer = ICONS[metricKey] || ICONS.activity;
  const iconSvg = iconRenderer("sensor-vector-icon", 22);

  return `
    <article class="sensor-card ${statusColor}" data-sensor="${metricKey}">
      <div class="sensor-accent-bar"></div>
      
      <div class="sensor-card-header">
        <div class="sensor-icon-wrap">
          <div class="sensor-icon-frame" data-metric="${metricKey}">
            ${iconSvg}
          </div>
          <div>
            <div class="sensor-label">${meta.label}</div>
            <div class="sensor-code">
              <span class="code-tag">${meta.shortLabel}</span>
              <span class="code-sep">/</span>
              <span class="model-tag">${meta.sensorModel.split("(")[0].trim()}</span>
            </div>
          </div>
        </div>
        <div class="sensor-card-badges">
          <span class="sensor-mock-badge" title="This is only for mock purpose data">MOCK</span>
          <div class="sensor-status-badge ${statusColor}">
            <span class="status-indicator-dot"></span>
            <span class="status-badge-text">${statusLabel}</span>
          </div>
        </div>
      </div>

      <div class="sensor-value-row">
        <div class="val-display-group">
          <span class="sensor-value" id="val-${metricKey}">${formattedVal}</span>
          <span class="sensor-unit">${meta.unit}</span>
        </div>
        <div class="sensor-delta-pill" id="delta-${metricKey}">
          <span class="delta-arrow">↗</span>
          <span class="delta-text">1 Hz Stream</span>
        </div>
      </div>

      <!-- Precision Range Micro-Gauge -->
      <div class="sensor-gauge-wrapper">
        <div class="sensor-gauge-track">
          <div class="gauge-target-band" style="left: ${targetLeft}%; width: ${targetWidth}%;" title="Target optimal envelope: ${meta.normalRange[0]}–${meta.normalRange[1]} ${meta.unit}"></div>
          <div class="gauge-pointer" id="gauge-ptr-${metricKey}" style="left: ${valPct}%;"></div>
        </div>
        <div class="gauge-scale-labels">
          <span>${meta.min} ${meta.unit}</span>
          <span class="target-center-label">Target: ${meta.normalRange[0]}–${meta.normalRange[1]}</span>
          <span>${meta.max} ${meta.unit}</span>
        </div>
      </div>

      <div class="sensor-card-footer">
        <div class="sensor-card-subline">
          <span class="cal-badge">
            ${ICONS.check("cal-check-svg", 12)}
            <span>${meta.calibrationStatus}</span>
          </span>
        </div>
        <div class="sensor-card-mock-notice">
          ${ICONS.info("mock-notice-svg", 13)}
          <span>Mock Purpose Data · Hardware Standby</span>
        </div>
      </div>
    </article>
  `;
}

export function renderSensorGrid(current, statuses) {
  const keys = ["co2", "dissolvedOxygen", "ph", "temperature", "turbidity", "algaeHealth"];
  return `
    <div class="sensor-cards-grid" id="sensor-cards-grid">
      ${keys
        .map((k) => renderSensorCard(k, current[k], statuses[k] || "normal"))
        .join("")}
    </div>
  `;
}

export function updateSensorCardValues(current, statuses) {
  const keys = ["co2", "dissolvedOxygen", "ph", "temperature", "turbidity", "algaeHealth"];
  keys.forEach((key) => {
    const meta = SENSOR_METRICS[key];
    const valEl = document.getElementById(`val-${key}`);
    const ptrEl = document.getElementById(`gauge-ptr-${key}`);
    const cardEl = document.querySelector(`.sensor-card[data-sensor="${key}"]`);
    
    if (valEl && current[key] !== undefined) {
      valEl.textContent = current[key].toFixed(meta.decimals);
      
      // Update micro-gauge pointer
      if (ptrEl) {
        const span = Math.max(0.001, meta.max - meta.min);
        const valPct = Math.max(0, Math.min(100, ((current[key] - meta.min) / span) * 100));
        ptrEl.style.left = `${valPct}%`;
      }
    }

    if (cardEl && statuses[key]) {
      const status = statuses[key];
      cardEl.classList.remove("status-normal", "status-watch", "status-alert");
      cardEl.classList.add(`status-${status}`);
      const badge = cardEl.querySelector(".sensor-status-badge");
      if (badge) {
        badge.className = `sensor-status-badge status-${status}`;
        const label = status === "alert" ? "Alert" : status === "watch" ? "Watch" : "Nominal";
        badge.innerHTML = `<span class="status-indicator-dot"></span><span class="status-badge-text">${label}</span>`;
      }
    }
  });
}
