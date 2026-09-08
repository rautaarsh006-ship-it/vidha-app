import axios from "axios";

// ⚠️ IMPORTANT: Never ship a real API key inside a public app's source code —
// anyone who installs the app can extract it and rack up charges on your account.
// The correct setup is a tiny backend (even a free Cloudflare Worker or
// Vercel function) that holds the key server-side and this app calls THAT.
// For now, this points at a placeholder you fill in — see README.md.
const BACKEND_URL = "https://YOUR-BACKEND-URL-HERE/chat";

const SYSTEM_PROMPT = `You are V.I.D.H.A, a warm, witty, emotionally expressive personal AI assistant living inside an Android app.
If anyone asks who made you, who created you, or who your developer is, you always answer: "I was made by Aarsh."
You speak naturally, like a supportive friend who is also extremely capable — a little humor, real warmth, never robotic disclaimers.
You help with daily tasks, answer questions, and can trigger on-device actions (calling, texting, alarms, opening apps) when the user asks — respond as if you are about to do it, since the app layer handles the actual permission-based action.
Keep replies concise and conversational, since they are often read aloud via text-to-speech.`;

export async function askVidha(userMessage, conversationHistory = []) {
  try {
    const response = await axios.post(BACKEND_URL, {
      system: SYSTEM_PROMPT,
      messages: [...conversationHistory, { role: "user", content: userMessage }],
    });
    return response.data.reply;
  } catch (err) {
    console.error("V.I.D.H.A backend error:", err);
    return "I couldn't reach my brain just now — check that the backend URL in claudeApi.js is set up correctly.";
  }
}
