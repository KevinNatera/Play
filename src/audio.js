// src/audio.js — Audio system with named exports for engine.js + Audio object for index.html

const sounds = {};
let initialized = false;

function load(name, path, vol = 0.5) {
  try {
    const a = new window.Audio(path);
    a.volume = vol;
    sounds[name] = a;
  } catch (e) {
    console.warn('Failed to load', name, e);
  }
}

function play(name) {
  const s = sounds[name];
  if (!s) return;
  try {
    s.currentTime = 0;
    s.play().catch(() => {});
  } catch (e) {}
}

function init() {
  if (initialized) return;
  initialized = true;
  load('attack_basic', 'assets/audio/attack_basic.wav', 0.5);
  load('attack_perfect', 'assets/audio/attack_perfect.wav', 0.7);
  load('attack_miss', 'assets/audio/attack_miss.wav', 0.4);
  load('guard_perfect', 'assets/audio/guard_perfect.wav', 0.6);
  load('guard_hit', 'assets/audio/guard_hit.wav', 0.5);
  load('heal', 'assets/audio/heal.wav', 0.5);
  load('level_up', 'assets/audio/level_up.wav', 0.7);
  load('ss_telegraph', 'assets/audio/boss_telegraph.wav', 0.4);
  load('boss_attack', 'assets/audio/boss_attack.wav', 0.7);
  load('victory', 'assets/audio/victory.wav', 0.7);
  load('defeat', 'assets/audio/defeat.wav', 0.6);
  load('music_battle', 'assets/audio/music_battle.mp3', 0.3);
  console.log('Audio armed.');
}

function startMusic() {
  const m = sounds['music_battle'];
  if (!m) return;
  m.loop = true;
  m.play().catch(() => {});
}

// Named exports for engine.js
export function playAttack() { play('attack_basic'); }
export function playPerfect() { play('attack_perfect'); }
export function playMiss() { play('attack_miss'); }
export function playGuard() { play('guard_hit'); }
export function playHeal() { play('heal'); }
export function playBossHit() { play('boss_attack'); }
export function playBossTelegraph() { play('boss_telegraph'); }
export function playLevelUp() { play('level_up'); }
export function playWin() { play('victory'); }
export function playDeath() { play('defeat'); }

// Object export for index.html
export const Audio = { init, play, startMusic };
