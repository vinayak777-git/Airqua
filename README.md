# AIRQUA Telemetry Console

AIRQUA is an Express telemetry demo with a browser dashboard, MongoDB history,
and a provider-based AI pipeline. Ollama is the default local model provider;
insights fall back to deterministic rules if the model is unavailable. Agent
mode is advisory only and receives explicitly labeled simulated data.

## What's inside

```
airqua-console/
├── server.js            Express app and telemetry API
├── Reading.js           Mongoose schema for a sensor reading
├── providers/           Ollama and optional Anthropic adapters
├── services/            AI pipeline, response validation, rule fallback
├── package.json
├── .env.example         database and AI provider settings
├── index.html            console markup
├── styles.css            telemetry theme and responsive assistant
└── app.js                polling, charts, insights, agent chat
```

## Run it

```bash
npm install
cp .env.example .env
```

Edit `.env` to select a provider. For local Ollama, install Ollama, start its
service, then fetch a model:

```bash
ollama pull llama3.2:3b
```

The example configuration uses `AI_PROVIDER=ollama`, `OLLAMA_BASE_URL`, and
`AI_MODEL`. Choose any Ollama chat model that supports JSON mode for structured
insights. No API key or extra npm package is required for Ollama. To disable
model calls and use rules only, set `AI_PROVIDER=rules`. To use Anthropic
instead, set `AI_PROVIDER=anthropic`, set `ANTHROPIC_API_KEY`, and optionally
override `AI_MODEL`.

MongoDB is optional. If unavailable, the console still serves current simulated
readings and AI features; historical charts will be empty and the footer will
show that readings are not persisted.

```bash
npm start
```

Open **http://localhost:3000**.

## How it matches the design

- **Metric cards** (Temperature / pH / CO2 / Algae health) — status pill
  (Normal / Watch / Alert), colored accent bar, all driven by `GET /api/current`.
- **Environmental trends** — `GET /api/history?range=24h|7d` reads persisted
  readings from MongoDB, downsampled to ~80 points per chart; the 24h/7d
  toggle just re-requests with a different range.
- **What we're seeing** — `GET /api/insights` uses the selected model and
  validates its structured response. Invalid or unavailable model output uses
  a deterministic rule-based fallback.
- **AI agent** — `POST /api/agent` accepts a question up to 1200 characters.
  Responses are explicitly advisory and include the demo snapshot used as
  context. This API does not operate hardware.
- **AI configuration** — `GET /api/ai/status` reports the selected provider,
  model, and whether agent mode is configured. It does not claim the model
  server is reachable until a request is made.
- **Attention queue** — built client-side from the current statuses; anything
  non-normal shows up until acknowledged. Acknowledgment is stored in
  `localStorage` only ("Acknowledge locally on this device" in the UI) — it
  clears automatically once that metric's status changes again.
- **Report button** — opens a plain-text summary of the current snapshot in a
  new tab (printable/saveable) — swap in a PDF library later if you want a
  polished export.

## Wiring in real sensors later

`tick()` in `server.js` generates simulated values and persists them every five
seconds when MongoDB is connected. Replace the simulation with validated ESP32
ingestion later; keep provider code isolated from ingestion so the same
advisory pipeline can consume a future sensor-backed snapshot. Current values
are demo data, not deployed sensor readings.
