import type { JournalEntry, Mood } from '../../types';

const MOOD_EMOJI: Record<Mood, string> = {
  sunny: '☀️',
  cloudy: '⛅',
  rainy: '🌧️',
  stormy: '⛈️',
};

interface Props {
  entry: JournalEntry;
}

export default function JournalEntryCard({ entry }: Props) {
  const date = new Date(entry.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #c8e6c0',
      borderRadius: '8px',
      padding: '1rem 1.5rem',
      marginBottom: '1rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ color: '#888', fontSize: '0.85rem' }}>{date}</span>
        <span style={{ fontSize: '1.5rem' }}>{MOOD_EMOJI[entry.mood]}</span>
      </div>
      <p style={{ margin: 0, lineHeight: 1.6, color: '#333' }}>{entry.content}</p>
    </div>
  );
}
