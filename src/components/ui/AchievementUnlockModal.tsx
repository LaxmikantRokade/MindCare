// src/components/ui/AchievementUnlockModal.tsx
import type { Achievement } from '../../types';
import { Trophy } from 'lucide-react';
import clsx from 'clsx';

interface AchievementUnlockModalProps {
  achievements: Achievement[];
  onClose: () => void;
}

const rarityColors: Record<string, string> = {
  common: 'text-muted-light',
  rare: 'text-blue-400',
  epic: 'text-secondary',
  legendary: 'text-gold',
};

export function AchievementUnlockModal({ achievements, onClose }: AchievementUnlockModalProps) {
  const a = achievements[0];
  if (!a) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal aria-label={`Achievement unlocked: ${a.name}`}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-sm animate-bounce-in">
        <div className={clsx('glass-card p-8 text-center border', `rarity-${a.rarity}`)}>
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl"
            style={{ background: 'rgba(251,191,36,0.1)' }}
          >
            {a.icon}
          </div>
          <div className="badge-gold mx-auto mb-2 w-fit text-xs">Achievement Unlocked!</div>
          <h2 className="text-2xl font-bold text-white mb-1">{a.name}</h2>
          <p className="text-muted text-sm mb-4">{a.description}</p>
          <div className={clsx('text-xs font-semibold uppercase tracking-wider mb-6', rarityColors[a.rarity])}>
            {a.rarity} • +{a.xpReward} XP
          </div>
          <button onClick={onClose} className="btn-primary w-full">Awesome!</button>
        </div>
      </div>
    </div>
  );
}
