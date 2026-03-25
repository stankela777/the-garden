import type { GardenPlot, PlotStatus } from '../../types';

const STATUS_EMOJI: Record<PlotStatus, string> = {
  seed: '🌱',
  sprout: '🌿',
  growing: '🌸',
  blooming: '🍎',
  withered: '🍂',
};

interface Props {
  plot: GardenPlot;
  onWater: (plotId: number) => void;
  onWisdom: (plotId: number) => void;
}

export default function PlantCard({ plot, onWater, onWisdom }: Props) {
  const status = plot.status ?? 'seed';
  const isEmpty = !plot.plant_id;

  return (
    <div style={{
      background: isEmpty ? '#f9f6f0' : '#fff',
      border: '2px solid #c8e6c0',
      borderRadius: '8px',
      padding: '1rem',
      textAlign: 'center',
      minHeight: '120px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
    }}>
      {isEmpty ? (
        <span style={{ color: '#aaa', fontSize: '2rem' }}>🟫</span>
      ) : (
        <>
          <span style={{ fontSize: '2.5rem' }}>{STATUS_EMOJI[status]}</span>
          <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{plot.plant?.name}</div>
          <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'capitalize' }}>{status}</div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            {status !== 'withered' && status !== 'blooming' && (
              <button
                onClick={() => onWater(plot.id)}
                style={{ padding: '0.25rem 0.75rem', cursor: 'pointer', background: '#6baed6', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.8rem' }}
              >
                💧 Water
              </button>
            )}
            {status === 'blooming' && (
              <button
                onClick={() => onWisdom(plot.id)}
                style={{ padding: '0.25rem 0.75rem', cursor: 'pointer', background: '#f4a261', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.8rem' }}
              >
                ✨ Wisdom
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
