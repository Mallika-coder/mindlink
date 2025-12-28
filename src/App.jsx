import React, { useState, useMemo, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";
import AssessmentModal from "./components/AssessmentModal";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, BookOpen, Users, Award, Settings, Heart, MessageCircle, PhoneCall,
  Wind, Send, ArrowUp, X, Feather, CheckCircle
} from "lucide-react";

// --- Custom Hook for Local Storage ---
const useLocalState = (key, initial) => {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch (e) { return initial; }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
};

// --- Mock Data ---
const RESOURCES = [
  { id: "r1", kind: "video", title: "How to Manage Stress", length: "7 min", src: "https://www.youtube.com/embed/bsaOBWUqdCU" },
  { id: "r2", kind: "video", title: "How to Overcome Laziness", length: "6 min", src: "https://www.youtube.com/embed/9DbvSl_C_kY" },
  { id: "r3", kind: "video", title: "How to Stop Procrastinating", length: "15 min", src: "https://www.youtube.com/embed/ctyqx6trUmo" },
  { id: "r4", kind: "article", title: "Sleep Hygiene for Students", length: "4 min", content: "Getting quality sleep is crucial for academic success. Tips: 1. Stick to a regular sleep schedule. 2. Create a relaxing bedtime routine. 3. Avoid screens before bed. 4. Make sure your bedroom is dark, quiet, and cool." },
];
const MINDFUL_MISSIONS = [
  { id: 'm1', text: "Leave a positive, encouraging note in a random library book for someone to find.", icon: BookOpen },
  { id: 'm2', text: "Anonymously pay for the person's coffee behind you in the campus cafe.", icon: Heart },
  { id: 'm3', text: "Offer genuine help to a classmate who seems to be struggling with a concept.", icon: Users },
];

// --- Main App Component ---
export default function App() {
  const [activeView, setActiveView] = useState("Dashboard");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [activeResource, setActiveResource] = useState(null);

  const openChat = () => setIsChatOpen(true);

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-gray-900 flex font-sans text-slate-900 dark:text-slate-100 selection:bg-indigo-500/30">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Header />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderView(activeView, { openChat, setIsBreathingActive, setActiveResource, setIsAssessmentOpen })}
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {isChatOpen && <ChatWindow onClose={() => setIsChatOpen(false)} />}
      </AnimatePresence>
      {!isChatOpen && <FloatingChatButton onClick={() => setIsChatOpen(true)} />}

      <AnimatePresence>
        {isBreathingActive && <BreathingExerciseModal onClose={() => setIsBreathingActive(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {isAssessmentOpen && <AssessmentModal onClose={() => setIsAssessmentOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {activeResource && <ResourceModal resource={activeResource} onClose={() => setActiveResource(null)} />}
      </AnimatePresence>
    </div>
  );
}

// --- Layout Components ---
const NAV_ITEMS = [
  { name: "Dashboard", icon: Home },
  { name: "Resources", icon: BookOpen },
  { name: "Community", icon: Users },
  { name: "Rewards", icon: Award },
  { name: "Mindful Missions", icon: Feather },
  { name: "Settings", icon: Settings },
];

function Sidebar({ activeView, setActiveView }) {
  return (
    <aside className="w-16 sm:w-20 lg:w-64 bg-white dark:bg-gray-950/80 border-r border-slate-200 dark:border-gray-800 flex flex-col transition-all duration-300">
      <div className="flex items-center justify-center lg:justify-start gap-3 p-6 border-b border-slate-200 dark:border-gray-800">
        <div className="relative">
          <Heart className="w-8 h-8 text-indigo-500 fill-indigo-500" />
          <div className="absolute inset-0 bg-indigo-400 blur-lg opacity-40"></div>
        </div>
        <span className="hidden lg:inline font-bold text-2xl tracking-tight text-slate-800 dark:text-white">MindLink</span>
      </div>
      <nav className="flex-1 p-3 space-y-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveView(item.name)}
            className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 group ${activeView === item.name
              ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-900"
              }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="hidden lg:inline font-medium">{item.name}</span>
            {activeView === item.name && <motion.div layoutId="active-indicator" className="ml-auto w-1 h-1 bg-white rounded-full hidden lg:block" />}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-200 dark:border-gray-800">
        <a href="tel:9569714178" className="w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors border border-emerald-100 dark:border-emerald-900/50">
          <PhoneCall className="w-5 h-5 flex-shrink-0" />
          <span className="hidden lg:inline font-bold">Contact</span>
        </a>
      </div>
    </aside>
  );
}

function Header() {
  const [profile] = useLocalState("mlk-profile", { anonymousHandle: "@mango-owl" });
  return (
    <header className="flex items-center justify-between pb-8 pt-2">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Welcome Back!</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Let's make today a good day.</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-mono px-3 py-1.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-full shadow-sm text-slate-600 dark:text-slate-300">
          {profile.anonymousHandle}
        </span>
      </div>
    </header>
  )
}

// --- View-rendering Logic ---
function renderView(view, props) {
  switch (view) {
    case "Dashboard":
      return <DashboardView {...props} />;
    case "Resources":
      return <ResourcesView {...props} />;
    case "Community":
      return <CommunityView {...props} />;
    case "Rewards":
      return <RewardsView {...props} />;
    case "Mindful Missions":
      return <MindfulMissionsView {...props} />;
    case "Settings":
      return <SettingsView {...props} />;
    default:
      return <DashboardView {...props} />;
  }
}

// --- View Components ---

function DashboardView({ openChat, setIsBreathingActive, setIsAssessmentOpen }) {
  const [moods] = useLocalState("mlk-moods", []);
  const streak = useMemo(() => {
    let s = 0;
    const d = new Date();
    for (let i = 0; i < 30; i++) {
      const k = new Date(d.getTime() - i * 86400000).toISOString().slice(0, 10);
      if (moods.find((m) => m.date === k)) s++;
      else if (i > 0) break;
    }
    return s;
  }, [moods]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AvatarCheckIn />
        </div>
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-950/50 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800 flex items-center justify-between relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-slate-500 dark:text-gray-400 font-medium">Your current streak</p>
              <p className="text-4xl font-extrabold mt-1 text-slate-800 dark:text-white">{streak} {streak === 1 ? 'day' : 'days'}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              🔥
            </div>
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>
          </div>
          <QuickActionCard
            icon={Wind}
            title="Breathing Exercise"
            description="2 min to calm your mind"
            color="bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 border-sky-100 dark:border-sky-900/50"
            onClick={() => setIsBreathingActive(true)}
          />
          <QuickActionCard
            icon={MessageCircle}
            title="AI Companion"
            description="Talk through your thoughts"
            color="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-900/50"
            onClick={openChat}
          />
        </div>
      </div>
      <SelfAssessmentCard onStart={() => setIsAssessmentOpen(true)} />
    </div>
  )
}

function ResourcesView({ setActiveResource }) {
  return (
    <div className="bg-white dark:bg-gray-950/50 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800">
      <h2 className="text-xl font-bold mb-4">Resource Hub</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {RESOURCES.map(r => (
          <button key={r.id} onClick={() => setActiveResource(r)} className="text-left p-4 border border-slate-200 dark:border-gray-800 rounded-xl hover:shadow-lg transition-all hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50 dark:bg-gray-900/50 group">
            <div className="mb-3 w-full h-32 bg-slate-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              {r.kind === 'video' ? <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-sm"><div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-indigo-600 border-b-[6px] border-b-transparent ml-1"></div></div> : <BookOpen className="text-slate-400" />}
            </div>
            <h3 className="font-semibold group-hover:text-indigo-500 transition-colors">{r.title}</h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 capitalize mt-1 px-2 py-0.5 bg-slate-100 dark:bg-gray-800 rounded-md inline-block">{r.kind} • {r.length}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function CommunityView() {
  const [profile] = useLocalState("mlk-profile", { anonymousHandle: "@mango-owl" });
  const [posts, setPosts] = useLocalState("mlk-posts", [{ id: 1, handle: "@hopeful-sparrow", text: "Exam stress is high!", up: 12 }]);
  const [postText, setPostText] = useState("");

  const submitPost = () => {
    if (!postText.trim()) return;
    setPosts([{ id: Date.now(), handle: profile.anonymousHandle, text: postText, up: 0 }, ...posts]);
    setPostText("");
  }

  return (
    <div className="bg-white dark:bg-gray-950/50 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800">
      <h2 className="text-xl font-bold mb-1">Anonymous Peer Forum</h2>
      <p className="text-sm text-slate-500 dark:text-gray-400 mb-4">Share your thoughts with the community. Be kind and supportive.</p>
      <div className="flex gap-4 items-start mb-6">
        <textarea
          value={postText}
          onChange={e => setPostText(e.target.value)}
          placeholder="Share something anonymously..."
          className="w-full p-3 rounded-lg bg-slate-100 dark:bg-gray-800 border-transparent focus:border-indigo-500 focus:ring-indigo-500 resize-none"
          rows={3}
        />
        <button onClick={submitPost} className="h-full px-6 py-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 shadow-md shadow-indigo-500/20 transition-all">Post</button>
      </div>
      <div className="space-y-4">
        {posts.map(p => (
          <div key={p.id} className="p-4 bg-slate-50 dark:bg-gray-800/50 rounded-lg flex items-start gap-4 border border-slate-100 dark:border-gray-800">
            <button className="flex flex-col items-center text-slate-500 dark:text-gray-400 bg-white dark:bg-gray-900 rounded-lg p-2 border border-slate-200 dark:border-gray-700">
              <ArrowUp className="w-5 h-5" />
              <span className="text-xs font-bold mt-1">{p.up}</span>
            </button>
            <div>
              <p className="text-xs font-bold text-indigo-500 font-mono mb-1">{p.handle}</p>
              <p className="text-slate-800 dark:text-slate-200">{p.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RewardsView() {
  const [moods] = useLocalState("mlk-moods", []);
  const [streak] = useState(5); // Mock streak
  const badges = useMemo(() => [
    { label: "3-Day Check-in Streak", unlocked: streak >= 3 },
    { label: "5 Total Check-ins", unlocked: moods.length >= 5 },
    { label: "First Community Post", unlocked: true }, // Mock
    { label: "7-Day Streak", unlocked: streak >= 7 },
  ], [streak, moods.length]);

  return (
    <div className="bg-white dark:bg-gray-950/50 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800">
      <h2 className="text-xl font-bold mb-4">Your Badges</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {badges.map(b => (
          <div key={b.label} className={`p-6 border rounded-xl text-center transition-all ${b.unlocked ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'opacity-60 bg-slate-50 dark:bg-gray-800 dashed border-slate-300 dark:border-gray-700'}`}>
            <div className={`text-4xl mb-3 ${b.unlocked ? 'filter-none scale-110' : 'filter grayscale blur-[1px]'}`}>🏅</div>
            <p className="text-sm font-bold">{b.label}</p>
            <p className={`text-xs font-bold mt-2 uppercase tracking-wide ${b.unlocked ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>{b.unlocked ? "Unlocked" : "Locked"}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function MindfulMissionsView() {
  const [completedMissions, setCompletedMissions] = useLocalState('mlk-missions', []);

  const completeMission = (missionId) => {
    if (!completedMissions.includes(missionId)) {
      setCompletedMissions([...completedMissions, missionId]);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-950/50 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800">
      <h2 className="text-xl font-bold mb-1">Mindful Missions</h2>
      <p className="text-sm text-slate-500 dark:text-gray-400 mb-6">Perform small, anonymous acts of kindness to brighten the campus community.</p>
      <div className="space-y-4">
        {MINDFUL_MISSIONS.map(mission => {
          const isCompleted = completedMissions.includes(mission.id);
          return (
            <div key={mission.id} className={`p-4 rounded-xl flex items-center gap-4 transition-all ${isCompleted ? 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50' : 'bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-800'}`}>
              <div className={`p-3 rounded-full ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-white text-indigo-500 shadow-sm'}`}>
                <mission.icon className="w-6 h-6 flex-shrink-0" />
              </div>
              <p className={`flex-1 ${isCompleted ? 'text-green-800 dark:text-green-200 line-through opacity-70' : 'text-slate-800 dark:text-slate-200'}`}>{mission.text}</p>
              <button
                onClick={() => completeMission(mission.id)}
                disabled={isCompleted}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${isCompleted ? 'bg-transparent text-green-600 flex items-center gap-2 cursor-default' : 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-sm'}`}
              >
                {isCompleted ? <><CheckCircle className="w-5 h-5" /> Done</> : "I did this!"}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SettingsView() {
  const [profile, setProfile] = useLocalState("mlk-profile", { anonymousHandle: "@mango-owl", notifications: true });

  const clearAll = () => {
    if (!confirm("Are you sure you want to delete all your local data? This cannot be undone.")) return;
    localStorage.clear();
    window.location.reload();
  }

  return (
    <div className="bg-white dark:bg-gray-950/50 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800 divide-y divide-slate-200 dark:divide-gray-800">
      <div className="py-4">
        <h3 className="font-semibold">Anonymous Handle</h3>
        <p className="text-sm text-slate-500 dark:text-gray-400">This name will be used in the community forum.</p>
        <input
          type="text"
          value={profile.anonymousHandle}
          onChange={e => setProfile({ ...profile, anonymousHandle: e.target.value })}
          className="mt-2 w-full md:w-1/3 p-2 rounded-lg bg-slate-100 dark:bg-gray-800 border-transparent focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div className="py-4 flex justify-between items-center">
        <div>
          <h3 className="font-semibold">Enable Reminders</h3>
          <p className="text-sm text-slate-500 dark:text-gray-400">Get gentle nudges for daily check-ins.</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={profile.notifications} onChange={e => setProfile({ ...profile, notifications: e.target.checked })} className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
        </label>
      </div>
      <div className="py-4">
        <h3 className="font-semibold text-red-600 dark:text-red-500">Danger Zone</h3>
        <p className="text-sm text-slate-500 dark:text-gray-400 mb-2">This will permanently delete all your data from this browser.</p>
        <button onClick={clearAll} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md shadow-red-600/20">Clear All Data</button>
      </div>
    </div>
  )
}

// --- Reusable UI, Feature, and Modal Components ---

function QuickActionCard({ icon: Icon, title, description, color, onClick = () => { } }) {
  return (
    <button onClick={onClick} className={`text-left p-6 rounded-2xl shadow-sm border flex items-center gap-4 w-full transition-all hover:scale-[1.02] hover:shadow-md ${color} border-slate-200 dark:border-gray-800`}>
      <div className="p-3 bg-white/60 dark:bg-black/10 rounded-xl backdrop-blur-sm">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-sm opacity-80 font-medium">{description}</p>
      </div>
    </button>
  )
}

function SelfAssessmentCard({ onStart }) {
  return (
    <div className="bg-white dark:bg-gray-950/50 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <feather className="w-32 h-32" />
      </div>
      <div className="relative z-10">
        <h2 className="text-xl font-bold flex items-center gap-2">
          Quick Self-Assessment
          <span className="text-xs font-normal bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">New</span>
        </h2>
        <p className="text-slate-500 dark:text-gray-400 text-sm mt-1 max-w-md">Check in on your mental health with the standard GAD-7 and PHQ-9 questionnaires. Strictly confidential and for your eyes only.</p>
      </div>
      <button
        onClick={onStart}
        className="relative z-10 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 whitespace-nowrap"
      >
        Start Assessment
      </button>
    </div>
  )
}

function AvatarCheckIn() {
  const [moods, setMoods] = useLocalState("mlk-moods", []);
  const todayKey = new Date().toISOString().slice(0, 10);
  const alreadyCheckedIn = moods.some(m => m.date === todayKey);
  const [text, setText] = useState("");
  const fullMessage = "Hey there! I'm here to help. Take a moment for yourself. How's your day feeling?";
  const [displayedMessage, setDisplayedMessage] = useState("");

  useEffect(() => {
    if (alreadyCheckedIn) return;
    setDisplayedMessage("");
    let i = 0;
    const interval = setInterval(() => {
      // Use slice to be robust against any timing/race conditions
      // This guarantees we never access undefined index or go beyond length
      if (i > fullMessage.length) {
        clearInterval(interval);
        return;
      }
      setDisplayedMessage(fullMessage.slice(0, i));
      i++;
    }, 40); // Slightly slower for better reading pace
    return () => clearInterval(interval);
  }, [alreadyCheckedIn]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const sentiment = text.length % 10;
    const newMood = { date: todayKey, score: sentiment, note: text };
    setMoods(prev => [...prev.filter(m => m.date !== todayKey), newMood]);
    setText("");
  }

  if (alreadyCheckedIn) {
    return (
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-8 rounded-2xl shadow-sm border border-emerald-100 dark:border-emerald-800/50 flex items-center justify-between h-full relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">Thanks for checking in!</h2>
          <p className="text-emerald-600 dark:text-emerald-400 mt-1">Consistency is key. See you tomorrow!</p>
        </div>
        <div className="text-6xl relative z-10 filter drop-shadow-md">✅</div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/40 to-transparent"></div>
      </div>
    )
  }

  return (
    <motion.div layout className="bg-white dark:bg-gray-950/50 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800 h-full flex flex-col justify-between relative overflow-hidden">
      <div className="flex gap-6 items-start relative z-10">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <img src="/avatar.png" alt="Friendly Avatar" className="w-24 h-24 rounded-full border-4 border-indigo-50 dark:border-indigo-900/50 shadow-md" />
        </motion.div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Mindful Moment</h2>
          <p className="text-slate-600 dark:text-slate-300 h-14 mt-1 leading-relaxed">
            {displayedMessage}
            <span className="inline-block w-2 h-5 bg-indigo-500 animate-pulse ml-1 align-middle"></span>
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-6 flex gap-3 relative z-10">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share a little about your day..."
          className="w-full px-6 py-4 rounded-full bg-slate-100 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 focus:ring-0 text-lg transition-all shadow-inner"
        />
        <button type="submit" className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center flex-shrink-0 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95">
          <Send className="w-6 h-6 ml-0.5" />
        </button>
      </form>
    </motion.div>
  );
}

function BreathingExerciseModal({ onClose }) {
  const DURATION = 120;
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [instruction, setInstruction] = useState("Get ready...");

  useEffect(() => {
    const initialTimeout = setTimeout(() => { setInstruction("Breathe In..."); }, 2000);
    const timerInterval = setInterval(() => { setTimeLeft(prev => { if (prev <= 1) { clearInterval(timerInterval); return 0; } return prev - 1; }); }, 1000);
    return () => { clearTimeout(initialTimeout); clearInterval(timerInterval); };
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      setInstruction("Finished! Well done.");
      const audio = new Audio('/finish-sound.mp3');
      audio.play().catch(e => console.error("Audio play failed:", e));
      setTimeout(onClose, 3000);
      return;
    }
    const cycle = timeLeft % 8;
    if (cycle >= 4) { setInstruction("Breathe In..."); } else { setInstruction("Breathe Out..."); }
  }, [timeLeft, onClose]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} className="bg-gradient-to-b from-sky-900 to-indigo-950 text-white p-10 rounded-3xl w-full max-w-md text-center flex flex-col items-center shadow-2xl border border-white/10">
        <motion.div
          className="w-56 h-56 rounded-full border-8 border-sky-300/20 flex items-center justify-center mb-8 bg-sky-500/10 backdrop-blur-md"
          animate={{ scale: instruction === "Breathe In..." ? 1.3 : 1 }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
        >
          <p className="text-3xl font-bold tracking-wider">{instruction}</p>
        </motion.div>
        <p className="text-6xl font-mono mb-6 font-light tracking-widest">{`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}</p>
        <button onClick={onClose} className="mt-4 px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors uppercase tracking-widest text-xs font-bold">End Exercise</button>
      </motion.div>
    </div>
  );
}

function ResourceModal({ resource, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-3xl relative overflow-hidden shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 z-10 transition-colors"><X className="w-5 h-5" /></button>
        <div className="p-0">
          <div className="bg-slate-50 dark:bg-gray-950/50 p-6 border-b border-slate-100 dark:border-gray-800">
            <h3 className="text-xl font-bold">{resource.title}</h3>
            <p className="text-sm text-slate-500 dark:text-gray-400 capitalize mt-1">{resource.kind} • {resource.length}</p>
          </div>
          <div className="p-6">
            {resource.kind === 'article' ? (<p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">{resource.content}</p>) : (
              <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg bg-black">
                <iframe src={resource.src} title={resource.title} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function FloatingChatButton({ onClick }) {
  return (
    <motion.button onClick={onClick} initial={{ scale: 0, y: 100 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }} className="fixed bottom-6 right-6 w-16 h-16 bg-indigo-600 rounded-full text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center z-50 hover:bg-indigo-700 hover:scale-110 active:scale-95 transition-all">
      <MessageCircle className="w-8 h-8" />
    </motion.button>
  )
}
