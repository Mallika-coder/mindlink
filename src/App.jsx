import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, BookOpen, Users, Award, PenLine, Timer, Moon, Settings, Heart,
  MessageCircle, PhoneCall, Activity
} from "lucide-react";
import { useLocalState } from "./hooks/useLocalState";

import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";
import HabitTracker from "./pages/HabitTracker";
import FocusTimer from "./pages/FocusTimer";
import SleepTracker from "./pages/SleepTracker";
import Community from "./pages/Community";
import Resources from "./pages/Resources";
import Rewards from "./pages/Rewards";
import SettingsPage from "./pages/Settings";
import ChatWindow from "./components/ChatWindow";
import AssessmentModal from "./components/AssessmentModal";
import BreathingModal from "./components/BreathingModal";

const NAV_ITEMS = [
  { name: "Dashboard", icon: Home },
  { name: "Journal", icon: PenLine },
  { name: "Habits", icon: Activity },
  { name: "Focus", icon: Timer },
  { name: "Sleep", icon: Moon },
  { name: "Community", icon: Users },
  { name: "Resources", icon: BookOpen },
  { name: "Rewards", icon: Award },
  { name: "Settings", icon: Settings },
];

export default function App() {
  const [activeView, setActiveView] = useState("Dashboard");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);

  const openChat = () => setIsChatOpen(true);

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-gray-900 flex font-sans text-slate-900 dark:text-slate-100 selection:bg-indigo-500/30">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-screen">
        <Header activeView={activeView} />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderView(activeView, { openChat, setIsBreathingActive, setIsAssessmentOpen })}
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {isChatOpen && <ChatWindow onClose={() => setIsChatOpen(false)} />}
      </AnimatePresence>
      {!isChatOpen && <FloatingChatButton onClick={openChat} />}

      <AnimatePresence>
        {isBreathingActive && <BreathingModal onClose={() => setIsBreathingActive(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {isAssessmentOpen && <AssessmentModal onClose={() => setIsAssessmentOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

function renderView(view, props) {
  switch (view) {
    case "Dashboard": return <Dashboard {...props} />;
    case "Journal": return <Journal />;
    case "Habits": return <HabitTracker />;
    case "Focus": return <FocusTimer />;
    case "Sleep": return <SleepTracker />;
    case "Community": return <Community />;
    case "Resources": return <Resources />;
    case "Rewards": return <Rewards />;
    case "Settings": return <SettingsPage />;
    default: return <Dashboard {...props} />;
  }
}

function Sidebar({ activeView, setActiveView }) {
  return (
    <aside className="w-16 sm:w-20 lg:w-64 bg-white dark:bg-gray-950/80 border-r border-slate-200 dark:border-gray-800 flex flex-col transition-all duration-300 h-screen sticky top-0">
      <div className="flex items-center justify-center lg:justify-start gap-3 p-5 border-b border-slate-200 dark:border-gray-800">
        <div className="relative">
          <Heart className="w-8 h-8 text-indigo-500 fill-indigo-500" />
          <div className="absolute inset-0 bg-indigo-400 blur-lg opacity-40"></div>
        </div>
        <span className="hidden lg:inline font-bold text-xl tracking-tight text-slate-800 dark:text-white">MindLink</span>
      </div>
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveView(item.name)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
              activeView === item.name
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-900"
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="hidden lg:inline font-medium text-sm">{item.name}</span>
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-slate-200 dark:border-gray-800">
        <a
          href="tel:988"
          className="w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors border border-red-100 dark:border-red-900/50"
        >
          <PhoneCall className="w-5 h-5 flex-shrink-0" />
          <span className="hidden lg:inline font-bold text-sm">Crisis Line (988)</span>
        </a>
      </div>
    </aside>
  );
}

function Header({ activeView }) {
  const [profile] = useLocalState("mlk-profile", { anonymousHandle: "@mango-owl" });
  const descriptions = {
    Dashboard: "Your daily wellness overview",
    Journal: "Track thoughts and reframe patterns",
    Habits: "Build healthy routines",
    Focus: "Deep work with ambient sounds",
    Sleep: "Track and improve your rest",
    Community: "Anonymous peer support",
    Resources: "Curated mental health content",
    Rewards: "Your wellness achievements",
    Settings: "Manage your account",
  };

  return (
    <header className="flex items-center justify-between pb-6 pt-2">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">{activeView}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{descriptions[activeView]}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono px-3 py-1.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-full shadow-sm text-slate-500 dark:text-slate-300">
          {profile.anonymousHandle}
        </span>
      </div>
    </header>
  );
}

function FloatingChatButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0, y: 100 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
      className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center z-50 hover:scale-110 active:scale-95 transition-transform"
    >
      <MessageCircle className="w-6 h-6" />
    </motion.button>
  );
}
