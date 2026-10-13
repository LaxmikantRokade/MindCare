// src/test/storage.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../services/storage';
import { DEMO_USER, DEFAULT_PLAYER_STATS } from '../data/constants';
import type { GameResult, User } from '../types';

describe('Storage Service', () => {
  beforeEach(() => {
    storage.clearAll();
  });

  it('handles user storage and retrieval', () => {
    expect(storage.getUser()).toBeNull();

    storage.setUser(DEMO_USER);
    expect(storage.getUser()?.name).toBe('Rahul Sharma');

    storage.clearUser();
    expect(storage.getUser()).toBeNull();
  });

  it('handles player stats fallback and update', () => {
    const stats = storage.getPlayerStats();
    expect(stats.level).toBe(DEFAULT_PLAYER_STATS.level);

    const updated = { ...stats, level: 8, xp: 5000 };
    storage.setPlayerStats(updated);
    expect(storage.getPlayerStats().level).toBe(8);
  });

  it('stores and retrieves game results safely', () => {
    expect(storage.getGameResults()).toEqual([]);

    const mockResult: GameResult = {
      id: 'res-1',
      gameId: 'memory-match',
      gameName: 'Memory Match',
      score: 450,
      accuracy: 95,
      timeSeconds: 35,
      moves: 6,
      combo: 2,
      xpEarned: 130,
      difficulty: 'medium',
      playedAt: new Date().toISOString(),
    };

    storage.addGameResult(mockResult);
    const results = storage.getGameResults();
    expect(results.length).toBe(1);
    expect(results[0].gameId).toBe('memory-match');
    expect(results[0].score).toBe(450);
  });

  it('retains defaults when localStorage contains invalid json', () => {
    localStorage.setItem('mindcare_player_stats', 'invalid-corrupted-json{');
    const stats = storage.getPlayerStats();
    expect(stats.level).toBe(DEFAULT_PLAYER_STATS.level);
  });

  it('manages achievements and quests', () => {
    const achievements = storage.getAchievements();
    expect(achievements.length).toBeGreaterThan(0);

    const quests = storage.getQuests();
    expect(quests.length).toBeGreaterThan(0);
  });
});
