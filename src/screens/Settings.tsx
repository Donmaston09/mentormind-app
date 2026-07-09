import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Key, Database, RefreshCw, Check, ShieldAlert } from 'lucide-react';
import { UserProfile } from '../types';
import { MentorMindDB } from '../lib/db';

interface SettingsProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onResetOnboarding: () => void;
}

export default function Settings({ profile, onUpdateProfile, onResetOnboarding }: SettingsProps) {
  const [userName, setUserName] = useState(profile.name);
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    const updated: UserProfile = {
      ...profile,
      name: userName.trim()
    };

    try {
      await MentorMindDB.saveUserProfile(updated);
      onUpdateProfile(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearDatabase = async () => {
    if (!confirm("CRITICAL WARNING: This will permanently delete all your journals, custom goals, milestones, and dialogue session logs from this device. Do you absolutely wish to proceed?")) {
      return;
    }
    try {
      await MentorMindDB.resetDatabase();
      alert("Database purged. Reloading app...");
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="settings-screen-root" className="max-w-2xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-[#16253d] rounded-2xl p-6 border border-slate-800 shadow-md flex items-start gap-4">
        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center shrink-0 text-[#D4AF37]">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="font-serif text-2xl font-bold text-[#F8F5F0]">Sanctuary Settings</h2>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Manage your personal profiles, view API privacy details, or reset local device persistence.
          </p>
        </div>
      </div>

      {/* Form & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Profile Card */}
        <div className="bg-[#16253d] border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800/60 pb-2.5 text-[#D4AF37]">
            <User className="w-4 h-4" />
            <h3 className="font-serif text-sm font-bold text-[#F8F5F0]">My Profile</h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">How mentors address me:</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                maxLength={20}
                className="w-full bg-[#0D1B2A] border border-slate-700/80 rounded-xl py-2 px-3 text-sm text-[#F8F5F0] placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#D4AF37] text-[#0D1B2A] font-serif font-bold text-xs rounded-lg hover:bg-amber-400 transition-all flex items-center justify-center gap-1.5 shadow"
            >
              {saved ? <Check className="w-3.5 h-3.5" /> : null}
              {saved ? 'Changes Saved' : 'Save Profile'}
            </button>
          </form>
        </div>

        {/* API Credentials */}
        <div className="bg-[#16253d] border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800/60 pb-2.5 text-[#D4AF37]">
            <Key className="w-4 h-4" />
            <h3 className="font-serif text-sm font-bold text-[#F8F5F0]">API Credentials</h3>
          </div>

          <div className="space-y-2 text-xs leading-relaxed text-slate-300">
            <p>
              Your system's <strong>Gemini API Key</strong> is fully secured by Google AI Studio. It is never exposed client-side or sent over untrusted connections.
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              The Express backend processes your mentor chats privately on secure Node.js containers. No manual API setup is required.
            </p>
          </div>
        </div>
      </div>

      {/* Critical System Resets */}
      <div className="bg-[#16253d] border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800/60 pb-2.5 text-red-400">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          <h3 className="font-serif text-sm font-bold text-[#F8F5F0]">System Resets</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="bg-[#0D1B2A]/50 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <span className="text-xs font-serif font-semibold text-[#F8F5F0] block">Re-run Onboarding</span>
              <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                Launches the welcome slideshow presentation and lets you re-select your preferred mentor roster categories.
              </p>
            </div>
            <button
              type="button"
              onClick={onResetOnboarding}
              className="py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded-lg transition-all"
            >
              Relaunch Slide Deck
            </button>
          </div>

          <div className="bg-[#0D1B2A]/50 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <span className="text-xs font-serif font-semibold text-red-400 block">Reset Local Database</span>
              <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                Permanently wipes all journals, chat sessions, streaks, and milestone logs from your browser's IndexedDB.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClearDatabase}
              className="py-1.5 bg-red-950/30 hover:bg-red-900/30 border border-red-900/50 text-red-400 text-xs font-mono rounded-lg transition-all"
            >
              Wipe Database
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
