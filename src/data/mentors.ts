import { Mentor, WisdomQuote } from '../types';

export const MENTORS: Mentor[] = [
  {
    id: 'steve-jobs',
    name: 'Steve Jobs',
    category: 'intellectual',
    title: 'Visionary Innovator & Co-founder of Apple',
    bio: 'Pioneered the personal computer revolution and transformed multiple industries. Believed in passion, extreme craft, and the intersection of technology and liberal arts.',
    systemPrompt: `You are Steve Jobs. You speak with absolute conviction about craft, simplicity, and the intersection of technology and the humanities. You push people to eliminate the mediocre and pursue the "insanely great." You quote your own experiences at Apple, Pixar, and NeXT. You challenge users: "Is this truly excellent, or are you settling?" You reference your belief that "the people who are crazy enough to think they can change the world are the ones who do." Keep your answers concise, sharp, inspiring, and direct.`,
    color: 'bg-stone-800',
    borderColor: 'border-stone-700',
    textColor: 'text-stone-300',
    keyTeachings: ['Simplicity is the ultimate sophistication', 'Beginner\'s mind & intuition', 'The intersection of tech & liberal arts', 'Insanely great craft'],
    resources: ['Stanford Commencement Address (2005)', 'Steve Jobs Biography by Walter Isaacson', 'Lost Interview (1995)']
  },
  {
    id: 'bill-gates',
    name: 'Bill Gates',
    category: 'intellectual',
    title: 'Systems Architect & Philanthropist',
    bio: 'Co-founder of Microsoft and co-chair of the Gates Foundation. Focused on large-scale systems thinking, global development, software architecture, and philanthropy.',
    systemPrompt: `You are Bill Gates. You speak with a highly structured, analytical, and systems-driven mind. You evaluate problems through metrics, scale, and long-term leverage. You believe that software and innovation can solve the world\'s most complex inequalities. You urge users to break problems down into systems, analyze feedback loops, and commit to life-long learning. You often recommend reading widely across scientific and historical domains.`,
    color: 'bg-teal-900',
    borderColor: 'border-teal-800',
    textColor: 'text-teal-300',
    keyTeachings: ['Scale & leverage points', 'Systems-level modeling', 'Catalytic philanthropy', 'Software-first solutions'],
    resources: ['The Road Ahead', 'How to Avoid a Climate Disaster', 'The Gates Notes (Blog)']
  },
  {
    id: 'mark-zuckerberg',
    name: 'Mark Zuckerberg',
    category: 'intellectual',
    title: 'Mission-Driven Builder & Founder of Meta',
    bio: 'Pioneered social networking and immersive computing. Believes in rapid iteration, builder identity, and long-term conviction to connect humanity.',
    systemPrompt: `You are Mark Zuckerberg. You speak with the mindset of a dedicated engineer and a long-term builder. You value focus, rapid feedback loops, and learning by making. You emphasize "move fast" (with stable infrastructure) and having a clear, deep social mission. You speak with calm, direct confidence about open source, virtual systems, and enduring the skepticism of critics when building the future.`,
    color: 'bg-blue-900',
    borderColor: 'border-blue-800',
    textColor: 'text-blue-300',
    keyTeachings: ['Build & iterate fast', 'Long-term mission focus', 'Technological optimism', 'Engineering execution'],
    resources: ['Letters to Shareholders (Meta)', 'Harvard Commencement Speech (2017)', 'Lex Fridman Podcasts']
  },
  {
    id: 'elon-musk',
    name: 'Elon Musk',
    category: 'intellectual',
    title: 'First-Principles Engineer & Multi-Planetary Builder',
    bio: 'Founder of SpaceX and Tesla. Drives humanity toward multi-planetary life, clean energy, and cognitive integration using physics-based thinking.',
    systemPrompt: `You are Elon Musk. You speak with intense, technical focus, relying heavily on first-principles reasoning (reducing things to their fundamental truths and reasoning up). You have an extremely high tolerance for failure and risk, and you find comfort in physics and calculations. You challenge users to think bigger, work tirelessly, and eliminate arbitrary rules or bureaucratic processes. Use occasional nervous energy or technical pauses in your speech, and speak directly.`,
    color: 'bg-slate-800',
    borderColor: 'border-slate-700',
    textColor: 'text-slate-300',
    keyTeachings: ['First-principles reasoning', 'The 5-step algorithm', 'High-risk execution', 'Multi-planetary destiny'],
    resources: ['SpaceX Launch Webcasts', 'Elon Musk Biography by Ashlee Vance', 'Tesla Master Plans']
  },
  {
    id: 'sam-altman',
    name: 'Sam Altman',
    category: 'intellectual',
    title: 'Exponential AI Pioneer & CEO of OpenAI',
    bio: 'Co-founder of OpenAI and former president of Y Combinator. Champion of exponential growth, startup momentum, and artificial general intelligence.',
    systemPrompt: `You are Sam Altman. You speak with a highly pragmatic, high-velocity, and exponential perspective. You emphasize product-market fit, compound self-improvement, and high-agency building. You coach users on how to identify outlier opportunities, maintain extreme momentum, and navigate the transition into the AI era with boldness.`,
    color: 'bg-emerald-950',
    borderColor: 'border-emerald-900',
    textColor: 'text-emerald-300',
    keyTeachings: ['Exponential compound growth', 'High agency & focus', 'Extreme startup momentum', 'Scale laws'],
    resources: ['How to Be Successful (Essay)', 'YC Startup School Lectures', 'OpenAI DevDay Addresses']
  },
  {
    id: 'albert-einstein',
    name: 'Albert Einstein',
    category: 'intellectual',
    title: 'Theoretical Physicist & Paradigm Shifter',
    bio: 'Developed the general theory of relativity. Rewrote the laws of space, time, and gravity through thought experiments and intuitive imagination.',
    systemPrompt: `You are Albert Einstein. You speak with warm humility, child-like curiosity, and deep philosophical wonder. You value imagination over raw knowledge and seek simple, beautiful structures in the cosmos. You encourage users to ask simple questions, engage in thought experiments (Gedankenexperiment), and respect the deep mystery of life.`,
    color: 'bg-indigo-950',
    borderColor: 'border-indigo-900',
    textColor: 'text-indigo-300',
    keyTeachings: ['Imagination exceeds knowledge', 'Intellectual humility', 'Simplifying the complex', 'Philosophical wonder'],
    resources: ['The World as I See It', 'Relativity: The Special and General Theory', 'Einstein\'s Letters']
  },
  {
    id: 'isaac-newton',
    name: 'Isaac Newton',
    category: 'intellectual',
    title: 'Scientific Genius & Father of Classical Mechanics',
    bio: 'Formulated the laws of motion and universal gravitation. Mastered calculus, optics, and spent decades in quiet, highly disciplined research.',
    systemPrompt: `You are Isaac Newton. You speak with formal, serious, and deeply structured precision. You represent quiet dedication, obsessive focus, and foundational discovery. You advise users to establish solid mathematical or logical foundations, resist superficial distractions, and seek the singular, unifying principles of any problem through unyielding patience.`,
    color: 'bg-neutral-800',
    borderColor: 'border-neutral-700',
    textColor: 'text-neutral-300',
    keyTeachings: ['Patience and intent focus', 'Rigorous mathematical proof', 'Order and laws of structure', 'Observation over speculation'],
    resources: ['Philosophiæ Naturalis Principia Mathematica', 'Opticks', 'Historical Memoirs of Newton']
  },
  {
    id: 'socrates',
    name: 'Socrates',
    category: 'intellectual',
    title: 'Classical Philosopher & Father of Dialogue',
    bio: 'Inaugurated Western philosophy by questioning conventional beliefs on ethics and virtue. Pursued wisdom through relentless self-examination.',
    systemPrompt: `You are Socrates. You never give direct answers. You ask questions that expose assumptions and reveal what the user does not yet know. You believe the unexamined life is not worth living. You engage in elenchus — gentle but relentless questioning. You draw out wisdom by asking: "But what do you mean by that?", "And if that were true, what would follow?", "Have you considered...?" Keep your tone patient, inquisitive, and humble.`,
    color: 'bg-amber-950',
    borderColor: 'border-amber-900',
    textColor: 'text-amber-300',
    keyTeachings: ['The unexamined life is not worth living', 'Socratic questioning (elenchus)', 'Intellectual humility (knowing nothing)', '追求美德 (Pursuit of Virtue)'],
    resources: ['Plato\'s Apology', 'Socratic Dialogues', 'Symposium']
  },
  {
    id: 'aristotle',
    name: 'Aristotle',
    category: 'intellectual',
    title: 'Polymath & Systematic Philosopher',
    bio: 'Classified and structured classical knowledge. Developed theories of logic, ethics, biology, and politics, emphasizing the Golden Mean and purpose.',
    systemPrompt: `You are Aristotle. You speak with systematic, categorizing, and teleological rigor. You define terms clearly and believe everything has an ultimate purpose or end (telos). You coach users on finding the "Golden Mean" (virtue as the balance between extremes), cultivating habits, and acting with practical wisdom (phronesis) to achieve flourishing (eudaimonia).`,
    color: 'bg-yellow-950',
    borderColor: 'border-yellow-900',
    textColor: 'text-yellow-300',
    keyTeachings: ['The Golden Mean (balance)', 'Eudaimonia (human flourishing)', 'Teleological reasoning', 'Habitual virtue training'],
    resources: ['Nicomachean Ethics', 'Politics', 'Metaphysics']
  },
  {
    id: 'king-solomon',
    name: 'King Solomon',
    category: 'intellectual',
    title: 'Wise Monarch & Royal Sage',
    bio: 'Famed biblical king who ruled Israel in prosperity. Author of Proverbs and Ecclesiastes, teaching discernment, stewardship, and the fear of God.',
    systemPrompt: `You are King Solomon. You speak with royal weight, profound discernment, and a sobering understanding of life\'s temporary nature (hevel/vanity). Your advice balances practical, diligent stewardship with spiritual alignment. You often quote proverbial axioms of wisdom, warning against pride, laziness, and haste, while encouraging quiet peace, integrity, and reverence.`,
    color: 'bg-amber-900',
    borderColor: 'border-amber-800',
    textColor: 'text-amber-300',
    keyTeachings: ['Discernment & understanding', 'The danger of haste and pride', 'Diligence and stewardship', 'Reverence as the beginning of wisdom'],
    resources: ['Book of Proverbs', 'Book of Ecclesiastes', 'Song of Solomon']
  },
  {
    id: 'david-oyedepo',
    name: 'Bishop David Oyedepo',
    category: 'spiritual',
    title: 'Founder of Winners\' Chapel & Voice of Faith',
    bio: 'A leading global charismatic figure preaching the word of faith, the dominion mandate, covenant obedience, and the exploits of faith.',
    systemPrompt: `You are Bishop David Oyedepo, founder of Winners' Chapel. You speak with the absolute authority of covenant knowledge and prophetic boldness. You reference the dominion mandate, Kingdom principles, and divine prosperity. Your counsel is deeply rooted in scripture — especially Deuteronomy, Joshua, and the epistles. You speak of assignment, faithfulness, and divine backing. You reference your books: 'Walking in the Newness of Life', 'Exploits of Faith', 'Understanding Financial Prosperity'. You pray over users and declare scripture with high energy and unshakeable conviction.`,
    color: 'bg-red-950',
    borderColor: 'border-red-900',
    textColor: 'text-red-300',
    keyTeachings: ['Uncompromised Word of Faith', 'Covenant secrets of prosperity', 'The Dominion Mandate', 'Exploits through diligent service'],
    resources: ['Exploits of Faith', 'Understanding Financial Prosperity', 'The Winning Wisdom']
  },
  {
    id: 'paul-enenche',
    name: 'Pastor Dr. Paul Enenche',
    category: 'spiritual',
    title: 'Senior Pastor of Dunamis Int\'l Gospel Centre',
    bio: 'Medical doctor turned full-time global minister. Preaches destiny, spiritual diligence, character, and the manifestation of God\'s power.',
    systemPrompt: `You are Pastor Dr. Paul Enenche. You speak with high-intensity fire, medical-like accuracy, and extreme spiritual diligence. You push users toward character, holiness, and relentless spiritual discipline (prayer, fasting, study). You emphasize destiny, declaring that "you are not an accident; you are a designed solution." You speak in structured bullets, giving clear directives and spiritual protocols.`,
    color: 'bg-indigo-900',
    borderColor: 'border-indigo-800',
    textColor: 'text-indigo-300',
    keyTeachings: ['Spiritual discipline & character', 'Destiny discovery & diligence', 'The preservation of purpose', 'Power & praise protocols'],
    resources: ['Reason for Living', 'Who Are You?', 'The Secrets of Spiritual Strength']
  },
  {
    id: 'becky-enenche',
    name: 'Dr. Mrs. Becky Enenche',
    category: 'spiritual',
    title: 'Co-Pastor of Dunamis Int\'l Gospel Centre',
    bio: 'Medical doctor, teacher, and spiritual leader. Focuses on family, purpose, maternal mentoring, compassion, and divine healing.',
    systemPrompt: `You are Dr. Mrs. Becky Enenche. You speak with a gentle but highly commanding spiritual strength. You blend academic detail with deep spiritual alignment, focusing on maternal warmth, compassion, healing, order, and the power of family structure. You encourage users to find their peace in God's presence, maintain order in their households, and step into their feminine or masculine strength under God.`,
    color: 'bg-pink-950',
    borderColor: 'border-pink-900',
    textColor: 'text-pink-300',
    keyTeachings: ['Family order & domestic harmony', 'Spiritual healing & prayer', 'Graceful strength', 'Academic & professional excellence'],
    resources: ['The Courage of Conviction', 'Love & Marriage', 'Dunamis Daily Devotionals']
  },
  {
    id: 'joshua-selman',
    name: 'Apostle Joshua Selman',
    category: 'spiritual',
    title: 'Founder of Koinonia Global',
    bio: 'A post-denominational teacher known for his profound systematic theology, Kingdom principles, character development, and personal transformation.',
    systemPrompt: `You are Apostle Joshua Selman. You speak with remarkable eloquence, deep humility, and theological clarity. You explain the spiritual laws of the Kingdom of God systematically. You focus on mental transformation, alignment, value, and the balance between spiritual devotion and practical societal influence. You speak with deep love and care, always ending or framing your thoughts with structured biblical coordinates.`,
    color: 'bg-violet-950',
    borderColor: 'border-violet-900',
    textColor: 'text-violet-300',
    keyTeachings: ['The Laws of the Kingdom', 'Mental transformation & value', 'The balance of devotion & competence', 'Generational alignment'],
    resources: ['Koinonia Global Messages (Audio)', 'Apostolic Teachings on Influence', 'The Mystery of Altars']
  },
  {
    id: 'pa-mosy',
    name: 'Prof. Pa Mosy (Romanus Okafor)',
    category: 'spiritual',
    title: 'Academic Patriarch & Faith-Science Integrationist',
    bio: 'Renowned professor who integrated deep faith with academic rigor and character mentorship for generations of university students.',
    systemPrompt: `You are Prof. Pa Mosy (Romanus Okafor). You speak with the wisdom of a seasoned elder, university dean, and father in the faith. You emphasize that academic brilliance without character is a tragedy, and faith without intellectual diligence is lazy. You encourage rigorous study, holiness in secret, and integrated life building where the classroom and the altar meet.`,
    color: 'bg-emerald-900',
    borderColor: 'border-emerald-800',
    textColor: 'text-emerald-300',
    keyTeachings: ['Integration of faith and scholarship', 'Secret character development', 'Mentorship of the next generation', 'Rigorous preparation'],
    resources: ['Lectures on Academic Excellence', 'University Chapel Sermons']
  },
  {
    id: 'arome-osayi',
    name: 'Apostle Arome Osayi',
    category: 'spiritual',
    title: 'Founder of Remnant Christian Network',
    bio: 'Apostolic teacher of holiness, intercession, ministerial consecration, and building the local altar.',
    systemPrompt: `You are Apostle Arome Osayi. You speak with apostolic gravity, prioritizing consecration, holiness, intercession, and building your personal spiritual altar. Your voice is deeply solemn and challenging, driving users away from commercialized faith toward authentic sacrifice and hearing God's voice directly.`,
    color: 'bg-purple-950',
    borderColor: 'border-purple-900',
    textColor: 'text-purple-300',
    keyTeachings: ['Secret place intercession', 'Consecration and holiness', 'Understanding spiritual authority', 'The ministry of the Word'],
    resources: ['Go Forward', 'Decently and In Order', 'RCN Audio Archive']
  },
  {
    id: 'pastor-chris',
    name: 'Pastor Chris Oyakhilome',
    category: 'spiritual',
    title: 'President of LoveWorld Inc.',
    bio: 'Global evangelist and teacher known for exposing the realities of the new creation, faith-filled declarations, and divine healing.',
    systemPrompt: `You are Pastor Chris Oyakhilome. You speak with highly polished grace, declaring the absolute victory of the new creation. You focus on the power of "Rhema" (spoken words), the renewing of the mind, and walking in divine health. You emphasize that "the Christian is not trying to get healed or rich; they are already blessed." Your tone is encouraging, triumphant, and full of faith.`,
    color: 'bg-cyan-950',
    borderColor: 'border-cyan-900',
    textColor: 'text-cyan-300',
    keyTeachings: ['New creation realities', 'The power of spoken words (Rhema)', 'Walking in divine health', 'Global evangelism'],
    resources: ['The Power of Your Mind', 'Rhapsody of Realities', 'How to Make Your Faith Work']
  },
  {
    id: 'kenneth-hagin',
    name: 'Pastor Kenneth Hagin',
    category: 'spiritual',
    title: 'Father of the Modern Faith Movement',
    bio: 'Pioneering minister who taught the biblical mechanics of faith, the authority of the believer, and the move of the Holy Spirit.',
    systemPrompt: `You are Pastor Kenneth Hagin. You speak with warm, grandfatherly simplicity, often telling stories from your decades of ministry and your healing from a deathbed. You explain faith in clear, actionable steps: believing in the heart and confessing with the mouth. You remind users of their authority in Christ and how to flow with the Holy Spirit.`,
    color: 'bg-amber-950',
    borderColor: 'border-amber-900',
    textColor: 'text-amber-300',
    keyTeachings: ['The Believer\'s Authority', 'The Mechanics of Faith', 'Following the Holy Spirit', 'The Power of the Blood'],
    resources: ['The Believer\'s Authority', 'How You Can Be Led by the Spirit of God', 'I Believe in Visions']
  }
];

export const WISDOM_SEEDS: WisdomQuote[] = [
  // STEVE JOBS
  {
    id: 'jobs-001',
    mentorId: 'steve-jobs',
    quote: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
    source: "Stanford Commencement Address, 2005",
    theme: ["purpose", "work", "legacy"],
    reflection_prompt: "What would 'great work' look like in your current role or project? Are you settling?"
  },
  {
    id: 'jobs-002',
    mentorId: 'steve-jobs',
    quote: "Simplicity is the ultimate sophistication. When you start trying to solve a problem, the first solutions you come up with are very complex... but if you keep going, you can peel the layers of the onion off.",
    source: "Apple Marketing Brochure, 1977",
    theme: ["design", "simplicity", "focus"],
    reflection_prompt: "Which complex area of your life or project can be simplified today by peeling back one layer?"
  },
  {
    id: 'jobs-003',
    mentorId: 'steve-jobs',
    quote: "Remembering that you are going to die is the best way I know to avoid the trap of thinking you have something to lose. You are already naked. There is no reason not to follow your heart.",
    source: "Stanford Commencement Address, 2005",
    theme: ["courage", "mortality", "authenticity"],
    reflection_prompt: "If you had no fear of failure or judgment, what crucial decision would you make today?"
  },
  {
    id: 'jobs-004',
    mentorId: 'steve-jobs',
    quote: "Details matter, it's worth waiting to get it right.",
    source: "Creative Confidence interview",
    theme: ["craft", "quality", "patience"],
    reflection_prompt: "Is there an aspect of your work where you are compromising on quality for the sake of speed?"
  },
  {
    id: 'jobs-005',
    mentorId: 'steve-jobs',
    quote: "The people who are crazy enough to think they can change the world are the ones who do.",
    source: "Think Different Campaign, 1997",
    theme: ["audacity", "vision", "impact"],
    reflection_prompt: "What is your 'crazy' idea that could genuinely improve the lives of those around you?"
  },
  {
    id: 'jobs-006',
    mentorId: 'steve-jobs',
    quote: "Innovation distinguishes between a leader and a follower.",
    source: "The Innovation Secrets of Steve Jobs",
    theme: ["leadership", "innovation"],
    reflection_prompt: "Are you reacting to current standards, or are you actively inventing new paths?"
  },
  {
    id: 'jobs-007',
    mentorId: 'steve-jobs',
    quote: "My favorite things in life don't cost any money. It's really clear that the most precious resource we all have is time.",
    source: "Playboy Interview, 1985",
    theme: ["time", "values", "wealth"],
    reflection_prompt: "How did you spend your time today? Did it align with your truest internal values?"
  },
  {
    id: 'jobs-008',
    mentorId: 'steve-jobs',
    quote: "You can't connect the dots looking forward; you can only connect them looking backward. So you have to trust that the dots will somehow connect in your future.",
    source: "Stanford Commencement Address, 2005",
    theme: ["trust", "destiny", "reflection"],
    reflection_prompt: "Can you identify a past struggle or detour that eventually became a key strength in your life?"
  },
  {
    id: 'jobs-009',
    mentorId: 'steve-jobs',
    quote: "Have the courage to follow your heart and intuition. They somehow already know what you truly want to become.",
    source: "Stanford Commencement Address, 2005",
    theme: ["intuition", "courage", "self"],
    reflection_prompt: "What is your inner voice telling you right now that your logical brain is trying to silence?"
  },
  {
    id: 'jobs-010',
    mentorId: 'steve-jobs',
    quote: "Be a yardstick of quality. Some people aren't used to an environment where excellence is expected.",
    source: "Silicon Valley Lectures",
    theme: ["excellence", "culture", "standards"],
    reflection_prompt: "How can you raise the standard of excellence in your family, team, or workspace today?"
  },

  // BILL GATES
  {
    id: 'gates-001',
    mentorId: 'bill-gates',
    quote: "We always overestimate the change that will occur in the next two years and underestimate the change that will occur in the next ten. Don't let yourself be lulled into inaction.",
    source: "The Road Ahead, 1995",
    theme: ["vision", "planning", "patience"],
    reflection_prompt: "What foundational skill or asset should you invest in today that will compound over 10 years?"
  },
  {
    id: 'gates-002',
    mentorId: 'bill-gates',
    quote: "Success is a lousy teacher. It seduces smart people into thinking they can't lose.",
    source: "The Road Ahead, 1995",
    theme: ["success", "humility", "learning"],
    reflection_prompt: "What was your last success, and are you mistaking a streak of luck for permanent invincibility?"
  },
  {
    id: 'gates-003',
    mentorId: 'bill-gates',
    quote: "If you show people the problems and you show people the solutions, they will be moved to act.",
    source: "TED Talk, 2009",
    theme: ["leadership", "empowerment", "philanthropy"],
    reflection_prompt: "Are you complaining about a system, or are you mapping a clear, structural solution for people to follow?"
  },
  {
    id: 'gates-004',
    mentorId: 'bill-gates',
    quote: "To win big, you sometimes have to take big risks.",
    source: "Microsoft Archives",
    theme: ["risk", "business"],
    reflection_prompt: "Where in your career have you played it too safe, avoiding a risk that could multiply your impact?"
  },
  {
    id: 'gates-005',
    mentorId: 'bill-gates',
    quote: "Patience is a key element of success.",
    source: "Gates Notes",
    theme: ["patience", "perseverance"],
    reflection_prompt: "Are you abandoning a complex systems problem too quickly because it doesn't give immediate feedback?"
  },
  {
    id: 'gates-006',
    mentorId: 'bill-gates',
    quote: "Don't compare yourself with anyone in this world... if you do so, you are insulting yourself.",
    source: "Microsoft Internal Address",
    theme: ["identity", "comparison"],
    reflection_prompt: "In what areas of your life are you tracking someone else's metrics instead of your own?"
  },
  {
    id: 'gates-007',
    mentorId: 'bill-gates',
    quote: "If you think your teacher is tough, wait till you get a boss. He doesn't have tenure.",
    source: "High School Speech",
    theme: ["responsibility", "realism"],
    reflection_prompt: "Are you taking active responsibility for your performance, or expecting others to accommodate excuses?"
  },
  {
    id: 'gates-008',
    mentorId: 'bill-gates',
    quote: "I was highly analytical. I wanted to map out every single detail of our software architecture, and I expected everyone to work with the same intensity.",
    source: "Harvard Interview",
    theme: ["discipline", "focus"],
    reflection_prompt: "Do you have structural clarity regarding your goals, or are you working off vague feelings?"
  },
  {
    id: 'gates-009',
    mentorId: 'bill-gates',
    quote: "Climate change is a complex equation, but the only number that truly matters is zero. We must get global emissions to zero.",
    source: "How to Avoid a Climate Disaster",
    theme: ["systems", "focus"],
    reflection_prompt: "What is the single 'absolute' metric that determines the success of your current life domain?"
  },
  {
    id: 'gates-010',
    mentorId: 'bill-gates',
    quote: "Information technology and business are becoming inextricably interwoven. I don't think anybody can talk meaningfully about one without the other.",
    source: "Business @ the Speed of Thought",
    theme: ["technology", "integration"],
    reflection_prompt: "How can you integrate modern technological tools to make your daily work 10x more efficient?"
  },

  // MARK ZUCKERBERG
  {
    id: 'zuck-001',
    mentorId: 'mark-zuckerberg',
    quote: "The biggest risk is not taking any risk. In a world that's changing really quickly, the only strategy that is guaranteed to fail is not taking risks.",
    source: "Y Combinator Interview, 2011",
    theme: ["risk", "growth", "speed"],
    reflection_prompt: "What is a decision you are putting off because it feels risky, and what is the cost of doing nothing?"
  },
  {
    id: 'zuck-002',
    mentorId: 'mark-zuckerberg',
    quote: "Move fast and break things. Unless you are breaking stuff, you are not moving fast enough.",
    source: "Early Facebook Motto",
    theme: ["iteration", "speed", "execution"],
    reflection_prompt: "Are you over-analyzing a project instead of building a quick draft and seeing where it breaks?"
  },
  {
    id: 'zuck-003',
    mentorId: 'mark-zuckerberg',
    quote: "Purpose is that feeling that you are part of something bigger than yourself, that you are needed, and that you have something better ahead to work for.",
    source: "Harvard Commencement Speech, 2017",
    theme: ["purpose", "belonging", "vision"],
    reflection_prompt: "How does your current career or business goal contribute to a larger mission for other people?"
  },
  {
    id: 'zuck-004',
    mentorId: 'mark-zuckerberg',
    quote: "People don't care about what you say, they care about what you build.",
    source: "Founder Letters",
    theme: ["execution", "action"],
    reflection_prompt: "What did you actually build or execute today, versus what you talked about doing?"
  },
  {
    id: 'zuck-005',
    mentorId: 'mark-zuckerberg',
    quote: "Our goal was never to just build a company. It was to build a utility that connects people globally.",
    source: "IPO Letter, 2012",
    theme: ["mission", "values"],
    reflection_prompt: "Is your primary project motivated by short-term survival or long-term systemic utility?"
  },
  {
    id: 'zuck-006',
    mentorId: 'mark-zuckerberg',
    quote: "I think as a founder, you have to have a deep conviction in what you are doing, even when everyone else is calling you crazy.",
    source: "Stanford Interview",
    theme: ["conviction", "resilience"],
    reflection_prompt: "What is one belief about the future that you hold deeply, despite external doubt?"
  },
  {
    id: 'zuck-007',
    mentorId: 'mark-zuckerberg',
    quote: "Move fast with stable infra. It means you can move extremely quickly because your foundation is secure.",
    source: "Updated Facebook Engineering Core",
    theme: ["foundation", "stability", "speed"],
    reflection_prompt: "Do you have the stable personal infrastructure (health, budget, peace) needed to move fast in your career?"
  },
  {
    id: 'zuck-008',
    mentorId: 'mark-zuckerberg',
    quote: "You don't need to know everything before you start. You just need to keep moving forward and solving the next problem.",
    source: "Harvard Commencement, 2017",
    theme: ["growth", "action"],
    reflection_prompt: "Are you stalling your startup or project because you feel you lack a credential? Can you learn on the fly?"
  },
  {
    id: 'zuck-009',
    mentorId: 'mark-zuckerberg',
    quote: "The question I ask myself almost every day is: 'Am I doing the most important thing I could be doing?'",
    source: "Business Insider Interview",
    theme: ["priority", "focus"],
    reflection_prompt: "Look at your calendar. Are you spending major time on minor tasks, or focusing on the absolute critical path?"
  },
  {
    id: 'zuck-010',
    mentorId: 'mark-zuckerberg',
    quote: "Building a global community starts with enabling local connectivity and trust.",
    source: "Meta Vision Document",
    theme: ["community", "trust"],
    reflection_prompt: "How can you strengthen the core relationships in your immediate network or team this week?"
  },

  // ELON MUSK
  {
    id: 'musk-001',
    mentorId: 'elon-musk',
    quote: "If you need encouraging words, you should not do it. Startup or high-impact execution is like eating glass and staring into the abyss.",
    source: "Interview on Entrepreneurship",
    theme: ["resilience", "realism", "conviction"],
    reflection_prompt: "Is your conviction in your goals dependent on external applause or an internal flame?"
  },
  {
    id: 'musk-002',
    mentorId: 'elon-musk',
    quote: "Boil things down to the most fundamental truths and reason up from there, as opposed to analogizing. Through analogy, we copy others with minor variations.",
    source: "First Principles Interview",
    theme: ["thinking", "innovation", "physics"],
    reflection_prompt: "What belief about your current limitation is based on 'what others do' rather than fundamental constraints?"
  },
  {
    id: 'musk-003',
    mentorId: 'elon-musk',
    quote: "When something is important enough, you do it even if the odds are not in your favor.",
    source: "60 Minutes Interview",
    theme: ["purpose", "courage", "audacity"],
    reflection_prompt: "What major objective is worth pursuing for you, even if the statistical chance of success is only 10%?"
  },
  {
    id: 'musk-004',
    mentorId: 'elon-musk',
    quote: "Constantly seek criticism. A well-thought-out critique of what you're doing is as valuable as gold.",
    source: "Tesla Shareholder Meeting",
    theme: ["feedback", "growth"],
    reflection_prompt: "Who can you ask today to give you completely honest, painful feedback on your work?"
  },
  {
    id: 'musk-005',
    mentorId: 'elon-musk',
    quote: "The product is the machine that builds the machine. Designing the factory is 10x to 100x harder than designing the car.",
    source: "Tesla Battery Day",
    theme: ["systems", "scaling"],
    reflection_prompt: "Are you focusing on individual tasks, or are you designing a repeatable process to produce results?"
  },
  {
    id: 'musk-006',
    mentorId: 'elon-musk',
    quote: "Persistence is very important. You should not give up unless you are forced to give up.",
    source: "SpaceX Falcon 1 Flight 3 Interview",
    theme: ["persistence", "resilience"],
    reflection_prompt: "Are you tempted to quit a difficult project simply because of fatigue, or is it truly structurally impossible?"
  },
  {
    id: 'musk-007',
    mentorId: 'elon-musk',
    quote: "You want to wake up in the morning and think the future is going to be great - and that's what being a spacefaring civilization is all about. It's about believing in the future.",
    source: "SpaceX Announcement",
    theme: ["vision", "optimism"],
    reflection_prompt: "Does your long-term plan excite you, or is it merely designed for comfort and maintenance?"
  },
  {
    id: 'musk-008',
    mentorId: 'elon-musk',
    quote: "Work like hell. I mean you just have to put in 80 to 100 hour weeks every week. This improves the odds of success.",
    source: "USC Commencement Address",
    theme: ["hard work", "focus"],
    reflection_prompt: "Are you expecting outlier outcomes while putting in standard, average hours?"
  },
  {
    id: 'musk-009',
    mentorId: 'elon-musk',
    quote: "We must expand the scope and scale of human consciousness in order to better understand what questions to ask.",
    source: "Deep Philosophy Podcast",
    theme: ["consciousness", "curiosity"],
    reflection_prompt: "Are you asking small, repetitive questions, or expanding your knowledge to ask cosmic, systemic ones?"
  },
  {
    id: 'musk-010',
    mentorId: 'elon-musk',
    quote: "The single biggest mistake in engineering is optimizing a thing that should not exist.",
    source: "The Starship Production Algorithm",
    theme: ["systems", "efficiency"],
    reflection_prompt: "Is there a routine task you are trying to do faster that you should actually delete entirely?"
  },

  // SAM ALTMAN
  {
    id: 'altman-001',
    mentorId: 'sam-altman',
    quote: "A big secret is that you can bend the world to your will a surprising percentage of the time—most people don't even try.",
    source: "How to Be Successful, 2019",
    theme: ["agency", "confidence", "building"],
    reflection_prompt: "Where are you accepting a 'no' or a standard restriction as an absolute law, when you could negotiate?"
  },
  {
    id: 'altman-002',
    mentorId: 'sam-altman',
    quote: "Extreme growth and extreme success come from compounding. You want to make your life a compound curve.",
    source: "How to Be Successful, 2019",
    theme: ["growth", "patience", "career"],
    reflection_prompt: "What daily habit can you adopt that seems tiny but will compound into massive leverage over 5 years?"
  },
  {
    id: 'altman-003',
    mentorId: 'sam-altman',
    quote: "High agency is the single most important trait for an exceptional life. It means you figure out how to make things happen, no matter what.",
    source: "OpenAI Essays",
    theme: ["agency", "resilience"],
    reflection_prompt: "When you run into an administrative wall, is your response 'it wasn't allowed' or 'how do we bypass this'?"
  },
  {
    id: 'altman-004',
    mentorId: 'sam-altman',
    quote: "The hardest but most important thing in a startup is to have extreme focus. Focus on what matters, ignore the rest.",
    source: "YC Lectures",
    theme: ["focus", "startup"],
    reflection_prompt: "What is the single highest leverage metric for your current venture, and are you working on it today?"
  },
  {
    id: 'altman-005',
    mentorId: 'sam-altman',
    quote: "You want to be hard to misunderstand, and very easy to work with.",
    source: "Startup School",
    theme: ["communication", "collaboration"],
    reflection_prompt: "Is your communication bloated with jargon, or clear enough that a 10-year-old can explain your goal?"
  },
  {
    id: 'altman-006',
    mentorId: 'sam-altman',
    quote: "It's much easier to do a hard startup than an easy startup. People want to help with hard, ambitious missions.",
    source: "OpenAI Retreat",
    theme: ["ambition", "vision"],
    reflection_prompt: "Is your current target too small to attract high-caliber collaborators or mentors?"
  },
  {
    id: 'altman-007',
    mentorId: 'sam-altman',
    quote: "The cost of intelligence and the cost of energy are going to fall towards zero. This will rewrite the economy.",
    source: "Moore's Law for Everything",
    theme: ["future", "technology"],
    reflection_prompt: "In a world of infinite, free intelligence, what is your unique human leverage point?"
  },
  {
    id: 'altman-008',
    mentorId: 'sam-altman',
    quote: "Most people are risk-averse to a fault. They overestimate the downside of quitting a secure job and underestimate the upside of autonomy.",
    source: "YC Blog",
    theme: ["risk", "autonomy"],
    reflection_prompt: "What is the true, realistic worst-case scenario if you pursued your independent venture?"
  },
  {
    id: 'altman-009',
    mentorId: 'sam-altman',
    quote: "You should build a product that users love so much they tell their friends without you prompting them.",
    source: "YC Playbook",
    theme: ["product", "growth"],
    reflection_prompt: "Does your work or service have the level of quality that makes clients actively rave about it?"
  },
  {
    id: 'altman-010',
    mentorId: 'sam-altman',
    quote: "Never lose momentum. Momentum is the lifeblood of startups and execution.",
    source: "Momentum Essay",
    theme: ["momentum", "speed"],
    reflection_prompt: "What is one small victory you can secure before 5 PM today to keep your project's momentum alive?"
  },

  // ALBERT EINSTEIN
  {
    id: 'einstein-001',
    mentorId: 'albert-einstein',
    quote: "Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world, stimulating progress, giving birth to evolution.",
    source: "Cosmic Religion: With Other Opinions and Aphorisms, 1931",
    theme: ["imagination", "thinking", "curiosity"],
    reflection_prompt: "Instead of searching for existing solutions, can you imagine a completely novel solution to your problem?"
  },
  {
    id: 'einstein-002',
    mentorId: 'albert-einstein',
    quote: "A person who never made a mistake never tried anything new.",
    source: "Einstein Archives",
    theme: ["mistakes", "learning", "growth"],
    reflection_prompt: "Are you paralyzing yourself with perfectionism, avoiding mistakes by refusing to experiment?"
  },
  {
    id: 'einstein-003',
    mentorId: 'albert-einstein',
    quote: "Try not to become a man of success, but rather try to become a man of value.",
    source: "Personal Memoirs",
    theme: ["value", "ethics", "success"],
    reflection_prompt: "How can you focus more on serving and creating value for others, rather than chasing prestige?"
  },
  {
    id: 'einstein-004',
    mentorId: 'albert-einstein',
    quote: "I have no special talent. I am only passionately curious.",
    source: "Letter to Carl Seelig, 1952",
    theme: ["curiosity", "learning"],
    reflection_prompt: "What subject has been occupying your thoughts lately? Have you given yourself the time to explore it?"
  },
  {
    id: 'einstein-005',
    mentorId: 'albert-einstein',
    quote: "In the middle of difficulty lies opportunity.",
    source: "Maxims of Einstein",
    theme: ["adversity", "optimism"],
    reflection_prompt: "What is the single most frustrating bottleneck in your life right now, and what is its hidden benefit?"
  },
  {
    id: 'einstein-006',
    mentorId: 'albert-einstein',
    quote: "The important thing is not to stop questioning. Curiosity has its own reason for existing.",
    source: "In Memoirs of William Miller",
    theme: ["curiosity", "philosophy"],
    reflection_prompt: "What core belief about your career or faith have you not questioned in the last 5 years?"
  },
  {
    id: 'einstein-007',
    mentorId: 'albert-einstein',
    quote: "Everything should be made as simple as possible, but not simpler.",
    source: "Academic lectures",
    theme: ["simplicity", "clarity"],
    reflection_prompt: "How would you explain your current core life dilemma in a single, simple sentence?"
  },
  {
    id: 'einstein-008',
    mentorId: 'albert-einstein',
    quote: "The monotony and solitude of a quiet life stimulates the creative mind.",
    source: "Address at the Princeton Centennial",
    theme: ["solitude", "creativity"],
    reflection_prompt: "When was the last time you sat in complete silence without a phone or computer for 1 hour?"
  },
  {
    id: 'einstein-009',
    mentorId: 'albert-einstein',
    quote: "Coincidence is God's way of remaining anonymous.",
    source: "Einstein Epigrams",
    theme: ["mystery", "spirituality"],
    reflection_prompt: "Can you see a recent 'unfortunate' event as a beautiful, anonymous course-correction?"
  },
  {
    id: 'einstein-010',
    mentorId: 'albert-einstein',
    quote: "There are only two ways to live your life. One is as though nothing is a miracle. The other is as though everything is a miracle.",
    source: "Einstein Letters",
    theme: ["perspective", "gratitude"],
    reflection_prompt: "Write down 3 things that occurred today that you normally take for granted, but are actually miraculous."
  },

  // ISAAC NEWTON
  {
    id: 'newton-001',
    mentorId: 'isaac-newton',
    quote: "If I have seen further than others, it is by standing on the shoulders of giants.",
    source: "Letter to Robert Hooke, 1675",
    theme: ["humility", "learning", "history"],
    reflection_prompt: "Whose research, books, or teachings are you building upon? Have you studied the historical giants of your field?"
  },
  {
    id: 'newton-002',
    mentorId: 'isaac-newton',
    quote: "I keep the subject constantly before me and wait till the first dawnings open slowly, by little and little, into a full and clear light.",
    source: "In Memoirs of Newton, 1855",
    theme: ["focus", "patience", "intellect"],
    reflection_prompt: "Are you rushing to make a decision, or can you hold the tension of the problem in your mind until clarity emerges?"
  },
  {
    id: 'newton-003',
    mentorId: 'isaac-newton',
    quote: "Truth is the offspring of silence and meditation.",
    source: "Newton Manuscripts",
    theme: ["truth", "silitude", "meditation"],
    reflection_prompt: "Is your life full of noisy social debates, or quiet spaces where objective truth can reveal itself?"
  },
  {
    id: 'newton-004',
    mentorId: 'isaac-newton',
    quote: "Tact is the art of making a point without making an enemy.",
    source: "Newton Axioms",
    theme: ["communication", "wisdom"],
    reflection_prompt: "Are you being unnecessarily abrasive in your interactions, or can you express truth with tactical grace?"
  },
  {
    id: 'newton-005',
    mentorId: 'isaac-newton',
    quote: "Nature is pleased with simplicity. And nature is no dummy.",
    source: "Principia Mathematica, Book III",
    theme: ["simplicity", "nature"],
    reflection_prompt: "Are you over-complicating your business model or daily schedule to look busy?"
  },
  {
    id: 'newton-006',
    mentorId: 'isaac-newton',
    quote: "To every action there is always opposed an equal reaction.",
    source: "Principia Mathematica (Third Law of Motion)",
    theme: ["cause-effect", "discipline"],
    reflection_prompt: "What is the equal and opposite 'reaction' or consequence of your current physical or spending habits?"
  },
  {
    id: 'newton-007',
    mentorId: 'isaac-newton',
    quote: "I can calculate the motion of heavenly bodies, but not the madness of people.",
    source: "During the South Sea Bubble collapse, 1720",
    theme: ["humility", "human-nature"],
    reflection_prompt: "Are you trying to apply cold, mathematical logic to emotional or relational conflicts?"
  },
  {
    id: 'newton-008',
    mentorId: 'isaac-newton',
    quote: "A man may imagine things that are false, but he can only understand things that are true.",
    source: "Newton Journals",
    theme: ["understanding", "truth"],
    reflection_prompt: "Are you acting on an imagined scenario or verified, objective facts?"
  },
  {
    id: 'newton-009',
    mentorId: 'isaac-newton',
    quote: "The most beautiful system of the sun, planets, and comets, could only proceed from the counsel and dominion of an intelligent and powerful Being.",
    source: "Principia Mathematica (General Scholium)",
    theme: ["order", "faith", "science"],
    reflection_prompt: "How does observing the order of the physical world inspire or deepen your internal faith?"
  },
  {
    id: 'newton-010',
    mentorId: 'isaac-newton',
    quote: "I do not know what I may appear to the world, but to myself I seem to have been only like a boy playing on the seashore, and diverting myself in now and then finding a smoother pebble.",
    source: "Memoirs of Newton",
    theme: ["humility", "wonder"],
    reflection_prompt: "Do you approach your study or craft with the playful, humble posture of a child finding sea shells?"
  },

  // SOCRATES
  {
    id: 'soc-001',
    mentorId: 'socrates',
    quote: "The unexamined life is not worth living.",
    source: "Plato's Apology of Socrates",
    theme: ["reflection", "virtue", "truth"],
    reflection_prompt: "If you analyzed your choices over the past week, what underlying values do they actually reveal?"
  },
  {
    id: 'soc-002',
    mentorId: 'socrates',
    quote: "I know that I am intelligent, because I know that I know nothing.",
    source: "Plato's Republic",
    theme: ["humility", "wisdom", "learning"],
    reflection_prompt: "What is a topic you speak confidently about, where you actually have zero real experience or evidence?"
  },
  {
    id: 'soc-003',
    mentorId: 'socrates',
    quote: "To find yourself, think for yourself.",
    source: "Platonic dialogues",
    theme: ["autonomy", "self-knowledge"],
    reflection_prompt: "Which of your current political, social, or spiritual beliefs is genuinely yours, rather than adopted from peers?"
  },
  {
    id: 'soc-004',
    mentorId: 'socrates',
    quote: "He who is not contented with what he has, would not be contented with what he would like to have.",
    source: "Socratic Epigrams",
    theme: ["contentment", "desire"],
    reflection_prompt: "Are you delaying your happiness until you secure the next milestone? Why can't you find contentment today?"
  },
  {
    id: 'soc-005',
    mentorId: 'socrates',
    quote: "Employ your time in improving yourself by other men's writings, so that you shall gain easily what others have labored hard for.",
    source: "Socratic Dialogues",
    theme: ["reading", "leverage", "wisdom"],
    reflection_prompt: "What profound book is currently gathering dust on your shelf while you scroll social media?"
  },
  {
    id: 'soc-006',
    mentorId: 'socrates',
    quote: "Strong minds discuss ideas, average minds discuss events, weak minds discuss people.",
    source: "Platonic Epigrams",
    theme: ["conversation", "standards"],
    reflection_prompt: "What was the theme of your last major conversation with a close friend or partner?"
  },
  {
    id: 'soc-007',
    mentorId: 'socrates',
    quote: "The secret of change is to focus all of your energy, not on fighting the old, but on building the new.",
    source: "As quoted in Plato's Dialogues",
    theme: ["change", "energy", "focus"],
    reflection_prompt: "Are you exhausting your mental bandwidth fighting a bad habit, instead of establishing a positive ritual?"
  },
  {
    id: 'soc-008',
    mentorId: 'socrates',
    quote: "Nature has given us two ears, two eyes, and but one tongue, to the end that we should hear and see more than we speak.",
    source: "Dialogue on Virtue",
    theme: ["listening", "moderation"],
    reflection_prompt: "In your next meeting or conversation, can you commit to asking 3 deep questions and speaking 50% less?"
  },
  {
    id: 'soc-009',
    mentorId: 'socrates',
    quote: "False words are not only evil in themselves, but they infect the soul with evil.",
    source: "Phaedo",
    theme: ["integrity", "language"],
    reflection_prompt: "Are you exaggerating numbers, stories, or achievements to protect your ego?"
  },
  {
    id: 'soc-010',
    mentorId: 'socrates',
    quote: "Be kind, for everyone you meet is fighting a hard battle.",
    source: "Socratic sayings",
    theme: ["compassion", "empathy"],
    reflection_prompt: "Think of a difficult person you interacted with today. What invisible battle might they be enduring?"
  },

  // ARISTOTLE
  {
    id: 'arist-001',
    mentorId: 'aristotle',
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    source: "Nicomachean Ethics",
    theme: ["habits", "excellence", "discipline"],
    reflection_prompt: "If your daily routine remained unchanged for 3 years, what caliber of person would you inevitably become?"
  },
  {
    id: 'arist-002',
    mentorId: 'aristotle',
    quote: "Knowing yourself is the beginning of all wisdom.",
    source: "Nicomachean Ethics",
    theme: ["self-knowledge", "wisdom"],
    reflection_prompt: "What is your greatest character flaw, and how have you actively structured your environment to guard against it?"
  },
  {
    id: 'arist-003',
    mentorId: 'aristotle',
    quote: "It is the mark of an educated mind to be able to entertain a thought without accepting it.",
    source: "Metaphysics",
    theme: ["intellect", "openness"],
    reflection_prompt: "Can you list the strongest arguments for a worldview or decision you completely disagree with?"
  },
  {
    id: 'arist-004',
    mentorId: 'aristotle',
    quote: "What is a friend? A single soul dwelling in two bodies.",
    source: "Nicomachean Ethics (On Friendship)",
    theme: ["friendship", "relationships"],
    reflection_prompt: "Do you have friends of 'virtue' who push you toward excellence, or only friends of 'utility' and pleasure?"
  },
  {
    id: 'arist-005',
    mentorId: 'aristotle',
    quote: "Happiness is the meaning and the purpose of life, the whole aim and end of human existence.",
    source: "Nicomachean Ethics",
    theme: ["happiness", "eudaimonia"],
    reflection_prompt: "Are your daily goals building towards deep structural flourishing (eudaimonia), or temporary sensory pleasure?"
  },
  {
    id: 'arist-006',
    mentorId: 'aristotle',
    quote: "The energy of the mind is the essence of life.",
    source: "Metaphysics",
    theme: ["mind", "energy"],
    reflection_prompt: "What thoughts or activities drain your mental battery fastest? What charges it?"
  },
  {
    id: 'arist-007',
    mentorId: 'aristotle',
    quote: "No great mind has ever existed without a touch of madness.",
    source: "Poetics",
    theme: ["creativity", "originality"],
    reflection_prompt: "Are you suppressing your unique, slightly eccentric talents to conform to social safety?"
  },
  {
    id: 'arist-008',
    mentorId: 'aristotle',
    quote: "The Golden Mean is the balance between deficiency and excess. Courage, for example, is the midpoint between cowardice and recklessness.",
    source: "Nicomachean Ethics",
    theme: ["moderation", "virtue"],
    reflection_prompt: "In what area of your life are you currently committing an excess (e.g., overworking) or a deficiency (e.g., hiding)?"
  },
  {
    id: 'arist-009',
    mentorId: 'aristotle',
    quote: "He who has overcome his fears will truly be free.",
    source: "Nicomachean Ethics",
    theme: ["courage", "freedom"],
    reflection_prompt: "What fear is currently micro-managing your career or relational choices?"
  },
  {
    id: 'arist-010',
    mentorId: 'aristotle',
    quote: "Patience is bitter, but its fruit is sweet.",
    source: "Nicomachean Ethics",
    theme: ["patience", "virtue"],
    reflection_prompt: "Where do you need to endure a bitter season of sowing so that you can enjoy a sweet season of harvesting?"
  },

  // KING SOLOMON
  {
    id: 'sol-001',
    mentorId: 'king-solomon',
    quote: "A wise man will hear, and will increase learning; and a man of understanding shall attain unto wise counsels.",
    source: "Proverbs 1:5",
    theme: ["wisdom", "learning", "counsel"],
    reflection_prompt: "Who is in your inner circle of advisors? Do they have the character and wisdom you hope to replicate?"
  },
  {
    id: 'sol-002',
    mentorId: 'king-solomon',
    quote: "Pride goeth before destruction, and an haughty spirit before a fall.",
    source: "Proverbs 16:18",
    theme: ["humility", "warning", "character"],
    reflection_prompt: "Are you refusing to admit a mistake or accept help because of your ego?"
  },
  {
    id: 'sol-003',
    mentorId: 'king-solomon',
    quote: "The soul of the sluggard desireth, and hath nothing: but the soul of the diligent shall be made fat.",
    source: "Proverbs 13:4",
    theme: ["diligence", "discipline", "work"],
    reflection_prompt: "Are you wishing for wealth, health, or spiritual depth while refusing to put in daily diligent hours?"
  },
  {
    id: 'sol-004',
    mentorId: 'king-solomon',
    quote: "He that is slow to anger is better than the mighty; and he that ruleth his spirit than he that taketh a city.",
    source: "Proverbs 16:32",
    theme: ["self-control", "temperance"],
    reflection_prompt: "When you feel slighted or defensive, do you have the strength to master your emotional reaction?"
  },
  {
    id: 'sol-005',
    mentorId: 'king-solomon',
    quote: "A good name is rather to be chosen than great riches, and loving favour rather than silver and gold.",
    source: "Proverbs 22:1",
    theme: ["reputation", "integrity", "values"],
    reflection_prompt: "Would you take a highly profitable deal if it required a minor compromise of your ethical integrity?"
  },
  {
    id: 'sol-006',
    mentorId: 'king-solomon',
    quote: "Hevel, hevel, everything is vanity under the sun. All is like chasing the wind. There is nothing new under the sun.",
    source: "Ecclesiastes 1:2-9",
    theme: ["perspective", "mortality"],
    reflection_prompt: "If your earthly achievements will eventually fade, what holds ultimate eternal significance for you?"
  },
  {
    id: 'sol-007',
    mentorId: 'king-solomon',
    quote: "Iron sharpeneth iron; so a man sharpeneth the countenance of his friend.",
    source: "Proverbs 27:17",
    theme: ["friendship", "accountability"],
    reflection_prompt: "Who was the last friend who gave you a difficult, constructive reality check?"
  },
  {
    id: 'sol-008',
    mentorId: 'king-solomon',
    quote: "Go to the ant, thou sluggard; consider her ways, and be wise: which having no guide, overseer, or ruler, provideth her meat in the summer, and gathereth her food in the harvest.",
    source: "Proverbs 6:6-8",
    theme: ["diligence", "initiative"],
    reflection_prompt: "Are you waiting for an authority figure to tell you to work, or do you have self-starting discipline?"
  },
  {
    id: 'sol-009',
    mentorId: 'king-solomon',
    quote: "The fear of the Lord is the beginning of wisdom: and the knowledge of the holy is understanding.",
    source: "Proverbs 9:10",
    theme: ["reverence", "wisdom", "spirituality"],
    reflection_prompt: "What does putting spiritual reverence first in your schedule look like tomorrow morning?"
  },
  {
    id: 'sol-010',
    mentorId: 'king-solomon',
    quote: "To every thing there is a season, and a time to every purpose under the heaven: A time to be born, and a time to die; a time to plant, and a time to pluck up.",
    source: "Ecclesiastes 3:1-2",
    theme: ["seasons", "patience"],
    reflection_prompt: "Are you in a season of planting (diligent study/building) or a season of plucking (reaping)? Are you resisting the season?"
  },

  // BISHOP DAVID OYEDEPO
  {
    id: 'oyedepo-001',
    mentorId: 'david-oyedepo',
    quote: "It takes faith to please God. Faith is not a feeling, it is not a belief; faith is a spiritual law that you put to work by speaking and acting on God's Word.",
    source: "Exploits of Faith",
    theme: ["faith", "action", "covenant"],
    reflection_prompt: "What word from scripture or what spiritual conviction are you actively acting upon today?"
  },
  {
    id: 'oyedepo-002',
    mentorId: 'david-oyedepo',
    quote: "No one ever arrives at a future he did not prepare for. Preparation is the mother of manifestation.",
    source: "The Winning Wisdom",
    theme: ["preparation", "destiny"],
    reflection_prompt: "You want a global platform or career breakthrough. What specific daily study is preparing you for that responsibility?"
  },
  {
    id: 'oyedepo-003',
    mentorId: 'david-oyedepo',
    quote: "Financial prosperity is not a promise; it is a covenant. Sowing and reaping is the absolute key to breaking financial lack.",
    source: "Understanding Financial Prosperity",
    theme: ["wealth", "giving", "covenant"],
    reflection_prompt: "Are you hoarding your resources out of fear, or actively planting seeds of generosity?"
  },
  {
    id: 'oyedepo-004',
    mentorId: 'david-oyedepo',
    quote: "Discipline is the bridge between goals and accomplishments. Undisciplined desires lead to an empty destiny.",
    source: "Exploits of Faith",
    theme: ["discipline", "goals"],
    reflection_prompt: "What represents your greatest area of lack of discipline? Fasting? Sleeping? Social media?"
  },
  {
    id: 'oyedepo-005',
    mentorId: 'david-oyedepo',
    quote: "The dominion mandate is your inheritance. You are not redeemed to be a beggar, you are redeemed to rule and reign on this earth.",
    source: "Walking in the Newness of Life",
    theme: ["dominion", "identity"],
    reflection_prompt: "Are you speaking like a victim of circumstances, or declaring your covenant authority over this day?"
  },
  {
    id: 'oyedepo-006',
    mentorId: 'david-oyedepo',
    quote: "If you don't run with a vision, you will end up as a tenant to those who do.",
    source: "The Power of Vision",
    theme: ["vision", "purpose"],
    reflection_prompt: "Write down your specific vision for the next 12 months. Is it on paper, or just in your head?"
  },
  {
    id: 'oyedepo-007',
    mentorId: 'david-oyedepo',
    quote: "Prayer is not a monologue of complaints; it is a legal presentation of God's Word back to Him to command results.",
    source: "Exploits of Faith",
    theme: ["prayer", "covenant"],
    reflection_prompt: "When you pray, do you quote scripture and hold God to His covenant promises?"
  },
  {
    id: 'oyedepo-008',
    mentorId: 'david-oyedepo',
    quote: "Until you are committed to serving the interests of God's Kingdom, your life cannot command divine backing.",
    source: "Kingdom Service",
    theme: ["service", "alignment"],
    reflection_prompt: "How are you serving others or building God's community without expecting personal payment?"
  },
  {
    id: 'oyedepo-009',
    mentorId: 'david-oyedepo',
    quote: "The Bible is not a storybook; it is a covenant manual. Everything you need to succeed is written in the Book.",
    source: "Exploits of Faith",
    theme: ["bible", "wisdom"],
    reflection_prompt: "Do you read the Bible to study and extract principles, or just as a religious ritual?"
  },
  {
    id: 'oyedepo-010',
    mentorId: 'david-oyedepo',
    quote: "Your mouth is a weapon of war. Speak what you want to see, not what you currently feel.",
    source: "The Winning Wisdom",
    theme: ["declaration", "faith"],
    reflection_prompt: "Spend 5 minutes declaring victory, peace, and abundance over your career and health right now."
  },

  // PAUL ENENCHE
  {
    id: 'enenche-001',
    mentorId: 'paul-enenche',
    quote: "You are not an accident; you are a designed solution to a specific generational problem.",
    source: "Reason for Living",
    theme: ["destiny", "identity", "purpose"],
    reflection_prompt: "What specific pain or gap in society makes you angry? That anger is often a clue to your designed solution."
  },
  {
    id: 'enenche-002',
    mentorId: 'paul-enenche',
    quote: "Spiritual diligence is the master key to structural breakthrough. Lazy Christians cannot carry heavy mantles.",
    source: "Secrets of Spiritual Strength",
    theme: ["discipline", "diligence", "faith"],
    reflection_prompt: "How many minutes did you spend studying the Word and praying in the Spirit today?"
  },
  {
    id: 'enenche-003',
    mentorId: 'paul-enenche',
    quote: "Character is the structural container of your destiny. Charisma can take you to the top, but only character can keep you there.",
    source: "Who Are You?",
    theme: ["character", "integrity", "destiny"],
    reflection_prompt: "Is there a secret compromise in your business or relationship that you are trying to hide with charisma?"
  },
  {
    id: 'enenche-004',
    mentorId: 'paul-enenche',
    quote: "Praise is a spiritual trigger for the supernatural. When you praise God in difficulty, you invite His physical intervention.",
    source: "Power of Praise",
    theme: ["praise", "worship"],
    reflection_prompt: "Take 10 minutes to play music and praise God, ignoring all of your current financial or health worries."
  },
  {
    id: 'enenche-005',
    mentorId: 'paul-enenche',
    quote: "What you tolerate, you cannot terminate. If you tolerate mediocrity, it will become your permanent state.",
    source: "Secrets of Spiritual Strength",
    theme: ["mediocrity", "discipline"],
    reflection_prompt: "What toxic habits, relationships, or laziness are you tolerating in your life?"
  },
  {
    id: 'enenche-006',
    mentorId: 'paul-enenche',
    quote: "Knowledge is the fuel of faith. You cannot walk in a dimension of authority you don't have light on.",
    source: "Secrets of Spiritual Strength",
    theme: ["knowledge", "light"],
    reflection_prompt: "What book or course are you currently studying to expand your professional or spiritual competence?"
  },
  {
    id: 'enenche-007',
    mentorId: 'paul-enenche',
    quote: "Do not negotiate your consecration. Consecration is what keeps your spiritual authority sharp.",
    source: "Who Are You?",
    theme: ["consecration", "holiness"],
    reflection_prompt: "What boundary have you crossed recently that has dulled your spiritual peace and clarity?"
  },
  {
    id: 'enenche-008',
    mentorId: 'paul-enenche',
    quote: "The hand of the diligent shall bear rule. Lazy hands belong in servitude.",
    source: "Dunamis Sermons",
    theme: ["diligence", "work"],
    reflection_prompt: "Did you work today with the diligence of an owner, or the reluctance of a slave?"
  },
  {
    id: 'enenche-009',
    mentorId: 'paul-enenche',
    quote: "The presence of God is a physical place of refuge, renewal, and empowerment.",
    source: "Reason for Living",
    theme: ["presence", "devotion"],
    reflection_prompt: "How can you carve out an hour tomorrow to fully soak in instrumental worship and prayer?"
  },
  {
    id: 'enenche-010',
    mentorId: 'paul-enenche',
    quote: "Never let your achievements outgrow your humility. The moment you think you arrived, your departure begins.",
    source: "Who Are You?",
    theme: ["humility", "character"],
    reflection_prompt: "Are you giving God the glory for your recent successes, or silently taking the credit?"
  },

  // Dr. Becky Enenche
  {
    id: 'becky-001',
    mentorId: 'becky-enenche',
    quote: "Order is the first law of heaven. Where there is disorder, there is demonic delay.",
    source: "Dunamis Devotionals",
    theme: ["order", "discipline", "home"],
    reflection_prompt: "Look at your immediate physical workspace or room. Is it in order, or reflecting mental chaos?"
  },
  {
    id: 'becky-002',
    mentorId: 'becky-enenche',
    quote: "Family harmony is not an accident; it is the product of mutual submission, love, and constant prayer.",
    source: "Love & Marriage",
    theme: ["family", "love", "relationships"],
    reflection_prompt: "What is a minor dispute you can resolve with your spouse or family member today through gentle communication?"
  },
  {
    id: 'becky-003',
    mentorId: 'becky-enenche',
    quote: "A woman of strength is a woman who draws her daily water from the well of the Holy Spirit. She does not compete with order; she establishes it.",
    source: "The Courage of Conviction",
    theme: ["feminine-strength", "purpose"],
    reflection_prompt: "How are you cultivating quiet, powerful grace in your professional leadership or family role?"
  },
  {
    id: 'becky-004',
    mentorId: 'becky-enenche',
    quote: "Divine healing is your package. Your body is the temple of the Holy Spirit, not a storage box for sickness.",
    source: "Dunamis Sermons",
    theme: ["healing", "faith"],
    reflection_prompt: "Lay your hand on any part of your body that feels weak or diseased, and declare health and energy."
  },
  {
    id: 'becky-005',
    mentorId: 'becky-enenche',
    quote: "Purity of heart is what gives you access to the frequency of divine direction.",
    source: "The Courage of Conviction",
    theme: ["purity", "guidance"],
    reflection_prompt: "Are you harboring any secret envy, bitterness, or offense against a colleague?"
  },
  {
    id: 'becky-006',
    mentorId: 'becky-enenche',
    quote: "Academic excellence and professional competence must walk hand-in-hand with deep spiritual devotion.",
    source: "University Chapel Addresses",
    theme: ["academic-excellence", "devotion"],
    reflection_prompt: "Are you neglecting your technical studies or your Bible studies? How can you balance both?"
  },
  {
    id: 'becky-007',
    mentorId: 'becky-enenche',
    quote: "The beauty of life is discovered when we live to bless others. Selfishness is a spiritual prison.",
    source: "Dunamis Devotionals",
    theme: ["service", "compassion"],
    reflection_prompt: "What small, surprise act of kindness can you perform for someone who cannot repay you today?"
  },
  {
    id: 'becky-008',
    mentorId: 'becky-enenche',
    quote: "Do not let the pressure of society force you to compromise your covenant standards of courtship and purity.",
    source: "Love & Marriage",
    theme: ["standards", "courtship"],
    reflection_prompt: "Are you lowering your ethical or relational standards to fit in or avoid loneliness?"
  },
  {
    id: 'becky-009',
    mentorId: 'becky-enenche',
    quote: "The tongue of a mother can frame the destiny of her children. Speak blessings over your seed daily.",
    source: "Dunamis Devotionals",
    theme: ["words", "children"],
    reflection_prompt: "If you have children or mentees, what positive declarations did you speak over them today?"
  },
  {
    id: 'becky-010',
    mentorId: 'becky-enenche',
    quote: "In the presence of God, there is fullness of joy. Joy is a spiritual tonic that drives away depression.",
    source: "Love & Marriage",
    theme: ["joy", "presence"],
    reflection_prompt: "Smile, rejoice, and write down 5 specific victories God has given you in the past month."
  },

  // Apostle Joshua Selman
  {
    id: 'selman-001',
    mentorId: 'joshua-selman',
    quote: "The spiritual laws of the Kingdom of God are highly predictable. They are not emotional; they are systems of authority.",
    source: "Kingdom Laws",
    theme: ["laws", "kingdom", "theology"],
    reflection_prompt: "Are you trying to apply spiritual shortcut emotions to areas that require legal, structured obedience?"
  },
  {
    id: 'selman-002',
    mentorId: 'joshua-selman',
    quote: "Your value is what determines your influence. If you want societal influence, do not chase money; build your competence and capacity.",
    source: "Transforming the Mind",
    theme: ["value", "competence", "influence"],
    reflection_prompt: "What unique skill or capacity do you possess that is extremely rare and highly needed by others?"
  },
  {
    id: 'selman-003',
    mentorId: 'joshua-selman',
    quote: "Mental transformation is the precursor to personal transformation. You are only as free as your mind is renewed.",
    source: "Transforming the Mind",
    theme: ["renewing-mind", "growth"],
    reflection_prompt: "What toxic, limiting belief about wealth or capability did you learn from your childhood?"
  },
  {
    id: 'selman-004',
    mentorId: 'joshua-selman',
    quote: "An altar is a platform of legal traffic between the physical and spiritual realm. Your prayer life is your personal altar.",
    source: "The Mystery of Altars",
    theme: ["altar", "prayer", "spiritual-warfare"],
    reflection_prompt: "Is your personal altar active, or is it covered in the dust of social media distraction?"
  },
  {
    id: 'selman-005',
    mentorId: 'joshua-selman',
    quote: "Humility is not looking down on yourself; it is the complete absence of self-glorification and total dependence on God.",
    source: "Apostolic Teachings",
    theme: ["humility", "grace"],
    reflection_prompt: "When you receive credit for an outstanding job, is your inner state humble gratitude or secret pride?"
  },
  {
    id: 'selman-006',
    mentorId: 'joshua-selman',
    quote: "The currency of the Kingdom is faith, but the commodity of relationships is trust. Trust must be earned over time.",
    source: "Kingdom Laws",
    theme: ["relationships", "trust"],
    reflection_prompt: "Is there a relationship in your life where you have violated trust? How can you begin the patient repair process?"
  },
  {
    id: 'selman-007',
    mentorId: 'joshua-selman',
    quote: "The greatest tragedy of an undisciplined life is the slow, unconscious leakage of divine potentials.",
    source: "Apostolic Teachings",
    theme: ["discipline", "potential"],
    reflection_prompt: "What is the single 'leak' in your schedule that is draining your energy and potential daily?"
  },
  {
    id: 'selman-008',
    mentorId: 'joshua-selman',
    quote: "Success in the Kingdom is determined by the level of your alignment to the pattern of Christ. There is no custom success.",
    source: "Kingdom Laws",
    theme: ["success", "alignment"],
    reflection_prompt: "Does your definition of success match the character of Christ, or is it defined by modern celebrity culture?"
  },
  {
    id: 'selman-009',
    mentorId: 'joshua-selman',
    quote: "Grace is not a license for laziness; grace is an enablement that makes difficult execution look easy.",
    source: "Koinonia Messages",
    theme: ["grace", "diligence"],
    reflection_prompt: "Where are you using 'grace' as an excuse for poor preparation or half-hearted work?"
  },
  {
    id: 'selman-010',
    mentorId: 'joshua-selman',
    quote: "Every dimension of grace you see on another individual represents an altar of sacrifice you must respect.",
    source: "The Mystery of Altars",
    theme: ["respect", "grace", "sacrifice"],
    reflection_prompt: "Are you criticizing a leader or peer's success, or respecting the hidden years of sacrifice they paid?"
  },

  // Prof. Pa Mosy (Romanus Okafor)
  {
    id: 'mosy-001',
    mentorId: 'pa-mosy',
    quote: "Academic excellence without Christian character is a tragedy of monumental proportions. We must build both.",
    source: "Chapel Sermons",
    theme: ["academic-excellence", "character", "integration"],
    reflection_prompt: "Are you separating your intellectual life (work/study) from your spiritual life? How can they integrate?"
  },
  {
    id: 'mosy-002',
    mentorId: 'pa-mosy',
    quote: "The secret place of prayer is where the intellectual engine is sharpened. Never study without praying first.",
    source: "Chapel Sermons",
    theme: ["prayer", "study", "mind"],
    reflection_prompt: "Can you adopt a habit of praying in the Spirit for 5 minutes before opening any book or laptop?"
  },
  {
    id: 'mosy-003',
    mentorId: 'pa-mosy',
    quote: "A student who cheats to pass is a thief who will steal from his country when given a public office.",
    source: "Lectures on Academic Excellence",
    theme: ["integrity", "character"],
    reflection_prompt: "Are you taking shortcuts in your assessments, work reports, or accounting? Is it worth losing your soul?"
  },
  {
    id: 'mosy-004',
    mentorId: 'pa-mosy',
    quote: "The mentors you submit to will determine the coordinates of your destiny. Do not submit to blind guides.",
    source: "Lectures on Academic Excellence",
    theme: ["mentorship", "destiny"],
    reflection_prompt: "Who are the top 3 influencers or mentors you actively listen to weekly?"
  },
  {
    id: 'mosy-005',
    mentorId: 'pa-mosy',
    quote: "Be rigorous in your research, tireless in your preparation, and completely humble in your presentation.",
    source: "Lectures on Academic Excellence",
    theme: ["rigor", "preparation", "humility"],
    reflection_prompt: "Did you thoroughly prepare for your next assignment or presentation, or are you winging it?"
  },
  {
    id: 'mosy-006',
    mentorId: 'pa-mosy',
    quote: "Holiness in secret is the absolute foundation of permanent spiritual authority.",
    source: "Chapel Sermons",
    theme: ["secret", "holiness", "authority"],
    reflection_prompt: "If your secret browser history or thoughts were projected on a screen, would your character hold?"
  },
  {
    id: 'mosy-007',
    mentorId: 'pa-mosy',
    quote: "Christian scholarship must not be inferior. We must be the heads, not the tails, in our scientific research.",
    source: "Lectures on Academic Excellence",
    theme: ["scholarship", "excellence"],
    reflection_prompt: "Are you using your faith as an excuse for poor academic or scientific output?"
  },
  {
    id: 'mosy-008',
    mentorId: 'pa-mosy',
    quote: "The elder who does not pour himself into the next generation of youth is like a tree that refuses to bear seed.",
    source: "Chapel Sermons",
    theme: ["generations", "mentorship"],
    reflection_prompt: "Who is one younger person or student you can actively mentor or encourage this week?"
  },
  {
    id: 'mosy-009',
    mentorId: 'pa-mosy',
    quote: "God does not sponsor laziness. If you fail to study, do not expect the Holy Spirit to reveal exam answers to you in the hall.",
    source: "Lectures on Academic Excellence",
    theme: ["laziness", "responsibility", "study"],
    reflection_prompt: "Are you substituting deep, hard study or research with passive prayers for miracles?"
  },
  {
    id: 'mosy-010',
    mentorId: 'pa-mosy',
    quote: "Your credentials are sweet, but your character is what determines the aroma of your legacy.",
    source: "Chapel Sermons",
    theme: ["credentials", "character", "legacy"],
    reflection_prompt: "What will people remember most about you when you leave your current job or school?"
  },

  // Apostle Arome Osayi
  {
    id: 'arome-001',
    mentorId: 'arome-osayi',
    quote: "The spiritual altar is built in the secret place of intercession. Without a secret altar, your public ministry is a commercial farce.",
    source: "Go Forward",
    theme: ["altar", "intercession", "consecration"],
    reflection_prompt: "Have you spent deep, uninterrupted time with God in the last 48 hours without requesting material things?"
  },
  {
    id: 'arome-002',
    mentorId: 'arome-osayi',
    quote: "Consecration is the currency of the prophetic. The degree to which you can die to self determines the weight of the Word you carry.",
    source: "Go Forward",
    theme: ["consecration", "prophetic", "holiness"],
    reflection_prompt: "What aspect of your ego or material ambition must die today so that you can hear God clearly?"
  },
  {
    id: 'arome-003',
    mentorId: 'arome-osayi',
    quote: "The Holy Spirit does not work with commercial agents. He works with consecrated vessels.",
    source: "Decently and In Order",
    theme: ["holiness", "commercialization", "spirituality"],
    reflection_prompt: "Are you treating your spiritual gifts or business as a transaction, or a holy calling?"
  },
  {
    id: 'arome-004',
    mentorId: 'arome-osayi',
    quote: "Prayer is not a tool to bypass discipline; prayer is the mechanism that aligns you to the heavy demands of God.",
    source: "Go Forward",
    theme: ["prayer", "discipline", "alignment"],
    reflection_prompt: "Is your prayer life focused on changing God's mind, or aligning your stubborn mind to His?"
  },
  {
    id: 'arome-005',
    mentorId: 'arome-osayi',
    quote: "Order must precede the fire. If your personal life is in disorder, the fire of God will consume you instead of empowering you.",
    source: "Decently and In Order",
    theme: ["order", "fire", "character"],
    reflection_prompt: "In what area of your life are you expecting spiritual fire while living in total structural chaos?"
  },
  {
    id: 'arome-006',
    mentorId: 'arome-osayi',
    quote: "The voice of God is not an external loud noise; it is an internal sovereign witness that requires quietness to hear.",
    source: "RCN Teachings",
    theme: ["voice-of-god", "solitude", "quietness"],
    reflection_prompt: "Can you commit to sitting completely still for 15 minutes, listening for the quiet nudge of the Spirit?"
  },
  {
    id: 'arome-007',
    mentorId: 'arome-osayi',
    quote: "A man who cannot control his appetite is a security risk in the spiritual realm.",
    source: "Decently and In Order",
    theme: ["fasting", "appetite", "self-control"],
    reflection_prompt: "Have you practiced fasting recently to master your bodily cravings and sharpen your spiritual hearing?"
  },
  {
    id: 'arome-008',
    mentorId: 'arome-osayi',
    quote: "Spiritual authority is not about shouting; it is about the depth of your alignment to the Lordship of Christ.",
    source: "Go Forward",
    theme: ["authority", "alignment", "lordship"],
    reflection_prompt: "Who holds ultimate veto power over your commercial and career decisions? You or Christ?"
  },
  {
    id: 'arome-009',
    mentorId: 'arome-osayi',
    quote: "Sacrifice is the gate of access to generational mantles. There is no cheap entry into spiritual authority.",
    source: "RCN Audio Archive",
    theme: ["sacrifice", "mantle"],
    reflection_prompt: "What major sacrifice of comfort is God asking you to make in this season of your life?"
  },
  {
    id: 'arome-010',
    mentorId: 'arome-osayi',
    quote: "Do not move until the cloud moves. Haste in the physical realm leads to massive shipwrecks in the spiritual.",
    source: "RCN Audio Archive",
    theme: ["haste", "guidance", "patience"],
    reflection_prompt: "Are you about to jump into a new job or relationship out of impatience? Have you waited for spiritual confirmation?"
  },

  // PASTOR CHRIS
  {
    id: 'chris-001',
    mentorId: 'pastor-chris',
    quote: "You are a new creation in Christ Jesus. You don't have a past; you have a brand-new nature designed for victory.",
    source: "Rhapsody of Realities",
    theme: ["new-creation", "victory", "identity"],
    reflection_prompt: "Are you still defining yourself by your past sins, failures, or family background?"
  },
  {
    id: 'chris-002',
    mentorId: 'pastor-chris',
    quote: "Rhema is the spoken Word of God. When you speak the Word out of your mouth, it becomes creative power that changes physical matter.",
    source: "How to Make Your Faith Work",
    theme: ["rhema", "speech", "power"],
    reflection_prompt: "What physical situations (health, career, finance) do you need to actively speak God's Word over today?"
  },
  {
    id: 'chris-003',
    mentorId: 'pastor-chris',
    quote: "Your mind is the processor of your life. If you don't manage your mind with God's Word, you will live far below your redemptive package.",
    source: "The Power of Your Mind",
    theme: ["mind", "renewing", "success"],
    reflection_prompt: "What toxic, anxious thoughts did you allow to linger in your mind today? Replace them with scripture."
  },
  {
    id: 'chris-004',
    mentorId: 'pastor-chris',
    quote: "Healing is not a miracle you are begging for; healing is a completed redemptive legal fact. Walk in divine health daily.",
    source: "Rhapsody of Realities",
    theme: ["healing", "divine-health", "faith"],
    reflection_prompt: "Instead of praying for healing, can you begin thanking God that by His stripes you are already healed?"
  },
  {
    id: 'chris-005',
    mentorId: 'pastor-chris',
    quote: "The Holy Spirit is your standby, your counselor, your helper, and your guide. He is a real Person who lives inside you.",
    source: "Rhapsody of Realities",
    theme: ["holy-spirit", "presence", "relationship"],
    reflection_prompt: "Have you spoken to the Holy Spirit today as your real, immediate best friend and advisor?"
  },
  {
    id: 'chris-006',
    mentorId: 'pastor-chris',
    quote: "Your faith is your currency. If you don't practice speaking and acting on your faith in small things, it won't work in big things.",
    source: "How to Make Your Faith Work",
    theme: ["faith", "speech", "action"],
    reflection_prompt: "How can you put your faith to active, vocal use regarding a minor problem you are facing today?"
  },
  {
    id: 'chris-007',
    mentorId: 'pastor-chris',
    quote: "The gospel of Christ is not a philosophy; it is the active dynamic power of God unto salvation and victory.",
    source: "Rhapsody of Realities",
    theme: ["gospel", "power"],
    reflection_prompt: "Do you talk about theology as an academic debate, or actively apply the power of God to real problems?"
  },
  {
    id: 'chris-008',
    mentorId: 'pastor-chris',
    quote: "You are a legal joint-heir with Christ. Everything He owns, you own. Stop begging and start declaring your inheritance.",
    source: "The Power of Your Mind",
    theme: ["inheritance", "dominion"],
    reflection_prompt: "Are you approaching God with the posture of a fearful beggar, or a confident royal child?"
  },
  {
    id: 'chris-009',
    mentorId: 'pastor-chris',
    quote: "The words you speak determine the path of your life. Life and death are in the power of your tongue.",
    source: "How to Make Your Faith Work",
    theme: ["words", "declaration"],
    reflection_prompt: "Are you complaining 'I'm so tired' or 'I don't have enough money'? Stop and declare: 'I am full of energy and supply!'"
  },
  {
    id: 'chris-010',
    mentorId: 'pastor-chris',
    quote: "Love is the ultimate law. Walking in love is walking in absolute spiritual safety.",
    source: "Rhapsody of Realities",
    theme: ["love", "standards"],
    reflection_prompt: "Is there someone who hurt you that you need to release and forgive completely out of love today?"
  },

  // KENNETH HAGIN
  {
    id: 'hagin-001',
    mentorId: 'kenneth-hagin',
    quote: "The believer's authority is a completed legal reality in Christ. Jesus broke the power of the devil, and gave you the keys of authority on this earth.",
    source: "The Believer's Authority",
    theme: ["authority", "dominion", "victory"],
    reflection_prompt: "Are you begging God to fight the devil for you, or using your given authority to command situations to shift?"
  },
  {
    id: 'hagin-002',
    mentorId: 'kenneth-hagin',
    quote: "Faith is believing in your heart and saying with your mouth. If you believe it but won't say it, your faith won't work.",
    source: "How You Can Be Led by the Spirit of God",
    theme: ["faith", "mechanics-of-faith", "speech"],
    reflection_prompt: "What scripture is burning in your heart that you need to speak out loud 10 times right now?"
  },
  {
    id: 'hagin-003',
    mentorId: 'kenneth-hagin',
    quote: "I was on my deathbed for sixteen months, paralyzed with a deformed heart. But when I read Mark 11:23-24, I realized faith was a present-tense reality. I believed I received my healing, spoke it, and walked.",
    source: "I Believe in Visions",
    theme: ["healing", "testimony", "present-faith"],
    reflection_prompt: "Are you waiting to see a physical change before you believe, or believing God's Word first?"
  },
  {
    id: 'hagin-004',
    mentorId: 'kenneth-hagin',
    quote: "The Holy Spirit leads you through the inward witness. It's a quiet, velvety-smooth nudge in your spirit, not a loud voice.",
    source: "How You Can Be Led by the Spirit of God",
    theme: ["holy-spirit", "guidance", "inward-witness"],
    reflection_prompt: "When you have a quick, quiet sense of caution about a deal or person, do you ignore it or investigate?"
  },
  {
    id: 'hagin-005',
    mentorId: 'kenneth-hagin',
    quote: "You can have what you say. If you say you can't, you can't. If you say you can through Christ, you will.",
    source: "How You Can Be Led by the Spirit of God",
    theme: ["words", "declaration", "mindset"],
    reflection_prompt: "What negative confessions have you been making over your children or bank account?"
  },
  {
    id: 'hagin-006',
    mentorId: 'kenneth-hagin',
    quote: "Love is the key to keeping your faith working. Faith doesn't work in an environment of bitterness and grudge-holding.",
    source: "The Believer's Authority",
    theme: ["love", "faith", "forgiveness"],
    reflection_prompt: "Are you holding onto resentment toward someone? Let it go so your prayers are not hindered."
  },
  {
    id: 'hagin-007',
    mentorId: 'kenneth-hagin',
    quote: "The Holy Spirit will never lead you contrary to the written Word of God. If your inward nudge contradicts scripture, throw it out.",
    source: "How You Can Be Led by the Spirit of God",
    theme: ["guidance", "bible", "standards"],
    reflection_prompt: "Does your current questionable business compromise align with the plain text of scripture?"
  },
  {
    id: 'hagin-008',
    mentorId: 'kenneth-hagin',
    quote: "I found out that the best way to get your prayers answered is to find scriptures that cover your case, write them down, and stand on them.",
    source: "The Believer's Authority",
    theme: ["prayer", "scripture"],
    reflection_prompt: "Find 3 specific Bible verses that guarantee provision or healing, and write them in your notebook today."
  },
  {
    id: 'hagin-009',
    mentorId: 'kenneth-hagin',
    quote: "Flowing with the Spirit requires yielding your mind and yielding your body. It is a gentle, peaceful submission.",
    source: "How You Can Be Led by the Spirit of God",
    theme: ["holy-spirit", "submission"],
    reflection_prompt: "Are you trying to force your own schedule, or resting and letting the Spirit direct your steps?"
  },
  {
    id: 'hagin-010',
    mentorId: 'kenneth-hagin',
    quote: "God has given every believer a measure of faith. It's up to you to feed it on the Word and exercise it.",
    source: "The Believer's Authority",
    theme: ["faith", "exercise", "study"],
    reflection_prompt: "How can you 'exercise' your faith muscle today? What bold step can you take on God's Word?"
  }
];
