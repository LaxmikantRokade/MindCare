// src/test/achievements.test.ts
import { describe, it, expect } from 'vitest';
import { checkAchievements } from '../utils/achievements';
import { ACHIEVEMENTS, DEFAULT_PLAYER_STATS } from '../data/constants';
import type { GameResult, PlayerStats } from '../types';

describe('Achievements system', () => {
  it('unlocks first-step after 1 game', () => {
    const stats: PlayerStats = { ...DEFAULT_PLAYER_STATS, totalGamesPlayed: 1 };
    const results: GameResult[] = [];
    const updated = checkAchievements(ACHIEVEMENTS, stats, results);

    const firstStep = updated.find(a => a.id === 'first-step');
    expect(firstStep?.unlockedAt).not.toBeNull();
  });

  it('unlocks perfect-round when 100% accuracy is scored', () => {
    const stats: PlayerStats = { ...DEFAULT_PLAYER_STATS };
    const results: GameResult[] = [{
      id: '1',
      gameId: 'memory-match',
      gameName: 'Memory Match',
      score: 500,
      accuracy: 100,
      timeSeconds: 40,
      xpEarned: 150,
      difficulty: 'medium',
      playedAt: new Date().toISOString(),
    }];

    const updated = checkAchievements(ACHIEVEMENTS, stats, results);
    const perfectRound = updated.find(a => a.id === 'perfect-round');
    expect(perfectRound?.unlockedAt).not.toBeNull();
  });

  it('tracks progress for multi-game achievements', () => {
    const stats: PlayerStats = { ...DEFAULT_PLAYER_STATS, totalGamesPlayed: 3 };
    const results: GameResult[] = [
      { id: '1', gameId: 'memory-match', gameName: 'Memory Match', score: 300, accuracy: 80, timeSeconds: 50, xpEarned: 100, difficulty: 'easy', playedAt: '' },
      { id: '2', gameId: 'memory-match', gameName: 'Memory Match', score: 350, accuracy: 90, timeSeconds: 45, xpEarned: 120, difficulty: 'easy', playedAt: '' },
    ];

    const updated = checkAchievements(ACHIEVEMENTS, stats, results);
    const memoryStarter = updated.find(a => a.id === 'memory-starter');
    expect(memoryStarter?.progress).toBe(2);
    expect(memoryStarter?.unlockedAt).toBeNull();
  });
});
