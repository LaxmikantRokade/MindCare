// src/components/game/GameHUD.tsx
import { ArrowLeft, Pause, Play, RotateCcw, Volume2, VolumeX, Eye } from 'lucide-react';
import { XPBar } from '../ui/XPBar';
import { formatTime } from '../../utils/time';

interface GameHUDProps {
  title: string;
  level?: number;
  timeRemaining?: number;
  timeElapsed?: number;
  score: number;
  moves?: number;
  combo?: number;
  xpEarned?: number;
  accuracy?: number;
  isPaused?: boolean;
  soundEnabled?: boolean;
  onExit: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onRestart?: () => void;
  onToggleSound?: () => void;
  onShowInstructions?: () => void;
  showHints?: boolean;
  onHint?: () => void;
  hintsRemaining?: number;
}

export function GameHUD({
  title,
  level,
  timeRemaining,
  timeElapsed,
  score,
  moves,
  combo,
  xpEarned = 0,
  accuracy,
  isPaused = false,
  soundEnabled = false,
  onExit,
  onPause,
  onResume,
  onRestart,
  onToggleSound,
  onShowInstructions,
  showHints = false,
  onHint,
  hintsRemaining = 3,
}: GameHUDProps) {
  return (
    <header className="glass-card p-4 mb-6" aria-label="Game status bar">
      {/* Top row */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <button
          onClick={onExit}
          className="flex items-center gap-2 text-muted hover:text-text px-3 py-1.5 rounded-lg hover:bg-surface-elevated transition-colors text-sm font-medium"
          aria-label="Exit game"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden />
          <span>Exit</span>
        </button>

        <div className="text-center">
          <h1 className="text-lg font-bold text-white">{title}</h1>
          {level !== undefined && (
            <span className="badge-cyan text-xs">Round {level}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onToggleSound && (
            <button
              onClick={onToggleSound}
              className="p-2 rounded-lg text-muted hover:text-text hover:bg-surface-elevated transition-colors"
              aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          )}
          {onShowInstructions && (
            <button
              onClick={onShowInstructions}
              className="p-2 rounded-lg text-muted hover:text-text hover:bg-surface-elevated transition-colors"
              aria-label="View instructions"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          {onRestart && (
            <button
              onClick={onRestart}
              className="p-2 rounded-lg text-muted hover:text-text hover:bg-surface-elevated transition-colors"
              aria-label="Restart game"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          {onPause && onResume && (
            <button
              onClick={isPaused ? onResume : onPause}
              className="p-2 rounded-lg text-muted hover:text-text hover:bg-surface-elevated transition-colors"
              aria-label={isPaused ? 'Resume game' : 'Pause game'}
            >
              {isPaused ? <Play className="w-4 h-4 text-primary" /> : <Pause className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center pt-2 border-t border-border">
        {timeRemaining !== undefined && (
          <div className="p-1.5 rounded-lg bg-surface-elevated">
            <p className="text-muted text-[10px] uppercase font-bold tracking-wider">Time</p>
            <p className="text-sm font-bold text-text font-mono">{formatTime(timeRemaining)}</p>
          </div>
        )}
        {timeElapsed !== undefined && (
          <div className="p-1.5 rounded-lg bg-surface-elevated">
            <p className="text-muted text-[10px] uppercase font-bold tracking-wider">Time</p>
            <p className="text-sm font-bold text-text font-mono">{formatTime(timeElapsed)}</p>
          </div>
        )}
        <div className="p-1.5 rounded-lg bg-surface-elevated">
          <p className="text-muted text-[10px] uppercase font-bold tracking-wider">Score</p>
          <p className="text-sm font-bold text-primary font-mono">{score}</p>
        </div>
        {moves !== undefined && (
          <div className="p-1.5 rounded-lg bg-surface-elevated">
            <p className="text-muted text-[10px] uppercase font-bold tracking-wider">Moves</p>
            <p className="text-sm font-bold text-text font-mono">{moves}</p>
          </div>
        )}
        {accuracy !== undefined && (
          <div className="p-1.5 rounded-lg bg-surface-elevated">
            <p className="text-muted text-[10px] uppercase font-bold tracking-wider">Accuracy</p>
            <p className="text-sm font-bold text-success font-mono">{accuracy}%</p>
          </div>
        )}
        {combo !== undefined && combo > 1 && (
          <div className="p-1.5 rounded-lg bg-surface-elevated border border-gold/30 animate-pulse">
            <p className="text-gold text-[10px] uppercase font-bold tracking-wider">Combo</p>
            <p className="text-sm font-bold text-gold font-mono">{combo}x 🔥</p>
          </div>
        )}
        <div className="p-1.5 rounded-lg bg-surface-elevated">
          <p className="text-muted text-[10px] uppercase font-bold tracking-wider">XP</p>
          <p className="text-sm font-bold text-secondary font-mono">+{xpEarned}</p>
        </div>
      </div>

      {showHints && onHint && (
        <div className="mt-3 pt-2 border-t border-border flex justify-center">
          <button
            onClick={onHint}
            disabled={hintsRemaining <= 0}
            className="text-xs text-gold border border-gold/30 bg-gold/5 px-3 py-1 rounded-full hover:bg-gold/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
            aria-label={`Use hint, ${hintsRemaining} remaining`}
          >
            💡 Need a Hint? ({hintsRemaining} left)
          </button>
        </div>
      )}
    </header>
  );
}
