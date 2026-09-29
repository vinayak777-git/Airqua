/**
 * AIRQUA Dashboard Page
 * Mounts the full Command Center interface and handles its lifecycle.
 */

import { Dashboard } from "../components/Dashboard.js";

let dashboardInstance = null;

export function renderDashboardPage() {
  return `
    <div class="page-dashboard">
      <div class="dashboard-mount-point" id="dashboard-mount-point">
        <!-- Rendered by Dashboard component -->
      </div>
    </div>
  `;
}

export function initDashboardPageEvents() {
  const mount = document.getElementById("dashboard-mount-point");
  if (mount) {
    if (dashboardInstance) {
      dashboardInstance.destroy();
    }
    dashboardInstance = new Dashboard(mount);
    return () => {
      if (dashboardInstance) {
        dashboardInstance.destroy();
        dashboardInstance = null;
      }
    };
  }
}
