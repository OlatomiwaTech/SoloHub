import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')));
  const authVersion = useRef(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const requestVersion = authVersion.current;

    if (!token) {
      return;
    }

    authAPI.getMe()
      .then((response) => {
        const currentUser = response.data.data.user;
        setUser(currentUser);
        localStorage.setItem('user', JSON.stringify(currentUser));
      })
      .catch(() => {
        // Do not clear a token created by a login that completed meanwhile.
        if (authVersion.current === requestVersion && localStorage.getItem('token') === token) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    const { user: authenticatedUser, token } = response.data.data;
    authVersion.current += 1;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);
    setLoading(false);
    return authenticatedUser;
  };

  const register = async (details) => {
    const response = await authAPI.register(details);
    const { user: registeredUser, token } = response.data.data;
    authVersion.current += 1;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(registeredUser));
    setUser(registeredUser);
    setLoading(false);
    return registeredUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
