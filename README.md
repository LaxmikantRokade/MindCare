# MindCare 🧠⚡

**Play. Remember. Progress.**

> "An accessible cognitive wellness experience where every challenge becomes a new achievement."

MindCare is a gamified cognitive wellness and daily mental activity platform designed for elderly users and monitored by caregivers. It bridges the gap between brain training science and video game engagement—without feeling like a clinical hospital tool or a generic healthcare dashboard.

---

## ⚠️ Important Wellness Disclaimer

**MindCare is an assistive cognitive wellness platform and NOT a medical diagnostic system.**  
It is not intended to diagnose, treat, prevent, or cure Alzheimer's disease, dementia, or any neurological disorder. MindCare focuses on fun, accessible, daily mental stimulation and lifestyle habits. Always consult a qualified medical professional for health inquiries.

---

## 🌟 Key Highlights & Features

### 🎮 6 Fully-Functional Brain Games
1. **Memory Match**: Card-flipping visual association with combo multipliers, hint system, flip animations, and speech instructions.
2. **Sequence Recall**: Progressive symbol pattern memorization and recreation across multiple rounds.
3. **Word Recall**: Timed study and recall of vocabulary appropriate for elderly users with distractor filtering.
4. **Pattern Pulse**: Visual series logic puzzle to identify missing geometric/symbolic items.
5. **Number Echo**: Digit sequence flash presentation with responsive touch keypad.
6. **Odd One Out**: Anomaly detection within an expanding grid matrix of visual symbols.

### 🏆 Gamification Engine
- **XP System**: Earn base XP (+100) on completions, accuracy multipliers (+50 for 100%), combos, and quest rewards.
- **Dynamic Levels**: 10 distinct level milestones (Beginner to Grand Master) with animated celebratory level-up modals and particle effects.
- **Streaks**: Daily activity streak counter with flame indicator and calendar tracking.
- **12 Achievements**: Common, Rare, Epic, and Legendary achievement tiers with real-time unlocking modals.
- **Daily Quests**: Rotating quest challenges with completion progress rings.

### 🛡️ Caregiver Monitoring
- Completely dedicated, accessible caregiver interface.
- Real-time visibility into activity streaks, daily quest completions, recent gameplay performance, and level status.
- Supportive non-medical insights (e.g., consistency streaks, favorite games, accuracy trends).

### ♿ WCAG-Inspired Accessibility
- **Text Size**: Normal (16px), Large (18px), and Extra Large (20px).
- **High Contrast Mode**: Enhanced borders, boosted text contrast, and clear element separation.
- **Reduced Motion**: Full support for users sensitive to animations (`data-motion="reduced"` and `prefers-reduced-motion`).
- **Web Speech API**: In-game audio narration of instructions at the tap of a button.
- **Adaptive Difficulty**: Automatic rule-based performance adjustment based on accuracy thresholds.
- **Touch Friendly**: Minimum 48px touch targets, keyboard navigation, and semantic ARIA labeling.

### 🤖 Local AI MindCare Assistant
- Interactive floating assistant bot powered by local rule-based context queries.
- Zero external API dependencies, zero privacy leaks, fully offline capable.
- Answers questions regarding stats, quests, recommended games, and platform guidance.

---

## 🛠️ Technology Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (custom dark gaming design system with cyan & purple accents)
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Testing**: Vitest + React Testing Library + jsdom
- **Persistence**: Safe LocalStorage abstraction layer

---

## 📁 Architecture & Directory Structure

```
MindCare/
├── public/
│   └── mindcare-icon.svg
├── src/
│   ├── components/
│   │   ├── accessibility/
│   │   ├── dashboard/
│   │   ├── game/
│   │   │   ├── GameHUD.tsx
│   │   │   └── GameResultModal.tsx
│   │   ├── navigation/
│   │   │   ├── MobileNav.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── TopBar.tsx
│   │   ├── ui/
│   │   │   ├── AchievementUnlockModal.tsx
│   │   │   ├── LevelBadge.tsx
│   │   │   ├── LevelUpModal.tsx
│   │   │   ├── LoadingState.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── ProgressRing.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── XPBar.tsx
│   │   └── AssistantWidget.tsx
│   ├── context/
│   │   └── AppContext.tsx
│   ├── data/
│   │   └── constants.ts
│   ├── games/
│   │   ├── MemoryMatch.tsx
│   │   ├── NumberEcho.tsx
│   │   ├── OddOneOut.tsx
│   │   ├── PatternPulse.tsx
│   │   ├── SequenceRecall.tsx
│   │   └── WordRecall.tsx
│   ├── layouts/
│   │   └── MainLayout.tsx
│   ├── pages/
│   │   ├── AchievementsPage.tsx
│   │   ├── CaregiverPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── GamesPage.tsx
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── OnboardingPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── ProgressPage.tsx
│   │   ├── QuestsPage.tsx
│   │   ├── RemindersPage.tsx
│   │   ├── RoleSelectionPage.tsx
│   │   └── SettingsPage.tsx
│   ├── services/
│   │   └── storage.ts
│   ├── styles/
│   │   └── globals.css
│   ├── test/
│   │   ├── achievements.test.ts
│   │   ├── setup.ts
│   │   ├── time.test.ts
│   │   └── xp.test.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── achievements.ts
│   │   ├── time.ts
│   │   └── xp.ts
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Run Tests
```bash
npm run test
```

---

## 👥 Demo Accounts

The app includes preconfigured fictional demo profiles stored locally:

1. **Elderly User Account**:
   - **Name**: Rahul Sharma (Age 68)
   - **Level**: 7 (Master)
   - **XP**: 3,420 XP
   - **Streak**: 7 Days 🔥

2. **Caregiver Account**:
   - **Name**: Anita Sharma (Age 42)
   - **Role**: Family Caregiver monitoring Rahul's wellness activity

---

## 🔒 Privacy & Local-First Philosophy

- **Zero Cloud Tracking**: All user progress, streaks, achievements, and reminders are persisted strictly in your browser's `localStorage`.
- **Offline Capable**: Requires no network requests or external database calls once loaded.
- **No Third-Party AI APIs**: All assistant intelligence and speech narration are performed locally in-browser.

---

© 2024 MindCare. Play. Remember. Progress.
