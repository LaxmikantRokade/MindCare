// src/pages/QuestsPage.tsx
import { useNavigate } from 'react-router-dom';
import { Star, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProgressRing } from '../components/ui/ProgressRing';
import { QuestCard } from '../components/dashboard/QuestCard';
import { AchievementCard } from '../components/dashboard/AchievementCard';

export default function QuestsPage() {
  const navigate = useNavigate();
  const { quests, playerStats, achievements } = useApp();

  const completed = quests.filter(q => q.completed).length;
  const total = quests.length;
  const totalQuestXP = quests.reduce((sum, q) => q.completed ? sum + q.xpReward : sum, 0);
  const unlockedAchievements = achievements.filter(a => a.unlockedAt);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black text-white mb-2">Daily Quests</h1>
        <p className="text-muted">Complete today's challenges to earn XP and maintain your streak.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5 flex items-center gap-4 md:col-span-1">
          <ProgressRing
            percentage={(completed / (total || 1)) * 100}
            size={70}
            strokeWidth={6}
            label={`${completed}/${total}`}
            sublabel="Done"
          />
          <div>
            <p className="text-white font-bold text-lg">Today's Progress</p>
            <p className="text-muted text-sm">{completed === total ? 'All quests complete! 🎉' : `${total - completed} quest${total - completed !== 1 ? 's' : ''} remaining`}</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
            <Star className="w-6 h-6 text-gold" aria-hidden="true" />
          </div>
          <div>
            <p className="text-muted text-xs uppercase tracking-wider">XP Earned Today</p>
            <p className="text-2xl font-bold text-white">+{totalQuestXP}</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
            <Flame className="w-6 h-6 text-warning" aria-hidden="true" />
          </div>
          <div>
            <p className="text-muted text-xs uppercase tracking-wider">Current Streak</p>
            <p className="text-2xl font-bold text-white">{playerStats.streak} Days 🔥</p>
          </div>
        </div>
      </div>

      {/* Quest Cards */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Today's Challenges</h2>
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

      {/* Achievements Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Recent Achievements</h2>
        {unlockedAchievements.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-muted">No achievements yet. Complete quests to unlock them!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedAchievements.slice(0, 6).map(a => (
              <AchievementCard key={a.id} achievement={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
