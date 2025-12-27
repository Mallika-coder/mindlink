// src/App.jsx -

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { X, Send, Image as ImageIcon } from "lucide-react";

function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi, I'm your empathetic AI companion 🌱 How are you feeling today?" }
  ]);
  const [chatDraft, setChatDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const LLM_API =
    "https://backend.buildpicoapps.com/aero/run/llm-api?pk=v1-Z0FBQUFBQm81Qnd5eHIwYkVfbkEwcGJOX21LYmpSU2tpWnlTYmlNYW9IWGluZE5TWEFKc2sxUTdQWFZrQldMVVVmSDJyQ3pWMEdFbFBxbkVleF9VMTR5ZDgzQVpTbmVrZ3c9PQ==";

  const IMAGE_API =
    "https://backend.buildpicoapps.com/aero/run/image-generation-api?pk=v1-Z0FBQUFBQm81QnhYQnhfTUhCSlVvMlV1dFg1WURLVTZBWmNtNHNTLVZKb0VnMk1tLTRTdVI1aXItNTl4alJvUDN5NXZVZUdCMnlpMG43MndlZnhqV3Q0UXVKMlRMQjEyYnc9PQ==";

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, isLoading]);

  async function getAIResponse(message) {
    const res = await axios.post(
      LLM_API,
      { prompt: message },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data?.text || "Something went wrong 😕";
  }

  async function generateImage(prompt) {
    const res = await axios.post(
      IMAGE_API,
      { prompt },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data?.imageUrl;
  }

  const sendChat = async () => {
    if (!chatDraft.trim() || isLoading) return;

    const userText = chatDraft.trim();
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setChatDraft("");
    setIsLoading(true);

    try {
      const aiText = await getAIResponse(userText);
      setMessages(prev => [...prev, { role: "ai", text: aiText }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "ai", text: "Oops! Please try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageGenerate = async () => {
    if (!chatDraft.trim() || isLoading) return;

    const prompt = chatDraft.trim();
    setMessages(prev => [
      ...prev,
      { role: "user", text: `Generate image: ${prompt}` }
    ]);
    setChatDraft("");
    setIsLoading(true);

    try {
      const imageUrl = await generateImage(prompt);
      if (imageUrl) {
        setMessages(prev => [
          ...prev,
          { role: "image", url: imageUrl }
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="fixed bottom-24 right-6 w-full max-w-sm h-[70vh] bg-white dark:bg-gray-950/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 flex flex-col z-50"
    >
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-bold">AI Companion</h3>
        <button onClick={onClose}>
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Messages */}
      <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m, i) => {
          if (m.role === "image") {
            return (
              <img
                key={i}
                src={m.url}
                alt="Generated"
                className="rounded-xl max-w-full"
              />
            );
          }

          return (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                  m.role === "user"
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-slate-100 dark:bg-gray-800 rounded-bl-none"
                }`}
              >
                {m.text}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="text-sm text-gray-400 animate-pulse">
            AI is thinking...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2">
        <input
          value={chatDraft}
          onChange={e => setChatDraft(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-3 rounded-full bg-gray-100 dark:bg-gray-800 outline-none"
        />

        <button
          onClick={sendChat}
          className="w-11 h-11 bg-indigo-500 rounded-full flex items-center justify-center text-white"
        >
          <Send size={18} />
        </button>

        <button
          onClick={handleImageGenerate}
          className="w-11 h-11 bg-green-500 rounded-full flex items-center justify-center text-white"
        >
          <ImageIcon size={18} />
        </button>
      </div>
    </motion.div>
  );
}

export default ChatWindow;
