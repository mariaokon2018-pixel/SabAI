require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json());
// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Page routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/setup', (req, res) => res.sendFile(path.join(__dirname, 'setup.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'dashboard.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/demo', (req, res) => res.sendFile(path.join(__dirname, 'demo.html')));

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, knowledgeBase } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let systemPrompt = "You are a helpful AI assistant called SabAI. Be friendly and professional. Tell the customer you are here to help and ask them what they need.";
    
    if (knowledgeBase && knowledgeBase.trim() !== '') {
      systemPrompt = `You are a helpful assistant for this business. Here is everything about this business: ${knowledgeBase}\n\nNow answer this customer question.`;
    }

    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        { role: "user", content: message }
      ]
    });

    res.json({ reply: msg.content[0].text });
  } catch (error) {
    console.error('Anthropic API Error:', error);
    res.status(500).json({ error: 'Failed to connect to Claude API' });
  }
});

// Export for Vercel
module.exports = app;

// Only listen if not running as a Vercel function
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

