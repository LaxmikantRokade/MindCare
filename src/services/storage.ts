// src/services/storage.ts
import type { AppState, Achievement, Quest, GameResult, PlayerStats, User, DailyProgress } from '../types';
import { DEFAULT_PLAYER_STATS, ACHIEVEMENTS, generateDailyQuests, DEMO_USER } from '../data/constants';
import { calculateLevel } from '../utils/xp';

const KEYS = {
  USER: 'mindcare_user',
  PLAYER_STATS: 'mindcare_player_stats',
  GAME_RESULTS: 'mindcare_game_results',
  ACHIEVEMENTS: 'mindcare_achievements',
  QUESTS: 'mindcare_quests',
  REMINDERS: 'mindcare_reminders',
  DAILY_PROGRESS: 'mindcare_daily_progress',
  ACCESSIBILITY: 'mindcare_accessibility',
  THEME: 'mindcare_theme',
  GAME_SETTINGS: 'mindcare_game_settings',
  ONBOARDING: 'mindcare_onboarding',
} as const;

function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch {
    return defaultValue;
  }
}

function safeSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage might be full or unavailable
  }
}

const defaultAccessibility = {
  textSize: 'normal' as const,
  contrast: 'standard' as const,
  motion: 'normal' as const,
  showInstructions: true,
  readAloud: false,
  soundEffects: false,
};

const defaultTheme = { mode: 'dark' as const };

const defaultGameSettings = {
  difficulty: 'medium' as const,
  soundEnabled: false,
  hintsEnabled: true,
};

const defaultOnboarding = {
  completed: false,
  focus: [],
  experienceLevel: 'balanced' as const,
};

export const storage = {
  getUser: (): User | null => safeGet<User | null>(KEYS.USER, null),
  setUser: (user: User): void => safeSet(KEYS.USER, user),
  clearUser: (): void => localStorage.removeItem(KEYS.USER),

  getPlayerStats: (): PlayerStats => safeGet<PlayerStats>(KEYS.PLAYER_STATS, DEFAULT_PLAYER_STATS),
  setPlayerStats: (stats: PlayerStats): void => safeSet(KEYS.PLAYER_STATS, stats),

  getGameResults: (): GameResult[] => safeGet<GameResult[]>(KEYS.GAME_RESULTS, []),
  addGameResult: (result: GameResult): void => {
    const results = storage.getGameResults();
    safeSet(KEYS.GAME_RESULTS, [result, ...results].slice(0, 100));
  },

  getAchievements: (): Achievement[] => {
    const saved = safeGet<Achievement[]>(KEYS.ACHIEVEMENTS, []);
    if (!saved || saved.length === 0) return ACHIEVEMENTS.map(a => ({ ...a }));
    // Merge saved with defaults to catch new achievements
    return ACHIEVEMENTS.map(a => {
      const found = saved.find(s => s.id === a.id);
      return found ? { ...a, ...found } : { ...a };
    });
  },
  setAchievements: (achievements: Achievement[]): void => safeSet(KEYS.ACHIEVEMENTS, achievements),

  getQuests: (): Quest[] => {
    const saved = safeGet<Quest[]>(KEYS.QUESTS, []);
    const today = new Date().toISOString().split('T')[0];
    // Regenerate if expired or missing
    if (!saved.length || !saved.some(q => q.expiresAt > today)) {
      const fresh = generateDailyQuests();
      safeSet(KEYS.QUESTS, fresh);
      return fresh;
    }
    return saved;
  },
  setQuests: (quests: Quest[]): void => safeSet(KEYS.QUESTS, quests),

  getReminders: () => safeGet(KEYS.REMINDERS, [
    { id: 'r1', title: 'Morning Brain Challenge', time: '09:00', repeat: 'daily' as const, enabled: true, createdAt: new Date().toISOString() },
    { id: 'r2', title: 'Evening Memory Practice', time: '18:00', repeat: 'daily' as const, enabled: true, createdAt: new Date().toISOString() },
    { id: 'r3', title: 'Family Call Reminder', time: '14:00', repeat: 'weekends' as const, enabled: false, createdAt: new Date().toISOString() },
  ]),
  setReminders: (reminders: unknown[]): void => safeSet(KEYS.REMINDERS, reminders),

  getDailyProgress: (): DailyProgress[] => {
    const saved = safeGet<DailyProgress[]>(KEYS.DAILY_PROGRESS, []);
    if (saved.length) return saved;
    // Generate sample data for last 7 days
    const days: DailyProgress[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({
        date: d.toISOString().split('T')[0],
        gamesPlayed: Math.floor(Math.random() * 4) + 1,
        xpEarned: Math.floor(Math.random() * 400) + 100,
        averageScore: Math.floor(Math.random() * 30) + 60,
        questsCompleted: Math.floor(Math.random() * 3) + 1,
      });
    }
    safeSet(KEYS.DAILY_PROGRESS, days);
    return days;
  },
  addDailyProgress: (progress: DailyProgress): void => {
    const existing = storage.getDailyProgress();
    const idx = existing.findIndex(p => p.date === progress.date);
    if (idx >= 0) {
      existing[idx] = progress;
    } else {
      existing.push(progress);
    }
    safeSet(KEYS.DAILY_PROGRESS, existing.slice(-30));
  },

  getAccessibility: () => safeGet(KEYS.ACCESSIBILITY, defaultAccessibility),
  setAccessibility: (settings: unknown): void => safeSet(KEYS.ACCESSIBILITY, settings),

  getTheme: () => safeGet(KEYS.THEME, defaultTheme),
  setTheme: (theme: unknown): void => safeSet(KEYS.THEME, theme),

  getGameSettings: () => safeGet(KEYS.GAME_SETTINGS, defaultGameSettings),
  setGameSettings: (settings: unknown): void => safeSet(KEYS.GAME_SETTINGS, settings),

  getOnboarding: () => safeGet(KEYS.ONBOARDING, defaultOnboarding),
  setOnboarding: (data: unknown): void => safeSet(KEYS.ONBOARDING, data),

  clearAll: (): void => {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  },

  initializeDemoData: (): void => {
    if (!storage.getUser()) {
      storage.setUser(DEMO_USER);
    }
  },
};
