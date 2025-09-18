// components/DocumentUploader.jsx
import React, { useCallback, useState } from 'react';
import { useOCR } from '../hooks/useOCR.js';

const DocumentUploader = ({ onDocumentsProcessed, onFieldsExtracted }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  const {
    isProcessing,
    progress,
    results,
    extractedFields,
    formType,
    error,
    processDocuments,
    reprocessWithFormType
  } = useOCR();

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    
    if (files.length > 0) {
      setUploadedFiles(files);
      await processDocuments(files);
    }
  }, [processDocuments]);

  const handleFileSelect = useCallback(async (e) => {
    const files = Array.from(e.target.files).filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    
    if (files.length > 0) {
      setUploadedFiles(files);
      await processDocuments(files);
    }
  }, [processDocuments]);

  const handleFormTypeChange = useCallback((newFormType) => {
    reprocessWithFormType(newFormType);
  }, [reprocessWithFormType]);

  React.useEffect(() => {
    if (results.length > 0 && onDocumentsProcessed) {
      onDocumentsProcessed(results);
    }
  }, [results, onDocumentsProcessed]);

  React.useEffect(() => {
    if (Object.keys(extractedFields).length > 0 && onFieldsExtracted) {
      onFieldsExtracted(extractedFields, formType);
    }
  }, [extractedFields, formType, onFieldsExtracted]);

  return (
    <div className="document-uploader">
      <div
        className={`upload-zone ${dragOver ? 'drag-over' : ''} ${isProcessing ? 'processing' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-input"
          multiple
          accept="image/*,.pdf"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          disabled={isProcessing}
        />
        
        <div className="upload-content">
          {isProcessing ? (
            <div className="processing-state">
              <div className="spinner"></div>
              <p>Processing documents... {progress}%</p>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="upload-prompt">
              <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
              </svg>
              <h3>Upload FRA Documents</h3>
              <p>Drag & drop your Form A, B, or C documents here</p>
              <p className="file-types">Supports: Images (JPG, PNG) and PDF files</p>
              <label htmlFor="file-input" className="upload-button">
                Choose Files
              </label>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <h4>Uploaded Files:</h4>
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index} className="file-item">
                <span className="file-name">{file.name}</span>
                <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {formType && (
        <div className="form-type-selector">
          <h4>Detected Form Type:</h4>
          <div className="form-type-options">
            {['FORM_A', 'FORM_B', 'FORM_C'].map(type => (
              <button
                key={type}
                className={`form-type-btn ${formType === type ? 'active' : ''}`}
                onClick={() => handleFormTypeChange(type)}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="ocr-summary">
          <h4>Processing Results:</h4>
          <div className="results-grid">
            {results.map((result, index) => (
              <div key={index} className="result-item">
                <span className="page-number">Page {result.pageNumber}</span>
                <span className={`status ${result.success ? 'success' : 'error'}`}>
                  {result.success ? `${result.confidence.toFixed(1)}% confidence` : 'Failed'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;