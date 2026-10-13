// src/components/dashboard/StreakCard.tsx
import { Flame } from 'lucide-react';

interface StreakCardProps {
  streak: number;
}

export function StreakCard({ streak }: StreakCardProps) {
  return (
    <div className="glass-card p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center flex-shrink-0">
        <Flame className="w-6 h-6 text-warning" aria-hidden="true" />
      </div>
      <div>
        <p className="text-muted text-xs uppercase tracking-wider font-semibold">Active Streak</p>
        <p className="text-2xl font-bold text-white mt-0.5">{streak} Days 🔥</p>
        <p className="text-[11px] text-muted-light mt-0.5">Keep playing daily to grow your streak</p>
      </div>
    </div>
  );
}
