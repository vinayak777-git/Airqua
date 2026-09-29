/**
 * AIRQUA About Page
 * Details why AIRQUA exists, the problem, the idea, the technology, the vision,
 * future directions, and concludes with the core operational mantra:
 * Sense → Understand → Predict → Act → Learn
 */

export function renderAboutPage() {
  return `
    <div class="page-about">
      <!-- HEADER -->
      <section class="page-intro-header">
        <div class="section-container">
          <div class="intro-badge">ORIGIN & MISSION</div>
          <h1 class="page-title">About AIRQUA</h1>
          <p class="page-lead">
            AIRQUA began with a simple but profound inquiry: what if environmental management systems were not merely mechanical filters, but living, intelligent biological cyber-physical systems?
          </p>
        </div>
      </section>

      <!-- NARRATIVE CHAPTERS -->
      <section class="section section-about-narrative">
        <div class="section-container">
          <div class="about-timeline">
            <!-- Chapter 1: Why AIRQUA Exists -->
            <div class="about-chapter">
              <div class="chapter-marker">
                <span class="marker-dot"></span>
                <span class="marker-line"></span>
              </div>
              <div class="chapter-content">
                <span class="chapter-tag">CHAPTER 01</span>
                <h3 class="chapter-title">Why AIRQUA Exists</h3>
                <p>
                  Modern urban buildings and industrial facilities are increasingly sealed and reliant on brute-force mechanical ventilation. High-efficiency particulate air (HEPA) filters and chemical carbon scrubbers require frequent consumable replacement, consume massive electrical wattage, and produce solid secondary waste.
                </p>
                <p>
                  AIRQUA was conceived to pioneer an alternative paradigm: harnessing the billions of years of biological evolution refined by microalgae to treat air and water organically, augmented by real-time electronics and artificial intelligence.
                </p>
              </div>
            </div>

            <!-- Chapter 2: The Problem -->
            <div class="about-chapter">
              <div class="chapter-marker">
                <span class="marker-dot"></span>
                <span class="marker-line"></span>
              </div>
              <div class="chapter-content">
                <span class="chapter-tag">CHAPTER 02</span>
                <h3 class="chapter-title">The Fundamental Problem</h3>
                <p>
                  Pollution is not a static challenge—it is dynamic, shifting by hour, season, human occupancy, and weather. Static filtration systems cannot adapt. They operate at rigid fan speeds, unaware of biological kinetics or localized carbon surges.
                </p>
                <p>
                  Furthermore, traditional environmental monitors remain passive observers. They flash a red LED when air quality degrades, but possess zero autonomous capability to remediate the surrounding atmosphere.
                </p>
              </div>
            </div>

            <!-- Chapter 3: The Idea -->
            <div class="about-chapter">
              <div class="chapter-marker">
                <span class="marker-dot"></span>
                <span class="marker-line"></span>
              </div>
              <div class="chapter-content">
                <span class="chapter-tag">CHAPTER 03</span>
                <h3 class="chapter-title">The AIRQUA Idea</h3>
                <p>
                  The core philosophy of AIRQUA can be summarized in one equation:
                </p>
                <div class="quote-formula-box">
                  <strong>Biology + Sensors + IoT + AI → Intelligent Environmental Systems</strong>
                </div>
                <p>
                  By creating a closed-loop photobioreactor housing microalgae, instrumenting it with precision telemetry, and empowering an AI diagnostic layer to govern actuation, the bioreactor becomes a self-aware biological organ for the built environment.
                </p>
              </div>
            </div>

            <!-- Chapter 4: The Technology -->
            <div class="about-chapter">
              <div class="chapter-marker">
                <span class="marker-dot"></span>
                <span class="marker-line"></span>
              </div>
              <div class="chapter-content">
                <span class="chapter-tag">CHAPTER 04</span>
                <h3 class="chapter-title">The Technology Foundation</h3>
                <p>
                  The prototype centers on <em>Chlorella vulgaris</em>—a microalga with an exceptionally high specific photosynthetic growth rate. We couple this biological engine with a custom ESP32 IoT board reading five fundamental environmental metrics: CO₂, Dissolved Oxygen, pH, Temperature, and Turbidity.
                </p>
                <p>
                  Actuators for aeration sparging, hydraulic circulation, exhaust cooling, and spectrum LED lighting are governed by both rule-based failsafes and predictive AI models.
                </p>
              </div>
            </div>

            <!-- Chapter 5: The Vision & Future -->
            <div class="about-chapter">
              <div class="chapter-marker">
                <span class="marker-dot"></span>
                <span class="marker-line"></span>
              </div>
              <div class="chapter-content">
                <span class="chapter-tag">CHAPTER 05</span>
                <h3 class="chapter-title">The Scalable Vision</h3>
                <p>
                  We envision a future where modular AIRQUA bioreactors are integrated into shopping atriums, enterprise campuses, research centers, and public transport hubs. Scaled arrays will act as living biophilic architectural features that actively refresh indoor oxygen, buffer CO₂, and provide continuous verifiable telemetry to city dashboards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- OPERATIONAL MANTRA CONCLUSION -->
      <section class="section section-mantra">
        <div class="section-container">
          <div class="mantra-banner">
            <span class="mantra-eyebrow">— THE OPERATIONAL CYCLE</span>
            <h2 class="mantra-title">The AIRQUA Closed Loop</h2>
            <div class="mantra-chain">
              <div class="mantra-node">
                <span class="mantra-icon">👁️</span>
                <span class="mantra-step">Sense</span>
              </div>
              <span class="mantra-arrow">→</span>
              <div class="mantra-node">
                <span class="mantra-icon">🧠</span>
                <span class="mantra-step">Understand</span>
              </div>
              <span class="mantra-arrow">→</span>
              <div class="mantra-node">
                <span class="mantra-icon">🔮</span>
                <span class="mantra-step">Predict</span>
              </div>
              <span class="mantra-arrow">→</span>
              <div class="mantra-node">
                <span class="mantra-icon">⚙️</span>
                <span class="mantra-step">Act</span>
              </div>
              <span class="mantra-arrow">→</span>
              <div class="mantra-node">
                <span class="mantra-icon">🔄</span>
                <span class="mantra-step">Learn</span>
              </div>
            </div>
            <p class="mantra-caption">
              Every second of telemetry trains the next generation of biological optimization.
            </p>
          </div>
        </div>
      </section>
    </div>
  `;
}
