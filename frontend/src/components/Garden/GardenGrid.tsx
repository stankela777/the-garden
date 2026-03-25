import { useState } from 'react';
import type { GardenPlot } from '../../types';
import PlantCard from './PlantCard';

interface Props {
  plots: GardenPlot[];
  onWater: (plotId: number) => void;
  onWisdom: (plotId: number) => void;
  onPlantSlot: (slotIndex: number) => void;
}

export default function GardenGrid({ plots, onWater, onWisdom, onPlantSlot }: Props) {
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);

  const gridSlots = Array.from({ length: 9 }, (_, i) => {
    return plots.find((p) => p.slot_index === i) ?? null;
  });

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem',
      maxWidth: '480px',
    }}>
      {gridSlots.map((plot, index) => (
        <div
          key={index}
          onMouseEnter={() => setHoveredSlot(index)}
          onMouseLeave={() => setHoveredSlot(null)}
          onClick={() => { if (!plot || !plot.plant_id) onPlantSlot(index); }}
          style={{ cursor: !plot || !plot.plant_id ? 'pointer' : 'default', outline: hoveredSlot === index && (!plot || !plot.plant_id) ? '2px solid #2d5a27' : 'none', borderRadius: '8px' }}
        >
          {plot ? (
            <PlantCard plot={plot} onWater={onWater} onWisdom={onWisdom} />
          ) : (
            <div style={{
              background: '#f9f6f0',
              border: '2px dashed #c8e6c0',
              borderRadius: '8px',
              minHeight: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              color: '#c8e6c0',
            }}>
              +
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
