// src/pages/DashboardPage.tsx
import { useNavigate } from 'react-router-dom';
import {
  Flame, Star, Trophy, Gamepad2, Zap, ArrowRight, Play, CheckCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { XPBar } from '../components/ui/XPBar';
import { LevelBadge } from '../components/ui/LevelBadge';
import { ProgressRing } from '../components/ui/ProgressRing';
import { QuestCard } from '../components/dashboard/QuestCard';
import { getXPProgress } from '../utils/xp';
import { getGreeting } from '../utils/time';
import { GAMES } from '../data/constants';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, playerStats, quests } = useApp();
  const xpProgress = getXPProgress(playerStats);
  const completedQuests = quests.filter(q => q.completed).length;
  const totalQuests = quests.length;

  const stats = [
    { icon: Flame, label: 'Day Streak', value: `${playerStats.streak} Days`, color: 'text-warning', bg: 'bg-warning/10' },
    { icon: Star, label: 'Total XP', value: playerStats.xp.toLocaleString(), color: 'text-primary', bg: 'bg-primary/10' },
    { icon: Trophy, label: 'Achievements', value: playerStats.achievements.length.toString(), color: 'text-gold', bg: 'bg-gold/10' },
    { icon: Gamepad2, label: 'Games Played', value: playerStats.totalGamesPlayed.toString(), color: 'text-secondary', bg: 'bg-secondary/10' },
  ];

  const recentGames = GAMES.slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-muted text-sm mb-1">{getGreeting()},</p>
          <h1 className="text-3xl font-black text-white">{user?.name || 'Player'} 👋</h1>
          <p className="text-muted-light mt-1">Ready for today's challenge?</p>
        </div>
        <div className="flex items-center gap-4">
          <LevelBadge level={playerStats.level} size="lg" />
          <div>
            <p className="text-xs text-muted uppercase tracking-wider">Level</p>
            <p className="text-2xl font-black text-white">{String(playerStats.level).padStart(2, '0')}</p>
            <p className="text-xs text-primary">{xpProgress.current.toLocaleString()} / {xpProgress.max.toLocaleString()} XP</p>
          </div>
        </div>
      </div>

      {/* XP Bar */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-semibold text-text">Experience Progress</span>
          </div>
          <span className="text-xs text-muted">{xpProgress.percentage.toFixed(0)}% to next level</span>
        </div>
        <XPBar current={xpProgress.current} max={xpProgress.max} level={playerStats.level} showLabels={false} size="lg" />
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted">Level {playerStats.level}</span>
          <span className="text-xs text-muted">Level {playerStats.level + 1}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="glass-card p-5 flex flex-col gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
              <s.icon className={`w-5 h-5 ${s.color}`} aria-hidden="true" />
            </div>
            <div>
              <p className="text-muted text-xs uppercase tracking-wider">{s.label}</p>
              <p className="text-2xl font-bold text-white mt-0.5">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Daily Quest Panel */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Today's Quest</h2>
            <p className="text-muted text-sm">Complete 3 cognitive challenges</p>
          </div>
          <div className="flex items-center gap-3">
            <ProgressRing
              percentage={(completedQuests / (totalQuests || 1)) * 100}
              size={60}
              strokeWidth={5}
              label={`${completedQuests}/${totalQuests}`}
            />
            <button
              onClick={() => navigate('/quests')}
              className="btn-ghost text-sm hidden sm:flex"
              aria-label="View all quests"
            >
              View All
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quests.map(q => (
            <QuestCard
              key={q.id}
              quest={q}
              onPlay={(gameId) => navigate(gameId ? `/games/${gameId}` : '/games')}
            />
          ))}
        </div>
      </div>

      {/* Game Library Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Games</h2>
          <button
            onClick={() => navigate('/games')}
            className="text-primary text-sm flex items-center gap-1 hover:text-primary/80 transition-colors"
            aria-label="View all games"
          >
            View All <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentGames.map(game => (
            <button
              key={game.id}
              onClick={() => navigate(`/games/${game.id}`)}
              className="game-card text-left"
              aria-label={`Play ${game.name}`}
            >
              <div className="text-3xl mb-3" aria-hidden="true">{game.icon}</div>
              <h3 className="font-bold text-white mb-1">{game.name}</h3>
              <p className="text-muted text-xs mb-3 line-clamp-2">{game.description}</p>
              <div className="flex items-center justify-between">
                <div className="badge-cyan text-xs">+{game.maxXP} XP</div>
                <span className="text-primary text-xs flex items-center gap-1">
                  Play <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
