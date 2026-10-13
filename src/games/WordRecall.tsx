// src/games/WordRecall.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameHUD } from '../components/game/GameHUD';
import { GameResultModal } from '../components/game/GameResultModal';
import { useApp } from '../context/AppContext';
import { calculateXPForGame } from '../utils/xp';
import { WORD_LISTS } from '../data/constants';
import type { GameDifficulty, GameResult } from '../types';

export default function WordRecall() {
  const navigate = useNavigate();
  const { addGameResult, accessibility } = useApp();

  const [difficulty, setDifficulty] = useState<GameDifficulty>('medium');
  const [phase, setPhase] = useState<'memorize' | 'recall'>('memorize');
  const [targetWords, setTargetWords] = useState<string[]>([]);
  const [candidateWords, setCandidateWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(6);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(accessibility.soundEffects);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [instructionsVisible, setInstructionsVisible] = useState(false);

  const numTarget = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 6;
  const numDistractors = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 6;
  const memoDuration = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 6 : 5;

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
      // Audio context error handler
    }
  }, [soundEnabled]);

  const speakInstructions = useCallback(() => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("Memorize the words shown on screen. When time is up, select all the words you remember from the options.");
    window.speechSynthesis.speak(utterance);
  }, []);

  const startNewGame = useCallback(() => {
    const list = WORD_LISTS[difficulty];
    const shuffled = [...list].sort(() => Math.random() - 0.5);

    const targets = shuffled.slice(0, numTarget);
    const distractors = shuffled.slice(numTarget, numTarget + numDistractors);
    const candidates = [...targets, ...distractors].sort(() => Math.random() - 0.5);

    setTargetWords(targets);
    setCandidateWords(candidates);
    setSelectedWords([]);
    setPhase('memorize');
    setCountdown(memoDuration);
    setScore(0);
    setTimeElapsed(0);
    setIsGameOver(false);
    setGameResult(null);

    if (accessibility.readAloud) {
      speakInstructions();
    }
  }, [difficulty, numTarget, numDistractors, memoDuration, accessibility.readAloud, speakInstructions]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // Memorization countdown
  useEffect(() => {
    if (phase !== 'memorize') return;

    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timer);
          setPhase('recall');
          playBeep(880);
          return 0;
        }
        playBeep(440);
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, playBeep]);

  // Elapsed time tracker
  useEffect(() => {
    if (isGameOver || phase === 'memorize') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameOver, phase]);

  const toggleWordSelection = (word: string) => {
    if (isGameOver) return;
    playBeep(600);
    setSelectedWords(prev =>
      prev.includes(word) ? prev.filter(w => w !== word) : [...prev, word]
    );
  };

  const handleFinishRecall = () => {
    let correctCount = 0;
    selectedWords.forEach(word => {
      if (targetWords.includes(word)) correctCount++;
    });

    const accuracy = Math.round((correctCount / targetWords.length) * 100);
    const calculatedScore = correctCount * 50 + accuracy * 2;
    setScore(calculatedScore);
    setIsGameOver(true);

    const result: GameResult = {
      id: Date.now().toString(),
      gameId: 'word-recall',
      gameName: 'Word Recall',
      score: calculatedScore,
      accuracy,
      timeSeconds: timeElapsed + memoDuration,
      moves: selectedWords.length,
      xpEarned: calculateXPForGame({
        id: '',
        gameId: 'word-recall',
        gameName: 'Word Recall',
        score: calculatedScore,
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
        title="Word Recall"
        score={score}
        accuracy={selectedWords.length > 0 ? Math.round((selectedWords.filter(w => targetWords.includes(w)).length / targetWords.length) * 100) : 100}
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
            {d} ({d === 'easy' ? '4 words' : d === 'medium' ? '5 words' : '6 words'})
          </button>
        ))}
      </div>

      {/* Instructions Banner */}
      {instructionsVisible && (
        <div className="glass-card p-4 mb-6 text-sm text-muted-light border-primary/30 flex justify-between items-center">
          <p>Study the words shown on the board. When the timer runs out, pick the words that were in the original list.</p>
          <button onClick={speakInstructions} className="btn-ghost text-xs py-1.5 px-3">
            🔊 Read Aloud
          </button>
        </div>
      )}

      {/* Memorization Phase */}
      {phase === 'memorize' && (
        <div className="glass-card p-8 mb-8 text-center max-w-2xl mx-auto border-primary/40 shadow-glow-cyan animate-pulse-slow">
          <div className="badge-cyan mb-4 text-sm font-bold">
            ⏳ Study Phase — {countdown}s Remaining
          </div>
          <h2 className="text-2xl font-bold text-white mb-6">Remember These Words</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {targetWords.map((word, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-surface-elevated border-2 border-primary/40 text-xl font-black text-primary tracking-wide shadow-card"
              >
                {word}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recall Phase */}
      {phase === 'recall' && (
        <div className="glass-card p-8 mb-8 max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="badge-purple mb-2 text-xs">Recall Phase</div>
            <h2 className="text-2xl font-bold text-white">Select The Words You Remember</h2>
            <p className="text-muted text-xs mt-1">Select exactly {targetWords.length} words, then click Submit</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
            {candidateWords.map((word, idx) => {
              const isSelected = selectedWords.includes(word);
              return (
                <button
                  key={idx}
                  onClick={() => toggleWordSelection(word)}
                  className={`p-4 rounded-2xl font-bold text-sm sm:text-base transition-all duration-200 border-2 ${
                    isSelected
                      ? 'bg-primary text-background border-primary shadow-glow-cyan scale-105'
                      : 'bg-surface-elevated text-text border-border hover:border-primary/50'
                  }`}
                  aria-pressed={isSelected}
                >
                  {word}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleFinishRecall}
            disabled={selectedWords.length === 0}
            className="btn-primary w-full py-4 text-base font-bold disabled:opacity-40"
          >
            Submit Answer ({selectedWords.length} / {targetWords.length} Selected)
          </button>
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
