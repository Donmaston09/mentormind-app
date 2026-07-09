import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy Groq client helper
let groqClient: Groq | null = null;
function getGroqClient(): Groq | null {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === "MY_GROQ_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  if (!groqClient) {
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

// Resilient wrapper to handle model rate limiting or 503 service unavailability
async function generateGroqContentWithBackup(
  ai: Groq,
  messages: any[],
  options: any = {}
) {
  const modelsToTry = ["llama3-70b-8192", "mixtral-8x7b-32768", "llama3-8b-8192"];
  let lastError: any = null;

  for (const model of modelsToTry) {
    let attempts = 3;
    let delay = 300; // ms
    while (attempts > 0) {
      try {
        return await ai.chat.completions.create({
          model,
          messages,
          ...options,
        });
      } catch (error: any) {
        lastError = error;
        const status = error.status;
        const isRateLimit = status === 429;
        const isUnavailable = status === 503 || (error.message && error.message.includes("high demand"));
        
        if (isRateLimit || isUnavailable) {
          attempts--;
          if (attempts > 0) {
            console.warn(`[Groq API] Model ${model} returned rate limit/503. Retrying in ${delay}ms... (Attempts left: ${attempts})`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // exponential backoff
            continue;
          }
        }
        break;
      }
    }
    console.warn(`[Groq API] Model ${model} failed. Trying next fallback model if available...`);
  }

  throw lastError || new Error("All Groq models failed to generate content.");
}

// 1. CHAT API
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, mentorIds, mentorPrompts, userName, activeGoals, recentJournals } = req.body;
    const ai = getGroqClient();

    if (!ai) {
      return res.json({
        offlineMode: true,
        error: "GROQ_API_KEY is not configured. Falling back to Offline Wisdom Mode."
      });
    }

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
      
      // Map history to Groq format
      contents.push({ role: "system", content: systemInstruction });
      history.forEach((msg: any) => {
        contents.push({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text
        });
      });
      contents.push({
        role: "user",
        content: message
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
      contents.push({ role: "system", content: systemInstruction });
      history.forEach((msg: any) => {
        contents.push({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text
        });
      });
      contents.push({
        role: "user",
        content: message
      });
    }

    const response = await generateGroqContentWithBackup(ai, contents, {
      temperature: 0.75,
    });

    const replyText = response.choices[0]?.message?.content || "I was unable to synthesize a response. Please try again.";

    res.json({
      text: replyText,
      isOffline: false
    });

  } catch (error: any) {
    console.warn("Groq Chat Error:", error);
    res.json({
      offlineMode: true,
      error: error.message || "An error occurred with the AI service. Switching to Offline Mode."
    });
  }
});

// 1B. PROACTIVE COUNSEL API
app.post("/api/proactive-counsel", async (req, res) => {
  try {
    const { userName, activeGoals, recentJournals, mentorIds, mentorPrompts } = req.body;
    const ai = getGroqClient();

    if (!ai || !mentorIds || mentorIds.length === 0) {
      return res.json({
        offlineMode: true,
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

    const messages = [
      { role: "system", content: systemInstruction },
      { role: "user", content: `Provide advisory notes for ${userName || 'friend'} based on their state.` }
    ];
    const response = await generateGroqContentWithBackup(ai, messages, {
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const responseText = response.choices[0]?.message?.content || "{}";
    const result = JSON.parse(responseText.trim());
    res.json(result);

  } catch (error: any) {
    console.warn("Groq Proactive Counsel Error:", error);
    res.json({
      offlineMode: true,
      error: error.message || "Failed to generate proactive counsel.",
      counsel: {}
    });
  }
});

// 2. JOURNAL ANALYSIS API
app.post("/api/journal-analyze", async (req, res) => {
  try {
    const { content, type } = req.body;
    const ai = getGroqClient();

    if (!ai) {
      return res.json({
        offlineMode: true,
        error: "GROQ_API_KEY is not configured."
      });
    }

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

    const messages = [
      { role: "system", content: systemInstruction },
      { role: "user", content: `Analyze this journal entry:\n\n"${content}"` }
    ];
    const response = await generateGroqContentWithBackup(ai, messages, {
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const responseText = response.choices[0]?.message?.content || "{}";
    const analysis = JSON.parse(responseText.trim());
    res.json(analysis);

  } catch (error: any) {
    console.warn("Groq Journal Analysis Error:", error);
    res.json({
      offlineMode: true,
      error: error.message || "Unable to complete AI analysis."
    });
  }
});

// 3. DAILY THEME GENERATOR API
app.post("/api/daily-theme", async (req, res) => {
  try {
    const { journalsHistory } = req.body;
    const ai = getGroqClient();

    if (!ai || !journalsHistory || journalsHistory.length === 0) {
      return res.json({
        theme: "Self-Reflection & Foundation",
        devotional: "Today is a pristine canvas for self-discipline, aligning your actions with your highest values."
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

    const messages = [
      { role: "system", content: systemInstruction },
      { role: "user", content: `Recent journals:\n\n${journalTexts}` }
    ];
    const response = await generateGroqContentWithBackup(ai, messages, {
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const responseText = response.choices[0]?.message?.content || "{}";
    const result = JSON.parse(responseText.trim());
    res.json(result);

  } catch (error: any) {
    console.warn("Groq Daily Theme Error:", error);
    res.json({
      theme: "Self-Reflection & Foundation",
      devotional: "Today is a pristine canvas for self-discipline, aligning your actions with your highest values."
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
