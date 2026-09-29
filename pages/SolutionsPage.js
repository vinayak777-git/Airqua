/**
 * AIRQUA Solutions Page
 * Outlines potential environmental, architectural, and industrial applications.
 * Explicitly framed as prospective research and feasibility applications.
 */

import { POTENTIAL_SOLUTIONS } from "../data/demo-data.js";

export function renderSolutionsPage() {
  return `
    <div class="page-solutions">
      <!-- HEADER -->
      <section class="page-intro-header">
        <div class="section-container">
          <div class="intro-badge">PROSPECTIVE DOMAINS</div>
          <h1 class="page-title">Potential Applications & Scalability</h1>
          <p class="page-lead">
            Exploring how modular photobioreactors integrated with IoT sensing and AI automation can address air and water environmental challenges across diverse architectural and industrial contexts.
          </p>
          <div class="research-status-callout">
            <span class="callout-icon">ℹ️</span>
            <span>
              <strong>Scientific Notice:</strong> AIRQUA is currently in laboratory and benchtop prototyping. The deployment scenarios below represent prospective engineering applications under feasibility assessment.
            </span>
          </div>
        </div>
      </section>

      <!-- SOLUTIONS GRID -->
      <section class="section section-solutions-grid">
        <div class="section-container">
          <div class="solutions-cards-wrapper">
            ${POTENTIAL_SOLUTIONS.map(
              (sol) => `
              <div class="solution-card" id="${sol.id}">
                <div class="solution-card-header">
                  <div class="sol-icon-box">${sol.icon}</div>
                  <div class="sol-badge-group">
                    <span class="sol-badge-type">${sol.badge}</span>
                    <span class="sol-badge-status">${sol.status}</span>
                  </div>
                </div>

                <div class="solution-card-body">
                  <h3 class="sol-card-title">${sol.title}</h3>
                  <div class="sol-card-sub">${sol.subtitle}</div>
                  <p class="sol-card-text">${sol.description}</p>
                </div>

                <div class="solution-card-footer">
                  <div class="sol-metric-tag">
                    <span class="metric-tag-label">Target Metrics:</span>
                    <span class="metric-tag-val">${sol.keyMetrics}</span>
                  </div>
                </div>
              </div>
            `
            ).join("")}
          </div>
        </div>
      </section>

      <!-- FEASIBILITY CALLOUT -->
      <section class="section section-feasibility">
        <div class="section-container">
          <div class="feasibility-banner">
            <div class="feasibility-text">
              <h3>Engineering Principles & System Boundaries</h3>
              <p>
                AIRQUA does not rely on oversimplified assumptions such as "algae magically purifies all dirty air." Real-world scale requires rigorous gas-liquid mass transfer engineering, pre-filtration to prevent culture contamination, supplemental LED photon management, and continuous biological culture maintenance.
              </p>
            </div>
            <div class="feasibility-action">
              <a href="/research" class="btn-primary" data-route="/research">
                View R&D Experiments →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}
