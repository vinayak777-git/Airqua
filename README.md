# AIRQUA Telemetry Console

Full Node.js + Express + MongoDB backend and frontend matching the console
design: live metric cards, 24h/7d environmental trend charts, a Claude-powered
"What we're seeing" insights panel with a confidence score, and a local
attention/acknowledge queue.

## What's inside

```
airqua-console/
├── server.js            Express app: simulated telemetry, Mongo persistence, insights
├── models/Reading.js    Mongoose schema for a sensor reading
├── package.json
├── .env.example         MONGODB_URI, ANTHROPIC_API_KEY, PORT
└── public/
    ├── index.html        console markup
    ├── styles.css        dark telemetry theme
    └── app.js            polling, Chart.js trends, insights, attention queue
```

## Run it

```bash
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGODB_URI` — a local Mongo (`mongodb://127.0.0.1:27017/airqua`) or an Atlas
  connection string. If this is missing/unreachable, the console still runs —
  current readings and AI insights keep working, only historical charts and
  the "MongoDB persisted" note will show it's running in-memory only.
- `ANTHROPIC_API_KEY` — for real Claude-generated insights. Without it, the
  insights panel automatically uses a rule-based fallback (still functional,
  just labeled "Rule-based fallback" in the UI instead of "Claude-powered").

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
- **What we're seeing** — `GET /api/insights` asks Claude for a confidence
  score, one-sentence headline, and one signal per metric (title + detail +
  severity); falls back to threshold-based text if Claude is unavailable.
- **Attention queue** — built client-side from the current statuses; anything
  non-normal shows up until acknowledged. Acknowledgment is stored in
  `localStorage` only ("Acknowledge locally on this device" in the UI) — it
  clears automatically once that metric's status changes again.
- **Report button** — opens a plain-text summary of the current snapshot in a
  new tab (printable/saveable) — swap in a PDF library later if you want a
  polished export.

## Wiring in real sensors later

`tick()` in `server.js` generates the simulated values and writes them to
MongoDB every 5 seconds. Replace its body with your real ESP32 ingestion
(serial, MQTT, HTTP POST, etc.) and keep writing to the same `current` shape —
nothing else needs to change.
