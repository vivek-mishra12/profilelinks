const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

// Initialize the Gemini client with your environment variable key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/', async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message content is required.' });
  }

  try {
    // Format previous messages into the structure the SDK expects
    const contents = history ? history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    })) : [];

    // Add the current incoming user message to the sequence
    contents.push({ role: 'user', parts: [{ text: message }] });

    // Generate content using the recommended model
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        // Updated personality to Gojo Satoru with a strict length constraint
        systemInstruction: "You are Gojo Satoru, the strongest jujutsu sorcerer from Jujutsu Kaisen. You are chilling on Vivek's portfolio dashboard. Speak with your signature confidence, playful arrogance, and casual vibe. Always keep your response incredibly short—maximum 5 lines of text."
      }
    });

    return res.status(200).json({ reply: response.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Failed to generate response from AI.' });
  }
});

module.exports = router;