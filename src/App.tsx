import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  MessageSquare, 
  BookOpen, 
  CheckSquare, 
  Heart, 
  Settings as SettingsIcon, 
  Brain, 
  Sparkles,
  Trophy
} from 'lucide-react';

import { UserProfile } from './types';
import { MentorMindDB } from './lib/db';

// Import Screens & Components
import Onboarding from './components/Onboarding';
import Home from './screens/Home';
import Chat from './screens/Chat';
import Journal from './screens/Journal';
import Goals from './screens/Goals';
import Library from './screens/Library';
import Devotional from './screens/Devotional';
import Settings from './screens/Settings';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [loading, setLoading] = useState<boolean>(true);
  const [initialChatMentorId, setInitialChatMentorId] = useState<string | null>(null);

  // Load user profile and evaluate daily streak count
  useEffect(() => {
    async function loadApp() {
      try {
        const storedProfile = await MentorMindDB.getUserProfile();
        if (storedProfile && storedProfile.onboarded) {
          const todayStr = new Date().toISOString().split('T')[0];
          const lastActive = storedProfile.streaks?.lastActiveDate;

          let updatedProfile = { ...storedProfile };

          // Evaluate daily streak count
          if (lastActive !== todayStr) {
            let current = storedProfile.streaks?.current || 0;
            let longest = storedProfile.streaks?.longest || 0;

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (lastActive === yesterdayStr) {
              current += 1;
            } else if (lastActive !== todayStr) {
              current = 1; // Reset streak if missed a day
            }

            if (current > longest) {
              longest = current;
            }

            updatedProfile.streaks = {
              current,
              longest,
              lastActiveDate: todayStr
            };

            await MentorMindDB.saveUserProfile(updatedProfile);
          }

          setProfile(updatedProfile);
        }
      } catch (err) {
        console.error("Failed to initialize App", err);
      } finally {
        setLoading(false);
      }
    }

    loadApp();
  }, []);

  const handleOnboardingComplete = async (newProfile: UserProfile) => {
    try {
      await MentorMindDB.saveUserProfile(newProfile);
      setProfile(newProfile);
      setActiveTab('home');
    } catch (err) {
      console.error("Failed to complete onboarding save", err);
    }
  };

  const handleResetOnboarding = () => {
    if (confirm("Resetting onboarding will re-launch the intro slide decks. Your journals and goals will remain preserved. Proceed?")) {
      setProfile(null);
    }
  };

  const selectMentorForChat = (mentorId: string) => {
    setInitialChatMentorId(mentorId);
    setActiveTab('chat');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex flex-col items-center justify-center space-y-4">
        <Brain className="w-12 h-12 text-[#D4AF37] animate-pulse" />
        <p className="font-serif italic text-slate-400">Opening Sanctuary...</p>
      </div>
    );
  }

  // Show Onboarding screen if user profile doesn't exist
  if (!profile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <Home profile={profile} setTab={setActiveTab} onSelectMentorForChat={selectMentorForChat} />;
      case 'chat':
        return <Chat profile={profile} initialMentorId={initialChatMentorId} clearInitialMentor={() => setInitialChatMentorId(null)} />;
      case 'journal':
        return <Journal profile={profile} />;
      case 'goals':
        return <Goals />;
      case 'library':
        return <Library setTab={setActiveTab} onSelectMentorForChat={selectMentorForChat} />;
      case 'devotional':
        return <Devotional profile={profile} onUpdateProfile={setProfile} />;
      case 'settings':
        return <Settings profile={profile} onUpdateProfile={setProfile} onResetOnboarding={handleResetOnboarding} />;
      default:
        return <Home profile={profile} setTab={setActiveTab} onSelectMentorForChat={selectMentorForChat} />;
    }
  };

  const NAV_ITEMS = [
    { id: 'home', label: 'Home', icon: <Compass className="w-5 h-5" /> },
    { id: 'chat', label: 'Mentor Chat', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'journal', label: 'Journal', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'goals', label: 'Sponsored Goals', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'library', label: 'Wisdom Library', icon: <Compass className="w-5 h-5" /> },
    { id: 'devotional', label: 'Devotional', icon: <Heart className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-5 h-5" /> },
  ];

  return (
    <div id="app-viewport-container" className="min-h-screen bg-[#0D1B2A] bg-mesh-gradient flex flex-col lg:flex-row text-[#F8F5F0]">
      
      {/* A. Sidebar Navigation for Desktop Screens */}
      <aside className="hidden lg:flex flex-col justify-between w-64 bg-[#16253d] border-r border-slate-800 p-6 shrink-0 h-screen sticky top-0">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0D1B2A] border border-slate-700/60 flex items-center justify-center text-[#D4AF37] shadow-md">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg text-[#F8F5F0] tracking-tight leading-none">MentorMind</h1>
              <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block mt-1">Wisdom Sanctuary</span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="space-y-1.5">
            {NAV_ITEMS.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${isActive ? 'bg-[#0D1B2A] text-[#D4AF37] border-l-2 border-[#D4AF37] shadow-inner' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User simple info footer */}
        <div className="flex items-center gap-3 border-t border-slate-800/60 pt-4">
          <div className="w-8 h-8 rounded-full bg-[#0D1B2A] border border-[#D4AF37]/20 flex items-center justify-center text-xs text-[#D4AF37] font-semibold">
            {profile.name[0]?.toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <span className="text-xs font-serif font-bold block truncate text-[#F8F5F0]">{profile.name}</span>
            <span className="text-[9px] font-mono text-slate-500 block">Streak: {profile.streaks?.current || 1} d</span>
          </div>
        </div>
      </aside>

      {/* B. Main Application Canvas */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl mx-auto w-full overflow-x-hidden min-h-screen">
        
        {/* Responsive Mobile Header */}
        <header className="flex lg:hidden items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#16253d] border border-slate-800 flex items-center justify-center text-[#D4AF37]">
              <Brain className="w-4 h-4" />
            </div>
            <h1 className="font-serif font-bold text-base text-[#F8F5F0]">MentorMind</h1>
          </div>

          <div className="flex items-center gap-2 bg-[#16253d] border border-slate-800 px-3 py-1 rounded-full text-[10px] font-mono">
            <Trophy className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{profile.streaks?.current || 1} d streak</span>
          </div>
        </header>

        {/* Loaded active tab */}
        <div id="active-tab-container" className="min-h-[calc(100vh-140px)]">
          {renderActiveScreen()}
        </div>
      </main>

      {/* C. Bottom Tab Bar for Mobile Viewports */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#16253d] border-t border-slate-800 p-2.5 flex items-center justify-around z-40 shadow-2xl">
        {NAV_ITEMS.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-all ${isActive ? 'text-[#D4AF37]' : 'text-slate-400'}`}
            >
              {item.icon}
              <span className="text-[9px] font-mono mt-0.5 tracking-tighter leading-none">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
