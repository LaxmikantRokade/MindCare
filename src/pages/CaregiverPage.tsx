// src/pages/CaregiverPage.tsx
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Flame, Star, Trophy, Gamepad2, TrendingUp, CheckCircle, ShieldCheck } from 'lucide-react';
import { storage } from '../services/storage';
import { getDayName, getRelativeTime } from '../utils/time';
import { DEMO_USER, DEFAULT_PLAYER_STATS } from '../data/constants';

const tooltipStyle = {
  backgroundColor: '#0d1424',
  border: '1px solid #1e3a5f',
  borderRadius: '10px',
  color: '#e2e8f0',
  fontSize: '12px',
};

export default function CaregiverPage() {
  const playerStats = storage.getPlayerStats() ?? DEFAULT_PLAYER_STATS;
  const gameResults = storage.getGameResults();
  const dailyProgress = storage.getDailyProgress();
  const achievements = storage.getAchievements();
  const quests = storage.getQuests();

  const weeklyData = dailyProgress.slice(-7).map(d => ({
    day: getDayName(d.date),
    Games: d.gamesPlayed,
    XP: d.xpEarned,
  }));

  const completedQuests = quests.filter(q => q.completed).length;
  const totalQuests = quests.length;
  const unlockedAchievements = achievements.filter(a => a.unlockedAt);
  const recentGames = gameResults.slice(0, 5);
  const avgAccuracy = gameResults.length
    ? Math.round(gameResults.reduce((s, r) => s + r.accuracy, 0) / gameResults.length)
    : 0;

  const insights = [
    playerStats.streak >= 3
      ? `${DEMO_USER.name} has maintained a consistent daily activity streak of ${playerStats.streak} days.`
      : `${DEMO_USER.name} has completed ${playerStats.totalGamesPlayed} brain training activities so far.`,
    gameResults.length > 0
      ? `Most recently played game: "${gameResults[0]?.gameName}".`
      : 'No gameplay recorded today yet. Consider sending an encouraging reminder.',
    avgAccuracy > 0
      ? `Average gameplay accuracy across all completed sessions is ${avgAccuracy}%.`
      : 'Accuracy stats will populate once cognitive challenges are completed.',
    unlockedAchievements.length > 0
      ? `${unlockedAchievements.length} milestones unlocked so far, demonstrating regular engagement.`
      : 'Encourage starting with Memory Match to earn their first milestone!',
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Caregiver header */}
      <div className="glass-card p-6 border-secondary/40 shadow-glow-purple">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="badge-purple mb-3 text-xs inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Caregiver Monitoring Dashboard
            </div>
            <h1 className="text-2xl font-black text-white">Monitoring: {DEMO_USER.name}</h1>
            <p className="text-muted text-sm mt-1">Age {DEMO_USER.age} · Cognitive Wellness Member</p>
          </div>
          <div className="text-left sm:text-right bg-surface-elevated p-3 sm:p-4 rounded-xl border border-border">
            <p className="text-muted text-xs uppercase tracking-wider">Current Level</p>
            <p className="text-3xl font-black text-primary font-mono">{playerStats.level}</p>
            <p className="text-[11px] text-muted-light">{playerStats.xp.toLocaleString()} Total XP</p>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Flame, label: "Current Streak", value: `${playerStats.streak} Days 🔥`, color: 'text-warning', bg: 'bg-warning/10' },
          { icon: CheckCircle, label: "Today's Quests", value: `${completedQuests} / ${totalQuests}`, color: 'text-success', bg: 'bg-success/10' },
          { icon: Star, label: 'Total XP Earned', value: playerStats.xp.toLocaleString(), color: 'text-primary', bg: 'bg-primary/10' },
          { icon: Trophy, label: 'Achievements', value: unlockedAchievements.length, color: 'text-gold', bg: 'bg-gold/10' },
        ].map(s => (
          <div key={s.label} className="glass-card p-5 flex flex-col gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
              <s.icon className={`w-5 h-5 ${s.color}`} aria-hidden="true" />
            </div>
            <div>
              <p className="text-muted text-xs uppercase tracking-wider">{s.label}</p>
              <p className="text-xl font-bold text-white mt-0.5">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Activity Chart */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-6">Weekly Activity & XP Trend</h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="cgXpGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,95,0.5)" />
            <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="XP" stroke="#8b5cf6" strokeWidth={2} fill="url(#cgXpGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Games */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-4">Recent Gameplay Sessions</h2>
        {recentGames.length === 0 ? (
          <p className="text-muted text-sm">No games played yet.</p>
        ) : (
          <div className="space-y-3">
            {recentGames.map(r => (
              <div key={r.id} className="flex items-center gap-4 p-3.5 rounded-xl bg-surface-elevated border border-border">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Gamepad2 className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text text-sm font-semibold">{r.gameName}</p>
                  <p className="text-muted text-xs">{getRelativeTime(r.playedAt)} · Difficulty: <span className="capitalize">{r.difficulty}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-success font-bold text-sm font-mono">{r.accuracy}%</p>
                  <p className="text-muted text-xs font-mono">+{r.xpEarned} XP</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-success" aria-hidden="true" />
          Caregiver Activity Insights
        </h2>
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-elevated border border-border/60">
              <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-success" aria-hidden="true" />
              </div>
              <p className="text-muted-light text-sm leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
        <p className="text-muted text-xs mt-4 p-3 rounded-xl bg-surface-elevated border border-border text-muted-light">
          ⚠️ <strong>Notice:</strong> These insights reflect user interaction and game activity metrics only. MindCare is designed for supportive cognitive wellness and does not constitute medical diagnosis or therapy.
        </p>
      </div>
    </div>
  );
}
