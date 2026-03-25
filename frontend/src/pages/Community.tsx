import { useState, useEffect } from 'react';
import type { User, Plant } from '../types';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

interface Props {
  token: string | null;
}

export default function Community({ token }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [receiverId, setReceiverId] = useState<number | null>(null);
  const [plantId, setPlantId] = useState<number>(1);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const availablePlants: Plant[] = [
    { id: 1, name: 'Oak', description: '', growth_days: 14, image_key: null, created_at: '' },
    { id: 2, name: 'Sunflower', description: '', growth_days: 7, image_key: null, created_at: '' },
    { id: 3, name: 'Lavender', description: '', growth_days: 7, image_key: null, created_at: '' },
    { id: 4, name: 'Vine', description: '', growth_days: 10, image_key: null, created_at: '' },
    { id: 5, name: 'Wheat', description: '', growth_days: 10, image_key: null, created_at: '' },
    { id: 6, name: 'Rose', description: '', growth_days: 12, image_key: null, created_at: '' },
  ];

  useEffect(() => {
    if (!token) return;
    // In a full implementation this would fetch from a /api/users endpoint
    // For now we show a placeholder list
    setUsers([]);
  }, [token]);

  const handleGift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiverId) return;
    const res = await fetch(`${API}/api/community/gift`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ receiver_id: receiverId, plant_id: plantId, message }),
    });
    if (res.ok) {
      setStatus('🎁 Your gift has been sent!');
      setMessage('');
    } else {
      setStatus('Could not send gift. Try again later.');
    }
    setTimeout(() => setStatus(''), 4000);
  };

  if (!token) return <p>Please sign in to visit the community garden.</p>;

  return (
    <div style={{ maxWidth: '640px' }}>
      <h2>🤝 Community Garden</h2>
      <p style={{ color: '#555' }}>Connect with other gardeners. Share the fruits of your labour.</p>

      {status && (
        <div style={{ background: '#e8f5e0', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', color: '#2d5a27' }}>
          {status}
        </div>
      )}

      <div style={{ background: '#fff', border: '1px solid #c8e6c0', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>🎁 Send a Gift</h3>
        {users.length === 0 ? (
          <p style={{ color: '#888' }}>No other gardeners to gift yet. Invite a friend to join! 🌱</p>
        ) : (
          <form onSubmit={handleGift} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', color: '#555' }}>Gardener</label>
              <select
                value={receiverId ?? ''}
                onChange={(e) => setReceiverId(Number(e.target.value))}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #c8e6c0' }}
              >
                <option value="">Select a gardener…</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.username}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', color: '#555' }}>Plant to gift</label>
              <select
                value={plantId}
                onChange={(e) => setPlantId(Number(e.target.value))}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #c8e6c0' }}
              >
                {availablePlants.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', color: '#555' }}>Message (optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="A short note for the recipient…"
                rows={3}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #c8e6c0', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>
            <button
              type="submit"
              style={{ padding: '0.75rem', background: '#2d5a27', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}
            >
              🎁 Send Gift
            </button>
          </form>
        )}
      </div>

      <div style={{ background: '#fff', border: '1px solid #c8e6c0', borderRadius: '8px', padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>🌍 Other Gardeners</h3>
        {users.length === 0 ? (
          <p style={{ color: '#888' }}>Be the first to start a community! Share the app with friends.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {users.map((u) => (
              <li key={u.id} style={{ padding: '0.75rem', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>👤 {u.username}</span>
                <button
                  onClick={() => setReceiverId(u.id)}
                  style={{ padding: '0.25rem 0.75rem', background: '#e8f5e0', border: '1px solid #c8e6c0', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Gift
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
