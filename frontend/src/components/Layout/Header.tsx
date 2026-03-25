import { Link } from 'react-router-dom';

interface Props {
  token: string | null;
  onLogout: () => void;
}

export default function Header({ token, onLogout }: Props) {
  return (
    <header style={{
      background: '#2d5a27',
      color: '#f5f0e8',
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>🌱 The Garden</h1>
      </Link>
      <nav>
        {token ? (
          <button
            onClick={onLogout}
            style={{ background: 'none', border: '1px solid #f5f0e8', color: '#f5f0e8', cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '4px' }}
          >
            Leave Garden
          </button>
        ) : (
          <Link to="/" style={{ color: '#f5f0e8' }}>Enter Garden</Link>
        )}
      </nav>
    </header>
  );
}
