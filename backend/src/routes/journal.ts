import { Router, Response } from 'express';
import { eq, desc } from 'drizzle-orm';
import db from '../db';
import { journalEntries } from '../db/schema';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/journal – get all journal entries for the current user
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const entries = await db
    .select()
    .from(journalEntries)
    .where(eq(journalEntries.user_id, req.userId!))
    .orderBy(desc(journalEntries.created_at));
  res.json(entries);
});

// POST /api/journal – create a new journal entry
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const { content, mood } = req.body;
  if (!content || !mood) {
    res.status(400).json({ error: 'content and mood are required' });
    return;
  }

  const validMoods = ['sunny', 'cloudy', 'stormy', 'rainy'];
  if (!validMoods.includes(mood)) {
    res.status(400).json({ error: `mood must be one of: ${validMoods.join(', ')}` });
    return;
  }

  const [entry] = await db
    .insert(journalEntries)
    .values({ user_id: req.userId!, content, mood })
    .returning();

  res.status(201).json(entry);
});

// GET /api/journal/streak – calculate current consecutive journaling streak
router.get('/streak', requireAuth, async (req: AuthRequest, res: Response) => {
  const entries = await db
    .select({ created_at: journalEntries.created_at })
    .from(journalEntries)
    .where(eq(journalEntries.user_id, req.userId!))
    .orderBy(desc(journalEntries.created_at));

  if (!entries.length) {
    res.json({ streak: 0 });
    return;
  }

  // Build a set of unique calendar dates (UTC)
  const dates = new Set(
    entries.map((e) => e.created_at.toISOString().split('T')[0])
  );

  let streak = 0;
  const today = new Date();

  for (let i = 0; ; i++) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - i);
    const key = d.toISOString().split('T')[0];
    if (dates.has(key)) {
      streak++;
    } else {
      break;
    }
  }

  res.json({ streak });
});

export default router;
