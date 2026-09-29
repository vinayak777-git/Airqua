const assert = require("node:assert/strict");
const http = require("node:http");
const test = require("node:test");
const { createOllamaProvider } = require("../providers/ollama");
const { createAiPipeline, parseInsightPayload } = require("../services/ai-pipeline");

const snapshot = {
  current: { temperature: 24.1, ph: 7.72, co2: 742, algaeHealth: 68.4 },
  statuses: { temperature: "normal", ph: "normal", co2: "watch", algaeHealth: "watch" },
  overall: "watch",
  dataSource: "demo",
};

const modelInsights = {
  confidence: 82,
  headline: "Two demo signals need review.",
  signals: ["temperature", "ph", "co2", "algaeHealth"].map((metric) => ({
    metric,
    title: `${metric} signal`,
    detail: "Based on the supplied demo snapshot.",
    severity: metric === "co2" || metric === "algaeHealth" ? "watch" : "normal",
  })),
};

test("fallback insights are available without a model provider", async () => {
  const pipeline = createAiPipeline();
  const result = await pipeline.insights(snapshot);

  assert.equal(result.aiPowered, false);
  assert.equal(result.provider, "rules");
  assert.equal(result.signals.length, 4);
  assert.equal(result.headline, "One or more demo readings are outside the normal range.");
});

test("model insights are validated and receive stable metric identities", async () => {
  const pipeline = createAiPipeline({
    provider: { generateInsights: async () => modelInsights },
    providerName: "ollama",
    model: "llama3.2:3b",
  });
  const result = await pipeline.insights(snapshot);

  assert.equal(result.aiPowered, true);
  assert.equal(result.provider, "ollama");
  assert.deepEqual(result.signals.map((signal) => signal.metric), ["temperature", "ph", "co2", "algaeHealth"]);
});

test("malformed model insights are rejected", () => {
  assert.throws(() => parseInsightPayload({ ...modelInsights, confidence: 140 }), /confidence/);
  assert.throws(() => parseInsightPayload({ ...modelInsights, signals: [] }), /signals/);
});

test("Ollama adapter uses chat JSON mode and supports advisory chat", async (context) => {
  const requests = [];
  const server = http.createServer(async (request, response) => {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    requests.push(JSON.parse(Buffer.concat(chunks).toString()));
    const content = requests.length === 1 ? JSON.stringify(modelInsights) : "Review the pH trend alongside temperature.";
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ message: { content } }));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  context.after(() => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));

  const address = server.address();
  const provider = createOllamaProvider({ baseUrl: `http://127.0.0.1:${address.port}`, model: "test-model" });
  const insights = await provider.generateInsights("system", snapshot);
  const answer = await provider.answerAgent("agent system", { question: "Why pH?", snapshot });

  assert.deepEqual(insights, modelInsights);
  assert.equal(answer, "Review the pH trend alongside temperature.");
  assert.equal(requests[0].model, "test-model");
  assert.equal(requests[0].format, "json");
  assert.equal(requests[0].stream, false);
  assert.equal(requests[1].format, undefined);
});