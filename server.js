require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();

// CORS — Allow requests from ANY external website
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use(express.static(__dirname));

// Serve index.html for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// --- Mock knowledge bases per business ID ---
const businessKnowledgeBases = {
  'test-business-001': 'Business: Tony\'s Italian Kitchen. Location: 42 Olive Street, Downtown. Hours: Mon-Sun 11am-10pm. Phone: (555) 123-4567. Menu: Margherita Pizza $14.99, Truffle Pasta $22.99, Tiramisu $9.99. We make fresh pasta daily, our pizza dough rises 48 hours. Chef Tony Rossi trained in Naples. We offer dine-in, takeout, and delivery. Reservations recommended for weekends.',
  'glorias-salon-x7k2m': 'Business: Gloria\'s Salon. Location: 88 Beauty Lane. Hours: Tue-Sat 9am-7pm. Services: Haircuts $35, Color $80, Highlights $120, Blowout $45, Bridal packages from $200. All products are organic and cruelty-free. Walk-ins welcome but appointments preferred. Call (555) 987-6543.'
};

// --- Chat API endpoint ---
app.post('/api/chat', async (req, res) => {
  try {
    const { message, knowledgeBase, businessId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Determine which knowledge base to use
    let kb = '';
    
    // Priority 1: Knowledge base passed directly (from dashboard)
    if (knowledgeBase && knowledgeBase.trim() !== '') {
      kb = knowledgeBase;
    }
    // Priority 2: Look up by business ID (from widget)
    else if (businessId && businessKnowledgeBases[businessId]) {
      kb = businessKnowledgeBases[businessId];
    }

    let systemPrompt;
    if (kb) {
      systemPrompt = `You are a helpful assistant for this business. Here is everything about this business: ${kb}\n\nNow answer this customer question. Be friendly, concise, and helpful. Keep responses under 3 sentences when possible.`;
    } else {
      systemPrompt = "You are a helpful AI assistant called SabAI. Be friendly and professional. Tell the customer you are here to help and ask them what they need.";
    }

    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
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

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
