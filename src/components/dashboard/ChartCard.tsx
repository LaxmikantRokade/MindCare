// src/components/dashboard/ChartCard.tsx
import React from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <div className="glass-card p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        {subtitle && <p className="text-muted text-xs mt-1">{subtitle}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}
