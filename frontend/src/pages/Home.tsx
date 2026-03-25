import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { User, GardenPlot } from '../types';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const QUOTES = [
  'A seed planted in patience will bloom in its own time.',
  'The gardener who tends the soil faithfully will never go hungry.',
  'Water what you wish to grow.',
  'Every withered leaf makes room for new life.',
  'The roots of perseverance run deeper than any storm.',
];

interface Props {
  token: string | null;
  onLogin: (token: string) => void;
}

export default function Home({ token, onLogin }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [plots, setPlots] = useState<GardenPlot[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  const quote = QUOTES[new Date().getDay() % QUOTES.length];

  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    fetch(`${API}/api/auth/me`, { headers })
      .then((r) => r.json())
      .then((u: User) => setUser(u));
    fetch(`${API}/api/garden`, { headers })
      .then((r) => r.json())
      .then((p: GardenPlot[]) => setPlots(p));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const body = isRegister ? { username, email, password } : { email, password };
    const res = await fetch(`${API}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? 'Something went wrong');
      return;
    }
    onLogin(data.token);
  };

  const bloomingCount = plots.filter((p) => p.status === 'blooming').length;

  return (
    <div>
      <div style={{ background: '#e8f5e0', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', fontStyle: 'italic', fontSize: '1.1rem', color: '#2d5a27', borderLeft: '4px solid #2d5a27' }}>
        <strong>Ancient Gardener says:</strong> "{quote}"
      </div>

      {token && user ? (
        <div>
          <h2>Welcome back, {user.username}! 🌿</h2>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <div style={{ background: '#fff', border: '1px solid #c8e6c0', borderRadius: '8px', padding: '1rem 1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem' }}>🌸</div>
              <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{bloomingCount}</div>
              <div style={{ color: '#666', fontSize: '0.85rem' }}>Blooming plants</div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #c8e6c0', borderRadius: '8px', padding: '1rem 1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem' }}>🌱</div>
              <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{plots.length}</div>
              <div style={{ color: '#666', fontSize: '0.85rem' }}>Total plots</div>
            </div>
          </div>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
            <Link to="/garden" style={{ padding: '0.75rem 1.5rem', background: '#2d5a27', color: '#fff', textDecoration: 'none', borderRadius: '8px' }}>
              🌿 Go to Garden
            </Link>
            <Link to="/journal" style={{ padding: '0.75rem 1.5rem', background: '#6baed6', color: '#fff', textDecoration: 'none', borderRadius: '8px' }}>
              📖 Open Journal
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '400px' }}>
          <h2>{isRegister ? 'Plant your first seed' : 'Return to your garden'}</h2>
          {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {isRegister && (
              <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #c8e6c0', fontSize: '1rem' }}
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #c8e6c0', fontSize: '1rem' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #c8e6c0', fontSize: '1rem' }}
            />
            <button type="submit" style={{ padding: '0.75rem', background: '#2d5a27', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}>
              {isRegister ? '🌱 Start Growing' : '🌿 Enter Garden'}
            </button>
          </form>
          <button
            onClick={() => setIsRegister(!isRegister)}
            style={{ marginTop: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#2d5a27', textDecoration: 'underline' }}
          >
            {isRegister ? 'Already a gardener? Sign in' : 'New gardener? Register'}
          </button>
        </div>
      )}
    </div>
  );
}
