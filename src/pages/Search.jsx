// src/pages/Search.jsx
// Natural language search page

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchProfiles } from '../api/client';
import Navbar from '../components/Navbar';

const EXAMPLES = [
  'young males from nigeria',
  'females above 30',
  'adult males from kenya',
  'seniors from south africa',
  'teenagers from ghana',
  'women under 25',
];

export default function Search() {
  const navigate = useNavigate();
  const [query,    setQuery]   = useState('');
  const [results,  setResults] = useState(null);
  const [total,    setTotal]   = useState(0);
  const [loading,  setLoading] = useState(false);
  const [error,    setError]   = useState('');
  const [page,     setPage]    = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleSearch = (q = query, p = 1) => {
    if (!q.trim()) return;
    setLoading(true);
    setError('');
    searchProfiles(q, p)
      .then(res => {
        setResults(res.data.data);
        setTotal(res.data.total);
        setTotalPages(res.data.total_pages);
        setPage(p);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Search failed');
        setResults([]);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <h1 style={styles.title}>Natural Language Search</h1>
        <p style={styles.subtitle}>Ask in plain English — no filters needed</p>

        {/* Search box */}
        <div style={styles.searchBox}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder='e.g. "young males from nigeria"'
            style={styles.input}
          />
          <button onClick={() => handleSearch()} style={styles.btn}>Search</button>
        </div>

        {/* Example queries */}
        <div style={styles.examples}>
          <span style={styles.exLabel}>Try: </span>
          {EXAMPLES.map(ex => (
            <button key={ex} onClick={() => { setQuery(ex); handleSearch(ex); }}
              style={styles.exBtn}>{ex}</button>
          ))}
        </div>

        {/* Results */}
        {loading && <p style={styles.loading}>Searching...</p>}
        {error   && <p style={styles.error}>{error}</p>}

        {results && !loading && (
          <>
            <p style={styles.resultCount}>{total} result{total !== 1 ? 's' : ''} found</p>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    {['Name','Gender','Age','Age Group','Country'].map(h => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((p, i) => (
                    <tr key={p.id}
                      style={i % 2 === 0 ? {background:'#fff',cursor:'pointer'} : {background:'#f4f6f9',cursor:'pointer'}}
                      onClick={() => navigate(`/profiles/${p.id}`)}
                    >
                      <td style={styles.td}>{p.name}</td>
                      <td style={styles.td}>{p.gender}</td>
                      <td style={styles.td}>{p.age}</td>
                      <td style={styles.td}>{p.age_group}</td>
                      <td style={styles.td}>{p.country_id} — {p.country_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={styles.pagination}>
              <button onClick={() => handleSearch(query, page - 1)} disabled={page === 1} style={styles.pageBtn}>← Prev</button>
              <span>Page {page} of {totalPages}</span>
              <button onClick={() => handleSearch(query, page + 1)} disabled={page === totalPages} style={styles.pageBtn}>Next →</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page:        { minHeight: '100vh', background: '#f4f6f9' },
  content:     { maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' },
  title:       { fontSize: '26px', color: '#0d1b2a', marginBottom: '8px' },
  subtitle:    { color: '#666', marginBottom: '24px' },
  searchBox:   { display: 'flex', gap: '10px', marginBottom: '16px' },
  input:       { flex: 1, padding: '14px 16px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '15px', outline: 'none' },
  btn:         { background: '#1b4f72', color: 'white', border: 'none', borderRadius: '8px', padding: '14px 28px', cursor: 'pointer', fontWeight: '600', fontSize: '15px' },
  examples:    { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px', alignItems: 'center' },
  exLabel:     { color: '#888', fontSize: '13px' },
  exBtn:       { background: '#eaf4fb', border: '1px solid #aed6f1', borderRadius: '20px', padding: '4px 12px', fontSize: '13px', cursor: 'pointer', color: '#1b4f72' },
  loading:     { color: '#666', textAlign: 'center', padding: '40px' },
  error:       { color: '#e74c3c', background: '#fdedec', padding: '12px 16px', borderRadius: '8px' },
  resultCount: { color: '#555', marginBottom: '12px', fontWeight: '500' },
  tableWrap:   { overflowX: 'auto', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  table:       { width: '100%', borderCollapse: 'collapse', background: 'white' },
  thead:       { background: '#0d1b2a' },
  th:          { padding: '14px 16px', color: 'white', textAlign: 'left', fontSize: '13px' },
  td:          { padding: '12px 16px', fontSize: '14px', borderBottom: '1px solid #eee' },
  pagination:  { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '20px' },
  pageBtn:     { background: '#1b4f72', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 18px', cursor: 'pointer' },
};