const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let width;
let height;
let stars = [];
let mouse = { x: 0, y: 0 };

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  stars = Array.from({ length: Math.min(520, Math.floor(width * height / 2800)) }, () => {
    const brightness = Math.random();

    return {
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 1.6 + 0.15,
      r: Math.random() * 1.05 + 0.15,
      a: 0.18 + brightness * 0.68,
      twinkle: Math.random() * Math.PI * 2,
    };
  });
}

function drawStars(time) {
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createRadialGradient(
    width * 0.52,
    height * 0.18,
    0,
    width * 0.52,
    height * 0.18,
    Math.max(width, height) * 0.8
  );

  gradient.addColorStop(0, "rgba(15, 35, 75, 0.18)");
  gradient.addColorStop(0.42, "rgba(4, 9, 24, 0.2)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.05)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  for (const star of stars) {
    const dx = (mouse.x - width / 2) * star.z * 0.006;
    const dy = (mouse.y - height / 2) * star.z * 0.006;
    const flicker = 0.72 + Math.sin(time * 0.0012 + star.twinkle) * 0.22;

    ctx.beginPath();
    ctx.arc(star.x + dx, star.y + dy, star.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(235, 242, 255, ${star.a * flicker})`;
    ctx.fill();
  }

  requestAnimationFrame(drawStars);
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

resizeCanvas();
requestAnimationFrame(drawStars);

const phrases = [
  "Biostatistics",
  "Data Science",
  "Statistical Modeling",
  "Risk Analytics",
];

const typewriter = document.getElementById("typewriter");
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const phrase = phrases[phraseIndex];
  const visible = phrase.slice(0, charIndex);

  typewriter.textContent = visible + (Date.now() % 1000 < 500 ? "▋" : "");

  if (!deleting && charIndex < phrase.length) {
    charIndex++;
    setTimeout(typeLoop, 78);
  } else if (!deleting && charIndex === phrase.length) {
    deleting = true;
    setTimeout(typeLoop, 1250);
  } else if (deleting && charIndex > 0) {
    charIndex--;
    setTimeout(typeLoop, 38);
  } else {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    setTimeout(typeLoop, 280);
  }
}

typeLoop();

const revealItems = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => observer.observe(item));

document.querySelectorAll(".glass-card").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();

    card.style.setProperty("--x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--y", `${event.clientY - rect.top}px`);
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

const threeCanvas = document.getElementById("threebody-canvas");
const threeCtx = threeCanvas?.getContext("2d");

function resizeThreeBody() {
  if (!threeCanvas || !threeCtx) return;

  const rect = threeCanvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;

  threeCanvas.width = rect.width * ratio;
  threeCanvas.height = rect.height * ratio;
  threeCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function bodyPosition(t, phase, radius, wobble) {
  return {
    x:
      Math.sin(t + phase) * radius * 0.72 +
      Math.sin(2 * t - phase * 0.7) * radius * 0.22 +
      Math.cos(3 * t + phase) * radius * wobble,
    y:
      Math.cos(1.15 * t + phase) * radius * 0.48 +
      Math.sin(2 * t + phase * 1.3) * radius * 0.27 +
      Math.cos(4 * t - phase) * radius * wobble * 0.82,
  };
}

function drawThreeBody(now) {
  if (!threeCanvas || !threeCtx) return;

  const rect = threeCanvas.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;
  const cx = w / 2;
  const cy = h / 2 - 10;
  const radius = Math.min(w, h) * 0.31;

  threeCtx.clearRect(0, 0, w, h);

  const t = now * 0.00033;
  const phases = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];

  const colors = [
    "rgba(205, 226, 255,",
    "rgba(139, 211, 255,",
    "rgba(184, 190, 255,",
  ];

  for (let i = 0; i < 3; i++) {
    threeCtx.beginPath();

    for (let step = 150; step >= 0; step--) {
      const tt = t - step * 0.018;
      const p = bodyPosition(tt, phases[i], radius, 0.16);
      const x = cx + p.x;
      const y = cy + p.y;

      if (step === 150) {
        threeCtx.moveTo(x, y);
      } else {
        threeCtx.lineTo(x, y);
      }
    }

    threeCtx.strokeStyle = colors[i] + "0.18)";
    threeCtx.lineWidth = 1.15;
    threeCtx.stroke();
  }

  const points = phases.map((phase) => {
    const p = bodyPosition(t, phase, radius, 0.16);
    return { x: cx + p.x, y: cy + p.y };
  });

  threeCtx.beginPath();
  threeCtx.moveTo(points[0].x, points[0].y);
  threeCtx.lineTo(points[1].x, points[1].y);
  threeCtx.lineTo(points[2].x, points[2].y);
  threeCtx.closePath();
  threeCtx.strokeStyle = "rgba(148, 163, 184, 0.11)";
  threeCtx.lineWidth = 1;
  threeCtx.stroke();

  points.forEach((point, i) => {
    const glow = threeCtx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 34);

    glow.addColorStop(0, colors[i] + "0.78)");
    glow.addColorStop(0.35, colors[i] + "0.18)");
    glow.addColorStop(1, colors[i] + "0)");

    threeCtx.beginPath();
    threeCtx.arc(point.x, point.y, 34, 0, Math.PI * 2);
    threeCtx.fillStyle = glow;
    threeCtx.fill();

    const body = threeCtx.createRadialGradient(
      point.x - 4,
      point.y - 5,
      1,
      point.x,
      point.y,
      12
    );

    body.addColorStop(0, "rgba(255, 255, 255, 0.96)");
    body.addColorStop(0.38, colors[i] + "0.9)");
    body.addColorStop(1, "rgba(15, 23, 42, 0.95)");

    threeCtx.beginPath();
    threeCtx.arc(point.x, point.y, 8 + i * 1.1, 0, Math.PI * 2);
    threeCtx.fillStyle = body;
    threeCtx.fill();
  });

  requestAnimationFrame(drawThreeBody);
}

window.addEventListener("resize", resizeThreeBody);
resizeThreeBody();
requestAnimationFrame(drawThreeBody);
