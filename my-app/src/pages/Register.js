import React, { useState } from 'react';

export default function Register({ onRegister, onNavigate }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    setError(null);
    if (!username || !password) {
      setError('Please fill all fields');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    // fake registration — replace with backend call
    const user = { id: Date.now(), username };
    onRegister(user);
  };

  return (
    <section className="page page-register">
      <h2>Create Account</h2>

      <form onSubmit={submit} className="form form-auth">
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>

        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        <label>
          Confirm Password
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </label>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn">Create account</button>
          <button type="button" className="btn btn-link" onClick={() => onNavigate('login')}>Sign in instead</button>
        </div>
      </form>
    </section>
  );
}
