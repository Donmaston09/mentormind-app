import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Brain, Compass, BookOpen, User, Check } from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [slide, setSlide] = useState(0);
  const [userName, setUserName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'intellectual' | 'spiritual'>('all');

  const slides = [
    {
      title: "Welcome to MentorMind",
      subtitle: "A sanctuary of wisdom at your fingertips",
      icon: <Compass className="w-16 h-16 text-[#D4AF37] mb-4" />,
      content: "Sit at the feet of the world's greatest intellectual builders, classical philosophers, and anointed spiritual leaders. This app is designed to guide your daily reflection, clarify your goals, and speak into your life with unyielding wisdom."
    },
    {
      title: "Meet Your Mentors",
      subtitle: "18 minds, structured to coach you",
      icon: <Brain className="w-16 h-16 text-[#7B2FBE] mb-4" />,
      content: "Choose from visionary innovators like Steve Jobs and Elon Musk, rigorous thinkers like Socrates and Aristotle, or faith pioneers like Bishop David Oyedepo and Joshua Selman. Engage in single chats or multi-mentor panels to weigh decisions from every angle."
    },
    {
      title: "Create Your Sanctuary",
      subtitle: "Let's personalize your experience",
      icon: <Sparkles className="w-16 h-16 text-emerald-400 mb-4" />,
      content: "We preserve your journals, goals, and reflections privately on your device. Let's begin by learning how you would like your mentors to address you."
    }
  ];

  const handleNext = () => {
    if (slide < 2) {
      setSlide(slide + 1);
    } else {
      // Validate name
      const trimmedName = userName.trim() || 'Seeker';
      const initialProfile: UserProfile = {
        name: trimmedName,
        onboarded: true,
        apiKey: '',
        streaks: { current: 1, longest: 1, lastActiveDate: new Date().toISOString().split('T')[0] },
        spiritualTrack: { studyCount: 0, prayerMinutes: 0, fastingDays: 0, givingCount: 0 },
        preferredMentors: selectedCategory === 'intellectual' 
          ? ['steve-jobs', 'elon-musk', 'socrates'] 
          : selectedCategory === 'spiritual' 
            ? ['david-oyedepo', 'joshua-selman', 'paul-enenche']
            : ['steve-jobs', 'socrates', 'david-oyedepo', 'joshua-selman'],
        dailyCheckedDate: new Date().toISOString().split('T')[0],
        creativity: 0.85
      };
      onComplete(initialProfile);
    }
  };

  return (
    <div id="onboarding-root" className="min-h-screen bg-[#0D1B2A] bg-mesh-gradient flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-[#16253d] rounded-2xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#1e293b] flex">
          <div className="bg-[#D4AF37] h-full transition-all duration-300" style={{ width: `${((slide + 1) / 3) * 100}%` }}></div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center min-h-[360px] justify-center"
          >
            {slides[slide].icon}
            <h1 className="font-serif text-3xl font-bold tracking-tight text-[#F8F5F0] mb-2">{slides[slide].title}</h1>
            <p className="text-xs text-[#D4AF37] font-mono tracking-widest uppercase mb-4">{slides[slide].subtitle}</p>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm mb-6">{slides[slide].content}</p>

            {slide === 2 && (
              <div className="w-full space-y-4 mb-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter your name..."
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    maxLength={20}
                    className="w-full bg-[#0D1B2A] border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-[#F8F5F0] placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] transition-all"
                  />
                </div>
                
                <div className="text-left">
                  <label className="text-xs font-mono text-[#D4AF37] block mb-2">My primary focus is:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('all')}
                      className={`text-xs py-2 rounded-lg border font-medium transition-all ${selectedCategory === 'all' ? 'bg-[#D4AF37] text-[#0D1B2A] border-[#D4AF37]' : 'bg-[#0D1B2A] text-slate-300 border-slate-700'}`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('intellectual')}
                      className={`text-xs py-2 rounded-lg border font-medium transition-all ${selectedCategory === 'intellectual' ? 'bg-[#D4AF37] text-[#0D1B2A] border-[#D4AF37]' : 'bg-[#0D1B2A] text-slate-300 border-slate-700'}`}
                    >
                      Intellectual
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('spiritual')}
                      className={`text-xs py-2 rounded-lg border font-medium transition-all ${selectedCategory === 'spiritual' ? 'bg-[#D4AF37] text-[#0D1B2A] border-[#D4AF37]' : 'bg-[#0D1B2A] text-slate-300 border-slate-700'}`}
                    >
                      Faith
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={() => slide > 0 && setSlide(slide - 1)}
            disabled={slide === 0}
            className={`text-xs font-mono font-medium tracking-wide uppercase transition-all ${slide === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-[#D4AF37] hover:text-amber-400'}`}
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 bg-[#D4AF37] text-[#0D1B2A] font-serif font-bold text-sm px-6 py-2.5 rounded-lg shadow-lg hover:bg-amber-400 active:scale-95 transition-all"
          >
            {slide === 2 ? 'Enter Sanctuary' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
