import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Coffee, Brain, Zap } from "lucide-react";
import { format } from "date-fns";
import { useLocalState } from "../hooks/useLocalState";
import { AMBIENT_SOUNDS } from "../utils/wellness";

const MODES = [
  { id: "focus", label: "Focus", duration: 25 * 60, icon: Brain, color: "indigo" },
  { id: "short", label: "Short Break", duration: 5 * 60, icon: Coffee, color: "green" },
  { id: "long", label: "Long Break", duration: 15 * 60, icon: Zap, color: "purple" },
];

export default function FocusTimer() {
  const [mode, setMode] = useState(MODES[0]);
  const [timeLeft, setTimeLeft] = useState(MODES[0].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useLocalState("mlk-focus-sessions", []);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [activeSound, setActiveSound] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);
  const intervalRef = useRef(null);

  const createNoiseBuffer = (ctx, seconds = 2) => {
    const bufferSize = ctx.sampleRate * seconds;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  };

  const buildRain = (ctx, masterGain) => {
    const noise = ctx.createBufferSource();
    noise.buffer = createNoiseBuffer(ctx, 4);
    noise.loop = true;
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(1200, ctx.currentTime);
    bandpass.Q.setValueAtTime(0.5, ctx.currentTime);
    const highpass = ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.setValueAtTime(400, ctx.currentTime);
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.15, ctx.currentTime);
    lfoGain.gain.setValueAtTime(300, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(bandpass.frequency);
    lfo.start();
    noise.connect(bandpass);
    bandpass.connect(highpass);
    highpass.connect(masterGain);
    noise.start();
    return [noise, lfo];
  };

  const buildOcean = (ctx, masterGain) => {
    const noise = ctx.createBufferSource();
    noise.buffer = createNoiseBuffer(ctx, 4);
    noise.loop = true;
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(600, ctx.currentTime);
    lowpass.Q.setValueAtTime(1, ctx.currentTime);
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.08, ctx.currentTime);
    lfoGain.gain.setValueAtTime(400, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(lowpass.frequency);
    lfo.start();
    const volumeLfo = ctx.createOscillator();
    const volumeLfoGain = ctx.createGain();
    volumeLfo.frequency.setValueAtTime(0.08, ctx.currentTime);
    volumeLfoGain.gain.setValueAtTime(0.4, ctx.currentTime);
    const waveGain = ctx.createGain();
    waveGain.gain.setValueAtTime(0.6, ctx.currentTime);
    volumeLfo.connect(volumeLfoGain);
    volumeLfoGain.connect(waveGain.gain);
    volumeLfo.start();
    noise.connect(lowpass);
    lowpass.connect(waveGain);
    waveGain.connect(masterGain);
    noise.start();
    return [noise, lfo, volumeLfo];
  };

  const buildForest = (ctx, masterGain) => {
    const noise = ctx.createBufferSource();
    noise.buffer = createNoiseBuffer(ctx, 4);
    noise.loop = true;
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(3000, ctx.currentTime);
    bandpass.Q.setValueAtTime(2, ctx.currentTime);
    const rustleGain = ctx.createGain();
    rustleGain.gain.setValueAtTime(0.3, ctx.currentTime);
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.3, ctx.currentTime);
    lfoGain.gain.setValueAtTime(0.25, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(rustleGain.gain);
    lfo.start();
    noise.connect(bandpass);
    bandpass.connect(rustleGain);
    rustleGain.connect(masterGain);
    noise.start();
    const chirpInterval = setInterval(() => {
      if (!audioContextRef.current) { clearInterval(chirpInterval); return; }
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      const baseFreq = 2000 + Math.random() * 2500;
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.3, ctx.currentTime + 0.05);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, ctx.currentTime + 0.1);
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(g);
      g.connect(masterGain);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    }, 800 + Math.random() * 2000);
    return [noise, lfo, { stop: () => clearInterval(chirpInterval) }];
  };

  const buildFire = (ctx, masterGain) => {
    const noise = ctx.createBufferSource();
    noise.buffer = createNoiseBuffer(ctx, 4);
    noise.loop = true;
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(200, ctx.currentTime);
    const baseGain = ctx.createGain();
    baseGain.gain.setValueAtTime(0.5, ctx.currentTime);
    noise.connect(lowpass);
    lowpass.connect(baseGain);
    baseGain.connect(masterGain);
    noise.start();
    const crackleInterval = setInterval(() => {
      if (!audioContextRef.current) { clearInterval(crackleInterval); return; }
      const numPops = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < numPops; i++) {
        const delay = Math.random() * 0.1;
        const pop = ctx.createBufferSource();
        const popBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.03, ctx.sampleRate);
        const popData = popBuffer.getChannelData(0);
        for (let j = 0; j < popData.length; j++) {
          popData[j] = (Math.random() * 2 - 1) * Math.exp(-j / (popData.length * 0.2));
        }
        pop.buffer = popBuffer;
        const popFilter = ctx.createBiquadFilter();
        popFilter.type = "highpass";
        popFilter.frequency.setValueAtTime(1000 + Math.random() * 3000, ctx.currentTime);
        const popGain = ctx.createGain();
        popGain.gain.setValueAtTime(0.15 + Math.random() * 0.15, ctx.currentTime + delay);
        pop.connect(popFilter);
        popFilter.connect(popGain);
        popGain.connect(masterGain);
        pop.start(ctx.currentTime + delay);
      }
    }, 150 + Math.random() * 250);
    return [noise, { stop: () => clearInterval(crackleInterval) }];
  };

  const buildWind = (ctx, masterGain) => {
    const noise = ctx.createBufferSource();
    noise.buffer = createNoiseBuffer(ctx, 4);
    noise.loop = true;
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(500, ctx.currentTime);
    bandpass.Q.setValueAtTime(0.7, ctx.currentTime);
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.05, ctx.currentTime);
    lfoGain.gain.setValueAtTime(400, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(bandpass.frequency);
    lfo.start();
    const volLfo = ctx.createOscillator();
    const volLfoGain = ctx.createGain();
    volLfo.frequency.setValueAtTime(0.12, ctx.currentTime);
    volLfoGain.gain.setValueAtTime(0.3, ctx.currentTime);
    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.7, ctx.currentTime);
    volLfo.connect(volLfoGain);
    volLfoGain.connect(windGain.gain);
    volLfo.start();
    noise.connect(bandpass);
    bandpass.connect(windGain);
    windGain.connect(masterGain);
    noise.start();
    return [noise, lfo, volLfo];
  };

  const buildBirds = (ctx, masterGain) => {
    const noise = ctx.createBufferSource();
    noise.buffer = createNoiseBuffer(ctx, 4);
    noise.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(2500, ctx.currentTime);
    bp.Q.setValueAtTime(3, ctx.currentTime);
    const ambGain = ctx.createGain();
    ambGain.gain.setValueAtTime(0.08, ctx.currentTime);
    noise.connect(bp);
    bp.connect(ambGain);
    ambGain.connect(masterGain);
    noise.start();
    const songInterval = setInterval(() => {
      if (!audioContextRef.current) { clearInterval(songInterval); return; }
      const noteCount = 3 + Math.floor(Math.random() * 5);
      const baseFreq = 1800 + Math.random() * 2000;
      for (let i = 0; i < noteCount; i++) {
        const t = ctx.currentTime + i * (0.08 + Math.random() * 0.06);
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        const freq = baseFreq * (1 + (Math.random() - 0.5) * 0.4);
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * (0.8 + Math.random() * 0.4), t + 0.06);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.08, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(t);
        osc.stop(t + 0.1);
      }
    }, 1500 + Math.random() * 3000);
    return [noise, { stop: () => clearInterval(songInterval) }];
  };

  const soundNodesRef = useRef([]);

  const startSound = useCallback((sound) => {
    stopSound();
    if (!sound) { setActiveSound(null); return; }

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(isMuted ? 0 : volume * 0.8, ctx.currentTime);
    masterGain.connect(ctx.destination);
    gainNodeRef.current = masterGain;

    let nodes = [];
    switch (sound.id) {
      case "rain": nodes = buildRain(ctx, masterGain); break;
      case "ocean": nodes = buildOcean(ctx, masterGain); break;
      case "forest": nodes = buildForest(ctx, masterGain); break;
      case "fire": nodes = buildFire(ctx, masterGain); break;
      case "wind": nodes = buildWind(ctx, masterGain); break;
      case "birds": nodes = buildBirds(ctx, masterGain); break;
      default: nodes = buildRain(ctx, masterGain);
    }
    soundNodesRef.current = nodes;
    setActiveSound(sound);
  }, [volume, isMuted]);

  const stopSound = useCallback(() => {
    soundNodesRef.current.forEach((node) => {
      try { if (node && node.stop) node.stop(); } catch (e) {}
    });
    soundNodesRef.current = [];
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    gainNodeRef.current = null;
  }, []);

  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(isMuted ? 0 : volume * 0.8, audioContextRef.current.currentTime);
    }
  }, [volume, isMuted]);

  useEffect(() => {
    return () => stopSound();
  }, [stopSound]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (mode.id === "focus") {
        setCompletedPomodoros((prev) => prev + 1);
        const session = { date: format(new Date(), "yyyy-MM-dd"), duration: mode.duration, completedAt: new Date().toISOString() };
        setSessions((prev) => [...prev, session]);
      }
      playCompletionSound();
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, mode]);

  const playCompletionSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.15);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {}
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(newMode.duration);
    setIsRunning(false);
  };

  const resetTimer = () => {
    setTimeLeft(mode.duration);
    setIsRunning(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = 1 - timeLeft / mode.duration;
  const circumference = 2 * Math.PI * 120;

  const todaySessions = sessions.filter((s) => s.date === format(new Date(), "yyyy-MM-dd"));
  const todayMinutes = Math.round(todaySessions.reduce((sum, s) => sum + s.duration, 0) / 60);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Focus Timer</h2>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Pomodoro technique with ambient soundscapes for deep work.</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 rounded-full font-semibold">
            {completedPomodoros} pomodoros today
          </span>
          <span className="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300 rounded-full font-semibold">
            {todayMinutes} min focused
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-950/50 p-8 rounded-2xl border border-slate-200 dark:border-gray-800 flex flex-col items-center">
          <div className="flex gap-2 mb-8">
            {MODES.map((m) => (
              <button key={m.id} onClick={() => switchMode(m)} className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${mode.id === m.id ? `bg-${m.color}-500 text-white shadow-lg` : "bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"}`}>
                <m.icon className="w-4 h-4" /> {m.label}
              </button>
            ))}
          </div>

          <div className="relative w-64 h-64 mb-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260">
              <circle cx="130" cy="130" r="120" fill="none" stroke="currentColor" className="text-slate-100 dark:text-gray-800" strokeWidth="8" />
              <circle cx="130" cy="130" r="120" fill="none" stroke="currentColor" className={`text-${mode.color}-500`} strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress)} style={{ transition: "stroke-dashoffset 1s linear" }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-5xl font-mono font-bold tracking-wider text-slate-800 dark:text-white">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </p>
              <p className="text-sm text-slate-400 mt-2 capitalize">{mode.label}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={() => setIsRunning(!isRunning)} className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl transition-all hover:scale-105 active:scale-95 ${isRunning ? "bg-orange-500 shadow-orange-500/30" : "bg-indigo-600 shadow-indigo-600/30"}`}>
              {isRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
            </button>
            <button onClick={resetTimer} className="w-16 h-16 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-gray-700 transition-all">
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950/50 p-6 rounded-2xl border border-slate-200 dark:border-gray-800">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            {isMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-indigo-500" />}
            Ambient Sounds
          </h3>
          <div className="space-y-2 mb-6">
            {AMBIENT_SOUNDS.map((sound) => (
              <button
                key={sound.id}
                onClick={() => activeSound?.id === sound.id ? (stopSound(), setActiveSound(null)) : startSound(sound)}
                className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all ${activeSound?.id === sound.id ? "bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800" : "hover:bg-slate-50 dark:hover:bg-gray-800 border border-transparent"}`}
              >
                <span className="text-xl">{sound.icon}</span>
                <span className="font-medium text-sm">{sound.label}</span>
                {activeSound?.id === sound.id && (
                  <div className="ml-auto flex gap-0.5">
                    {[1, 2, 3].map((i) => (
                      <motion.div key={i} className="w-1 bg-indigo-500 rounded-full" animate={{ height: [8, 16, 8] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }} />
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Volume</span>
              <button onClick={() => setIsMuted(!isMuted)} className="text-xs text-indigo-500 font-semibold">
                {isMuted ? "Unmute" : "Mute"}
              </button>
            </div>
            <input type="range" min="0" max="1" step="0.1" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-indigo-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
