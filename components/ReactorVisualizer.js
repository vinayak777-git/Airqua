/**
 * AIRQUA Photobioreactor & Environmental Tech Interactive Canvas
 * Simulates microalgae culture (Chlorella vulgaris cells), CO₂ micro-bubble sparging,
 * photonic spectrum absorption, and IoT sensor connection nodes.
 */

export class ReactorVisualizer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext("2d");
    this.animationId = null;
    this.cells = [];
    this.bubbles = [];
    this.sensorNodes = [];
    this.width = 0;
    this.height = 0;
    this.mouse = { x: -1000, y: -1000, radius: 100 };
    this.isRunning = false;

    this.init();
  }

  init() {
    this.resize();
    this.initEntities();
    this.bindEvents();
    this.start();
  }

  resize() {
    const parent = this.canvas.parentElement;
    const rect = parent ? parent.getBoundingClientRect() : { width: window.innerWidth, height: 600 };
    this.width = rect.width;
    this.height = rect.height || 600;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(dpr, dpr);
  }

  initEntities() {
    this.cells = [];
    this.bubbles = [];
    this.sensorNodes = [];

    // Chlorella vulgaris microalgae cells (chlorophyll green circular bodies)
    const cellCount = Math.floor(Math.min(this.width, 1200) / 22);
    for (let i = 0; i < cellCount; i++) {
      this.cells.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: 2.2 + Math.random() * 3.8,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.2 - Math.random() * 0.35, // gentle upward fluid draft
        baseAlpha: 0.25 + Math.random() * 0.5,
        alpha: 0.5,
        hue: 145 + Math.random() * 25, // 145-170: lush chlorophyll green
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }

    // CO2 micro-bubbles from the sparger base
    const bubbleCount = Math.floor(Math.min(this.width, 1200) / 35);
    for (let i = 0; i < bubbleCount; i++) {
      this.bubbles.push({
        x: Math.random() * this.width,
        y: this.height + Math.random() * 200,
        radius: 1.0 + Math.random() * 2.2,
        vy: -0.7 - Math.random() * 1.2,
        wobbleSpeed: 0.03 + Math.random() * 0.04,
        wobbleAmp: 0.8 + Math.random() * 1.5,
        alpha: 0.3 + Math.random() * 0.4
      });
    }

    // IoT telemetry data sentry points
    const nodeCount = 5;
    for (let i = 0; i < nodeCount; i++) {
      this.sensorNodes.push({
        x: (this.width / (nodeCount + 1)) * (i + 1),
        y: this.height * 0.35 + Math.sin(i * 1.5) * 60,
        baseY: this.height * 0.35 + Math.sin(i * 1.5) * 60,
        label: ["CO₂", "DO", "pH", "Temp", "Turbidity"][i],
        radius: 4,
        pulse: 0
      });
    }
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      this.resize();
      this.initEntities();
    });

    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.canvas.addEventListener("mouseleave", () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.tick();
    }
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  tick() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Subtle background ambient gradient
    const bgGrad = this.ctx.createRadialGradient(
      this.width * 0.5, this.height * 0.5, 50,
      this.width * 0.5, this.height * 0.5, Math.max(this.width, this.height) * 0.65
    );
    bgGrad.addColorStop(0, "rgba(16, 185, 129, 0.06)");
    bgGrad.addColorStop(0.5, "rgba(6, 78, 59, 0.03)");
    bgGrad.addColorStop(1, "rgba(7, 13, 11, 0)");
    this.ctx.fillStyle = bgGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Render Chlorella cells
    const time = Date.now() * 0.001;
    for (let cell of this.cells) {
      // Hydrodynamic drift
      cell.x += cell.vx;
      cell.y += cell.vy;

      // Mouse gentle repulsion
      const dx = cell.x - this.mouse.x;
      const dy = cell.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < this.mouse.radius) {
        const force = (1 - dist / this.mouse.radius) * 1.5;
        cell.x += (dx / dist) * force * 2;
        cell.y += (dy / dist) * force * 2;
      }

      // Wrap around bounds
      if (cell.y < -10) cell.y = this.height + 10;
      if (cell.x < -10) cell.x = this.width + 10;
      if (cell.x > this.width + 10) cell.x = -10;

      const currentAlpha = cell.baseAlpha * (0.8 + 0.2 * Math.sin(time * 2 + cell.pulseOffset));

      this.ctx.beginPath();
      this.ctx.arc(cell.x, cell.y, cell.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `hsla(${cell.hue}, 75%, 48%, ${currentAlpha})`;
      this.ctx.fill();

      // Outer delicate chloroplast halo
      this.ctx.beginPath();
      this.ctx.arc(cell.x, cell.y, cell.radius * 1.6, 0, Math.PI * 2);
      this.ctx.fillStyle = `hsla(${cell.hue}, 80%, 60%, ${currentAlpha * 0.18})`;
      this.ctx.fill();
    }

    // Render rising CO2 micro-bubbles
    for (let bubble of this.bubbles) {
      bubble.y += bubble.vy;
      bubble.x += Math.sin(time * 3 + bubble.y * 0.05) * bubble.wobbleAmp * 0.3;

      if (bubble.y < -10) {
        bubble.y = this.height + 10 + Math.random() * 50;
        bubble.x = Math.random() * this.width;
      }

      this.ctx.beginPath();
      this.ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(180, 240, 220, ${bubble.alpha * 0.7})`;
      this.ctx.lineWidth = 1;
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.arc(bubble.x - bubble.radius * 0.3, bubble.y - bubble.radius * 0.3, bubble.radius * 0.35, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${bubble.alpha * 0.6})`;
      this.ctx.fill();
    }

    // Render IoT Sensor mesh & lines
    for (let i = 0; i < this.sensorNodes.length; i++) {
      const node = this.sensorNodes[i];
      node.y = node.baseY + Math.sin(time + i * 1.2) * 12;

      // Draw connection lines between sensor sentries
      if (i < this.sensorNodes.length - 1) {
        const next = this.sensorNodes[i + 1];
        this.ctx.beginPath();
        this.ctx.moveTo(node.x, node.y);
        this.ctx.lineTo(next.x, next.baseY + Math.sin(time + (i + 1) * 1.2) * 12);
        this.ctx.strokeStyle = "rgba(56, 189, 248, 0.12)";
        this.ctx.setLineDash([4, 4]);
        this.ctx.lineWidth = 1.2;
        this.ctx.stroke();
        this.ctx.setLineDash([]);
      }

      // Draw sensor glowing node
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = "#38bdf8";
      this.ctx.fill();

      // Sensor node pulse ring
      const ringSize = node.radius + ((time * 15 + i * 8) % 18);
      const ringAlpha = Math.max(0, 1 - ringSize / 22);
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, ringSize, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(56, 189, 248, ${ringAlpha * 0.4})`;
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }

    this.animationId = requestAnimationFrame(() => this.tick());
  }
}
