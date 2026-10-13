// src/utils/achievements.ts
import type { Achievement, GameResult, PlayerStats } from '../types';

export function checkAchievements(
  achievements: Achievement[],
  stats: PlayerStats,
  results: GameResult[],
): Achievement[] {
  const updated = achievements.map(a => ({ ...a }));
  const now = new Date().toISOString();

  const unlock = (id: string) => {
    const a = updated.find(x => x.id === id);
    if (a && !a.unlockedAt) {
      a.unlockedAt = now;
      a.progress = a.maxProgress;
    }
  };

  const setProgress = (id: string, progress: number) => {
    const a = updated.find(x => x.id === id);
    if (a && !a.unlockedAt) {
      a.progress = Math.min(progress, a.maxProgress || 1);
      if (a.progress >= (a.maxProgress || 1)) {
        a.unlockedAt = now;
      }
    }
  };

  // First Step
  if (stats.totalGamesPlayed >= 1) unlock('first-step');

  // Memory Starter - count memory-match games
  const memoryGames = results.filter(r => r.gameId === 'memory-match').length;
  setProgress('memory-starter', memoryGames);

  // Streak Hero
  setProgress('streak-hero', stats.streak);
  if (stats.streak >= 7) unlock('streak-legend');

  // Weekly Warrior
  setProgress('weekly-warrior', stats.totalGamesPlayed);

  // Perfect Round
  const hasPerfect = results.some(r => r.accuracy >= 100);
  if (hasPerfect) unlock('perfect-round');

  // Memory Master - 90%+ accuracy 5 times
  const highAccuracy = results.filter(r => r.accuracy >= 90).length;
  setProgress('memory-master', highAccuracy);

  // Level 5
  setProgress('level-5', stats.level);
  if (stats.level >= 5) unlock('level-5');

  // Speed Demon - under 30s
  const fastGame = results.some(r => r.timeSeconds < 30);
  if (fastGame) unlock('speed-demon');

  // Pattern Pro
  const patternGames = results.filter(r => r.gameId === 'pattern-pulse').length;
  setProgress('pattern-pro', patternGames);

  // XP Collector
  setProgress('xp-collector', stats.totalXPEarned);

  // Grand Master
  setProgress('grand-master', stats.level);

  return updated;
}

export function getNewlyUnlocked(oldAchievements: Achievement[], newAchievements: Achievement[]): Achievement[] {
  return newAchievements.filter(a => {
    const old = oldAchievements.find(o => o.id === a.id);
    return a.unlockedAt && !old?.unlockedAt;
  });
}
