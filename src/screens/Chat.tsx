import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, Sparkles, BookOpen, AlertTriangle, Play, HelpCircle, X, ChevronRight, RefreshCw, Layers } from 'lucide-react';
import { ChatMessage, ChatSession, Mentor, UserProfile } from '../types';
import { MENTORS } from '../data/mentors';
import { MentorMindDB } from '../lib/db';
import { OfflineMentorEngine, generatePanelResponse } from '../lib/offline-engine';

interface ChatProps {
  profile: UserProfile;
  initialMentorId?: string | null;
  clearInitialMentor?: () => void;
}

const TEMPLATES = [
  { label: "Deal with burnout", text: "I feel incredibly burned out and exhausted. How should I approach rest, alignment, and finding my spark again?" },
  { label: "Define my legacy", text: "How do I choose what is worth building over the next 10 years? What defines a great legacy?" },
  { label: "Align my budget", text: "Help me align my business strategy and personal finances with ethical stewardship and high-integrity principles." },
  { label: "Socratic questioning", text: "Challenge my current assumption that I need a massive amount of capital before starting my venture." }
];

export default function Chat({ profile, initialMentorId, clearInitialMentor }: ChatProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [selectedMentors, setSelectedMentors] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showMentorSelector, setShowMentorSelector] = useState(false);
  const [offlineStatus, setOfflineStatus] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat sessions from IndexedDB on startup
  useEffect(() => {
    async function loadSessions() {
      try {
        const stored = await MentorMindDB.getChatSessions();
        setSessions(stored);

        if (initialMentorId) {
          // Check if an existing session has exactly this mentor, otherwise start new
          const existing = stored.find(s => s.mentorIds.length === 1 && s.mentorIds[0] === initialMentorId);
          if (existing) {
            setCurrentSession(existing);
            setSelectedMentors(existing.mentorIds);
          } else {
            handleStartNewSession([initialMentorId]);
          }
          if (clearInitialMentor) clearInitialMentor();
        } else if (stored.length > 0) {
          setCurrentSession(stored[0]);
          setSelectedMentors(stored[0].mentorIds);
        } else {
          // Default start with Steve Jobs
          handleStartNewSession(['steve-jobs']);
        }
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    }
    loadSessions();
  }, [initialMentorId]);

  // Handle auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages, sending]);

  const handleStartNewSession = async (mentorIds: string[]) => {
    const activeIds = mentorIds.length > 0 ? mentorIds : ['steve-jobs'];
    const mentorNames = activeIds.map(id => MENTORS.find(m => m.id === id)?.name || id).join(', ');
    
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: activeIds.length === 1 ? `Dialogue with ${mentorNames}` : `Panel with ${activeIds.length} Mentors`,
      mentorIds: activeIds,
      messages: [
        {
          id: `msg-welcome-${Date.now()}`,
          sender: 'system',
          text: `Welcome to your customized sanctuary. You are now seated with **${mentorNames}**. Speak freely, ask deep questions, or present your current career or spiritual dilemmas.`,
          timestamp: new Date().toISOString()
        }
      ],
      timestamp: new Date().toISOString()
    };

    try {
      await MentorMindDB.saveChatSession(newSession);
      setSessions(prev => [newSession, ...prev]);
      setCurrentSession(newSession);
      setSelectedMentors(activeIds);
      setShowMentorSelector(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const msgText = (textToSend || inputMessage).trim();
    if (!msgText || !currentSession || sending) return;

    if (!textToSend) setInputMessage('');

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: msgText,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...currentSession.messages, userMsg];
    const updatedSession: ChatSession = {
      ...currentSession,
      messages: updatedMessages,
      timestamp: new Date().toISOString()
    };

    // Optimistically update UI & IndexedDB
    setCurrentSession(updatedSession);
    await MentorMindDB.saveChatSession(updatedSession);

    setSending(true);
    setOfflineStatus(false);

    try {
      // Build mentor prompts dictionary
      const mentorPrompts: Record<string, string> = {};
      selectedMentors.forEach(id => {
        const m = MENTORS.find(mentor => mentor.id === id);
        if (m) mentorPrompts[id] = m.systemPrompt;
      });

      // Retrieve latest active goals and recent journals for dynamic agentic context
      const [allGoals, allJournals] = await Promise.all([
        MentorMindDB.getGoals(),
        MentorMindDB.getJournals()
      ]);

      const activeGoals = allGoals.filter(g => g.status === 'active');
      const recentJournals = allJournals.slice(0, 3); // last 3 entries

      // Call API proxy
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msgText,
          history: updatedMessages.filter(m => m.sender !== 'system').slice(-6), // Send last 6 messages
          mentorIds: selectedMentors,
          mentorPrompts,
          userName: profile.name,
          activeGoals: activeGoals.map(g => ({ title: g.title, domain: g.domain, progress: g.progress })),
          recentJournals: recentJournals.map(j => ({ date: j.date, type: j.type, content: j.content })),
          creativity: profile.creativity
        })
      });

      const data = await response.json();

      if (data.offlineMode) {
        // Safe degrade to offline rule engine
        triggerOfflineFallback(msgText, updatedSession);
      } else {
        const assistantMsg: ChatMessage = {
          id: `msg-assistant-${Date.now()}`,
          sender: selectedMentors.length === 1 ? selectedMentors[0] : 'panel',
          text: data.text,
          timestamp: new Date().toISOString(),
          isOffline: false
        };

        const finalSession = {
          ...updatedSession,
          messages: [...updatedMessages, assistantMsg]
        };

        setCurrentSession(finalSession);
        await MentorMindDB.saveChatSession(finalSession);
      }

    } catch (err) {
      console.log("Network error, falling back offline:", err);
      triggerOfflineFallback(msgText, updatedSession);
    } finally {
      setSending(false);
    }
  };

  const triggerOfflineFallback = async (query: string, session: ChatSession) => {
    setOfflineStatus(true);
    let assistantMsg: ChatMessage;

    if (selectedMentors.length === 1) {
      const engine = new OfflineMentorEngine(selectedMentors[0]);
      const res = engine.generateResponse(query, profile.name);
      assistantMsg = {
        id: `msg-offline-${Date.now()}`,
        sender: selectedMentors[0],
        text: res.text,
        timestamp: new Date().toISOString(),
        sources: res.sources,
        reflectionPrompt: res.reflectionPrompt,
        isOffline: true
      };
    } else {
      assistantMsg = generatePanelResponse(query, selectedMentors, profile.name);
    }

    const finalSession = {
      ...session,
      messages: [...session.messages, assistantMsg]
    };

    setCurrentSession(finalSession);
    await MentorMindDB.saveChatSession(finalSession);
  };

  const toggleMentorSelection = (id: string) => {
    setSelectedMentors(prev => {
      if (prev.includes(id)) {
        // Prevent clearing all
        if (prev.length === 1) return prev;
        return prev.filter(mId => mId !== id);
      } else {
        // Limit to 3 mentors in panel mode for beautiful text generation
        if (prev.length >= 3) return prev;
        return [...prev, id];
      }
    });
  };

  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await MentorMindDB.deleteChatSession(id);
      const updated = sessions.filter(s => s.id !== id);
      setSessions(updated);

      if (currentSession?.id === id) {
        if (updated.length > 0) {
          setCurrentSession(updated[0]);
          setSelectedMentors(updated[0].mentorIds);
        } else {
          handleStartNewSession(['steve-jobs']);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="chat-screen-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-140px)]">
      
      {/* 1. Sidebar history (Left Column) */}
      <div className="lg:col-span-3 flex flex-col bg-[#16253d] rounded-2xl border border-slate-800 p-4 space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Dialogue Logs</h3>
          <button
            type="button"
            onClick={() => setShowMentorSelector(true)}
            className="text-[10px] font-mono px-2 py-1 rounded bg-[#0D1B2A] text-[#D4AF37] border border-slate-800 hover:border-[#D4AF37] transition-all"
          >
            + New Consultation
          </button>
        </div>

        <div className="space-y-2 flex-1 overflow-y-auto pr-1">
          {sessions.map(s => {
            const isActive = currentSession?.id === s.id;
            return (
              <div
                key={s.id}
                onClick={() => {
                  setCurrentSession(s);
                  setSelectedMentors(s.mentorIds);
                }}
                className={`w-full text-left p-3 rounded-xl cursor-pointer border transition-all flex items-center justify-between group ${isActive ? 'bg-[#0D1B2A] border-[#D4AF37]/40 text-[#F8F5F0]' : 'bg-[#0e1724]/40 border-slate-800/80 hover:border-slate-700 text-slate-300'}`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <MessageSquare className="w-4 h-4 shrink-0 text-[#D4AF37]" />
                  <span className="text-xs font-serif font-semibold truncate leading-tight pr-2">{s.title}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleDeleteSession(s.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all text-slate-500 shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Active Chat Panel (Right Column) */}
      <div className="lg:col-span-9 flex flex-col bg-[#16253d] rounded-2xl border border-slate-800 max-h-[calc(100vh-140px)] h-full overflow-hidden">
        
        {/* Active Session Header */}
        <div className="border-b border-slate-800 bg-[#16253d] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {selectedMentors.map(id => {
                const m = MENTORS.find(mentor => mentor.id === id);
                return (
                  <div
                    key={id}
                    title={m?.name}
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-serif font-bold text-xs text-[#0D1B2A] border-2 border-[#16253d] ${m?.color || 'bg-slate-400'}`}
                  >
                    {m?.name.split(' ').map(n => n[0]).join('')}
                  </div>
                );
              })}
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-[#F8F5F0]">
                {selectedMentors.length === 1 
                  ? `Seated with ${MENTORS.find(m => m.id === selectedMentors[0])?.name}` 
                  : `Seated with ${selectedMentors.length} Mentors (Panel Mode)`}
              </h4>
              <p className="text-[10px] text-slate-400 font-mono">
                Active counsel: {selectedMentors.map(id => MENTORS.find(m => m.id === id)?.name).join(' • ')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowMentorSelector(true)}
            className="flex items-center gap-1.5 text-xs font-mono text-[#D4AF37] border border-[#D4AF37]/20 px-3 py-1.5 rounded-lg hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all"
          >
            <Layers className="w-3.5 h-3.5" /> Add/Edit Mentors
          </button>
        </div>

        {/* Offline notification banner */}
        {offlineStatus && (
          <div className="bg-amber-950/40 border-b border-amber-900/60 p-2 px-4 flex items-center gap-2 text-xs text-amber-300 font-mono">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Operating in <strong>Offline Wisdom Mode</strong>. Matching query keywords with our offline teachings library.</span>
          </div>
        )}

        {/* Conversation messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0D1B2A]/30">
          {currentSession?.messages.map((m) => {
            const isUser = m.sender === 'user';
            const isSystem = m.sender === 'system';
            const senderMentor = !isUser && !isSystem ? MENTORS.find(mentor => mentor.id === m.sender) : null;

            if (isSystem) {
              return (
                <div key={m.id} className="flex justify-center my-2">
                  <div className="bg-[#16253d] border border-slate-800/80 text-xs text-slate-300 px-4 py-2 rounded-xl max-w-lg text-center font-sans leading-relaxed">
                    {m.text}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && senderMentor && (
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-serif font-bold text-xs text-[#0D1B2A] ${senderMentor.color}`}>
                    {senderMentor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                
                <div className="max-w-[80%] space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500">
                      {isUser ? 'You' : (senderMentor?.name || 'Mentor Panel')}
                    </span>
                    {m.isOffline && (
                      <span className="bg-amber-900/40 text-amber-400 border border-amber-800/60 text-[8px] font-mono px-1 rounded uppercase">Offline Mode</span>
                    )}
                  </div>

                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${isUser ? 'bg-[#D4AF37] text-[#0D1B2A] font-semibold rounded-tr-none' : 'bg-[#16253d] text-[#F8F5F0] border border-slate-800 rounded-tl-none font-sans'}`}>
                    {/* Render paragraphs correctly */}
                    <div className="whitespace-pre-line space-y-2">
                      {m.text}
                    </div>

                    {/* Sources reference if offline match */}
                    {!isUser && m.sources && m.sources.length > 0 && (
                      <div className="mt-4 pt-2 border-t border-slate-800/50 text-[11px] text-slate-400 font-mono">
                        📚 Verified Core Sources: {m.sources.join(', ')}
                      </div>
                    )}

                    {/* Offline reflection prompt if present */}
                    {!isUser && m.reflectionPrompt && (
                      <div className="mt-3 p-3 bg-[#0e1724]/60 border border-slate-800 rounded-xl text-xs space-y-1.5">
                        <div className="font-mono text-[10px] text-[#D4AF37] uppercase font-bold tracking-wider">Reflection Prompt:</div>
                        <div className="text-slate-300 italic font-serif">"{m.reflectionPrompt}"</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-slate-800 bg-[#16253d] space-y-3">
          {/* Templates checklist for first interactions */}
          {currentSession?.messages.length === 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[10px] font-mono text-slate-400 shrink-0">Sample prompts:</span>
              {TEMPLATES.map((t, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setInputMessage(t.text)}
                  className="text-[10px] font-mono bg-[#0D1B2A] text-slate-300 border border-slate-800 hover:border-[#D4AF37] px-2.5 py-1 rounded-lg transition-all whitespace-nowrap shrink-0"
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder={sending ? "Mentors are writing counsel..." : "Ask your mentors a question..."}
              disabled={sending}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-[#0D1B2A] border border-slate-700/80 rounded-xl py-3 px-4 text-sm text-[#F8F5F0] placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] transition-all"
            />
            <button
              type="submit"
              disabled={sending || !inputMessage.trim()}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${sending || !inputMessage.trim() ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-[#D4AF37] text-[#0D1B2A] hover:bg-amber-400 active:scale-95 shadow-lg'}`}
            >
              {sending ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>

      {/* 3. Modal Roster selector */}
      <AnimatePresence>
        {showMentorSelector && (
          <div className="fixed inset-0 bg-[#060a10]/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#16253d] border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl flex flex-col max-h-[85vh]"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#F8F5F0]">Convene Mentor Panel</h3>
                  <p className="text-xs text-slate-400 font-mono">Select 1 to 3 mentors to guide this dialogue session</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMentorSelector(false)}
                  className="p-1 hover:text-[#D4AF37] text-slate-400 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mentors grid */}
              <div className="flex-1 overflow-y-auto py-4 grid grid-cols-2 sm:grid-cols-3 gap-2 pr-1">
                {MENTORS.map(m => {
                  const isSelected = selectedMentors.includes(m.id);
                  return (
                    <div
                      key={m.id}
                      onClick={() => toggleMentorSelection(m.id)}
                      className={`p-3 rounded-xl border cursor-pointer text-left transition-all relative ${isSelected ? 'bg-[#0D1B2A] border-[#D4AF37]/50 shadow-md' : 'bg-[#0e1724]/40 border-slate-800 hover:border-slate-700'}`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-[#D4AF37] text-[#0D1B2A] w-4 h-4 rounded-full flex items-center justify-center font-mono text-[9px] font-bold">
                          ✓
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-serif font-bold text-[10px] text-[#0D1B2A] ${m.color}`}>
                          {m.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-xs font-serif font-semibold text-[#F8F5F0] truncate block max-w-[110px]">{m.name}</span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">{m.category}</p>
                      <p className="text-[10px] text-slate-300 font-sans line-clamp-1 mt-1 leading-normal">{m.title}</p>
                    </div>
                  );
                })}
              </div>

              {/* Actions footer */}
              <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
                <span className="text-xs font-mono text-[#D4AF37]">
                  Selected: {selectedMentors.length}/3 mentors
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowMentorSelector(false)}
                    className="text-xs font-mono px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartNewSession(selectedMentors)}
                    className="text-xs font-serif font-bold px-5 py-2 rounded-lg bg-[#D4AF37] text-[#0D1B2A] hover:bg-amber-400 active:scale-95 shadow-md transition-all"
                  >
                    Assemble Session
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
