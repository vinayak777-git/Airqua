/**
 * AIRQUA AI Page
 * Explains the AI layer (Monitoring, Anomaly Detection, Prediction, Optimization)
 * and hosts the interactive AIRQUA AI Assistant with structured 4-part evidence classification.
 */

import { AIChat } from "../components/AIChat.js";

let chatInstance = null;

export function renderAIPage() {
  return `
    <div class="page-ai">
      <!-- HEADER -->
      <section class="page-intro-header">
        <div class="section-container">
          <div class="intro-badge">INTELLIGENCE LAYER</div>
          <h1 class="page-title">The AIRQUA AI Diagnostic Engine</h1>
          <p class="page-lead">
            Artificial Intelligence at AIRQUA is not presented as magic. It is an empirical decision-support layer designed to monitor continuous telemetry, identify multivariate anomalies, forecast growth trends, and calculate closed-loop control setpoints.
          </p>
        </div>
      </section>

      <!-- 4 AI CAPABILITIES SECTIONS -->
      <section class="section section-ai-pillars">
        <div class="section-container">
          <div class="section-header">
            <span class="section-eyebrow">— CORE CAPABILITIES</span>
            <h2 class="section-title">Disciplined Environmental Analytics</h2>
            <p class="section-desc">
              Moving beyond simplistic threshold rules to predictive, biological-aware computational intelligence.
            </p>
          </div>

          <div class="ai-deep-grid">
            <!-- 1. AI Monitoring -->
            <div class="ai-deep-card">
              <div class="ai-card-top">
                <span class="ai-deep-icon">📡</span>
                <span class="ai-deep-step">01</span>
              </div>
              <h3 class="ai-deep-title">AI Monitoring</h3>
              <p class="ai-deep-text">
                Continuous telemetry streaming requires ongoing data validation. The AI monitoring layer inspects analog probe outputs for sensor drift, electronic noise spikes, and electrode biofilm fouling.
              </p>
              <div class="ai-feature-list">
                <div class="ai-feature-item">✓ Running median & Kalman filtering</div>
                <div class="ai-feature-item">✓ Disconnected probe / open-circuit detection</div>
                <div class="ai-feature-item">✓ Dynamic baseline normalization</div>
              </div>
            </div>

            <!-- 2. Anomaly Detection -->
            <div class="ai-deep-card">
              <div class="ai-card-top">
                <span class="ai-deep-icon">🔍</span>
                <span class="ai-deep-step">02</span>
              </div>
              <h3 class="ai-deep-title">Anomaly Detection</h3>
              <p class="ai-deep-text">
                Biological systems exhibit interdependent relationships. For example, if light intensity rises but dissolved oxygen declines, an anomaly is signaled even if individual values remain inside broad thresholds.
              </p>
              <div class="ai-feature-list">
                <div class="ai-feature-item">✓ Multivariate cross-sensor correlation</div>
                <div class="ai-feature-item">✓ Unsupervised Isolation Forest algorithms</div>
                <div class="ai-feature-item">✓ Early culture crash warning alerts</div>
              </div>
            </div>

            <!-- 3. Prediction -->
            <div class="ai-deep-card">
              <div class="ai-card-top">
                <span class="ai-deep-icon">📈</span>
                <span class="ai-deep-step">03</span>
              </div>
              <h3 class="ai-deep-title">Prediction</h3>
              <p class="ai-deep-text">
                By projecting diurnal photosynthetic curves, the model forecasts dissolved oxygen depletion during the dark respiration phase and anticipates carbon dioxide replenishment needs hours in advance.
              </p>
              <div class="ai-feature-list">
                <div class="ai-feature-item">✓ 6-hour rolling DO saturation trajectories</div>
                <div class="ai-feature-item">✓ Biomass yield & turbidity accumulation curves</div>
                <div class="ai-feature-item">✓ Diurnal diurnal thermal drift prediction</div>
              </div>
            </div>

            <!-- 4. Optimization -->
            <div class="ai-deep-card">
              <div class="ai-card-top">
                <span class="ai-deep-icon">⚙️</span>
                <span class="ai-deep-step">04</span>
              </div>
              <h3 class="ai-deep-title">Optimization</h3>
              <p class="ai-deep-text">
                Rather than turning actuators on or off abruptly, the optimization layer calculates pulse-width modulation setpoints for aeration, nutrient dosing, and cooling fans, minimizing energy expenditure.
              </p>
              <div class="ai-feature-list">
                <div class="ai-feature-item">✓ Energy-efficient aeration duty-cycling</div>
                <div class="ai-feature-item">✓ Automated pH buffer balancing</div>
                <div class="ai-feature-item">✓ Adaptive photoperiod light scheduling</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- BASE MODELS & QUERY VERSIONING ARCHITECTURE -->
      <section class="section section-ai-models">
        <div class="section-container">
          <div class="section-header">
            <span class="section-eyebrow">— INFERENCE RUNTIMES & QUERY VERSIONS</span>
            <h2 class="section-title">Base Models & Edge Inference Architecture</h2>
            <p class="section-desc">
              AIRQUA is model-agnostic. The query advisory layer supports local edge inference with Ollama by default, optional cloud LLM adapters, and a deterministic offline heuristic engine.
            </p>
          </div>

          <div class="ai-models-grid">
            <!-- 1. Ollama (Default) -->
            <div class="ai-model-card default-provider">
              <div class="model-card-badge-row">
                <span class="provider-pill default-pill">DEFAULT EDGE RUNTIME</span>
                <span class="model-tag">Ollama · llama3.2:3b</span>
              </div>
              <h3 class="model-card-title">Local Edge Model (Ollama)</h3>
              <p class="model-card-desc">
                Runs directly on the local bioreactor host (via <code>http://127.0.0.1:11434</code>). Guarantees zero cloud telemetry egress, complete privacy, and continuous offline autonomous inference without requiring API keys.
              </p>
              <div class="model-specs-list">
                <div class="model-spec-item"><strong>Base Model:</strong> Llama 3.2 3B Instruct (or Mistral / Qwen)</div>
                <div class="model-spec-item"><strong>Output Mode:</strong> Enforced JSON schema for 4-part evidence classification</div>
                <div class="model-spec-item"><strong>Hardware Target:</strong> Embedded Raspberry Pi 5 / Mini PC / Edge GPU</div>
                <div class="model-spec-item"><strong>Configuration:</strong> <code>AI_PROVIDER=ollama</code> (zero subscription cost)</div>
              </div>
            </div>

            <!-- 2. Anthropic Claude -->
            <div class="ai-model-card">
              <div class="model-card-badge-row">
                <span class="provider-pill cloud-pill">OPTIONAL CLOUD ADAPTER</span>
                <span class="model-tag">Claude 3.5 Haiku</span>
              </div>
              <h3 class="model-card-title">High-Parameter Cloud Tier</h3>
              <p class="model-card-desc">
                Pluggable cloud provider for centralized facilities requiring deep contextual synthesis across weeks of historical telemetry, multi-variable regression, and research-grade diagnostic summaries.
              </p>
              <div class="model-specs-list">
                <div class="model-spec-item"><strong>Base Model:</strong> Anthropic Claude 3.5 Haiku</div>
                <div class="model-spec-item"><strong>Output Mode:</strong> Strict JSON response formatting</div>
                <div class="model-spec-item"><strong>Hardware Target:</strong> Secure HTTPS REST API Gateway</div>
                <div class="model-spec-item"><strong>Configuration:</strong> <code>AI_PROVIDER=anthropic</code> + API Key</div>
              </div>
            </div>

            <!-- 3. Heuristic Engine -->
            <div class="ai-model-card">
              <div class="model-card-badge-row">
                <span class="provider-pill rules-pill">FAIL-SAFE BASELINE</span>
                <span class="model-tag">Deterministic Rules</span>
              </div>
              <h3 class="model-card-title">Rule & Kinetic Engine</h3>
              <p class="model-card-desc">
                Deterministic mathematical fallback executing biological kinetics (Monod growth rate, oxygen dissolution models, and pH buffering curves) with zero external LLM dependencies.
              </p>
              <div class="model-specs-list">
                <div class="model-spec-item"><strong>Base Model:</strong> Embedded Biological Kinetic Equations</div>
                <div class="model-spec-item"><strong>Latency:</strong> &lt;1 ms in-memory execution</div>
                <div class="model-spec-item"><strong>Hardware Target:</strong> Any micro-controller / lightweight runtime</div>
                <div class="model-spec-item"><strong>Failover:</strong> Automatic fallback if LLM endpoint is unreachable</div>
              </div>
            </div>
          </div>

          <!-- Query Versioning Bar -->
          <div class="query-versioning-banner">
            <div class="versioning-left">
              <span class="versioning-icon">🏷️</span>
              <div>
                <h4 class="versioning-title">Strict Query Versioning & Provenance Stamping</h4>
                <p class="versioning-sub">Every response from <code>/api/agent</code> and the AI Assistant is stamped with the active base model version, timestamp, and empirical sensor snapshot.</p>
              </div>
            </div>
            <div class="versioning-pills">
              <span class="version-pill">Ollama llama3.2:3b</span>
              <span class="version-pill">JSON Structured Mode</span>
              <span class="version-pill">4-Way Guardrail Segmentation</span>
            </div>
          </div>
        </div>
      </section>

      <!-- AI ASSISTANT SECTION -->
      <section class="section section-ai-chat" id="ai-assistant">
        <div class="section-container">
          <div class="section-header">
            <span class="section-eyebrow">— INTERACTIVE ADVISORY</span>
            <h2 class="section-title">AIRQUA AI Assistant</h2>
            <p class="section-desc">
              Test the AI diagnostic layer below. Every response strictly segments empirical measurements, mathematical calculations, probabilistic predictions, and biological hypotheses.
            </p>
          </div>

          <div class="chat-mount-container" id="ai-chat-mount">
            <!-- Rendered by AIChat component -->
          </div>
        </div>
      </section>
    </div>
  `;
}

export function initAIPageEvents() {
  const mount = document.getElementById("ai-chat-mount");
  if (mount) {
    chatInstance = new AIChat(mount);
  }
}
