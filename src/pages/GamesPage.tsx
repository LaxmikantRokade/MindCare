// src/pages/GamesPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GAMES } from '../data/constants';
import { useApp } from '../context/AppContext';
import { GameCard } from '../components/game/GameCard';
import clsx from 'clsx';

const CATEGORIES = ['All', 'Memory', 'Recall', 'Pattern', 'Attention', 'Speed'];

export default function GamesPage() {
  const navigate = useNavigate();
  const { gameResults } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? GAMES
    : GAMES.filter(g => g.category.toLowerCase() === activeCategory.toLowerCase());

  const getBestScore = (gameId: string) => {
    const results = gameResults.filter(r => r.gameId === gameId);
    if (!results.length) return null;
    return Math.max(...results.map(r => r.score));
  };

  const getTimesPlayed = (gameId: string) => gameResults.filter(r => r.gameId === gameId).length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black text-white mb-2">Game Library</h1>
        <p className="text-muted">Choose a cognitive wellness brain challenge to play.</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Game categories">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            role="tab"
            aria-selected={activeCategory === cat}
            className={clsx(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
              activeCategory === cat
                ? 'bg-primary text-background'
                : 'bg-surface-elevated border border-border text-muted-light hover:text-text hover:border-border-bright'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(game => (
          <GameCard
            key={game.id}
            game={game}
            bestScore={getBestScore(game.id)}
            timesPlayed={getTimesPlayed(game.id)}
            onPlay={(gameId) => navigate(`/games/${gameId}`)}
          />
        ))}
      </div>
    </div>
  );
}
