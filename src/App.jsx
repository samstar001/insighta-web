// src/App.jsx
// Defines all routes and wraps app with AuthProvider

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login         from './pages/Login';
import Dashboard     from './pages/Dashboard';
import Profiles      from './pages/Profiles';
import ProfileDetail from './pages/ProfileDetail';
import Search        from './pages/Search';
import Account       from './pages/Account';

// ProtectedRoute — redirects to login if not authenticated
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{textAlign:'center',padding:'80px',color:'#666'}}>Loading...</div>;
  if (!user)   return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"         element={<Login />} />
          <Route path="/dashboard"element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profiles" element={<ProtectedRoute><Profiles /></ProtectedRoute>} />
          <Route path="/profiles/:id" element={<ProtectedRoute><ProfileDetail /></ProtectedRoute>} />
          <Route path="/search"   element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/account"  element={<ProtectedRoute><Account /></ProtectedRoute>} />
          {/* Catch all unknown URLs → redirect to login */}
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}