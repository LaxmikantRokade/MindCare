// src/pages/ProfilePage.tsx
import { useState } from 'react';
import { Flame, Star, Trophy, Gamepad2, Edit3, X, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { XPBar } from '../components/ui/XPBar';
import { LevelBadge } from '../components/ui/LevelBadge';
import { getXPProgress } from '../utils/xp';
import { GAMES, LEVELS } from '../data/constants';

export default function ProfilePage() {
  const { user, setUser, playerStats, achievements, gameResults } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || 'Rahul Sharma');
  const [editAge, setEditAge] = useState(user?.age || 68);
  const [editAvatar, setEditAvatar] = useState(user?.avatar || 'RS');

  const xpProgress = getXPProgress(playerStats);
  const unlocked = achievements.filter(a => a.unlockedAt);
  const levelInfo = LEVELS.find(l => l.level === playerStats.level) ?? LEVELS[0];

  const favoriteGame = playerStats.favoriteGame
    ? GAMES.find(g => g.id === playerStats.favoriteGame)
    : null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const updated = {
      ...user,
      name: editName.trim() || user.name,
      age: Number(editAge) || user.age,
      avatar: editAvatar.trim().toUpperCase().slice(0, 2) || user.avatar,
    };
    setUser(updated);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Profile Banner */}
      <div className="glass-card overflow-hidden">
        <div className="h-32 relative" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(139,92,246,0.2))' }}>
          <div className="absolute inset-0 bg-grid opacity-30" aria-hidden="true" />
        </div>
        <div className="px-6 pb-6 relative">
          {/* Avatar */}
          <div className="flex items-end gap-4 -mt-10 mb-4">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-2xl border-4 border-surface flex items-center justify-center text-2xl font-black text-white"
                style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.4), rgba(139,92,246,0.4))' }}
                aria-label={`Avatar for ${user?.name}`}
              >
                {user?.avatar || 'RS'}
              </div>
              {/* Level ring */}
              <div className="absolute -bottom-2 -right-2">
                <LevelBadge level={playerStats.level} size="sm" />
              </div>
            </div>
            <div className="mb-2 flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-white">{user?.name || 'Rahul Sharma'}</h1>
                <span className="badge-cyan text-xs">{levelInfo.title}</span>
              </div>
              <p className="text-muted text-sm">Age {user?.age || 68} · {user?.role === 'user' ? 'Cognitive Wellness Player' : 'Caregiver'}</p>
            </div>
            <button
              onClick={() => {
                setEditName(user?.name || 'Rahul Sharma');
                setEditAge(user?.age || 68);
                setEditAvatar(user?.avatar || 'RS');
                setIsEditing(true);
              }}
              className="btn-ghost text-sm gap-2 hidden sm:flex"
              aria-label="Edit profile"
            >
              <Edit3 className="w-4 h-4" aria-hidden="true" />
              Edit Profile
            </button>
          </div>

          {/* XP Progress */}
          <XPBar current={xpProgress.current} max={xpProgress.max} level={playerStats.level} size="md" />
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Edit Profile">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
          <form onSubmit={handleSaveProfile} className="relative z-10 w-full max-w-md glass-card p-6 border-primary/40 shadow-glow-cyan animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Edit Profile</h2>
              <button type="button" onClick={() => setIsEditing(false)} className="p-1 rounded-lg hover:bg-surface-elevated text-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Your Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-elevated border border-border text-white focus:outline-none focus:border-primary text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Age</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={editAge}
                  onChange={(e) => setEditAge(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-elevated border border-border text-white focus:outline-none focus:border-primary text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Avatar Initials (1-2 letters)</label>
                <input
                  type="text"
                  maxLength={2}
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-elevated border border-border text-white focus:outline-none focus:border-primary text-sm uppercase"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setIsEditing(false)} className="btn-ghost flex-1">
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1 gap-2">
                <Check className="w-4 h-4" /> Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Flame, label: 'Current Streak', value: `${playerStats.streak} Days 🔥`, color: 'text-warning', bg: 'bg-warning/10' },
          { icon: Star, label: 'Total XP', value: playerStats.xp.toLocaleString(), color: 'text-primary', bg: 'bg-primary/10' },
          { icon: Trophy, label: 'Achievements', value: `${unlocked.length} / ${achievements.length}`, color: 'text-gold', bg: 'bg-gold/10' },
          { icon: Gamepad2, label: 'Games Played', value: playerStats.totalGamesPlayed, color: 'text-secondary', bg: 'bg-secondary/10' },
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

      {/* Favorite Game */}
      {favoriteGame && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4">Favorite Game</h2>
          <div className="flex items-center gap-4">
            <div className="text-4xl" aria-hidden="true">{favoriteGame.icon}</div>
            <div>
              <p className="text-white font-bold">{favoriteGame.name}</p>
              <p className="text-muted text-sm">{favoriteGame.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Showcase */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-4">Achievement Showcase</h2>
        {unlocked.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-muted mx-auto mb-3" aria-hidden="true" />
            <p className="text-muted">Complete games to earn your first achievement!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {unlocked.slice(0, 8).map(a => (
              <div key={a.id} className={`glass-card p-4 text-center border rarity-${a.rarity}`}>
                <div className="text-3xl mb-2" aria-hidden="true">{a.icon}</div>
                <p className="text-text text-xs font-semibold">{a.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      {gameResults.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {gameResults.slice(0, 5).map(r => (
              <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-elevated">
                <Gamepad2 className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <p className="text-text text-sm font-medium truncate">{r.gameName}</p>
                  <p className="text-muted text-xs">Accuracy: {r.accuracy}%</p>
                </div>
                <span className="text-primary text-sm font-bold">+{r.xpEarned} XP</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
