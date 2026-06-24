# MentorMind Reloaded

MentorMind is a personal reflection, growth, goals, devotional, and AI mentorship app. It combines a Vite React frontend with an Express backend that can route AI requests to Gemini, Groq, OpenAI, or Anthropic.

Developed by **Tony Onoja, PhD**, School of Health Sciences, University of Surrey.

## Features

- Mentor chat with single-mentor and multi-mentor panel modes.
- Journal analysis, daily focus generation, proactive counsel, and local offline fallbacks.
- Server-side API key handling for Gemini, Groq, OpenAI, and Anthropic.
- Browser-local persistence through IndexedDB.
- Production build served by the same Express app for Render deployment.

## Local Setup

Prerequisites: Node.js 22 or later.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file:

   ```bash
   cp .env.example .env
   ```

3. Add at least one API key to `.env` and set the default provider:

   ```bash
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your_key_here
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

The app runs at `http://localhost:3000`.

## AI Providers

Supported provider values:

- `gemini` with `GEMINI_API_KEY`
- `groq` with `GROQ_API_KEY`
- `openai` with `OPENAI_API_KEY`
- `anthropic` with `ANTHROPIC_API_KEY`

Users can select a provider in the Settings screen. If the selected provider is missing credentials or unavailable, MentorMind falls back to offline mode where available.

Optional model overrides:

- `GROQ_MODEL`
- `OPENAI_MODEL`
- `ANTHROPIC_MODEL`

## Build And Run

```bash
npm run build
npm run start
```
