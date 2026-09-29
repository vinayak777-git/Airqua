const METRICS = ["temperature", "ph", "co2", "algaeHealth"];
const SEVERITIES = new Set(["normal", "watch", "alert"]);

function parseInsightPayload(payload) {
  if (!payload || typeof payload !== "object") throw new Error("Invalid insights payload");
  if (!Number.isFinite(payload.confidence) || payload.confidence < 0 || payload.confidence > 100) {
    throw new Error("Invalid insight confidence");
  }
  if (typeof payload.headline !== "string" || !payload.headline.trim()) {
    throw new Error("Invalid insight headline");
  }
  if (!Array.isArray(payload.signals) || payload.signals.length !== METRICS.length) {
    throw new Error("Invalid insight signals");
  }

  const signals = payload.signals.map((signal, index) => {
    if (
      !signal ||
      typeof signal.title !== "string" ||
      typeof signal.detail !== "string" ||
      !SEVERITIES.has(signal.severity)
    ) {
      throw new Error("Invalid insight signal");
    }
    return {
      metric: METRICS[index],
      title: signal.title.slice(0, 100),
      detail: signal.detail.slice(0, 300),
      severity: signal.severity,
    };
  });

  return {
    confidence: Math.round(payload.confidence),
    headline: payload.headline.slice(0, 240),
    signals,
  };
}

function ruleBasedInsights(current, statuses, overall) {
  const signals = METRICS.map((metric) => {
    const status = statuses[metric];
    const definitions = {
      temperature: ["Thermal profile", `Temperature is ${current.temperature.toFixed(1)}°C.`],
      ph: ["pH balance", `Current pH is ${current.ph.toFixed(2)}.`],
      co2: ["CO₂ concentration", `CO₂ is ${Math.round(current.co2)} ppm.`],
      algaeHealth: ["Algae health index", `The demo index is ${current.algaeHealth.toFixed(1)}%.`],
    };
    const [label, detail] = definitions[metric];
    return {
      metric,
      title: `${label} ${status === "normal" ? "is in range" : `needs review (${status})`}`,
      detail,
      severity: status,
    };
  });

  return {
    confidence: 0,
    headline: overall === "normal" ? "Demo readings are within configured ranges." : "One or more demo readings are outside the normal range.",
    signals,
  };
}

function createAiPipeline({ provider = null, providerName = "rules", model = "rules" } = {}) {
  const system = "You are AIRQUA's advisory analysis layer. All supplied readings are simulated demo data, not live sensor measurements. Do not claim real-world performance, infer unprovided facts, or issue control commands. Return JSON only with confidence (integer 0-100), headline (one short sentence), and signals (exactly four items in this order: temperature, ph, co2, algaeHealth), each with title, detail, and severity (normal, watch, or alert). Base severity on the supplied status; describe causes only as possibilities.";

  async function insights(snapshot) {
    if (!provider?.generateInsights) {
      return { ...ruleBasedInsights(snapshot.current, snapshot.statuses, snapshot.overall), aiPowered: false, provider: "rules", model: "rules" };
    }
    try {
      const result = parseInsightPayload(await provider.generateInsights(system, snapshot));
      return { ...result, aiPowered: true, provider: providerName, model };
    } catch (error) {
      console.error(`[AIRQUA] ${providerName} insights failed; using rules:`, error.message);
      return {
        ...ruleBasedInsights(snapshot.current, snapshot.statuses, snapshot.overall),
        aiPowered: false,
        provider: "rules",
        model: "rules",
        fallbackReason: "AI provider unavailable or returned an invalid response",
      };
    }
  }

  async function ask(question, snapshot) {
    if (!provider?.answerAgent) throw new Error("The configured AI provider does not support agent mode");
    const answer = await provider.answerAgent(
      "You are AIRQUA's advisory assistant. The supplied telemetry is simulated demo data, not live measurements. Answer only from the provided snapshot. Distinguish values in the snapshot from calculated interpretation and possible explanations. If the snapshot cannot answer, say so. Never claim you changed equipment or issue instructions to actuate hardware. Keep the answer concise.",
      { question, snapshot }
    );
    return {
      answer,
      provider: providerName,
      model,
      mode: "advisory",
      dataSource: "demo",
      snapshot: snapshot.current,
    };
  }

  return {
    insights,
    ask,
    status: { provider: providerName, model, agentMode: Boolean(provider?.answerAgent) },
  };
}

module.exports = { createAiPipeline, parseInsightPayload, ruleBasedInsights };