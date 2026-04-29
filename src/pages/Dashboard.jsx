// src/pages/Dashboard.jsx
// Shows key metrics: total profiles, gender split, top countries

import { useState, useEffect } from 'react';
import { getProfiles } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch counts for each group to build metrics
    Promise.all([
      getProfiles({ limit: 1 }),                       // total
      getProfiles({ gender: 'male',   limit: 1 }),     // male count
      getProfiles({ gender: 'female', limit: 1 }),     // female count
      getProfiles({ age_group: 'adult',    limit: 1 }),
      getProfiles({ age_group: 'teenager', limit: 1 }),
      getProfiles({ age_group: 'senior',   limit: 1 }),
      getProfiles({ age_group: 'child',    limit: 1 }),
    ]).then(([total, male, female, adult, teen, senior, child]) => {
      setStats({
        total:   total.data.total,
        male:    male.data.total,
        female:  female.data.total,
        adult:   adult.data.total,
        teen:    teen.data.total,
        senior:  senior.data.total,
        child:   child.data.total,
      });
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <h1 style={styles.title}>
          Welcome back, <span style={styles.name}>@{user?.username}</span>
        </h1>
        <p style={styles.role}>Role: <strong>{user?.role}</strong></p>

        {loading ? (
          <p style={styles.loading}>Loading metrics...</p>
        ) : (
          <>
            <h2 style={styles.sectionTitle}>Overview</h2>
            <div style={styles.grid}>
              <StatCard label="Total Profiles" value={stats.total}  color="#1b4f72" />
              <StatCard label="Male"           value={stats.male}   color="#2e86c1" />
              <StatCard label="Female"         value={stats.female} color="#e74c3c" />
              <StatCard label="Adults"         value={stats.adult}  color="#27ae60" />
              <StatCard label="Teenagers"      value={stats.teen}   color="#f39c12" />
              <StatCard label="Seniors"        value={stats.senior} color="#8e44ad" />
              <StatCard label="Children"       value={stats.child}  color="#16a085" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ ...styles.card, borderTop: `4px solid ${color}` }}>
      <div style={{ ...styles.cardValue, color }}>{value?.toLocaleString()}</div>
      <div style={styles.cardLabel}>{label}</div>
    </div>
  );
}

const styles = {
  page:        { minHeight: '100vh', background: '#f4f6f9' },
  content:     { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },
  title:       { fontSize: '26px', color: '#0d1b2a', margin: '0 0 4px' },
  name:        { color: '#2e86c1' },
  role:        { color: '#666', marginBottom: '32px' },
  sectionTitle:{ fontSize: '18px', color: '#333', marginBottom: '16px' },
  loading:     { color: '#666' },
  grid:        { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' },
  card:        { background: 'white', borderRadius: '12px', padding: '24px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  cardValue:   { fontSize: '32px', fontWeight: '700', marginBottom: '4px' },
  cardLabel:   { fontSize: '14px', color: '#666' },
};