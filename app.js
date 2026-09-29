(function () {
  const STATUS_ICON = { normal: "●", watch: "●", alert: "●" };
  const METRIC_META = {
    temperature: { label: "Temperature", chipId: "chip-temp", unit: "°C", decimals: 1 },
    ph: { label: "pH balance", chipId: "chip-ph", unit: "pH", decimals: 2 },
    co2: { label: "CO2 concentration", chipId: "chip-co2", unit: "ppm", decimals: 0 },
    algaeHealth: { label: "Algae health", chipId: "chip-algae", unit: "%", decimals: 1 },
  };
  const COLORS = { temperature: "#5be89a", ph: "#4fd3e0", co2: "#e8b355", algaeHealth: "#e85f8a" };

  let currentRange = "24h";
  let latestSnapshot = null;
  let agentConfigured = false;
  const charts = {};

  const ACK_KEY = "airqua_acknowledged_signals";
  function getAcknowledged() {
    try { return JSON.parse(localStorage.getItem(ACK_KEY) || "{}"); } catch { return {}; }
  }
  function setAcknowledged(map) {
    localStorage.setItem(ACK_KEY, JSON.stringify(map));
  }

  function fmt(v, decimals) {
    return typeof v === "number" ? v.toFixed(decimals) : "--";
  }

  function statusLabel(s) {
    return s === "alert" ? "Alert" : s === "watch" ? "Watch" : "Normal";
  }

  // ---------------- current readings ----------------
  async function pollCurrent() {
    try {
      const res = await fetch("/api/current");
      const data = await res.json();
      applyCurrent(data);
    } catch (err) {
      console.error("[AIRQUA] failed to fetch current readings:", err);
    }
  }

  function applyCurrent(data) {
    latestSnapshot = data;
    const { current, statuses } = data;

    Object.keys(METRIC_META).forEach((metric) => {
      const card = document.querySelector(`.metric-card[data-metric="${metric}"]`);
      if (!card) return;
      const meta = METRIC_META[metric];
      card.querySelector('[data-role="value"]').textContent = fmt(current[metric], meta.decimals);
      const pill = card.querySelector('[data-role="status"]');
      const status = statuses[metric];
      pill.textContent = STATUS_ICON[status] + " " + statusLabel(status);
      pill.className = "status-pill " + (status === "normal" ? "" : status);

      const chip = document.getElementById(meta.chipId);
      if (chip) chip.textContent = fmt(current[metric], meta.decimals) + (metric === "co2" ? "" : meta.unit === "%" ? "%" : "");
    });

    document.getElementById("snapshot-time").textContent = new Date(data.lastUpdated).toLocaleString([], {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });

    document.getElementById("db-note").textContent = data.dbConnected
      ? "Demo data source · MongoDB persisted"
      : "Demo data source · MongoDB not connected (in-memory only)";

    renderSnapshotDropdown(current);
    renderAttentionQueue(statuses, current);
  }

  function renderSnapshotDropdown(current) {
    const el = document.getElementById("snapshot-dropdown");
    el.innerHTML = Object.entries(METRIC_META).map(([metric, meta]) => `
      <div><span>${meta.label}</span><b>${fmt(current[metric], meta.decimals)} ${meta.unit}</b></div>
    `).join("");
  }

  // ---------------- attention queue ----------------
  function renderAttentionQueue(statuses, current) {
    const ack = getAcknowledged();
    let changed = false;
    // clear acknowledgment once a metric's status changes (including back to normal)
    Object.keys(ack).forEach((metric) => {
      if (!statuses[metric] || ack[metric] !== statuses[metric]) {
        delete ack[metric];
        changed = true;
      }
    });
    if (changed) setAcknowledged(ack);

    const items = Object.entries(statuses).filter(([metric, status]) => status !== "normal" && !ack[metric]);

    const countEl = document.getElementById("attention-count");
    countEl.textContent = items.length;

    const list = document.getElementById("attention-list");
    if (!items.length) {
      list.innerHTML = '<div class="attention-empty">Nothing needs review right now.</div>';
      return;
    }

    list.innerHTML = items.map(([metric, status]) => {
      const meta = METRIC_META[metric];
      return `
        <div class="attention-item" data-metric="${metric}">
          <div class="attention-icon">⚠</div>
          <div class="attention-body">
            <div class="attention-title">${meta.label} is in <span class="sev ${status}">${status}</span> range</div>
            <div class="attention-sub">${fmt(current[metric], meta.decimals)} ${meta.unit} · Review the latest trend before taking action</div>
          </div>
          <button class="ack-btn" data-ack="${metric}" data-status="${status}">Acknowledge</button>
        </div>
      `;
    }).join("");

    list.querySelectorAll("[data-ack]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const map = getAcknowledged();
        map[btn.dataset.ack] = btn.dataset.status;
        setAcknowledged(map);
        if (latestSnapshot) renderAttentionQueue(latestSnapshot.statuses, latestSnapshot.current);
      });
    });
  }

  // ---------------- trend charts ----------------
  function initCharts() {
    Object.keys(METRIC_META).forEach((metric) => {
      const canvas = document.getElementById("chart-" + metric);
      if (!canvas) return;
      charts[metric] = new Chart(canvas.getContext("2d"), {
        type: "line",
        data: {
          labels: [],
          datasets: [{
            data: [],
            borderColor: COLORS[metric],
            backgroundColor: COLORS[metric] + "22",
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.35,
            fill: true,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          interaction: { mode: "index", intersect: false },
          scales: { x: { display: false }, y: { display: false } },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#0d1c19",
              borderColor: "#1c332d",
              borderWidth: 1,
              titleColor: "#8ba39b",
              bodyColor: "#eef5f2",
              padding: 10,
              displayColors: false,
              callbacks: {
                label: (ctx) => `${METRIC_META[metric].label}: ${fmt(ctx.parsed.y, METRIC_META[metric].decimals)}`,
              },
            },
          },
        },
      });
    });
  }

  async function loadHistory(range) {
    try {
      const res = await fetch("/api/history?range=" + range);
      const data = await res.json();
      applyHistory(data.history || []);
    } catch (err) {
      console.error("[AIRQUA] failed to load history:", err);
    }
  }

  function applyHistory(history) {
    const labels = history.map((h) => new Date(h.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    Object.keys(METRIC_META).forEach((metric) => {
      const chart = charts[metric];
      if (!chart) return;
      chart.data.labels = labels;
      chart.data.datasets[0].data = history.map((h) => h[metric]);
      chart.update("none");

      const valEl = document.getElementById("chart-val-" + metric);
      if (valEl && history.length) {
        const last = history[history.length - 1];
        valEl.textContent = fmt(last[metric], METRIC_META[metric].decimals) + " " + METRIC_META[metric].unit;
      }
    });
  }

  // ---------------- AI insights ----------------
  async function loadInsights() {
    try {
      const res = await fetch("/api/insights");
      const data = await res.json();
      applyInsights(data);
    } catch (err) {
      console.error("[AIRQUA] failed to load insights:", err);
      document.getElementById("insights-headline").textContent = "Couldn't reach the insights service.";
    }
  }

  function applyInsights(data) {
    document.getElementById("confidence-val").textContent = data.aiPowered ? (data.confidence || 0) + "%" : "—";
    document.getElementById("confidence-fill").style.width = data.aiPowered ? (data.confidence || 0) + "%" : "0%";
    document.getElementById("confidence-label").textContent = data.aiPowered
      ? "Model-reported estimate · uncalibrated"
      : "Confidence unavailable for rule output";
    document.getElementById("insights-headline").textContent = data.headline || "—";

    const list = document.getElementById("signals-list");
    list.replaceChildren();
    (data.signals || []).forEach((signal) => {
      const item = document.createElement("li");
      const dot = document.createElement("span");
      dot.className = "dot " + (signal.severity || "normal");
      const content = document.createElement("div");
      const title = document.createElement("div");
      title.className = "signal-title";
      title.textContent = signal.title || "Signal";
      const detail = document.createElement("div");
      detail.className = "signal-detail";
      detail.textContent = signal.detail || "";
      content.append(title, detail);
      item.append(dot, content);
      list.append(item);
    });

    document.getElementById("insights-time").textContent =
      (data.aiPowered ? `${data.provider} · ${data.model} · ` : "Rule-based fallback · ") + "just now";
  }

  function appendAgentEntry(role, text, snapshot) {
    const thread = document.getElementById("agent-thread");
    thread.querySelector(".agent-empty")?.remove();

    const entry = document.createElement("article");
    entry.className = `agent-entry ${role}`;
    const label = document.createElement("div");
    label.className = "agent-entry-label";
    label.textContent = role === "user" ? "YOU" : "AIRQUA AI · ADVISORY";
    const body = document.createElement("p");
    body.textContent = text;
    entry.append(label, body);

    if (snapshot) {
      const context = document.createElement("p");
      context.className = "agent-context";
      context.textContent = `Supplied demo readings · ${fmt(snapshot.temperature, 1)} °C · pH ${fmt(snapshot.ph, 2)} · ${fmt(snapshot.co2, 0)} ppm CO₂ · algae index ${fmt(snapshot.algaeHealth, 1)}%`;
      entry.append(context);
    }

    thread.append(entry);
    thread.scrollTop = thread.scrollHeight;
  }

  async function loadAgentStatus() {
    const statusEl = document.getElementById("agent-provider-status");
    const submit = document.getElementById("agent-submit");
    try {
      const response = await fetch("/api/ai/status");
      const status = await response.json();
      agentConfigured = Boolean(status.configured && status.agentMode);
      if (!agentConfigured) {
        statusEl.textContent = "Agent mode unavailable · configure Ollama or another supported provider.";
        submit.disabled = true;
        return;
      }
      statusEl.textContent = `Configured provider · ${status.provider} / ${status.model}`;
      submit.disabled = false;
    } catch (error) {
      statusEl.textContent = "Could not read AI provider configuration.";
      submit.disabled = true;
    }
  }

  async function askAgent(event) {
    event.preventDefault();
    const input = document.getElementById("agent-question");
    const submit = document.getElementById("agent-submit");
    const statusEl = document.getElementById("agent-provider-status");
    const question = input.value.trim();
    if (!question || question.length > 1200) return;

    appendAgentEntry("user", question);
    input.value = "";
    input.disabled = true;
    submit.disabled = true;
    statusEl.textContent = "Waiting for the configured model…";

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "The AI request failed.");
      appendAgentEntry("assistant", result.answer, result.snapshot);
      statusEl.textContent = `Advisory response · ${result.provider} / ${result.model} · demo context`;
    } catch (error) {
      appendAgentEntry("assistant", error.message || "The AI request failed.");
      statusEl.textContent = "AI request unavailable. Check provider status and try again.";
    } finally {
      input.disabled = false;
      submit.disabled = !agentConfigured;
      input.focus();
    }
  }

  // ---------------- report ----------------
  function openReport() {
    if (!latestSnapshot) return;
    const { current, statuses, overall } = latestSnapshot;
    const lines = Object.entries(METRIC_META).map(([metric, meta]) =>
      `${meta.label}: ${fmt(current[metric], meta.decimals)} ${meta.unit} — ${statusLabel(statuses[metric])}`
    );
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>AIRQUA Report — ${new Date().toLocaleString()}</title>
      <style>body{font-family:sans-serif;padding:40px;color:#111}h1{margin-bottom:4px}
      .status{color:#666;margin-bottom:24px}li{margin:8px 0;font-size:15px}</style></head>
      <body>
        <h1>AIRQUA — North Basin Report</h1>
        <div class="status">Generated ${new Date().toLocaleString()} · Overall status: ${statusLabel(overall)}</div>
        <ul>${lines.map((l) => `<li>${l}</li>`).join("")}</ul>
      </body></html>
    `);
    win.document.close();
  }

  // ---------------- wiring ----------------
  document.getElementById("snapshot-toggle").addEventListener("click", () => {
    document.getElementById("snapshot-dropdown").classList.toggle("hidden");
  });

  document.getElementById("refresh-btn").addEventListener("click", () => {
    pollCurrent();
    loadHistory(currentRange);
    loadInsights();
  });

  document.getElementById("report-btn").addEventListener("click", openReport);
  document.getElementById("agent-form").addEventListener("submit", askAgent);

  document.querySelectorAll(".range-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".range-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentRange = btn.dataset.range;
      loadHistory(currentRange);
    });
  });

  initCharts();
  pollCurrent();
  loadHistory(currentRange);
  loadInsights();
  loadAgentStatus();

  setInterval(pollCurrent, 5000);
  setInterval(() => loadHistory(currentRange), 30000);
  setInterval(loadInsights, 30000);
})();
