// src/context/AppContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, PlayerStats, Achievement, Quest, GameResult, AccessibilitySettings, ThemeSettings } from '../types';
import { storage } from '../services/storage';
import { applyXP, updateStreakOnPlay } from '../utils/xp';
import { checkAchievements, getNewlyUnlocked } from '../utils/achievements';

interface AppContextType {
  user: User | null;
  playerStats: PlayerStats;
  achievements: Achievement[];
  quests: Quest[];
  gameResults: GameResult[];
  accessibility: AccessibilitySettings;
  theme: ThemeSettings;
  pendingLevelUp: number | null;
  pendingAchievements: Achievement[];
  setUser: (user: User | null) => void;
  addGameResult: (result: GameResult) => void;
  addXP: (amount: number) => void;
  completeQuest: (questId: string) => void;
  dismissLevelUp: () => void;
  dismissAchievements: () => void;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  updateTheme: (theme: Partial<ThemeSettings>) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => storage.getUser());
  const [playerStats, setPlayerStats] = useState<PlayerStats>(() => storage.getPlayerStats());
  const [achievements, setAchievements] = useState<Achievement[]>(() => storage.getAchievements());
  const [quests, setQuests] = useState<Quest[]>(() => storage.getQuests());
  const [gameResults, setGameResults] = useState<GameResult[]>(() => storage.getGameResults());
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => storage.getAccessibility() as AccessibilitySettings);
  const [theme, setTheme] = useState<ThemeSettings>(() => storage.getTheme() as ThemeSettings);
  const [pendingLevelUp, setPendingLevelUp] = useState<number | null>(null);
  const [pendingAchievements, setPendingAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme.mode === 'dark') {
      root.classList.add('dark');
    } else if (theme.mode === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    }
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-text-size', accessibility.textSize);
    root.setAttribute('data-contrast', accessibility.contrast);
    root.setAttribute('data-motion', accessibility.motion);
  }, [accessibility]);

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
    if (u) storage.setUser(u);
    else storage.clearUser();
  }, []);

  const addGameResult = useCallback((result: GameResult) => {
    setGameResults(prev => {
      const next = [result, ...prev].slice(0, 100);
      storage.addGameResult(result);
      return next;
    });

    setPlayerStats(prev => {
      const streakUpdated = updateStreakOnPlay(prev);
      const { newStats, leveledUp, newLevel } = applyXP(streakUpdated, result.xpEarned);
      const updated = {
        ...newStats,
        totalGamesPlayed: prev.totalGamesPlayed + 1,
      };
      storage.setPlayerStats(updated);
      if (leveledUp) setPendingLevelUp(newLevel);
      return updated;
    });

    setAchievements(prev => {
      const allResults = [result, ...storage.getGameResults()];
      const stats = storage.getPlayerStats();
      const updated = checkAchievements(prev, stats, allResults);
      const newlyUnlocked = getNewlyUnlocked(prev, updated);
      if (newlyUnlocked.length > 0) setPendingAchievements(p => [...p, ...newlyUnlocked]);
      storage.setAchievements(updated);
      return updated;
    });
  }, []);

  const addXP = useCallback((amount: number) => {
    setPlayerStats(prev => {
      const { newStats, leveledUp, newLevel } = applyXP(prev, amount);
      storage.setPlayerStats(newStats);
      if (leveledUp) setPendingLevelUp(newLevel);
      return newStats;
    });
  }, []);

  const completeQuest = useCallback((questId: string) => {
    setQuests(prev => {
      const updated = prev.map(q => q.id === questId ? { ...q, completed: true, currentCount: q.targetCount } : q);
      storage.setQuests(updated);
      return updated;
    });
  }, []);

  const dismissLevelUp = useCallback(() => setPendingLevelUp(null), []);
  const dismissAchievements = useCallback(() => setPendingAchievements([]), []);

  const updateAccessibility = useCallback((settings: Partial<AccessibilitySettings>) => {
    setAccessibility(prev => {
      const updated = { ...prev, ...settings };
      storage.setAccessibility(updated);
      return updated;
    });
  }, []);

  const updateTheme = useCallback((t: Partial<ThemeSettings>) => {
    setTheme(prev => {
      const updated = { ...prev, ...t };
      storage.setTheme(updated);
      return updated;
    });
  }, []);

  const logout = useCallback(() => {
    storage.clearUser();
    setUserState(null);
  }, []);

  return (
    <AppContext.Provider value={{
      user, playerStats, achievements, quests, gameResults,
      accessibility, theme,
      pendingLevelUp, pendingAchievements,
      setUser, addGameResult, addXP, completeQuest,
      dismissLevelUp, dismissAchievements,
      updateAccessibility, updateTheme, logout,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
