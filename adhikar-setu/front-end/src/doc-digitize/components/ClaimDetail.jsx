// components/ClaimDetail.jsx
import React, { useState } from 'react';
import ClaimStatus from './ClaimStatus.jsx';
import { FORM_A_FIELDS, FORM_B_FIELDS, FORM_C_FIELDS, FRA_FORM_TYPES } from '../constants/fraFields.js';

const ClaimDetail = ({ claim, onBack }) => {
  const [activeTab, setActiveTab] = useState('details');

  const getFieldsTemplate = () => {
    switch (claim.formType) {
      case FRA_FORM_TYPES.FORM_A:
        return FORM_A_FIELDS;
      case FRA_FORM_TYPES.FORM_B:
        return FORM_B_FIELDS;
      case FRA_FORM_TYPES.FORM_C:
        return FORM_C_FIELDS;
      default:
        return FORM_A_FIELDS;
    }
  };

  const renderFieldValue = (fieldKey, value) => {
    if (!value) return <span className="empty-value">Not provided</span>;
    
    if (fieldKey === 'familyMembers' || fieldKey === 'evidence' || fieldKey === 'additionalInfo') {
      return (
        <div className="textarea-value">
          {value.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      );
    }
    
    if (fieldKey === 'isScheduledTribe' || fieldKey === 'isOTFD') {
      return (
        <span className={`boolean-value ${value === 'Yes' ? 'yes' : 'no'}`}>
          {value === 'Yes' ? 'Yes' : 'No'}
        </span>
      );
    }
    
    if (fieldKey.includes('extent') || fieldKey.includes('area')) {
      return <span className="area-value">{value} hectares</span>;
    }
    
    return <span className="text-value">{value}</span>;
  };

  const tabs = [
    { id: 'details', label: 'Claim Details', icon: '📋' },
    { id: 'status', label: 'Status', icon: '📊' },
    { id: 'documents', label: 'Documents', icon: '📄' },
    { id: 'history', label: 'History', icon: '🕒' }
  ];

  return (
    <div className="claim-detail">
      <div className="detail-header">
        <button onClick={onBack} className="back-button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back to Claims
        </button>
        
        <div className="claim-title">
          <h1>{claim.formType?.replace('_', ' ')} Claim</h1>
          <p>Submitted on {new Date(claim.createdAt?.toDate()).toLocaleDateString('en-IN')}</p>
        </div>
      </div>

      <div className="detail-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="detail-content">
        {activeTab === 'details' && (
          <div className="details-tab">
            <div className="basic-info">
              <h3>Basic Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Claimant Name</label>
                  {renderFieldValue('claimantName', claim.fields?.claimantName)}
                </div>
                <div className="info-item">
                  <label>Village</label>
                  {renderFieldValue('village', claim.fields?.village)}
                </div>
                <div className="info-item">
                  <label>District</label>
                  {renderFieldValue('district', claim.fields?.district)}
                </div>
                <div className="info-item">
                  <label>Gram Panchayat</label>
                  {renderFieldValue('gramPanchayat', claim.fields?.gramPanchayat)}
                </div>
              </div>
            </div>

            <div className="all-fields">
              <h3>All Extracted Fields</h3>
              <div className="fields-list">
                {getFieldsTemplate().map(field => (
                  <div key={field.key} className="field-item">
                    <label className="field-label">
                      {field.label}
                      {field.required && <span className="required">*</span>}
                    </label>
                    <div className="field-value">
                      {renderFieldValue(field.key, claim.fields?.[field.key])}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'status' && (
          <div className="status-tab">
            <ClaimStatus 
              status={claim.status} 
              updatedAt={claim.updatedAt}
            />
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="documents-tab">
            <h3>Uploaded Documents</h3>
            {claim.documents && claim.documents.length > 0 ? (
              <div className="documents-list">
                {claim.documents.map((doc, index) => (
                  <div key={index} className="document-item">
                    <div className="doc-icon">
                      {doc.type?.startsWith('image/') ? '🖼️' : '📄'}
                    </div>
                    <div className="doc-info">
                      <h4>{doc.name}</h4>
                      <p>Size: {(doc.size / 1024 / 1024).toFixed(2)} MB</p>
                      <p>Type: {doc.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No documents available</p>
            )}

            {claim.ocrResults && claim.ocrResults.length > 0 && (
              <div className="ocr-results">
                <h3>OCR Processing Results</h3>
                <div className="ocr-summary">
                  {claim.ocrResults.map((result, index) => (
                    <div key={index} className="ocr-result">
                      <h4>Page {result.pageNumber}</h4>
                      <p>Confidence: {result.confidence?.toFixed(1)}%</p>
                      <p>Status: {result.success ? 'Success' : 'Failed'}</p>
                      {result.text && (
                        <details className="extracted-text">
                          <summary>View Extracted Text</summary>
                          <pre>{result.text}</pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-tab">
            <h3>Claim History</h3>
            <div className="history-timeline">
              <div className="history-item">
                <div className="history-marker"></div>
                <div className="history-content">
                  <h4>Claim Submitted</h4>
                  <p>
                    Submitted on {new Date(claim.createdAt?.toDate()).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              {claim.updatedAt && claim.updatedAt !== claim.createdAt && (
                <div className="history-item">
                  <div className="history-marker"></div>
                  <div className="history-content">
                    <h4>Status Updated</h4>
                    <p>
                      Last updated on {new Date(claim.updatedAt?.toDate()).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimDetail;