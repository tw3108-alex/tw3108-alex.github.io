const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let width;
let height;
let stars = [];
let mouse = { x: 0, y: 0 };

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  stars = Array.from({ length: Math.min(220, Math.floor(width * height / 6500)) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    z: Math.random() * 1.2 + 0.2,
    r: Math.random() * 1.4 + 0.3,
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, width, height);

  for (const star of stars) {
    const dx = (mouse.x - width / 2) * star.z * 0.012;
    const dy = (mouse.y - height / 2) * star.z * 0.012;

    ctx.beginPath();
    ctx.arc(star.x + dx, star.y + dy, star.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(238, 244, 255, ${0.45 + star.z * 0.35})`;
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
drawStars();

const phrases = [
  "Biostatistics & Data Science",
  "Statistics & Actuarial Science",
  "Risk Modeling & Health Analytics",
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
    setTimeout(typeLoop, 70);
  } else if (!deleting && charIndex === phrase.length) {
    deleting = true;
    setTimeout(typeLoop, 1300);
  } else if (deleting && charIndex > 0) {
    charIndex--;
    setTimeout(typeLoop, 36);
  } else {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    setTimeout(typeLoop, 250);
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
