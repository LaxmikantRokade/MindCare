// src/components/ui/XPBar.tsx
interface XPBarProps {
  current: number;
  max: number;
  level: number;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function XPBar({ current, max, level, showLabels = true, size = 'sm' }: XPBarProps) {
  const percentage = Math.min(100, (current / max) * 100);
  const heightClass = size === 'lg' ? 'h-4' : size === 'md' ? 'h-3' : 'h-2';

  return (
    <div>
      {showLabels && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-muted">Level {level}</span>
          <span className="text-xs text-primary font-mono">{current.toLocaleString()} / {max.toLocaleString()} XP</span>
        </div>
      )}
      <div
        className={`xp-bar ${heightClass}`}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`XP progress: ${current} of ${max}`}
      >
        <div
          className="xp-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
