// src/pages/Profiles.jsx
// Lists all profiles with filters, sorting, and pagination

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfiles, exportProfiles } from '../api/client';
import Navbar from '../components/Navbar';

export default function Profiles() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [total, setTotal]       = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]   = useState(true);

  // Filter state
  const [gender,    setGender]    = useState('');
  const [country,   setCountry]   = useState('');
  const [ageGroup,  setAgeGroup]  = useState('');
  const [minAge,    setMinAge]    = useState('');
  const [maxAge,    setMaxAge]    = useState('');
  const [sortBy,    setSortBy]    = useState('');
  const [order,     setOrder]     = useState('asc');
  const [page,      setPage]      = useState(1);
  const limit = 10;

  const fetchProfiles = () => {
    setLoading(true);
    const params = { page, limit };
    if (gender)   params.gender    = gender;
    if (country)  params.country_id = country.toUpperCase();
    if (ageGroup) params.age_group = ageGroup;
    if (minAge)   params.min_age   = minAge;
    if (maxAge)   params.max_age   = maxAge;
    if (sortBy)   { params.sort_by = sortBy; params.order = order; }

    getProfiles(params)
      .then(res => {
        setProfiles(res.data.data);
        setTotal(res.data.total);
        setTotalPages(res.data.total_pages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProfiles(); }, [page]);

  const handleSearch = () => { setPage(1); fetchProfiles(); };

  const handleExport = () => {
    const params = {};
    if (gender)   params.gender    = gender;
    if (country)  params.country_id = country.toUpperCase();
    if (ageGroup) params.age_group = ageGroup;
    exportProfiles(params).then(res => {
      // Create a download link and click it automatically
      const url  = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href  = url;
      link.setAttribute('download', `profiles_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Profiles <span style={styles.badge}>{total.toLocaleString()}</span></h1>
          <button onClick={handleExport} style={styles.exportBtn}>⬇ Export CSV</button>
        </div>

        {/* ── Filters ── */}
        <div style={styles.filters}>
          <select value={gender} onChange={e => setGender(e.target.value)} style={styles.input}>
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input placeholder="Country (e.g. NG)" value={country}
            onChange={e => setCountry(e.target.value)} style={styles.input} />
          <select value={ageGroup} onChange={e => setAgeGroup(e.target.value)} style={styles.input}>
            <option value="">All Age Groups</option>
            <option value="child">Child</option>
            <option value="teenager">Teenager</option>
            <option value="adult">Adult</option>
            <option value="senior">Senior</option>
          </select>
          <input placeholder="Min Age" type="number" value={minAge}
            onChange={e => setMinAge(e.target.value)} style={{...styles.input, width: '90px'}} />
          <input placeholder="Max Age" type="number" value={maxAge}
            onChange={e => setMaxAge(e.target.value)} style={{...styles.input, width: '90px'}} />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={styles.input}>
            <option value="">Sort By</option>
            <option value="age">Age</option>
            <option value="created_at">Created At</option>
            <option value="gender_probability">Gender Probability</option>
          </select>
          <select value={order} onChange={e => setOrder(e.target.value)} style={styles.input}>
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
          <button onClick={handleSearch} style={styles.searchBtn}>Search</button>
        </div>

        {/* ── Table ── */}
        {loading ? <p style={styles.loading}>Loading...</p> : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  {['Name','Gender','Age','Age Group','Country','Probability','Created'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {profiles.map((p, i) => (
                  <tr key={p.id} style={i % 2 === 0 ? styles.trEven : styles.trOdd}
                    onClick={() => navigate(`/profiles/${p.id}`)}
                    onMouseEnter={e => e.currentTarget.style.background = '#d6eaf8'}
                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#f4f6f9'}
                  >
                    <td style={styles.td}>{p.name}</td>
                    <td style={styles.td}>{p.gender}</td>
                    <td style={styles.td}>{p.age}</td>
                    <td style={styles.td}>{p.age_group}</td>
                    <td style={styles.td}>{p.country_id} — {p.country_name}</td>
                    <td style={styles.td}>{(p.gender_probability * 100).toFixed(0)}%</td>
                    <td style={styles.td}>{new Date(p.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination ── */}
        <div style={styles.pagination}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1} style={styles.pageBtn}>← Prev</button>
          <span style={styles.pageInfo}>Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages} style={styles.pageBtn}>Next →</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page:      { minHeight: '100vh', background: '#f4f6f9' },
  content:   { maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' },
  header:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title:     { fontSize: '24px', color: '#0d1b2a', margin: 0 },
  badge:     { background: '#2e86c1', color: 'white', borderRadius: '20px', padding: '2px 12px', fontSize: '14px', marginLeft: '8px' },
  exportBtn: { background: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 18px', cursor: 'pointer', fontWeight: '600' },
  filters:   { display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px', background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  input:     { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', minWidth: '120px' },
  searchBtn: { background: '#1b4f72', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 20px', cursor: 'pointer', fontWeight: '600' },
  loading:   { color: '#666', textAlign: 'center', padding: '40px' },
  tableWrap: { overflowX: 'auto', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  table:     { width: '100%', borderCollapse: 'collapse', background: 'white' },
  thead:     { background: '#0d1b2a' },
  th:        { padding: '14px 16px', textAlign: 'left', color: 'white', fontSize: '13px', fontWeight: '600' },
  trEven:    { background: '#fff', cursor: 'pointer' },
  trOdd:     { background: '#f4f6f9', cursor: 'pointer' },
  td:        { padding: '12px 16px', fontSize: '14px', color: '#333', borderBottom: '1px solid #eee' },
  pagination:{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px' },
  pageBtn:   { background: '#1b4f72', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 18px', cursor: 'pointer', fontWeight: '600' },
  pageInfo:  { color: '#555', fontSize: '14px' },
};