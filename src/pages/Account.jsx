// src/pages/Account.jsx
// Shows the logged-in user's GitHub profile info and role

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../api/client';
import Navbar from '../components/Navbar';

export default function Account() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Call backend to invalidate token, then clear local state
    logout()
      .catch(() => {})
      .finally(() => {
        setUser(null);
        navigate('/');
      });
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <h1 style={styles.title}>My Account</h1>
        <div style={styles.card}>
          <img src={user?.avatar_url} alt="avatar" style={styles.avatar} />
          <h2 style={styles.username}>@{user?.username}</h2>
          <span style={{
            ...styles.roleBadge,
            background: user?.role === 'admin' ? '#1b4f72' : '#27ae60'
          }}>
            {user?.role}
          </span>

          <div style={styles.fields}>
            <Field label="Email"      value={user?.email || 'Not public'} />
            <Field label="Role"       value={user?.role} />
            <Field label="Status"     value={user?.is_active ? 'Active' : 'Disabled'} />
            <Field label="Last Login" value={user?.last_login_at ? new Date(user.last_login_at).toLocaleString() : '—'} />
            <Field label="Member Since" value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'} />
          </div>

          <button onClick={handleLogout} style={styles.logoutBtn}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div style={styles.field}>
      <span style={styles.fieldLabel}>{label}</span>
      <span style={styles.fieldValue}>{value}</span>
    </div>
  );
}

const styles = {
  page:       { minHeight: '100vh', background: '#f4f6f9' },
  content:    { maxWidth: '500px', margin: '0 auto', padding: '32px 24px' },
  title:      { fontSize: '24px', color: '#0d1b2a', marginBottom: '20px' },
  card:       { background: 'white', borderRadius: '16px', padding: '32px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  avatar:     { width: '80px', height: '80px', borderRadius: '50%', marginBottom: '12px' },
  username:   { fontSize: '22px', color: '#0d1b2a', margin: '0 0 8px' },
  roleBadge:  { color: 'white', borderRadius: '20px', padding: '4px 16px', fontSize: '13px', fontWeight: '600' },
  fields:     { marginTop: '24px', textAlign: 'left' },
  field:      { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #eee' },
  fieldLabel: { color: '#888', fontSize: '14px' },
  fieldValue: { color: '#333', fontSize: '14px', fontWeight: '500' },
  logoutBtn:  { marginTop: '24px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', padding: '12px 32px', cursor: 'pointer', fontWeight: '600', fontSize: '15px' },
};