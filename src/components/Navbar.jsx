// src/components/Navbar.jsx
// Top navigation bar shown on all authenticated pages

import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const links = [
    { to: '/dashboard', label: '📊 Dashboard' },
    { to: '/profiles',  label: '👥 Profiles'  },
    { to: '/search',    label: '🔍 Search'    },
    { to: '/account',   label: '👤 Account'   },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/dashboard" style={styles.brand}>⚡ Insighta Labs</Link>
        <div style={styles.links}>
          {links.map(l => (
            <Link key={l.to} to={l.to}
              style={{ ...styles.link, ...(pathname === l.to ? styles.active : {}) }}>
              {l.label}
            </Link>
          ))}
        </div>
        <div style={styles.user}>
          <img src={user?.avatar_url} alt="" style={styles.avatar} />
          <span style={styles.username}>@{user?.username}</span>
          <span style={{
            ...styles.role,
            background: user?.role === 'admin' ? '#1b4f72' : '#27ae60'
          }}>{user?.role}</span>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav:      { background: '#0d1b2a', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100 },
  inner:    { maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', height: '60px', gap: '32px' },
  brand:    { color: 'white', fontWeight: '700', fontSize: '18px', textDecoration: 'none', flexShrink: 0 },
  links:    { display: 'flex', gap: '4px', flex: 1 },
  link:     { color: '#aaa', textDecoration: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '14px', transition: 'all 0.2s' },
  active:   { color: 'white', background: 'rgba(255,255,255,0.1)' },
  user:     { display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 },
  avatar:   { width: '28px', height: '28px', borderRadius: '50%' },
  username: { color: '#ccc', fontSize: '13px' },
  role:     { color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' },
};