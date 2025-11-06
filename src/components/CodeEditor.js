import React, { useState, useEffect } from "react";

function CodeEditor({ onSubmit, initialCode, onChange }) {
  const defaultCode = `#include <iostream>\nusing namespace std;\nint main(){\n    cout << "Hello, World!" << endl;\n    return 0;\n}`;
  
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [MonacoComponent, setMonacoComponent] = useState(null);
  const [monacoError, setMonacoError] = useState(null);
  const [editorLib, setEditorLib] = useState(null);

  // --- Load initial code correctly ---
  useEffect(() => {
    // Only set code when there's a valid initialCode (avoid blank overwrites)
    if (initialCode !== undefined && initialCode !== null && initialCode.trim() !== "") {
      setCode(initialCode);
    } else {
      setCode(defaultCode);
    }
  }, [initialCode]);

  // --- Dynamically load Monaco Editor ---
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const mod = await import('@monaco-editor/react');
        if (mounted && mod.default) {
          setMonacoComponent(() => mod.default);
          setEditorLib('monaco-react');
          return;
        }
      } catch {}
      try {
        const mod2 = await import('react-monaco-editor');
        if (mounted && (mod2.default || mod2.MonacoEditor)) {
          setMonacoComponent(() => mod2.default || mod2.MonacoEditor);
          setEditorLib('react-monaco-editor');
          return;
        }
      } catch (err) {
        console.error('Failed to load Monaco editor:', err);
        if (mounted) setMonacoError(err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleCodeChange = (val) => {
    const newCode = val ?? '';
    setCode(newCode);
    if (onChange) onChange(newCode); // pass change up to parent
  };

  const handleRun = async () => {
    setLoading(true);
    try {
      const result = await onSubmit({ code, input });
      setOutput(result.output || result.stdout || "");
    } catch (err) {
      setOutput("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="code-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        {MonacoComponent && !monacoError ? (
          editorLib === 'monaco-react' ? (
            <MonacoComponent
              language="cpp"
              theme="vs-dark"
              value={code}
              options={{ automaticLayout: true }}
              onChange={(val) => handleCodeChange(val)}
            />
          ) : (
            <MonacoComponent
              language="cpp"
              theme="vs-dark"
              value={code}
              options={{ automaticLayout: true }}
              onChange={handleCodeChange}
            />
          )
        ) : (
          <textarea
            style={{
              width: '100%',
              height: '100%',
              fontFamily: 'monospace',
              fontSize: 14,
              resize: 'none',
              border: 'none',
              outline: 'none',
              padding: 8,
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
            }}
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
          />
        )}
      </div>

      <button
        onClick={handleRun}
        disabled={loading}
        style={{
          padding: '10px 16px',
          fontSize: 14,
          cursor: loading ? 'not-allowed' : 'pointer',
          backgroundColor: '#007acc',
          color: 'white',
          border: 'none',
        }}
      >
        {loading ? "Running…" : "Run Code"}
      </button>

      <pre
        style={{
          padding: 12,
          backgroundColor: '#1e1e1e',
          color: '#d4d4d4',
          fontSize: 13,
          fontFamily: 'monospace',
          height: 180,
          overflow: 'auto',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          margin: 0,
        }}
      >
        {output || 'Output will appear here...'}
      </pre>
    </div>
  );
}

export default CodeEditor;
