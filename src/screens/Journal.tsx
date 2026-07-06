import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Calendar, Edit3, Sparkles, Tag, Eye, Trash2, Maximize2, Minimize2, Check, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { JournalEntry, UserProfile } from '../types';
import { MentorMindDB } from '../lib/db';

const JOURNAL_TAGS = ['Career', 'Spiritual', 'Relationships', 'Health', 'Purpose', 'Finance', 'Learning'];

const PROMPTS = {
  morning: [
    "What is the single most important contribution you will focus on executing today?",
    "Which core value or scripture will govern your decision-making over the next twelve hours?",
    "What potential resistance or cognitive blindspot do you anticipate facing today, and how will you bypass it?"
  ],
  evening: [
    "Did your actions today align with your truest internal values? Where did you fall short?",
    "What was the most challenging decision you made today, and what did it teach you about your character?",
    "What is one victory you are deeply grateful for before closing this day?"
  ]
};

interface JournalProps {
  profile: UserProfile;
}

export default function Journal({ profile }: JournalProps) {
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [content, setContent] = useState('');
  const [type, setType] = useState<'morning' | 'evening'>('morning');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [activePrompt, setActivePrompt] = useState('');
  const [expandedJournal, setExpandedJournal] = useState<string | null>(null);

  // Load past journals on launch
  useEffect(() => {
    async function loadJournals() {
      try {
        const stored = await MentorMindDB.getJournals();
        setJournals(stored);
      } catch (err) {
        console.error("Failed to load journals", err);
      }
    }
    loadJournals();
    shufflePrompt('morning');
  }, []);

  const shufflePrompt = (jType: 'morning' | 'evening') => {
    const list = PROMPTS[jType];
    const random = list[Math.floor(Math.random() * list.length)];
    setActivePrompt(random);
  };

  const handleTypeChange = (newType: 'morning' | 'evening') => {
    setType(newType);
    shufflePrompt(newType);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || analyzing) return;

    setAnalyzing(true);
    const newEntryId = `journal-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    let aiAnalysisResult: JournalEntry['aiAnalysis'] | undefined;

    try {
      // Send to backend for AI analysis using the selected provider.
      const res = await fetch("/api/journal-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          type,
          provider: profile.aiProvider || 'gemini',
          apiKey: profile.apiKeys?.[profile.aiProvider || 'gemini'] || profile.apiKey
        })
      });

      const data = await res.json();

      if (data.offlineMode) {
        // Fallback local analysis
        aiAnalysisResult = generateLocalAnalysis(content, selectedTags);
      } else {
        aiAnalysisResult = data;
      }
    } catch (apiErr) {
      console.log("Could not analyze journal via AI, falling back locally:", apiErr);
      aiAnalysisResult = generateLocalAnalysis(content, selectedTags);
    }

    const newEntry: JournalEntry = {
      id: newEntryId,
      date: today,
      time: timeStr,
      type,
      content,
      tags: selectedTags.length > 0 ? selectedTags : ['Personal Growth'],
      aiAnalysis: aiAnalysisResult,
      syncStatus: 'synced'
    };

    try {
      await MentorMindDB.saveJournal(newEntry);
      setJournals(prev => [newEntry, ...prev]);
      setContent('');
      setSelectedTags([]);
      setIsFocusMode(false);
      setExpandedJournal(newEntryId); // Auto expand new journal to see AI insight
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDeleteJournal = async (id: string) => {
    if (!confirm("Are you sure you want to delete this reflection? This cannot be undone.")) return;
    try {
      await MentorMindDB.deleteJournal(id);
      setJournals(prev => prev.filter(j => j.id !== id));
      if (expandedJournal === id) setExpandedJournal(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Safe local analyzer when offline or unconfigured
  const generateLocalAnalysis = (text: string, tags: string[]): JournalEntry['aiAnalysis'] => {
    const textLower = text.toLowerCase();
    let sentiment: JournalEntry['aiAnalysis']['sentiment'] = 'reflective';
    let summary = "A quiet period of internal exploration, checking alignment with goals.";
    let blindSpots = ["You may be focusing heavy attention on immediate worries while neglecting long-term structural setups."];
    let growthAreas = ["Commit to blocking out 1 hour of quiet focus work or prayer tomorrow.", "Discuss these challenges openly with an advisor."];
    let coachingQuestion = "What would the most courageous and disciplined version of yourself do regarding this tomorrow morning?";

    if (textLower.includes('tired') || textLower.includes('exhausted') || textLower.includes('burnout') || textLower.includes('struggle')) {
      sentiment = 'struggling';
      summary = "You are currently feeling stretched and fighting internal friction.";
      blindSpots = ["Acknowledge that fatigue is a signal to prune commitments, not a sign of fundamental capability failure."];
      growthAreas = ["Declare a mandatory rest period.", "Break your large goals down into small, digestible micro-milestones."];
      coachingQuestion = "Are you trying to carry a burden on your own instead of delegating, resting, or seeking counsel?";
    } else if (textLower.includes('excel') || textLower.includes('build') || textLower.includes('victory') || textLower.includes('happy') || textLower.includes('won')) {
      sentiment = 'positive';
      summary = "A highly triumphant reflection full of builder momentum.";
      blindSpots = ["Ensure that a temporary streak of wins does not lull you into ignoring daily foundation-level habits."];
      growthAreas = ["Document this victory formula so you can repeat it during dry seasons.", "Share your abundance with someone in your network."];
    } else if (textLower.includes('must') || textLower.includes('will') || textLower.includes('determined') || textLower.includes('goal')) {
      sentiment = 'determined';
      summary = "An entry anchored by unyielding resolve and focus.";
    }

    return {
      summary,
      themes: tags.length > 0 ? tags : ['Personal Growth'],
      blindSpots,
      growthAreas,
      sentiment,
      coachingQuestion
    };
  };

  return (
    <div id="journal-screen-root" className="space-y-6">
      
      {/* Immersive Focus Mode overlay */}
      <AnimatePresence>
        {isFocusMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0D1B2A] z-50 flex flex-col items-center justify-center p-6"
          >
            <div className="max-w-2xl w-full flex flex-col h-full justify-between space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                  <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">{type} reflection</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFocusMode(false)}
                  className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 bg-[#16253d] px-3 py-1.5 rounded-lg transition-all"
                >
                  <Minimize2 className="w-4 h-4" /> Exit Focus
                </button>
              </div>

              {/* Focus text canvas */}
              <div className="flex-1 flex flex-col justify-center space-y-4">
                <p className="font-serif text-lg text-[#D4AF37] italic text-center max-w-lg mx-auto">
                  "{activePrompt}"
                </p>
                
                <textarea
                  placeholder="Pour your thoughts onto this digital canvas. No formatting, no eyes, just raw clarity..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full flex-1 bg-transparent border-none text-[#F8F5F0] text-lg font-serif placeholder-slate-600 focus:ring-0 focus:outline-none resize-none leading-relaxed"
                  autoFocus
                />
              </div>

              {/* Submit details in focus mode */}
              <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                <div className="flex gap-1.5 overflow-x-auto">
                  {JOURNAL_TAGS.map(t => {
                    const isSelected = selectedTags.includes(t);
                    return (
                      <button
                        type="button"
                        key={t}
                        onClick={() => toggleTag(t)}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-all ${isSelected ? 'bg-[#D4AF37] text-[#0D1B2A] border-[#D4AF37]' : 'bg-[#16253d] text-slate-400 border-slate-800 hover:border-slate-700'}`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleSubmitEntry}
                  disabled={!content.trim() || analyzing}
                  className="flex items-center gap-1.5 bg-[#D4AF37] text-[#0D1B2A] font-serif font-bold text-sm px-6 py-2.5 rounded-lg hover:bg-amber-400 active:scale-95 transition-all"
                >
                  {analyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Complete Reflection
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Journal Screen Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Entry Writer */}
        <div className="lg:col-span-5 bg-[#16253d] rounded-2xl border border-slate-800 p-6 shadow-lg flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-serif text-lg font-bold text-[#F8F5F0]">Create Reflection</h3>
              </div>

              <div className="flex bg-[#0D1B2A] rounded-lg p-0.5 border border-slate-800">
                <button
                  type="button"
                  onClick={() => handleTypeChange('morning')}
                  className={`text-xs font-mono px-2.5 py-1 rounded transition-all ${type === 'morning' ? 'bg-[#D4AF37] text-[#0D1B2A] font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Morning
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('evening')}
                  className={`text-xs font-mono px-2.5 py-1 rounded transition-all ${type === 'evening' ? 'bg-[#D4AF37] text-[#0D1B2A] font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Evening
                </button>
              </div>
            </div>

            <div className="bg-[#0D1B2A] border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider font-bold">Suggested Reflection Prompt</span>
                <button
                  type="button"
                  onClick={() => shufflePrompt(type)}
                  className="text-[9px] font-mono text-slate-500 hover:text-[#D4AF37]"
                >
                  Shuffle Prompt
                </button>
              </div>
              <p className="font-serif text-sm italic text-slate-300 leading-relaxed">
                "{activePrompt}"
              </p>
            </div>

            <div className="space-y-2">
              <textarea
                placeholder="Type your reflection here. Try focus mode for a completely distraction-free workspace..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[140px] bg-[#0D1B2A] border border-slate-800 rounded-xl p-4 text-sm text-[#F8F5F0] placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] resize-none leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Tag Life Domains:</label>
              <div className="flex flex-wrap gap-1.5">
                {JOURNAL_TAGS.map(t => {
                  const isSelected = selectedTags.includes(t);
                  return (
                    <button
                      type="button"
                      key={t}
                      onClick={() => toggleTag(t)}
                      className={`text-[10px] px-2 py-1 rounded-md border font-mono transition-all ${isSelected ? 'bg-[#D4AF37] text-[#0D1B2A] border-[#D4AF37]' : 'bg-[#0D1B2A] text-slate-400 border-slate-800 hover:border-slate-700'}`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsFocusMode(true)}
              className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#0D1B2A] text-slate-400 border border-slate-800 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all shrink-0"
              title="Full-screen Focus Mode"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleSubmitEntry}
              disabled={!content.trim() || analyzing}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#D4AF37] text-[#0D1B2A] font-serif font-bold text-sm h-11 rounded-xl hover:bg-amber-400 active:scale-95 transition-all shadow-md"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Wisdom...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Save & Analyze
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right column: Past entries logs */}
        <div className="lg:col-span-7 bg-[#16253d] rounded-2xl border border-slate-800 p-6 shadow-lg space-y-4 max-h-[580px] overflow-y-auto">
          <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3">
            <BookOpen className="w-5 h-5 text-[#7B2FBE]" />
            <h3 className="font-serif text-lg font-bold text-[#F8F5F0]">Past Reflections ({journals.length})</h3>
          </div>

          {journals.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="font-serif text-slate-400 italic">No entries logged yet.</p>
              <p className="text-xs text-slate-500 font-sans">Begin your morning or evening alignment above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {journals.map((j) => {
                const isExpanded = expandedJournal === j.id;
                return (
                  <div
                    key={j.id}
                    className={`border rounded-xl transition-all ${isExpanded ? 'bg-[#0e1724]/60 border-[#D4AF37]/40' : 'bg-[#0e1724]/20 border-slate-800/80 hover:border-slate-700'}`}
                  >
                    {/* Collapsed top view */}
                    <div
                      onClick={() => setExpandedJournal(isExpanded ? null : j.id)}
                      className="p-4 flex items-center justify-between cursor-pointer"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37]">{j.type}</span>
                          <span className="text-[10px] font-mono text-slate-500">• {j.date} {j.time}</span>
                        </div>
                        <p className="text-sm font-sans text-slate-200 line-clamp-1 leading-normal pr-4">{j.content}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Domain Tags */}
                        <div className="hidden sm:flex gap-1">
                          {j.tags.slice(0, 2).map(t => (
                            <span key={t} className="bg-[#0D1B2A] border border-slate-800 text-[9px] font-mono px-2 py-0.5 rounded text-slate-400">{t}</span>
                          ))}
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </div>

                    {/* Expanded details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden border-t border-slate-800/60 p-4 space-y-4"
                        >
                          {/* Main Journal content block */}
                          <div className="space-y-1.5">
                            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">My Words:</div>
                            <p className="text-sm font-serif text-slate-200 whitespace-pre-line leading-relaxed">{j.content}</p>
                          </div>

                          {/* AI Coaching Analysis Block */}
                          {j.aiAnalysis && (
                            <div className="bg-[#16253d]/80 border border-slate-800 rounded-xl p-4 space-y-3 shadow-inner">
                              <div className="flex items-center gap-1.5 text-[#D4AF37]">
                                <Sparkles className="w-4 h-4" />
                                <span className="font-mono text-[10px] font-bold uppercase tracking-wider">AI Mentor Analysis ({j.aiAnalysis.sentiment})</span>
                              </div>

                              <p className="text-xs text-slate-300 font-sans leading-relaxed">{j.aiAnalysis.summary}</p>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div className="space-y-1">
                                  <div className="text-[9px] font-mono text-amber-400 uppercase tracking-wide">Potential Blindspot:</div>
                                  <ul className="list-disc pl-4 text-[11px] text-slate-400 space-y-1">
                                    {j.aiAnalysis.blindSpots.map((b, idx) => <li key={idx}>{b}</li>)}
                                  </ul>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-[9px] font-mono text-emerald-400 uppercase tracking-wide">Actionable Steps:</div>
                                  <ul className="list-disc pl-4 text-[11px] text-slate-400 space-y-1">
                                    {j.aiAnalysis.growthAreas.map((g, idx) => <li key={idx}>{g}</li>)}
                                  </ul>
                                </div>
                              </div>

                              <div className="pt-3 border-t border-slate-800/40 text-xs italic space-y-1.5">
                                <div className="font-mono text-[9px] text-[#7B2FBE] uppercase font-bold tracking-wider">Coaching Challenge:</div>
                                <div className="text-[#F8F5F0] font-serif font-medium">"{j.aiAnalysis.coachingQuestion}"</div>
                              </div>
                            </div>
                          )}

                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleDeleteJournal(j.id)}
                              className="flex items-center gap-1 text-[10px] font-mono text-red-400 hover:text-red-300 bg-red-950/20 px-2.5 py-1.5 rounded border border-red-900/40 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete Entry
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
