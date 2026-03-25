import { NavLink } from 'react-router-dom';

const navStyle = {
  display: 'block',
  padding: '0.75rem 1rem',
  color: '#2d5a27',
  textDecoration: 'none',
  borderRadius: '4px',
  marginBottom: '0.25rem',
};

export default function Sidebar() {
  return (
    <aside style={{ width: '200px', background: '#e8f5e0', padding: '1.5rem 1rem', borderRight: '1px solid #c8e6c0' }}>
      <nav>
        <NavLink to="/" style={({ isActive }) => ({ ...navStyle, fontWeight: isActive ? 'bold' : 'normal' })}>
          🏡 Home
        </NavLink>
        <NavLink to="/garden" style={({ isActive }) => ({ ...navStyle, fontWeight: isActive ? 'bold' : 'normal' })}>
          🌿 My Garden
        </NavLink>
        <NavLink to="/journal" style={({ isActive }) => ({ ...navStyle, fontWeight: isActive ? 'bold' : 'normal' })}>
          📖 Journal
        </NavLink>
        <NavLink to="/community" style={({ isActive }) => ({ ...navStyle, fontWeight: isActive ? 'bold' : 'normal' })}>
          🤝 Community
        </NavLink>
      </nav>
    </aside>
  );
}
