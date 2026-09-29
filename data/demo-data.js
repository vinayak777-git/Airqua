/**
 * AIRQUA Centralized Telemetry & Demo Data Layer
 * Standardized data models according to:
 * Biology + Sensors + IoT + AI -> Intelligent Environmental Systems
 * 
 * Target Parameters:
 * - co2 (ppm): Carbon dioxide concentration
 * - dissolvedOxygen (mg/L): Oxygen dissolved in water
 * - ph: Acidity / alkalinity balance
 * - temperature (°C): Water / bioreactor thermal profile
 * - turbidity (NTU): Water clarity & biomass optical density indicator
 * - algaeHealth (%): Estimated Chlorella vulgaris vitality index
 */

export const SENSOR_METRICS = {
  co2: {
    key: "co2",
    label: "CO₂ Concentration",
    shortLabel: "CO₂",
    unit: "ppm",
    baseline: 420,
    decimals: 0,
    icon: "🌬️",
    normalRange: [380, 520],
    watchRange: [520, 800],
    min: 300,
    max: 1200,
    description: "Monitors dissolved and head-space carbon dioxide available for microalgae photosynthesis.",
    sensorModel: "NDIR Gas Sensor (SCD30 / MH-Z19B)",
    calibrationStatus: "Verified"
  },
  dissolvedOxygen: {
    key: "dissolvedOxygen",
    label: "Dissolved Oxygen",
    shortLabel: "DO",
    unit: "mg/L",
    baseline: 6.8,
    decimals: 1,
    icon: "🫧",
    normalRange: [6.0, 8.5],
    watchRange: [4.5, 6.0],
    min: 2.0,
    max: 14.0,
    description: "Measures oxygen release from photosynthetic activity of Chlorella vulgaris culture.",
    sensorModel: "Galvanic DO Optical Probe",
    calibrationStatus: "Factory Calibrated"
  },
  ph: {
    key: "ph",
    label: "pH Balance",
    shortLabel: "pH",
    unit: "pH",
    baseline: 7.2,
    decimals: 2,
    icon: "🧪",
    normalRange: [6.8, 7.8],
    watchRange: [6.4, 8.2],
    min: 4.0,
    max: 10.0,
    description: "Tracks culture acidity. Rising pH reflects rapid CO₂ uptake and carbonate consumption.",
    sensorModel: "Analog Precision BNC Glass Electrode",
    calibrationStatus: "Two-point buffer verified"
  },
  temperature: {
    key: "temperature",
    label: "Culture Temperature",
    shortLabel: "Temp",
    unit: "°C",
    baseline: 27.0,
    decimals: 1,
    icon: "🌡️",
    normalRange: [24.0, 29.0],
    watchRange: [20.0, 32.0],
    min: 15.0,
    max: 40.0,
    description: "Monitors bioreactor thermal condition. Chlorella vulgaris thrives best at 25°C–28°C.",
    sensorModel: "DS18B20 Waterproof Digital Probe",
    calibrationStatus: "±0.5°C accurate"
  },
  turbidity: {
    key: "turbidity",
    label: "Optical Turbidity",
    shortLabel: "Turbidity",
    unit: "NTU",
    baseline: 12.0,
    decimals: 1,
    icon: "🌊",
    normalRange: [8.0, 18.0],
    watchRange: [18.0, 30.0],
    min: 1.0,
    max: 100.0,
    description: "Indicates suspended biomass concentration and cell density of Chlorella vulgaris.",
    sensorModel: "TS-300B Optical Scattering Sensor",
    calibrationStatus: "Zero-standard aligned"
  },
  algaeHealth: {
    key: "algaeHealth",
    label: "Algae Vitality Index",
    shortLabel: "Vitality",
    unit: "%",
    baseline: 92.4,
    decimals: 1,
    icon: "🌿",
    normalRange: [80.0, 100.0],
    watchRange: [65.0, 80.0],
    min: 0.0,
    max: 100.0,
    description: "Calculated biological health index based on photosynthetic yield and steady parameters.",
    sensorModel: "AI Multi-parameter Composite Metric",
    calibrationStatus: "Algorithm v1.4"
  }
};

export const INITIAL_TELEMETRY = {
  timestamp: new Date().toISOString(),
  co2: 420.0,
  dissolvedOxygen: 6.8,
  ph: 7.20,
  temperature: 27.0,
  turbidity: 12.0,
  algaeHealth: 92.4,
  systemStatus: "Online",
  reactorCondition: "Stable",
  dataQuality: "Good",
  anomalyDetected: false,
  anomalyDetail: "None Detected",
  dataSource: "demo", // Clear disclosure
  dataSourceNotice: "This is only for mock purpose data. Once connection is restored with real-time hardware services, live sensor data will be used.",
  relays: {
    aeration: true,
    pump: true,
    fan: false,
    lighting: true
  }
};

/**
 * Generate 24 hours of simulated realistic historical data
 */
export function generateHistoricalData(points = 24, hoursSpan = 24) {
  const history = [];
  const now = Date.now();
  const stepMs = (hoursSpan * 60 * 60 * 1000) / points;

  for (let i = points; i >= 0; i--) {
    const time = new Date(now - i * stepMs);
    // Smooth diurnal sine wave pattern simulating daylight cycle
    const cycle = Math.sin((time.getHours() / 24) * Math.PI * 2);
    
    // Photosynthesis active during day: DO rises, CO2 decreases, pH rises slightly
    const co2 = Math.round(420 - cycle * 35 + (Math.random() - 0.5) * 12);
    const dissolvedOxygen = Number((6.8 + cycle * 0.7 + (Math.random() - 0.5) * 0.2).toFixed(1));
    const ph = Number((7.2 + cycle * 0.15 + (Math.random() - 0.5) * 0.05).toFixed(2));
    const temperature = Number((27.0 + cycle * 1.2 + (Math.random() - 0.5) * 0.3).toFixed(1));
    const turbidity = Number((12.0 + (points - i) * 0.15 + (Math.random() - 0.5) * 0.4).toFixed(1));
    const algaeHealth = Number((92.0 + cycle * 2.0 + (Math.random() - 0.5) * 1.0).toFixed(1));

    history.push({
      timestamp: time.toISOString(),
      label: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      co2: Math.max(320, Math.min(1100, co2)),
      dissolvedOxygen: Math.max(3.0, Math.min(12.0, dissolvedOxygen)),
      ph: Math.max(6.0, Math.min(8.5, ph)),
      temperature: Math.max(18.0, Math.min(34.0, temperature)),
      turbidity: Math.max(2.0, Math.min(50.0, turbidity)),
      algaeHealth: Math.max(50.0, Math.min(99.0, algaeHealth))
    });
  }
  return history;
}

export const RESEARCH_EXPERIMENTS = [
  {
    id: "EXP-001",
    title: "Chlorella vulgaris Baseline Photoperiod Kinetics",
    species: "Chlorella vulgaris (UTEX 2714)",
    reactor: "10 L Cylindrical Column Photobioreactor",
    lightCycle: "16h Light / 8h Dark (PAR 180 µmol/m²/s)",
    parameters: ["CO₂", "DO", "pH", "Temperature", "Turbidity"],
    status: "Active Prototype",
    objective: "Establish baseline photosynthetic carbon fixation rates and diurnal DO production under controlled aeration.",
    currentStage: "Benchtop Validation",
    keyFindings: "Demonstrated stable DO saturation above 6.5 mg/L when aerated at 0.5 vvm with 420 ppm ambient air."
  },
  {
    id: "EXP-002",
    title: "Closed-Loop pH Buffer & CO₂ Injection Thresholds",
    species: "Chlorella vulgaris",
    reactor: "10 L Automated Bioreactor",
    lightCycle: "Continuous 24h Spectrum LED",
    parameters: ["pH", "CO₂ Drawdown", "Biomass Density"],
    status: "In Development",
    objective: "Determine optimum automated micro-solenoid burst duration for CO₂ enriched injection when pH exceeds 7.8.",
    currentStage: "Hardware Actuator Testing",
    keyFindings: "Micro-injections prevented culture alkalization without inducing carbonic acid stress."
  },
  {
    id: "EXP-003",
    title: "Optical Turbidity vs. Dry Cell Weight (DCW) Calibration",
    species: "Chlorella vulgaris",
    reactor: "5 L Benchtop Test Vessel",
    lightCycle: "Natural Daylight + Supplementary LED",
    parameters: ["Turbidity (NTU)", "Optical Density OD680", "Temperature"],
    status: "R&D Prototype",
    objective: "Calibrate affordable TS-300B optical scattering sensors against spectrophotometric spectrophotometry (OD680).",
    currentStage: "Sensor Calibration",
    keyFindings: "Linear correlation established between 5 NTU and 45 NTU (R² = 0.94) within normal operating cell densities."
  }
];

export const POTENTIAL_SOLUTIONS = [
  {
    id: "indoor-environments",
    title: "Indoor Environments",
    subtitle: "Air Revitalization & Biophilic Living Infrastructure",
    icon: "🏢",
    badge: "Air-Side Potential",
    description: "Engineered algae photobioreactors can be integrated into high-traffic indoor environments to assist in localized CO₂ reduction and oxygen enrichment. Continuous optical sensing monitors air quality while the living biological culture acts as a functional living partition.",
    keyMetrics: "CO₂ Drawdown, Humidity Balance, Particulate Capture",
    status: "Feasibility Concept"
  },
  {
    id: "malls",
    title: "Shopping Malls & Atriums",
    subtitle: "High-Volume Public Air Quality & Educational Displays",
    icon: "🏬",
    badge: "Architectural Integration",
    description: "Large glass atriums offer natural illumination ideal for microalgae cultivation systems. Installed as interactive architectural columns, the system can remediate stagnant indoor air while displaying real-time environmental metrics to visitors.",
    keyMetrics: "Diurnal CO₂ Buffering, Visitor Air Quality Index",
    status: "Conceptual Architecture"
  },
  {
    id: "offices",
    title: "Corporate Offices & Coworking",
    subtitle: "Cognitive Well-Being & Automated Air Balancing",
    icon: "💼",
    badge: "Workspace Wellness",
    description: "Elevated indoor CO₂ in sealed office spaces can reduce cognitive focus and cause fatigue. AIRQUA systems can circulate workspace air through automated bioreactor pods, balancing oxygen levels during peak occupancy hours.",
    keyMetrics: "CO₂ Mitigation, Ambient DO Optimization",
    status: "Prototype Feasibility"
  },
  {
    id: "campuses",
    title: "Educational Campuses",
    subtitle: "Living Laboratories & Green STEM Technology",
    icon: "🎓",
    badge: "Academic R&D",
    description: "Campuses offer ideal environments for deploying visible sustainability projects. Students and researchers can access live telemetry streams from bioreactors, exploring microbiology, IoT instrumentation, and embedded automation firsthand.",
    keyMetrics: "Research Data Feeds, Student IoT Projects",
    status: "Pilot Ready Framework"
  },
  {
    id: "research",
    title: "Research Facilities",
    subtitle: "Controlled Microalgae Cultivation & Bioremediation Testing",
    icon: "🔬",
    badge: "Scientific Tooling",
    description: "Specialized laboratories require tightly monitored bioreactor vessels with continuous logging of temperature, pH, and dissolved gases. AIRQUA provides an open, extensible telemetry and AI analysis foundation for environmental scientists.",
    keyMetrics: "High-frequency Logging, Anomaly Detection",
    status: "R&D Architecture"
  },
  {
    id: "water-applications",
    title: "Water Remediation Applications",
    subtitle: "Phycoremediation & Nutrient Recovery Systems",
    icon: "💧",
    badge: "Water-Side Potential",
    description: "Microalgae exhibit remarkable capacity to absorb excess nitrates and phosphates from agricultural runoff or secondary wastewater. AIRQUA's sensor layer monitors water turbidity, pH, and DO to ensure optimum nutrient uptake without culture collapse.",
    keyMetrics: "Nitrate/Phosphate Absorption, Turbidity Clearance",
    status: "Exploratory Research"
  },
  {
    id: "industrial-monitoring",
    title: "Industrial Environmental Monitoring",
    subtitle: "Point-Source Emissions & Environmental Buffering",
    icon: "🏭",
    badge: "Industrial Telemetry",
    description: "Industrial sites generate concentrated carbon and thermal streams. While not a standalone total filtration replacement, AIRQUA can serve as a biological polishing stage and intelligent environmental sentry for point-source emissions.",
    keyMetrics: "Flue Gas Temperature, Thermal Dissipation, Gas Flux",
    status: "Future Research Concept"
  }
];
