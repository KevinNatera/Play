// sprites.js — Player/boss/ghost rendering (PS1 / Chrono Trigger aesthetic)

import { COLORS, CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';

// Jitter for retro feel
function jitter(val, amount = 0.5) {
  return val + (Math.random() - 0.5) * amount;
}

// Player sprite — simple pixel warrior
export function drawPlayer(ctx, x, y, hp, maxHp, isGuarding = false) {
  ctx.save();

  // Body
  ctx.fillStyle = isGuarding ? COLORS.guard : '#44aaff';
  ctx.fillRect(jitter(x - 8), jitter(y - 20), 16, 24);

  // Head
  ctx.fillStyle = '#ffcc88';
  ctx.fillRect(jitter(x - 6), jitter(y - 30), 12, 12);

  // Eyes
  ctx.fillStyle = '#222';
  ctx.fillRect(x - 4, y - 26, 3, 3);
  ctx.fillRect(x + 1, y - 26, 3, 3);

  // Sword (or shield if guarding)
  if (isGuarding) {
    ctx.fillStyle = '#8899cc';
    ctx.fillRect(x + 10, y - 22, 6, 18);
  } else {
    ctx.fillStyle = '#ccccdd';
    ctx.fillRect(x + 10, y - 28, 3, 20);
    ctx.fillStyle = '#ffdd44';
    ctx.fillRect(x + 9, y - 30, 5, 4);
  }

  // HP bar
  const barWidth = 30;
  const barHeight = 4;
  const barX = x - barWidth / 2;
  const barY = y + 8;
  ctx.fillStyle = '#333';
  ctx.fillRect(barX, barY, barWidth, barHeight);
  const hpRatio = Math.max(0, hp / maxHp);
  ctx.fillStyle = hpRatio > 0.5 ? COLORS.playerHp : hpRatio > 0.25 ? COLORS.okay : COLORS.miss;
  ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);

  ctx.restore();
}

// Ghost sprite — translucent version of player
export function drawGhost(ctx, x, y, ghostIndex) {
  ctx.save();
  ctx.globalAlpha = 0.4;

  // Slight offset per ghost so they don't stack perfectly
  const ox = ghostIndex * 6 - 12;
  const oy = Math.sin(Date.now() / 500 + ghostIndex) * 2;

  // Body — blue tint
  ctx.fillStyle = '#6688cc';
  ctx.fillRect(jitter(x + ox - 8), jitter(y + oy - 20), 16, 24);

  // Head
  ctx.fillStyle = '#aabbdd';
  ctx.fillRect(jitter(x + ox - 6), jitter(y + oy - 30), 12, 12);

  // Eyes — glowing
  ctx.fillStyle = '#aaddff';
  ctx.fillRect(x + ox - 4, y + oy - 26, 3, 3);
  ctx.fillRect(x + ox + 1, y + oy - 26, 3, 3);

  // Sword
  ctx.fillStyle = '#aabbdd';
  ctx.fillRect(x + ox + 10, y + oy - 28, 3, 20);

  ctx.globalAlpha = 1;
  ctx.restore();
}

// Boss sprite — big intimidating figure
export function drawBoss(ctx, x, y, hp, maxHp, phaseShift = false, telegraphColor = null) {
  ctx.save();

  // Telegraph glow
  if (telegraphColor) {
    ctx.globalAlpha = 0.3 + Math.sin(Date.now() / 100) * 0.2;
    ctx.fillStyle = telegraphColor;
    ctx.fillRect(x - 28, y - 48, 56, 56);
    ctx.globalAlpha = 1;
  }

  // Phase shift shimmer
  if (phaseShift) {
    ctx.globalAlpha = 0.3 + Math.sin(Date.now() / 80) * 0.3;
  }

  // Body — large
  ctx.fillStyle = '#882244';
  ctx.fillRect(jitter(x - 20), jitter(y - 40), 40, 44);

  // Shoulders
  ctx.fillStyle = '#aa3355';
  ctx.fillRect(jitter(x - 26), jitter(y - 36), 12, 16);
  ctx.fillRect(jitter(x + 14), jitter(y - 36), 12, 16);

  // Head
  ctx.fillStyle = '#661133';
  ctx.fillRect(jitter(x - 12), jitter(y - 54), 24, 16);

  // Eyes — menacing
  ctx.fillStyle = '#ff2244';
  ctx.fillRect(x - 8, y - 48, 5, 4);
  ctx.fillRect(x + 3, y - 48, 5, 4);

  // Crown/horns
  ctx.fillStyle = '#ffdd44';
  ctx.fillRect(x - 14, y - 58, 4, 8);
  ctx.fillRect(x + 10, y - 58, 4, 8);
  ctx.fillRect(x - 4, y - 62, 8, 10);

  ctx.globalAlpha = 1;

  // HP bar
  const barWidth = 50;
  const barHeight = 5;
  const barX = x - barWidth / 2;
  const barY = y + 10;
  ctx.fillStyle = '#333';
  ctx.fillRect(barX, barY, barWidth, barHeight);
  const hpRatio = Math.max(0, hp / maxHp);
  ctx.fillStyle = COLORS.bossHp;
  ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);

  ctx.restore();
}

// Battle background
export function drawBackground(ctx) {
  // Dark gradient floor
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  grad.addColorStop(0, COLORS.bg);
  grad.addColorStop(0.6, COLORS.bgLight);
  grad.addColorStop(1, '#0a0a1a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Floor line
  ctx.strokeStyle = '#333355';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, CANVAS_HEIGHT - 60);
  ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - 60);
  ctx.stroke();

  // Subtle grid on floor for depth
  ctx.strokeStyle = '#222244';
  for (let i = 0; i < 8; i++) {
    const y = CANVAS_HEIGHT - 55 + i * 8;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_WIDTH, y);
    ctx.stroke();
  }
}

// HUD
export function drawHUD(ctx, state) {
  const { player, boss, loop, turn } = state;

  ctx.fillStyle = COLORS.text;
  ctx.font = '10px monospace';
  ctx.textAlign = 'left';

  // Loop indicator
  ctx.fillText(`LOOP ${loop}/5`, 10, 16);
  ctx.fillText(`TURN ${turn + 1}/8`, 10, 28);

  // Player stats
  ctx.fillText(`HP: ${player.hp}/${player.maxHp}`, 10, CANVAS_HEIGHT - 20);
  ctx.fillText(`ATK:${player.atk} DEF:${player.def}`, 10, CANVAS_HEIGHT - 8);

  // Ghost count
  if (state.ghosts.length > 0) {
    ctx.fillStyle = COLORS.ghost;
    ctx.fillText(`GHOSTS: ${state.ghosts.length}`, CANVAS_WIDTH - 80, 16);
  }

  // Boss name
  ctx.fillStyle = COLORS.text;
  ctx.textAlign = 'right';
  ctx.fillText('THE ETERNAL', CANVAS_WIDTH - 10, 16);
  ctx.fillText(`HP: ${Math.max(0, boss.hp)}/${boss.maxHp}`, CANVAS_WIDTH - 10, 28);
}
