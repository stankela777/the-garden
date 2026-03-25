import { useState, useEffect } from 'react';
import GardenGrid from '../components/Garden/GardenGrid';
import { useGarden } from '../hooks/useGarden';
import type { Plant } from '../types';


interface Props {
  token: string | null;
}

export default function Garden({ token }: Props) {
  const { plots, loading, error, plantSeed, waterPlant, getWisdom } = useGarden(token);
  const [availablePlants, setAvailablePlants] = useState<Plant[]>([]);
  const [selectingSlot, setSelectingSlot] = useState<number | null>(null);
  const [wisdom, setWisdom] = useState<{ plant: string; wisdom: string } | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;
    // Load available plant types – matches the seeded plant data
    setAvailablePlants([
      { id: 1, name: 'Oak', description: 'A mighty tree that takes years to grow', growth_days: 14, image_key: null, created_at: '' },
      { id: 2, name: 'Sunflower', description: 'Always turns toward the light', growth_days: 7, image_key: null, created_at: '' },
      { id: 3, name: 'Lavender', description: 'Brings peace and calm to any garden', growth_days: 7, image_key: null, created_at: '' },
      { id: 4, name: 'Vine', description: 'Needs support to grow tall', growth_days: 10, image_key: null, created_at: '' },
      { id: 5, name: 'Wheat', description: 'Requires dying to the seed before it can grow', growth_days: 10, image_key: null, created_at: '' },
      { id: 6, name: 'Rose', description: 'Beautiful but requires pruning to thrive', growth_days: 12, image_key: null, created_at: '' },
    ]);
  }, [token]);

  const handleWater = async (plotId: number) => {
    try {
      await waterPlant(plotId);
      setMessage('Your plant has been watered 💧');
    } catch {
      setMessage('Could not water plant.');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleWisdom = async (plotId: number) => {
    try {
      const w = await getWisdom(plotId);
      setWisdom(w);
    } catch {
      setMessage('The plant has not bloomed yet.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handlePlantSelect = async (plantId: number) => {
    if (selectingSlot === null) return;
    try {
      await plantSeed(selectingSlot, plantId);
      setMessage('Seed planted! 🌱 Tend it daily.');
    } catch {
      setMessage('Could not plant seed.');
    }
    setSelectingSlot(null);
    setTimeout(() => setMessage(''), 3000);
  };

  if (!token) return <p>Please sign in to view your garden.</p>;
  if (loading) return <p>Loading garden…</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h2>🌿 My Garden</h2>

      {message && (
        <div style={{ background: '#e8f5e0', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', color: '#2d5a27' }}>
          {message}
        </div>
      )}

      {wisdom && (
        <div style={{ background: '#fff8e7', border: '2px solid #f4a261', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', maxWidth: '480px' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#e76f51' }}>✨ Your {wisdom.plant} has bloomed!</h3>
          <p style={{ fontStyle: 'italic', lineHeight: 1.6, margin: '0 0 1rem 0' }}>"{wisdom.wisdom}"</p>
          <button onClick={() => setWisdom(null)} style={{ background: '#e76f51', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
            Close
          </button>
        </div>
      )}

      <GardenGrid
        plots={plots}
        onWater={handleWater}
        onWisdom={handleWisdom}
        onPlantSlot={(slotIndex) => setSelectingSlot(slotIndex)}
      />

      {selectingSlot !== null && (
        <div style={{ marginTop: '1.5rem', background: '#fff', border: '1px solid #c8e6c0', borderRadius: '8px', padding: '1.5rem', maxWidth: '480px' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>Choose a plant for slot {selectingSlot + 1}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {availablePlants.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePlantSelect(p.id)}
                style={{ padding: '0.75rem', background: '#e8f5e0', border: '1px solid #c8e6c0', borderRadius: '4px', cursor: 'pointer', textAlign: 'left' }}
              >
                <strong>{p.name}</strong> – {p.description} ({p.growth_days} days)
              </button>
            ))}
            <button onClick={() => setSelectingSlot(null)} style={{ padding: '0.5rem', background: 'none', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: '1.5rem', color: '#666', fontSize: '0.9rem' }}>
        <p>Click an empty slot to plant a seed. Water your plants daily to help them grow.</p>
        <p>Statuses: 🌱 seed → 🌿 sprout → 🌸 growing → 🍎 blooming → 🍂 withered</p>
      </div>
    </div>
  );
}
