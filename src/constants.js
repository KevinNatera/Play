// constants.js — Shared config, state shape contract, damage values, XP thresholds
// ALL modules read/write through this state shape. This is the integration contract.

export const CANVAS_WIDTH = 480;
export const CANVAS_HEIGHT = 320;
export const PIXEL_SCALE = 2;

export const TURNS_PER_LOOP = 8;
export const MAX_LOOPS = 5;

// Starting stats
export const PLAYER_BASE = {
  hp: 100,
  maxHp: 100,
  atk: 20,
  def: 10,
};

export const BOSS_BASE_HP = 300;
export const BOSS_HP_SCALE = 1.3; // +30% per loop
export const BOSS_ATK = 25;

export const HEAL_AMOUNT = 30;
export const GUARD_REDUCTION = 0.5;
export const GHOST_DAMAGE_MULT = 0.5;

// XP / Leveling
export const XP_PER_LEVEL = 100;
export const STAT_GAINS = {
  atk: 5,
  def: 5,
  hp: 20,
};

// Timing bar
export const TIMING_PERFECT_MULT = 1.5;
export const TIMING_OKAY_MULT = 1.0;
export const TIMING_MISS_MULT = 0.5;
export const TIMING_BAR_SPEED = 4; // pixels per frame
export const TIMING_BAR_WIDTH = 200;
export const TIMING_PERFECT_ZONE = 20; // pixels from center
export const TIMING_OKAY_ZONE = 50;

// Boss attacks unlocked per loop
export const BOSS_ATTACKS_BY_LOOP = [
  ['BASIC_STRIKE'],
  ['BASIC_STRIKE', 'SWEEP'],
  ['BASIC_STRIKE', 'SWEEP', 'CHARGE_BEAM'],
  ['BASIC_STRIKE', 'SWEEP', 'CHARGE_BEAM', 'PHASE_SHIFT'],
  ['BASIC_STRIKE', 'SWEEP', 'CHARGE_BEAM', 'PHASE_SHIFT', 'DESPERATION'],
];

export const BOSS_ATTACK_DAMAGE = {
  BASIC_STRIKE: 25,
  SWEEP: 35,
  CHARGE_BEAM: 50,
  PHASE_SHIFT: 0, // no direct damage, reflects player attack
  DESPERATION: 20, // lower per-hit but attacks twice
};

// Phase enum
export const PHASE = {
  TITLE: 'TITLE',
  PLAYER_INPUT: 'PLAYER_INPUT',
  TIMING: 'TIMING',
  RESOLVE: 'RESOLVE',
  BOSS: 'BOSS',
  BOSS_TELEGRAPH: 'BOSS_TELEGRAPH',
  LOOP_END: 'LOOP_END',
  LEVELUP: 'LEVELUP',
  WIN: 'WIN',
  LOSE: 'LOSE',
};

// Colors — PS1/Chrono Trigger palette
export const COLORS = {
  bg: '#1a1a2e',
  bgLight: '#16213e',
  text: '#e0e0e0',
  textDim: '#888899',
  playerHp: '#44cc66',
  bossHp: '#cc4444',
  perfect: '#44ff88',
  okay: '#ffcc44',
  miss: '#ff4444',
  ghost: 'rgba(100, 180, 255, 0.4)',
  highlight: '#ffdd57',
  heal: '#66ffaa',
  guard: '#6688ff',
  attack: '#ff6644',
  bossTelegraph: '#ff2244',
};

// Create initial game state
export function createInitialState() {
  return {
    loop: 1,
    turn: 0,
    phase: PHASE.TITLE,
    player: { ...PLAYER_BASE },
    boss: {
      hp: BOSS_BASE_HP,
      maxHp: BOSS_BASE_HP,
      attacks: [...BOSS_ATTACKS_BY_LOOP[0]],
      currentAttack: null,
      phaseShiftActive: false,
    },
    ghosts: [],
    currentRecording: [],
    pendingAction: null,
    timingResult: null,
    xpThisLoop: 0,
    totalXp: 0,
    damageThisLoop: 0,
    message: '',
    messageTimer: 0,
    bossMessage: '',
    bossMessageTimer: 0,
  };
}
