import React from 'react';

export default function Quiz({ onNavigate, quizConfig }) {
  return (
    <section className="page">
      <h2 style={{ marginBottom: '30px' }}>Take Quiz</h2>
      <p>Your quiz is ready to begin!</p>

      <button
        className="btn"
        onClick={() => onNavigate('quiz-builder', { quizConfig })}
      >
        Take Quiz
      </button>
    </section>
  );
}
