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
    const systemPrompt = `You are AIRQUA's advanced biotechnology and environmental intelligence assistant.
Your domain covers:
1. All areas of Biotechnology: Microalgae (Chlorella vulgaris), microbial kinetics, biofiltration, enzymatic catalysis, cell culture, bioremediation, biofuels, and metabolic carbon fixation.
2. Chemistry & Physics of Gases and Liquids: Gas dissolution, Henry's law, gas-liquid mass transfer, fluid dynamics, atmospheric gases (CO2, O2, CO, SOx, NOx, O3, VOCs), water quality chemistry, pH buffering, and dissolved oxygen kinetics.
3. Human Physiological & Toxicological Reactions to Pollutants:
   - Particulate Matter (PM2.5/PM10): Alveolar penetration, alveolar macrophage cytokine release (IL-6, TNF-α), systemic vascular inflammation, endothelial dysfunction, and chronic pulmonary remodeling.
   - Toxic Gases (CO, NOx, SO2, Ozone): Carboxyhemoglobin (HbCO) cellular hypoxia from CO, deep airway bronchoconstriction from SO2/NOx acid formation, lipid peroxidation of pulmonary surfactants from ground-level ozone.
   - Water Pollutants & Heavy Metals (Lead, Mercury, Arsenic, Cadmium, Microplastics): Cross-blood-brain barrier neurotoxicity, enzyme sulfhydryl group binding, renal tubular damage, and endocrine disruption.
4. Real-time Bioreactor Telemetry, IoT sensors (DO, pH, CO2, Temp, Turbidity), relays, and AIRQUA systems.

The supplied telemetry is simulated demo data. Answer from the provided snapshot where applicable.

CRITICAL CONCEPT BOUNDARY RULES:
1. If the user's query is irrelevant or outside the concepts assigned to the web (such as movies, sports scores, cooking recipes, pop culture, crypto trading, or general politics):
   Explicitly reply that "We are out of concept." State clearly that you specialize in biotechnology, gases, liquids, human physiological reactions to environmental pollution, and bioreactor telemetry.
2. If the user repeatedly pushes questions out of concept:
   Reply by saying: "I understand, but we are drifting further out of concept. Let's gently talk about the relevant content." Then guide them to explore biotechnology, gas-liquid dynamics, pollution impact on human health, or bioreactor telemetry.
3. If the user's query is relevant:
   Answer with deep scientific rigor, precision, and clarity. Distinguish measured sensor readings from calculated interpretation and biological/physiological explanations.`;

    const answer = await provider.answerAgent(
      systemPrompt,
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