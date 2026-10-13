// src/games/SequenceRecall.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameHUD } from '../components/game/GameHUD';
import { GameResultModal } from '../components/game/GameResultModal';
import { useApp } from '../context/AppContext';
import { calculateXPForGame } from '../utils/xp';
import { SEQUENCE_SYMBOLS } from '../data/constants';
import type { GameDifficulty, GameResult } from '../types';

export default function SequenceRecall() {
  const navigate = useNavigate();
  const { addGameResult, accessibility } = useApp();

  const [difficulty, setDifficulty] = useState<GameDifficulty>('medium');
  const [round, setRound] = useState(1);
  const [sequence, setSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [isDisplaying, setIsDisplaying] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(accessibility.soundEffects);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [instructionsVisible, setInstructionsVisible] = useState(false);

  const totalRounds = 5;
  const seqLength = (difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5) + (round - 1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const playBeep = useCallback((freq = 500) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {
      // Audio context might be restricted
    }
  }, [soundEnabled]);

  const speakInstructions = useCallback(() => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("Watch the sequence of symbols carefully, then tap the symbols in the exact same order.");
    window.speechSynthesis.speak(utterance);
  }, []);

  const generateRoundSequence = useCallback(() => {
    const newSeq: string[] = [];
    for (let i = 0; i < seqLength; i++) {
      const randSym = SEQUENCE_SYMBOLS[Math.floor(Math.random() * SEQUENCE_SYMBOLS.length)];
      newSeq.push(randSym);
    }
    setSequence(newSeq);
    setUserSequence([]);
    setIsDisplaying(true);
    setActiveIndex(null);

    // Play sequence animation
    let step = 0;
    const interval = setInterval(() => {
      if (step < newSeq.length) {
        setActiveIndex(step);
        playBeep(400 + step * 80);
        step++;
      } else {
        clearInterval(interval);
        setActiveIndex(null);
        setIsDisplaying(false);
      }
    }, 900);
  }, [seqLength, playBeep]);

  const startNewGame = useCallback(() => {
    setRound(1);
    setScore(0);
    setCombo(1);
    setTimeElapsed(0);
    setIsGameOver(false);
    setGameResult(null);
    generateRoundSequence();
    if (accessibility.readAloud) {
      speakInstructions();
    }
  }, [generateRoundSequence, accessibility.readAloud, speakInstructions]);

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

  const handleSymbolClick = (symbol: string) => {
    if (isDisplaying || isGameOver) return;

    playBeep(600);
    const nextIndex = userSequence.length;
    const expected = sequence[nextIndex];

    if (symbol === expected) {
      const updatedUser = [...userSequence, symbol];
      setUserSequence(updatedUser);

      if (updatedUser.length === sequence.length) {
        // ROUND COMPLETE
        const roundScore = 150 * combo + 50;
        setScore(s => s + roundScore);
        setCombo(c => Math.min(c + 1, 5));

        if (round >= totalRounds) {
          // GAME FINISHED
          finishGame(score + roundScore, 100);
        } else {
          setRound(r => r + 1);
          setTimeout(() => {
            generateRoundSequence();
          }, 800);
        }
      }
    } else {
      // MISTAKE
      playBeep(220);
      setCombo(1);
      // Give feedback, re-show round
      setUserSequence([]);
      setTimeout(() => {
        generateRoundSequence();
      }, 1000);
    }
  };

  const finishGame = (finalScore: number, accuracy: number) => {
    setIsGameOver(true);

    const result: GameResult = {
      id: Date.now().toString(),
      gameId: 'sequence-recall',
      gameName: 'Sequence Recall',
      score: finalScore,
      accuracy,
      timeSeconds: timeElapsed,
      moves: round,
      combo,
      xpEarned: calculateXPForGame({
        id: '',
        gameId: 'sequence-recall',
        gameName: 'Sequence Recall',
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
        title="Sequence Recall"
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
            {d} ({d === 'easy' ? '3 symbols' : d === 'medium' ? '4 symbols' : '5 symbols'})
          </button>
        ))}
      </div>

      {/* Instructions Banner */}
      {instructionsVisible && (
        <div className="glass-card p-4 mb-6 text-sm text-muted-light border-primary/30 flex justify-between items-center">
          <p>Memorize the order in which symbols light up, then click the buttons in the exact same sequence.</p>
          <button onClick={speakInstructions} className="btn-ghost text-xs py-1.5 px-3">
            🔊 Read Aloud
          </button>
        </div>
      )}

      {/* Sequence Display Area */}
      <div className="glass-card p-8 mb-8 text-center max-w-xl mx-auto border-primary/30">
        <p className="text-xs font-bold uppercase tracking-wider text-muted mb-4">
          {isDisplaying ? '👀 Watch Carefully...' : '🎯 Recreate The Sequence!'}
        </p>

        <div className="flex justify-center items-center gap-3 min-h-[72px]">
          {sequence.map((sym, idx) => (
            <div
              key={idx}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 border-2 font-bold ${
                isDisplaying
                  ? activeIndex === idx
                    ? 'bg-primary text-background border-primary scale-125 shadow-glow-cyan'
                    : 'bg-surface border-border text-muted opacity-40'
                  : userSequence[idx]
                  ? 'bg-success/20 border-success text-white shadow-glow-green scale-100'
                  : 'bg-surface-elevated border-dashed border-border text-transparent'
              }`}
            >
              {isDisplaying ? (activeIndex === idx ? sym : '?') : (userSequence[idx] || '·')}
            </div>
          ))}
        </div>
      </div>

      {/* Input Pad Buttons */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-lg mx-auto">
        {SEQUENCE_SYMBOLS.map((sym, idx) => (
          <button
            key={idx}
            onClick={() => handleSymbolClick(sym)}
            disabled={isDisplaying || isGameOver}
            className="h-20 sm:h-24 rounded-2xl bg-surface-elevated border-2 border-border text-3xl sm:text-4xl flex items-center justify-center hover:border-primary hover:bg-primary/10 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-bold"
            aria-label={`Symbol ${sym}`}
          >
            {sym}
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
