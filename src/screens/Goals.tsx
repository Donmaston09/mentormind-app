import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckSquare, Calendar, Award, User, Sparkles, Plus, Trash2, Check, Circle, Bookmark, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { Goal, GoalMilestone } from '../types';
import { MENTORS } from '../data/mentors';
import { MentorMindDB } from '../lib/db';

const GOAL_DOMAINS = ['Spiritual', 'Career', 'Finance', 'Health', 'Relationships', 'Learning'] as const;

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState<Goal['domain']>('Career');
  const [mentorSponsorId, setMentorSponsorId] = useState('steve-jobs');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [milestonesInput, setMilestonesInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);

  // Load goals
  useEffect(() => {
    async function loadGoals() {
      try {
        const stored = await MentorMindDB.getGoals();
        setGoals(stored);
      } catch (err) {
        console.error("Failed to load goals", err);
      }
    }
    loadGoals();
  }, []);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetDate) return;

    setLoading(true);

    // Split milestone inputs by comma or newline
    const milestoneTitles = milestonesInput
      .split(/[,\n]/)
      .map(m => m.trim())
      .filter(m => m.length > 0);

    // If no milestones are provided, let's create 3 default ones using AI or standard system templates based on the domain!
    const finalMilestoneTitles = milestoneTitles.length > 0 ? milestoneTitles : getDefaultMilestonesForDomain(domain);

    const milestones: GoalMilestone[] = finalMilestoneTitles.map((t, idx) => ({
      id: `milestone-${Date.now()}-${idx}`,
      title: t,
      completed: false
    }));

    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title: title.trim(),
      domain,
      mentorSponsorId,
      description: description.trim(),
      targetDate,
      milestones,
      progress: 0,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    try {
      await MentorMindDB.saveGoal(newGoal);
      setGoals(prev => [newGoal, ...prev]);

      // Reset form
      setTitle('');
      setDescription('');
      setTargetDate('');
      setMilestonesInput('');
      setExpandedGoalId(newGoal.id); // Auto expand new goal
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this target?")) return;
    try {
      await MentorMindDB.deleteGoal(id);
      setGoals(prev => prev.filter(g => g.id !== id));
      if (expandedGoalId === id) setExpandedGoalId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleMilestone = async (goalId: string, milestoneId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const updatedMilestones = goal.milestones.map(m => 
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );

    const completedCount = updatedMilestones.filter(m => m.completed).length;
    const progress = Math.round((completedCount / updatedMilestones.length) * 100);

    const updatedGoal: Goal = {
      ...goal,
      milestones: updatedMilestones,
      progress,
      status: progress === 100 ? 'completed' : 'active'
    };

    try {
      await MentorMindDB.saveGoal(updatedGoal);
      setGoals(prev => prev.map(g => g.id === goalId ? updatedGoal : g));
    } catch (err) {
      console.error(err);
    }
  };

  const getDefaultMilestonesForDomain = (dom: Goal['domain']): string[] => {
    switch (dom) {
      case 'Spiritual':
        return ["Establish a 30-minute quiet study and prayer ritual every morning.", "Complete a weekly 24-hour fast for spiritual alignment.", "Join or serve in a faith-based community weekly."];
      case 'Career':
        return ["Isolate my 10-year career leverage vision and write it down.", "Identify 3 core industry metrics to double within 90 days.", "Create a functional, high-quality prototype or draft of my project."];
      case 'Finance':
        return ["Draft an absolute monthly zero-based budget.", "Set aside 10% of my gross income for giving and Kingdom support.", "Create an automated savings protocol representing 3 months of expenses."];
      case 'Health':
        return ["Train in physical exercise or endurance 4 times a week.", "Purge sugar and processed inputs from my diet completely.", "Sleep 7-8 hours a night to preserve mental and cognitive clarity."];
      case 'Relationships':
        return ["Schedule 1 weekly distraction-free night with spouse/loved ones.", "Have a difficult conversation with absolute tactical honesty.", "Identify and prune 2 relationships that drain my character and focus."];
      case 'Learning':
        return ["Read 3 seminal books in my professional or spiritual field.", "Practice hands-on engineering or technical studies 5 hours a week.", "Write a detailed reflection mapping my mistakes from the past quarter."];
    }
  };

  // Get Accountability Prompt for the Goal Sponsor
  const getSponsorQuestion = (mentorId: string, title: string): string => {
    switch (mentorId) {
      case 'steve-jobs':
        return `Is your current plan for "${title}" truly insanely great, or are you just playing it safe to fit in?`;
      case 'elon-musk':
        return `Have you reduced the goals for "${title}" down to physics-based first principles, or are you just duplicating others?`;
      case 'socrates':
        return `Do you actually know what you mean when you seek to achieve "${title}"? What is the unexamined motive behind it?`;
      case 'david-oyedepo':
        return `I declare that divine backing is released on your target for "${title}"! Are you ready to back it with covenant diligence?`;
      case 'joshua-selman':
        return `Have you built the value and competence required to sustain "${title}" once it manifests, or are you chasing shadows?`;
      case 'king-solomon':
        return `Remember, diligence in "${title}" will bring you before kings. Are you moving with patient integrity, or in reckless haste?`;
      default:
        return `How does "${title}" serve your long-term developmental growth? What is the next micro-milestone you will complete before tomorrow?`;
    }
  };

  return (
    <div id="goals-screen-root" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Target Creator Form */}
        <div className="lg:col-span-5 bg-[#16253d] rounded-2xl border border-slate-800 p-6 shadow-lg flex flex-col justify-between">
          <form onSubmit={handleCreateGoal} className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <CheckSquare className="w-5 h-5 text-emerald-400" />
              <h3 className="font-serif text-lg font-bold text-[#F8F5F0]">Create Target</h3>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Goal Title:</label>
              <input
                type="text"
                required
                placeholder="e.g. Build MentorMind MVP, Launch Budget..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#0D1B2A] border border-slate-700/80 rounded-xl py-2.5 px-3.5 text-sm text-[#F8F5F0] placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Life Domain:</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value as Goal['domain'])}
                  className="w-full bg-[#0D1B2A] border border-slate-700/80 rounded-xl py-2.5 px-3.5 text-xs text-[#F8F5F0] focus:outline-none focus:border-emerald-400 transition-all"
                >
                  {GOAL_DOMAINS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Mentor Sponsor:</label>
                <select
                  value={mentorSponsorId}
                  onChange={(e) => setMentorSponsorId(e.target.value)}
                  className="w-full bg-[#0D1B2A] border border-slate-700/80 rounded-xl py-2.5 px-3.5 text-xs text-[#F8F5F0] focus:outline-none focus:border-emerald-400 transition-all"
                >
                  {MENTORS.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Description / Why is this vital?</label>
              <textarea
                placeholder="Describe your vision and the unyielding reason you must achieve this..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-16 bg-[#0D1B2A] border border-slate-700/80 rounded-xl p-3 text-sm text-[#F8F5F0] placeholder-slate-500 focus:outline-none focus:border-emerald-400 resize-none leading-relaxed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Target Accomplishment Date:</label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-[#0D1B2A] border border-slate-700/80 rounded-xl py-2 px-3.5 text-xs text-[#F8F5F0] focus:outline-none focus:border-emerald-400 transition-all"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Milestones (One per line):</label>
                <span className="text-[8px] font-mono text-slate-500">Leave blank for default</span>
              </div>
              <textarea
                placeholder="e.g. Write business outline&#10;Develop core interface&#10;Deploy first sandbox"
                value={milestonesInput}
                onChange={(e) => setMilestonesInput(e.target.value)}
                className="w-full h-20 bg-[#0D1B2A] border border-slate-700/80 rounded-xl p-3 text-sm text-[#F8F5F0] placeholder-slate-500 focus:outline-none focus:border-emerald-400 resize-none leading-relaxed font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 text-[#0D1B2A] font-serif font-bold py-2.5 rounded-xl hover:bg-emerald-400 active:scale-95 shadow-lg transition-all text-sm flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create Sponsored Goal
            </button>
          </form>
        </div>

        {/* Right Column: Goal Cards Listing */}
        <div className="lg:col-span-7 bg-[#16253d] rounded-2xl border border-slate-800 p-6 shadow-lg space-y-4 max-h-[580px] overflow-y-auto">
          <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3">
            <Award className="w-5 h-5 text-emerald-400" />
            <h3 className="font-serif text-lg font-bold text-[#F8F5F0]">Active Sponsored Goals ({goals.length})</h3>
          </div>

          {goals.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <CheckSquare className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="font-serif text-slate-400 italic">No goals defined yet.</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">Select a specialized mentor sponsor and lay down your milestones to start tracking progress.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map(g => {
                const sponsor = MENTORS.find(m => m.id === g.mentorSponsorId);
                const isExpanded = expandedGoalId === g.id;
                
                return (
                  <div
                    key={g.id}
                    className={`border rounded-xl transition-all ${isExpanded ? 'bg-[#0e1724]/60 border-emerald-500/40' : 'bg-[#0e1724]/20 border-slate-800 hover:border-slate-700'}`}
                  >
                    {/* Collapsed view */}
                    <div
                      onClick={() => setExpandedGoalId(isExpanded ? null : g.id)}
                      className="p-4 flex items-center justify-between cursor-pointer"
                    >
                      <div className="space-y-2 flex-1 pr-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="bg-[#0D1B2A] border border-slate-800 text-[9px] font-mono px-2 py-0.5 rounded text-emerald-400">{g.domain}</span>
                          <span className="text-[10px] font-mono text-slate-400">Target: {g.targetDate}</span>
                        </div>

                        <h4 className="font-serif text-base font-bold text-[#F8F5F0] leading-tight">{g.title}</h4>

                        {/* Progress Bar */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-[#0D1B2A] rounded-full h-1.5 overflow-hidden border border-slate-800/50">
                            <div className="bg-emerald-400 h-full transition-all duration-300" style={{ width: `${g.progress}%` }}></div>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-[#F8F5F0] shrink-0">{g.progress}%</span>
                        </div>
                      </div>

                      {/* Mentor Badge */}
                      <div className="flex items-center gap-2">
                        <div
                          title={`Sponsor: ${sponsor?.name}`}
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-xs text-[#0D1B2A] shrink-0 ${sponsor?.color || 'bg-slate-400'}`}
                        >
                          {sponsor?.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                    </div>

                    {/* Expanded milestone check-off list */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden border-t border-slate-800/60 p-4 space-y-4 bg-[#0D1B2A]/20"
                        >
                          {g.description && (
                            <p className="text-xs font-serif italic text-slate-300 border-l border-slate-700 pl-3 py-1 leading-relaxed">
                              "{g.description}"
                            </p>
                          )}

                          {/* accountability section */}
                          {sponsor && (
                            <div className="bg-[#16253d] border border-slate-800 p-3 rounded-xl flex gap-3 items-start">
                              <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                              <div className="space-y-1">
                                <span className="text-[8px] font-mono text-[#D4AF37] uppercase tracking-wider font-bold">{sponsor.name} Sponsor Prompt:</span>
                                <p className="text-xs font-serif text-slate-200 leading-relaxed italic">
                                  "{getSponsorQuestion(g.mentorSponsorId, g.title)}"
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Milestones checklist */}
                          <div className="space-y-2">
                            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Milestones Checklist:</span>
                            <div className="space-y-1.5">
                              {g.milestones.map(m => (
                                <div
                                  key={m.id}
                                  onClick={() => toggleMilestone(g.id, m.id)}
                                  className="flex items-center gap-2.5 p-2 bg-[#0D1B2A]/40 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700 transition-all group"
                                >
                                  {m.completed ? (
                                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-slate-600 group-hover:text-emerald-400/50 shrink-0" />
                                  )}
                                  <span className={`text-xs ${m.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                                    {m.title}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 border-t border-slate-800 pt-3">
                            <button
                              type="button"
                              onClick={(e) => handleDeleteGoal(g.id, e)}
                              className="flex items-center gap-1 text-[10px] font-mono text-red-400 hover:text-red-300 bg-red-950/20 px-2.5 py-1.5 rounded border border-red-900/40 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete Goal
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
