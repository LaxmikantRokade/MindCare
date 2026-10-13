// src/pages/LoginPage.tsx
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Brain, User, Shield, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEMO_USER, DEMO_CAREGIVER, DEFAULT_PLAYER_STATS } from '../data/constants';
import { storage } from '../services/storage';

export default function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { setUser } = useApp();
  const roleParam = params.get('role');

  const loginAs = (role: 'user' | 'caregiver') => {
    const account = role === 'user' ? DEMO_USER : DEMO_CAREGIVER;
    storage.setUser(account);
    storage.setPlayerStats(DEFAULT_PLAYER_STATS);
    setUser(account);
    navigate(role === 'caregiver' ? '/caregiver' : '/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="fixed inset-0 bg-grid pointer-events-none" aria-hidden />
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div className="orb orb-cyan w-96 h-96" style={{ bottom: '0', left: '0' }} />
        <div className="orb orb-purple w-80 h-80" style={{ top: '0', right: '0' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" aria-hidden />
          </div>
          <span className="text-white font-bold text-2xl">MindCare</span>
        </div>

        <div className="glass-card p-8">
          <h1 className="text-3xl font-black text-white mb-2">Welcome Back</h1>
          <p className="text-muted mb-8">Choose your demo account to continue.</p>

          <div className="space-y-4 mb-8">
            <button
              onClick={() => loginAs('user')}
              className={`w-full glass-card p-5 flex items-center gap-4 text-left hover:border-primary transition-all duration-200 border-2 ${
                roleParam === 'user' ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              aria-label="Continue as Rahul Sharma, elderly user"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <User className="w-7 h-7 text-primary" aria-hidden />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-lg">Rahul Sharma</p>
                <p className="text-muted text-sm">Age 68 · Level 7 · 7-Day Streak 🔥</p>
                <div className="badge-cyan mt-2 text-xs w-fit">User Account</div>
              </div>
              <Zap className="w-5 h-5 text-primary" aria-hidden />
            </button>

            <button
              onClick={() => loginAs('caregiver')}
              className={`w-full glass-card p-5 flex items-center gap-4 text-left hover:border-secondary transition-all duration-200 border-2 ${
                roleParam === 'caregiver' ? 'border-secondary bg-secondary/5' : 'border-border'
              }`}
              aria-label="Continue as Anita Sharma, caregiver"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/30 flex items-center justify-center flex-shrink-0">
                <Shield className="w-7 h-7 text-secondary" aria-hidden />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-lg">Anita Sharma</p>
                <p className="text-muted text-sm">Family Caregiver · Monitoring Rahul</p>
                <div className="badge-purple mt-2 text-xs w-fit">Caregiver Account</div>
              </div>
              <Shield className="w-5 h-5 text-secondary" aria-hidden />
            </button>
          </div>

          <p className="text-muted text-xs text-center">
            This is a demo application. No real data is collected.
          </p>
        </div>

        <button
          onClick={() => navigate('/role-selection')}
          className="mt-4 w-full text-center text-muted hover:text-muted-light text-sm transition-colors"
        >
          ← Back to role selection
        </button>
      </div>
    </div>
  );
}
