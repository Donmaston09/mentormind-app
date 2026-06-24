import React, { useState, useEffect } from 'react';
import { Heart, Plus, Minus, BookOpen, Clock, Flame, Calendar, DollarSign, Award, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';
import { MentorMindDB } from '../lib/db';

interface DevotionalProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export default function Devotional({ profile, onUpdateProfile }: DevotionalProps) {
  const [study, setStudy] = useState(profile.spiritualTrack?.studyCount || 0);
  const [prayer, setPrayer] = useState(profile.spiritualTrack?.prayerMinutes || 0);
  const [fasting, setFasting] = useState(profile.spiritualTrack?.fastingDays || 0);
  const [giving, setGiving] = useState(profile.spiritualTrack?.givingCount || 0);

  const handleUpdateStat = async (field: 'studyCount' | 'prayerMinutes' | 'fastingDays' | 'givingCount', type: 'plus' | 'minus') => {
    let currentVal = 0;
    if (field === 'studyCount') currentVal = study;
    if (field === 'prayerMinutes') currentVal = prayer;
    if (field === 'fastingDays') currentVal = fasting;
    if (field === 'givingCount') currentVal = giving;

    const newVal = type === 'plus' ? currentVal + (field === 'prayerMinutes' ? 15 : 1) : Math.max(0, currentVal - (field === 'prayerMinutes' ? 15 : 1));

    // Update local state
    if (field === 'studyCount') setStudy(newVal);
    if (field === 'prayerMinutes') setPrayer(newVal);
    if (field === 'fastingDays') setFasting(newVal);
    if (field === 'givingCount') setGiving(newVal);

    // Save back to DB
    const updatedProfile: UserProfile = {
      ...profile,
      spiritualTrack: {
        studyCount: field === 'studyCount' ? newVal : study,
        prayerMinutes: field === 'prayerMinutes' ? newVal : prayer,
        fastingDays: field === 'fastingDays' ? newVal : fasting,
        givingCount: field === 'givingCount' ? newVal : giving,
      }
    };

    try {
      await MentorMindDB.saveUserProfile(updatedProfile);
      onUpdateProfile(updatedProfile);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="devotional-screen-root" className="space-y-6">
      
      {/* 1. Introductory Header */}
      <div className="bg-[#16253d] rounded-2xl p-6 border border-slate-800 shadow-md flex items-start gap-4">
        <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center shrink-0 text-[#D4AF37]">
          <Heart className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="font-serif text-2xl font-bold text-[#F8F5F0]">Kingdom Devotional Track</h2>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Track daily spiritual habits, word study, fasting consecration, and prayer. Build consistent internal discipline.
          </p>
        </div>
      </div>

      {/* 2. Habits trackers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Habit: Word Study */}
        <div className="bg-[#16253d] rounded-2xl border border-slate-800 p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">Word Study</span>
            </div>
            <span className="text-xs font-mono text-slate-400">Chapters</span>
          </div>

          <div className="text-center space-y-1">
            <div className="text-4xl font-bold font-mono text-[#F8F5F0]">{study}</div>
            <p className="text-[10px] text-slate-500 font-mono">Total session studies</p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleUpdateStat('studyCount', 'minus')}
              className="flex-1 bg-[#0D1B2A] border border-slate-800 py-1.5 rounded-lg flex items-center justify-center hover:border-slate-700 text-slate-400 hover:text-slate-200"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleUpdateStat('studyCount', 'plus')}
              className="flex-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 py-1.5 rounded-lg flex items-center justify-center hover:border-[#D4AF37] text-[#D4AF37]"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Habit: Prayer Minutes */}
        <div className="bg-[#16253d] rounded-2xl border border-slate-800 p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">Quiet Prayer</span>
            </div>
            <span className="text-xs font-mono text-slate-400">Minutes</span>
          </div>

          <div className="text-center space-y-1">
            <div className="text-4xl font-bold font-mono text-[#F8F5F0]">{prayer}</div>
            <p className="text-[10px] text-slate-500 font-mono">Total prayer altar</p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleUpdateStat('prayerMinutes', 'minus')}
              className="flex-1 bg-[#0D1B2A] border border-slate-800 py-1.5 rounded-lg flex items-center justify-center hover:border-slate-700 text-slate-400 hover:text-slate-200"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleUpdateStat('prayerMinutes', 'plus')}
              className="flex-1 bg-emerald-500/10 border border-emerald-500/30 py-1.5 rounded-lg flex items-center justify-center hover:border-emerald-500 text-emerald-400"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Habit: Fasting Consecration */}
        <div className="bg-[#16253d] rounded-2xl border border-slate-800 p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">Fasting Days</span>
            </div>
            <span className="text-xs font-mono text-slate-400">Days</span>
          </div>

          <div className="text-center space-y-1">
            <div className="text-4xl font-bold font-mono text-[#F8F5F0]">{fasting}</div>
            <p className="text-[10px] text-slate-500 font-mono">Total consecrated days</p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleUpdateStat('fastingDays', 'minus')}
              className="flex-1 bg-[#0D1B2A] border border-slate-800 py-1.5 rounded-lg flex items-center justify-center hover:border-slate-700 text-slate-400 hover:text-slate-200"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleUpdateStat('fastingDays', 'plus')}
              className="flex-1 bg-orange-500/10 border border-orange-500/30 py-1.5 rounded-lg flex items-center justify-center hover:border-orange-500 text-orange-400"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Habit: Altar Stewardship (Giving) */}
        <div className="bg-[#16253d] rounded-2xl border border-slate-800 p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#7B2FBE]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">Kingdom Giving</span>
            </div>
            <span className="text-xs font-mono text-slate-400">Sowings</span>
          </div>

          <div className="text-center space-y-1">
            <div className="text-4xl font-bold font-mono text-[#F8F5F0]">{giving}</div>
            <p className="text-[10px] text-slate-500 font-mono">Completed giving acts</p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleUpdateStat('givingCount', 'minus')}
              className="flex-1 bg-[#0D1B2A] border border-slate-800 py-1.5 rounded-lg flex items-center justify-center hover:border-slate-700 text-slate-400 hover:text-slate-200"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleUpdateStat('givingCount', 'plus')}
              className="flex-1 bg-[#7B2FBE]/10 border border-[#7B2FBE]/30 py-1.5 rounded-lg flex items-center justify-center hover:border-[#7B2FBE] text-[#7B2FBE]"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Covenant Quote section */}
      <div className="bg-[#16253d] border border-slate-800 rounded-2xl p-6 shadow-md max-w-xl mx-auto space-y-4">
        <div className="flex items-center gap-2 text-[#D4AF37]">
          <ShieldCheck className="w-5 h-5" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest">Spiritual Axiom for Exploits</span>
        </div>
        <blockquote className="font-serif text-base text-slate-200 leading-relaxed italic text-center">
          "Exploits are never products of chance; they are products of covenant compliance. When you understand and operate the laws of the Kingdom, you release supernatural backing upon all your earthly systems."
        </blockquote>
        <p className="text-xs text-[#D4AF37] font-mono text-center uppercase tracking-wider">— Bishop David Oyedepo</p>
      </div>
    </div>
  );
}
