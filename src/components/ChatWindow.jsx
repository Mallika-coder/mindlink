import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { X, Send, Bot, User, Sparkles } from "lucide-react";

const SYSTEM_CONTEXT = `You are MindLink AI, a compassionate mental health companion for college students. You use evidence-based CBT (Cognitive Behavioral Therapy) techniques. Your approach:
1. Validate feelings first before offering advice
2. Help identify cognitive distortions (catastrophizing, all-or-nothing thinking, etc.)
3. Guide users to reframe negative thoughts
4. Suggest actionable coping strategies
5. Know when to recommend professional help
Keep responses concise (2-3 sentences), warm, and empathetic. Never diagnose or prescribe medication.`;

const QUICK_PROMPTS = [
  "I'm feeling anxious about exams",
  "I can't stop procrastinating",
  "I feel lonely and disconnected",
  "Help me reframe a negative thought",
];

function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hey there! I'm your AI wellness companion, trained in CBT techniques. Whether you're stressed, anxious, or just need someone to talk to — I'm here. What's on your mind?" }
  ]);
  const [chatDraft, setChatDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const LLM_API = "https://backend.buildpicoapps.com/aero/run/llm-api?pk=v1-Z0FBQUFBQm81Qnd5eHIwYkVfbkEwcGJOX21LYmpSU2tpWnlTYmlNYW9IWGluZE5TWEFKc2sxUTdQWFZrQldMVVVmSDJyQ3pWMEdFbFBxbkVleF9VMTR5ZDgzQVpTbmVrZ3c9PQ==";

  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  async function getAIResponse(message) {
    const contextualPrompt = `${SYSTEM_CONTEXT}\n\nUser: ${message}\n\nRespond with empathy and CBT-based guidance:`;
    const res = await axios.post(LLM_API, { prompt: contextualPrompt }, { headers: { "Content-Type": "application/json" } });
    return res.data?.text || "I'm having trouble connecting right now. Please try again in a moment.";
  }

  const sendChat = async (text) => {
    const userText = (text || chatDraft).trim();
    if (!userText || isLoading) return;
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setChatDraft("");
    setIsLoading(true);
    try {
      const aiText = await getAIResponse(userText);
      setMessages((prev) => [...prev, { role: "ai", text: aiText }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "I'm having trouble connecting. Take a deep breath — I'll be back shortly." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.95 }}
      className="fixed bottom-24 right-6 w-full max-w-sm h-[75vh] bg-white dark:bg-gray-950 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col z-50 overflow-hidden"
    >
      <div className="p-4 border-b border-slate-100 dark:border-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm">MindLink AI</h3>
            <p className="text-xs text-white/70">CBT-based companion</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex items-end gap-2 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === "user" ? "bg-indigo-100 dark:bg-indigo-900/30" : "bg-purple-100 dark:bg-purple-900/30"}`}>
                {m.role === "user" ? <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> : <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
              </div>
              <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? "bg-indigo-600 text-white rounded-br-sm" : "bg-slate-100 dark:bg-gray-800 text-slate-800 dark:text-slate-200 rounded-bl-sm"}`}>
                {m.text}
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="px-4 py-3 bg-slate-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-slate-400 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((prompt) => (
              <button key={prompt} onClick={() => sendChat(prompt)} className="px-3 py-1.5 bg-slate-100 dark:bg-gray-800 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-300 transition-all">
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-3 border-t border-slate-100 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="flex gap-2">
          <input
            value={chatDraft}
            onChange={(e) => setChatDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendChat()}
            placeholder="Type your thoughts..."
            className="flex-1 px-4 py-2.5 rounded-full bg-slate-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <button onClick={() => sendChat()} disabled={!chatDraft.trim() || isLoading} className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/20">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default ChatWindow;
