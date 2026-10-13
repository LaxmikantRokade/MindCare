// src/utils/xp.ts
import { LEVELS } from '../data/constants';
import type { PlayerStats, GameResult } from '../types';

export function calculateLevel(xp: number): { level: number; title: string; minXP: number; maxXP: number } {
  let currentLevel = LEVELS[0];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      currentLevel = LEVELS[i];
      break;
    }
  }
  const nextLevel = LEVELS.find(l => l.minXP > xp);
  return {
    level: currentLevel.level,
    title: currentLevel.title,
    minXP: currentLevel.minXP,
    maxXP: nextLevel ? nextLevel.minXP : currentLevel.minXP + 2000,
  };
}

export function calculateXPForGame(result: GameResult): number {
  let xp = 100; // base
  if (result.accuracy >= 100) xp += 50;
  else if (result.accuracy >= 90) xp += 30;
  else if (result.accuracy >= 80) xp += 15;
  if (result.combo && result.combo >= 3) xp += result.combo * 5;
  return Math.min(xp, 200);
}

export function getXPProgress(stats: PlayerStats): { current: number; max: number; percentage: number } {
  const levelInfo = calculateLevel(stats.xp);
  const current = stats.xp - levelInfo.minXP;
  const max = levelInfo.maxXP - levelInfo.minXP;
  return { current, max, percentage: Math.min(100, (current / max) * 100) };
}

export function updateStreakOnPlay(stats: PlayerStats): PlayerStats {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  let newStreak = stats.streak;
  if (stats.lastPlayedDate === today) {
    // Already played today, no change
  } else if (stats.lastPlayedDate === yesterday) {
    newStreak = stats.streak + 1;
  } else {
    newStreak = 1;
  }
  return { ...stats, streak: newStreak, lastPlayedDate: today };
}

export function applyXP(stats: PlayerStats, xp: number): { newStats: PlayerStats; leveledUp: boolean; newLevel: number } {
  const oldLevel = stats.level;
  const newXP = stats.xp + xp;
  const levelInfo = calculateLevel(newXP);
  const newStats: PlayerStats = {
    ...stats,
    xp: newXP,
    xpToNextLevel: levelInfo.maxXP,
    level: levelInfo.level,
    totalXPEarned: stats.totalXPEarned + xp,
  };
  return { newStats, leveledUp: levelInfo.level > oldLevel, newLevel: levelInfo.level };
}

export function formatXP(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
  return xp.toString();
}

export function getAdaptiveDifficulty(accuracy: number, currentDifficulty: 'easy' | 'medium' | 'hard'): {
  difficulty: 'easy' | 'medium' | 'hard';
  message: string;
} {
  if (accuracy >= 85 && currentDifficulty !== 'hard') {
    const next = currentDifficulty === 'easy' ? 'medium' : 'hard';
    return { difficulty: next, message: "Great work! Ready for a little more challenge?" };
  } else if (accuracy < 60 && currentDifficulty !== 'easy') {
    const prev = currentDifficulty === 'hard' ? 'medium' : 'easy';
    return { difficulty: prev, message: "Let's practice this level once more." };
  }
  return { difficulty: currentDifficulty, message: "Keep it up! Great performance." };
}
