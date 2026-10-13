// src/games/PatternPulse.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameHUD } from '../components/game/GameHUD';
import { GameResultModal } from '../components/game/GameResultModal';
import { useApp } from '../context/AppContext';
import { calculateXPForGame } from '../utils/xp';
import { PATTERN_SETS } from '../data/constants';
import type { GameDifficulty, GameResult } from '../types';

export default function PatternPulse() {
  const navigate = useNavigate();
  const { addGameResult, accessibility } = useApp();

  const [difficulty, setDifficulty] = useState<GameDifficulty>('medium');
  const [round, setRound] = useState(0);
  const [patterns, setPatterns] = useState(PATTERN_SETS);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(accessibility.soundEffects);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [instructionsVisible, setInstructionsVisible] = useState(false);

  const totalRounds = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentPattern = patterns[round % patterns.length];

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
      // Audio context error handler
    }
  }, [soundEnabled]);

  const speakInstructions = useCallback(() => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("Identify the recurring sequence rule and select the symbol that correctly fills in the question mark.");
    window.speechSynthesis.speak(utterance);
  }, []);

  const startNewGame = useCallback(() => {
    const shuffled = [...PATTERN_SETS].sort(() => Math.random() - 0.5);
    setPatterns(shuffled);
    setRound(0);
    setScore(0);
    setCombo(1);
    setTimeElapsed(0);
    setIsGameOver(false);
    setGameResult(null);

    if (accessibility.readAloud) {
      speakInstructions();
    }
  }, [accessibility.readAloud, speakInstructions]);

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

  const handleOptionSelect = (option: string) => {
    if (isGameOver) return;

    if (option === currentPattern.answer) {
      // CORRECT
      playBeep(880);
      const points = 100 * combo;
      setScore(s => s + points);
      setCombo(c => Math.min(c + 1, 5));

      if (round + 1 >= totalRounds) {
        finishGame(score + points, 100);
      } else {
        setRound(r => r + 1);
      }
    } else {
      // INCORRECT
      playBeep(250);
      setCombo(1);
      if (round + 1 >= totalRounds) {
        finishGame(score, 75);
      } else {
        setRound(r => r + 1);
      }
    }
  };

  const finishGame = (finalScore: number, accuracy: number) => {
    setIsGameOver(true);

    const result: GameResult = {
      id: Date.now().toString(),
      gameId: 'pattern-pulse',
      gameName: 'Pattern Pulse',
      score: finalScore,
      accuracy,
      timeSeconds: timeElapsed,
      moves: round + 1,
      combo,
      xpEarned: calculateXPForGame({
        id: '',
        gameId: 'pattern-pulse',
        gameName: 'Pattern Pulse',
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fade-in">
      <GameHUD
        title="Pattern Pulse"
        level={round + 1}
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
            {d} ({d === 'easy' ? '4 rounds' : d === 'medium' ? '6 rounds' : '8 rounds'})
          </button>
        ))}
      </div>

      {/* Instructions Banner */}
      {instructionsVisible && (
        <div className="glass-card p-4 mb-6 text-sm text-muted-light border-primary/30 flex justify-between items-center">
          <p>Analyze the repeating pattern sequence and pick the symbol that correctly completes the series.</p>
          <button onClick={speakInstructions} className="btn-ghost text-xs py-1.5 px-3">
            🔊 Read Aloud
          </button>
        </div>
      )}

      {/* Pattern Sequence Strip */}
      <div className="glass-card p-8 mb-8 text-center max-w-2xl mx-auto border-secondary/40 shadow-glow-purple">
        <p className="text-xs font-bold uppercase tracking-wider text-muted mb-4">
          Round {round + 1} of {totalRounds} — Find the missing symbol
        </p>

        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 my-6">
          {currentPattern.pattern.map((sym, idx) => (
            <div
              key={idx}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-surface-elevated border-2 border-border flex items-center justify-center text-3xl sm:text-4xl text-primary font-bold shadow-card"
            >
              {sym}
            </div>
          ))}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 border-2 border-dashed border-primary text-primary flex items-center justify-center text-3xl sm:text-4xl font-bold animate-pulse">
            ?
          </div>
        </div>
      </div>

      {/* Multiple Choice Options */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto">
        {currentPattern.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleOptionSelect(opt)}
            className="h-20 sm:h-24 rounded-2xl bg-surface-elevated border-2 border-border hover:border-primary hover:bg-primary/10 text-3xl sm:text-4xl flex items-center justify-center text-white font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-card"
            aria-label={`Select option ${opt}`}
          >
            {opt}
          </button>
        ))}
      </div>

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
