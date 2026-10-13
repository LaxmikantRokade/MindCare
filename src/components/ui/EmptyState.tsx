// src/components/ui/EmptyState.tsx
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="glass-card p-10 text-center flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1.5">{title}</h3>
      <p className="text-muted text-sm max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary text-sm px-6 py-2.5">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
