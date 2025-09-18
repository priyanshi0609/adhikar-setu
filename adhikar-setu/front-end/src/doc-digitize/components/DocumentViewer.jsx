// components/DocumentViewer.jsx
import React, { useState, useRef } from 'react';

const DocumentViewer = ({ documents, currentPage, onPageChange }) => {
  const [scale, setScale] = useState(1);
  const viewerRef = useRef(null);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => setScale(1);

  const renderDocument = (document) => {
    if (!document) return null;

    // Handle different file types
    if (document.type?.startsWith('image/')) {
      return (
        <img
          src={URL.createObjectURL(document)}
          alt={`Document page ${currentPage + 1}`}
          style={{ 
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            maxWidth: 'none',
            height: 'auto'
          }}
          onLoad={(e) => {
            // Revoke object URL to prevent memory leaks
            setTimeout(() => URL.revokeObjectURL(e.target.src), 1000);
          }}
        />
      );
    } else if (document.type === 'application/pdf') {
      // For PDF files, you might want to use a PDF viewer library
      // For now, showing a placeholder
      return (
        <div className="pdf-placeholder">
          <div className="pdf-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14,2 14,8 20,8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10,9 9,9 8,9"></polyline>
            </svg>
          </div>
          <p>PDF Document: {document.name}</p>
          <p>Size: {(document.size / 1024 / 1024).toFixed(2)} MB</p>
          <small>PDF viewer integration needed for full preview</small>
        </div>
      );
    }

    return <div className="unsupported-format">Unsupported file format</div>;
  };

  if (!documents || documents.length === 0) {
    return (
      <div className="document-viewer empty">
        <div className="empty-state">
          <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14,2 14,8 20,8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
          <h3>No Documents Uploaded</h3>
          <p>Upload your FRA documents to view them here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="document-viewer">
      <div className="viewer-header">
        <div className="document-info">
          <h3>Document Preview</h3>
          <span className="page-info">
            {currentPage + 1} of {documents.length}
          </span>
        </div>
        
        <div className="viewer-controls">
          <div className="zoom-controls">
            <button onClick={handleZoomOut} title="Zoom Out">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </button>
            <span className="zoom-level">{Math.round(scale * 100)}%</span>
            <button onClick={handleZoomIn} title="Zoom In">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </button>
            <button onClick={handleResetZoom} title="Reset Zoom">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="1 4 1 10 7 10"></polyline>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="viewer-content" ref={viewerRef}>
        <div className="document-container">
          {renderDocument(documents[currentPage])}
        </div>
      </div>

      {documents.length > 1 && (
        <div className="page-navigation">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="nav-button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Previous
          </button>

          <div className="page-thumbnails">
            {documents.map((doc, index) => (
              <button
                key={index}
                className={`thumbnail ${index === currentPage ? 'active' : ''}`}
                onClick={() => onPageChange(index)}
                title={`Page ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === documents.length - 1}
            className="nav-button"
          >
            Next
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentViewer;