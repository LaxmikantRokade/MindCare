// src/types/index.ts

export type Role = 'user' | 'caregiver';

export type GameDifficulty = 'easy' | 'medium' | 'hard';

export type ThemeMode = 'dark' | 'light' | 'system';

export interface User {
  id: string;
  name: string;
  age: number;
  role: Role;
  avatar: string;
  createdAt: string;
}

export interface PlayerStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  lastPlayedDate: string | null;
  totalGamesPlayed: number;
  totalXPEarned: number;
  achievements: string[];
  favoriteGame: string | null;
}

export interface Game {
  id: string;
  name: string;
  description: string;
  category: 'memory' | 'recall' | 'pattern' | 'attention' | 'speed';
  icon: string;
  difficulties: GameDifficulty[];
  maxXP: number;
  minTime: number;
  available: boolean;
}

export interface GameResult {
  id: string;
  gameId: string;
  gameName: string;
  score: number;
  accuracy: number;
  timeSeconds: number;
  moves?: number;
  combo?: number;
  xpEarned: number;
  difficulty: GameDifficulty;
  playedAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  unlockedAt: string | null;
  progress?: number;
  maxProgress?: number;
  condition: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  xpReward: number;
  gameId?: string;
  targetCount: number;
  currentCount: number;
  completed: boolean;
  expiresAt: string;
}

export interface Reminder {
  id: string;
  title: string;
  time: string;
  repeat: 'daily' | 'weekdays' | 'weekends' | 'once';
  enabled: boolean;
  createdAt: string;
}

export interface DailyProgress {
  date: string;
  gamesPlayed: number;
  xpEarned: number;
  averageScore: number;
  questsCompleted: number;
}

export interface AccessibilitySettings {
  textSize: 'normal' | 'large' | 'extra-large';
  contrast: 'standard' | 'high';
  motion: 'normal' | 'reduced';
  showInstructions: boolean;
  readAloud: boolean;
  soundEffects: boolean;
}

export interface ThemeSettings {
  mode: ThemeMode;
}

export interface GameSettings {
  difficulty: GameDifficulty;
  soundEnabled: boolean;
  hintsEnabled: boolean;
}

export interface OnboardingData {
  completed: boolean;
  focus: string[];
  experienceLevel: 'easy' | 'balanced' | 'challenge';
}

export interface AppState {
  user: User | null;
  playerStats: PlayerStats;
  gameResults: GameResult[];
  achievements: Achievement[];
  quests: Quest[];
  reminders: Reminder[];
  dailyProgress: DailyProgress[];
  accessibility: AccessibilitySettings;
  theme: ThemeSettings;
  gameSettings: GameSettings;
  onboarding: OnboardingData;
}
