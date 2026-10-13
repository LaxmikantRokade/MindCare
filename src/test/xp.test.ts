// src/test/xp.test.ts
import { describe, it, expect } from 'vitest';
import { calculateLevel, calculateXPForGame, getXPProgress, updateStreakOnPlay, applyXP, getAdaptiveDifficulty } from '../utils/xp';
import type { PlayerStats, GameResult } from '../types';

describe('XP and Level calculations', () => {
  it('correctly calculates level based on XP', () => {
    expect(calculateLevel(0).level).toBe(1);
    expect(calculateLevel(500).level).toBe(2);
    expect(calculateLevel(1000).level).toBe(3);
    expect(calculateLevel(3500).level).toBe(7);
  });

  it('calculates XP earned from game performance', () => {
    const result: GameResult = {
      id: '1',
      gameId: 'memory-match',
      gameName: 'Memory Match',
      score: 500,
      accuracy: 100,
      timeSeconds: 45,
      combo: 3,
      xpEarned: 0,
      difficulty: 'medium',
      playedAt: new Date().toISOString(),
    };

    const xp = calculateXPForGame(result);
    // Base 100 + 50 (accuracy 100) + 15 (combo 3 * 5) = 165
    expect(xp).toBe(165);
  });

  it('determines XP progress percentage', () => {
    const stats: PlayerStats = {
      level: 1,
      xp: 250,
      xpToNextLevel: 500,
      streak: 1,
      lastPlayedDate: '2024-01-01',
      totalGamesPlayed: 2,
      totalXPEarned: 250,
      achievements: [],
      favoriteGame: null,
    };

    const progress = getXPProgress(stats);
    expect(progress.percentage).toBe(50);
  });

  it('updates streak correctly', () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const stats: PlayerStats = {
      level: 1,
      xp: 100,
      xpToNextLevel: 500,
      streak: 3,
      lastPlayedDate: yesterday,
      totalGamesPlayed: 3,
      totalXPEarned: 100,
      achievements: [],
      favoriteGame: null,
    };

    const updated = updateStreakOnPlay(stats);
    expect(updated.streak).toBe(4);
    expect(updated.lastPlayedDate).toBe(today);
  });

  it('applies XP and detects level up', () => {
    const stats: PlayerStats = {
      level: 1,
      xp: 450,
      xpToNextLevel: 500,
      streak: 1,
      lastPlayedDate: '2024-01-01',
      totalGamesPlayed: 1,
      totalXPEarned: 450,
      achievements: [],
      favoriteGame: null,
    };

    const { newStats, leveledUp, newLevel } = applyXP(stats, 100);
    expect(newStats.xp).toBe(550);
    expect(leveledUp).toBe(true);
    expect(newLevel).toBe(2);
  });

  it('provides adaptive difficulty recommendations', () => {
    const high = getAdaptiveDifficulty(90, 'easy');
    expect(high.difficulty).toBe('medium');

    const low = getAdaptiveDifficulty(50, 'medium');
    expect(low.difficulty).toBe('easy');

    const same = getAdaptiveDifficulty(75, 'medium');
    expect(same.difficulty).toBe('medium');
  });
});
