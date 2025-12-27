// src/App.jsx - FINAL STABLE VERSION
import React, { useState, useMemo, useEffect, useRef } from "react";
import ChatWindow from "./components/ChatWindow";
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
  const [activeResource, setActiveResource] = useState(null);

  const openChat = () => setIsChatOpen(true);
  
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-gray-900 flex">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Header />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderView(activeView, { openChat, setIsBreathingActive, setActiveResource })}
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
    <aside className="w-16 sm:w-20 lg:w-56 bg-white dark:bg-gray-950/50 border-r border-slate-200 dark:border-gray-800 flex flex-col">
      <div className="flex items-center justify-center gap-2 p-4 sm:p-5 border-b border-slate-200 dark:border-gray-800">
         <Heart className="w-8 h-8 text-indigo-500" />
         <span className="hidden lg:inline font-bold text-xl text-indigo-500">MindLink</span>
      </div>
      <nav className="flex-1 p-2 sm:p-3 space-y-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveView(item.name)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeView === item.name
                ? "bg-indigo-500 text-white shadow-lg"
                : "text-slate-500 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-gray-800"
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="hidden lg:inline font-medium">{item.name}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-200 dark:border-gray-800">
        <button className="w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900">
           <PhoneCall className="w-5 h-5 flex-shrink-0" />
           <span className="hidden lg:inline font-bold">SOS</span>
        </button>
      </div>
    </aside>
  );
}

function Header() {
    const [profile] = useLocalState("mlk-profile", { anonymousHandle: "@mango-owl" });
    return (
        <header className="flex items-center justify-between pb-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Welcome Back!</h1>
                <p className="text-slate-500 dark:text-gray-400">Let's make today a good day.</p>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm font-mono p-2 bg-slate-100 dark:bg-gray-800 rounded-lg">{profile.anonymousHandle}</span>
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

function DashboardView({ openChat, setIsBreathingActive }) {
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
                    <div className="bg-white dark:bg-gray-950/50 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800 flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 dark:text-gray-400">Your current streak</p>
                            <p className="text-3xl font-bold">{streak} {streak === 1 ? 'day' : 'days'}</p>
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl">
                            🔥
                        </div>
                    </div>
                    <QuickActionCard 
                        icon={Wind}
                        title="Breathing Exercise"
                        description="2 min to calm your mind"
                        color="bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400"
                        onClick={() => setIsBreathingActive(true)}
                    />
                    <QuickActionCard 
                        icon={MessageCircle}
                        title="AI Companion"
                        description="Talk through your thoughts"
                        color="bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400"
                        onClick={openChat}
                    />
                </div>
            </div>
            <SelfAssessmentCard />
        </div>
    )
}

function ResourcesView({ setActiveResource }) {
    return (
        <div className="bg-white dark:bg-gray-950/50 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800">
            <h2 className="text-xl font-bold mb-4">Resource Hub</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {RESOURCES.map(r => (
                    <button key={r.id} onClick={() => setActiveResource(r)} className="text-left p-4 border border-slate-200 dark:border-gray-800 rounded-lg hover:shadow-md transition-shadow hover:border-indigo-400 dark:hover:border-indigo-600">
                        <h3 className="font-semibold">{r.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-gray-400 capitalize">{r.kind} • {r.length}</p>
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
                    className="w-full p-3 rounded-lg bg-slate-100 dark:bg-gray-800 border-transparent focus:border-indigo-500 focus:ring-indigo-500"
                    rows={3}
                />
                <button onClick={submitPost} className="h-full px-6 py-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600">Post</button>
            </div>
            <div className="space-y-4">
                {posts.map(p => (
                    <div key={p.id} className="p-4 bg-slate-50 dark:bg-gray-800/50 rounded-lg flex items-start gap-4">
                        <button className="flex flex-col items-center text-slate-500 dark:text-gray-400">
                            <ArrowUp className="w-5 h-5"/>
                            <span className="text-xs font-bold">{p.up}</span>
                        </button>
                        <div>
                           <p className="text-sm text-slate-500 dark:text-gray-400 font-mono">{p.handle}</p> 
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
                    <div key={b.label} className={`p-4 border rounded-lg text-center transition-all ${b.unlocked ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'opacity-50 bg-slate-100 dark:bg-gray-800'}`}>
                        <div className={`text-4xl mb-2 ${b.unlocked ? 'filter-none' : 'filter grayscale'}`}>🏅</div>
                        <p className="text-sm font-semibold">{b.label}</p>
                        <p className={`text-xs font-bold ${b.unlocked ? 'text-indigo-600' : 'text-slate-500'}`}>{b.unlocked ? "Unlocked" : "Locked"}</p>
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
                        <div key={mission.id} className="p-4 bg-slate-50 dark:bg-gray-800/50 rounded-lg flex items-center gap-4">
                            <mission.icon className="w-8 h-8 text-indigo-500 flex-shrink-0" />
                            <p className="flex-1 text-slate-800 dark:text-slate-200">{mission.text}</p>
                            <button 
                                onClick={() => completeMission(mission.id)}
                                disabled={isCompleted}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${ isCompleted ? 'bg-green-500 text-white flex items-center gap-2 cursor-default' : 'bg-indigo-500 text-white hover:bg-indigo-600' }`}
                            >
                                {isCompleted ? <><CheckCircle className="w-5 h-5"/> Done!</> : "I did this!"}
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
                    onChange={e => setProfile({...profile, anonymousHandle: e.target.value})}
                    className="mt-2 w-full md:w-1/3 p-2 rounded-lg bg-slate-100 dark:bg-gray-800 border-transparent focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>
             <div className="py-4 flex justify-between items-center">
                <div>
                    <h3 className="font-semibold">Enable Reminders</h3>
                    <p className="text-sm text-slate-500 dark:text-gray-400">Get gentle nudges for daily check-ins.</p>
                </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={profile.notifications} onChange={e => setProfile({...profile, notifications: e.target.checked})} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
            </div>
            <div className="py-4">
                <h3 className="font-semibold text-red-600 dark:text-red-500">Danger Zone</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400 mb-2">This will permanently delete all your data from this browser.</p>
                <button onClick={clearAll} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Clear All Data</button>
            </div>
        </div>
    )
}

// --- Reusable UI, Feature, and Modal Components ---

function QuickActionCard({ icon: Icon, title, description, color, onClick = () => {} }) {
    return (
        <button onClick={onClick} className={`text-left p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800 flex items-center gap-4 w-full transition-transform hover:scale-105 ${color}`}>
            <div className="p-3 bg-white/50 rounded-full">
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="text-sm opacity-80">{description}</p>
            </div>
        </button>
    )
}

function SelfAssessmentCard() {
    return (
        <div className="bg-white dark:bg-gray-950/50 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-bold">Quick Self-Assessment</h2>
                    <p className="text-slate-500 dark:text-gray-400 text-sm">A confidential check-in, not a diagnosis.</p>
                </div>
            </div>
            <p className="text-sm text-center text-slate-500 dark:text-gray-400">Assessment feature coming soon!</p>
        </div>
    )
}

// src/App.jsx -> Replace ONLY the AvatarCheckIn component with this code

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
      // FIX: Check condition BEFORE setting state
      if (i >= fullMessage.length) {
        clearInterval(interval);
        return;
      }
      setDisplayedMessage(prev => prev + fullMessage[i]);
      i++;
    }, 30);
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
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-8 rounded-2xl shadow-sm border border-green-200 dark:border-green-800 flex items-center justify-between h-full">
            <div>
                <h2 className="text-2xl font-bold text-green-800 dark:text-green-300">Thanks for checking in today!</h2>
                <p className="text-green-600 dark:text-green-400 mt-1">Consistency is key. See you tomorrow!</p>
            </div>
            <div className="text-5xl">✅</div>
        </div>
    )
  }

  return (
    <motion.div layout className="bg-white dark:bg-gray-950/50 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800 h-full flex flex-col justify-between">
      <div className="flex gap-6 items-start">
        <motion.img src="/avatar.png" alt="Friendly Avatar" className="w-24 h-24 rounded-full cursor-pointer" whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 400, damping: 17 }} />
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Mindful Moment</h2>
          <p className="text-slate-500 dark:text-gray-400 h-12">
            {displayedMessage}
            <span className="inline-block w-2 h-5 bg-indigo-500 animate-pulse ml-1"></span>
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Share a little about your day..." className="w-full p-4 rounded-full bg-slate-100 dark:bg-gray-800 border-transparent focus:border-indigo-500 focus:ring-indigo-500 text-lg" />
        <button type="submit" className="w-14 h-14 bg-indigo-500 text-white rounded-full flex items-center justify-center flex-shrink-0 hover:bg-indigo-600 transition-colors"><Send className="w-6 h-6" /></button>
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} className="bg-sky-900 text-white p-8 rounded-2xl w-full max-w-md text-center flex flex-col items-center">
                <motion.div className="w-48 h-48 rounded-full border-4 border-white/20 flex items-center justify-center mb-6" animate={{ scale: instruction === "Breathe In..." ? 1.2 : 1 }} transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}>
                    <p className="text-4xl font-bold">{instruction}</p>
                </motion.div>
                <p className="text-6xl font-mono mb-4">{`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}</p>
                <button onClick={onClose} className="mt-4 px-4 py-2 bg-white/10 rounded-full hover:bg-white/20">End Early</button>
            </motion.div>
        </div>
    );
}

function ResourceModal({ resource, onClose }) {
    return (
         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl relative p-4">
                <button onClick={onClose} className="absolute top-3 right-3 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-gray-800 z-10"><X className="w-5 h-5 text-slate-500"/></button>
                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-3">{resource.title}</h3>
                    {resource.kind === 'article' ? ( <p className="text-slate-600 dark:text-slate-300">{resource.content}</p> ) : (
                        <div className="aspect-video">
                            <iframe src={resource.src} title={resource.title} className="w-full h-full rounded-xl" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                        </div>
                    )}
                </div>
              </motion.div>
         </div>
    )
}

function FloatingChatButton({ onClick }) {
    return (
        <motion.button onClick={onClick} initial={{ scale: 0, y: 100 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }} className="fixed bottom-6 right-6 w-16 h-16 bg-indigo-600 rounded-full text-white shadow-lg flex items-center justify-center z-50 hover:bg-indigo-700">
            <MessageCircle className="w-8 h-8" />
        </motion.button>
    )
}

