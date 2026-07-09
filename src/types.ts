export interface Mentor {
  id: string;
  name: string;
  category: 'intellectual' | 'spiritual';
  title: string;
  bio: string;
  systemPrompt: string;
  color: string; // Tailwind class color for UI avatars (e.g. 'bg-amber-500')
  borderColor: string;
  textColor: string;
  keyTeachings: string[];
  resources: string[]; // Books, sermons, etc.
}

export interface WisdomQuote {
  id: string;
  mentorId: string;
  quote: string;
  source: string;
  theme: string[];
  reflection_prompt: string;
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  time: string;
  type: 'morning' | 'evening';
  content: string;
  tags: string[];
  aiAnalysis?: {
    summary: string;
    themes: string[];
    blindSpots: string[];
    growthAreas: string[];
    sentiment: 'positive' | 'reflective' | 'struggling' | 'determined' | 'neutral';
    coachingQuestion: string;
  };
  syncStatus: 'synced' | 'pending';
}

export interface GoalMilestone {
  id: string;
  title: string;
  completed: boolean;
  targetDate?: string;
}

export interface Goal {
  id: string;
  title: string;
  domain: 'Spiritual' | 'Career' | 'Finance' | 'Health' | 'Relationships' | 'Learning';
  mentorSponsorId: string;
  description: string;
  targetDate: string;
  milestones: GoalMilestone[];
  progress: number; // 0 - 100
  createdAt: string;
  status: 'active' | 'completed' | 'paused';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | string; // 'user' or mentorId
  text: string;
  timestamp: string;
  sources?: string[];
  reflectionPrompt?: string;
  isOffline?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  mentorIds: string[];
  messages: ChatMessage[];
  timestamp: string;
}

export interface UserProfile {
  name: string;
  onboarded: boolean;
  apiKey: string; // Optional custom API key, though server-side is default
  streaks: {
    current: number;
    longest: number;
    lastActiveDate?: string;
  };
  spiritualTrack: {
    studyCount: number;
    prayerMinutes: number;
    fastingDays: number;
    givingCount: number;
    lastUpdated?: string;
  };
  preferredMentors: string[];
  dailyCheckedDate?: string;
  creativity?: number;
}

export interface DailyState {
  date: string; // YYYY-MM-DD
  wisdomCardId: string;
  focusTheme: string;
  devotionalText?: string;
  scriptureRef?: string;
  prayerFocus?: string;
}
