import React, { useState } from 'react';
import { Search, Compass, BookOpen, Quote, ChevronRight, User, Filter, ArrowRight, MessageSquare, Copy, Check } from 'lucide-react';
import { MENTORS, WISDOM_SEEDS } from '../data/mentors';
import { Mentor, WisdomQuote } from '../types';

interface LibraryProps {
  setTab: (tab: string) => void;
  onSelectMentorForChat: (mentorId: string) => void;
}

export default function Library({ setTab, onSelectMentorForChat }: LibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'intellectual' | 'spiritual'>('all');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [copiedQuoteId, setCopiedQuoteId] = useState<string | null>(null);

  // Filter quotes based on search query
  const filteredQuotes = WISDOM_SEEDS.filter(q => {
    const mentor = MENTORS.find(m => m.id === q.mentorId);
    if (!mentor) return false;

    // Apply category filter
    const lowerCategory = mentor.category.toLowerCase();
    if (categoryFilter === 'intellectual' && !['builder', 'philosopher'].includes(lowerCategory)) {
      return false;
    }
    if (categoryFilter === 'spiritual' && !['faith', 'orthodox'].includes(lowerCategory)) {
      return false;
    }

    // Apply text query
    const matchStr = `${q.quote} ${q.source} ${mentor.name} ${q.theme.join(' ')}`.toLowerCase();
    return matchStr.includes(searchQuery.toLowerCase());
  });

  // Filter mentors based on category
  const filteredMentors = MENTORS.filter(m => {
    const lowerCategory = m.category.toLowerCase();
    if (categoryFilter === 'intellectual') {
      return ['builder', 'philosopher'].includes(lowerCategory);
    }
    if (categoryFilter === 'spiritual') {
      return ['faith', 'orthodox'].includes(lowerCategory);
    }
    return true;
  });

  const handleCopyQuote = (quoteText: string, id: string) => {
    navigator.clipboard.writeText(quoteText);
    setCopiedQuoteId(id);
    setTimeout(() => setCopiedQuoteId(null), 2000);
  };

  const startMentorSession = (mentorId: string) => {
    onSelectMentorForChat(mentorId);
    setTab('chat');
  };

  return (
    <div id="library-screen-root" className="space-y-6">
      
      {/* 1. Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#16253d] rounded-2xl p-6 border border-slate-800 shadow-md">
        <div className="space-y-1.5 flex-1 max-w-md">
          <div className="flex items-center gap-2 text-[#D4AF37]">
            <Compass className="w-5 h-5" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest">Preseeded Sanctuary</h3>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#F8F5F0]">180 Seeded Wisdom Seeds</h2>
          <p className="text-xs text-slate-400 font-sans">Search teachings and explore mentors compiled from books, interviews, and public domains.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className={`text-xs px-3 py-1.5 rounded-lg border font-mono transition-all ${categoryFilter === 'all' ? 'bg-[#D4AF37] text-[#0D1B2A] border-[#D4AF37]' : 'bg-[#0D1B2A] text-slate-400 border-slate-800 hover:border-slate-700'}`}
          >
            All Seeds
          </button>
          <button
            type="button"
            onClick={() => categoryFilter !== 'intellectual' ? setCategoryFilter('intellectual') : setCategoryFilter('all')}
            className={`text-xs px-3 py-1.5 rounded-lg border font-mono transition-all ${categoryFilter === 'intellectual' ? 'bg-[#D4AF37] text-[#0D1B2A] border-[#D4AF37]' : 'bg-[#0D1B2A] text-slate-400 border-slate-800 hover:border-slate-700'}`}
          >
            Intellectual
          </button>
          <button
            type="button"
            onClick={() => categoryFilter !== 'spiritual' ? setCategoryFilter('spiritual') : setCategoryFilter('all')}
            className={`text-xs px-3 py-1.5 rounded-lg border font-mono transition-all ${categoryFilter === 'spiritual' ? 'bg-[#D4AF37] text-[#0D1B2A] border-[#D4AF37]' : 'bg-[#0D1B2A] text-slate-400 border-slate-800 hover:border-slate-700'}`}
          >
            Faith Leaders
          </button>
        </div>
      </div>

      {/* 2. Interactive Search Area */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
        <input
          type="text"
          placeholder="Search themes, leaders, or core keywords (e.g. 'focus', 'faith', 'stewardship', 'discipline')..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#16253d] border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm text-[#F8F5F0] placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] transition-all"
        />
      </div>

      {/* 3. Conditional Layouts: Search Query vs Browse Mentors */}
      {searchQuery.trim().length > 0 ? (
        // Search Results view
        <div className="bg-[#16253d] rounded-2xl border border-slate-800 p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#F8F5F0]">Search Results ({filteredQuotes.length} matched)</h3>
          
          {filteredQuotes.length === 0 ? (
            <div className="text-center py-16 text-slate-500 font-serif italic">
              No wisdom fragments matched your keywords. Try searching for 'diligent', 'focus', or 'covenant'.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
              {filteredQuotes.map(q => {
                const mentor = MENTORS.find(m => m.id === q.mentorId);
                return (
                  <div key={q.id} className="bg-[#0D1B2A]/40 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between space-y-4">
                    <blockquote className="text-xs font-serif italic text-slate-300 leading-relaxed">
                      "{q.quote}"
                    </blockquote>

                    <div className="flex items-center justify-between border-t border-slate-800/60 pt-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-serif font-bold text-[9px] text-[#0D1B2A] ${mentor?.color || 'bg-slate-400'}`}>
                          {mentor?.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-[#F8F5F0] block leading-tight">{mentor?.name}</span>
                          <span className="text-[8px] text-slate-500 font-mono italic">{q.source}</span>
                        </div>
                      </div>

                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyQuote(q.quote, q.id)}
                          className="p-1.5 text-slate-400 hover:text-[#D4AF37] transition-all bg-[#0D1B2A] border border-slate-800 rounded-md"
                          title="Copy quote"
                        >
                          {copiedQuoteId === q.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => startMentorSession(q.mentorId)}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 transition-all bg-[#0D1B2A] border border-slate-800 rounded-md"
                          title="Consult Mentor"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        // Standard Mentor roster exploration grid
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Mentors roster listing */}
          <div className="lg:col-span-5 bg-[#16253d] rounded-2xl border border-slate-800 p-6 shadow-lg flex flex-col space-y-4 max-h-[500px] overflow-y-auto">
            <h3 className="font-serif text-lg font-bold text-[#F8F5F0] border-b border-slate-800/60 pb-2">Select a Mentor</h3>
            
            <div className="space-y-2 pr-1">
              {filteredMentors.map(m => {
                const isSelected = selectedMentor?.id === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMentor(m)}
                    className={`p-3 rounded-xl cursor-pointer border transition-all flex items-center justify-between ${isSelected ? 'bg-[#0D1B2A] border-[#D4AF37]/50 text-[#F8F5F0]' : 'bg-[#0e1724]/20 border-slate-800/80 hover:border-slate-700 text-slate-300'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-serif font-bold text-xs text-[#0D1B2A] ${m.color}`}>
                        {m.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <span className="text-xs font-serif font-bold block">{m.name}</span>
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">{m.category} • {m.title}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Profile details & static wisdom seeds list */}
          <div className="lg:col-span-7 bg-[#16253d] rounded-2xl border border-slate-800 p-6 shadow-lg flex flex-col justify-between min-h-[460px]">
            {selectedMentor ? (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                
                {/* Profile detail */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-serif font-bold text-base text-[#0D1B2A] ${selectedMentor.color}`}>
                      {selectedMentor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#F8F5F0]">{selectedMentor.name}</h3>
                      <p className="text-xs font-mono text-[#D4AF37] uppercase tracking-widest">{selectedMentor.title}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                    <div className="space-y-1 bg-[#0D1B2A]/40 border border-slate-800 p-3 rounded-xl">
                      <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block">Key Teachings</span>
                      <p className="text-slate-300 leading-relaxed font-serif italic">"{selectedMentor.teachings.slice(0, 3).join(', ')}..."</p>
                    </div>
                    <div className="space-y-1 bg-[#0D1B2A]/40 border border-slate-800 p-3 rounded-xl">
                      <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block">Recommended Resources</span>
                      <p className="text-slate-300 leading-relaxed font-serif italic">"{selectedMentor.resources.slice(0, 2).join(' • ')}"</p>
                    </div>
                  </div>

                  {/* Seed quotes lists */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Featured Teachings (Seeded quotes):</span>
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {WISDOM_SEEDS.filter(q => q.mentorId === selectedMentor.id).map(q => (
                        <div key={q.id} className="p-3 bg-[#0D1B2A]/20 border border-slate-800/60 rounded-xl space-y-1">
                          <p className="text-[11px] font-serif italic text-slate-200">"{q.quote}"</p>
                          <span className="text-[9px] font-mono text-slate-500">— {q.source}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => startMentorSession(selectedMentor.id)}
                  className="w-full text-center py-2.5 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-[#0D1B2A] font-serif font-bold text-sm shadow-md flex items-center justify-center gap-1.5 mt-4"
                >
                  <MessageSquare className="w-4 h-4" /> Start Dialogue with {selectedMentor.name}
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
                <BookOpen className="w-12 h-12 text-slate-600" />
                <p className="font-serif text-slate-400 italic">Select any mentor profile on the left column to explore their key teachings, resources, and pre-seeded wisdom passages.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
