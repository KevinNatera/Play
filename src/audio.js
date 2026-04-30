// src/audio.js
export const Audio = (() => {
  const sounds = {};
  let currentMusic = null;

  const load = (name, path, vol = 0.5) => {
    const a = new window.Audio(path);
    a.volume = vol;
    sounds[name] = a;
  };

  const play = (name) => {
    if (sounds[name]) {
      sounds[name].currentTime = 0;
      sounds[name].play().catch(() => console.log("Audio blocked: Need user click"));
    }
  };

  const init = () => {
    // List your assets here. Ensure these match your /assets/audio/ folder!
    load('attack_perfect', 'assets/audio/attack_perfect.ogg', 0.7);
    load('boss_attack', 'assets/audio/boss_attack.ogg', 0.8);
    load('music_battle', 'assets/audio/level_up.ogg', 0.3);
    console.log("Audio System Armed.");
  };

  const startMusic = () => {
    if (sounds['music_battle']) {
      sounds['music_battle'].loop = true;
      sounds['music_battle'].play();
    }
  };

  return { init, play, startMusic };
})();
