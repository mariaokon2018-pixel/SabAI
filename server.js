const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/setup', (req, res) => {
  res.sendFile(path.join(__dirname, 'setup.html'));
});

app.get('/demo', (req, res) => {
  res.sendFile(path.join(__dirname, 'demo.html'));
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, knowledgeBase } = req.body;
    const Anthropic = require('@anthropic-ai/sdk');
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `You are a helpful AI assistant. Here is the business information: ${knowledgeBase || 'No information provided yet'}. Customer question: ${message}`
      }]
    });
    res.json({ reply: response.content[0].text });
  } catch (error) {
    res.status(500).json({ 
      error: 'Sorry I am having trouble connecting right now. Please try again in a moment.' 
    });
  }
});

app.post('/api/webhook', async (req, res) => {
  const { platform, username, message } = req.body;
  res.json({ 
    reply: `Thank you for your message on ${platform}. We will get back to you shortly.`,
    platform,
    username
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
