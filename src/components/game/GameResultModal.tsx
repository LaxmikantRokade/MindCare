// src/components/game/GameResultModal.tsx
import { useNavigate } from 'react-router-dom';
import { Trophy, RotateCcw, ArrowRight, Star, Clock, CheckCircle2, Target } from 'lucide-react';
import type { GameResult } from '../../types';
import { formatTime } from '../../utils/time';
import { getAdaptiveDifficulty } from '../../utils/xp';

interface GameResultModalProps {
  result: GameResult;
  onPlayAgain: () => void;
  bestScore?: number;
}

export function GameResultModal({ result, onPlayAgain, bestScore }: GameResultModalProps) {
  const navigate = useNavigate();
  const isNewBest = bestScore !== undefined && result.score > bestScore;
  const adaptive = getAdaptiveDifficulty(result.accuracy, result.difficulty);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Challenge Complete!"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-md glass-card p-6 sm:p-8 text-center border-primary/40 shadow-glow-cyan animate-bounce-in">
        <div
          className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-gold bg-gold/10 animate-glow"
        >
          <Trophy className="w-10 h-10 text-gold" aria-hidden="true" />
        </div>

        <div className="badge-cyan mx-auto mb-2 text-xs">Challenge Complete!</div>
        <h2 className="text-3xl font-black text-white mb-1">{result.gameName}</h2>
        <p className="text-muted text-sm mb-6 capitalize">{result.difficulty} Difficulty</p>

        {isNewBest && (
          <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold animate-pulse">
            <Star className="w-3.5 h-3.5 fill-gold" /> NEW BEST SCORE!
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-surface-elevated border border-border">
            <div className="flex items-center justify-center gap-1.5 text-muted text-xs mb-1">
              <Target className="w-3.5 h-3.5 text-primary" />
              <span>Score</span>
            </div>
            <p className="text-2xl font-black text-white font-mono">{result.score}</p>
          </div>

          <div className="p-3 rounded-xl bg-surface-elevated border border-border">
            <div className="flex items-center justify-center gap-1.5 text-muted text-xs mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              <span>Accuracy</span>
            </div>
            <p className="text-2xl font-black text-success font-mono">{result.accuracy}%</p>
          </div>

          <div className="p-3 rounded-xl bg-surface-elevated border border-border">
            <div className="flex items-center justify-center gap-1.5 text-muted text-xs mb-1">
              <Clock className="w-3.5 h-3.5 text-muted-light" />
              <span>Time</span>
            </div>
            <p className="text-xl font-bold text-text font-mono">{formatTime(result.timeSeconds)}</p>
          </div>

          <div className="p-3 rounded-xl bg-surface-elevated border border-border">
            <div className="flex items-center justify-center gap-1.5 text-muted text-xs mb-1">
              <Star className="w-3.5 h-3.5 text-secondary" />
              <span>XP Earned</span>
            </div>
            <p className="text-xl font-black text-secondary font-mono">+{result.xpEarned}</p>
          </div>
        </div>

        {/* Smart Adaptive Feedback */}
        <div className="p-3 rounded-xl bg-surface-card border border-primary/20 mb-6 text-xs text-muted-light text-left">
          <p className="font-semibold text-primary mb-0.5">MindCare Feedback</p>
          <p>{adaptive.message}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onPlayAgain}
            className="btn-primary flex-1 gap-2"
            aria-label="Play this game again"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>
          <button
            onClick={() => navigate('/games')}
            className="btn-ghost flex-1 gap-2"
            aria-label="Back to game library"
          >
            Games
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
