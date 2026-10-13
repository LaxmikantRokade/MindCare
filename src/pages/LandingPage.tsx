// src/pages/LandingPage.tsx
import { useNavigate } from 'react-router-dom';
import { Brain, Zap, Trophy, BarChart2, Shield, Star, ArrowRight, Play, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useApp();

  const handleStart = () => {
    if (user) { navigate('/dashboard'); return; }
    navigate('/onboarding');
  };

  const features = [
    { icon: Brain, title: 'Cognitive Games', desc: 'Six engaging brain training activities designed for daily mental activity.', color: 'text-primary' },
    { icon: Zap, title: 'Daily Quests', desc: 'Fresh challenges every day to keep your brain engaged and motivated.', color: 'text-secondary' },
    { icon: Trophy, title: 'XP & Levels', desc: 'Earn experience points, level up, and celebrate your progress.', color: 'text-gold' },
    { icon: BarChart2, title: 'Progress Tracking', desc: 'Visual charts to track your gameplay activity over time.', color: 'text-success' },
    { icon: Shield, title: 'Caregiver Support', desc: 'Family members can monitor activity and celebrate achievements.', color: 'text-primary' },
    { icon: Star, title: 'Accessibility', desc: 'Large text, high contrast, reduced motion — designed for everyone.', color: 'text-secondary' },
  ];

  const steps = [
    { num: '01', title: 'Choose a Challenge', desc: 'Pick from 6 cognitive games tailored to your preference.' },
    { num: '02', title: 'Play & Earn', desc: 'Complete challenges and earn XP with every achievement.' },
    { num: '03', title: 'Track Progress', desc: 'Watch your activity grow through beautiful charts and stats.' },
    { num: '04', title: 'Unlock Achievements', desc: 'Celebrate milestones with special rewards and badges.' },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-grid pointer-events-none" aria-hidden />
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div className="orb orb-cyan w-96 h-96" style={{ top: '-10%', left: '-10%' }} />
        <div className="orb orb-purple w-96 h-96" style={{ bottom: '10%', right: '-10%' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-border/50 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" aria-hidden />
          </div>
          <span className="text-white font-bold text-xl">MindCare</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <button onClick={() => navigate('/dashboard')} className="btn-primary text-sm">
              Go to Dashboard
            </button>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn-ghost text-sm">
                Sign In
              </button>
              <button onClick={handleStart} className="btn-primary text-sm">
                Get Started
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-24 max-w-5xl mx-auto">
        {/* Brain visual */}
        <div className="relative mb-12">
          {/* Outer rings */}
          <div className="w-64 h-64 rounded-full flex items-center justify-center" style={{ position: 'relative' }}>
            <div className="absolute inset-0 rounded-full border border-primary/20 animate-spin-slow" />
            <div className="absolute inset-4 rounded-full border border-secondary/20 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '12s' }} />
            <div className="absolute inset-8 rounded-full border border-primary/10 animate-spin-slow" style={{ animationDuration: '20s' }} />
            {/* Center orb */}
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center animate-float"
              style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.3) 0%, rgba(139,92,246,0.2) 50%, transparent 70%)', boxShadow: '0 0 60px rgba(0,212,255,0.3)' }}
            >
              <Brain className="w-14 h-14 text-primary" aria-hidden />
            </div>
            {/* Orbiting nodes */}
            {['🧠', '⚡', '🏆', '🔮'].map((emoji, i) => (
              <div
                key={i}
                className="absolute w-10 h-10 rounded-xl glass-card flex items-center justify-center text-lg"
                style={{
                  top: `${50 + Math.sin((i * 90 + 45) * Math.PI / 180) * 42}%`,
                  left: `${50 + Math.cos((i * 90 + 45) * Math.PI / 180) * 42}%`,
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${i * 0.5}s`,
                }}
                aria-hidden
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>

        <div className="badge-cyan mb-6 text-sm">✦ Cognitive Wellness Platform</div>
        <h1 className="text-5xl sm:text-7xl font-black text-white mb-6 leading-none">
          Play. <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #00d4ff, #8b5cf6)' }}>Remember.</span> Progress.
        </h1>
        <p className="text-muted-light text-xl max-w-2xl mb-10 leading-relaxed">
          An accessible cognitive wellness experience where every challenge becomes a new achievement.
          Train your mind, one challenge at a time.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={handleStart}
            className="btn-primary text-lg px-8 py-4 gap-3"
            aria-label="Start your MindCare journey"
          >
            <Play className="w-5 h-5" aria-hidden />
            Start Your Journey
          </button>
          <button
            onClick={() => navigate('/games')}
            className="btn-ghost text-lg px-8 py-4 gap-3"
            aria-label="Explore all games"
          >
            Explore Games
            <ArrowRight className="w-5 h-5" aria-hidden />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 w-full max-w-lg">
          {[
            { value: '6', label: 'Brain Games' },
            { value: '12', label: 'Achievements' },
            { value: '100%', label: 'Free to Use' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-black text-primary">{s.value}</p>
              <p className="text-muted text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why MindCare */}
      <section className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="badge-purple mb-4 w-fit mx-auto">Why MindCare</div>
          <h2 className="text-4xl font-black text-white mb-4">Make cognitive activity a fun daily habit.</h2>
          <p className="text-muted-light max-w-xl mx-auto">Six engaging brain training games designed with accessibility in mind, for everyone who wants to stay mentally active.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="game-card group">
              <div className={`w-12 h-12 rounded-xl bg-current/10 flex items-center justify-center mb-4 ${f.color}`}>
                <f.icon className="w-6 h-6" aria-hidden />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="badge-cyan mb-4 w-fit mx-auto">How It Works</div>
          <h2 className="text-4xl font-black text-white mb-4">Simple. Engaging. Rewarding.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.num} className="glass-card p-6 relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-5 h-5 text-border" aria-hidden />
                </div>
              )}
              <div className="text-5xl font-black text-primary/20 mb-4">{s.num}</div>
              <h3 className="text-white font-bold mb-2">{s.title}</h3>
              <p className="text-muted text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-3xl mx-auto glass-card p-12 text-center" style={{ boxShadow: '0 0 60px rgba(0,212,255,0.1)' }}>
          <h2 className="text-4xl font-black text-white mb-4">Ready to begin your journey?</h2>
          <p className="text-muted-light mb-8">Join thousands who use MindCare for daily cognitive wellness activities.</p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {['6 Brain Games', 'Daily Quests', 'Progress Tracking', 'Achievements', 'Caregiver Mode'].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-success">
                <Check className="w-4 h-4" aria-hidden />
                {f}
              </div>
            ))}
          </div>
          <button onClick={handleStart} className="btn-primary text-lg px-10 py-4">
            Start for Free
            <ArrowRight className="w-5 h-5" aria-hidden />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" aria-hidden />
            <span className="text-white font-bold">MindCare</span>
          </div>
          <p className="text-muted text-xs text-center max-w-lg">
            ⚠️ MindCare is an assistive cognitive wellness platform and not a medical diagnostic system.
            It is not intended to diagnose, treat, or prevent any medical condition.
            Always consult a healthcare professional for medical advice.
          </p>
          <p className="text-muted text-xs">© 2024 MindCare</p>
        </div>
      </footer>
    </div>
  );
}
