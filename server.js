require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Anthropic = require("@anthropic-ai/sdk");
const Reading = require("./Reading");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
const MODEL = "claude-sonnet-5";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/airqua";

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

// ---------------------------------------------------------------------------
// Simulated telemetry (no physical sensors deployed yet — ESP32 + DS18B20 +
// potentiometers standing in for CO2/pH/algae-health in the Velxio.dev sim).
// Every tick is persisted to MongoDB so /api/history has something real to
// read back, matching the "MongoDB persisted" demo-data note in the UI.
// ---------------------------------------------------------------------------

const METRICS = {
  temperature: { normal: [22, 29], watch: [18, 32], min: 10, max: 40 },
  ph: { normal: [6.8, 7.8], watch: [6.4, 8.2], min: 4, max: 10 },
  co2: { normal: [350, 700], watch: [700, 1000], min: 300, max: 1600 },
  algaeHealth: { normal: [70, 100], watch: [40, 70], min: 0, max: 100 },
};

let current = { temperature: 24.1, ph: 7.72, co2: 742, algaeHealth: 68.4 };
let lastUpdated = new Date();
let anomaly = null;
let dbReady = false;

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}
function spanOf(metric) {
  return METRICS[metric].max - METRICS[metric].min;
}
function statusFor(metric, value) {
  const { normal, watch } = METRICS[metric];
  if (value >= normal[0] && value <= normal[1]) return "normal";
  if (value >= watch[0] && value <= watch[1]) return "watch";
  return "alert";
}
function statuses() {
  return Object.fromEntries(Object.keys(METRICS).map((k) => [k, statusFor(k, current[k])]));
}
function overallStatus(st) {
  const order = { alert: 2, watch: 1, normal: 0 };
  return Object.values(st).reduce((worst, s) => (order[s] > order[worst] ? s : worst), "normal");
}

async function tick() {
  current.temperature = clamp(current.temperature + (Math.random() - 0.5) * 0.4, METRICS.temperature.min, METRICS.temperature.max);
  current.ph = clamp(current.ph + (Math.random() - 0.5) * 0.05, METRICS.ph.min, METRICS.ph.max);
  current.co2 = clamp(current.co2 + (Math.random() - 0.5) * 20, METRICS.co2.min, METRICS.co2.max);
  current.algaeHealth = clamp(current.algaeHealth + (Math.random() - 0.5) * 1.5, METRICS.algaeHealth.min, METRICS.algaeHealth.max);

  if (!anomaly && Math.random() < 0.02) {
    const keys = Object.keys(METRICS);
    anomaly = {
      metric: keys[Math.floor(Math.random() * keys.length)],
      ticksLeft: 10 + Math.floor(Math.random() * 10),
      dir: Math.random() < 0.5 ? 1 : -1,
    };
  }
  if (anomaly) {
    current[anomaly.metric] = clamp(
      current[anomaly.metric] + anomaly.dir * spanOf(anomaly.metric) * 0.05,
      METRICS[anomaly.metric].min,
      METRICS[anomaly.metric].max
    );
    anomaly.ticksLeft -= 1;
    if (anomaly.ticksLeft <= 0) anomaly = null;
  }

  lastUpdated = new Date();

  if (dbReady) {
    try {
      await Reading.create({ ...current, timestamp: lastUpdated });
    } catch (err) {
      console.error("[AIRQUA] failed to persist reading:", err.message);
    }
  }
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.get("/api/current", (req, res) => {
  const st = statuses();
  res.json({ current, statuses: st, overall: overallStatus(st), lastUpdated, dbConnected: dbReady });
});

app.get("/api/history", async (req, res) => {
  const days = req.query.range === "7d" ? 7 : 1;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  if (!dbReady) {
    return res.json({ history: [], dbConnected: false });
  }
  try {
    const docs = await Reading.find({ timestamp: { $gte: since } }).sort({ timestamp: 1 }).limit(3000).lean();
    const maxPoints = 80;
    const step = Math.max(1, Math.floor(docs.length / maxPoints));
    const sampled = docs.filter((_, i) => i % step === 0);
    res.json({ history: sampled, dbConnected: true });
  } catch (err) {
    console.error("[AIRQUA] history query failed:", err.message);
    res.status(500).json({ error: "Failed to load history", dbConnected: dbReady });
  }
});

app.get("/api/insights", async (req, res) => {
  const st = statuses();
  const overall = overallStatus(st);

  if (anthropic) {
    try {
      const result = await claudeInsights(st, overall);
      return res.json({ ok: true, aiPowered: true, ...result });
    } catch (err) {
      console.error("[AIRQUA] Claude insights failed, using fallback:", err.message);
    }
  }
  res.json({ ok: true, aiPowered: false, ...ruleBasedInsights(st, overall) });
});

async function claudeInsights(st, overall) {
  const system = `You are the AI decision-support layer inside AIRQUA, an algae bioremediation telemetry console (prototype hardware: ESP32, DS18B20 temperature sensor, potentiometers simulating CO2/pH/algae-health, relays for air/water pumps).
Given the current readings and their status, respond with ONLY raw JSON, no markdown or commentary, in exactly this shape:
{"confidence": <int 0-100, how confident the system is in this readout>,
"headline": "<one short sentence framing what's happening overall, for a non-technical viewer>",
"signals": [{"title":"<short punchy title, max 6 words>", "detail":"<one sentence with the actual numbers>", "severity":"normal"|"watch"|"alert"}, ... exactly one entry per metric, in this order: temperature, ph, co2, algaeHealth]}`;

  const userText = `Temperature: ${current.temperature.toFixed(1)}°C (${st.temperature})
pH: ${current.ph.toFixed(2)} (${st.ph})
CO2: ${Math.round(current.co2)} ppm (${st.co2})
Algae Health: ${current.algaeHealth.toFixed(1)}% (${st.algaeHealth})
Overall status: ${overall}`;

  const resp = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 500,
    system,
    messages: [{ role: "user", content: userText }],
  });
  const text = resp.content.map((b) => b.text || "").join("\n").trim();
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const parsed = JSON.parse(cleaned);
  if (!parsed.signals || !parsed.signals.length) throw new Error("Malformed insights payload");
  return parsed;
}

function ruleBasedInsights(st, overall) {
  const signals = Object.entries(st).map(([metric, status]) => {
    let title, detail;
    if (metric === "temperature") {
      title = status === "normal" ? "Thermal profile is steady" : status === "watch" ? "Thermal profile needs a look" : "Thermal profile is out of range";
      detail = `Temperature is holding at ${current.temperature.toFixed(1)}°C.`;
    } else if (metric === "ph") {
      title = status === "normal" ? "pH remains balanced" : status === "watch" ? "pH is drifting" : "pH is out of range";
      detail = `Current reading is ${current.ph.toFixed(2)}.`;
    } else if (metric === "co2") {
      title = status === "normal" ? "CO2 is stable" : "CO2 is being monitored";
      detail = `CO2 is at ${Math.round(current.co2)} ppm; ventilation headroom is ${Math.max(0, Math.round(METRICS.co2.watch[1] - current.co2))} ppm.`;
    } else {
      title = status === "normal" ? "Algae vitality is healthy" : "Algae vitality needs attention";
      detail = `Health index is ${current.algaeHealth.toFixed(1)}%, ${status === "normal" ? "above" : "near or below"} the ${METRICS.algaeHealth.normal[0]}% watch threshold.`;
    }
    return { title, detail, severity: status };
  });

  const confidence =
    overall === "normal" ? 90 + Math.round(Math.random() * 8) :
    overall === "watch" ? 70 + Math.round(Math.random() * 15) :
    40 + Math.round(Math.random() * 20);

  return {
    confidence,
    headline: overall === "normal" ? "All signals look steady." : "One or more signals deserve a closer look during the next review.",
    signals,
  };
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    dbReady = true;
    console.log("[AIRQUA] connected to MongoDB —", MONGODB_URI);
  })
  .catch((err) => {
    console.error("[AIRQUA] MongoDB connection failed — running without persistence:", err.message);
  });

setInterval(tick, 5000);

app.listen(PORT, () => {
  console.log(`AIRQUA telemetry console running at http://localhost:${PORT}`);
  if (!anthropic) {
    console.log("[AIRQUA] No ANTHROPIC_API_KEY set — insights will use the rule-based fallback.");
  }
});
