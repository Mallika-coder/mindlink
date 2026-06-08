import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Plus, TrendingUp, Clock, Zap } from "lucide-react";
import { format, subDays, differenceInMinutes, parse } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useLocalState } from "../hooks/useLocalState";

const SLEEP_QUALITY = [
  { score: 1, label: "Terrible", emoji: "😫", color: "#ef4444" },
  { score: 2, label: "Poor", emoji: "😟", color: "#f97316" },
  { score: 3, label: "Fair", emoji: "😐", color: "#eab308" },
  { score: 4, label: "Good", emoji: "😊", color: "#22c55e" },
  { score: 5, label: "Excellent", emoji: "🌟", color: "#06b6d4" },
];

export default function SleepTracker() {
  const [sleepLogs, setSleepLogs] = useLocalState("mlk-sleep", []);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ bedtime: "23:00", wakeTime: "07:00", quality: 3, notes: "" });
  const todayKey = format(new Date(), "yyyy-MM-dd");

  const logSleep = () => {
    const bedDate = parse(form.bedtime, "HH:mm", new Date());
    const wakeDate = parse(form.wakeTime, "HH:mm", new Date());
    let durationMin = differenceInMinutes(wakeDate, bedDate);
    if (durationMin < 0) durationMin += 24 * 60;
    const hours = (durationMin / 60).toFixed(1);

    const entry = {
      id: Date.now(),
      date: todayKey,
      bedtime: form.bedtime,
      wakeTime: form.wakeTime,
      duration: parseFloat(hours),
      quality: form.quality,
      notes: form.notes.trim(),
    };
    setSleepLogs((prev) => [entry, ...prev.filter((l) => l.date !== todayKey)]);
    setShowAdd(false);
    setForm({ bedtime: "23:00", wakeTime: "07:00", quality: 3, notes: "" });
  };

  const chartData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = format(subDays(new Date(), 6 - i), "yyyy-MM-dd");
      const log = sleepLogs.find((l) => l.date === date);
      return {
        day: format(subDays(new Date(), 6 - i), "EEE"),
        hours: log?.duration || 0,
        quality: log?.quality || 0,
      };
    });
  }, [sleepLogs]);

  const avgDuration = useMemo(() => {
    const recent = sleepLogs.slice(0, 7).filter((l) => l.duration > 0);
    if (recent.length === 0) return null;
    return (recent.reduce((sum, l) => sum + l.duration, 0) / recent.length).toFixed(1);
  }, [sleepLogs]);

  const avgQuality = useMemo(() => {
    const recent = sleepLogs.slice(0, 7).filter((l) => l.quality > 0);
    if (recent.length === 0) return null;
    return (recent.reduce((sum, l) => sum + l.quality, 0) / recent.length).toFixed(1);
  }, [sleepLogs]);

  const sleepScore = useMemo(() => {
    if (!avgDuration || !avgQuality) return null;
    const durationScore = Math.min(avgDuration / 8, 1) * 50;
    const qualityScore = (avgQuality / 5) * 50;
    return Math.round(durationScore + qualityScore);
  }, [avgDuration, avgQuality]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sleep Tracker</h2>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Track your sleep to find patterns and improve rest quality.</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Log Sleep
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-2xl text-white relative overflow-hidden">
          <div className="absolute top-2 right-2 text-6xl opacity-10">💤</div>
          <p className="text-indigo-100 text-sm font-medium">Sleep Score</p>
          <p className="text-4xl font-bold mt-1">{sleepScore ?? "—"}<span className="text-lg opacity-70">/100</span></p>
        </div>
        <div className="bg-white dark:bg-gray-950/50 p-5 rounded-2xl border border-slate-200 dark:border-gray-800 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-gray-400">Avg Duration</p>
            <p className="text-xl font-bold">{avgDuration ?? "—"} hrs</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-950/50 p-5 rounded-2xl border border-slate-200 dark:border-gray-800 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-gray-400">Avg Quality</p>
            <p className="text-xl font-bold">{avgQuality ?? "—"}/5</p>
          </div>
        </div>
      </div>

      {showAdd && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-white dark:bg-gray-950/50 p-6 rounded-2xl border border-slate-200 dark:border-gray-800">
          <h3 className="font-bold mb-4">Log Last Night's Sleep</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2 mb-2">
                <Moon className="w-4 h-4 text-indigo-500" /> Bedtime
              </label>
              <input type="time" value={form.bedtime} onChange={(e) => setForm({ ...form, bedtime: e.target.value })} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 focus:border-indigo-500 focus:ring-0" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2 mb-2">
                <Sun className="w-4 h-4 text-amber-500" /> Wake Time
              </label>
              <input type="time" value={form.wakeTime} onChange={(e) => setForm({ ...form, wakeTime: e.target.value })} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 focus:border-indigo-500 focus:ring-0" />
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 block">Sleep Quality</label>
            <div className="flex gap-3">
              {SLEEP_QUALITY.map((q) => (
                <button key={q.score} onClick={() => setForm({ ...form, quality: q.score })} className={`flex-1 p-3 rounded-xl border text-center transition-all ${form.quality === q.score ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" : "border-slate-200 dark:border-gray-700 hover:border-slate-300"}`}>
                  <span className="text-2xl block">{q.emoji}</span>
                  <span className="text-xs font-medium text-slate-500 mt-1 block">{q.label}</span>
                </button>
              ))}
            </div>
          </div>
          <input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes (e.g., had coffee late, felt rested...)" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 focus:border-indigo-500 focus:ring-0 mb-4" />
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-slate-500 hover:text-slate-700">Cancel</button>
            <button onClick={logSleep} className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all">Save</button>
          </div>
        </motion.div>
      )}

      {chartData.some((d) => d.hours > 0) && (
        <div className="bg-white dark:bg-gray-950/50 p-6 rounded-2xl border border-slate-200 dark:border-gray-800">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" /> Sleep Duration (7 Days)
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} unit="h" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    const quality = SLEEP_QUALITY.find((q) => q.score === d.quality);
                    return (
                      <div className="bg-white dark:bg-gray-900 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-gray-700">
                        <p className="font-bold">{d.hours} hours</p>
                        {quality && <p className="text-xs text-slate-500">{quality.emoji} {quality.label}</p>}
                      </div>
                    );
                  }}
                />
                <Bar dataKey="hours" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {sleepLogs.slice(0, 10).map((log) => (
          <div key={log.id} className="bg-white dark:bg-gray-950/50 p-4 rounded-xl border border-slate-200 dark:border-gray-800 flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-lg">
              {SLEEP_QUALITY.find((q) => q.score === log.quality)?.emoji}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{format(new Date(log.date), "MMM d, yyyy")}</p>
              <p className="text-xs text-slate-500 dark:text-gray-400">{log.bedtime} → {log.wakeTime} • {log.duration}h</p>
            </div>
            {log.notes && <p className="text-xs text-slate-400 italic max-w-[200px] truncate">{log.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
