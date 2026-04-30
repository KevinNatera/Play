// boss.js — Boss AI, attack patterns, HP management

import {
  BOSS_BASE_HP, BOSS_HP_SCALE, BOSS_ATTACKS_BY_LOOP,
  BOSS_ATTACK_DAMAGE, MAX_LOOPS, GUARD_REDUCTION,
} from './constants.js';

export function getBossHpForLoop(loop) {
  return Math.floor(BOSS_BASE_HP * Math.pow(BOSS_HP_SCALE, loop - 1));
}

export function getAttacksForLoop(loop) {
  const idx = Math.min(loop - 1, BOSS_ATTACKS_BY_LOOP.length - 1);
  return [...BOSS_ATTACKS_BY_LOOP[idx]];
}

export function pickBossAttack(attacks) {
  return attacks[Math.floor(Math.random() * attacks.length)];
}

export function resolveBossAttack(attack, player, isGuarding, guardTimingMult) {
  const result = {
    attack,
    damage: 0,
    selfDamage: 0,
    message: '',
    phaseShift: false,
  };

  switch (attack) {
    case 'BASIC_STRIKE': {
      let dmg = BOSS_ATTACK_DAMAGE.BASIC_STRIKE;
      if (isGuarding) {
        dmg = Math.floor(dmg * GUARD_REDUCTION * (2 - guardTimingMult));
        result.message = 'Boss strikes! You guard.';
      } else {
        result.message = 'Boss strikes!';
      }
      result.damage = Math.max(0, dmg - Math.floor(player.def * 0.3));
      break;
    }

    case 'SWEEP': {
      let dmg = BOSS_ATTACK_DAMAGE.SWEEP;
      if (isGuarding && guardTimingMult >= 1.0) {
        dmg = Math.floor(dmg * GUARD_REDUCTION);
        result.message = 'Boss sweeps! Perfect guard!';
      } else if (isGuarding) {
        // Mistimed guard — sweep hits through
        result.message = 'Boss sweeps through your guard!';
      } else {
        result.message = 'Boss sweeps!';
      }
      result.damage = Math.max(0, dmg - Math.floor(player.def * 0.2));
      break;
    }

    case 'CHARGE_BEAM': {
      let dmg = BOSS_ATTACK_DAMAGE.CHARGE_BEAM;
      if (isGuarding && guardTimingMult >= 1.5) {
        dmg = Math.floor(dmg * 0.2);
        result.message = 'Charge Beam! PERFECT block!';
      } else if (isGuarding) {
        dmg = Math.floor(dmg * 0.6);
        result.message = 'Charge Beam! Partial block...';
      } else {
        result.message = 'CHARGE BEAM hits hard!';
      }
      result.damage = Math.max(0, dmg - Math.floor(player.def * 0.1));
      break;
    }

    case 'PHASE_SHIFT': {
      result.phaseShift = true;
      result.damage = 0;
      result.message = 'Boss phases out of reality...';
      break;
    }

    case 'DESPERATION': {
      // Hits twice at lower damage
      let dmg = BOSS_ATTACK_DAMAGE.DESPERATION;
      if (isGuarding) {
        dmg = Math.floor(dmg * GUARD_REDUCTION);
      }
      result.damage = Math.max(0, (dmg - Math.floor(player.def * 0.2)) * 2);
      result.message = 'DESPERATION! Double strike!';
      break;
    }
  }

  return result;
}

export function getTelegraphMessage(attack) {
  switch (attack) {
    case 'BASIC_STRIKE': return 'Boss winds up...';
    case 'SWEEP': return 'Boss crouches low...';
    case 'CHARGE_BEAM': return 'Energy gathers...!';
    case 'PHASE_SHIFT': return 'Reality flickers...';
    case 'DESPERATION': return 'Boss screams!';
    default: return 'Boss prepares...';
  }
}

export function getTelegraphColor(attack) {
  switch (attack) {
    case 'BASIC_STRIKE': return '#ffaa44';
    case 'SWEEP': return '#ff8844';
    case 'CHARGE_BEAM': return '#ff4488';
    case 'PHASE_SHIFT': return '#8844ff';
    case 'DESPERATION': return '#ff2222';
    default: return '#ff4444';
  }
}
