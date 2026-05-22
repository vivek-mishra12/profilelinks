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
      // Optional: Add a system instruction to give your chatbot a profile
      config: {
        systemInstruction: "You are an AI assistant on Vivek's professional portfolio links dashboard. Answer questions professionally, keep responses relatively brief, and help visitors learn more about his background if they ask."
      }
    });

    return res.status(200).json({ reply: response.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Failed to generate response from AI.' });
  }
});

module.exports = router;