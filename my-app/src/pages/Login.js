import React, { useState } from 'react';

export default function Login({ onLogin, onNavigate }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    setError(null);

    // simple client-side validation and fake auth
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }

    // fake user object — replace with real auth later
    const user = { id: 1, username };
    onLogin(user);
  };

  return (
    <section className="page page-login">
      <h2>Sign in</h2>

      <form onSubmit={submit} className="form form-auth">
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>

        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn">Sign in</button>
          <button type="button" className="btn btn-link" onClick={() => onNavigate('register')}>Create account</button>
        </div>
      </form>
    </section>
  );
}
