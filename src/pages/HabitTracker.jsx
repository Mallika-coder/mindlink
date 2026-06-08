import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Check, Trash2, Flame, Target } from "lucide-react";
import { format, subDays, differenceInDays } from "date-fns";
import { useLocalState } from "../hooks/useLocalState";

const PRESET_HABITS = [
  { name: "Meditate 5 min", icon: "🧘", category: "mindfulness" },
  { name: "Exercise 30 min", icon: "🏃", category: "physical" },
  { name: "Read 15 pages", icon: "📖", category: "learning" },
  { name: "Drink 8 glasses water", icon: "💧", category: "physical" },
  { name: "No social media before noon", icon: "📵", category: "digital" },
  { name: "Sleep before 11 PM", icon: "😴", category: "sleep" },
  { name: "Gratitude journaling", icon: "🙏", category: "mindfulness" },
  { name: "Walk outside", icon: "🌳", category: "physical" },
];

export default function HabitTracker() {
  const [habits, setHabits] = useLocalState("mlk-habits", []);
  const [showAdd, setShowAdd] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: "", icon: "✨" });
  const todayKey = format(new Date(), "yyyy-MM-dd");

  const addHabit = (habit) => {
    const h = { id: Date.now(), name: habit.name, icon: habit.icon, completions: [], createdAt: todayKey };
    setHabits((prev) => [...prev, h]);
    setNewHabit({ name: "", icon: "✨" });
    setShowAdd(false);
  };

  const toggleHabit = (habitId) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const completions = h.completions || [];
        if (completions.includes(todayKey)) {
          return { ...h, completions: completions.filter((d) => d !== todayKey) };
        }
        return { ...h, completions: [...completions, todayKey] };
      })
    );
  };

  const deleteHabit = (habitId) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  };

  const getHabitStreak = (habit) => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const key = format(subDays(today, i), "yyyy-MM-dd");
      if (habit.completions?.includes(key)) streak++;
      else if (i > 0) break;
    }
    return streak;
  };

  const completedToday = habits.filter((h) => h.completions?.includes(todayKey)).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Habit Tracker</h2>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Build healthy routines, one day at a time.</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Habit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-950/50 p-5 rounded-2xl border border-slate-200 dark:border-gray-800 flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
            <Target className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-gray-400">Today's Progress</p>
            <p className="text-2xl font-bold">{completedToday}/{totalHabits}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-950/50 p-5 rounded-2xl border border-slate-200 dark:border-gray-800 flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <div className="text-white font-bold text-lg">{completionRate}%</div>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-gray-400">Completion Rate</p>
            <div className="w-32 h-2 bg-slate-200 dark:bg-gray-700 rounded-full mt-2">
              <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${completionRate}%` }} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-950/50 p-5 rounded-2xl border border-slate-200 dark:border-gray-800 flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
            <Flame className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-gray-400">Best Streak</p>
            <p className="text-2xl font-bold">{habits.length > 0 ? Math.max(...habits.map(getHabitStreak)) : 0} days</p>
          </div>
        </div>
      </div>

      {showAdd && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-white dark:bg-gray-950/50 p-6 rounded-2xl border border-slate-200 dark:border-gray-800">
          <h3 className="font-bold mb-4">Quick Add</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            {PRESET_HABITS.filter((p) => !habits.find((h) => h.name === p.name)).map((preset) => (
              <button key={preset.name} onClick={() => addHabit(preset)} className="p-3 border border-slate-200 dark:border-gray-700 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all text-left">
                <span className="text-xl">{preset.icon}</span>
                <p className="text-xs font-medium mt-1 text-slate-700 dark:text-slate-200">{preset.name}</p>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <input type="text" value={newHabit.name} onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })} placeholder="Or type a custom habit..." className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 focus:border-indigo-500 focus:ring-0" />
            <button onClick={() => newHabit.name.trim() && addHabit(newHabit)} disabled={!newHabit.name.trim()} className="px-5 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all">Add</button>
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {habits.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No habits yet</p>
            <p className="text-sm mt-1">Add a habit to start building your routine.</p>
          </div>
        ) : (
          habits.map((habit) => {
            const isCompletedToday = habit.completions?.includes(todayKey);
            const streak = getHabitStreak(habit);
            const last7 = Array.from({ length: 7 }, (_, i) => {
              const date = format(subDays(new Date(), 6 - i), "yyyy-MM-dd");
              return habit.completions?.includes(date);
            });

            return (
              <motion.div key={habit.id} layout className={`p-4 rounded-xl border flex items-center gap-4 transition-all group ${isCompletedToday ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800" : "bg-white dark:bg-gray-950/50 border-slate-200 dark:border-gray-800"}`}>
                <button onClick={() => toggleHabit(habit.id)} className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${isCompletedToday ? "bg-green-500 text-white shadow-lg shadow-green-500/30" : "bg-slate-100 dark:bg-gray-800 text-slate-400 hover:bg-indigo-100 hover:text-indigo-500"}`}>
                  {isCompletedToday ? <Check className="w-5 h-5" /> : <span className="text-lg">{habit.icon}</span>}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${isCompletedToday ? "line-through text-green-700 dark:text-green-300 opacity-70" : "text-slate-800 dark:text-slate-200"}`}>{habit.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {streak > 0 && (
                      <span className="text-xs font-semibold text-orange-500 flex items-center gap-1">
                        <Flame className="w-3 h-3" /> {streak}d streak
                      </span>
                    )}
                    <div className="flex gap-0.5">
                      {last7.map((done, i) => (
                        <div key={i} className={`w-3 h-3 rounded-sm ${done ? "bg-green-400" : "bg-slate-200 dark:bg-gray-700"}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <button onClick={() => deleteHabit(habit.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
