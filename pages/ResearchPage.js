/**
 * AIRQUA Research Page
 * Presents AIRQUA as a serious scientific R&D initiative.
 * Sections: Algae Research, Environmental Monitoring, Sensor Research, AI Research,
 * Experiment Cards (001, 002, 003), and Future Research Roadmap.
 */

import { RESEARCH_EXPERIMENTS } from "../data/demo-data.js";

export function renderResearchPage() {
  return `
    <div class="page-research">
      <!-- HEADER -->
      <section class="page-intro-header">
        <div class="section-container">
          <div class="intro-badge">R&D LABS & METHODOLOGY</div>
          <h1 class="page-title">AIRQUA Scientific Research</h1>
          <p class="page-lead">
            AIRQUA operates as an ongoing research and development project. We prioritize scientific rigor, empirical validation, and transparent reporting—rejecting unverified environmental claims in favor of measurable biological and sensor kinetics.
          </p>
          <div class="research-status-callout">
            <span class="callout-icon">🔬</span>
            <span>
              <strong>Research Notice:</strong> All experimental descriptions and parameter values documented here reflect prototype benchtop methodologies and active laboratory trials. Results are presented as ongoing engineering developments.
            </span>
          </div>
        </div>
      </section>

      <!-- 4 RESEARCH DOMAINS -->
      <section class="section section-research-domains">
        <div class="section-container">
          <div class="section-header">
            <span class="section-eyebrow">— INVESTIGATION DOMAINS</span>
            <h2 class="section-title">Core Research Tracks</h2>
            <p class="section-desc">
              Four parallel disciplines converging into an integrated cyber-biological platform.
            </p>
          </div>

          <div class="research-domains-grid">
            <!-- 1. Algae Research -->
            <div class="domain-card">
              <div class="domain-card-head">
                <span class="domain-icon">🌿</span>
                <span class="domain-tag">BIOLOGY</span>
              </div>
              <h3 class="domain-title">Microalgae Kinetics</h3>
              <p class="domain-text">
                Investigating <em>Chlorella vulgaris</em> growth rates, chlorophyll fluorescence, and carbon assimilation under fluctuating light intensity and nutrient medium compositions (Modified BG-11 and Bold's Basal Medium).
              </p>
              <ul class="domain-bullet-list">
                <li>Specific growth rate (µ) optimization</li>
                <li>Photosystem II photoperiod tolerance</li>
                <li>Cellular sedimentation rates under varied aeration</li>
              </ul>
            </div>

            <!-- 2. Environmental Monitoring -->
            <div class="domain-card">
              <div class="domain-card-head">
                <span class="domain-icon">🌬️</span>
                <span class="domain-tag">ENVIRONMENTAL</span>
              </div>
              <h3 class="domain-title">Environmental Gas Flux</h3>
              <p class="domain-text">
                Studying mass-transfer coefficients (k_L a) of gaseous CO₂ entering aqueous microalgal suspensions and measuring volumetric oxygen production under continuous indoor airflow conditions.
              </p>
              <ul class="domain-bullet-list">
                <li>Two-film gas-liquid mass transfer dynamics</li>
                <li>Carbon dioxide residence time in micro-bubbles</li>
                <li>Headspace ambient gas exchange efficiency</li>
              </ul>
            </div>

            <!-- 3. Sensor Research -->
            <div class="domain-card">
              <div class="domain-card-head">
                <span class="domain-icon">📊</span>
                <span class="domain-tag">INSTRUMENTATION</span>
              </div>
              <h3 class="domain-title">Sensor Calibration & Longevity</h3>
              <p class="domain-text">
                Developing non-invasive optical instrumentation and evaluating probe degradation in living organic cultures, mitigating biofouling, and establishing linear correlation between optical turbidity and dry cell weight.
              </p>
              <ul class="domain-bullet-list">
                <li>Turbidity (NTU) to Biomass (g/L) calibration curves</li>
                <li>Electrochemical drift compensation algorithms</li>
                <li>Low-cost optical density probe prototyping</li>
              </ul>
            </div>

            <!-- 4. AI Research -->
            <div class="domain-card">
              <div class="domain-card-head">
                <span class="domain-icon">🤖</span>
                <span class="domain-tag">INTELLIGENCE</span>
              </div>
              <h3 class="domain-title">Cyber-Physical AI Control</h3>
              <p class="domain-text">
                Training multivariate machine-learning models to predict culture state changes and execute closed-loop actuator adjustments without causing carbonic acid shock or thermal stress.
              </p>
              <ul class="domain-bullet-list">
                <li>Isolation Forest anomaly boundary tuning</li>
                <li>Physiological heuristic decision trees</li>
                <li>Edge inference on low-power microcontrollers</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- EXPERIMENTS SECTION -->
      <section class="section section-experiments alt-bg">
        <div class="section-container">
          <div class="section-header">
            <span class="section-eyebrow">— PROTOTYPE EXPERIMENTS</span>
            <h2 class="section-title">Benchtop Experiments</h2>
            <p class="section-desc">
              Structured experimental logs testing core biological hypotheses and telemetry integrations.
            </p>
          </div>

          <div class="experiments-grid">
            ${RESEARCH_EXPERIMENTS.map(
              (exp) => `
              <div class="experiment-card" id="${exp.id.toLowerCase()}">
                <div class="exp-card-header">
                  <div class="exp-id-badge">${exp.id}</div>
                  <div class="exp-status-pill">${exp.status}</div>
                </div>

                <h3 class="exp-title">${exp.title}</h3>

                <div class="exp-meta-grid">
                  <div class="exp-meta-item">
                    <span class="exp-meta-label">Species</span>
                    <strong class="exp-meta-val">${exp.species}</strong>
                  </div>
                  <div class="exp-meta-item">
                    <span class="exp-meta-label">Vessel Volume</span>
                    <strong class="exp-meta-val">${exp.reactor}</strong>
                  </div>
                  <div class="exp-meta-item">
                    <span class="exp-meta-label">Photoperiod</span>
                    <strong class="exp-meta-val">${exp.lightCycle}</strong>
                  </div>
                  <div class="exp-meta-item">
                    <span class="exp-meta-label">Stage</span>
                    <strong class="exp-meta-val">${exp.currentStage}</strong>
                  </div>
                </div>

                <div class="exp-section">
                  <div class="exp-section-label">Logged Parameters:</div>
                  <div class="exp-param-pills">
                    ${exp.parameters.map((p) => `<span class="param-pill">${p}</span>`).join("")}
                  </div>
                </div>

                <div class="exp-section">
                  <div class="exp-section-label">Scientific Objective:</div>
                  <p class="exp-text">${exp.objective}</p>
                </div>

                <div class="exp-section findings">
                  <div class="exp-section-label">Preliminary Observations:</div>
                  <p class="exp-text">${exp.keyFindings}</p>
                </div>
              </div>
            `
            ).join("")}
          </div>
        </div>
      </section>

      <!-- FUTURE RESEARCH ROADMAP -->
      <section class="section section-roadmap">
        <div class="section-container">
          <div class="section-header center">
            <span class="section-eyebrow">— HORIZON</span>
            <h2 class="section-title">Future Research Directions</h2>
            <p class="section-desc">
              Planned scientific advancements for subsequent prototype iterations.
            </p>
          </div>

          <div class="roadmap-grid">
            <div class="roadmap-card">
              <div class="roadmap-phase">PHASE II</div>
              <h4>Polyculture Microalgae Consortia</h4>
              <p>Testing co-cultures of <em>Chlorella vulgaris</em> and <em>Scenedesmus obliquus</em> for enhanced resistance to temperature fluctuations and broader nutrient absorption profiles.</p>
            </div>
            <div class="roadmap-card">
              <div class="roadmap-phase">PHASE III</div>
              <h4>Direct Flue Gas Sparging Tolerance</h4>
              <p>Evaluating biological tolerance limits to raw combustion gas mixtures containing sulfur oxides (SOx) and nitrogen oxides (NOx) with automated pre-scrubbing.</p>
            </div>
            <div class="roadmap-card">
              <div class="roadmap-phase">PHASE IV</div>
              <h4>Modular Thin-Film Flat Panel Arrays</h4>
              <p>Scaling from cylindrical column vessels to ultra-thin flat panel airlift photobioreactors with 400% higher surface-to-volume photon capture efficiency.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}
