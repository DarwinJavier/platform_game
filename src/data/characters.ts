import { COLORS } from './constants';
import type { CharacterId, CharacterStats } from '../types/game';

export const CHARACTERS: Record<CharacterId, CharacterStats> = {
  puchi: {
    id: 'puchi',
    name: 'Puchi',
    description: 'Double jump + Sparkle Burst',
    baseSpeed: 190,
    runSpeed: 230,
    jumpVelocity: -420,
    powerName: 'Sparkle Burst',
    powerSummary: 'A short-range magical pulse for stunning nearby crabs.',
    colors: {
      primary: COLORS.puchiPurple,
      secondary: COLORS.puchiPink,
      accent: COLORS.puchiLavender,
    },
  },
  pao: {
    id: 'pao',
    name: 'Pao',
    description: 'Faster run + Basketball Toss',
    baseSpeed: 210,
    runSpeed: 255,
    jumpVelocity: -390,
    powerName: 'Basketball Toss',
    powerSummary: 'Throws a beach basketball forward to stun crab enemies.',
    colors: {
      primary: COLORS.paoTeal,
      secondary: COLORS.paoGreen,
      accent: COLORS.shellCream,
    },
  },
};
