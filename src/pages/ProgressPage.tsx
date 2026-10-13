// src/pages/ProgressPage.tsx
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line
} from 'recharts';
import { BarChart2, Gamepad2, Star, Trophy, Zap, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { storage } from '../services/storage';
import { getDayName } from '../utils/time';
import { GAMES } from '../data/constants';
import { ChartCard } from '../components/dashboard/ChartCard';

const tooltipStyle = {
  backgroundColor: '#0d1424',
  border: '1px solid #1e3a5f',
  borderRadius: '10px',
  color: '#e2e8f0',
  fontSize: '12px',
};

export default function ProgressPage() {
  const { playerStats, gameResults } = useApp();
  const dailyProgress = storage.getDailyProgress();

  const weeklyData = dailyProgress.slice(-7).map(d => ({
    day: getDayName(d.date),
    Games: d.gamesPlayed,
    XP: d.xpEarned,
    Score: d.averageScore,
  }));

  const gamePerformance = GAMES.map(g => {
    const results = gameResults.filter(r => r.gameId === g.id);
    const avg = results.length ? Math.round(results.reduce((s, r) => s + r.accuracy, 0) / results.length) : 0;
    return { name: g.name.split(' ')[0], accuracy: avg, games: results.length };
  });

  const avgScore = gameResults.length
    ? Math.round(gameResults.reduce((s, r) => s + r.accuracy, 0) / gameResults.length)
    : 0;

  const statCards = [
    { icon: Gamepad2, label: 'Total Games', value: playerStats.totalGamesPlayed, color: 'text-primary', bg: 'bg-primary/10' },
    { icon: Star, label: 'Avg Accuracy', value: `${avgScore}%`, color: 'text-secondary', bg: 'bg-secondary/10' },
    { icon: Trophy, label: 'Achievements', value: playerStats.achievements.length, color: 'text-gold', bg: 'bg-gold/10' },
    { icon: Zap, label: 'Total XP', value: playerStats.xp.toLocaleString(), color: 'text-success', bg: 'bg-success/10' },
    { icon: Flame, label: 'Best Streak', value: `${playerStats.streak} days`, color: 'text-warning', bg: 'bg-warning/10' },
    { icon: BarChart2, label: 'Current Level', value: playerStats.level, color: 'text-primary', bg: 'bg-primary/10' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black text-white mb-2">Gameplay Progress</h1>
        <p className="text-muted">Track your cognitive wellness activity and gameplay performance over time.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map(s => (
          <div key={s.label} className="glass-card p-5 flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} aria-hidden="true" />
            </div>
            <div>
              <p className="text-muted text-xs uppercase tracking-wider">{s.label}</p>
              <p className="text-xl font-bold text-white mt-0.5">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Activity */}
      <ChartCard title="Weekly Activity" subtitle="XP Progress over the last 7 days">
        {weeklyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,95,0.5)" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="XP" stroke="#00d4ff" strokeWidth={2} fill="url(#xpGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-48 flex items-center justify-center">
            <p className="text-muted">Play some games to see your activity chart!</p>
          </div>
        )}
      </ChartCard>

      {/* Game Performance */}
      <ChartCard title="Game Performance" subtitle="Average accuracy score percentage across brain training games">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={gamePerformance} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,95,0.5)" />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="accuracy" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Games Played Chart */}
      <ChartCard title="Daily Games Played" subtitle="Total cognitive challenges completed per day">
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,95,0.5)" />
            <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="Games" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Recent Results */}
      {gameResults.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4">Recent Results</h2>
          <div className="space-y-3">
            {gameResults.slice(0, 8).map(r => (
              <div key={r.id} className="flex items-center gap-4 p-3 rounded-xl bg-surface-elevated">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Gamepad2 className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text text-sm font-semibold truncate">{r.gameName}</p>
                  <p className="text-muted text-xs">Score: {r.score} · Accuracy: {r.accuracy}%</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-primary text-sm font-bold">+{r.xpEarned} XP</p>
                  <p className="text-muted text-xs capitalize">{r.difficulty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
