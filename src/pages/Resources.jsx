import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Play, Headphones, X, Search, ExternalLink } from "lucide-react";

const RESOURCES = [
  { id: "r1", kind: "video", title: "How to Manage Stress", length: "7 min", category: "stress", src: "https://www.youtube.com/embed/bsaOBWUqdCU", thumbnail: "🧘" },
  { id: "r2", kind: "video", title: "How to Overcome Laziness", length: "6 min", category: "productivity", src: "https://www.youtube.com/embed/9DbvSl_C_kY", thumbnail: "💪" },
  { id: "r3", kind: "video", title: "How to Stop Procrastinating", length: "15 min", category: "productivity", src: "https://www.youtube.com/embed/ctyqx6trUmo", thumbnail: "⏰" },
  { id: "r4", kind: "article", title: "Sleep Hygiene for Students", length: "4 min read", category: "sleep", content: "Getting quality sleep is crucial for academic success and mental health. Here are evidence-based strategies:\n\n1. **Consistent Schedule**: Go to bed and wake up at the same time daily, even on weekends. This regulates your circadian rhythm.\n\n2. **Wind-Down Routine**: Start dimming lights 1 hour before bed. Try reading, gentle stretching, or journaling instead of scrolling.\n\n3. **Optimize Your Environment**: Keep your room dark (use blackout curtains), quiet (try white noise), and cool (65-68°F/18-20°C).\n\n4. **Limit Stimulants**: No caffeine after 2 PM. Avoid heavy meals 2-3 hours before bed.\n\n5. **Screen Hygiene**: Enable blue light filters after sunset. Consider charging your phone outside the bedroom.\n\n6. **Exercise Timing**: Regular exercise improves sleep, but finish workouts 3+ hours before bed.\n\nRemember: Sleep debt accumulates. One bad night won't hurt, but chronic sleep deprivation affects mood, memory, and immune function.", thumbnail: "😴" },
  { id: "r5", kind: "article", title: "Understanding CBT Basics", length: "6 min read", category: "therapy", content: "Cognitive Behavioral Therapy (CBT) is one of the most effective, evidence-based approaches to mental health.\n\n**The Core Idea**: Your thoughts influence your feelings, which influence your behavior. By changing thought patterns, you can change how you feel.\n\n**The CBT Triangle**:\n- Thoughts → Feelings → Behaviors (and back again)\n- Example: 'I'll fail the exam' (thought) → anxiety (feeling) → avoid studying (behavior)\n\n**Key Techniques**:\n\n1. **Thought Records**: Write down situations, automatic thoughts, and evidence for/against them.\n\n2. **Cognitive Restructuring**: Challenge distorted thinking patterns (catastrophizing, all-or-nothing, mind-reading).\n\n3. **Behavioral Experiments**: Test your predictions. Often reality is less scary than imagination.\n\n4. **Graded Exposure**: Face fears in small, manageable steps.\n\n5. **Activity Scheduling**: Plan pleasurable and mastery activities to combat low mood.\n\n**Try This Now**: Use the CBT Reframe feature in the Journal section to practice thought restructuring with guided prompts.", thumbnail: "🧠" },
  { id: "r6", kind: "video", title: "5-Minute Meditation for Anxiety", length: "5 min", category: "mindfulness", src: "https://www.youtube.com/embed/z6X5oEIg6Ak", thumbnail: "🕊️" },
  { id: "r7", kind: "article", title: "Building Healthy Boundaries", length: "5 min read", category: "relationships", content: "Healthy boundaries are essential for mental wellness, especially in college.\n\n**What Are Boundaries?** Limits you set to protect your physical, emotional, and mental well-being.\n\n**Signs You Need Better Boundaries**:\n- Feeling resentful or drained after interactions\n- Saying yes when you want to say no\n- Feeling responsible for others' emotions\n- Neglecting your own needs\n\n**How to Set Boundaries**:\n\n1. **Identify Your Limits**: What drains you? What feels uncomfortable? Trust that feeling.\n\n2. **Communicate Clearly**: 'I can't help with that right now, but I hope it works out.' No lengthy justifications needed.\n\n3. **Start Small**: Practice with low-stakes situations before tackling harder ones.\n\n4. **Be Consistent**: Boundaries that fluctuate teach others they're negotiable.\n\n5. **Accept Discomfort**: Some people won't like your boundaries. That's okay and actually normal.\n\n**Remember**: Boundaries aren't walls—they're doors you control.", thumbnail: "🚪" },
  { id: "r8", kind: "video", title: "The Science of Habit Formation", length: "10 min", category: "productivity", src: "https://www.youtube.com/embed/75d_29QWELk", thumbnail: "🔄" },
];

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "stress", label: "Stress" },
  { id: "productivity", label: "Productivity" },
  { id: "sleep", label: "Sleep" },
  { id: "mindfulness", label: "Mindfulness" },
  { id: "therapy", label: "Therapy" },
  { id: "relationships", label: "Relationships" },
];

export default function Resources() {
  const [activeResource, setActiveResource] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = RESOURCES.filter((r) => {
    const matchesCategory = category === "all" || r.category === category;
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Resource Library</h2>
        <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Curated videos and articles on mental health, productivity, and self-care.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search resources..." className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 focus:border-indigo-500 focus:ring-0" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => setCategory(cat.id)} className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${category === cat.id ? "bg-indigo-500 text-white" : "bg-slate-100 dark:bg-gray-800 text-slate-500 hover:bg-slate-200"}`}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <motion.button key={r.id} whileHover={{ y: -4 }} onClick={() => setActiveResource(r)} className="text-left bg-white dark:bg-gray-950/50 rounded-xl border border-slate-200 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group">
            <div className="h-36 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center relative">
              <span className="text-5xl">{r.thumbnail}</span>
              {r.kind === "video" && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 text-indigo-600 ml-0.5" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold group-hover:text-indigo-500 transition-colors">{r.title}</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-gray-800 text-slate-500 rounded text-xs font-semibold capitalize">{r.kind}</span>
                <span className="text-xs text-slate-400">{r.length}</span>
                <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded text-xs font-semibold capitalize">{r.category}</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {activeResource && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setActiveResource(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-3xl relative overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
              <div className="p-5 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center flex-shrink-0">
                <div>
                  <h3 className="text-xl font-bold">{activeResource.title}</h3>
                  <p className="text-sm text-slate-500 capitalize mt-0.5">{activeResource.kind} • {activeResource.length} • {activeResource.category}</p>
                </div>
                <button onClick={() => setActiveResource(null)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                {activeResource.kind === "article" ? (
                  <div className="prose dark:prose-invert max-w-none">
                    {activeResource.content.split("\n\n").map((paragraph, i) => (
                      <p key={i} className="text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg bg-black">
                    <iframe src={activeResource.src} title={activeResource.title} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
