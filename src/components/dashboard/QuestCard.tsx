// src/components/dashboard/QuestCard.tsx
import { Trophy, Play, CheckCircle } from 'lucide-react';
import type { Quest } from '../../types';

interface QuestCardProps {
  quest: Quest;
  onPlay: (gameId?: string) => void;
}

export function QuestCard({ quest, onPlay }: QuestCardProps) {
  return (
    <div
      className={`glass-card p-6 flex flex-col gap-4 transition-all duration-200 ${
        quest.completed ? 'border-success/30' : 'hover:border-border-bright'
      }`}
    >
      <div className="flex items-start justify-between">
        <Trophy className={`w-6 h-6 ${quest.completed ? 'text-success' : 'text-gold'}`} aria-hidden="true" />
        {quest.completed ? (
          <div className="badge-green text-xs flex items-center gap-1">
            <CheckCircle className="w-3 h-3" aria-hidden="true" />
            Completed
          </div>
        ) : (
          <div className="badge-cyan text-xs">+{quest.xpReward} XP</div>
        )}
      </div>
      <div>
        <h3 className="text-white font-bold text-lg">{quest.title}</h3>
        <p className="text-muted text-sm mt-1">{quest.description}</p>
      </div>
      <div className="flex items-center justify-between text-xs text-muted">
        <span>Target: {quest.targetCount} game{quest.targetCount !== 1 ? 's' : ''}</span>
        <span>{quest.currentCount}/{quest.targetCount} done</span>
      </div>
      <div className="xp-bar h-2">
        <div
          className="xp-bar-fill"
          style={{ width: `${(quest.currentCount / (quest.targetCount || 1)) * 100}%` }}
          aria-hidden="true"
        />
      </div>
      {quest.completed ? (
        <div className="text-center text-success font-semibold text-sm flex items-center justify-center gap-2 mt-auto">
          <CheckCircle className="w-4 h-4" aria-hidden="true" />
          +{quest.xpReward} XP Earned!
        </div>
      ) : (
        <button
          onClick={() => onPlay(quest.gameId)}
          className="btn-primary w-full gap-2 mt-auto"
          aria-label={`Play ${quest.title}`}
        >
          <Play className="w-4 h-4" aria-hidden="true" />
          Play Now
        </button>
      )}
    </div>
  );
}
