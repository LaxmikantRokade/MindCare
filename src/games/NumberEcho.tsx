// src/games/NumberEcho.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameHUD } from '../components/game/GameHUD';
import { GameResultModal } from '../components/game/GameResultModal';
import { useApp } from '../context/AppContext';
import { calculateXPForGame } from '../utils/xp';
import type { GameDifficulty, GameResult } from '../types';

export default function NumberEcho() {
  const navigate = useNavigate();
  const { addGameResult, accessibility } = useApp();

  const [difficulty, setDifficulty] = useState<GameDifficulty>('medium');
  const [phase, setPhase] = useState<'showing' | 'input'>('showing');
  const [round, setRound] = useState(1);
  const [targetDigits, setTargetDigits] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(accessibility.soundEffects);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [instructionsVisible, setInstructionsVisible] = useState(false);

  const totalRounds = 5;
  const numDigits = (difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5) + (round - 1);
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
      // Audio context handler
    }
  }, [soundEnabled]);

  const speakInstructions = useCallback(() => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("Memorize the digits shown on screen. When they disappear, type the digits in the exact same sequence using the number pad.");
    window.speechSynthesis.speak(utterance);
  }, []);

  const generateRoundDigits = useCallback(() => {
    const digits: number[] = [];
    for (let i = 0; i < numDigits; i++) {
      digits.push(Math.floor(Math.random() * 10));
    }
    setTargetDigits(digits);
    setUserInput([]);
    setPhase('showing');

    const displayTime = numDigits * 900;
    setTimeout(() => {
      setPhase('input');
      playBeep(650);
    }, displayTime);
  }, [numDigits, playBeep]);

  const startNewGame = useCallback(() => {
    setRound(1);
    setScore(0);
    setCombo(1);
    setTimeElapsed(0);
    setIsGameOver(false);
    setGameResult(null);
    generateRoundDigits();

    if (accessibility.readAloud) {
      speakInstructions();
    }
  }, [generateRoundDigits, accessibility.readAloud, speakInstructions]);

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

  const handleDigitPress = (digit: number) => {
    if (phase !== 'input' || isGameOver) return;
    playBeep(440 + digit * 40);

    const updated = [...userInput, digit];
    setUserInput(updated);

    if (updated.length === targetDigits.length) {
      // Validate
      const isCorrect = updated.every((d, idx) => d === targetDigits[idx]);
      if (isCorrect) {
        playBeep(880);
        const points = 120 * combo;
        setScore(s => s + points);
        setCombo(c => Math.min(c + 1, 5));

        if (round >= totalRounds) {
          finishGame(score + points, 100);
        } else {
          setRound(r => r + 1);
          setTimeout(() => {
            generateRoundDigits();
          }, 800);
        }
      } else {
        playBeep(220);
        setCombo(1);
        if (round >= totalRounds) {
          finishGame(score, 70);
        } else {
          setRound(r => r + 1);
          setTimeout(() => {
            generateRoundDigits();
          }, 1000);
        }
      }
    }
  };

  const handleBackspace = () => {
    setUserInput(prev => prev.slice(0, -1));
  };

  const finishGame = (finalScore: number, accuracy: number) => {
    setIsGameOver(true);

    const result: GameResult = {
      id: Date.now().toString(),
      gameId: 'number-echo',
      gameName: 'Number Echo',
      score: finalScore,
      accuracy,
      timeSeconds: timeElapsed,
      moves: round,
      combo,
      xpEarned: calculateXPForGame({
        id: '',
        gameId: 'number-echo',
        gameName: 'Number Echo',
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
        title="Number Echo"
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
            {d} ({d === 'easy' ? '3 digits' : d === 'medium' ? '4 digits' : '5 digits'})
          </button>
        ))}
      </div>

      {/* Instructions Banner */}
      {instructionsVisible && (
        <div className="glass-card p-4 mb-6 text-sm text-muted-light border-primary/30 flex justify-between items-center">
          <p>Watch the digits carefully while they are visible. When they vanish, key in the numbers in the same order.</p>
          <button onClick={speakInstructions} className="btn-ghost text-xs py-1.5 px-3">
            🔊 Read Aloud
          </button>
        </div>
      )}

      {/* Number Display Box */}
      <div className="glass-card p-8 mb-8 text-center max-w-xl mx-auto border-primary/30">
        <p className="text-xs font-bold uppercase tracking-wider text-muted mb-4">
          {phase === 'showing' ? '👀 Memorize the Digits...' : '⌨️ Type The Numbers Back!'}
        </p>

        <div className="flex justify-center items-center gap-2 sm:gap-3 min-h-[72px]">
          {phase === 'showing' ? (
            targetDigits.map((digit, idx) => (
              <div
                key={idx}
                className="w-12 h-14 sm:w-14 sm:h-16 rounded-2xl bg-surface-elevated border-2 border-primary text-3xl sm:text-4xl text-primary font-black flex items-center justify-center shadow-glow-cyan"
              >
                {digit}
              </div>
            ))
          ) : (
            targetDigits.map((_, idx) => (
              <div
                key={idx}
                className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl border-2 flex items-center justify-center text-3xl sm:text-4xl font-black ${
                  userInput[idx] !== undefined
                    ? 'bg-primary/20 border-primary text-white shadow-glow-cyan'
                    : 'bg-surface-elevated border-dashed border-border text-muted'
                }`}
              >
                {userInput[idx] !== undefined ? userInput[idx] : '•'}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Number Keypad */}
      <div className="max-w-xs mx-auto grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleDigitPress(num)}
            disabled={phase !== 'input' || isGameOver}
            className="h-16 rounded-2xl bg-surface-elevated border-2 border-border text-2xl font-bold text-white hover:border-primary hover:bg-primary/10 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-card"
          >
            {num}
          </button>
        ))}
        <button
          onClick={handleBackspace}
          disabled={phase !== 'input' || userInput.length === 0 || isGameOver}
          className="h-16 rounded-2xl bg-surface-elevated border-2 border-border text-sm font-bold text-muted-light hover:border-danger hover:text-danger disabled:opacity-40 transition-all flex items-center justify-center"
        >
          ⌫ Delete
        </button>
        <button
          onClick={() => handleDigitPress(0)}
          disabled={phase !== 'input' || isGameOver}
          className="h-16 rounded-2xl bg-surface-elevated border-2 border-border text-2xl font-bold text-white hover:border-primary hover:bg-primary/10 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-card"
        >
          0
        </button>
        <button
          onClick={() => setUserInput([])}
          disabled={phase !== 'input' || userInput.length === 0 || isGameOver}
          className="h-16 rounded-2xl bg-surface-elevated border-2 border-border text-sm font-bold text-muted-light hover:border-warning hover:text-warning disabled:opacity-40 transition-all flex items-center justify-center"
        >
          ↺ Clear
        </button>
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
