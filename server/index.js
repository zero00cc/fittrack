import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { config } from 'dotenv';
import cors from 'cors';

config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Stable system prompt — cached on every request after the first
const SYSTEM_PROMPT = `You are a nutrition expert analyzing food photos. Identify all food items visible and estimate their weight and caloric content.

Return ONLY a valid JSON object — no markdown, no explanation, no code fences:
{
  "items": [
    { "name": "food name", "estimatedGrams": 150, "estimatedKcal": 248 }
  ],
  "description": "brief one-sentence description of the meal"
}

Guidelines:
- Be specific about cooking method (e.g. "grilled chicken breast" not "chicken")
- Include all visible food: mains, sides, sauces, drinks
- Estimate portions conservatively
- Use standard calorie values (chicken breast ~165 kcal/100g, white rice ~130 kcal/100g, etc.)
- If an item is unclear, make your best educated guess`;

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

app.post('/api/analyze-food', async (req, res) => {
  const { image, mimeType } = req.body;

  if (!image || !mimeType) {
    return res.status(400).json({ error: 'image and mimeType are required' });
  }
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    return res.status(400).json({ error: 'Unsupported image type. Use JPEG, PNG, GIF or WebP.' });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Server is missing the ANTHROPIC_API_KEY. Add it to .env and restart.' });
  }

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' }, // cache the stable prompt across requests
        },
      ],
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mimeType, data: image },
            },
            { type: 'text', text: 'Analyze this food image and return the JSON.' },
          ],
        },
      ],
    });

    const raw = message.content[0]?.type === 'text' ? message.content[0].text : '';

    // Extract JSON even if the model adds stray text
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in model response');

    const parsed = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed.items)) throw new Error('Invalid response shape');

    res.json({
      items: parsed.items,
      description: parsed.description ?? '',
      cacheRead: message.usage.cache_read_input_tokens ?? 0,
    });
  } catch (err) {
    console.error('Analysis error:', err);
    if (err instanceof Anthropic.AuthenticationError) {
      return res.status(401).json({ error: 'Invalid API key. Check ANTHROPIC_API_KEY in .env.' });
    }
    if (err instanceof Anthropic.RateLimitError) {
      return res.status(429).json({ error: 'Rate limited — please wait a moment and try again.' });
    }
    res.status(500).json({ error: 'Failed to analyze image. Please try again.' });
  }
});

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => console.log(`FitTrack API server → http://localhost:${PORT}`));
