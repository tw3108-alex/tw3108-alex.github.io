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


