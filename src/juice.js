// juice.js — Screen shake, damage numbers, particles

let shakeIntensity = 0;
let shakeDecay = 0.9;
let offsetX = 0;
let offsetY = 0;

const floatingTexts = [];
const particles = [];

// Screen shake
export function triggerShake(intensity = 8) {
  shakeIntensity = intensity;
}

export function updateShake() {
  if (shakeIntensity > 0.5) {
    offsetX = (Math.random() - 0.5) * shakeIntensity;
    offsetY = (Math.random() - 0.5) * shakeIntensity;
    shakeIntensity *= shakeDecay;
  } else {
    offsetX = 0;
    offsetY = 0;
    shakeIntensity = 0;
  }
}

export function getShakeOffset() {
  return { x: offsetX, y: offsetY };
}

// Floating damage/heal numbers
export function spawnFloatingText(x, y, text, color = '#ffffff', size = 14) {
  floatingTexts.push({
    x, y, text, color, size,
    vy: -2,
    life: 60,
    maxLife: 60,
  });
}

export function updateFloatingTexts() {
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    const ft = floatingTexts[i];
    ft.y += ft.vy;
    ft.vy *= 0.95;
    ft.life--;
    if (ft.life <= 0) {
      floatingTexts.splice(i, 1);
    }
  }
}

export function drawFloatingTexts(ctx) {
  for (const ft of floatingTexts) {
    const alpha = Math.min(1, ft.life / 20);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = ft.color;
    ctx.font = `bold ${ft.size}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(ft.text, ft.x, ft.y);
  }
  ctx.globalAlpha = 1;
}

// Particles
export function spawnParticles(x, y, count = 8, color = '#ffcc44') {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const speed = 1 + Math.random() * 3;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 30 + Math.random() * 20,
      maxLife: 50,
      color,
      size: 2 + Math.random() * 3,
    });
  }
}

export function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.05; // gravity
    p.life--;
    p.size *= 0.97;
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

export function drawParticles(ctx) {
  for (const p of particles) {
    const alpha = Math.min(1, p.life / 15);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  }
  ctx.globalAlpha = 1;
}

// Flash overlay
let flashAlpha = 0;
let flashColor = '#ffffff';

export function triggerFlash(color = '#ffffff', intensity = 0.6) {
  flashColor = color;
  flashAlpha = intensity;
}

export function updateFlash() {
  if (flashAlpha > 0.01) {
    flashAlpha *= 0.85;
  } else {
    flashAlpha = 0;
  }
}

export function drawFlash(ctx, width, height) {
  if (flashAlpha > 0) {
    ctx.globalAlpha = flashAlpha;
    ctx.fillStyle = flashColor;
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1;
  }
}
