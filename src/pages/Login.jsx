// src/pages/Login.jsx
// The login page — shows a "Continue with GitHub" button.
// Clicking it redirects to your backend's OAuth endpoint.

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // If already logged in, skip login page and go to dashboard
  useEffect(() => {
    if (!loading && user) navigate('/dashboard');
  }, [user, loading]);

  const handleLogin = () => {
    // Relative URL — goes through Vite proxy in dev, Vercel rewrites in prod
    window.location.href = `/auth/github?source=web`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Logo / Title */}
        <div style={styles.logo}>⚡</div>
        <h1 style={styles.title}>Insighta Labs</h1>
        <p style={styles.subtitle}>
          Demographic Intelligence Platform
        </p>

        {/* Login button */}
        <button onClick={handleLogin} style={styles.button}>
          <svg style={styles.githubIcon} viewBox="0 0 24 24" fill="white">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          Continue with GitHub
        </button>

        <p style={styles.note}>
          You will be redirected to GitHub to authorize access.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #0d1b2a 0%, #1b4f72 100%)',
  },
  card: {
    background: 'white', borderRadius: '16px',
    padding: '48px 40px', textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxWidth: '400px', width: '100%',
  },
  logo:     { fontSize: '48px', marginBottom: '8px' },
  title:    { fontSize: '28px', fontWeight: '700', color: '#0d1b2a', margin: '0 0 8px' },
  subtitle: { color: '#666', marginBottom: '32px', fontSize: '15px' },
  button: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '10px', width: '100%', padding: '14px 24px',
    background: '#24292e', color: 'white', border: 'none',
    borderRadius: '8px', fontSize: '16px', fontWeight: '600',
    cursor: 'pointer',
  },
  githubIcon: { width: '20px', height: '20px' },
  note: { marginTop: '16px', fontSize: '13px', color: '#999' },
};