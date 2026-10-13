// src/pages/RoleSelectionPage.tsx
import { useNavigate } from 'react-router-dom';
import { Brain, User, Shield, ArrowRight } from 'lucide-react';

export default function RoleSelectionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="fixed inset-0 bg-grid pointer-events-none" aria-hidden />
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div className="orb orb-cyan w-96 h-96" style={{ top: '-10%', left: '-10%' }} />
        <div className="orb orb-purple w-80 h-80" style={{ bottom: '-5%', right: '-5%' }} />
      </div>

      <div className="relative z-10 w-full max-w-2xl text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" aria-hidden />
          </div>
          <span className="text-white font-bold text-2xl">MindCare</span>
        </div>

        <h1 className="text-4xl font-black text-white mb-3">Who is using MindCare?</h1>
        <p className="text-muted-light mb-12">Select your role to get the right experience for you.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Elderly User Card */}
          <button
            onClick={() => navigate('/login?role=user')}
            className="glass-card p-8 text-center flex flex-col items-center gap-5 border-2 border-border hover:border-primary transition-all duration-300 group cursor-pointer"
            aria-label="Continue as elderly user"
            style={{ minHeight: '280px' }}
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center group-hover:border-primary/60 transition-all duration-300">
              <User className="w-10 h-10 text-primary" aria-hidden />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">I'm a User</h2>
              <p className="text-muted leading-relaxed">Play brain training games, earn XP, track your progress, and enjoy daily cognitive challenges.</p>
            </div>
            <div className="flex items-center gap-2 text-primary font-semibold mt-auto">
              Start Playing <ArrowRight className="w-4 h-4" aria-hidden />
            </div>
          </button>

          {/* Caregiver Card */}
          <button
            onClick={() => navigate('/login?role=caregiver')}
            className="glass-card p-8 text-center flex flex-col items-center gap-5 border-2 border-border hover:border-secondary transition-all duration-300 group cursor-pointer"
            aria-label="Continue as caregiver"
            style={{ minHeight: '280px' }}
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/30 flex items-center justify-center group-hover:border-secondary/60 transition-all duration-300">
              <Shield className="w-10 h-10 text-secondary" aria-hidden />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">I'm a Caregiver</h2>
              <p className="text-muted leading-relaxed">Monitor activity, celebrate achievements, and stay connected with your loved one's cognitive wellness journey.</p>
            </div>
            <div className="flex items-center gap-2 text-secondary font-semibold mt-auto">
              View Dashboard <ArrowRight className="w-4 h-4" aria-hidden />
            </div>
          </button>
        </div>

        <button
          onClick={() => navigate('/onboarding')}
          className="text-muted hover:text-muted-light text-sm transition-colors underline-offset-4 hover:underline"
        >
          ← Back to onboarding
        </button>
      </div>
    </div>
  );
}
