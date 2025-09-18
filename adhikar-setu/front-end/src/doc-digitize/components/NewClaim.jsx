// components/NewClaim.jsx
import React, { useState, useCallback } from 'react';
import DocumentUploader from './DocumentUploader.jsx';
import DocumentViewer from './DocumentViewer.jsx';
import FieldExtractor from './FieldExtractor.jsx';
import { db } from '../../firebase/firebase.js';
import { collection, addDoc } from 'firebase/firestore';

const NewClaim = ({ user, onClaimCreated }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [currentDocumentPage, setCurrentDocumentPage] = useState(0);
  const [ocrResults, setOcrResults] = useState([]);
  const [extractedFields, setExtractedFields] = useState({});
  const [formType, setFormType] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const steps = [
    { title: 'Upload Documents', description: 'Upload your FRA form documents' },
    { title: 'Review & Edit', description: 'Review extracted information and make corrections' },
    { title: 'Submit Claim', description: 'Confirm and submit your claim' }
  ];

  const handleDocumentsProcessed = useCallback((results) => {
    setOcrResults(results);
    setCurrentStep(1);
  }, []);

  const handleFieldsExtracted = useCallback((fields, detectedFormType) => {
    setExtractedFields(fields);
    setFormType(detectedFormType);
  }, []);

  const handleDocumentUpload = useCallback((files) => {
    setUploadedDocuments(Array.from(files));
  }, []);

  const handleFieldChange = useCallback((fieldKey, value) => {
    setExtractedFields(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  }, []);

  const handleSaveFields = useCallback(async (fields) => {
    setIsSaving(true);
    try {
      // Save to Firebase
      const claimData = {
        userId: user.uid,
        userEmail: user.email,
        formType,
        fields,
        status: 'SUBMITTED',
        createdAt: new Date(),
        updatedAt: new Date(),
        ocrResults,
        documents: uploadedDocuments.map(doc => ({
          name: doc.name,
          size: doc.size,
          type: doc.type
        }))
      };

      const docRef = await addDoc(collection(db, 'fra_claims'), claimData);
      
      setCurrentStep(2);
      
      if (onClaimCreated) {
        onClaimCreated({ id: docRef.id, ...claimData });
      }
    } catch (error) {
      console.error('Error saving claim:', error);
      alert('Failed to save claim. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [user, formType, ocrResults, uploadedDocuments, onClaimCreated]);

  const handleSubmitClaim = useCallback(() => {
    // Navigate back to dashboard or show success message
    if (onClaimCreated) {
      onClaimCreated(null); // Signal completion
    }
  }, [onClaimCreated]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="step-content upload-step">
            <DocumentUploader
              onDocumentsProcessed={handleDocumentsProcessed}
              onFieldsExtracted={handleFieldsExtracted}
            />
          </div>
        );

      case 1:
        return (
          <div className="step-content review-step">
            <div className="review-layout">
              <div className="document-panel">
                <DocumentViewer
                  documents={uploadedDocuments}
                  currentPage={currentDocumentPage}
                  onPageChange={setCurrentDocumentPage}
                />
              </div>
              
              <div className="separator"></div>
              
              <div className="fields-panel">
                <FieldExtractor
                  extractedFields={extractedFields}
                  formType={formType}
                  onFieldChange={handleFieldChange}
                  onSave={handleSaveFields}
                  isSaving={isSaving}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content success-step">
            <div className="success-message">
              <div className="success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22,4 12,14.01 9,11.01"></polyline>
                </svg>
              </div>
              <h2>Claim Submitted Successfully!</h2>
              <p>Your FRA claim has been submitted and is now under review.</p>
              
              <div className="claim-summary">
                <div className="summary-item">
                  <strong>Form Type:</strong> {formType?.replace('_', ' ')}
                </div>
                <div className="summary-item">
                  <strong>Status:</strong> Submitted
                </div>
                <div className="summary-item">
                  <strong>Documents:</strong> {uploadedDocuments.length} files uploaded
                </div>
                <div className="summary-item">
                  <strong>Next Steps:</strong> Your claim will be verified by the Forest Rights Committee
                </div>
              </div>

              <div className="success-actions">
                <button onClick={handleSubmitClaim} className="primary-button">
                  Go to Dashboard
                </button>
                <button 
                  onClick={() => window.location.reload()} 
                  className="secondary-button"
                >
                  Submit Another Claim
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="new-claim">
      <div className="claim-header">
        <h1>New FRA Claim</h1>
        <p>Submit your Forest Rights Act claim by uploading documents and filling required information</p>
      </div>

      <div className="progress-stepper">
        {steps.map((step, index) => (
          <div key={index} className={`step ${index <= currentStep ? 'completed' : ''}`}>
            <div className="step-number">{index + 1}</div>
            <div className="step-info">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
            {index < steps.length - 1 && <div className="step-connector"></div>}
          </div>
        ))}
      </div>

      <div className="step-container">
        {renderStepContent()}
      </div>

      {currentStep === 1 && (
        <div className="step-navigation">
          <button 
            onClick={() => setCurrentStep(0)} 
            className="nav-button secondary"
          >
            Back to Upload
          </button>
        </div>
      )}
    </div>
  );
};

export default NewClaim;