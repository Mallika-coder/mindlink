import { useState } from "react";
import { Download, Upload, Trash2, User, Bell, Palette, Shield } from "lucide-react";
import { useLocalState } from "../hooks/useLocalState";

export default function Settings() {
  const [profile, setProfile] = useLocalState("mlk-profile", { anonymousHandle: "@mango-owl", notifications: true, theme: "system" });
  const [showExport, setShowExport] = useState(false);

  const exportData = () => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("mlk-")) {
        data[key] = JSON.parse(localStorage.getItem(key));
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mindlink-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        Object.entries(data).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value));
        });
        window.location.reload();
      } catch (err) {
        alert("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  const clearAll = () => {
    if (!confirm("Delete ALL your MindLink data? This cannot be undone.")) return;
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("mlk-")) keys.push(key);
    }
    keys.forEach((key) => localStorage.removeItem(key));
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Manage your profile and data privacy.</p>
      </div>

      <div className="bg-white dark:bg-gray-950/50 rounded-2xl border border-slate-200 dark:border-gray-800 divide-y divide-slate-200 dark:divide-gray-800">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold">Profile</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1 block">Anonymous Handle</label>
              <input
                type="text"
                value={profile.anonymousHandle}
                onChange={(e) => setProfile({ ...profile, anonymousHandle: e.target.value })}
                className="w-full md:w-1/2 p-3 rounded-xl bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 focus:border-indigo-500 focus:ring-0"
              />
              <p className="text-xs text-slate-400 mt-1">Used in the community forum. No real identity is stored.</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold">Notifications</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Daily Check-in Reminders</p>
              <p className="text-xs text-slate-400">Gentle nudges to log your mood.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={profile.notifications} onChange={(e) => setProfile({ ...profile, notifications: e.target.checked })} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold">Data & Privacy</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-gray-400 mb-4">
            All your data is stored locally in your browser. Nothing is sent to any server. You own your data completely.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={exportData} className="px-4 py-2.5 bg-slate-100 dark:bg-gray-800 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-gray-700 transition-all">
              <Download className="w-4 h-4" /> Export Backup
            </button>
            <label className="px-4 py-2.5 bg-slate-100 dark:bg-gray-800 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-gray-700 transition-all cursor-pointer">
              <Upload className="w-4 h-4" /> Import Backup
              <input type="file" accept=".json" onChange={importData} className="hidden" />
            </label>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Trash2 className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-red-600 dark:text-red-400">Danger Zone</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-gray-400 mb-3">Permanently delete all MindLink data from this browser.</p>
          <button onClick={clearAll} className="px-4 py-2.5 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
            Delete All Data
          </button>
        </div>
      </div>
    </div>
  );
}
