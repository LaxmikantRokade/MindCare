// src/components/ui/LevelBadge.tsx
import clsx from 'clsx';

interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function LevelBadge({ level, size = 'md', showLabel = false }: LevelBadgeProps) {
  const sizeClass = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
  }[size];

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={clsx(
          sizeClass,
          'rounded-full flex items-center justify-center font-bold border-2 border-primary/40 relative'
        )}
        style={{
          background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(139,92,246,0.2))',
          boxShadow: '0 0 15px rgba(0,212,255,0.2)'
        }}
        aria-label={`Level ${level}`}
      >
        <span className="text-primary">{level}</span>
      </div>
      {showLabel && <span className="text-xs text-muted">Level</span>}
    </div>
  );
}
