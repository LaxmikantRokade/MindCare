// src/components/ui/ProgressRing.tsx
interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

export function ProgressRing({
  percentage, size = 80, strokeWidth = 6,
  color = '#00d4ff', label, sublabel
}: ProgressRingProps) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percentage / 100) * circ;
  const cx = size / 2;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} aria-hidden>
        <circle
          cx={cx} cy={cx} r={r}
          fill="none"
          stroke="rgba(30,58,95,0.6)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={cx} cy={cx} r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease', filter: `drop-shadow(0 0 4px ${color}88)` }}
        />
      </svg>
      {label && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-text font-bold text-sm leading-none">{label}</span>
          {sublabel && <span className="text-muted text-xs mt-0.5">{sublabel}</span>}
        </div>
      )}
    </div>
  );
}
