const DEFAULT_BASE_URL = "http://127.0.0.1:11434";

function createOllamaProvider({ baseUrl = DEFAULT_BASE_URL, model = "llama3.2:3b", timeoutMs = 45000 } = {}) {
  const endpoint = `${baseUrl.replace(/\/$/, "")}/api/chat`;

  async function chat(messages, { json = false } = {}) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
        ...(json ? { format: "json" } : {}),
        options: { temperature: 0.2 },
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!response.ok) {
      throw new Error(`Ollama returned HTTP ${response.status}`);
    }

    const payload = await response.json();
    const content = payload.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      throw new Error("Ollama returned an empty response");
    }
    return content.trim();
  }

  return {
    name: "ollama",
    model,
    async generateInsights(system, input) {
      const content = await chat([
        { role: "system", content: system },
        { role: "user", content: JSON.stringify(input) },
      ], { json: true });
      return JSON.parse(content);
    },
    async answerAgent(system, input) {
      return chat([
        { role: "system", content: system },
        { role: "user", content: JSON.stringify(input) },
      ]);
    },
  };
}

module.exports = { createOllamaProvider };