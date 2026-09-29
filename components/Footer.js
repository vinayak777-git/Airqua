/**
 * AIRQUA Footer Component
 * Professional environmental-tech footer with complete sitemap,
 * research integrity disclaimer, and system status indicator.
 */

export function renderFooter() {
  return `
    <footer class="airqua-footer">
      <div class="footer-container">
        <div class="footer-top-grid">
          <div class="footer-brand-col">
            <div class="footer-brand">
              <span class="footer-brand-glyph">⬡</span>
              <span class="footer-brand-name">AIRQUA</span>
            </div>
            <p class="footer-mission">
              Developing intelligent environmental systems through the synthesis of microalgal biology, embedded IoT sensing, and adaptive AI automation.
            </p>
            <div class="footer-formula">
              <code>Biology + Sensors + IoT + AI → Intelligent Systems</code>
            </div>
          </div>

          <div class="footer-nav-col">
            <h5 class="footer-heading">Platform</h5>
            <ul class="footer-links">
              <li><a href="/" data-route="/">Home Overview</a></li>
              <li><a href="/technology" data-route="/technology">Technology & Specs</a></li>
              <li><a href="/solutions" data-route="/solutions">Potential Applications</a></li>
              <li><a href="/dashboard" data-route="/dashboard">Live Command Center</a></li>
            </ul>
          </div>

          <div class="footer-nav-col">
            <h5 class="footer-heading">Intelligence & Science</h5>
            <ul class="footer-links">
              <li><a href="/ai" data-route="/ai">AI Diagnostic Layer</a></li>
              <li><a href="/research" data-route="/research">R&D Experiments</a></li>
              <li><a href="/about" data-route="/about">Project Vision & Origins</a></li>
              <li><a href="/contact" data-route="/contact">Collaboration & Contact</a></li>
            </ul>
          </div>

          <div class="footer-nav-col">
            <h5 class="footer-heading">Scientific Integrity</h5>
            <div class="footer-disclaimer-box">
              <span class="disclaimer-icon">ℹ️</span>
              <p>
                AIRQUA is an active R&D initiative focusing on <em>Chlorella vulgaris</em> photobioreactor kinetics. All telemetry displays marked "DEMO DATA" are simulated models until field-verified ESP32 hardware is connected.
              </p>
            </div>
          </div>
        </div>

        <div class="footer-bottom-bar">
          <div class="footer-bottom-left">
            <span>© ${new Date().getFullYear()} AIRQUA Environmental Technologies. All rights reserved.</span>
            <span class="footer-sep">·</span>
            <span class="developer-tag">Developed By <strong class="developer-name">Team AIRQUA</strong></span>
            <span class="footer-sep">·</span>
            <span class="developer-lead">Lead: V. V. Vinayak</span>
            <span class="footer-sep">·</span>
            <span>Sense → Understand → Predict → Act → Learn</span>
          </div>
          <div class="footer-bottom-right">
            <span class="status-live-indicator">
              <span class="status-dot online"></span> Sentry Node: Online
            </span>
          </div>
        </div>

        <div class="footer-signature-bar">
          <span class="signature-line"></span>
          <span class="signature-text">Developed By Team AIRQUA</span>
          <span class="signature-line"></span>
        </div>
      </div>
    </footer>
  `;
}
