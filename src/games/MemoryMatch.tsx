// src/games/MemoryMatch.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameHUD } from '../components/game/GameHUD';
import { GameResultModal } from '../components/game/GameResultModal';
import { useApp } from '../context/AppContext';
import { calculateXPForGame } from '../utils/xp';
import type { GameDifficulty, GameResult } from '../types';

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const SYMBOLS = ['🧠', '🌟', '🔮', '💎', '🚀', '🌺', '🍀', '🍎', '⚡', '🌙', '🎨', '🎵'];

export default function MemoryMatch() {
  const navigate = useNavigate();
  const { addGameResult, accessibility } = useApp();

  const [difficulty, setDifficulty] = useState<GameDifficulty>('medium');
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(accessibility.soundEffects);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [instructionsVisible, setInstructionsVisible] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const numPairs = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;

  const playBeep = useCallback((freq = 440, type: OscillatorType = 'sine', duration = 0.15) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // Audio context might be restricted
    }
  }, [soundEnabled]);

  const speakInstructions = useCallback(() => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("Flip the cards to find matching pairs of symbols. Match all pairs with fewer moves for higher score.");
    window.speechSynthesis.speak(utterance);
  }, []);

  const initializeGame = useCallback(() => {
    const selectedSymbols = SYMBOLS.slice(0, numPairs);
    const cardPairs = [...selectedSymbols, ...selectedSymbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, idx) => ({
        id: idx,
        symbol,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(cardPairs);
    setFlippedIndices([]);
    setMoves(0);
    setScore(0);
    setCombo(1);
    setTimeElapsed(0);
    setIsPaused(false);
    setIsGameOver(false);
    setHintsRemaining(3);
    setGameResult(null);

    if (accessibility.readAloud) {
      speakInstructions();
    }
  }, [numPairs, accessibility.readAloud, speakInstructions]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Timer
  useEffect(() => {
    if (isGameOver || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameOver, isPaused]);

  // Card click handler
  const handleCardClick = (index: number) => {
    if (isPaused || isGameOver) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;
    if (flippedIndices.length >= 2) return;

    playBeep(520, 'sine', 0.1);

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.symbol === secondCard.symbol) {
        // MATCH!
        playBeep(880, 'triangle', 0.25);
        setTimeout(() => {
          setCards(prev => {
            const updated = [...prev];
            updated[firstIdx].isMatched = true;
            updated[secondIdx].isMatched = true;

            const allMatched = updated.every(c => c.isMatched);
            if (allMatched) {
              handleGameComplete(moves + 1);
            }
            return updated;
          });
          setScore(s => s + 100 * combo);
          setCombo(c => Math.min(c + 1, 5));
          setFlippedIndices([]);
        }, 500);
      } else {
        // MISMATCH
        playBeep(260, 'sawtooth', 0.15);
        setTimeout(() => {
          setCards(prev => {
            const updated = [...prev];
            updated[firstIdx].isFlipped = false;
            updated[secondIdx].isFlipped = false;
            return updated;
          });
          setCombo(1);
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  const handleGameComplete = (totalMoves: number) => {
    setIsGameOver(true);
    playBeep(1046, 'sine', 0.4);

    const accuracy = Math.max(10, Math.min(100, Math.round((numPairs / Math.max(totalMoves, numPairs)) * 100)));
    const calculatedScore = score + Math.max(0, 300 - timeElapsed * 2) + accuracy * 5;

    const result: GameResult = {
      id: Date.now().toString(),
      gameId: 'memory-match',
      gameName: 'Memory Match',
      score: calculatedScore,
      accuracy,
      timeSeconds: timeElapsed,
      moves: totalMoves,
      combo,
      xpEarned: calculateXPForGame({
        id: '',
        gameId: 'memory-match',
        gameName: 'Memory Match',
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

  const handleHint = () => {
    if (hintsRemaining <= 0 || isPaused || isGameOver) return;
    setHintsRemaining(h => h - 1);

    // Briefly flip all unmatched cards
    setCards(prev => prev.map(c => c.isMatched ? c : { ...c, isFlipped: true }));
    setTimeout(() => {
      setCards(prev => prev.map(c => c.isMatched ? c : { ...c, isFlipped: false }));
    }, 1200);
  };

  const gridCols = difficulty === 'easy' ? 'grid-cols-4' : difficulty === 'medium' ? 'grid-cols-4 sm:grid-cols-4' : 'grid-cols-4 sm:grid-cols-4';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fade-in">
      <GameHUD
        title="Memory Match"
        score={score}
        moves={moves}
        combo={combo}
        accuracy={moves > 0 ? Math.max(10, Math.min(100, Math.round((cards.filter(c => c.isMatched).length / 2 / moves) * 100))) : 100}
        timeElapsed={timeElapsed}
        xpEarned={Math.floor(score / 5)}
        isPaused={isPaused}
        soundEnabled={soundEnabled}
        onExit={() => navigate('/games')}
        onPause={() => setIsPaused(true)}
        onResume={() => setIsPaused(false)}
        onRestart={initializeGame}
        onToggleSound={() => setSoundEnabled(v => !v)}
        onShowInstructions={() => setInstructionsVisible(v => !v)}
        showHints={true}
        onHint={handleHint}
        hintsRemaining={hintsRemaining}
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
            {d} ({d === 'easy' ? '8 cards' : d === 'medium' ? '12 cards' : '16 cards'})
          </button>
        ))}
      </div>

      {/* Instructions Banner */}
      {instructionsVisible && (
        <div className="glass-card p-4 mb-6 text-sm text-muted-light border-primary/30 flex justify-between items-center">
          <p>Flip two cards at a time to find matching symbol pairs. Match all pairs to complete the challenge!</p>
          <button onClick={speakInstructions} className="btn-ghost text-xs py-1.5 px-3">
            🔊 Read Aloud
          </button>
        </div>
      )}

      {/* Cards Board */}
      <div className={`grid ${gridCols} gap-3 sm:gap-4 max-w-2xl mx-auto`}>
        {cards.map((card, idx) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(idx)}
            disabled={card.isFlipped || card.isMatched || isPaused}
            className={`h-24 sm:h-28 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl transition-all duration-300 font-bold border-2 ${
              card.isMatched
                ? 'bg-success/20 border-success text-white shadow-glow-green scale-95 opacity-80'
                : card.isFlipped
                ? 'bg-primary/20 border-primary text-white shadow-glow-cyan rotate-0'
                : 'bg-surface-elevated border-border text-transparent hover:border-primary/60 hover:scale-105 active:scale-95'
            }`}
            aria-label={card.isFlipped || card.isMatched ? `Card ${card.symbol}` : `Hidden Card ${idx + 1}`}
          >
            {(card.isFlipped || card.isMatched) ? card.symbol : '❓'}
          </button>
        ))}
      </div>

      {/* Game Over Modal */}
      {isGameOver && gameResult && (
        <GameResultModal
          result={gameResult}
          onPlayAgain={initializeGame}
        />
      )}
    </div>
  );
}
