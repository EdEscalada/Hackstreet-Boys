import React from 'react';

export default function Home({ onNavigate, user }) {
  return (
    <section className="page page-home">
      <h1>Welcome to C++ ITS</h1>
      <p>
        This interactive tutoring system helps students learn C++ through
        short modules and quizzes. Get started by creating an account or
        exploring the available modules.
      </p>

      <div className="home-actions">
        {!user && (
          <>
            <button onClick={() => onNavigate('register')} className="btn">Create account</button>
            <button onClick={() => onNavigate('login')} className="btn btn-outline">Sign in</button>
          </>
        )}

        {user && (
          <>
            <p className="muted">Signed in as <strong>{user.username}</strong></p>
            <button onClick={() => onNavigate('modules')} className="btn">Browse Modules</button>
          </>
        )}
      </div>
    </section>
  );
}
