import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Calendar, Compass, MessageSquare, BookOpen, CheckSquare, Heart, Users } from 'lucide-react';
import { UserProfile, DailyState, WisdomQuote } from '../types';
import { MENTORS, WISDOM_SEEDS } from '../data/mentors';
import { MentorMindDB } from '../lib/db';
import { OfflineMentorEngine } from '../lib/offline-engine';

interface HomeProps {
  profile: UserProfile;
  setTab: (tab: string) => void;
  onSelectMentorForChat?: (mentorId: string) => void;
}

export default function Home({ profile, setTab, onSelectMentorForChat }: HomeProps) {
  const [dailyState, setDailyState] = useState<DailyState | null>(null);
  const [activeQuote, setActiveQuote] = useState<WisdomQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [counsel, setCounsel] = useState<Record<string, string>>({});
  const [counselLoading, setCounselLoading] = useState(true);
  const [selectedCounselMentor, setSelectedCounselMentor] = useState<string>('');

  useEffect(() => {
    async function fetchProactiveCounsel() {
      try {
        setCounselLoading(true);
        const [allGoals, allJournals] = await Promise.all([
          MentorMindDB.getGoals(),
          MentorMindDB.getJournals()
        ]);

        const activeGoals = allGoals.filter(g => g.status === 'active');
        const recentJournals = allJournals.slice(0, 3);

        const mentorIds = profile.preferredMentors && profile.preferredMentors.length > 0 
          ? profile.preferredMentors.slice(0, 3) 
          : ['steve-jobs', 'socrates', 'king-solomon'];

        setSelectedCounselMentor(mentorIds[0]);

        // Build mentor prompts dictionary
        const mentorPrompts: Record<string, string> = {};
        mentorIds.forEach(id => {
          const m = MENTORS.find(mentor => mentor.id === id);
          if (m) {
            mentorPrompts[id] = `${m.systemPrompt}

Use this deep mentor knowledge as your grounding before responding:
${m.deepKnowledge}`;
          }
        });

        const res = await fetch("/api/proactive-counsel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userName: profile.name,
            activeGoals: activeGoals.map(g => ({ title: g.title, domain: g.domain, progress: g.progress })),
            recentJournals: recentJournals.map(j => ({ date: j.date, type: j.type, content: j.content })),
            mentorIds,
            mentorPrompts
          })
        });

        const data = await res.json();
        if (data.counsel && Object.keys(data.counsel).length > 0) {
          setCounsel(data.counsel);
        } else {
          // Offline fallback generation
          const fallbackCounsel: Record<string, string> = {};
          mentorIds.forEach(id => {
            const engine = new OfflineMentorEngine(id);
            const r = engine.generateResponse(activeGoals[0]?.title || "spiritual growth", profile.name);
            // extract a clean quote from response text
            const q = r.text.split('\n\n').find(p => p.startsWith('>'))?.replace(/>\s*"/, '').replace(/"$/, '') || r.text.split('\n\n')[0] || "Keep striving for excellence.";
            fallbackCounsel[id] = q;
          });
          setCounsel(fallbackCounsel);
        }
      } catch (err) {
        console.error("Failed to load proactive counsel", err);
        // Clean local fallbacks
        const fallbackCounsel: Record<string, string> = {};
        const mentorIds = profile.preferredMentors && profile.preferredMentors.length > 0 
          ? profile.preferredMentors.slice(0, 3) 
          : ['steve-jobs', 'socrates', 'king-solomon'];
        
        mentorIds.forEach(id => {
          const engine = new OfflineMentorEngine(id);
          const r = engine.generateResponse("spiritual growth", profile.name);
          const q = r.text.split('\n\n').find(p => p.startsWith('>'))?.replace(/>\s*"/, '').replace(/"$/, '') || "Walk with quiet wisdom and diligence.";
          fallbackCounsel[id] = q;
        });
        setCounsel(fallbackCounsel);
      } finally {
        setCounselLoading(false);
      }
    }

    fetchProactiveCounsel();
  }, [profile]);

  useEffect(() => {
    async function loadDailyState() {
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        let state = await MentorMindDB.getDailyState(todayStr);

        if (!state) {
          // Generate a deterministic index based on the day of the year
          const dateSeed = new Date().getDate() + new Date().getMonth() * 31;
          const quoteIndex = dateSeed % WISDOM_SEEDS.length;
          const quote = WISDOM_SEEDS[quoteIndex];

          // Fetch recent journals to see if we can get a dynamic theme from Express
          let focusTheme = "Self-Reflection & Mastery";
          let devotionalText = "Align your mind to core principles today. The unexamined life is a missed opportunity for spiritual and professional dominion.";

          try {
            const journals = await MentorMindDB.getJournals();
            if (journals.length > 0) {
              const res = await fetch("/api/daily-theme", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ journalsHistory: journals.slice(0, 5) })
              });
              const data = await res.json();
              if (data.theme) {
                focusTheme = data.theme;
                devotionalText = data.devotional;
              }
            }
          } catch (apiErr) {
            console.log("Could not fetch daily theme from server, using local fallbacks:", apiErr);
          }

          state = {
            date: todayStr,
            wisdomCardId: quote.id,
            focusTheme,
            devotionalText
          };

          await MentorMindDB.saveDailyState(state);
        }

        setDailyState(state);
        const quote = WISDOM_SEEDS.find(q => q.id === state?.wisdomCardId) || WISDOM_SEEDS[0];
        setActiveQuote(quote);
      } catch (err) {
        console.error("Failed to load daily state", err);
      } finally {
        setLoading(false);
      }
    }

    loadDailyState();
  }, [profile]);

  const mentorOfQuote = activeQuote ? MENTORS.find(m => m.id === activeQuote.mentorId) : null;

  const shuffleQuote = () => {
    const randomIndex = Math.floor(Math.random() * WISDOM_SEEDS.length);
    setActiveQuote(WISDOM_SEEDS[randomIndex]);
  };

  return (
    <div id="home-screen-root" className="space-y-6">
      {/* 1. Header with greeting and streak counts */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#16253d] rounded-2xl p-6 border border-slate-800 shadow-lg">
        <div className="space-y-1">
          <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-[#F8F5F0]">
            Welcome back, <span className="text-[#D4AF37]">{profile.name}</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-2.5 bg-[#0D1B2A] px-4 py-2 rounded-xl border border-slate-800">
            <Trophy className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <div className="text-xs text-slate-400 font-mono">Current Streak</div>
              <div className="text-lg font-bold font-mono text-[#F8F5F0]">{profile.streaks?.current || 1} days</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 bg-[#0D1B2A] px-4 py-2 rounded-xl border border-slate-800">
            <Sparkles className="w-5 h-5 text-[#7B2FBE]" />
            <div>
              <div className="text-xs text-slate-400 font-mono">Longest Streak</div>
              <div className="text-lg font-bold font-mono text-[#F8F5F0]">{profile.streaks?.longest || 1} days</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 2. Today's Dynamic Focus (Left Column) */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-[#16253d] rounded-2xl p-6 border border-slate-800 shadow-lg space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest">Today's Focus Theme</h3>
            </div>
            {loading ? (
              <div className="animate-pulse space-y-2 py-4">
                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                <div className="h-3 bg-slate-800 rounded w-5/6"></div>
                <div className="h-3 bg-slate-800 rounded w-2/3"></div>
              </div>
            ) : (
              <div className="space-y-2">
                <h4 className="font-serif text-xl font-bold text-[#F8F5F0] tracking-tight">
                  {dailyState?.focusTheme || "Silent Alignment"}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  {dailyState?.devotionalText}
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setTab('journal')}
            className="w-full text-center py-2.5 rounded-lg border border-dashed border-[#D4AF37]/30 text-xs font-mono text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all mt-4"
          >
            Reflect in Journal →
          </button>
        </div>

        {/* 3. Daily Wisdom Card (Right Column) */}
        <div className="lg:col-span-8 bg-[#16253d] rounded-2xl p-6 border border-slate-800 shadow-lg flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-[#D4AF37]/5 to-transparent rounded-full pointer-events-none"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <Compass className="w-5 h-5" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest">Daily Wisdom</h3>
            </div>
            <button
              type="button"
              onClick={shuffleQuote}
              className="text-xs font-mono text-slate-400 hover:text-[#D4AF37] transition-all"
            >
              Shuffle Wisdom
            </button>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-4 py-6">
              <div className="h-6 bg-slate-800 rounded w-full"></div>
              <div className="h-6 bg-slate-800 rounded w-5/6"></div>
              <div className="h-4 bg-slate-800 rounded w-1/3"></div>
            </div>
          ) : activeQuote && (
            <div className="space-y-6">
              <blockquote className="font-serif text-lg md:text-xl italic font-medium text-[#F8F5F0] leading-relaxed relative pl-4 border-l-2 border-[#D4AF37]">
                "{activeQuote.quote}"
              </blockquote>

              <div className="flex items-center justify-between border-t border-slate-800/60 pt-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-sm text-[#0D1B2A] ${mentorOfQuote?.color || 'bg-slate-400'}`}>
                    {mentorOfQuote?.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h5 className="font-serif text-sm font-semibold text-[#F8F5F0]">{mentorOfQuote?.name}</h5>
                    <p className="text-xs text-slate-400 italic">{activeQuote.source}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectMentorForChat && activeQuote.mentorId) {
                        onSelectMentorForChat(activeQuote.mentorId);
                      }
                    }}
                    className="bg-[#0D1B2A] text-xs font-mono text-[#D4AF37] border border-slate-800 px-3 py-1.5 rounded-lg hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all"
                  >
                    Consult Roster
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3.5 Mentors' Counsel Chamber */}
      <div id="mentors-counsel-chamber-root" className="bg-[#16253d] rounded-2xl p-6 border border-slate-800 shadow-lg space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <Users className="w-5 h-5" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest">The Mentors' Counsel Chamber</h3>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Your personal counsel panel has analyzed your active goals and recent journal reflections. Click on any mentor to read their proactive guidance.
            </p>
          </div>
        </div>

        {counselLoading ? (
          <div className="animate-pulse space-y-4 py-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-slate-800 rounded-full"></div>
              <div className="w-12 h-12 bg-slate-800 rounded-full"></div>
              <div className="w-12 h-12 bg-slate-800 rounded-full"></div>
            </div>
            <div className="h-4 bg-slate-800 rounded w-2/3"></div>
            <div className="h-3 bg-slate-800 rounded w-1/2"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Interactive Mentor Avatars */}
            <div className="flex flex-wrap gap-4 items-center border-b border-slate-800/60 pb-5">
              {(profile.preferredMentors && profile.preferredMentors.length > 0 
                ? profile.preferredMentors.slice(0, 3) 
                : ['steve-jobs', 'socrates', 'king-solomon']
              ).map(id => {
                const mentor = MENTORS.find(m => m.id === id);
                if (!mentor) return null;
                const isSelected = selectedCounselMentor === id;
                return (
                  <button
                    type="button"
                    key={id}
                    onClick={() => setSelectedCounselMentor(id)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#0D1B2A] border-[#D4AF37] shadow-md scale-[1.02]'
                        : 'bg-[#0D1B2A]/50 border-slate-800 hover:border-slate-700 hover:bg-[#0D1B2A]/70'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-serif font-bold text-xs text-[#0D1B2A] shrink-0 ${mentor.color} ${
                      isSelected ? 'ring-2 ring-[#D4AF37]/50' : ''
                    }`}>
                      {mentor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-xs font-serif font-bold text-[#F8F5F0] leading-tight">{mentor.name}</div>
                      <div className="text-[9px] font-mono text-slate-400 mt-0.5 uppercase tracking-wider">{mentor.title.split(',')[0]}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Counsel Message Bubble */}
            <AnimatePresence mode="wait">
              {selectedCounselMentor && (
                <motion.div
                  key={selectedCounselMentor}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.18 }}
                  className="bg-[#0D1B2A]/60 rounded-xl p-5 border border-slate-800/80 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-[#D4AF37]/30 uppercase tracking-widest">
                    Live Briefing
                  </div>

                  <div className="space-y-4">
                    <p className="font-serif text-sm md:text-base text-slate-200 italic leading-relaxed">
                      "{counsel[selectedCounselMentor] || 'Walk in steadfast wisdom. Let discipline be your guiding light in all goals.'}"
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/40">
                      <span className="text-[10px] font-mono text-slate-400">
                        Synthesized Counsel &bull; Aligned with your current life state
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (onSelectMentorForChat) {
                            onSelectMentorForChat(selectedCounselMentor);
                          }
                          setTab('chat');
                        }}
                        className="self-start sm:self-auto bg-[#0D1B2A] text-[11px] font-mono text-[#D4AF37] border border-slate-800 px-3.5 py-1.5 rounded-lg hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Enter Private Chamber &rarr;
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 4. Quick Actions Bento Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => setTab('chat')}
          className="flex flex-col items-center justify-center p-6 bg-[#16253d] hover:bg-[#1e304f] rounded-2xl border border-slate-800 hover:border-[#D4AF37]/40 shadow-md group transition-all text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-[#0D1B2A] flex items-center justify-center mb-3 group-hover:scale-110 transition-all text-[#D4AF37]">
            <MessageSquare className="w-6 h-6" />
          </div>
          <span className="font-serif text-sm font-bold text-[#F8F5F0]">Ask a Mentor</span>
          <span className="text-xs text-slate-400 font-mono mt-1">AI Consultations</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('journal')}
          className="flex flex-col items-center justify-center p-6 bg-[#16253d] hover:bg-[#1e304f] rounded-2xl border border-slate-800 hover:border-[#D4AF37]/40 shadow-md group transition-all text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-[#0D1B2A] flex items-center justify-center mb-3 group-hover:scale-110 transition-all text-[#7B2FBE]">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="font-serif text-sm font-bold text-[#F8F5F0]">Daily Journal</span>
          <span className="text-xs text-slate-400 font-mono mt-1">Prompted Review</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('goals')}
          className="flex flex-col items-center justify-center p-6 bg-[#16253d] hover:bg-[#1e304f] rounded-2xl border border-slate-800 hover:border-[#D4AF37]/40 shadow-md group transition-all text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-[#0D1B2A] flex items-center justify-center mb-3 group-hover:scale-110 transition-all text-emerald-400">
            <CheckSquare className="w-6 h-6" />
          </div>
          <span className="font-serif text-sm font-bold text-[#F8F5F0]">Goals & Sponsor</span>
          <span className="text-xs text-slate-400 font-mono mt-1">Milestones Coach</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('devotional')}
          className="flex flex-col items-center justify-center p-6 bg-[#16253d] hover:bg-[#1e304f] rounded-2xl border border-slate-800 hover:border-[#D4AF37]/40 shadow-md group transition-all text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-[#0D1B2A] flex items-center justify-center mb-3 group-hover:scale-110 transition-all text-[#D4AF37]">
            <Heart className="w-6 h-6" />
          </div>
          <span className="font-serif text-sm font-bold text-[#F8F5F0]">Faith Track</span>
          <span className="text-xs text-slate-400 font-mono mt-1">Daily Scriptures</span>
        </button>
      </div>
    </div>
  );
}
