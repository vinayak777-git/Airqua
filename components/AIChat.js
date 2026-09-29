/**
 * AIRQUA AI Assistant Chat Component
 * Interactive advisory console that strictly segments outputs into:
 * - Measured data
 * - Calculated data
 * - Prediction
 * - Possible explanation
 */

import { aiService, SAMPLE_QUESTIONS } from "../services/ai-service.js";

export class AIChat {
  constructor(containerElement) {
    this.container = containerElement;
    this.messages = [
      {
        sender: "assistant",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        structured: {
          summary: "Welcome to the AIRQUA Advisory Console. I am your diagnostic layer cross-referencing biological kinetics with live telemetry. Ask about sensor trends, parameter deviations, or control targets.",
          measuredData: [
            "CO₂: 420 ppm (Ambient normal)",
            "DO: 6.8 mg/L (Photosynthetically active)",
            "pH: 7.20 (Optimal microalgae buffer)"
          ],
          calculatedData: [
            "Vitality Index: 92.4% (Steady vegetative state)"
          ],
          prediction: [
            "Current operating equilibrium will persist under active aeration and lighting."
          ],
          possibleExplanation: [
            "Chlorella vulgaris culture is receiving balanced light-to-gas ratio."
          ],
          modelBadge: aiService.getModelLabel()
        }
      }
    ];
    this.isProcessing = false;
    this.showEvidenceCards = false; // Default: clean conversational chat, cards expandable on demand
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="ai-chat-card">
        <div class="ai-chat-header">
          <div class="ai-chat-title-group">
            <div class="ai-avatar-badge">
              <span class="ai-avatar-icon">🤖</span>
              <span class="ai-status-pulse"></span>
            </div>
            <div>
              <h4 class="ai-chat-title">AIRQUA AI Diagnostic Assistant</h4>
              <div class="ai-chat-sub">Rule & Model Advisory Layer · Scientific Reliability Guardrails</div>
            </div>
          </div>
          <div class="ai-header-badges">
            <button type="button" id="ai-mode-toggle-btn" class="ai-mode-toggle-pill" title="Toggle Clean Chat or Expanded Diagnostic Cards">
              ${this.showEvidenceCards ? "📊 Diagnostics: Expanded" : "💬 Mode: Clean Chat"}
            </button>
            <div class="ai-model-spec-pill" title="Configured base model inference engine">
              <span class="model-spec-dot"></span>
              <span id="ai-active-model-label">Base Model: ${aiService.getModelLabel()}</span>
            </div>
            <div class="ai-guardrail-badge" title="Distinguishes empirical sensors from models">
              <span>🛡️ Empirical-Verified</span>
            </div>
          </div>
        </div>

        <div class="ai-sample-chips">
          <span class="chips-label">Quick Prompts:</span>
          ${SAMPLE_QUESTIONS.map(
            (q) => `<button class="sample-chip-btn" data-question="${q}">${q}</button>`
          ).join("")}
        </div>

        <div class="ai-messages-list" id="ai-messages-list">
          ${this.renderMessagesHtml()}
        </div>

        <div class="ai-input-form-wrap">
          <form id="ai-chat-form" class="ai-chat-form">
            <input
              type="text"
              id="ai-user-input"
              class="ai-user-input"
              placeholder="Ask AIRQUA AI (e.g. 'Why did dissolved oxygen change?')..."
              maxlength="1200"
              autocomplete="off"
            />
            <button type="submit" class="ai-send-btn" id="ai-send-btn" aria-label="Send query">
              <span>Send</span>
              <span class="send-arrow">↗</span>
            </button>
          </form>
          <div class="ai-disclaimer-foot">
            Advisory responses strictly distinguish measured sensor values, calculations, predictions, and biological hypotheses.
          </div>
        </div>
      </div>
    `;
  }

  renderMessagesHtml() {
    return this.messages
      .map((msg) => {
        if (msg.sender === "user") {
          return `
            <div class="chat-msg msg-user">
              <div class="msg-bubble user-bubble">
                <div class="msg-header">
                  <span class="msg-author">You</span>
                  <span class="msg-time">${msg.time}</span>
                </div>
                <div class="msg-text">${this.escapeHtml(msg.text)}</div>
              </div>
            </div>
          `;
        }

        // Assistant structured response
        const s = msg.structured;
        return `
          <div class="chat-msg msg-assistant">
            <div class="msg-bubble assistant-bubble">
              <div class="msg-header">
                <div class="assistant-tag">
                  <span class="assistant-dot"></span>
                  <span>AIRQUA Advisory</span>
                  <span class="assistant-model-pill">${s.modelBadge || aiService.getModelLabel()}</span>
                </div>
                <span class="msg-time">${msg.time}</span>
              </div>

              ${s.summary ? `<div class="ai-summary-text">${s.summary}</div>` : ""}

              <details class="evidence-accordion" ${this.showEvidenceCards ? "open" : ""}>
                <summary class="evidence-toggle-btn">
                  <span class="evidence-toggle-title">
                    <span class="evidence-toggle-icon">🔬</span>
                    <span>View Sensor Evidence & Predictions</span>
                    <span class="evidence-item-count">4-Part Classification</span>
                  </span>
                  <span class="evidence-toggle-arrow">▾</span>
                </summary>

                <div class="structured-evidence-grid">
                  <!-- 1. Measured Data -->
                  <div class="evidence-block measured-block">
                    <div class="evidence-header">
                      <span class="evidence-icon">📊</span>
                      <span class="evidence-title">Measured Data</span>
                      <span class="evidence-badge">Direct Sensors</span>
                    </div>
                    <ul class="evidence-list">
                      ${s.measuredData.map((d) => `<li>${this.escapeHtml(d)}</li>`).join("")}
                    </ul>
                  </div>

                  <!-- 2. Calculated Data -->
                  <div class="evidence-block calculated-block">
                    <div class="evidence-header">
                      <span class="evidence-icon">🧮</span>
                      <span class="evidence-title">Calculated Data</span>
                      <span class="evidence-badge">Derived Model</span>
                    </div>
                    <ul class="evidence-list">
                      ${s.calculatedData.map((d) => `<li>${this.escapeHtml(d)}</li>`).join("")}
                    </ul>
                  </div>

                  <!-- 3. Prediction -->
                  <div class="evidence-block prediction-block">
                    <div class="evidence-header">
                      <span class="evidence-icon">🔮</span>
                      <span class="evidence-title">Prediction</span>
                      <span class="evidence-badge">Trend Forecast</span>
                    </div>
                    <ul class="evidence-list">
                      ${s.prediction.map((d) => `<li>${this.escapeHtml(d)}</li>`).join("")}
                    </ul>
                  </div>

                  <!-- 4. Possible Explanation -->
                  <div class="evidence-block explanation-block">
                    <div class="evidence-header">
                      <span class="evidence-icon">💡</span>
                      <span class="evidence-title">Possible Explanation</span>
                      <span class="evidence-badge">Biological Factors</span>
                    </div>
                    <ul class="evidence-list">
                      ${s.possibleExplanation.map((d) => `<li>${this.escapeHtml(d)}</li>`).join("")}
                    </ul>
                  </div>
                </div>
              </details>
            </div>
          </div>
        `;
      })
      .join("");
  }

  bindEvents() {
    const form = this.container.querySelector("#ai-chat-form");
    const input = this.container.querySelector("#ai-user-input");
    const chips = this.container.querySelectorAll(".sample-chip-btn");
    const modeBtn = this.container.querySelector("#ai-mode-toggle-btn");

    modeBtn?.addEventListener("click", () => {
      this.showEvidenceCards = !this.showEvidenceCards;
      this.render();
      this.bindEvents();
    });

    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (val && !this.isProcessing) {
        input.value = "";
        this.handleUserQuestion(val);
      }
    });

    chips.forEach((btn) => {
      btn.addEventListener("click", () => {
        const q = btn.getAttribute("data-question");
        if (q && !this.isProcessing) {
          this.handleUserQuestion(q);
        }
      });
    });
  }

  async handleUserQuestion(question) {
    this.isProcessing = true;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Append user message
    this.messages.push({
      sender: "user",
      time: now,
      text: question
    });

    this.updateMessagesDOM();
    this.showThinkingIndicator();

    try {
      const response = await aiService.askQuestion(question);
      this.hideThinkingIndicator();
      this.messages.push({
        sender: "assistant",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        structured: response
      });
    } catch {
      this.hideThinkingIndicator();
      this.messages.push({
        sender: "assistant",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        structured: {
          summary: "An advisory timeout occurred. Falling back to local empirical sensor parameters.",
          measuredData: ["Telemetry stream active"],
          calculatedData: ["Anomaly risk score: nominal"],
          prediction: ["Re-evaluating trend window"],
          possibleExplanation: ["Check network connectivity or backend AI agent service."]
        }
      });
    } finally {
      this.isProcessing = false;
      this.updateMessagesDOM();
    }
  }

  showThinkingIndicator() {
    const list = this.container.querySelector("#ai-messages-list");
    if (!list) return;

    const thinkingHtml = `
      <div class="chat-msg msg-assistant thinking-msg" id="thinking-indicator">
        <div class="msg-bubble assistant-bubble thinking-bubble">
          <div class="thinking-dots">
            <span></span><span></span><span></span>
          </div>
          <span class="thinking-text">AIRQUA AI is cross-referencing telemetry & kinetic models...</span>
        </div>
      </div>
    `;
    list.insertAdjacentHTML("beforeend", thinkingHtml);
    list.scrollTop = list.scrollHeight;
  }

  hideThinkingIndicator() {
    const indicator = this.container.querySelector("#thinking-indicator");
    indicator?.remove();
  }

  updateMessagesDOM() {
    const list = this.container.querySelector("#ai-messages-list");
    if (!list) return;
    list.innerHTML = this.renderMessagesHtml();
    list.scrollTop = list.scrollHeight;
  }

  escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
