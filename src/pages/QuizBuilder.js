import React, { useState } from 'react';
import TableofContents from '../components/TableofContents';
import CodeEditor from '../components/CodeEditor';
import allQuizzes from './Quizzes';
import './QuizBuilder.css';
import '../App.css';

export default function QuizBuilder({ onNavigate, user }) {
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [editedCodes, setEditedCodes] = useState({}); // store per-quiz edits

  const quiz = allQuizzes[currentQuizIndex];
  const {
    id = 'UnknownQuiz',
    title = 'Untitled Quiz',
    problemStatement = 'No problem statement provided.',
    initialCode = '',
  } = quiz || {};

  // Determine what code to show
  const displayedCode = editedCodes[id] || initialCode;

  const handleRunCode = async ({ code, input }) => {
    try {
      const response = await fetch('/api/compile/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, input }),
      });
      if (!response.ok) throw new Error('Failed to run code');
      return await response.json();
    } catch (error) {
      console.error('Run error:', error);
      return { output: `Error: ${error.message}` };
    }
  };

  const handleSelectQuiz = (index) => {
    setCurrentQuizIndex(index);
    const main = document.querySelector('.quiz-builder');
    main?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCodeChange = (newCode) => {
    setEditedCodes((prev) => ({
      ...prev,
      [id]: newCode,
    }));
  };

  const tocItems = allQuizzes.map(q => ({
    label: q.title || q.id,
    id: q.id,
  }));

  return (
    <>
      <TableofContents
        disableTransform
        isOpen={true}
        onToggle={() => setIsTocOpen(prev => !prev)}
        items={tocItems.map(item => item.label)}
        onSelect={(itemLabel) => {
          const index = tocItems.findIndex(i => i.label === itemLabel);
          if (index !== -1) handleSelectQuiz(index);
        }}
      />

      <div className="quiz-builder">
        <main className="main-content">
          <div className="content-area">
            <section className="problem-section">
              <header className="top-bar">
                <h2 className="Quiz-title">{title}</h2>
              </header>
              <h3>Problem Statement</h3>
              <p className="problem-text">{problemStatement}</p>
            </section>

            <section className="code-editor-wrapper">
              <div className="code-container">
                <CodeEditor
                  initialCode={displayedCode}
                  onChange={handleCodeChange}
                  onSubmit={handleRunCode}
                />
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
