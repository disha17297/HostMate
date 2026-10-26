import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: AI Budget Optimization & Cost-Cutting Advice
app.post('/api/ai/budget-advice', async (req, res) => {
  try {
    const { eventType, budget, guestCount, currency, categories, lang } = req.body;
    const isHindi = lang === 'hi';

    const prompt = `You are HostMate, an expert event financial planner and coordinator with the tagline "Budget fit, event hit!".
Event Details:
- Type: ${eventType}
- Total Budget: ${currency} ${budget}
- Guest Count: ${guestCount}
- Current Category Breakdown: ${JSON.stringify(categories)}
- Output Language: ${isHindi ? 'Hindi (Devanagari script)' : 'English'}

Provide an actionable, realistic financial review. Output valid JSON only with keys:
{
  "summary": "1-2 sentence overall financial health assessment",
  "recommendedTweaks": [
    {
      "category": "Category name",
      "adjustment": "+/- amount or tip",
      "rationale": "Reason why"
    }
  ],
  "costSavingHacks": [
    "Concrete actionable hack 1 (specific to this budget and guest count)",
    "Concrete actionable hack 2",
    "Concrete actionable hack 3"
  ],
  "hiddenCostsWarning": [
    "E.g., power backup, service gratuity, corkage, travel fees, cake cutting fees"
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    res.json({ success: true, data: JSON.parse(text || '{}') });
  } catch (error: any) {
    console.error('Error generating budget advice:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate budget advice',
    });
  }
});

// Endpoint: AI Day-Of Run Sheet Generator
app.post('/api/ai/day-of-schedule', async (req, res) => {
  try {
    const { eventType, eventName, date, guestCount, startTime, specialRituals, lang } = req.body;
    const isHindi = lang === 'hi';

    const prompt = `You are HostMate, an elite event coordinator.
Generate a high-precision, realistic Day-Of Chronological Run Sheet for:
- Event: ${eventName || eventType} (${eventType})
- Date: ${date}
- Guest Count: ${guestCount}
- Event Main Start Time: ${startTime || '11:00 AM'}
- Special Highlights/Rituals: ${specialRituals || 'Standard program'}
- Language: ${isHindi ? 'Hindi (Devanagari)' : 'English'}

Return valid JSON with:
{
  "theme": "Quick overview note",
  "timeline": [
    {
      "time": "e.g. 08:30 AM",
      "activity": "Activity name",
      "leadPerson": "e.g. Coordinator / Sibling / Decor Vendor",
      "notes": "Key watch-out or deliverable",
      "critical": boolean
    }
  ],
  "emergencyKitList": [
    "Item 1 (e.g. Safety pins, tape, phone chargers, printed vendor sheet)"
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    res.json({ success: true, data: JSON.parse(text || '{}') });
  } catch (error: any) {
    console.error('Error generating schedule:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate schedule',
    });
  }
});

// Endpoint: AI Personalized Ideas & Themes
app.post('/api/ai/personalized-ideas', async (req, res) => {
  try {
    const { eventType, budget, guestCount, currency, preferences, lang } = req.body;
    const isHindi = lang === 'hi';

    const prompt = `You are HostMate, a creative and budget-savvy event stylist ("Budget fit, event hit!").
Generate unique, high-impact ideas for:
- Event Type: ${eventType}
- Budget: ${currency} ${budget}
- Guests: ${guestCount}
- Host Preferences: ${preferences || 'Creative, warm, memorable, cost-effective'}
- Language: ${isHindi ? 'Hindi' : 'English'}

Return JSON matching:
{
  "themeName": "Catchy concept title",
  "decorIdeas": [
    { "title": "Idea title", "description": "How to execute affordably", "estimatedCostTier": "Low / Moderate" }
  ],
  "entertainmentIdeas": [
    { "title": "Idea title", "description": "Engaging activity or icebreaker" }
  ],
  "foodDrinkIdeas": [
    { "title": "Menu twist / live counter", "description": "Crowd-pleaser without high cost" }
  ],
  "hostTip": "One golden insider tip for stress-free hosting"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    res.json({ success: true, data: JSON.parse(text || '{}') });
  } catch (error: any) {
    console.error('Error generating personalized ideas:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate personalized ideas',
    });
  }
});

// Endpoint: AI Vendor Quote Review & Negotiation
app.post('/api/ai/vendor-review', async (req, res) => {
  try {
    const { vendorName, category, quotedPrice, currency, deliverables, lang } = req.body;
    const isHindi = lang === 'hi';

    const prompt = `You are HostMate's veteran vendor contract negotiator.
Review this quote:
- Vendor: ${vendorName}
- Category: ${category}
- Quoted Price: ${currency} ${quotedPrice}
- Deliverables / Details: ${deliverables || 'Standard service'}
- Language: ${isHindi ? 'Hindi' : 'English'}

Return JSON matching:
{
  "fairnessAssessment": "Great value / Market average / Premium / Overpriced",
  "questionsToAskBeforeSigning": [
    "Specific question 1 (e.g. over-time charge per hour, backup equipment)",
    "Specific question 2",
    "Specific question 3"
  ],
  "negotiationAngles": [
    "Polite bargaining point or complimentary add-on to request"
  ],
  "redFlagsToWatch": [
    "Key clause to get in writing"
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    res.json({ success: true, data: JSON.parse(text || '{}') });
  } catch (error: any) {
    console.error('Error generating vendor review:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate vendor review',
    });
  }
});

// Server configuration & static serving
// Health check routes for Cloud Run liveness/readiness probes
app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'healthy', service: 'HostMate' });
});

// Server configuration & static serving
async function startServer() {
  const distPath = path.join(__dirname, 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));
  // In production (Cloud Run), APP_ENV is undefined and dist bundle exists.
  // In development, npm run dev sets APP_ENV=development.
  const isDev = process.env.APP_ENV === 'development' || !hasDist;

  if (!isDev) {
    // Production mode (Cloud Run or deployed container)
    console.log('Starting HostMate in production mode serving static dist bundle');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Development mode with hot-module reloading
    console.log('Starting HostMate in development mode with Vite middleware');
    try {
      const { createServer } = await import('vite');
      const vite = await createServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.warn('Vite dev middleware failed, falling back to dist bundle if available:', err);
      if (hasDist) {
        app.use(express.static(distPath));
        app.get('*', (_req, res) => {
          res.sendFile(path.join(distPath, 'index.html'));
        });
      }
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HostMate server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
