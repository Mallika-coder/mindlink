# MindLink — AI-Powered Student Mental Wellness Platform

A comprehensive, privacy-first digital mental health platform built for college students. Features CBT-based AI therapy, mood analytics, habit tracking, focus sessions with ambient soundscapes, sleep analysis, and an anonymous peer community — all running entirely in the browser with zero data leaving the device.

**Live Demo:** https://mindlink-tau.vercel.app/

---

## What Makes This Different

Unlike generic health apps, MindLink integrates **Cognitive Behavioral Therapy (CBT)** principles directly into the UX:
- The journal isn't just a diary — it guides users through structured thought reframing with 8 cognitive distortion patterns
- The AI companion is context-aware, using CBT techniques (validation → identification → reframing)
- Analytics correlate mood, sleep, and habits to surface actionable insights
- The gamification system rewards therapeutic practices, not just app usage

---

## Features

### Core Wellness Engine
- **Mood Check-in with Trend Analytics** — Daily emoji-based mood logging with 7-day area chart visualization and weekly averages
- **CBT Thought Journal** — Guided 4-step cognitive restructuring (Situation → Automatic Thought → Distortion Pattern → Balanced Reframe) with 8 cognitive distortion templates
- **AI Therapist Chat** — CBT-trained conversational AI with quick-start therapeutic prompts and contextual mental health guidance

### Productivity & Self-Care
- **Pomodoro Focus Timer** — 25/5/15 minute work sessions with Web Audio API-generated ambient soundscapes (rain, forest, ocean, fireplace, wind, birds)
- **Habit Tracker** — Custom + preset habits with streak tracking, 7-day mini heatmap per habit, and daily completion metrics
- **Sleep Tracker** — Bedtime/wake logging with quality scoring, composite sleep score (duration + quality), and 7-day bar chart

### Community & Gamification
- **Anonymous Peer Forum** — Categorized posts (support, wins, advice, vent, study) with upvotes, hearts, replies, and hot/new sorting
- **XP-Based Achievement System** — 12 unlockable badges across bronze/silver/gold tiers, level progression, and cross-feature milestone tracking
- **Mindful Missions** — Kindness-based challenges for community wellbeing

### Therapeutic Tools
- **Breathing Exercises** — 3 techniques (4-7-8, Box Breathing, Calming Breath) with real-time animated visual guide and cycle counting
- **Self-Assessment** — Clinically validated GAD-7 (anxiety) and PHQ-9 (depression) screening with severity scoring and recommendation engine
- **Resource Library** — Searchable, categorized collection of mental health videos and long-form articles with in-app viewer

### Technical Highlights
- **Privacy-First Architecture** — Zero backend dependency; all data stored in localStorage with JSON export/import for portability
- **Responsive Design** — Fully adaptive from mobile to desktop with collapsible sidebar navigation
- **Dark Mode** — System-aware with manual override
- **Smooth UX** — Page transitions, micro-interactions, and skeleton states via Framer Motion
- **Data Visualization** — Interactive charts with custom tooltips (Recharts)
- **Web Audio API** — Procedurally generated ambient soundscapes (no audio file downloads)
- **Modular Architecture** — Feature-based code splitting with custom hooks and utility modules

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS 3 |
| Animations | Framer Motion |
| Charts | Recharts |
| Date Utils | date-fns |
| Icons | Lucide React |
| AI | External LLM API with CBT prompt engineering |
| Audio | Web Audio API (oscillators + filters) |
| State | Custom hooks + localStorage persistence |
| Deployment | Vercel |

---

## Architecture

```
src/
├── App.jsx              # Root layout, navigation, modal orchestration
├── main.jsx             # React entry point
├── index.css            # Tailwind directives + custom scrollbar
├── hooks/
│   └── useLocalState.js # Generic localStorage-synced state hook
├── utils/
│   └── wellness.js      # Streak calc, mood trends, insights engine, CBT data
├── pages/
│   ├── Dashboard.jsx    # Mood check-in, trend chart, stats, insights
│   ├── Journal.jsx      # Free-write + CBT reframe journal
│   ├── HabitTracker.jsx # Custom habits with streaks and heatmap
│   ├── FocusTimer.jsx   # Pomodoro + ambient sounds
│   ├── SleepTracker.jsx # Sleep logging with quality scoring
│   ├── Community.jsx    # Anonymous forum with categories
│   ├── Resources.jsx    # Searchable resource library
│   ├── Rewards.jsx      # XP system and badge grid
│   └── Settings.jsx     # Profile, export/import, data management
├── components/
│   ├── ChatWindow.jsx   # AI companion with CBT context
│   ├── AssessmentModal.jsx # GAD-7 / PHQ-9 questionnaire
│   └── BreathingModal.jsx  # Multi-technique breathing guide
└── data/
    └── assessments.js   # Clinical questionnaire definitions
```

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/Mallika-coder/mindlink.git

# Navigate to project
cd mindlink

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Design Decisions

1. **No backend by design** — Mental health data is sensitive. By keeping everything in localStorage, we eliminate data breach risk entirely. Export/import enables portability.

2. **CBT over generic wellness** — Rather than being another mood tracker, the app teaches evidence-based therapeutic techniques that users can apply independently.

3. **Gamification of therapy** — Badge and XP systems reward completing CBT exercises and maintaining consistency, not just app opens.

4. **Web Audio over audio files** — Procedural generation means zero download size for ambient sounds, instant loading, and infinite variation.

5. **Anonymity as a feature** — The community forum uses handles, not identities, reducing stigma around mental health discussion.

---

## License

MIT License

---

## Author

Mallika Verma — [LinkedIn](https://www.linkedin.com/in/mallika-verma-a89855327)
