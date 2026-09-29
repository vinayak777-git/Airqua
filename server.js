require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Reading = require("./Reading");
const { createOllamaProvider } = require("./providers/ollama");
const { createAnthropicProvider } = require("./providers/anthropic");
const { createAiPipeline } = require("./services/ai-pipeline");

const app = express();
app.use(express.json({ limit: "32kb" }));
app.get("/console", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get(["/", "/dashboard", "/technology", "/solutions", "/ai", "/research", "/about", "/contact"], (req, res) => {
  res.sendFile(path.join(__dirname, "site.html"));
});
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/airqua";
const AI_PROVIDER = (process.env.AI_PROVIDER || "ollama").toLowerCase();
const DEFAULT_MODEL = AI_PROVIDER === "anthropic" ? "claude-3-5-haiku-latest" : AI_PROVIDER === "ollama" ? "llama3.2:3b" : "rules";
const AI_MODEL = process.env.AI_MODEL || DEFAULT_MODEL;
let aiProvider = null;

if (AI_PROVIDER === "ollama") {
  aiProvider = createOllamaProvider({
    baseUrl: process.env.OLLAMA_BASE_URL,
    model: AI_MODEL,
    timeoutMs: Number(process.env.AI_TIMEOUT_MS) || 45000,
  });
} else if (AI_PROVIDER === "anthropic" && process.env.ANTHROPIC_API_KEY) {
  aiProvider = createAnthropicProvider({ apiKey: process.env.ANTHROPIC_API_KEY, model: AI_MODEL });
} else if (AI_PROVIDER !== "rules") {
  console.warn(`[AIRQUA] AI provider "${AI_PROVIDER}" is unavailable or not configured; using rules.`);
}

const aiPipeline = createAiPipeline({ provider: aiProvider, providerName: AI_PROVIDER, model: AI_MODEL });

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
  dissolvedOxygen: { normal: [6.0, 8.5], watch: [4.5, 6.0], min: 2, max: 14 },
  turbidity: { normal: [8, 18], watch: [18, 30], min: 1, max: 100 },
  algaeHealth: { normal: [70, 100], watch: [40, 70], min: 0, max: 100 },
};

let current = { temperature: 27.0, ph: 7.20, co2: 420, dissolvedOxygen: 6.8, turbidity: 12.0, algaeHealth: 92.4 };
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

function getSnapshot() {
  const readings = { ...current };
  const readingStatuses = statuses();
  return {
    current: readings,
    statuses: readingStatuses,
    overall: overallStatus(readingStatuses),
    lastUpdated,
    dataSource: "demo",
    dataSourceNotice: "This is only for mock purpose data. Once connection is restored with real-time hardware services, live sensor data will be used.",
  };
}

async function tick() {
  current.temperature = clamp(current.temperature + (Math.random() - 0.5) * 0.4, METRICS.temperature.min, METRICS.temperature.max);
  current.ph = clamp(current.ph + (Math.random() - 0.5) * 0.05, METRICS.ph.min, METRICS.ph.max);
  current.co2 = clamp(current.co2 + (Math.random() - 0.5) * 20, METRICS.co2.min, METRICS.co2.max);
  current.dissolvedOxygen = clamp(current.dissolvedOxygen + (Math.random() - 0.5) * 0.1, METRICS.dissolvedOxygen.min, METRICS.dissolvedOxygen.max);
  current.turbidity = clamp(current.turbidity + (Math.random() - 0.5) * 0.3, METRICS.turbidity.min, METRICS.turbidity.max);
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
  res.json({ ...getSnapshot(), dbConnected: dbReady });
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

app.get("/api/ai/status", (req, res) => {
  res.json({ ...aiPipeline.status, configured: Boolean(aiProvider), dataSource: "demo" });
});

app.get("/api/insights", async (req, res) => {
  res.json({ ok: true, ...await aiPipeline.insights(getSnapshot()) });
});

app.post("/api/agent", async (req, res) => {
  const question = typeof req.body?.question === "string" ? req.body.question.trim() : "";
  if (!question || question.length > 1200) {
    return res.status(400).json({ error: "Enter a question of 1 to 1200 characters." });
  }
  if (!aiProvider) {
    return res.status(503).json({ error: "Agent mode is not configured. Select Ollama or configure a supported provider." });
  }

  try {
    res.json({ ok: true, ...await aiPipeline.ask(question, getSnapshot()) });
  } catch (error) {
    console.error(`[AIRQUA] ${AI_PROVIDER} agent request failed:`, error.message);
    res.status(502).json({ error: "The AI provider could not complete the request. Check its availability and model configuration." });
  }
});

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
  if (!aiProvider) {
    console.log(`[AIRQUA] AI provider ${AI_PROVIDER} is not configured — using the rule-based fallback.`);
  } else {
    console.log(`[AIRQUA] AI provider configured: ${AI_PROVIDER} / ${AI_MODEL}`);
  }
});
