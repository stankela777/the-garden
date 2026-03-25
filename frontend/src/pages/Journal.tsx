import { useState, useEffect, useCallback } from 'react';
import JournalEntryCard from '../components/Journal/JournalEntry';
import type { JournalEntry, Mood } from '../types';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const MOOD_OPTIONS: { value: Mood; label: string }[] = [
  { value: 'sunny', label: '☀️ Sunny' },
  { value: 'cloudy', label: '⛅ Cloudy' },
  { value: 'rainy', label: '🌧️ Rainy' },
  { value: 'stormy', label: '⛈️ Stormy' },
];

interface Props {
  token: string | null;
}

export default function Journal({ token }: Props) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [streak, setStreak] = useState(0);
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood>('sunny');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!token) return;
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const [eRes, sRes] = await Promise.all([
      fetch(`${API}/api/journal`, { headers: authHeaders }),
      fetch(`${API}/api/journal/streak`, { headers: authHeaders }),
    ]);
    setEntries(await eRes.json());
    const s = await sRes.json();
    setStreak(s.streak);
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch(`${API}/api/journal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ content, mood }),
    });
    setLoading(false);
    if (!res.ok) {
      const d = await res.json();
      setError(d.error ?? 'Failed to save entry');
      return;
    }
    setContent('');
    setMood('sunny');
    await load();
  };

  if (!token) return <p>Please sign in to view your journal.</p>;

  return (
    <div style={{ maxWidth: '640px' }}>
      <h2>📖 Garden Journal</h2>

      {streak > 0 && (
        <div style={{ background: '#fff8e7', border: '1px solid #f4a261', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.5rem', color: '#e76f51' }}>
          🔥 You've been tending your garden for <strong>{streak} day{streak !== 1 ? 's' : ''}</strong> in a row!
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #c8e6c0', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>Today's reflection</h3>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>How does your garden feel today?</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {MOOD_OPTIONS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(m.value)}
                style={{
                  padding: '0.5rem 0.75rem',
                  border: '2px solid',
                  borderColor: mood === m.value ? '#2d5a27' : '#c8e6c0',
                  background: mood === m.value ? '#e8f5e0' : '#fff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your thoughts for today..."
          required
          rows={4}
          style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #c8e6c0', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
        />
        {error && <div style={{ color: 'red', marginTop: '0.5rem' }}>{error}</div>}
        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#2d5a27', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}
        >
          {loading ? 'Saving…' : '🌱 Save Entry'}
        </button>
      </form>

      <h3>Previous entries</h3>
      {entries.length === 0 ? (
        <p style={{ color: '#888' }}>No entries yet. Start writing today!</p>
      ) : (
        entries.map((e) => <JournalEntryCard key={e.id} entry={e} />)
      )}
    </div>
  );
}
