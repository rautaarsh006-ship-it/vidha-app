// Minimal backend so your Anthropic API key never lives inside the app itself.
// Deploy this free on Render, Railway, or a Vercel serverless function.
//
// Setup:
//   npm init -y
//   npm install express cors @anthropic-ai/sdk
//   ANTHROPIC_API_KEY=sk-ant-xxxx node server.js

const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.post("/chat", async (req, res) => {
  const { system, messages } = req.body;
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      system,
      messages,
    });
    const reply = response.content.find((c) => c.type === "text")?.text || "";
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reach Claude." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`V.I.D.H.A backend running on port ${PORT}`));
