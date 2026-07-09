import { WISDOM_SEEDS, MENTORS } from '../data/mentors';
import { ChatMessage } from '../types';

// Simple stop words to filter out before keyword matching
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'cant', 'cannot', 'could',
  'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont', 'down', 'during', 'each', 'few', 'for', 'from', 'further',
  'had', 'hadnt', 'has', 'hasnt', 'have', 'havent', 'having', 'he', 'hed', 'hell', 'hes', 'her', 'here', 'heres',
  'hers', 'herself', 'him', 'himself', 'his', 'how', 'hows', 'i', 'id', 'ill', 'im', 'ive', 'if', 'in', 'into', 'is',
  'isnt', 'it', 'its', 'itself', 'lets', 'me', 'more', 'most', 'mustnt', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off',
  'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shant', 'she',
  'shed', 'shell', 'shes', 'should', 'shouldnt', 'so', 'some', 'such', 'than', 'that', 'thats', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'theres', 'these', 'they', 'theyd', 'theyll', 'theyre', 'theyve', 'this',
  'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasnt', 'we', 'wed', 'well', 'were', 'weve',
  'werent', 'what', 'whats', 'when', 'whens', 'where', 'wheres', 'which', 'while', 'who', 'whos', 'whom', 'why', 'whys',
  'with', 'wont', 'would', 'wouldnt', 'you', 'youd', 'youll', 'youre', 'youve', 'your', 'yours', 'yourself', 'yourselves'
]);

// Custom voice templates for each mentor to assemble offline messages
const MENTOR_VOICES: Record<string, {
  greetings: string[];
  transitions: string[];
  outros: string[];
  fallbacks: string[];
}> = {
  'steve-jobs': {
    greetings: [
      "Look, let's be honest about this.",
      "Here's my perspective on what you're dealing with."
    ],
    transitions: [
      "It reminds me of a core belief I've carried for decades:",
      "We always tried to apply this level of extreme focus at Apple:"
    ],
    outros: [
      "Is what you are doing right now truly excellent, or are you just settling to be safe?",
      "Go back and simplify it. Make it insanely great."
    ],
    fallbacks: [
      "Your time is limited, so don't waste it living someone else's life. Trust your intuition.",
      "Details matter. It's worth waiting to get it right. Don't compromise."
    ]
  },
  'bill-gates': {
    greetings: [
      "Let's break this down systematically.",
      "If we look at the metrics and the scale of this problem..."
    ],
    transitions: [
      "My work with software and global development taught me a key system rule:",
      "To find the leverage point here, we should look at this principle:"
    ],
    outros: [
      "What is the feedback loop you've set up here? Are you tracking the right metrics?",
      "Keep reading, keep studying, and build a scalable system for this."
    ],
    fallbacks: [
      "Success is a lousy teacher. It seduces smart people into thinking they can't lose. Let's analyze the failure modes.",
      "To solve any complex equation, we must isolate the key variables first."
    ]
  },
  'elon-musk': {
    greetings: [
      "Well... let's reduce this to first-principles physics.",
      "Okay, we have to look at the raw calculations of this situation."
    ],
    transitions: [
      "If you strip away the analogies and conventional rules, we find:",
      "This is a fundamental truth we always optimize for:"
    ],
    outros: [
      "What is the absolute physical limit of what you are trying to do here?",
      "Work like hell. 80 hours a week makes the impossible achievable. Let's execute."
    ],
    fallbacks: [
      "Never optimize a thing that should not exist. Delete the unnecessary rules.",
      "Persistence is very important. You should not give up unless you are forced to give up."
    ]
  },
  'socrates': {
    greetings: [
      "My friend, you ask a profound question. But let us first examine what we mean by this.",
      "I am delighted by your query, though I myself know very little. Let us inquire together."
    ],
    transitions: [
      "Consider this: if a person seeks the truth, must they not first weigh this idea?",
      "Let us test this assumption against a classic premise:"
    ],
    outros: [
      "But tell me: what do you mean by success in this? And what would follow if you achieved it?",
      "Remember, the unexamined life is not worth living. What are your truest motives here?"
    ],
    fallbacks: [
      "I only know one thing, and that is that I know nothing. Let us continue questioning.",
      "To find yourself, you must first commit to thinking for yourself."
    ]
  },
  'david-oyedepo': {
    greetings: [
      "I declare over your life: Covenant secrets are opening up to you now!",
      "Hear this: You are not redeemed to be a failure! You have a dominion mandate!"
    ],
    transitions: [
      "The mouth of God has declared this unshakeable covenant secret:",
      "Listen, exploits are not a product of luck; they are a product of covenant obedience:"
    ],
    outros: [
      "I declare unshakeable faith rises in your spirit today! Go and rule your field!",
      "Are you acting on the Word? Faith is not a feeling, it is a spiritual law! Put it to work!"
    ],
    fallbacks: [
      "No one ever arrives at a future he did not prepare for. Preparation is the mother of manifestation!",
      "Your mouth is a weapon of war! Speak what you want to see, not what you currently feel!"
    ]
  },
  'joshua-selman': {
    greetings: [
      "God bless you. It is a joy to speak with you about these spiritual laws.",
      "Let us approach this with systematic, scriptural clarity. It is about understanding."
    ],
    transitions: [
      "There is a spiritual law of the Kingdom that governs this result:",
      "When we study the patterns of personal and mental transformation, we find:"
    ],
    outros: [
      "My prayer for you is that value and competence rise in your life, giving you true influence.",
      "Never let your achievements outgrow your humility. Remain aligned to Christ."
    ],
    fallbacks: [
      "Mental transformation is the precursor to personal transformation. Your mind must be renewed.",
      "The commodity of relationships is trust. It must be earned and preserved over time."
    ]
  },
  'king-solomon': {
    greetings: [
      "My child, pay attention to wisdom; lend your ear to understanding.",
      "In my royal reign, I saw many things under the sun. Hear this counsel."
    ],
    transitions: [
      "I wrote of this in my proverbs, and it remains a lamp for diligence:",
      "Remember this sober axiom when navigating this path:"
    ],
    outros: [
      "Above all else, guard your heart, for everything you do flows from it.",
      "Do not be in haste, for haste leads to poverty. Let diligence have its perfect work."
    ],
    fallbacks: [
      "Pride goes before destruction, and a haughty spirit before a fall. Walk in quiet humility.",
      "To everything there is a season, and a time to every purpose under heaven."
    ]
  }
};

// Generic default templates for mentors who don't have custom offline speech profiles
const DEFAULT_VOICES = {
  greetings: [
    "Thank you for sharing this dilemma.",
    "Let's look at this situation closely."
  ],
  transitions: [
    "A key teaching from my life's work directly speaks into this:",
    "In my experience, this is the foundational truth:"
  ],
  outros: [
    "What is the first constructive step you can take today based on this advice?",
    "Keep studying, keep executing, and stay dedicated to your core values."
  ],
  fallbacks: [
    "Diligence, patience, and character are the keys to long-term success.",
    "Do not settle for comfort when you can pursue deep, meaningful purpose."
  ]
};

export class OfflineMentorEngine {
  private mentorId: string;
  private mentorName: string;
  private mentorQuotes: typeof WISDOM_SEEDS;

  constructor(mentorId: string) {
    this.mentorId = mentorId;
    const mentor = MENTORS.find(m => m.id === mentorId);
    this.mentorName = mentor ? mentor.name : 'Mentor';
    this.mentorQuotes = WISDOM_SEEDS.filter(q => q.mentorId === mentorId);
  }

  // Find relevant quotes from seed data using basic keyword overlap matching
  public findRelevantQuotes(query: string, topN = 2): typeof WISDOM_SEEDS {
    if (this.mentorQuotes.length === 0) return [];

    // Normalize query words
    const queryWords = query
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !STOP_WORDS.has(word));

    if (queryWords.length === 0) {
      // If no valid keywords, return random quotes for variety
      return [...this.mentorQuotes].sort(() => 0.5 - Math.random()).slice(0, topN);
    }

    // Score each quote based on keyword overlap
    const scoredQuotes = this.mentorQuotes.map(q => {
      let score = 0;
      const quoteText = `${q.quote} ${q.source} ${q.theme.join(' ')}`.toLowerCase();

      queryWords.forEach(word => {
        if (quoteText.includes(word)) {
          score += 1;
          // Extra weight for tag matches
          if (q.theme.includes(word)) {
            score += 1.5;
          }
        }
      });

      return { quote: q, score };
    });

    // Sort by score descending and return top matches
    scoredQuotes.sort((a, b) => b.score - a.score);

    // If highest score is 0, just grab random quotes
    if (scoredQuotes[0].score === 0) {
      return [...this.mentorQuotes].sort(() => 0.5 - Math.random()).slice(0, topN);
    }

    return scoredQuotes
      .filter(item => item.score > 0)
      .slice(0, topN)
      .map(item => item.quote);
  }

  // Generate responsive paragraphs written in the mentor's voice
  public generateResponse(query: string, userName?: string): {
    text: string;
    sources: string[];
    reflectionPrompt: string;
    followUpQuestion: string;
  } {
    const matchedQuotes = this.findRelevantQuotes(query, 1);
    const voice = MENTOR_VOICES[this.mentorId] || DEFAULT_VOICES;

    const selectRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    let greeting = selectRandom(voice.greetings);
    if (userName) {
      if (greeting.toLowerCase().includes("friend")) {
        greeting = greeting.replace(/friend/i, userName);
      } else if (greeting.toLowerCase().includes("my child")) {
        greeting = greeting.replace(/my child/i, userName);
      } else if (greeting.endsWith(".") || greeting.endsWith("!")) {
        greeting = `${userName}, ` + greeting.charAt(0).toLowerCase() + greeting.slice(1);
      } else {
        greeting = `${greeting}, ${userName}.`;
      }
    }

    const transition = selectRandom(voice.transitions);
    const outro = selectRandom(voice.outros);

    let mainQuote = '';
    let source = '';
    let reflectionPrompt = '';

    if (matchedQuotes.length > 0) {
      mainQuote = matchedQuotes[0].quote;
      source = matchedQuotes[0].source;
      reflectionPrompt = matchedQuotes[0].reflection_prompt;
    } else {
      mainQuote = selectRandom(voice.fallbacks);
      source = `${this.mentorName} Core Philosophy`;
      reflectionPrompt = "How can you apply this foundational wisdom to your current situation?";
    }

    // Assemble the continuous message body
    const text = `${greeting}\n\n${transition}\n\n> "${mainQuote}"\n\n${outro}`;

    return {
      text,
      sources: [source],
      reflectionPrompt,
      followUpQuestion: "Would you like to examine another angle or system detail regarding this?"
    };
  }
}

// Multiplexing Panel response for multiple mentors
export function generatePanelResponse(query: string, mentorIds: string[], userName?: string): ChatMessage {
  const messages: string[] = [];
  const allSources: string[] = [];
  const prompts: string[] = [];

  mentorIds.forEach(id => {
    const engine = new OfflineMentorEngine(id);
    const m = MENTORS.find(mentor => mentor.id === id);
    const res = engine.generateResponse(query, userName);

    messages.push(`### 🗣️ ${m ? m.name : id}\n\n${res.text}`);
    allSources.push(...res.sources);
    prompts.push(`${m ? m.name : id} asks: "${res.reflectionPrompt}"`);
  });

  return {
    id: `offline-panel-${Date.now()}`,
    sender: 'panel',
    text: messages.join('\n\n---\n\n'),
    timestamp: new Date().toISOString(),
    sources: Array.from(new Set(allSources)),
    reflectionPrompt: prompts.join('\n'),
    isOffline: true
  };
}
