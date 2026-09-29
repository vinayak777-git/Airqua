/**
 * AIRQUA Contact Page
 * Collaboration, academic inquiry, and project communication form with interactive validation.
 */

export function renderContactPage() {
  return `
    <div class="page-contact">
      <!-- HEADER -->
      <section class="page-intro-header">
        <div class="section-container">
          <div class="intro-badge">GET IN TOUCH</div>
          <h1 class="page-title">Connect with AIRQUA</h1>
          <p class="page-lead">
            Interested in academic partnerships, biological photobioreactor research, or reviewing telemetry datasets? Reach out to the AIRQUA development team.
          </p>
        </div>
      </section>

      <!-- CONTACT CONTENT -->
      <section class="section section-contact-body">
        <div class="section-container">
          <div class="contact-grid">
            <!-- Left: Contact Form -->
            <div class="contact-form-card">
              <h3 class="form-title">Send a Message</h3>
              <p class="form-subtitle">We welcome scientific inquiries, technology feedback, and collaboration proposals.</p>

              <form id="contact-form" class="airqua-form" novalidate>
                <div class="form-group">
                  <label for="contact-name" class="form-label">Full Name <span class="required">*</span></label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    class="form-input"
                    placeholder="Dr. Jane Smith or Vinayak"
                    required
                  />
                  <span class="field-error" id="name-error"></span>
                </div>

                <div class="form-group">
                  <label for="contact-email" class="form-label">Email Address <span class="required">*</span></label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    class="form-input"
                    placeholder="researcher@university.edu"
                    required
                  />
                  <span class="field-error" id="email-error"></span>
                </div>

                <div class="form-group">
                  <label for="contact-interest" class="form-label">Inquiry Type</label>
                  <select id="contact-interest" name="interest" class="form-select">
                    <option value="research">Academic / R&D Collaboration</option>
                    <option value="hardware">Hardware & ESP32 IoT Development</option>
                    <option value="ai">AI Anomaly & Kinetics Modeling</option>
                    <option value="deployment">Prospective Site Feasibility</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="contact-message" class="form-label">Message <span class="required">*</span></label>
                  <textarea
                    id="contact-message"
                    name="message"
                    class="form-textarea"
                    rows="5"
                    placeholder="Share your research interests, project questions, or inquiry details..."
                    required
                  ></textarea>
                  <span class="field-error" id="message-error"></span>
                </div>

                <button type="submit" class="btn-submit" id="contact-submit-btn">
                  <span>Send Message</span>
                  <span class="btn-submit-arrow">→</span>
                </button>

                <div id="contact-feedback" class="form-feedback" style="display:none;"></div>
              </form>
            </div>

            <!-- Right: Info & Channels -->
            <div class="contact-info-col">
              <div class="info-card">
                <div class="info-icon">🔬</div>
                <h4>R&D Laboratory Prototype</h4>
                <p>
                  Current biological testing is focused on benchtop 10 L <em>Chlorella vulgaris</em> photobioreactor vessels with 5-channel continuous telemetry logging.
                </p>
                <div class="info-tag">Benchtop Hardware Phase</div>
              </div>

              <div class="info-card">
                <div class="info-icon">💻</div>
                <h4>Developer & Research Resources</h4>
                <p>
                  AIRQUA telemetry schemas, simulated firmware scripts, and data models are designed to be extensible and open to the scientific community.
                </p>
                <div class="project-links-list">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="proj-link-item">
                    <span class="proj-link-icon">⌥</span>
                    <div>
                      <div class="proj-link-title">GitHub Repository</div>
                      <div class="proj-link-desc">github.com/vinayak777-git/Airqua</div>
                    </div>
                  </a>
                  <a href="/research" data-route="/research" class="proj-link-item">
                    <span class="proj-link-icon">📄</span>
                    <div>
                      <div class="proj-link-title">R&D Documentation</div>
                      <div class="proj-link-desc">Review active experiments 001–003</div>
                    </div>
                  </a>
                  <a href="/dashboard" data-route="/dashboard" class="proj-link-item">
                    <span class="proj-link-icon">⚡</span>
                    <div>
                      <div class="proj-link-title">Live Telemetry Console</div>
                      <div class="proj-link-desc">View simulated ESP32 data stream</div>
                    </div>
                  </a>
                </div>
              </div>

              <div class="info-card transparency-card">
                <div class="info-icon">🛡️</div>
                <h4>Research Integrity Guarantee</h4>
                <p>
                  We are committed to transparent science. All demo data points on this platform are explicitly identified as simulations until physical sensor hardware calibrations are completed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

export function initContactPageEvents() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const nameInput = document.getElementById("contact-name");
  const emailInput = document.getElementById("contact-email");
  const msgInput = document.getElementById("contact-message");
  const feedback = document.getElementById("contact-feedback");
  const submitBtn = document.getElementById("contact-submit-btn");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      document.getElementById("name-error").textContent = "Please enter your name.";
      nameInput.classList.add("input-error");
      isValid = false;
    } else {
      document.getElementById("name-error").textContent = "";
      nameInput.classList.remove("input-error");
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      document.getElementById("email-error").textContent = "Please enter a valid email address.";
      emailInput.classList.add("input-error");
      isValid = false;
    } else {
      document.getElementById("email-error").textContent = "";
      emailInput.classList.remove("input-error");
    }

    // Validate Message
    if (!msgInput.value.trim() || msgInput.value.trim().length < 10) {
      document.getElementById("message-error").textContent = "Message must be at least 10 characters.";
      msgInput.classList.add("input-error");
      isValid = false;
    } else {
      document.getElementById("message-error").textContent = "";
      msgInput.classList.remove("input-error");
    }

    if (!isValid) return;

    // Simulate submission
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Transmitting...</span> <span class="spinner-mini"></span>`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Send Message</span> <span class="btn-submit-arrow">→</span>`;
      form.reset();

      if (feedback) {
        feedback.style.display = "block";
        feedback.className = "form-feedback success";
        feedback.innerHTML = `
          <strong>✓ Thank you for reaching out!</strong><br/>
          Your message has been logged. An AIRQUA researcher or technical lead will review your inquiry shortly.
        `;
        setTimeout(() => {
          feedback.style.display = "none";
        }, 8000);
      }
    }, 900);
  });
}
