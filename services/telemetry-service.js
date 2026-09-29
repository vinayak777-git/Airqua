/**
 * AIRQUA Telemetry Service
 * Clean data abstraction layer connecting IoT / ESP32 feeds (or realistic simulation)
 * to dashboard and analytics components.
 * 
 * Designed for future plug-and-play replacement:
 * ESP32 -> Telemetry Service -> UI Components
 */

import { SENSOR_METRICS, INITIAL_TELEMETRY, generateHistoricalData } from "../data/demo-data.js";

class TelemetryService {
  constructor() {
    this.current = { ...INITIAL_TELEMETRY };
    this.history = generateHistoricalData(30, 24);
    this.listeners = new Set();
    this.pollInterval = null;
    this.isBackendConnected = false;
    this.simulationActive = true;
    this.tickCount = 0;

    // Start polling or simulation
    this.init();
  }

  init() {
    this.checkBackend();
    this.pollInterval = setInterval(() => {
      this.pollOrSimulate();
    }, 3500);
  }

  async checkBackend() {
    try {
      const res = await fetch("/api/current", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        this.isBackendConnected = true;
        this.applyServerData(data);
      } else {
        this.isBackendConnected = false;
      }
    } catch {
      this.isBackendConnected = false;
    }
  }

  async pollOrSimulate() {
    if (this.isBackendConnected) {
      try {
        const res = await fetch("/api/current", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          this.applyServerData(data);
          return;
        }
      } catch {
        this.isBackendConnected = false;
      }
    }

    // Fallback to high-fidelity realistic simulation
    this.simulateTick();
  }

  applyServerData(serverData) {
    const prev = this.current;
    const cur = serverData.current || {};
    
    this.current = {
      ...prev,
      timestamp: serverData.lastUpdated || new Date().toISOString(),
      temperature: cur.temperature !== undefined ? Number(cur.temperature) : prev.temperature,
      ph: cur.ph !== undefined ? Number(cur.ph) : prev.ph,
      co2: cur.co2 !== undefined ? Math.round(cur.co2) : prev.co2,
      dissolvedOxygen: cur.dissolvedOxygen !== undefined ? Number(cur.dissolvedOxygen) : prev.dissolvedOxygen,
      turbidity: cur.turbidity !== undefined ? Number(cur.turbidity) : prev.turbidity,
      algaeHealth: cur.algaeHealth !== undefined ? Number(cur.algaeHealth) : prev.algaeHealth,
      systemStatus: "Online",
      reactorCondition: serverData.overall === "alert" ? "Critical Alert" : serverData.overall === "watch" ? "Attention Required" : "Stable",
      dataQuality: "Good",
      anomalyDetected: serverData.overall !== "normal",
      anomalyDetail: serverData.overall !== "normal" ? "Fluctuation Detected" : "None Detected",
      dataSource: "demo" // Clearly labeled demo data
    };

    this.recordHistoryPoint();
    this.notify();
  }

  simulateTick() {
    this.tickCount++;
    const prev = this.current;

    // Small biological & environmental perturbations
    const aerationEffect = prev.relays.aeration ? 0.05 : -0.08;
    const lightingEffect = prev.relays.lighting ? -1.2 : 0.8; // photosynthesis draws CO2
    const fanEffect = prev.relays.fan ? -0.1 : 0.02;

    const newCo2 = Math.round(Math.max(340, Math.min(850, prev.co2 + lightingEffect + (Math.random() - 0.5) * 6)));
    const newDo = Number(Math.max(3.5, Math.min(10.5, prev.dissolvedOxygen + aerationEffect + (Math.random() - 0.5) * 0.08)).toFixed(1));
    const newPh = Number(Math.max(6.5, Math.min(8.2, prev.ph + (Math.random() - 0.5) * 0.03)).toFixed(2));
    const newTemp = Number(Math.max(22.0, Math.min(32.0, prev.temperature + fanEffect + (Math.random() - 0.5) * 0.1)).toFixed(1));
    const newTurbidity = Number(Math.max(6.0, Math.min(30.0, prev.turbidity + (Math.random() - 0.5) * 0.15)).toFixed(1));
    
    // Algae vitality computed from distance from optimal points
    const optimalTempDist = Math.abs(newTemp - 26.5);
    const optimalPhDist = Math.abs(newPh - 7.2);
    const calculatedVitality = Math.max(70, Math.min(98, 95 - optimalTempDist * 2 - optimalPhDist * 5));

    this.current = {
      ...prev,
      timestamp: new Date().toISOString(),
      co2: newCo2,
      dissolvedOxygen: newDo,
      ph: newPh,
      temperature: newTemp,
      turbidity: newTurbidity,
      algaeHealth: Number(calculatedVitality.toFixed(1)),
      systemStatus: "Online",
      reactorCondition: "Stable",
      dataQuality: "Good",
      anomalyDetected: false,
      anomalyDetail: "None Detected",
      dataSource: "demo"
    };

    if (this.tickCount % 3 === 0) {
      this.recordHistoryPoint();
    }
    this.notify();
  }

  recordHistoryPoint() {
    const cur = this.current;
    const now = new Date();
    this.history.push({
      timestamp: cur.timestamp,
      label: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      co2: cur.co2,
      dissolvedOxygen: cur.dissolvedOxygen,
      ph: cur.ph,
      temperature: cur.temperature,
      turbidity: cur.turbidity,
      algaeHealth: cur.algaeHealth
    });

    if (this.history.length > 50) {
      this.history.shift();
    }
  }

  toggleRelay(relayKey) {
    if (this.current.relays[relayKey] !== undefined) {
      this.current.relays[relayKey] = !this.current.relays[relayKey];
      this.notify();
      return this.current.relays[relayKey];
    }
    return false;
  }

  getStatusFor(metricKey, value) {
    const def = SENSOR_METRICS[metricKey];
    if (!def) return "normal";
    const v = value !== undefined ? value : this.current[metricKey];
    if (v >= def.normalRange[0] && v <= def.normalRange[1]) return "normal";
    if (v >= def.watchRange[0] && v <= def.watchRange[1]) return "watch";
    return "alert";
  }

  getSnapshot() {
    return {
      current: { ...this.current },
      isBackendConnected: this.isBackendConnected,
      statuses: {
        co2: this.getStatusFor("co2"),
        dissolvedOxygen: this.getStatusFor("dissolvedOxygen"),
        ph: this.getStatusFor("ph"),
        temperature: this.getStatusFor("temperature"),
        turbidity: this.getStatusFor("turbidity"),
        algaeHealth: this.getStatusFor("algaeHealth")
      },
      dataSource: "demo"
    };
  }

  getHistory() {
    return [...this.history];
  }

  subscribe(callback) {
    this.listeners.add(callback);
    // Send immediate initial state
    try {
      callback(this.getSnapshot());
    } catch (e) {
      console.error("[AIRQUA Telemetry] Error in subscriber:", e);
    }
    return () => this.listeners.delete(callback);
  }

  notify() {
    const snap = this.getSnapshot();
    for (const listener of this.listeners) {
      try {
        listener(snap);
      } catch (e) {
        console.error("[AIRQUA Telemetry] Error notifying listener:", e);
      }
    }
  }
}

export const telemetryService = new TelemetryService();
