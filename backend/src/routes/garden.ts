import { Router, Response } from 'express';
import { eq, and } from 'drizzle-orm';
import db from '../db';
import { gardenPlots, plants } from '../db/schema';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/garden – get all plots for the current user
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const plots = await db.query.gardenPlots.findMany({
    where: eq(gardenPlots.user_id, req.userId!),
    with: { plant: true },
    orderBy: (p, { asc }) => [asc(p.slot_index)],
  });
  res.json(plots);
});

// POST /api/garden/plant – plant a seed in a slot
router.post('/plant', requireAuth, async (req: AuthRequest, res: Response) => {
  const { slot_index, plant_id } = req.body;
  if (slot_index === undefined || slot_index < 0 || slot_index > 8) {
    res.status(400).json({ error: 'slot_index must be between 0 and 8' });
    return;
  }
  if (!plant_id) {
    res.status(400).json({ error: 'plant_id is required' });
    return;
  }

  const existingPlot = await db.query.gardenPlots.findFirst({
    where: and(
      eq(gardenPlots.user_id, req.userId!),
      eq(gardenPlots.slot_index, slot_index)
    ),
  });

  if (existingPlot && existingPlot.status !== 'withered' && existingPlot.plant_id) {
    res.status(409).json({ error: 'This slot is already occupied' });
    return;
  }

  const plant = await db.query.plants.findFirst({
    where: eq(plants.id, plant_id),
  });
  if (!plant) {
    res.status(404).json({ error: 'Plant not found' });
    return;
  }

  const now = new Date();
  let plot;
  if (existingPlot) {
    [plot] = await db
      .update(gardenPlots)
      .set({ plant_id, status: 'seed', planted_at: now, watered_at: null, updated_at: now })
      .where(eq(gardenPlots.id, existingPlot.id))
      .returning();
  } else {
    [plot] = await db
      .insert(gardenPlots)
      .values({
        user_id: req.userId!,
        slot_index,
        plant_id,
        status: 'seed',
        planted_at: now,
      })
      .returning();
  }

  res.status(201).json(plot);
});

// POST /api/garden/water/:plotId – water a plant
router.post('/water/:plotId', requireAuth, async (req: AuthRequest, res: Response) => {
  const plotId = parseInt(req.params.plotId, 10);
  const plot = await db.query.gardenPlots.findFirst({
    where: and(eq(gardenPlots.id, plotId), eq(gardenPlots.user_id, req.userId!)),
    with: { plant: true },
  });

  if (!plot) {
    res.status(404).json({ error: 'Garden plot not found' });
    return;
  }
  if (!plot.plant_id || plot.status === 'withered') {
    res.status(400).json({ error: 'Nothing to water here' });
    return;
  }

  const now = new Date();
  const plantedAt = plot.planted_at ?? now;
  const daysSincePlanting = Math.floor(
    (now.getTime() - plantedAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  const growthDays = plot.plant?.growth_days ?? 7;

  let newStatus = plot.status;
  if (daysSincePlanting >= growthDays) {
    newStatus = 'blooming';
  } else if (daysSincePlanting >= growthDays * 0.66) {
    newStatus = 'growing';
  } else if (daysSincePlanting >= growthDays * 0.33) {
    newStatus = 'sprout';
  }

  const [updated] = await db
    .update(gardenPlots)
    .set({ watered_at: now, status: newStatus, updated_at: now })
    .where(eq(gardenPlots.id, plotId))
    .returning();

  res.json(updated);
});

// GET /api/garden/wisdom/:plotId – reveal the hidden wisdom when the plant blooms
router.get('/wisdom/:plotId', requireAuth, async (req: AuthRequest, res: Response) => {
  const plotId = parseInt(req.params.plotId, 10);
  const plot = await db.query.gardenPlots.findFirst({
    where: and(eq(gardenPlots.id, plotId), eq(gardenPlots.user_id, req.userId!)),
    with: { plant: true },
  });

  if (!plot) {
    res.status(404).json({ error: 'Garden plot not found' });
    return;
  }
  if (plot.status !== 'blooming') {
    res.status(403).json({ error: 'The plant has not bloomed yet. Keep tending your garden.' });
    return;
  }

  res.json({
    plant: plot.plant?.name,
    wisdom: plot.plant?.wisdom_message,
  });
});

export default router;
