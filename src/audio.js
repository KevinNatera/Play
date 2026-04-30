// audio.js — Sound effects using Kenney Retro Audio Pack (CC0)
// Mapped to Encore game events

let audioCtx = null;
const sounds = {};

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

function playSound(file) {
    try {
        const audio = new Audio();
        audio.src = `/assets/audio/${file}`;
        audio.volume = 0.5;
        audio.play().catch(() => {});
    } catch (e) {
        // Fallback to synth
    }
}

export function init() {
    try {
        getCtx();
        console.log("Audio initialized");
    } catch (e) {
        console.warn("Web Audio API not supported");
    }
}

export function playAttack() {
    playSound('attack_perfect.ogg');
}

export function playGuard() {
    playTone(440, 0.05, 'triangle', 0.1);
}

export function playHeal() {
    playSound('level_up.ogg');
}

export function playPerfect() {
    playSound('attack_perfect.ogg');
}

export function playMiss() {
    playTone(150, 0.15, 'sawtooth', 0.08);
}

export function playBossHit() {
    playSound('boss_attack.ogg');
}

export function playDeath() {
    playTone(200, 0.3, 'sawtooth', 0.1);
    setTimeout(() => playTone(150, 0.3, 'sawtooth', 0.08), 200);
}

export function playWin() {
    playSound('level_up.ogg');
}

export function playLevelUp() {
    playSound('level_up.ogg');
}

export function playBossTelegraph() {
    playTone(100, 0.2, 'square', 0.06);
}

export function playMusic(track) {
    console.log(`Playing music: ${track}`);
}
