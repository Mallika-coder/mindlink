import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, MessageSquare, Heart, Send, Filter, TrendingUp, Clock, Award } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useLocalState } from "../hooks/useLocalState";

const CATEGORIES = [
  { id: "all", label: "All", icon: null },
  { id: "support", label: "Support", icon: "💙" },
  { id: "wins", label: "Wins", icon: "🎉" },
  { id: "advice", label: "Advice", icon: "💡" },
  { id: "vent", label: "Vent", icon: "🌊" },
  { id: "study", label: "Study", icon: "📚" },
];

const INITIAL_POSTS = [
  { id: 1, handle: "@hopeful-sparrow", text: "Finished my project before the deadline for the first time! Small wins matter.", category: "wins", up: 24, hearts: 8, replies: [{ handle: "@calm-river", text: "That's amazing! Proud of you!", time: "2h ago" }], createdAt: Date.now() - 3600000 },
  { id: 2, handle: "@quiet-mountain", text: "Anyone else feel overwhelmed by finals? Would love study partners.", category: "study", up: 18, hearts: 5, replies: [{ handle: "@brave-fox", text: "Yes! Let's set up a virtual study room.", time: "1h ago" }], createdAt: Date.now() - 7200000 },
  { id: 3, handle: "@gentle-rain", text: "Remember: you don't have to be productive every single day. Rest is productive too.", category: "support", up: 42, hearts: 15, replies: [], createdAt: Date.now() - 10800000 },
  { id: 4, handle: "@bright-leaf", text: "The breathing exercise on this app actually helped during my panic attack. Thank you, community.", category: "support", up: 31, hearts: 12, replies: [{ handle: "@warm-sun", text: "So glad you found something that helps!", time: "30m ago" }], createdAt: Date.now() - 5400000 },
];

export default function Community() {
  const [profile] = useLocalState("mlk-profile", { anonymousHandle: "@mango-owl" });
  const [posts, setPosts] = useLocalState("mlk-posts", INITIAL_POSTS);
  const [postText, setPostText] = useState("");
  const [postCategory, setPostCategory] = useState("support");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("hot");
  const [expandedPost, setExpandedPost] = useState(null);
  const [replyText, setReplyText] = useState("");

  const submitPost = () => {
    if (!postText.trim()) return;
    const newPost = {
      id: Date.now(),
      handle: profile.anonymousHandle,
      text: postText.trim(),
      category: postCategory,
      up: 0,
      hearts: 0,
      replies: [],
      createdAt: Date.now(),
    };
    setPosts([newPost, ...posts]);
    setPostText("");
  };

  const upvotePost = (postId) => {
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, up: p.up + 1 } : p)));
  };

  const heartPost = (postId) => {
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, hearts: p.hearts + 1 } : p)));
  };

  const addReply = (postId) => {
    if (!replyText.trim()) return;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return { ...p, replies: [...p.replies, { handle: profile.anonymousHandle, text: replyText.trim(), time: "just now" }] };
      })
    );
    setReplyText("");
    setExpandedPost(null);
  };

  const filteredPosts = posts
    .filter((p) => filterCategory === "all" || p.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === "hot") return b.up + b.hearts * 2 - (a.up + a.hearts * 2);
      if (sortBy === "new") return b.createdAt - a.createdAt;
      return 0;
    });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Safe Space Community</h2>
        <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Anonymous, supportive, and judgement-free. Be kind to each other.</p>
      </div>

      <div className="bg-white dark:bg-gray-950/50 p-5 rounded-2xl border border-slate-200 dark:border-gray-800">
        <textarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="Share your thoughts, ask for advice, or celebrate a win..."
          className="w-full p-4 rounded-xl bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 resize-none focus:border-indigo-500 focus:ring-0 h-24"
        />
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-2">
            {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
              <button key={cat.id} onClick={() => setPostCategory(cat.id)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${postCategory === cat.id ? "bg-indigo-500 text-white" : "bg-slate-100 dark:bg-gray-800 text-slate-500 hover:bg-slate-200"}`}>
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
          <button onClick={submitPost} disabled={!postText.trim()} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20">
            <Send className="w-4 h-4" /> Post
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => setFilterCategory(cat.id)} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${filterCategory === cat.id ? "bg-indigo-500 text-white" : "bg-slate-100 dark:bg-gray-800 text-slate-500 hover:bg-slate-200"}`}>
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          <button onClick={() => setSortBy("hot")} className={`p-2 rounded-lg ${sortBy === "hot" ? "bg-indigo-100 text-indigo-600" : "text-slate-400 hover:bg-slate-100"}`}>
            <TrendingUp className="w-4 h-4" />
          </button>
          <button onClick={() => setSortBy("new")} className={`p-2 rounded-lg ${sortBy === "new" ? "bg-indigo-100 text-indigo-600" : "text-slate-400 hover:bg-slate-100"}`}>
            <Clock className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredPosts.map((post) => (
          <motion.div key={post.id} layout className="bg-white dark:bg-gray-950/50 p-5 rounded-xl border border-slate-200 dark:border-gray-800 hover:shadow-sm transition-all">
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-1">
                <button onClick={() => upvotePost(post.id)} className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-400 hover:text-indigo-500 transition-all">
                  <ArrowUp className="w-5 h-5" />
                </button>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{post.up}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-indigo-500 font-mono">{post.handle}</span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-400">{formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-gray-800 text-slate-500 rounded-full text-xs">
                    {CATEGORIES.find((c) => c.id === post.category)?.icon} {post.category}
                  </span>
                </div>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{post.text}</p>
                <div className="flex items-center gap-4 mt-3">
                  <button onClick={() => heartPost(post.id)} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-pink-500 transition-all">
                    <Heart className="w-4 h-4" /> {post.hearts}
                  </button>
                  <button onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-500 transition-all">
                    <MessageSquare className="w-4 h-4" /> {post.replies.length} replies
                  </button>
                </div>

                <AnimatePresence>
                  {expandedPost === post.id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 space-y-2">
                      {post.replies.map((reply, i) => (
                        <div key={i} className="pl-4 border-l-2 border-indigo-200 dark:border-indigo-800">
                          <p className="text-xs font-bold text-indigo-400">{reply.handle} <span className="font-normal text-slate-400">{reply.time}</span></p>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{reply.text}</p>
                        </div>
                      ))}
                      <div className="flex gap-2 mt-2">
                        <input value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a supportive reply..." className="flex-1 px-3 py-2 rounded-lg bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-sm focus:border-indigo-500 focus:ring-0" onKeyDown={(e) => e.key === "Enter" && addReply(post.id)} />
                        <button onClick={() => addReply(post.id)} className="px-3 py-2 bg-indigo-500 text-white rounded-lg text-sm font-semibold hover:bg-indigo-600">Reply</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
