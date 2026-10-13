// src/components/dashboard/AchievementCard.tsx
import { Lock } from 'lucide-react';
import type { Achievement } from '../../types';
import clsx from 'clsx';

interface AchievementCardProps {
  achievement: Achievement;
}

const rarityLabel: Record<string, string> = {
  common: 'Common',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
};

const rarityColors: Record<string, string> = {
  common: 'text-muted-light',
  rare: 'text-blue-400',
  epic: 'text-secondary',
  legendary: 'text-gold',
};

export function AchievementCard({ achievement }: AchievementCardProps) {
  const isUnlocked = Boolean(achievement.unlockedAt);

  if (isUnlocked) {
    return (
      <div className={clsx('glass-card p-5 flex items-start gap-4 border', `rarity-${achievement.rarity}`)}>
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: 'rgba(251,191,36,0.1)' }}
        >
          {achievement.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-bold text-sm truncate">{achievement.name}</h3>
            <span className={clsx('text-xs font-semibold flex-shrink-0', rarityColors[achievement.rarity])}>
              {rarityLabel[achievement.rarity]}
            </span>
          </div>
          <p className="text-muted text-xs mb-2">{achievement.description}</p>
          <div className="flex items-center gap-2">
            <span className="badge-gold text-xs">+{achievement.xpReward} XP</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 flex items-start gap-4 opacity-60">
      <div className="w-14 h-14 rounded-xl bg-surface-elevated border border-border flex items-center justify-center flex-shrink-0">
        <Lock className="w-6 h-6 text-muted" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-text font-bold text-sm mb-1">{achievement.name}</h3>
        <p className="text-muted text-xs mb-2">{achievement.condition}</p>
        {achievement.maxProgress && achievement.maxProgress > 1 && (
          <div>
            <div className="flex justify-between text-xs text-muted mb-1">
              <span>Progress</span>
              <span>{achievement.progress ?? 0} / {achievement.maxProgress}</span>
            </div>
            <div className="xp-bar h-1.5">
              <div
                className="xp-bar-fill"
                style={{ width: `${((achievement.progress ?? 0) / achievement.maxProgress) * 100}%` }}
                aria-hidden="true"
              />
            </div>
          </div>
        )}
        <span className="badge text-xs bg-surface border border-border text-muted mt-2 block w-fit capitalize">
          {rarityLabel[achievement.rarity]}
        </span>
      </div>
    </div>
  );
}
