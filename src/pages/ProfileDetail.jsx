// src/pages/ProfileDetail.jsx
// Shows full details of a single profile

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProfile, deleteProfile } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function ProfileDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile(id)
      .then(res => setProfile(res.data.data))
      .catch(() => navigate('/profiles'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = () => {
    if (!window.confirm('Delete this profile?')) return;
    deleteProfile(id)
      .then(() => navigate('/profiles'))
      .catch(err => alert(err.response?.data?.message || 'Delete failed'));
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!profile) return null;

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <button onClick={() => navigate('/profiles')} style={styles.back}>← Back to Profiles</button>
        <div style={styles.card}>
          <h1 style={styles.name}>{profile.name}</h1>
          <div style={styles.grid}>
            <Field label="ID"                  value={profile.id} />
            <Field label="Gender"              value={profile.gender} />
            <Field label="Gender Probability"  value={`${(profile.gender_probability * 100).toFixed(1)}%`} />
            <Field label="Age"                 value={profile.age} />
            <Field label="Age Group"           value={profile.age_group} />
            <Field label="Country"             value={`${profile.country_id} — ${profile.country_name}`} />
            <Field label="Country Probability" value={`${(profile.country_probability * 100).toFixed(1)}%`} />
            <Field label="Created At"          value={new Date(profile.created_at).toLocaleString()} />
          </div>

          {/* Only admins see the delete button */}
          {user?.role === 'admin' && (
            <button onClick={handleDelete} style={styles.deleteBtn}>
              🗑 Delete Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div style={styles.field}>
      <div style={styles.fieldLabel}>{label}</div>
      <div style={styles.fieldValue}>{value}</div>
    </div>
  );
}

const styles = {
  page:       { minHeight: '100vh', background: '#f4f6f9' },
  content:    { maxWidth: '800px', margin: '0 auto', padding: '32px 24px' },
  loading:    { textAlign: 'center', padding: '80px', color: '#666' },
  back:       { background: 'none', border: 'none', color: '#2e86c1', cursor: 'pointer', fontSize: '15px', marginBottom: '20px', padding: 0 },
  card:       { background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  name:       { fontSize: '28px', color: '#0d1b2a', marginTop: 0, marginBottom: '24px', textTransform: 'capitalize' },
  grid:       { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  field:      { background: '#f4f6f9', borderRadius: '8px', padding: '14px 16px' },
  fieldLabel: { fontSize: '12px', color: '#888', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  fieldValue: { fontSize: '16px', color: '#0d1b2a', fontWeight: '500' },
  deleteBtn:  { marginTop: '24px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', padding: '12px 24px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
};