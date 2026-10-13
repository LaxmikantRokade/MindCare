// src/components/ui/LoadingState.tsx
import { Brain } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse-slow">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div className="absolute inset-0 rounded-2xl animate-ping" style={{ background: 'rgba(0,212,255,0.1)' }} />
        </div>
        <p className="text-muted text-sm animate-pulse">Loading MindCare...</p>
      </div>
    </div>
  );
}
