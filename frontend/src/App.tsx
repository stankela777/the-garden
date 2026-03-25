import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Home from './pages/Home';
import Garden from './pages/Garden';
import Journal from './pages/Journal';
import Community from './pages/Community';

export default function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('garden_token')
  );

  const handleLogin = (t: string) => {
    localStorage.setItem('garden_token', t);
    setToken(t);
  };

  const handleLogout = () => {
    localStorage.removeItem('garden_token');
    setToken(null);
  };

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Georgia, serif', background: '#f5f0e8' }}>
        <Header token={token} onLogout={handleLogout} />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar />
          <main style={{ flex: 1, padding: '2rem' }}>
            <Routes>
              <Route path="/" element={<Home token={token} onLogin={handleLogin} />} />
              <Route path="/garden" element={<Garden token={token} />} />
              <Route path="/journal" element={<Journal token={token} />} />
              <Route path="/community" element={<Community token={token} />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
