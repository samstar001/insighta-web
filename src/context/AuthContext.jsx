// src/context/AuthContext.jsx
// React Context — a way to share data across all pages without
// passing it manually through every component.

import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);   // logged-in user object
  const [loading, setLoading] = useState(true);   // true while checking auth

  // On app load, check if there's a valid session (cookie)
  useEffect(() => {
    getMe()
      .then(res => setUser(res.data.data))
      .catch(() => setUser(null))       // no session = not logged in
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — any component can call useAuth() to get the user
export const useAuth = () => useContext(AuthContext);