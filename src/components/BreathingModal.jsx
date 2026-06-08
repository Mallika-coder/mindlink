import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TECHNIQUES = [
  { id: "478", label: "4-7-8 Breathing", phases: [{ name: "Inhale", duration: 4 }, { name: "Hold", duration: 7 }, { name: "Exhale", duration: 8 }], description: "Navy SEAL technique for instant calm" },
  { id: "box", label: "Box Breathing", phases: [{ name: "Inhale", duration: 4 }, { name: "Hold", duration: 4 }, { name: "Exhale", duration: 4 }, { name: "Hold", duration: 4 }], description: "Equal-length pattern for focus" },
  { id: "calm", label: "Calming Breath", phases: [{ name: "Inhale", duration: 4 }, { name: "Exhale", duration: 6 }], description: "Extended exhale activates rest response" },
];

export default function BreathingModal({ onClose }) {
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0);
  const [totalCycles, setTotalCycles] = useState(0);
  const [instruction, setInstruction] = useState("");

  useEffect(() => {
    if (!isActive || !selectedTechnique) return;

    const phase = selectedTechnique.phases[currentPhase];
    setInstruction(phase.name);
    setPhaseTimeLeft(phase.duration);

    const interval = setInterval(() => {
      setPhaseTimeLeft((prev) => {
        if (prev <= 1) {
          const nextPhase = (currentPhase + 1) % selectedTechnique.phases.length;
          if (nextPhase === 0) setTotalCycles((c) => c + 1);
          setCurrentPhase(nextPhase);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, currentPhase, selectedTechnique]);

  const start = (technique) => {
    setSelectedTechnique(technique);
    setIsActive(true);
    setCurrentPhase(0);
    setTotalCycles(0);
  };

  const getScale = () => {
    if (!selectedTechnique) return 1;
    const phase = selectedTechnique.phases[currentPhase];
    if (phase.name === "Inhale") return 1.4;
    if (phase.name === "Exhale") return 0.8;
    return 1.1;
  };

  if (!isActive) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-center mb-2">Breathing Exercise</h2>
          <p className="text-center text-slate-500 dark:text-gray-400 mb-6 text-sm">Choose a technique that suits your needs.</p>
          <div className="space-y-3">
            {TECHNIQUES.map((t) => (
              <button key={t.id} onClick={() => start(t)} className="w-full p-4 rounded-xl border border-slate-200 dark:border-gray-700 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all text-left">
                <h3 className="font-bold">{t.label}</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-0.5">{t.description}</p>
                <div className="flex gap-2 mt-2">
                  {t.phases.map((p, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-gray-800 rounded-full text-slate-500">{p.name} {p.duration}s</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
          <button onClick={onClose} className="w-full mt-4 py-3 text-slate-500 hover:text-slate-700 text-sm font-medium">Cancel</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-black flex items-center justify-center z-50">
      <div className="text-center text-white">
        <motion.div
          className="w-56 h-56 rounded-full border-4 border-white/20 flex items-center justify-center mx-auto mb-8 bg-white/5 backdrop-blur-sm"
          animate={{ scale: getScale() }}
          transition={{ duration: selectedTechnique.phases[currentPhase].duration, ease: "easeInOut" }}
        >
          <div>
            <p className="text-3xl font-bold">{instruction}</p>
            <p className="text-5xl font-mono mt-2 opacity-80">{phaseTimeLeft}</p>
          </div>
        </motion.div>

        <div className="flex justify-center gap-2 mb-6">
          {selectedTechnique.phases.map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full transition-all ${i === currentPhase ? "bg-white scale-125" : "bg-white/30"}`} />
          ))}
        </div>

        <p className="text-white/60 text-sm mb-8">Cycles completed: {totalCycles}</p>

        <button onClick={onClose} className="px-8 py-3 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-all text-sm font-semibold uppercase tracking-wider">
          End Session
        </button>
      </div>
    </div>
  );
}
