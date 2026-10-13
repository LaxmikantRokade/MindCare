// src/components/game/GameCard.tsx
import { Play, Lock } from 'lucide-react';
import type { Game } from '../../types';
import clsx from 'clsx';

interface GameCardProps {
  game: Game;
  bestScore?: number | null;
  timesPlayed?: number;
  onPlay: (gameId: string) => void;
}

const difficultyColors = {
  easy: 'badge-green',
  medium: 'badge-cyan',
  hard: 'badge-purple',
};

export function GameCard({ game, bestScore, timesPlayed = 0, onPlay }: GameCardProps) {
  const isAvailable = game.available;

  return (
    <div
      className={clsx(
        'glass-card p-6 flex flex-col gap-4 transition-all duration-300',
        isAvailable ? 'hover:border-border-bright cursor-pointer group' : 'opacity-60 cursor-not-allowed'
      )}
      onClick={() => isAvailable && onPlay(game.id)}
      role={isAvailable ? 'button' : undefined}
      tabIndex={isAvailable ? 0 : -1}
      aria-label={isAvailable ? `Play ${game.name}` : `${game.name} - Coming Soon`}
      onKeyDown={(e) => isAvailable && e.key === 'Enter' && onPlay(game.id)}
    >
      <div className="flex items-start justify-between">
        <div className="text-4xl" aria-hidden="true">{game.icon}</div>
        {!isAvailable && (
          <div className="badge-purple text-xs flex items-center gap-1">
            <Lock className="w-3 h-3" aria-hidden="true" />
            Coming Soon
          </div>
        )}
        {isAvailable && (
          <div className="badge-cyan text-xs">+{game.maxXP} XP</div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-bold text-white mb-1">{game.name}</h2>
        <p className="text-muted text-sm leading-relaxed line-clamp-2">{game.description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="badge text-xs bg-surface-elevated border border-border text-muted-light capitalize">
          {game.category}
        </span>
        {game.difficulties.map(d => (
          <span key={d} className={`${difficultyColors[d]} text-xs capitalize`}>
            {d}
          </span>
        ))}
      </div>

      {bestScore !== undefined && bestScore !== null && (
        <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
          <span className="text-muted">Best Score: <span className="text-success font-semibold">{bestScore}</span></span>
          <span className="text-muted">Played: <span className="text-text font-semibold">{timesPlayed}x</span></span>
        </div>
      )}

      {bestScore === null && (
        <div className="text-xs text-muted pt-2 border-t border-border">Not played yet — be the first!</div>
      )}

      {isAvailable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlay(game.id);
          }}
          className="btn-primary w-full gap-2 mt-auto group-hover:gap-3 transition-all"
          aria-label={`Play ${game.name}`}
        >
          <Play className="w-4 h-4" aria-hidden="true" />
          Play Now
        </button>
      )}
    </div>
  );
}
