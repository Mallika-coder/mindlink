import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Wind, MessageCircle, Send, TrendingUp, Brain, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { useLocalState } from "../hooks/useLocalState";
import { MOOD_EMOJIS, calculateStreak, getMoodTrend, getWeeklyAverage, generateInsights } from "../utils/wellness";

export default function Dashboard({ openChat, setIsBreathingActive, setIsAssessmentOpen }) {
  const [moods, setMoods] = useLocalState("mlk-moods", []);
  const [habits] = useLocalState("mlk-habits", []);
  const [journal] = useLocalState("mlk-journal", []);
  const streak = useMemo(() => calculateStreak(moods), [moods]);
  const weeklyAvg = useMemo(() => getWeeklyAverage(moods), [moods]);
  const trendData = useMemo(() => getMoodTrend(moods, 7), [moods]);
  const insights = useMemo(() => generateInsights(moods, habits, journal), [moods, habits, journal]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MoodCheckIn moods={moods} setMoods={setMoods} />
        </div>
        <div className="space-y-4">
          <StatCard label="Current Streak" value={`${streak} ${streak === 1 ? "day" : "days"}`} icon="🔥" gradient="from-orange-500 to-red-500" />
          <StatCard label="Weekly Average" value={weeklyAvg ? `${weeklyAvg}/5` : "—"} icon="📊" gradient="from-indigo-500 to-purple-500" />
          <QuickActionCard icon={Wind} title="Breathe" description="2 min calm" color="bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800" onClick={() => setIsBreathingActive(true)} />
          <QuickActionCard icon={MessageCircle} title="AI Therapist" description="CBT-based chat" color="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800" onClick={openChat} />
        </div>
      </div>

      {trendData.some((d) => d.score) && (
        <div className="bg-white dark:bg-gray-950/50 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              Mood Trend (7 Days)
            </h3>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData.filter((d) => d.score)}>
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis domain={[1, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    const mood = MOOD_EMOJIS.find((m) => m.score === d.score);
                    return (
                      <div className="bg-white dark:bg-gray-900 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-gray-700">
                        <p className="font-bold">{mood?.emoji} {mood?.label}</p>
                        {d.note && <p className="text-xs text-slate-500 mt-1 max-w-[200px]">{d.note}</p>}
                      </div>
                    );
                  }}
                />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fill="url(#moodGradient)" dot={{ fill: "#6366f1", r: 5 }} activeDot={{ r: 7 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-950/50 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800">
          <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Weekly Insights
          </h3>
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <div key={i} className={`p-3 rounded-lg text-sm ${insight.type === "positive" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300" : insight.type === "concern" ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300" : insight.type === "achievement" ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300" : "bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-slate-300"}`}>
                {insight.text}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950/50 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800">
          <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-purple-500" />
            Quick Self-Assessment
          </h3>
          <p className="text-sm text-slate-500 dark:text-gray-400 mb-4">
            Check in on your mental health with clinically validated GAD-7 and PHQ-9 scales. Private and confidential.
          </p>
          <button onClick={() => setIsAssessmentOpen(true)} className="w-full px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-600/20">
            Start Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

function MoodCheckIn({ moods, setMoods }) {
  const todayKey = format(new Date(), "yyyy-MM-dd");
  const alreadyCheckedIn = moods.some((m) => m.date === todayKey);
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");
  const [step, setStep] = useState("mood");

  const handleMoodSelect = (score) => {
    setSelectedMood(score);
    setStep("note");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMood) return;
    const newMood = { date: todayKey, score: selectedMood, note: note.trim() };
    setMoods((prev) => [...prev.filter((m) => m.date !== todayKey), newMood]);
    setNote("");
    setStep("done");
  };

  if (alreadyCheckedIn) {
    const todayMood = moods.find((m) => m.date === todayKey);
    const emoji = MOOD_EMOJIS.find((m) => m.score === todayMood?.score);
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-8 rounded-2xl shadow-sm border border-emerald-200 dark:border-emerald-800/50 h-full flex flex-col justify-center relative overflow-hidden">
        <div className="absolute -right-8 -top-8 text-[120px] opacity-10">{emoji?.emoji}</div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">Checked in today!</h2>
          <p className="text-emerald-600 dark:text-emerald-400 mt-1">
            You're feeling <span className="font-bold">{emoji?.label}</span> {emoji?.emoji}
          </p>
          {todayMood?.note && <p className="mt-3 text-sm text-emerald-700/70 dark:text-emerald-300/70 italic">"{todayMood.note}"</p>}
          <p className="mt-4 text-sm text-emerald-600/60 dark:text-emerald-400/60">See you tomorrow for your next check-in.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div layout className="bg-white dark:bg-gray-950/50 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800 h-full flex flex-col justify-between">
      {step === "mood" && (
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">How are you feeling?</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Tap the emoji that best matches your mood right now.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            {MOOD_EMOJIS.map((mood) => (
              <motion.button
                key={mood.score}
                whileHover={{ scale: 1.15, y: -4 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleMoodSelect(mood.score)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${selectedMood === mood.score ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30" : "border-transparent hover:border-slate-200 dark:hover:border-gray-700"}`}
              >
                <span className="text-4xl">{mood.emoji}</span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{mood.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {step === "note" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{MOOD_EMOJIS.find((m) => m.score === selectedMood)?.emoji}</span>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">What's on your mind?</h2>
              <p className="text-sm text-slate-500">(Optional — press enter or click to save)</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="A few words about your day..."
              className="w-full px-5 py-4 rounded-xl bg-slate-100 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 focus:ring-0 text-lg transition-all"
              autoFocus
            />
            <button type="submit" className="w-14 h-14 bg-indigo-600 text-white rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
              <Send className="w-5 h-5" />
            </button>
          </form>
          <button onClick={() => setStep("mood")} className="mt-3 text-sm text-slate-400 hover:text-slate-600">← Change mood</button>
        </motion.div>
      )}
    </motion.div>
  );
}

function StatCard({ label, value, icon, gradient }) {
  return (
    <div className="bg-white dark:bg-gray-950/50 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800 flex items-center justify-between group hover:shadow-md transition-all">
      <div>
        <p className="text-xs text-slate-500 dark:text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-extrabold mt-0.5 text-slate-800 dark:text-white">{value}</p>
      </div>
      <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-xl shadow-lg transform group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
    </div>
  );
}

function QuickActionCard({ icon: Icon, title, description, color, onClick }) {
  return (
    <button onClick={onClick} className={`text-left p-4 rounded-2xl shadow-sm border flex items-center gap-3 w-full transition-all hover:scale-[1.02] hover:shadow-md ${color}`}>
      <div className="p-2.5 bg-white/60 dark:bg-black/10 rounded-xl">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="text-xs opacity-80">{description}</p>
      </div>
    </button>
  );
}
