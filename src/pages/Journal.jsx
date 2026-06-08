import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PenLine, Sparkles, ChevronDown, Trash2, Calendar, Tag } from "lucide-react";
import { format, subDays } from "date-fns";
import { useLocalState } from "../hooks/useLocalState";
import { CBT_DISTORTIONS } from "../utils/wellness";

const PROMPTS = [
  "What's one thing that went well today?",
  "What's something that's been weighing on your mind?",
  "Describe a moment today when you felt at peace.",
  "What would you tell your best friend if they were feeling like you?",
  "What's one small thing you can do tomorrow to take care of yourself?",
  "Write about a challenge you overcame recently.",
  "What are three things you're grateful for right now?",
  "If your mood right now was a weather, what would it be and why?",
];

export default function Journal() {
  const [entries, setEntries] = useLocalState("mlk-journal", []);
  const [isWriting, setIsWriting] = useState(false);
  const [text, setText] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [cbtMode, setCbtMode] = useState(false);
  const [cbtStep, setCbtStep] = useState(0);
  const [cbtData, setCbtData] = useState({ situation: "", thought: "", distortion: null, reframe: "" });
  const [prompt, setPrompt] = useState("");
  const [filterTag, setFilterTag] = useState(null);

  const tags = ["gratitude", "anxiety", "reflection", "goal", "vent", "growth"];

  const filteredEntries = useMemo(() => {
    if (!filterTag) return entries;
    return entries.filter((e) => e.tags?.includes(filterTag));
  }, [entries, filterTag]);

  const generatePrompt = () => {
    const randomPrompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    setPrompt(randomPrompt);
  };

  const saveEntry = () => {
    if (!text.trim() && !cbtData.situation) return;
    const entry = {
      id: Date.now(),
      date: format(new Date(), "yyyy-MM-dd"),
      time: format(new Date(), "HH:mm"),
      text: text.trim(),
      tags: selectedTags,
      type: cbtMode ? "cbt" : "freeform",
      cbt: cbtMode ? { ...cbtData } : null,
    };
    setEntries((prev) => [entry, ...prev]);
    resetForm();
  };

  const saveCbtEntry = () => {
    const entry = {
      id: Date.now(),
      date: format(new Date(), "yyyy-MM-dd"),
      time: format(new Date(), "HH:mm"),
      text: `Thought: ${cbtData.thought}\nReframe: ${cbtData.reframe}`,
      tags: ["cbt-exercise"],
      type: "cbt",
      cbt: { ...cbtData },
    };
    setEntries((prev) => [entry, ...prev]);
    resetForm();
  };

  const resetForm = () => {
    setText("");
    setSelectedTags([]);
    setCbtMode(false);
    setCbtStep(0);
    setCbtData({ situation: "", thought: "", distortion: null, reframe: "" });
    setIsWriting(false);
    setPrompt("");
  };

  const deleteEntry = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Thought Journal</h2>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Write freely or use CBT-guided reflection to reframe negative thoughts.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setIsWriting(true); setCbtMode(false); }} className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2">
            <PenLine className="w-4 h-4" /> Free Write
          </button>
          <button onClick={() => { setIsWriting(true); setCbtMode(true); setCbtStep(0); }} className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-600/20 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> CBT Reframe
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isWriting && !cbtMode && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white dark:bg-gray-950/50 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800">
            {prompt && (
              <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-700 dark:text-indigo-300 text-sm italic">
                💡 {prompt}
              </div>
            )}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind..."
              className="w-full h-40 p-4 rounded-xl bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 resize-none focus:border-indigo-500 focus:ring-0 text-lg"
              autoFocus
            />
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {tags.map((tag) => (
                  <button key={tag} onClick={() => setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag])} className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${selectedTags.includes(tag) ? "bg-indigo-500 text-white" : "bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-700"}`}>
                    #{tag}
                  </button>
                ))}
              </div>
              <button onClick={generatePrompt} className="text-xs text-indigo-500 hover:text-indigo-600 font-semibold">Need a prompt?</button>
            </div>
            <div className="mt-4 flex gap-3 justify-end">
              <button onClick={resetForm} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={saveEntry} disabled={!text.trim()} className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">Save Entry</button>
            </div>
          </motion.div>
        )}

        {isWriting && cbtMode && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white dark:bg-gray-950/50 p-6 rounded-2xl shadow-sm border border-purple-200 dark:border-purple-800">
            <div className="flex gap-2 mb-6">
              {["Situation", "Thought", "Distortion", "Reframe"].map((s, i) => (
                <div key={s} className={`flex-1 h-2 rounded-full ${i <= cbtStep ? "bg-purple-500" : "bg-slate-200 dark:bg-gray-700"}`} />
              ))}
            </div>

            {cbtStep === 0 && (
              <div>
                <h3 className="font-bold text-lg mb-2">What happened?</h3>
                <p className="text-sm text-slate-500 mb-4">Describe the situation that triggered the negative thought.</p>
                <textarea value={cbtData.situation} onChange={(e) => setCbtData({ ...cbtData, situation: e.target.value })} placeholder="e.g., I got a lower grade than expected on my exam..." className="w-full h-28 p-4 rounded-xl bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 resize-none focus:border-purple-500 focus:ring-0" autoFocus />
                <div className="mt-4 flex justify-end">
                  <button onClick={() => setCbtStep(1)} disabled={!cbtData.situation.trim()} className="px-5 py-2.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 transition-all">Next →</button>
                </div>
              </div>
            )}

            {cbtStep === 1 && (
              <div>
                <h3 className="font-bold text-lg mb-2">What thought came up?</h3>
                <p className="text-sm text-slate-500 mb-4">Write the automatic negative thought that followed.</p>
                <textarea value={cbtData.thought} onChange={(e) => setCbtData({ ...cbtData, thought: e.target.value })} placeholder="e.g., I'm such a failure, I'll never succeed..." className="w-full h-28 p-4 rounded-xl bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 resize-none focus:border-purple-500 focus:ring-0" autoFocus />
                <div className="mt-4 flex justify-between">
                  <button onClick={() => setCbtStep(0)} className="text-sm text-slate-500 hover:text-slate-700">← Back</button>
                  <button onClick={() => setCbtStep(2)} disabled={!cbtData.thought.trim()} className="px-5 py-2.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 transition-all">Next →</button>
                </div>
              </div>
            )}

            {cbtStep === 2 && (
              <div>
                <h3 className="font-bold text-lg mb-2">Identify the thinking pattern</h3>
                <p className="text-sm text-slate-500 mb-4">Which cognitive distortion does this thought match?</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {CBT_DISTORTIONS.map((d) => (
                    <button key={d.id} onClick={() => { setCbtData({ ...cbtData, distortion: d }); setCbtStep(3); }} className={`p-3 rounded-lg border text-left transition-all ${cbtData.distortion?.id === d.id ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30" : "border-slate-200 dark:border-gray-700 hover:border-purple-300"}`}>
                      <p className="font-semibold text-sm">{d.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{d.description}</p>
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  <button onClick={() => setCbtStep(1)} className="text-sm text-slate-500 hover:text-slate-700">← Back</button>
                </div>
              </div>
            )}

            {cbtStep === 3 && (
              <div>
                <h3 className="font-bold text-lg mb-2">Reframe the thought</h3>
                <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">💡 {cbtData.distortion?.reframe}</p>
                </div>
                <textarea value={cbtData.reframe} onChange={(e) => setCbtData({ ...cbtData, reframe: e.target.value })} placeholder="Write a more balanced, realistic thought..." className="w-full h-28 p-4 rounded-xl bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 resize-none focus:border-purple-500 focus:ring-0" autoFocus />
                <div className="mt-4 flex justify-between">
                  <button onClick={() => setCbtStep(2)} className="text-sm text-slate-500 hover:text-slate-700">← Back</button>
                  <button onClick={saveCbtEntry} disabled={!cbtData.reframe.trim()} className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all">Save Reframe</button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilterTag(null)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${!filterTag ? "bg-indigo-500 text-white" : "bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300"}`}>All</button>
        {[...tags, "cbt-exercise"].map((tag) => (
          <button key={tag} onClick={() => setFilterTag(tag)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filterTag === tag ? "bg-indigo-500 text-white" : "bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-700"}`}>
            #{tag}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <PenLine className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No journal entries yet</p>
            <p className="text-sm mt-1">Start writing to track your thoughts and patterns.</p>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <motion.div key={entry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-950/50 p-5 rounded-xl border border-slate-200 dark:border-gray-800 group hover:shadow-sm transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="w-3 h-3" />
                  <span>{format(new Date(entry.date), "MMM d, yyyy")}</span>
                  <span>•</span>
                  <span>{entry.time}</span>
                  {entry.type === "cbt" && <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-full font-semibold">CBT</span>}
                </div>
                <button onClick={() => deleteEntry(entry.id)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {entry.type === "cbt" && entry.cbt ? (
                <div className="mt-3 space-y-2">
                  <p className="text-sm"><span className="font-semibold text-slate-500">Situation:</span> {entry.cbt.situation}</p>
                  <p className="text-sm"><span className="font-semibold text-red-400">Thought:</span> {entry.cbt.thought}</p>
                  <p className="text-sm"><span className="font-semibold text-purple-500">Pattern:</span> {entry.cbt.distortion?.label}</p>
                  <p className="text-sm"><span className="font-semibold text-green-500">Reframe:</span> {entry.cbt.reframe}</p>
                </div>
              ) : (
                <p className="mt-3 text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{entry.text}</p>
              )}
              {entry.tags?.length > 0 && (
                <div className="mt-3 flex gap-1.5">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-slate-400 rounded-full text-xs">#{tag}</span>
                  ))}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
