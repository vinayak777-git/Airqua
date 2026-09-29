/**
 * AIRQUA Technology Page
 * Comprehensive technical documentation and interactive system architecture:
 * Algae System, Sensor System, IoT System, AI System, Automation, and Complete Architecture Diagram.
 */

import { renderFlowDiagram, initFlowDiagramEvents } from "../components/FlowDiagram.js";

export function renderTechnologyPage() {
  return `
    <div class="page-technology">
      <!-- HEADER -->
      <section class="page-intro-header">
        <div class="section-container">
          <div class="intro-badge">TECHNICAL SPECIFICATION V1.0</div>
          <h1 class="page-title">AIRQUA System Architecture</h1>
          <p class="page-lead">
            An in-depth technical analysis of the biological kinetics, sensor arrays, embedded IoT controllers, intelligence models, and closed-loop actuation governing the AIRQUA bioreactor platform.
          </p>
        </div>
      </section>

      <!-- 1. ALGAE SYSTEM -->
      <section class="tech-section" id="algae-system">
        <div class="section-container">
          <div class="tech-grid-row">
            <div class="tech-text-col">
              <span class="tech-badge green">BIOLOGICAL SUBSYSTEM</span>
              <h2 class="tech-heading">1. Microalgae Photobioreactor</h2>
              <p>
                The biological core of the current AIRQUA prototype utilizes <strong>Chlorella vulgaris</strong>, a spherical eukaryotic unicellular green microalga (diameter 2–10 µm) celebrated in environmental biotechnology for its extraordinary photosynthetic rate, high lipid/protein biomass accumulation, and rapid adaptation to variable carbon concentrations.
              </p>
              <div class="tech-points-box">
                <div class="point-item">
                  <div class="point-title">Photosynthetic Carbon Fixation</div>
                  <div class="point-desc">
                    Through the Calvin cycle, Chlorella assimilates dissolved bicarbonate (HCO₃⁻) and free CO₂, releasing dissolved oxygen into the liquid phase while converting carbon into stable cellular biomass.
                  </div>
                </div>
                <div class="point-item">
                  <div class="point-title">Illumination Kinetics & PAR Spectrum</div>
                  <div class="point-desc">
                    Illuminated using dual-band Photosynthetically Active Radiation (PAR) arrays focused at 450 nm (chlorophyll <em>b</em>) and 660 nm (chlorophyll <em>a</em>) with automated 16:8 hour photoperiods to prevent photoinhibition.
                  </div>
                </div>
                <div class="point-item">
                  <div class="point-title">Culture Density & pH Homeostasis</div>
                  <div class="point-desc">
                    Rapid photosynthetic carbon uptake causes natural culture alkalization. The automated system utilizes pH feedback to coordinate micro-aeration and carbon dosing, sustaining an optimal 6.8–7.6 pH buffer.
                  </div>
                </div>
              </div>
            </div>
            <div class="tech-visual-col">
              <div class="spec-card">
                <div class="spec-card-head">
                  <span class="spec-icon">🌿</span>
                  <h4>Biological Core Specs</h4>
                </div>
                <table class="spec-table">
                  <tbody>
                    <tr><td>Target Organism</td><td><em>Chlorella vulgaris</em> (UTEX 2714)</td></tr>
                    <tr><td>Reactor Vessel</td><td>10 L Vertical Borosilicate Column</td></tr>
                    <tr><td>Light Saturation</td><td>180–220 µmol photons / m² / s</td></tr>
                    <tr><td>Optimal Temp</td><td>25°C – 28°C (Max threshold: 35°C)</td></tr>
                    <tr><td>Optimal pH</td><td>6.8 – 7.6</td></tr>
                    <tr><td>Carbon Utilization</td><td>Free CO₂ & Dissolved HCO₃⁻</td></tr>
                    <tr><td>Aeration Rate</td><td>0.3 – 0.8 vvm (vessel vol / min)</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. SENSOR SYSTEM -->
      <section class="tech-section alt-bg" id="sensor-system">
        <div class="section-container">
          <div class="tech-header-block">
            <span class="tech-badge cyan">TELEMETRY INGESTION</span>
            <h2 class="tech-heading">2. Multi-Parameter Sensor Array</h2>
            <p>
              Accurate bioreactor management requires synchronized chemical and physical measurements. AIRQUA deploys a five-parameter continuous telemetry probe suite.
            </p>
          </div>

          <div class="sensors-spec-grid">
            <div class="sensor-spec-box">
              <div class="sensor-spec-top">
                <span class="sensor-pill-icon">🌬️</span>
                <h4>CO₂ Concentration</h4>
              </div>
              <div class="sensor-hardware-name">NDIR Optical Gas Probe</div>
              <p class="sensor-spec-detail">
                Monitors influent and effluent head-space carbon dioxide concentration with non-dispersive infrared absorption spectrometry.
              </p>
              <div class="spec-meta-list">
                <span>Range: 0–5000 ppm</span>
                <span>Accuracy: ±30 ppm</span>
                <span>Interface: I2C / UART</span>
              </div>
            </div>

            <div class="sensor-spec-box">
              <div class="sensor-spec-top">
                <span class="sensor-pill-icon">🫧</span>
                <h4>Dissolved Oxygen (DO)</h4>
              </div>
              <div class="sensor-hardware-name">Galvanic / Optical DO Probe</div>
              <p class="sensor-spec-detail">
                Directly measures photosynthetic O₂ production and gas saturation within the aqueous culture matrix.
              </p>
              <div class="spec-meta-list">
                <span>Range: 0–20.0 mg/L</span>
                <span>Response: &lt; 30 sec</span>
                <span>Calibration: Atmospheric Air 100%</span>
              </div>
            </div>

            <div class="sensor-spec-box">
              <div class="sensor-spec-top">
                <span class="sensor-pill-icon">🧪</span>
                <h4>pH Balance</h4>
              </div>
              <div class="sensor-hardware-name">Precision Glass BNC Electrode</div>
              <p class="sensor-spec-detail">
                Continuous galvanic potential monitoring indicating carbonate buffer consumption and biological metabolic rate.
              </p>
              <div class="spec-meta-list">
                <span>Range: 0–14.0 pH</span>
                <span>Resolution: 0.01 pH</span>
                <span>Signal: High-impedance analog amplifier</span>
              </div>
            </div>

            <div class="sensor-spec-box">
              <div class="sensor-spec-top">
                <span class="sensor-pill-icon">🌡️</span>
                <h4>Temperature</h4>
              </div>
              <div class="sensor-hardware-name">DS18B20 Digital Thermometer</div>
              <p class="sensor-spec-detail">
                Submersible stainless probe tracking thermal dissipation from LED arrays and ambient heat flux.
              </p>
              <div class="spec-meta-list">
                <span>Range: -10°C to +85°C</span>
                <span>Precision: ±0.5°C</span>
                <span>Protocol: Dallas 1-Wire bus</span>
              </div>
            </div>

            <div class="sensor-spec-box">
              <div class="sensor-spec-top">
                <span class="sensor-pill-icon">🌊</span>
                <h4>Optical Turbidity</h4>
              </div>
              <div class="sensor-hardware-name">TS-300B Optical Scatter Sensor</div>
              <p class="sensor-spec-detail">
                Measures 650nm light scattering to derive continuous proxy measurements of suspended microalgal biomass and optical density.
              </p>
              <div class="spec-meta-list">
                <span>Range: 0–4000 NTU</span>
                <span>Linear Region: 5–50 NTU</span>
                <span>Output: 0–4.5V DC analog</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. IOT SYSTEM -->
      <section class="tech-section" id="iot-system">
        <div class="section-container">
          <div class="tech-grid-row">
            <div class="tech-text-col">
              <span class="tech-badge amber">EMBEDDED HARDWARE</span>
              <h2 class="tech-heading">3. ESP32 IoT Edge Controller</h2>
              <p>
                The telemetry acquisition layer is powered by an ESP32 microcontroller operating on a 240MHz dual-core Xtensa 32-bit architecture. One core manages deterministic high-frequency sensor sampling and analog filtering, while the second core handles networking, cryptographic packaging, and communication with the cloud/local server.
              </p>
              <div class="tech-points-box">
                <div class="point-item">
                  <div class="point-title">ADC Oversampling & Polynomial Calibration</div>
                  <div class="point-desc">
                    Raw 12-bit analog inputs undergo 64-sample running median filtering and multi-point polynomial linearization to remove high-frequency noise induced by pump switching.
                  </div>
                </div>
                <div class="point-item">
                  <div class="point-title">Resilient Local Ring Buffering</div>
                  <div class="point-desc">
                    In the event of temporary Wi-Fi network interruption, telemetry packets are spooled into onboard non-volatile SPI flash memory and synchronized once connection resumes.
                  </div>
                </div>
                <div class="point-item">
                  <div class="point-title">Encrypted Lightweight Telemetry</div>
                  <div class="point-desc">
                    Dispatches structured JSON telemetry over MQTT with TLS encryption or REST endpoints, maintaining sub-second status latency.
                  </div>
                </div>
              </div>
            </div>

            <div class="tech-visual-col">
              <div class="code-preview-box">
                <div class="code-header">
                  <span class="code-dot red"></span>
                  <span class="code-dot yellow"></span>
                  <span class="code-dot green"></span>
                  <span class="code-title">telemetry-packet.json</span>
                </div>
                <pre class="code-content"><code>{
  "nodeId": "AIRQUA-ESP32-001",
  "timestamp": "2026-09-29T22:15:00.000Z",
  "metrics": {
    "co2": 420.0,
    "dissolvedOxygen": 6.8,
    "ph": 7.20,
    "temperature": 27.0,
    "turbidity": 12.0,
    "algaeHealth": 92.4
  },
  "relays": {
    "aeration": true,
    "pump": true,
    "fan": false,
    "lighting": true
  },
  "crc32": "e4f812b9"
}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. AI SYSTEM -->
      <section class="tech-section alt-bg" id="ai-system">
        <div class="section-container">
          <div class="tech-header-block">
            <span class="tech-badge purple">DECISION INTELLIGENCE</span>
            <h2 class="tech-heading">4. Artificial Intelligence & Diagnostic Layer</h2>
            <p>
              AIRQUA treats AI not as an ambiguous black box, but as a disciplined statistical inference engine combining empirical biological heuristics with multivariate machine learning.
            </p>
          </div>

          <div class="ai-pillars-row">
            <div class="ai-box">
              <div class="ai-box-icon">📡</div>
              <h4>Real-Time Ingestion</h4>
              <p>Continuous validation of sensor drift, detecting probe fouling or air bubble entrapment at the electrode face.</p>
            </div>
            <div class="ai-box">
              <div class="ai-box-icon">🔍</div>
              <h4>Anomaly Detection</h4>
              <p>Isolation Forest algorithm evaluating multi-sensor correlations (e.g. rising temperature without DO elevation).</p>
            </div>
            <div class="ai-box">
              <div class="ai-box-icon">📈</div>
              <h4>Predictive Growth Trends</h4>
              <p>Time-series forecasting models projecting culture biomass density, nutrient depletion, and optimal harvest intervals.</p>
            </div>
            <div class="ai-box">
              <div class="ai-box-icon">🎛️</div>
              <h4>Advisory Actuation</h4>
              <p>Calculates dynamic actuator setpoints for aeration and lighting rather than relying on brittle static threshold switches.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. AUTOMATION -->
      <section class="tech-section" id="automation">
        <div class="section-container">
          <div class="tech-grid-row">
            <div class="tech-text-col">
              <span class="tech-badge blue">HARDWARE CONTROL</span>
              <h2 class="tech-heading">5. Closed-Loop Actuation Hardware</h2>
              <p>
                AI recommendations are translated into real-world physical responses through an array of optically-isolated solid-state and mechanical relays controlling life-support hardware.
              </p>
              <div class="tech-points-box">
                <div class="point-item">
                  <div class="point-title">Aeration & Gas Sparging</div>
                  <div class="point-desc">
                    12V diaphragm air pump connected to porous ceramic micro-bubble spargers at the vessel base, maximizing gas-liquid interface area for CO₂ absorption.
                  </div>
                </div>
                <div class="point-item">
                  <div class="point-title">Hydraulic Recirculation Pump</div>
                  <div class="point-desc">
                    Submersible brushless fluid pump maintaining gentle hydrodynamic suspension to prevent microalgal cell sedimentation.
                  </div>
                </div>
                <div class="point-item">
                  <div class="point-title">Thermal Dissipation Fans</div>
                  <div class="point-desc">
                    Pulse-width modulated exhaust fans cycling ambient air across the bioreactor enclosure when temperatures exceed 28.5°C.
                  </div>
                </div>
                <div class="point-item">
                  <div class="point-title">Photosynthetic Spectrum Lighting</div>
                  <div class="point-desc">
                    Programmable constant-current LED drivers regulating red/blue photon flux density according to photoperiod scheduling.
                  </div>
                </div>
              </div>
            </div>

            <div class="tech-visual-col">
              <div class="actuator-schematic-card">
                <h4>Actuator Hardware Bus</h4>
                <div class="actuator-item">
                  <span class="act-name">Aeration Sparger</span>
                  <span class="act-pin">GPIO 25 (PWM)</span>
                  <span class="act-state on">Active [ON]</span>
                </div>
                <div class="actuator-item">
                  <span class="act-name">Recirculation Pump</span>
                  <span class="act-pin">GPIO 26 (Relay)</span>
                  <span class="act-state on">Active [ON]</span>
                </div>
                <div class="actuator-item">
                  <span class="act-name">Exhaust Fan</span>
                  <span class="act-pin">GPIO 27 (Relay)</span>
                  <span class="act-state off">Standby [OFF]</span>
                </div>
                <div class="actuator-item">
                  <span class="act-name">Spectrum Lighting</span>
                  <span class="act-pin">GPIO 14 (PWM)</span>
                  <span class="act-state on">Active [ON]</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 6. COMPLETE ARCHITECTURE DIAGRAM -->
      <section class="tech-section alt-bg" id="complete-architecture">
        <div class="section-container">
          ${renderFlowDiagram("full")}
        </div>
      </section>
    </div>
  `;
}

export function initTechnologyPageEvents() {
  initFlowDiagramEvents();
}
