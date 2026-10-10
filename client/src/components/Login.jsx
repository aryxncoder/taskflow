import { useState } from 'react';
import api, { getErrorMessage } from '../api.js';

export default function Login({ onSuccess, onSwitch, notice }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', form);
      onSuccess(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1 className="brand">TaskFlow</h1>
        <p className="auth-subtitle">Log in to see your tasks.</p>

        {notice && <p className="alert alert-warning" role="alert">{notice}</p>}
        {error && <p className="alert alert-error" role="alert">{error}</p>}

        <label htmlFor="login-email">Email</label>
        <input id="login-email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} required />

        <label htmlFor="login-password">Password</label>
        <input id="login-password" name="password" type="password" autoComplete="current-password" value={form.password} onChange={handleChange} required />

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </button>
        <p className="auth-switch">
          New here?{' '}
          <button type="button" className="link-button" onClick={onSwitch}>Create an account</button>
        </p>
      </form>
    </main>
  );
}
