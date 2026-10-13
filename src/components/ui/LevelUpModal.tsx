// src/components/ui/LevelUpModal.tsx
import { Zap, Star } from 'lucide-react';

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
}

export function LevelUpModal({ level, onClose }: LevelUpModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal aria-label="Level Up!">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-sm text-center animate-bounce-in">
        <div className="glass-card p-8 border-primary/40" style={{ boxShadow: '0 0 60px rgba(0,212,255,0.3)' }}>
          {/* Particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary animate-particle"
              style={{
                top: `${20 + Math.sin(i * 45 * Math.PI / 180) * 40}%`,
                left: `${50 + Math.cos(i * 45 * Math.PI / 180) * 40}%`,
                animationDelay: `${i * 0.1}s`,
              }}
              aria-hidden
            />
          ))}

          <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-primary animate-glow"
            style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.3), rgba(139,92,246,0.3))' }}
          >
            <Zap className="w-10 h-10 text-primary" />
          </div>

          <div className="badge-cyan mx-auto mb-3 w-fit">Level Up!</div>
          <h2 className="text-4xl font-black text-white mb-2 glow-text-cyan">Level {level}</h2>
          <p className="text-muted-light text-sm mb-6">You've reached a new milestone!</p>

          <div className="flex items-center justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-gold fill-gold" aria-hidden />
            ))}
          </div>

          <button onClick={onClose} className="btn-primary w-full">
            Continue Your Journey
          </button>
        </div>
      </div>
    </div>
  );
}
