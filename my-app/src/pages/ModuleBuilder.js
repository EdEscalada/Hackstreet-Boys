import React, { useState } from 'react';
import TableofContents from '../components/TableofContents';
import PDFviewer from '../components/PDFviewer';
import CodeEditor from '../components/CodeEditor';
import './ModuleBuilder.css';

export default function ModuleBuilder({ module, onNavigate, user }) {
  const [isTocOpen, setIsTocOpen] = useState(false);

  const { title = 'Untitled Module', pdfUrl = '', initialCode = '', tocItems = [] } = module || {};

  const handleRunCode = async ({ code, input }) => {
    try {
      const response = await fetch('/api/compile/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, input }),
      });
      if (!response.ok) throw new Error('Compilation failed');
      return await response.json();
    } catch (error) {
      console.error('Error running code:', error);
      return { output: 'Error: ' + error.message };
    }
  };

    return (
    <>
      {/* Separate TOC */}
      <TableofContents
        isOpen={isTocOpen}
        onToggle={() => setIsTocOpen(!isTocOpen)}
        items={tocItems}
        onSelect={(item) => {
          // Simple behavior: scroll main content to top and optionally show an alert or highlight.
          // For now we'll just scroll the main content area into view so student can read the section.
          const main = document.querySelector('.module-builder');
          if (main) main.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Module Content */}
      <div
        className="module-builder"
      >
        {/* Top Bar */}
        <div className="top-bar">
          <h2 className="module-title">{title}</h2>
          <button
            className="back-button"
            onClick={() => onNavigate('modules')}
          >
            Back to Modules
          </button>
        </div>

        {/* Main Content */}
        <div className="main-content">
          
          <div className="content-area">
            {/* PDF */}
            <div className={`pdf-container ${pdfUrl ? '' : 'pdf-placeholder'}`}>
              {pdfUrl && <PDFviewer pdfUrl={pdfUrl} />}
            </div>

            {/* Code Editor */}
            <div className="code-editor-wrapper">
              <div className="code-container">
                  <CodeEditor onSubmit={handleRunCode} initialCode={initialCode} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );

}
