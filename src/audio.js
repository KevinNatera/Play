// audio.js — Sound effects via Web Audio API (synthesized, no external files needed)

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(freq, duration = 0.1, type = 'square', volume = 0.15) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio not available — silent fallback
  }
}

export function playAttack() {
  playTone(220, 0.08, 'square', 0.12);
  setTimeout(() => playTone(330, 0.06, 'square', 0.1), 50);
}

export function playGuard() {
  playTone(440, 0.05, 'triangle', 0.1);
}

export function playHeal() {
  playTone(523, 0.15, 'sine', 0.1);
  setTimeout(() => playTone(659, 0.15, 'sine', 0.08), 100);
}

export function playPerfect() {
  playTone(880, 0.1, 'sine', 0.12);
  setTimeout(() => playTone(1108, 0.15, 'sine', 0.1), 80);
}

export function playMiss() {
  playTone(150, 0.15, 'sawtooth', 0.08);
}

export function playBossHit() {
  playTone(120, 0.12, 'sawtooth', 0.15);
  setTimeout(() => playTone(80, 0.1, 'sawtooth', 0.12), 60);
}

export function playDeath() {
  playTone(200, 0.3, 'sawtooth', 0.1);
  setTimeout(() => playTone(150, 0.3, 'sawtooth', 0.08), 200);
  setTimeout(() => playTone(100, 0.4, 'sawtooth', 0.06), 400);
}

export function playWin() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, 'sine', 0.12), i * 150);
  });
}

export function playLevelUp() {
  playTone(440, 0.1, 'sine', 0.1);
  setTimeout(() => playTone(554, 0.1, 'sine', 0.1), 100);
  setTimeout(() => playTone(659, 0.15, 'sine', 0.12), 200);
}

export function playBossTelegraph() {
  playTone(100, 0.2, 'square', 0.06);
}
