import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Key, Check, ShieldAlert, Cpu, GraduationCap, Eye, EyeOff, Clipboard } from 'lucide-react';
import { AIProvider, UserProfile } from '../types';
import { MentorMindDB } from '../lib/db';

interface SettingsProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onResetOnboarding: () => void;
}

export default function Settings({ profile, onUpdateProfile, onResetOnboarding }: SettingsProps) {
  const [userName, setUserName] = useState(profile.name);
  const [aiProvider, setAiProvider] = useState<AIProvider>(profile.aiProvider || 'gemini');
  const [apiKeys, setApiKeys] = useState<Partial<Record<AIProvider, string>>>(profile.apiKeys || {});
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    const updated: UserProfile = {
      ...profile,
      name: userName.trim(),
      aiProvider,
      apiKey: apiKeys[aiProvider]?.trim() || '',
      apiKeys
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

  const providers: Array<{ id: AIProvider; label: string; env: string; model: string }> = [
    { id: 'gemini', label: 'Gemini', env: 'GEMINI_API_KEY', model: 'gemini-3.5-flash fallback set' },
    { id: 'groq', label: 'Groq', env: 'GROQ_API_KEY', model: 'GROQ_MODEL or llama-3.3-70b-versatile' },
    { id: 'openai', label: 'OpenAI', env: 'OPENAI_API_KEY', model: 'OPENAI_MODEL or gpt-4o-mini' },
    { id: 'anthropic', label: 'Anthropic', env: 'ANTHROPIC_API_KEY', model: 'ANTHROPIC_MODEL or claude-3-5-haiku-latest' },
  ];

  const selectedProvider = providers.find(provider => provider.id === aiProvider) || providers[0];

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
            <h3 className="font-serif text-sm font-bold text-[#F8F5F0]">AI Provider</h3>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {providers.map(provider => {
              const selected = aiProvider === provider.id;
              const hasKey = Boolean(apiKeys[provider.id]?.trim());
              return (
                <button
                  type="button"
                  key={provider.id}
                  onClick={() => setAiProvider(provider.id)}
                  className={`rounded-lg border px-3 py-2 text-left transition-all ${selected ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#F8F5F0]' : 'border-slate-800 bg-[#0D1B2A] text-slate-400 hover:text-slate-200'}`}
                >
                  <span className="flex items-center justify-between gap-2 text-xs font-serif font-bold">
                    {provider.label}
                    {hasKey ? <Check className="w-3 h-3 text-emerald-400" /> : null}
                  </span>
                  <span className="block text-[9px] font-mono text-slate-500 mt-0.5">{provider.env}</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
              Paste {selectedProvider.label} API key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKeys[aiProvider] || ''}
                onChange={(e) => setApiKeys(prev => ({ ...prev, [aiProvider]: e.target.value }))}
                placeholder={`${selectedProvider.env}=...`}
                className="w-full bg-[#0D1B2A] border border-slate-700/80 rounded-xl py-2 pl-3 pr-10 text-sm text-[#F8F5F0] placeholder-slate-600 focus:outline-none focus:border-[#D4AF37] transition-all"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(prev => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#D4AF37] hover:bg-slate-800 transition-all"
                title={showApiKey ? 'Hide API key' : 'Show API key'}
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  const key = apiKeys[aiProvider] || '';
                  if (!key) {
                    alert('No API key to copy');
                    return;
                  }
                  navigator.clipboard.writeText(key).then(() => {
                    alert('API key copied to clipboard');
                  }, () => {
                    alert('Failed to copy API key');
                  });
                }}
                className="absolute right-10 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#D4AF37] hover:bg-slate-800 transition-all"
                title="Copy API key"
              >
                <Clipboard className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2 text-xs leading-relaxed text-slate-300">
            <p>
              Keys saved here stay in this browser's local storage database and are sent only to your app backend when you ask for AI responses.
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              Active provider: {selectedProvider.label}. Model: {selectedProvider.model}. For public deployment, environment variables are still recommended.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#16253d] border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800/60 pb-2.5 text-[#D4AF37]">
          <GraduationCap className="w-4 h-4" />
          <h3 className="font-serif text-sm font-bold text-[#F8F5F0]">Developer</h3>
        </div>

        <div className="flex items-start gap-3 text-sm text-slate-300">
          <div className="w-10 h-10 bg-[#0D1B2A] rounded-xl border border-slate-800 flex items-center justify-center text-[#D4AF37] shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <p className="font-serif font-bold text-[#F8F5F0]">Tony Onoja, PhD</p>
            <p className="text-xs text-slate-400 leading-relaxed">School of Health Sciences, University of Surrey</p>
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
