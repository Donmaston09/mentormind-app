# 🗣️ MentorMind

MentorMind is a premium, interactive AI mentoring and personal reflection workspace. It connects you with a curated council of history's greatest intellectual and spiritual mentors (such as Socrates, King Solomon, and others) to guide you through your personal growth, goals, and daily reflections. 

Powered by **Groq's Ultra-Fast Inference LLM API**, MentorMind simulates highly distinct, contextual, and relational advisory conversations.

---

## 🌟 Key Features

### 1. 👥 Interactive Mentor Council (Single & Panel Mode)
- **Single Mentor**: Engage in a warm, challenging, and deeply relational one-on-one dialogue with a selected mentor speaking in their authentic historical voice.
- **Panel Mode**: Assemble a council of multiple mentors! The AI acts as a moderator, facilitating an active, collaborative dialogue where mentors interact, challenge, and build on each other's ideas in real-time.

### 2. 📝 Cognitive Journal Analysis
- Log your morning or evening journal entries.
- Receive immediate, constructive analysis highlighting **core themes**, subtle **cognitive blind spots**, and **actionable growth areas**.
- Get challenged by a deeply personal, open-ended **coaching question** to promote further self-reflection.

### 3. 🎯 Goal-Oriented Proactive Counsel
- Set and track active goals across various domains (Career, Spiritual, Finance, Health, Relationships, Learning).
- The mentor council actively reviews your goals and latest journals, delivering short, personalized, hyper-relational guidance notes tailored to your current status.

### 4. 🌅 Daily Theme & Devotional Generator
- Synthesizes your recent journal entries to generate a tailored daily focus theme (e.g., *Overcoming Resistance*, *Financial Stewardship*) and a warm, intellectually-rich devotional guidance for your day.

---

## 🛠️ Technology Stack

- **Frontend**: React (v19) + Vite + TailwindCSS (for sleek, responsive UI and fluid animations).
- **Backend**: Node.js + Express (TypeScript) serving the API endpoints.
- **AI Engine**: Groq SDK (`llama3-70b-8192` with fallbacks to `mixtral-8x7b-32768` and `llama3-8b-8192` for high reliability and sub-second responses).
- **Database**: Local JSON storage (client-side persisted) for lightweight and instant onboarding.
