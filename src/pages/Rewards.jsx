import { useMemo } from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Flame, BookOpen, Heart, Target, Brain, Moon, Zap } from "lucide-react";
import { useLocalState } from "../hooks/useLocalState";
import { calculateStreak } from "../utils/wellness";

const BADGE_DEFINITIONS = [
  { id: "streak3", label: "Consistent", description: "3-day mood check-in streak", icon: Flame, tier: "bronze", check: (data) => calculateStreak(data.moods) >= 3 },
  { id: "streak7", label: "Dedicated", description: "7-day mood check-in streak", icon: Flame, tier: "silver", check: (data) => calculateStreak(data.moods) >= 7 },
  { id: "streak30", label: "Unstoppable", description: "30-day mood check-in streak", icon: Flame, tier: "gold", check: (data) => calculateStreak(data.moods) >= 30 },
  { id: "journal5", label: "Reflective", description: "Write 5 journal entries", icon: BookOpen, tier: "bronze", check: (data) => data.journal.length >= 5 },
  { id: "journal25", label: "Deep Thinker", description: "Write 25 journal entries", icon: BookOpen, tier: "silver", check: (data) => data.journal.length >= 25 },
  { id: "cbt3", label: "Thought Reframer", description: "Complete 3 CBT exercises", icon: Brain, tier: "bronze", check: (data) => data.journal.filter((j) => j.type === "cbt").length >= 3 },
  { id: "cbt10", label: "CBT Master", description: "Complete 10 CBT exercises", icon: Brain, tier: "gold", check: (data) => data.journal.filter((j) => j.type === "cbt").length >= 10 },
  { id: "habits3", label: "Habit Builder", description: "Create 3 habits", icon: Target, tier: "bronze", check: (data) => data.habits.length >= 3 },
  { id: "focus5", label: "Deep Worker", description: "Complete 5 focus sessions", icon: Zap, tier: "bronze", check: (data) => data.focusSessions.length >= 5 },
  { id: "focus25", label: "Flow State", description: "Complete 25 focus sessions", icon: Zap, tier: "silver", check: (data) => data.focusSessions.length >= 25 },
  { id: "sleep7", label: "Sleep Tracker", description: "Log sleep 7 days", icon: Moon, tier: "bronze", check: (data) => data.sleepLogs.length >= 7 },
  { id: "community5", label: "Supportive Voice", description: "Make 5 community posts", icon: Heart, tier: "bronze", check: (data) => data.posts.filter((p) => p.handle === data.profile.anonymousHandle).length >= 5 },
];

const TIER_COLORS = {
  bronze: { bg: "bg-amber-100 dark:bg-amber-900/30", border: "border-amber-300 dark:border-amber-700", text: "text-amber-700 dark:text-amber-300", glow: "shadow-amber-200/50" },
  silver: { bg: "bg-slate-100 dark:bg-slate-800/50", border: "border-slate-300 dark:border-slate-600", text: "text-slate-700 dark:text-slate-200", glow: "shadow-slate-200/50" },
  gold: { bg: "bg-yellow-50 dark:bg-yellow-900/20", border: "border-yellow-400 dark:border-yellow-600", text: "text-yellow-700 dark:text-yellow-300", glow: "shadow-yellow-200/50" },
};

export default function Rewards() {
  const [moods] = useLocalState("mlk-moods", []);
  const [journal] = useLocalState("mlk-journal", []);
  const [habits] = useLocalState("mlk-habits", []);
  const [focusSessions] = useLocalState("mlk-focus-sessions", []);
  const [sleepLogs] = useLocalState("mlk-sleep", []);
  const [posts] = useLocalState("mlk-posts", []);
  const [profile] = useLocalState("mlk-profile", { anonymousHandle: "@mango-owl" });

  const data = { moods, journal, habits, focusSessions, sleepLogs, posts, profile };

  const badges = useMemo(() => {
    return BADGE_DEFINITIONS.map((badge) => ({
      ...badge,
      unlocked: badge.check(data),
    }));
  }, [data]);

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const totalXP = unlockedCount * 100;
  const level = Math.floor(totalXP / 300) + 1;
  const xpInLevel = totalXP % 300;
  const xpForNext = 300;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Achievements & Progress</h2>
        <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Track your growth and unlock badges for consistent self-care.</p>
      </div>

      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 rounded-2xl text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-4 right-4 text-7xl opacity-10">🏆</div>
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium">Level {level} Wellness Warrior</p>
              <p className="text-3xl font-bold">{totalXP} XP</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-white/70 mb-1">
              <span>{xpInLevel} / {xpForNext} XP to next level</span>
              <span>Level {level + 1}</span>
            </div>
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(xpInLevel / xpForNext) * 100}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-white rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-950/50 p-5 rounded-2xl border border-slate-200 dark:border-gray-800 text-center">
          <Star className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{unlockedCount}/{badges.length}</p>
          <p className="text-sm text-slate-500">Badges Earned</p>
        </div>
        <div className="bg-white dark:bg-gray-950/50 p-5 rounded-2xl border border-slate-200 dark:border-gray-800 text-center">
          <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{calculateStreak(moods)}</p>
          <p className="text-sm text-slate-500">Day Streak</p>
        </div>
        <div className="bg-white dark:bg-gray-950/50 p-5 rounded-2xl border border-slate-200 dark:border-gray-800 text-center">
          <Target className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{level}</p>
          <p className="text-sm text-slate-500">Current Level</p>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-4">All Badges</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => {
            const colors = TIER_COLORS[badge.tier];
            return (
              <motion.div
                key={badge.id}
                whileHover={{ scale: badge.unlocked ? 1.02 : 1 }}
                className={`p-5 rounded-xl border-2 transition-all relative overflow-hidden ${badge.unlocked ? `${colors.bg} ${colors.border} shadow-lg ${colors.glow}` : "bg-slate-50 dark:bg-gray-900 border-slate-200 dark:border-gray-700 opacity-60"}`}
              >
                {badge.unlocked && (
                  <div className="absolute top-2 right-2">
                    <div className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${colors.text} ${colors.bg}`}>
                      {badge.tier}
                    </div>
                  </div>
                )}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${badge.unlocked ? `${colors.bg}` : "bg-slate-200 dark:bg-gray-800"}`}>
                  <badge.icon className={`w-6 h-6 ${badge.unlocked ? colors.text : "text-slate-400"}`} />
                </div>
                <h4 className={`font-bold ${badge.unlocked ? "text-slate-800 dark:text-white" : "text-slate-500"}`}>{badge.label}</h4>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">{badge.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
