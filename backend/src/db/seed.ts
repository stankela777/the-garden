import 'dotenv/config';
import db from './index';
import { plants } from './schema';

// Sample plants – each one is a metaphor for a virtue or spiritual principle.
// The wisdom_message is only shown to the user when the plant reaches full bloom.
const seedPlants = [
  {
    name: 'Oak',
    description: 'A mighty tree that takes years to grow',
    wisdom_message:
      'Faith the size of a mustard seed can move mountains. Start small, stay patient.',
    growth_days: 14,
    image_key: 'plant-images/oak.png',
  },
  {
    name: 'Sunflower',
    description: 'Always turns toward the light',
    wisdom_message:
      'Keep your face toward the light, and the shadows will fall behind you.',
    growth_days: 7,
    image_key: 'plant-images/sunflower.png',
  },
  {
    name: 'Lavender',
    description: 'Brings peace and calm to any garden',
    wisdom_message:
      'Peace I leave with you. Let not your heart be troubled.',
    growth_days: 7,
    image_key: 'plant-images/lavender.png',
  },
  {
    name: 'Vine',
    description: 'Needs support to grow tall',
    wisdom_message:
      'Remain in me, and I will remain in you. No branch can bear fruit by itself.',
    growth_days: 10,
    image_key: 'plant-images/vine.png',
  },
  {
    name: 'Wheat',
    description: 'Requires dying to the seed before it can grow',
    wisdom_message:
      'Unless a grain of wheat falls to the ground and dies, it remains only a single seed.',
    growth_days: 10,
    image_key: 'plant-images/wheat.png',
  },
  {
    name: 'Rose',
    description: 'Beautiful but requires pruning to thrive',
    wisdom_message:
      'Every branch that bears fruit, He prunes so that it will be even more fruitful.',
    growth_days: 12,
    image_key: 'plant-images/rose.png',
  },
];

async function seed() {
  console.log('Seeding plants...');
  await db.insert(plants).values(seedPlants).onConflictDoNothing();
  console.log('Seed complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
