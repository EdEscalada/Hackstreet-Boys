import React from 'react';

const LESSONS = {
  pointers: {
    title: 'Pointers',
    overview: 'Pointers store memory addresses. They let you work with memory directly and are foundational for dynamic memory and low-level operations in C++.',
    sections: [
      {
        heading: 'Address-of and Dereference',
        content: `Use & to get an address and * to dereference a pointer. Example:\n\nint x = 10;\nint *p = &x; // p holds the address of x\nstd::cout << *p; // prints 10`,
      },
      {
        heading: 'Pointer Types and Safety',
        content: 'Pointers have types. Be careful with dangling pointers and always initialize pointers. Consider using smart pointers (std::unique_ptr, std::shared_ptr) for ownership semantics in modern C++.',
      },
    ],
    w3: 'https://www.w3schools.com/cpp/cpp_pointers.asp',
  },
  recursion: {
    title: 'Recursion',
    overview: 'Recursion is a technique where a function calls itself. Always provide a base case to avoid infinite recursion.',
    sections: [
      {
        heading: 'Base Case and Progress',
        content: 'A base case stops the recursion. Each recursive call should make progress toward the base case. Example: factorial.',
      },
      {
        heading: 'Stack & Efficiency',
        content: 'Each recursive call uses stack space. For deep recursion consider iterative solutions or tail recursion (compiler-dependent optimizations).',
      },
    ],
    w3: 'https://www.w3schools.com/cpp/cpp_recursion.asp',
  },
};

export default function Lesson({ quizConfig, onNavigate }) {
  const moduleId = quizConfig?.moduleId || null;
  const module = moduleId ? LESSONS[moduleId] : null;

  return (
    <section className="page page-lesson">
      <h2>{module ? module.title : 'Lesson'}</h2>

      {!module ? (
        <>
          <p className="muted">No lesson found for this module.</p>
          <div className="form-actions">
            <button className="btn" onClick={() => onNavigate('modules')}>Back to modules</button>
          </div>
        </>
      ) : (
        <>
          <p className="muted">{module.overview}</p>

          {module.sections.map((s, i) => (
            <div key={i} className="lesson-section" style={{marginTop:12}}>
              <h4>{s.heading}</h4>
              <pre style={{whiteSpace:'pre-wrap'}}>{s.content}</pre>
            </div>
          ))}

          <p className="muted">More reading: <a href={module.w3} target="_blank" rel="noreferrer">W3Schools: {module.title}</a></p>

          <div className="form-actions" style={{marginTop:12}}>
            <button className="btn" onClick={() => onNavigate('quiz', { moduleId, title: module.title })}>Start quiz</button>
            <button className="btn btn-ghost" onClick={() => onNavigate('modules')}>Back to modules</button>
          </div>
        </>
      )}
    </section>
  );
}
