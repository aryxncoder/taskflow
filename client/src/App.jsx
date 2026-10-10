import { useEffect, useState } from 'react';
import api from './api.js';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Dashboard from './components/Dashboard.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(Boolean(localStorage.getItem('token')));
  const [showRegister, setShowRegister] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) return;
    api
      .get('/auth/me')
      .then((response) => setUser(response.data.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setCheckingSession(false));
  }, []);

  useEffect(() => {
    const handleExpired = (event) => {
      setUser(null);
      setNotice(event.detail || 'Your session has expired. Please log in again.');
    };
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  const handleAuthSuccess = ({ token, user: loggedInUser }) => {
    localStorage.setItem('token', token);
    setNotice('');
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setNotice('');
    setUser(null);
  };

  if (checkingSession) {
    return <p className="page-status">Loading your workspace…</p>;
  }

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return showRegister ? (
    <Register onSuccess={handleAuthSuccess} onSwitch={() => setShowRegister(false)} />
  ) : (
    <Login
      notice={notice}
      onSuccess={handleAuthSuccess}
      onSwitch={() => {
        setNotice('');
        setShowRegister(true);
      }}
    />
  );
}
