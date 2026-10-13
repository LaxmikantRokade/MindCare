// src/games/OddOneOut.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameHUD } from '../components/game/GameHUD';
import { GameResultModal } from '../components/game/GameResultModal';
import { useApp } from '../context/AppContext';
import { calculateXPForGame } from '../utils/xp';
import type { GameDifficulty, GameResult } from '../types';

interface RoundData {
  commonSymbol: string;
  oddSymbol: string;
  oddIndex: number;
}

const SYMBOL_PAIRS = [
  { common: '🐶', odd: '🐱' },
  { common: '🍎', odd: '🍊' },
  { common: '🚗', odd: '🚙' },
  { common: '🌸', odd: '🌺' },
  { common: '⭐', odd: '✨' },
  { common: '⚽', odd: '🏀' },
  { common: '🌙', odd: '☀️' },
  { common: '🍀', odd: '🌿' },
  { common: '💎', odd: '🔮' },
  { common: '🚀', odd: '🛸' },
];

export default function OddOneOut() {
  const navigate = useNavigate();
  const { addGameResult, accessibility } = useApp();

  const [difficulty, setDifficulty] = useState<GameDifficulty>('medium');
  const [round, setRound] = useState(1);
  const [roundData, setRoundData] = useState<RoundData | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(accessibility.soundEffects);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [instructionsVisible, setInstructionsVisible] = useState(false);

  const totalRounds = 6;
  const gridSize = difficulty === 'easy' ? 9 : difficulty === 'medium' ? 12 : 16;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const playBeep = useCallback((freq = 500) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {
      // Audio error handler
    }
  }, [soundEnabled]);

  const speakInstructions = useCallback(() => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("Look closely at the grid of items and find the single item that is different from all the others.");
    window.speechSynthesis.speak(utterance);
  }, []);

  const generateRound = useCallback(() => {
    const pair = SYMBOL_PAIRS[Math.floor(Math.random() * SYMBOL_PAIRS.length)];
    const oddIdx = Math.floor(Math.random() * gridSize);
    setRoundData({
      commonSymbol: pair.common,
      oddSymbol: pair.odd,
      oddIndex: oddIdx,
    });
  }, [gridSize]);

  const startNewGame = useCallback(() => {
    setRound(1);
    setScore(0);
    setCombo(1);
    setTimeElapsed(0);
    setIsGameOver(false);
    setGameResult(null);
    generateRound();

    if (accessibility.readAloud) {
      speakInstructions();
    }
  }, [generateRound, accessibility.readAloud, speakInstructions]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // Timer
  useEffect(() => {
    if (isGameOver) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameOver]);

  const handleTileClick = (index: number) => {
    if (!roundData || isGameOver) return;

    if (index === roundData.oddIndex) {
      // CORRECT
      playBeep(880);
      const points = 100 * combo;
      setScore(s => s + points);
      setCombo(c => Math.min(c + 1, 5));

      if (round >= totalRounds) {
        finishGame(score + points, 100);
      } else {
        setRound(r => r + 1);
        generateRound();
      }
    } else {
      // INCORRECT
      playBeep(250);
      setCombo(1);
      if (round >= totalRounds) {
        finishGame(score, 75);
      } else {
        setRound(r => r + 1);
        generateRound();
      }
    }
  };

  const finishGame = (finalScore: number, accuracy: number) => {
    setIsGameOver(true);

    const result: GameResult = {
      id: Date.now().toString(),
      gameId: 'odd-one-out',
      gameName: 'Odd One Out',
      score: finalScore,
      accuracy,
      timeSeconds: timeElapsed,
      moves: round,
      combo,
      xpEarned: calculateXPForGame({
        id: '',
        gameId: 'odd-one-out',
        gameName: 'Odd One Out',
        score: finalScore,
        accuracy,
        timeSeconds: timeElapsed,
        difficulty,
        playedAt: new Date().toISOString(),
        xpEarned: 0,
      }),
      difficulty,
      playedAt: new Date().toISOString(),
    };

    setGameResult(result);
    addGameResult(result);
  };

  const gridClass = difficulty === 'easy'
    ? 'grid-cols-3'
    : difficulty === 'medium'
    ? 'grid-cols-3 sm:grid-cols-4'
    : 'grid-cols-4';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fade-in">
      <GameHUD
        title="Odd One Out"
        level={round}
        score={score}
        combo={combo}
        accuracy={100}
        timeElapsed={timeElapsed}
        xpEarned={Math.floor(score / 5)}
        soundEnabled={soundEnabled}
        onExit={() => navigate('/games')}
        onRestart={startNewGame}
        onToggleSound={() => setSoundEnabled(v => !v)}
        onShowInstructions={() => setInstructionsVisible(v => !v)}
      />

      {/* Difficulty selector */}
      <div className="flex justify-center items-center gap-3 mb-6">
        <span className="text-xs text-muted font-bold uppercase tracking-wider">Difficulty:</span>
        {(['easy', 'medium', 'hard'] as const).map(d => (
          <button
            key={d}
            onClick={() => { setDifficulty(d); }}
            className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-all ${
              difficulty === d ? 'bg-primary text-background' : 'bg-surface-elevated text-muted hover:text-white'
            }`}
          >
            {d} ({d === 'easy' ? '3x3 grid' : d === 'medium' ? '3x4 grid' : '4x4 grid'})
          </button>
        ))}
      </div>

      {/* Instructions Banner */}
      {instructionsVisible && (
        <div className="glass-card p-4 mb-6 text-sm text-muted-light border-primary/30 flex justify-between items-center">
          <p>Scan the symbols on the grid and click the one unique item that doesn't match the rest!</p>
          <button onClick={speakInstructions} className="btn-ghost text-xs py-1.5 px-3">
            🔊 Read Aloud
          </button>
        </div>
      )}

      {/* Grid of symbols */}
      {roundData && (
        <div className={`grid ${gridClass} gap-3 sm:gap-4 max-w-lg mx-auto mb-8`}>
          {Array.from({ length: gridSize }).map((_, idx) => {
            const sym = idx === roundData.oddIndex ? roundData.oddSymbol : roundData.commonSymbol;
            return (
              <button
                key={idx}
                onClick={() => handleTileClick(idx)}
                className="h-20 sm:h-24 rounded-2xl bg-surface-elevated border-2 border-border hover:border-primary text-3xl sm:text-4xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-card font-bold"
                aria-label={`Symbol at position ${idx + 1}`}
              >
                {sym}
              </button>
            );
          })}
        </div>
      )}

      {/* Game Over Modal */}
      {isGameOver && gameResult && (
        <GameResultModal
          result={gameResult}
          onPlayAgain={startNewGame}
        />
      )}
    </div>
  );
}
