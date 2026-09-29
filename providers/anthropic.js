function createAnthropicProvider({ apiKey, model = "claude-3-5-haiku-latest" } = {}) {
  const Anthropic = require("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey });

  async function complete(system, input, maxTokens) {
    const response = await client.messages.create({
      model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: JSON.stringify(input) }],
    });
    return response.content.map((block) => block.text || "").join("\n").trim();
  }

  return {
    name: "anthropic",
    model,
    async generateInsights(system, input) {
      const text = await complete(system, input, 700);
      return JSON.parse(text.replace(/```json/gi, "").replace(/```/g, "").trim());
    },
    async answerAgent(system, input) {
      return complete(system, input, 500);
    },
  };
}

module.exports = { createAnthropicProvider };