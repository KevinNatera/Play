// engine.js — Game loop, state machine, ghost recording/playback

import {
  CANVAS_WIDTH, CANVAS_HEIGHT, PHASE, TURNS_PER_LOOP, MAX_LOOPS,
  HEAL_AMOUNT, GUARD_REDUCTION, GHOST_DAMAGE_MULT,
  XP_PER_LEVEL, STAT_GAINS, COLORS,
  createInitialState,
} from './constants.js';

import {
  startTimingBar, stopTimingBar, updateTimingBar,
  isTimingActive, drawTimingBar,
} from './timing.js';

import {
  getBossHpForLoop, getAttacksForLoop, pickBossAttack,
  resolveBossAttack, getTelegraphMessage, getTelegraphColor,
} from './boss.js';

import {
  triggerShake, updateShake, getShakeOffset,
  spawnFloatingText, updateFloatingTexts, drawFloatingTexts,
  spawnParticles, updateParticles, drawParticles,
  triggerFlash, updateFlash, drawFlash,
} from './juice.js';

import {
  drawPlayer, drawGhost, drawBoss, drawBackground, drawHUD,
} from './sprites.js';

import {
  playAttack, playGuard, playHeal, playPerfect, playMiss,
  playBossHit, playDeath, playWin, playLevelUp, playBossTelegraph,
} from './audio.js';

// Positions
const PLAYER_X = 120;
const PLAYER_Y = CANVAS_HEIGHT - 90;
const BOSS_X = CANVAS_WIDTH - 130;
const BOSS_Y = CANVAS_HEIGHT - 85;

let state = createInitialState();
let phaseTimer = 0;
let telegraphAttack = null;
let playerGuarding = false;
let lastGuardTiming = 1.0;
let levelUpPending = 0;

// Input
const keys = {};
const keysJustPressed = {};

export function handleKeyDown(e) {
  if (!keys[e.key]) {
    keysJustPressed[e.key] = true;
  }
  keys[e.key] = true;
}

export function handleKeyUp(e) {
  keys[e.key] = false;
}

function consumeKey(key) {
  if (keysJustPressed[key]) {
    keysJustPressed[key] = false;
    return true;
  }
  return false;
}

// Start a new loop
function startLoop() {
  const loop = state.loop;
  const bossHp = getBossHpForLoop(loop);

  state.turn = 0;
  state.phase = PHASE.PLAYER_INPUT;
  state.boss.hp = bossHp;
  state.boss.maxHp = bossHp;
  state.boss.attacks = getAttacksForLoop(loop);
  state.boss.currentAttack = null;
  state.boss.phaseShiftActive = false;
  state.currentRecording = [];
  state.damageThisLoop = 0;
  state.pendingAction = null;
  state.timingResult = null;
  playerGuarding = false;

  state.message = `LOOP ${loop} — FIGHT!`;
  state.messageTimer = 90;
}

// Resolve player action after timing
function resolvePlayerAction() {
  const action = state.pendingAction;
  const timing = state.timingResult || { quality: 'OKAY', mult: 1.0 };

  // Record for ghost
  state.currentRecording.push({
    turnNumber: state.turn,
    action,
    timingQuality: timing.mult,
  });

  switch (action) {
    case 'ATTACK': {
      if (state.boss.phaseShiftActive) {
        // Attack during phase shift = 50% self damage
        const selfDmg = Math.floor(state.player.atk * 0.5);
        state.player.hp -= selfDmg;
        spawnFloatingText(PLAYER_X, PLAYER_Y - 40, `-${selfDmg}`, COLORS.miss, 16);
        triggerShake(6);
        state.message = 'Attack reflected! Phase Shift!';
        state.messageTimer = 60;
        break;
      }

      const baseDmg = Math.floor(state.player.atk * timing.mult);
      state.boss.hp -= baseDmg;
      state.damageThisLoop += baseDmg;

      spawnFloatingText(BOSS_X, BOSS_Y - 50, `-${baseDmg}`, COLORS.attack, 16);
      spawnParticles(BOSS_X, BOSS_Y - 20, 6, COLORS.attack);
      triggerShake(4);
      playAttack();

      if (timing.mult >= 1.5) {
        playPerfect();
        state.message = `PERFECT hit! ${baseDmg} damage!`;
      } else if (timing.mult >= 1.0) {
        state.message = `Hit! ${baseDmg} damage.`;
      } else {
        playMiss();
        state.message = `Weak hit... ${baseDmg} damage.`;
      }
      state.messageTimer = 50;
      break;
    }

    case 'GUARD': {
      playerGuarding = true;
      lastGuardTiming = timing.mult;
      playGuard();
      if (timing.mult >= 1.5) {
        state.message = 'PERFECT guard!';
      } else {
        state.message = 'Guarding.';
      }
      state.messageTimer = 40;
      break;
    }

    case 'HEAL': {
      const healAmt = Math.floor(HEAL_AMOUNT * timing.mult);
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + healAmt);
      spawnFloatingText(PLAYER_X, PLAYER_Y - 40, `+${healAmt}`, COLORS.heal, 14);
      spawnParticles(PLAYER_X, PLAYER_Y - 20, 4, COLORS.heal);
      playHeal();
      state.message = `Healed ${healAmt} HP!`;
      state.messageTimer = 40;
      break;
    }
  }

  state.pendingAction = null;
  state.timingResult = null;
}

// Ghost actions for this turn
function resolveGhostActions() {
  for (const ghost of state.ghosts) {
    const action = ghost.actions.find(a => a.turnNumber === state.turn);
    if (!action || action.action !== 'ATTACK') continue;

    // Ghosts only replay attacks, skip guard/heal
    const ghostAtk = ghost.stats.atk;
    const dmg = Math.floor(ghostAtk * action.timingQuality * GHOST_DAMAGE_MULT);

    if (!state.boss.phaseShiftActive && dmg > 0) {
      state.boss.hp -= dmg;
      state.damageThisLoop += dmg;
      spawnFloatingText(
        BOSS_X + (Math.random() - 0.5) * 30,
        BOSS_Y - 40 - Math.random() * 20,
        `-${dmg}`,
        '#6688cc',
        12
      );
    }
  }
}

// Update function — called each frame
export function update() {
  phaseTimer++;
  updateShake();
  updateFloatingTexts();
  updateParticles();
  updateFlash();

  if (state.messageTimer > 0) state.messageTimer--;
  if (state.bossMessageTimer > 0) state.bossMessageTimer--;

  switch (state.phase) {
    case PHASE.TITLE:
      if (consumeKey(' ') || consumeKey('Enter')) {
        state = createInitialState();
        startLoop();
      }
      break;

    case PHASE.PLAYER_INPUT:
      if (consumeKey('1')) {
        state.pendingAction = 'ATTACK';
        state.phase = PHASE.TIMING;
        startTimingBar();
      } else if (consumeKey('2')) {
        state.pendingAction = 'GUARD';
        state.phase = PHASE.TIMING;
        startTimingBar();
      } else if (consumeKey('3')) {
        state.pendingAction = 'HEAL';
        state.phase = PHASE.TIMING;
        startTimingBar();
      }
      break;

    case PHASE.TIMING:
      updateTimingBar();
      if (consumeKey(' ')) {
        state.timingResult = stopTimingBar();
        state.phase = PHASE.RESOLVE;
        phaseTimer = 0;
      }
      break;

    case PHASE.RESOLVE:
      if (phaseTimer === 1) {
        resolvePlayerAction();
        resolveGhostActions();
      }
      if (phaseTimer > 30) {
        // Check win
        if (state.boss.hp <= 0) {
          state.phase = PHASE.WIN;
          playWin();
          triggerFlash(COLORS.perfect, 0.8);
          triggerShake(12);
          state.message = 'VICTORY! THE ETERNAL FALLS!';
          state.messageTimer = 999;
          phaseTimer = 0;
          break;
        }
        // Move to boss phase
        state.phase = PHASE.BOSS_TELEGRAPH;
        telegraphAttack = pickBossAttack(state.boss.attacks);
        state.boss.currentAttack = telegraphAttack;
        state.bossMessage = getTelegraphMessage(telegraphAttack);
        state.bossMessageTimer = 60;
        playBossTelegraph();
        phaseTimer = 0;
      }
      break;

    case PHASE.BOSS_TELEGRAPH:
      if (phaseTimer > 45) {
        state.phase = PHASE.BOSS;
        phaseTimer = 0;
      }
      break;

    case PHASE.BOSS:
      if (phaseTimer === 1) {
        const result = resolveBossAttack(
          telegraphAttack, state.player, playerGuarding, lastGuardTiming
        );

        if (result.phaseShift) {
          state.boss.phaseShiftActive = true;
          state.message = result.message;
          state.messageTimer = 50;
        } else {
          state.boss.phaseShiftActive = false;
          if (result.damage > 0) {
            state.player.hp -= result.damage;
            spawnFloatingText(PLAYER_X, PLAYER_Y - 40, `-${result.damage}`, COLORS.miss, 16);
            spawnParticles(PLAYER_X, PLAYER_Y - 20, 8, COLORS.bossTelegraph);
            triggerShake(result.damage > 30 ? 10 : 6);
            triggerFlash(COLORS.miss, 0.3);
            playBossHit();
          }
          state.message = result.message;
          state.messageTimer = 50;
        }

        playerGuarding = false;
      }

      if (phaseTimer > 40) {
        // Check player death
        if (state.player.hp <= 0) {
          state.player.hp = 0;
          state.phase = PHASE.LOOP_END;
          phaseTimer = 0;
          playDeath();
          triggerShake(15);
          triggerFlash(COLORS.miss, 0.6);

          if (state.loop >= MAX_LOOPS) {
            state.message = 'You fall... but you can try again.';
          } else {
            state.message = 'You fall... but your echo remains.';
          }
          state.messageTimer = 120;
          break;
        }

        // Next turn
        state.turn++;
        if (state.turn >= TURNS_PER_LOOP) {
          // Loop ends (ran out of turns = death by exhaustion)
          state.phase = PHASE.LOOP_END;
          phaseTimer = 0;
          state.message = 'Time runs out... the boss endures.';
          state.messageTimer = 120;
          playDeath();
        } else {
          state.phase = PHASE.PLAYER_INPUT;
          phaseTimer = 0;
          state.pendingAction = null;
          state.timingResult = null;
        }
      }
      break;

    case PHASE.LOOP_END:
      if (phaseTimer > 90) {
        // Record ghost (only loops 1-4)
        if (state.loop < MAX_LOOPS) {
          state.ghosts.push({
            actions: [...state.currentRecording],
            stats: {
              atk: state.player.atk,
              def: state.player.def,
            },
          });
        }

        // Calculate XP
        const xpGained = state.damageThisLoop;
        state.totalXp += xpGained;
        state.xpThisLoop = xpGained;

        // Check level ups
        levelUpPending = Math.floor(state.totalXp / XP_PER_LEVEL);
        const previousLevels = Math.floor((state.totalXp - xpGained) / XP_PER_LEVEL);
        levelUpPending = levelUpPending - previousLevels;

        if (levelUpPending > 0) {
          state.phase = PHASE.LEVELUP;
          state.message = `+${xpGained} XP! LEVEL UP! Pick: [1]ATK [2]DEF [3]HP`;
          state.messageTimer = 999;
          playLevelUp();
        } else {
          // No level up, advance loop
          if (state.loop < MAX_LOOPS) {
            state.loop++;
          }
          // Reset player HP for next loop
          state.player.hp = state.player.maxHp;
          startLoop();
        }
        phaseTimer = 0;
      }
      break;

    case PHASE.LEVELUP:
      if (consumeKey('1')) {
        state.player.atk += STAT_GAINS.atk;
        state.message = `ATK +${STAT_GAINS.atk}! (Now ${state.player.atk})`;
        state.messageTimer = 60;
        spawnFloatingText(PLAYER_X, PLAYER_Y - 50, `ATK+${STAT_GAINS.atk}`, COLORS.attack, 14);
        levelUpPending--;
        advanceAfterLevelUp();
      } else if (consumeKey('2')) {
        state.player.def += STAT_GAINS.def;
        state.message = `DEF +${STAT_GAINS.def}! (Now ${state.player.def})`;
        state.messageTimer = 60;
        spawnFloatingText(PLAYER_X, PLAYER_Y - 50, `DEF+${STAT_GAINS.def}`, COLORS.guard, 14);
        levelUpPending--;
        advanceAfterLevelUp();
      } else if (consumeKey('3')) {
        state.player.maxHp += STAT_GAINS.hp;
        state.player.hp = state.player.maxHp; // Full heal on HP level up
        state.message = `HP +${STAT_GAINS.hp}! (Now ${state.player.maxHp})`;
        state.messageTimer = 60;
        spawnFloatingText(PLAYER_X, PLAYER_Y - 50, `HP+${STAT_GAINS.hp}`, COLORS.heal, 14);
        levelUpPending--;
        advanceAfterLevelUp();
      }
      break;

    case PHASE.WIN:
      if (phaseTimer > 120 && (consumeKey(' ') || consumeKey('Enter'))) {
        state = createInitialState();
      }
      break;
  }

  // Clear just-pressed keys at end of frame
  Object.keys(keysJustPressed).forEach(k => keysJustPressed[k] = false);
}

function advanceAfterLevelUp() {
  if (levelUpPending > 0) {
    state.message = `Another level! Pick: [1]ATK [2]DEF [3]HP`;
    state.messageTimer = 999;
    return;
  }
  // Advance to next loop
  if (state.loop < MAX_LOOPS) {
    state.loop++;
  }
  state.player.hp = state.player.maxHp;
  startLoop();
}

// Draw function — called each frame
export function draw(ctx) {
  const shake = getShakeOffset();
  ctx.save();
  ctx.translate(shake.x, shake.y);

  // Background
  drawBackground(ctx);

  // Ghosts
  for (let i = 0; i < state.ghosts.length; i++) {
    drawGhost(ctx, PLAYER_X, PLAYER_Y, i);
  }

  // Player
  drawPlayer(ctx, PLAYER_X, PLAYER_Y, state.player.hp, state.player.maxHp, playerGuarding);

  // Boss
  const bossTC = state.phase === PHASE.BOSS_TELEGRAPH ? getTelegraphColor(telegraphAttack) : null;
  drawBoss(ctx, BOSS_X, BOSS_Y, state.boss.hp, state.boss.maxHp, state.boss.phaseShiftActive, bossTC);

  // HUD
  drawHUD(ctx, state);

  // Particles & floating text
  drawParticles(ctx);
  drawFloatingTexts(ctx);

  ctx.restore();

  // Flash (not affected by shake)
  drawFlash(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Timing bar
  if (state.phase === PHASE.TIMING || state.timingResult) {
    drawTimingBar(ctx, (CANVAS_WIDTH - 200) / 2, CANVAS_HEIGHT - 45);
  }

  // Messages
  if (state.messageTimer > 0 && state.message) {
    ctx.fillStyle = COLORS.text;
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(state.message, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 55);
  }

  // Boss telegraph message
  if (state.bossMessageTimer > 0 && state.bossMessage) {
    ctx.fillStyle = COLORS.bossTelegraph;
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(state.bossMessage, CANVAS_WIDTH / 2, 50);
  }

  // Title screen
  if (state.phase === PHASE.TITLE) {
    drawTitleScreen(ctx);
  }

  // Win screen overlay
  if (state.phase === PHASE.WIN) {
    drawWinScreen(ctx);
  }

  // Input hints
  if (state.phase === PHASE.PLAYER_INPUT) {
    ctx.fillStyle = COLORS.textDim;
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('[1] Attack  [2] Guard  [3] Heal', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 6);
  }
}

function drawTitleScreen(ctx) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.fillStyle = COLORS.highlight;
  ctx.font = 'bold 32px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('ENCORE', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);

  ctx.fillStyle = COLORS.text;
  ctx.font = '12px monospace';
  ctx.fillText('Each death, your ghost fights beside you.', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  ctx.fillText('Defeat THE ETERNAL in 5 loops.', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 18);

  ctx.fillStyle = COLORS.textDim;
  ctx.font = '10px monospace';
  ctx.fillText('[1] Attack  [2] Guard  [3] Heal  [SPACE] Timing', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);

  // Blinking start
  if (Math.floor(Date.now() / 500) % 2 === 0) {
    ctx.fillStyle = COLORS.highlight;
    ctx.font = '12px monospace';
    ctx.fillText('Press SPACE to begin', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 80);
  }
}

function drawWinScreen(ctx) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.fillStyle = COLORS.perfect;
  ctx.font = 'bold 28px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('VICTORY', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);

  ctx.fillStyle = COLORS.text;
  ctx.font = '12px monospace';
  ctx.fillText(`Defeated in ${state.loop} loops with ${state.ghosts.length} ghosts`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  ctx.fillText(`Total XP: ${state.totalXp}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 18);

  if (phaseTimer > 120) {
    ctx.fillStyle = COLORS.textDim;
    ctx.font = '10px monospace';
    ctx.fillText('Press SPACE to play again', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
  }
}
