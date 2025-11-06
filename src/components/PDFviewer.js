import React from 'react';

function PDFviewer({ pdfUrl }) {
  return (
    <div className="pdf-viewer" style={{ width: '100%', height: '100%' }}>
      <iframe
        src={pdfUrl}
        title="PDF Viewer"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
      />
    </div>
  );
}

export default PDFviewer;
