// src/components/ui/StatCard.tsx
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sub?: string;
  color?: 'cyan' | 'purple' | 'gold' | 'green';
  large?: boolean;
}

const colorMap = {
  cyan: 'from-primary/20 to-primary/5 text-primary border-primary/20',
  purple: 'from-secondary/20 to-secondary/5 text-secondary border-secondary/20',
  gold: 'from-gold/20 to-gold/5 text-gold border-gold/20',
  green: 'from-success/20 to-success/5 text-success border-success/20',
};

export function StatCard({ icon: Icon, label, value, sub, color = 'cyan', large = false }: StatCardProps) {
  const colorClasses = colorMap[color];
  return (
    <div className="glass-card p-5 flex items-start gap-4">
      <div className={clsx(
        'flex-shrink-0 rounded-xl p-3 bg-gradient-to-br border',
        colorClasses
      )}>
        <Icon className="w-5 h-5" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-muted text-xs uppercase tracking-wider font-medium">{label}</p>
        <p className={clsx(
          'font-bold text-text mt-0.5',
          large ? 'text-3xl' : 'text-xl'
        )}>{value}</p>
        {sub && <p className="text-muted text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
