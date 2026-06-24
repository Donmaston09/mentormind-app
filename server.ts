import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());

type AIProvider = "gemini" | "groq" | "openai" | "anthropic";

type GenerateOptions = {
  systemInstruction: string;
  contents: any;
  temperature?: number;
  responseMimeType?: "application/json";
};

const PROVIDER_LABELS: Record<AIProvider, string> = {
  gemini: "Gemini",
  groq: "Groq",
  openai: "OpenAI",
  anthropic: "Anthropic",
};

function normalizeProvider(provider?: string): AIProvider {
  const configured = (provider || process.env.AI_PROVIDER || "gemini").toLowerCase();
  if (configured === "groq" || configured === "openai" || configured === "anthropic" || configured === "gemini") {
    return configured;
  }
  return "gemini";
}

function contentToMessages(contents: any): Array<{ role: "user" | "assistant"; content: string }> {
  if (typeof contents === "string") {
    return [{ role: "user", content: contents }];
  }

  if (!Array.isArray(contents)) {
    return [{ role: "user", content: String(contents || "") }];
  }

  return contents.map((item: any): { role: "user" | "assistant"; content: string } => {
    const role: "user" | "assistant" = item.role === "model" ? "assistant" : "user";
    const content = Array.isArray(item.parts)
      ? item.parts.map((part: any) => part.text || "").join("\n")
      : item.text || "";
    return { role, content };
  }).filter((message: any) => message.content.trim().length > 0);
}

// Lazy GoogleGenAI client helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

let groqClient: Groq | null = null;
function getGroqClient(): Groq | null {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "MY_GROQ_API_KEY") {
    return null;
  }
  if (!groqClient) {
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

let openAIClient: OpenAI | null = null;
function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "MY_OPENAI_API_KEY") {
    return null;
  }
  if (!openAIClient) {
    openAIClient = new OpenAI({ apiKey });
  }
  return openAIClient;
}

let anthropicClient: Anthropic | null = null;
function getAnthropicClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "MY_ANTHROPIC_API_KEY") {
    return null;
  }
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
}

// Resilient wrapper to handle model rate limiting or 503 service unavailability
async function generateContentWithBackup(
  ai: GoogleGenAI,
  options: {
    contents: any;
    config?: any;
  }
) {
  const modelsToTry = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (const model of modelsToTry) {
    let attempts = 3;
    let delay = 300; // ms
    while (attempts > 0) {
      try {
        return await ai.models.generateContent({
          model,
          ...options,
        });
      } catch (error: any) {
        lastError = error;
        const status = error.status || (error.message && error.message.includes("503") ? 503 : null);
        const code = error.code || (error.message && error.message.includes("429") ? 429 : null);
        const isUnavailable = error.message?.includes("UNAVAILABLE") || error.message?.includes("high demand") || error.message?.includes("experiencing high demand");
        
        // If it's a rate limit or service unavailable, wait a bit and retry
        if (status === 503 || code === 429 || isUnavailable) {
          attempts--;
          if (attempts > 0) {
            console.warn(`[Gemini API] Model ${model} returned high demand/503. Retrying in ${delay}ms... (Attempts left: ${attempts})`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // exponential backoff
            continue;
          }
        }
        break;
      }
    }
    console.warn(`[Gemini API] Model ${model} failed. Trying next fallback model if available...`);
  }

  // If all failed, throw the last error
  throw lastError || new Error("All Gemini models failed to generate content.");
}

async function generateAIContent(provider: AIProvider, options: GenerateOptions): Promise<string> {
  const temperature = options.temperature ?? 0.7;
  const jsonInstruction = options.responseMimeType === "application/json"
    ? "\n\nReturn only a valid raw JSON object. Do not include markdown fences, prose, or backticks."
    : "";

  if (provider === "gemini") {
    const ai = getGeminiClient();
    if (!ai) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }
    const response = await generateContentWithBackup(ai, {
      contents: options.contents,
      config: {
        systemInstruction: `${options.systemInstruction}${jsonInstruction}`,
        responseMimeType: options.responseMimeType,
        temperature,
      }
    });
    return response.text || "";
  }

  if (provider === "groq") {
    const client = getGroqClient();
    if (!client) {
      throw new Error("GROQ_API_KEY is not configured.");
    }
    const completion = await client.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: `${options.systemInstruction}${jsonInstruction}` },
        ...contentToMessages(options.contents),
      ],
      temperature,
      response_format: options.responseMimeType === "application/json" ? { type: "json_object" } : undefined,
    });
    return completion.choices[0]?.message?.content || "";
  }

  if (provider === "openai") {
    const client = getOpenAIClient();
    if (!client) {
      throw new Error("OPENAI_API_KEY is not configured.");
    }
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: `${options.systemInstruction}${jsonInstruction}` },
        ...contentToMessages(options.contents),
      ],
      temperature,
      response_format: options.responseMimeType === "application/json" ? { type: "json_object" } : undefined,
    });
    return completion.choices[0]?.message?.content || "";
  }

  const client = getAnthropicClient();
  if (!client) {
    throw new Error("ANTHROPIC_API_KEY is not configured.");
  }
  const response = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest",
    max_tokens: 2048,
    temperature,
    system: `${options.systemInstruction}${jsonInstruction}`,
    messages: contentToMessages(options.contents),
  });
  return response.content
    .map((block: any) => block.type === "text" ? block.text : "")
    .join("")
    .trim();
}

function providerOfflineResponse(provider: AIProvider, error: any) {
  return {
    offlineMode: true,
    provider,
    error: error?.message || `${PROVIDER_LABELS[provider]} is not configured. Falling back to Offline Wisdom Mode.`
  };
}

// 1. CHAT API
app.post("/api/chat", async (req, res) => {
  const provider = normalizeProvider(req.body?.provider);
  try {
    const { message, history, mentorIds, mentorPrompts, userName, activeGoals, recentJournals } = req.body;

    let systemInstruction = "";
    let contents = [];

    // Compile active goals context
    let goalsContext = "";
    if (activeGoals && activeGoals.length > 0) {
      goalsContext = activeGoals.map((g: any) => `- Goal: "${g.title}" (Domain: ${g.domain}, Progress: ${g.progress}%)`).join("\n");
    }

    // Compile recent journals context
    let journalsContext = "";
    if (recentJournals && recentJournals.length > 0) {
      journalsContext = recentJournals.map((j: any) => `- Journal Entry on ${j.date} (${j.type}): "${j.content.slice(0, 180)}..."`).join("\n");
    }

    // Construct prompts based on panel or single mode
    if (mentorIds.length === 1) {
      // Single mentor mode
      const promptText = mentorPrompts[mentorIds[0]] || "";
      const mentorName = mentorIds[0];
      
      systemInstruction = `${promptText}
You are a warm, challenging, and deeply relational mentor addressing your beloved mentee, ${userName || 'friend'}.
${goalsContext ? `Your mentee is currently working on these active goals:\n${goalsContext}\n` : ''}
${journalsContext ? `Their recent self-reflections show these thoughts:\n${journalsContext}\n` : ''}

CRITICAL CONVERSATIONAL RULES:
1. Address them directly by their name: ${userName || 'friend'}.
2. Relate like a real human mentor. Maintain a warm, highly personal dialogue that references what they are going through (including their goals or latest journal reflections where relevant). Do not write essays or sound like a standard assistant.
3. Be supportive but firm. Push them toward extreme excellence or spiritual maturity.
4. Include 1 simulated book/teaching/sermon source reference at the end in the format '[Source: "Book/Sermon Name"]'. Underneath, provide 1 short, deeply reflective 'Reflection Prompt' and 1 'Follow-up Question'.`;
      
      // Map history to Gemini format
      history.forEach((msg: any) => {
        contents.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      });
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });
    } else {
      // Panel mode
      const mentorNamesList = mentorIds.map((id: string) => {
        const matchingName = id.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        return matchingName;
      }).join(', ');

      const mentorDetails = mentorIds.map((id: string) => {
        return `Mentor ID: ${id}\nSystem Persona Prompt:\n${mentorPrompts[id] || ""}`;
      }).join("\n\n---\n\n");

      systemInstruction = `You are a world-class moderator facilitating an active, collaborative, and highly engaging panel dialogue with these mentors: ${mentorNamesList}, for the mentee: ${userName || 'friend'}.
Selected Mentors Details:
${mentorDetails}

${goalsContext ? `The mentee's active goals:\n${goalsContext}\n` : ''}
${journalsContext ? `The mentee's recent journal reflections show:\n${journalsContext}\n` : ''}

CRITICAL AGENTIC PANEL RULES:
1. The moderator should introduce the dialogue session very briefly, then pass the floor to the mentors.
2. Mentors MUST NOT speak sequentially in isolation! They must actively converse with, challenge, or support each other (e.g., 'Socrates makes an interesting point about questions, but let me add...', or 'While King Solomon speaks of diligence, we must back it with the covenant exploits of faith!'). They should reference and talk to each other directly, as well as addressing ${userName || 'friend'} directly by name.
3. Tailor the advice to the mentee's specific goals and journals where appropriate, showing real panel cohesion and preparedness.
4. Each speaker must maintain their highly distinct voice, style, and historical authority.
5. Format the responses with clear bold headings for each speaker, e.g. '### 🗣️ [Mentor Name]'.
6. Include a list of simulated sources referenced by the mentors at the very end.
7. Provide a consolidated Reflection Prompt and Follow-up Question at the bottom of the dialogue.`;

      // Build conversation history
      history.forEach((msg: any) => {
        contents.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      });
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });
    }

    const replyText = await generateAIContent(provider, {
      contents,
      systemInstruction,
      temperature: 0.75,
    });

    res.json({
      text: replyText || "I was unable to synthesize a response. Please try again.",
      provider,
      isOffline: false
    });

  } catch (error: any) {
    console.warn(`${PROVIDER_LABELS[provider]} Chat Error:`, error);
    res.json(providerOfflineResponse(provider, error));
  }
});

// 1B. PROACTIVE COUNSEL API
app.post("/api/proactive-counsel", async (req, res) => {
  const provider = normalizeProvider(req.body?.provider);
  try {
    const { userName, activeGoals, recentJournals, mentorIds, mentorPrompts } = req.body;

    if (!mentorIds || mentorIds.length === 0) {
      return res.json({
        offlineMode: true,
        provider,
        counsel: {}
      });
    }

    let goalsContext = "No active goals logged.";
    if (activeGoals && activeGoals.length > 0) {
      goalsContext = activeGoals.map((g: any) => `- Goal: "${g.title}" (Domain: ${g.domain}, Progress: ${g.progress}%)`).join("\n");
    }

    let journalsContext = "No recent journals recorded.";
    if (recentJournals && recentJournals.length > 0) {
      journalsContext = recentJournals.map((j: any) => `- Journal on ${j.date}: "${j.content.slice(0, 150)}..."`).join("\n");
    }

    const mentorDetails = mentorIds.map((id: string) => {
      return `Mentor ID: ${id}\nSystem Persona Prompt:\n${mentorPrompts[id] || ""}`;
    }).join("\n\n---\n\n");

    const systemInstruction = `You are a counsel of elite mentors delivering short, proactive, hyper-relational guidance notes to your mentee, ${userName || 'friend'}.
Active Goals of the mentee:
${goalsContext}

Recent Journal entries:
${journalsContext}

For each of the requested mentor IDs listed below, generate exactly ONE highly customized, relational advisory note (1 to 2 sentences max).
Requested Mentors:
${mentorDetails}

CRITICAL PROACTIVE RULES:
1. Speak in their highly authentic, distinct voice. Address ${userName || 'friend'} directly by name in the note.
2. Refer directly and insightfully to one of their active goals (mentioning its name or progress) or a feeling/thought they expressed in their recent journals. Show that you have been actively studying their progress!
3. Do not output generic motivational templates. Let it be a deep, authentic spark.
4. Keep the output extremely clean, and return a RAW JSON object matching this schema exactly:
{
  "counsel": {
    "mentor-id-1": "Short 1-2 sentence counsel note",
    "mentor-id-2": "Short 1-2 sentence counsel note"
  }
}
Do not wrap inside markdown blocks or include backticks.`;

    const responseText = await generateAIContent(provider, {
      contents: `Provide advisory notes for ${userName || 'friend'} based on their state.`,
      systemInstruction,
      responseMimeType: "application/json",
      temperature: 0.8,
    });

    const result = JSON.parse(responseText.trim());
    res.json({ ...result, provider });

  } catch (error: any) {
    console.warn(`${PROVIDER_LABELS[provider]} Proactive Counsel Error:`, error);
    res.json({
      offlineMode: true,
      provider,
      error: error.message || "Failed to generate proactive counsel.",
      counsel: {}
    });
  }
});

// 2. JOURNAL ANALYSIS API
app.post("/api/journal-analyze", async (req, res) => {
  const provider = normalizeProvider(req.body?.provider);
  try {
    const { content, type } = req.body;

    const systemInstruction = `You are an expert psychological coach, therapist, and spiritual mentor.
Analyze the user's ${type} journal entry. Provide a supportive, highly constructive analysis in JSON format.
Your analysis must strictly match this TypeScript schema:
{
  summary: string; // Warm, 1-2 sentence overview of the entry
  themes: string[]; // 2-4 themes from: Career, Spiritual, Relationships, Health, Purpose, Finance, Learning, Personal Growth
  blindSpots: string[]; // 1-2 subtle cognitive distortion or potential blindspot they might not notice
  growthAreas: string[]; // 2-3 specific, actionable steps or mind shifts they can take
  sentiment: 'positive' | 'reflective' | 'struggling' | 'determined' | 'neutral'; // Best fitting category
  coachingQuestion: string; // A deeply personal, open-ended question that challenges them to grow
}
Make sure your response is a valid, raw JSON object without markdown wrapping or backticks.`;

    const responseText = await generateAIContent(provider, {
      contents: `Analyze this journal entry:\n\n"${content}"`,
      systemInstruction,
      responseMimeType: "application/json",
      temperature: 0.7,
    });

    const analysis = JSON.parse(responseText.trim());
    res.json({ ...analysis, provider });

  } catch (error: any) {
    console.warn(`${PROVIDER_LABELS[provider]} Journal Analysis Error:`, error);
    res.json({
      offlineMode: true,
      provider,
      error: error.message || "Unable to complete AI analysis."
    });
  }
});

// 3. DAILY THEME GENERATOR API
app.post("/api/daily-theme", async (req, res) => {
  const provider = normalizeProvider(req.body?.provider);
  try {
    const { journalsHistory } = req.body;

    if (!journalsHistory || journalsHistory.length === 0) {
      return res.json({
        theme: "Self-Reflection & Foundation",
        devotional: "Today is a pristine canvas for self-discipline, aligning your actions with your highest values.",
        provider,
      });
    }

    const journalTexts = journalsHistory.map((j: any) => `[${j.date}]: ${j.content}`).join("\n\n");
    const systemInstruction = `Based on the user's recent journal history, synthesize a specific focus theme and a devotional encouragement for today.
Provide the response as a simple JSON object matching this schema:
{
  theme: string; // Short 2-4 word theme (e.g. 'Overcoming Resistance', 'Consecration of Career', 'Covenant Financial Stewardship')
  devotional: string; // Warm, highly inspiring, 2-3 sentence devotional guide/instruction written in a supportive spiritual and intellectual tone
}
Make sure your response is valid JSON.`;

    const responseText = await generateAIContent(provider, {
      contents: `Recent journals:\n\n${journalTexts}`,
      systemInstruction,
      responseMimeType: "application/json",
      temperature: 0.7,
    });

    const result = JSON.parse(responseText.trim());
    res.json({ ...result, provider });

  } catch (error: any) {
    console.warn(`${PROVIDER_LABELS[provider]} Daily Theme Error:`, error);
    res.json({
      theme: "Self-Reflection & Foundation",
      devotional: "Today is a pristine canvas for self-discipline, aligning your actions with your highest values.",
      provider,
    });
  }
});

// VITE MIDDLEWARE SETUP
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] MentorMind full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
