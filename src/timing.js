// timing.js — Timing bar system (Perfect/Okay/Miss)

import {
  TIMING_BAR_WIDTH, TIMING_BAR_SPEED,
  TIMING_PERFECT_ZONE, TIMING_OKAY_ZONE,
  TIMING_PERFECT_MULT, TIMING_OKAY_MULT, TIMING_MISS_MULT,
  COLORS,
} from './constants.js';

let cursorPos = 0;
let direction = 1;
let active = false;
let result = null;

export function startTimingBar() {
  cursorPos = 0;
  direction = 1;
  active = true;
  result = null;
}

export function stopTimingBar() {
  if (!active) return null;
  active = false;

  const center = TIMING_BAR_WIDTH / 2;
  const dist = Math.abs(cursorPos - center);

  if (dist <= TIMING_PERFECT_ZONE) {
    result = { quality: 'PERFECT', mult: TIMING_PERFECT_MULT };
  } else if (dist <= TIMING_OKAY_ZONE) {
    result = { quality: 'OKAY', mult: TIMING_OKAY_MULT };
  } else {
    result = { quality: 'MISS', mult: TIMING_MISS_MULT };
  }

  return result;
}

export function updateTimingBar() {
  if (!active) return;
  cursorPos += TIMING_BAR_SPEED * direction;
  if (cursorPos >= TIMING_BAR_WIDTH || cursorPos <= 0) {
    direction *= -1;
  }
}

export function isTimingActive() {
  return active;
}

export function getTimingResult() {
  return result;
}

export function drawTimingBar(ctx, x, y) {
  if (!active && !result) return;

  const barHeight = 16;
  const center = TIMING_BAR_WIDTH / 2;

  // Background
  ctx.fillStyle = '#222233';
  ctx.fillRect(x, y, TIMING_BAR_WIDTH, barHeight);

  // Miss zone (full bar)
  ctx.fillStyle = COLORS.miss + '44';
  ctx.fillRect(x, y, TIMING_BAR_WIDTH, barHeight);

  // Okay zone
  ctx.fillStyle = COLORS.okay + '66';
  ctx.fillRect(x + center - TIMING_OKAY_ZONE, y, TIMING_OKAY_ZONE * 2, barHeight);

  // Perfect zone
  ctx.fillStyle = COLORS.perfect + '88';
  ctx.fillRect(x + center - TIMING_PERFECT_ZONE, y, TIMING_PERFECT_ZONE * 2, barHeight);

  // Cursor
  if (active) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + cursorPos - 2, y - 2, 4, barHeight + 4);
  }

  // Result flash
  if (result) {
    const color = result.quality === 'PERFECT' ? COLORS.perfect
      : result.quality === 'OKAY' ? COLORS.okay
      : COLORS.miss;
    ctx.fillStyle = color;
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(result.quality + '!', x + center, y - 6);
  }

  // Label
  ctx.fillStyle = COLORS.textDim;
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SPACE to stop', x + center, y + barHeight + 12);
}
