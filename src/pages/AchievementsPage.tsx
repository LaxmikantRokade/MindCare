// src/pages/AchievementsPage.tsx
import { Trophy, Lock, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AchievementCard } from '../components/dashboard/AchievementCard';

export default function AchievementsPage() {
  const { achievements } = useApp();
  const unlocked = achievements.filter(a => a.unlockedAt);
  const locked = achievements.filter(a => !a.unlockedAt);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Achievements</h1>
          <p className="text-muted">Your collection of earned badges and milestones.</p>
        </div>
        <div className="glass-card px-5 py-3 flex items-center gap-3">
          <Trophy className="w-5 h-5 text-gold" aria-hidden="true" />
          <div>
            <p className="text-xs text-muted">Unlocked</p>
            <p className="text-white font-bold">{unlocked.length} / {achievements.length}</p>
          </div>
        </div>
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-gold" aria-hidden="true" />
            Unlocked ({unlocked.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlocked.map(a => (
              <AchievementCard key={a.id} achievement={a} />
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-muted" aria-hidden="true" />
            Locked ({locked.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locked.map(a => (
              <AchievementCard key={a.id} achievement={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
