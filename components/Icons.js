/**
 * AIRQUA Next-Gen Vector Icon Library
 * Crisp, modern geometric SVG icons (20x20 / 24x24) replacing OS emojis
 * with enterprise SCADA / mission-control aesthetics.
 */

export function createSvg(content, className = "dash-svg-icon", size = 20) {
  return `<svg class="${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${content}</svg>`;
}

export const ICONS = {
  // CO2 / Atmospheric Air
  co2: (cls, size) => createSvg(`
    <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/>
    <path d="M9.6 4.6A2 2 0 1 1 11 8H2"/>
    <path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
  `, cls || "sensor-svg-co2", size),

  // Dissolved Oxygen / Aqueous O2
  dissolvedOxygen: (cls, size) => createSvg(`
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
    <circle cx="12" cy="14" r="3" stroke-dasharray="2 2"/>
  `, cls || "sensor-svg-do", size),

  // pH Balance / Laboratory Flask
  ph: (cls, size) => createSvg(`
    <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/>
    <path d="M8.5 2h7"/>
    <path d="M7 16h10"/>
  `, cls || "sensor-svg-ph", size),

  // Temperature / Thermal Sensor
  temperature: (cls, size) => createSvg(`
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
    <circle cx="11.5" cy="17.5" r="2" fill="currentColor"/>
  `, cls || "sensor-svg-temp", size),

  // Turbidity / Optical Nephelometry
  turbidity: (cls, size) => createSvg(`
    <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
    <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
    <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
  `, cls || "sensor-svg-turbidity", size),

  // Algae Vitality / Chloroplast / Biomass
  algaeHealth: (cls, size) => createSvg(`
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  `, cls || "sensor-svg-algae", size),

  // Actuator: Aeration Sparger
  aeration: (cls, size) => createSvg(`
    <circle cx="12" cy="18" r="3"/>
    <circle cx="6" cy="12" r="2"/>
    <circle cx="18" cy="10" r="2.5"/>
    <circle cx="11" cy="6" r="2"/>
  `, cls || "relay-svg-aeration", size),

  // Actuator: Circulation Pump
  pump: (cls, size) => createSvg(`
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 7v5l3 3"/>
    <path d="M12 3v2"/>
    <path d="M12 19v2"/>
    <path d="M3 12h2"/>
    <path d="M19 12h2"/>
  `, cls || "relay-svg-pump", size),

  // Actuator: Cooling Fan
  fan: (cls, size) => createSvg(`
    <circle cx="12" cy="12" r="2"/>
    <path d="M12 10C10.5 7 11.5 3 13 2c1.5 1 1.5 5 0 8z"/>
    <path d="M14 12c3 1.5 7 .5 8-1-1-1.5-5-1.5-8 0z"/>
    <path d="M12 14c1.5 3 .5 7-1 8-1.5-1-1.5-5 0-8z"/>
    <path d="M10 12c-3-1.5-7-.5-8 1 1 1.5 5 1.5 8 0z"/>
  `, cls || "relay-svg-fan", size),

  // Actuator: Spectrum Lighting
  lighting: (cls, size) => createSvg(`
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2"/>
    <path d="M12 20v2"/>
    <path d="m4.93 4.93 1.41 1.41"/>
    <path d="m17.66 17.66 1.41 1.41"/>
    <path d="M2 12h2"/>
    <path d="M20 12h2"/>
    <path d="m6.34 17.66-1.41 1.41"/>
    <path d="m19.07 4.93-1.41 1.41"/>
  `, cls || "relay-svg-light", size),

  // AI / Quantum Processor Core
  cpu: (cls, size) => createSvg(`
    <rect width="16" height="16" x="4" y="4" rx="2"/>
    <rect width="6" height="6" x="9" y="9" rx="1"/>
    <path d="M15 2v2"/>
    <path d="M15 20v2"/>
    <path d="M2 15h2"/>
    <path d="M2 9h2"/>
    <path d="M20 15h2"/>
    <path d="M20 9h2"/>
    <path d="M9 2v2"/>
    <path d="M9 20v2"/>
  `, cls || "panel-svg-cpu", size),

  // Automation / Sliders / Controls
  sliders: (cls, size) => createSvg(`
    <line x1="4" x2="4" y1="21" y2="14"/>
    <line x1="4" x2="4" y1="10" y2="3"/>
    <line x1="12" x2="12" y1="21" y2="12"/>
    <line x1="12" x2="12" y1="8" y2="3"/>
    <line x1="20" x2="20" y1="21" y2="16"/>
    <line x1="20" x2="20" y1="12" y2="3"/>
    <line x1="1" x2="7" y1="14" y2="14"/>
    <line x1="9" x2="15" y1="8" y2="8"/>
    <line x1="17" x2="23" y1="16" y2="16"/>
  `, cls || "panel-svg-sliders", size),

  // Refresh / Sync
  refresh: (cls, size) => createSvg(`
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
    <path d="M21 3v5h-5"/>
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
    <path d="M3 21v-5h5"/>
  `, cls || "btn-svg-refresh", size),

  // Activity Waveform / EKG
  activity: (cls, size) => createSvg(`
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  `, cls || "svg-activity", size),

  // Terminal / Logs
  terminal: (cls, size) => createSvg(`
    <polyline points="4 17 10 11 4 5"/>
    <line x1="12" x2="20" y1="19" y2="19"/>
  `, cls || "svg-terminal", size),

  // Warning Radar Shield
  alert: (cls, size) => createSvg(`
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  `, cls || "svg-alert", size),

  // Info Shield
  info: (cls, size) => createSvg(`
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12.01" y2="8"/>
  `, cls || "svg-info", size),

  // Wireless / Gateway Broadcast
  radio: (cls, size) => createSvg(`
    <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/>
    <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/>
    <circle cx="12" cy="12" r="2"/>
    <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/>
    <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/>
  `, cls || "svg-radio", size),

  // Check / Calibrated
  check: (cls, size) => createSvg(`
    <path d="M20 6 9 17l-5-5"/>
  `, cls || "svg-check", size)
};
