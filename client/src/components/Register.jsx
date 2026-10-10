import { useState } from 'react';
import api, { getErrorMessage } from '../api.js';

export default function Register({ onSuccess, onSwitch }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/auth/register', form);
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
        <p className="auth-subtitle">Create an account to start tracking tasks.</p>

        {error && <p className="alert alert-error" role="alert">{error}</p>}

        <label htmlFor="register-name">Name</label>
        <input id="register-name" name="name" type="text" autoComplete="name" maxLength={50} value={form.name} onChange={handleChange} required />

        <label htmlFor="register-email">Email</label>
        <input id="register-email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} required />

        <label htmlFor="register-password">Password</label>
        <input id="register-password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={handleChange} required />
        <p className="field-hint">At least 6 characters.</p>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
        <p className="auth-switch">
          Already registered?{' '}
          <button type="button" className="link-button" onClick={onSwitch}>Log in</button>
        </p>
      </form>
    </main>
  );
}
