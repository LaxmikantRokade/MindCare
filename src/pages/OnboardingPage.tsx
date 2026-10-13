// src/pages/OnboardingPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { storage } from '../services/storage';
import clsx from 'clsx';

const FOCUS_OPTIONS = [
  { id: 'memory', label: 'Memory', icon: '🧠', desc: 'Improve short and long-term memory' },
  { id: 'attention', label: 'Attention', icon: '🎯', desc: 'Sharpen focus and concentration' },
  { id: 'pattern', label: 'Pattern Recognition', icon: '🔮', desc: 'Spot patterns and sequences' },
  { id: 'recall', label: 'Recall', icon: '📚', desc: 'Strengthen word and number recall' },
  { id: 'daily', label: 'Daily Brain Activity', icon: '⭐', desc: 'General daily mental engagement' },
];

const LEVELS = [
  { id: 'easy', label: 'Easy', desc: 'Relaxed pace, simple challenges', icon: '🌱' },
  { id: 'balanced', label: 'Balanced', desc: 'Mix of easy and medium challenges', icon: '⚖️' },
  { id: 'challenge', label: 'Challenge', desc: 'Push your limits with harder tasks', icon: '🏆' },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedFocus, setSelectedFocus] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('balanced');

  const handleFinish = () => {
    storage.setOnboarding({ completed: true, focus: selectedFocus, experienceLevel: selectedLevel });
    navigate('/role-selection');
  };

  const toggleFocus = (id: string) => {
    setSelectedFocus(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="fixed inset-0 bg-grid pointer-events-none" aria-hidden />
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div className="orb orb-cyan w-96 h-96" style={{ top: '-20%', right: '-10%' }} />
        <div className="orb orb-purple w-96 h-96" style={{ bottom: '-10%', left: '-10%' }} />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" aria-hidden />
          </div>
          <span className="text-white font-bold text-xl">MindCare</span>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={clsx(
                'h-1.5 flex-1 rounded-full transition-all duration-300',
                i <= step ? 'bg-primary' : 'bg-border'
              )}
              aria-hidden
            />
          ))}
        </div>

        {/* Step 0 - Welcome */}
        {step === 0 && (
          <div className="animate-fade-in">
            <h1 className="text-4xl font-black text-white mb-4">Welcome to MindCare 👋</h1>
            <p className="text-muted-light text-lg mb-8 leading-relaxed">
              Your personal cognitive wellness journey starts here.
              We'll ask a few quick questions to tailor your experience.
            </p>
            <div className="glass-card p-6 mb-8">
              <ul className="space-y-3">
                {['6 engaging brain training games', 'Daily quests & challenges', 'XP, levels & achievements', 'Caregiver monitoring support'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-text">
                    <Check className="w-4 h-4 text-success flex-shrink-0" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={() => setStep(1)} className="btn-primary w-full text-lg py-4 gap-3">
              Let's Begin
              <ArrowRight className="w-5 h-5" aria-hidden />
            </button>
          </div>
        )}

        {/* Step 1 - Focus */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-black text-white mb-2">What would you like to focus on?</h2>
            <p className="text-muted mb-6">Select one or more areas (optional)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {FOCUS_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => toggleFocus(opt.id)}
                  className={clsx(
                    'glass-card p-4 text-left transition-all duration-200 border-2 relative',
                    selectedFocus.includes(opt.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-border-bright'
                  )}
                  aria-pressed={selectedFocus.includes(opt.id)}
                >
                  <div className="text-2xl mb-2" aria-hidden>{opt.icon}</div>
                  <div className="font-semibold text-text">{opt.label}</div>
                  <div className="text-muted text-xs mt-1">{opt.desc}</div>
                  {selectedFocus.includes(opt.id) && (
                    <div className="absolute top-3 right-3">
                      <Check className="w-4 h-4 text-primary" aria-hidden />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="btn-ghost flex-1 gap-2">
                <ArrowLeft className="w-4 h-4" aria-hidden />
                Back
              </button>
              <button onClick={() => setStep(2)} className="btn-primary flex-1 gap-2">
                Continue
                <ArrowRight className="w-4 h-4" aria-hidden />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 - Level */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-black text-white mb-2">Choose your experience level</h2>
            <p className="text-muted mb-2">This sets your starting game difficulty.</p>
            <p className="text-muted text-xs mb-6 italic">This is a gameplay preference, not a medical assessment.</p>
            <div className="grid grid-cols-1 gap-3 mb-8">
              {LEVELS.map(lvl => (
                <button
                  key={lvl.id}
                  onClick={() => setSelectedLevel(lvl.id)}
                  className={clsx(
                    'glass-card p-5 text-left flex items-center gap-4 border-2 transition-all duration-200',
                    selectedLevel === lvl.id ? 'border-primary bg-primary/5' : 'border-border hover:border-border-bright'
                  )}
                  aria-pressed={selectedLevel === lvl.id}
                >
                  <div className="text-3xl" aria-hidden>{lvl.icon}</div>
                  <div>
                    <div className="font-bold text-text text-lg">{lvl.label}</div>
                    <div className="text-muted text-sm">{lvl.desc}</div>
                  </div>
                  {selectedLevel === lvl.id && (
                    <Check className="w-5 h-5 text-primary ml-auto" aria-hidden />
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-ghost flex-1 gap-2">
                <ArrowLeft className="w-4 h-4" aria-hidden />
                Back
              </button>
              <button onClick={handleFinish} className="btn-primary flex-1 gap-2">
                Get Started
                <ArrowRight className="w-4 h-4" aria-hidden />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
