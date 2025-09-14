// components/FieldExtractor.jsx
import React, { useState, useEffect } from 'react';
import { FORM_A_FIELDS, FORM_B_FIELDS, FORM_C_FIELDS, FRA_FORM_TYPES, CLAIMANT_TYPES } from '../constants/fraFields.js';
import { FRAValidation } from '../utils/fraValidation.js';

const FieldExtractor = ({ extractedFields, formType, onFieldChange, onSave, isSaving }) => {
  const [fields, setFields] = useState({});
  const [validationResults, setValidationResults] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setFields(extractedFields || {});
    setHasUnsavedChanges(false);
  }, [extractedFields]);

  const getFieldsTemplate = () => {
    switch (formType) {
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

  const handleFieldChange = (fieldKey, value) => {
    const updatedFields = { ...fields, [fieldKey]: value };
    setFields(updatedFields);
    setHasUnsavedChanges(true);
    
    if (onFieldChange) {
      onFieldChange(fieldKey, value);
    }

    // Validate specific fields in real-time
    if (fieldKey === 'area') {
      const validation = FRAValidation.validateLandArea(value);
      setValidationResults(prev => ({
        ...prev,
        [fieldKey]: validation
      }));
    }
  };

  const handleSave = async () => {
    // Validate all fields before saving
    const validationReport = FRAValidation.generateValidationReport({
      ...fields,
      evidenceList: fields.evidence ? fields.evidence.split(',').map(e => e.trim()) : [],
      area: fields.extentForHabitation || fields.extentForCultivation,
      occupationDates: []
    });

    if (validationReport.overall.valid || validationReport.overall.warnings.length === 0) {
      if (onSave) {
        await onSave(fields);
        setHasUnsavedChanges(false);
      }
    } else {
      alert('Please fix validation errors before saving:\n' + validationReport.overall.errors.join('\n'));
    }
  };

  const renderField = (field) => {
    const value = fields[field.key] || '';
    const validation = validationResults[field.key];

    if (field.key === 'isScheduledTribe' || field.key === 'isOTFD') {
      return (
        <div key={field.key} className="form-group">
          <label className="field-label">
            {field.label}
            {field.required && <span className="required">*</span>}
          </label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name={field.key}
                value="Yes"
                checked={value === 'Yes'}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
              />
              Yes
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name={field.key}
                value="No"
                checked={value === 'No'}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
              />
              No
            </label>
          </div>
          {validation && !validation.valid && (
            <div className="field-error">{validation.message}</div>
          )}
        </div>
      );
    }

    if (field.key === 'familyMembers' || field.key === 'evidence' || field.key === 'additionalInfo') {
      return (
        <div key={field.key} className="form-group">
          <label htmlFor={field.key} className="field-label">
            {field.label}
            {field.required && <span className="required">*</span>}
          </label>
          <textarea
            id={field.key}
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            className="field-input textarea"
            rows={4}
            placeholder={`Enter ${field.label.toLowerCase()}...`}
          />
          {field.key === 'evidence' && (
            <small className="field-help">
              List all evidence as per Rule 13. Separate multiple items with commas.
            </small>
          )}
          {validation && !validation.valid && (
            <div className="field-error">{validation.message}</div>
          )}
        </div>
      );
    }

    return (
      <div key={field.key} className="form-group">
        <label htmlFor={field.key} className="field-label">
          {field.label}
          {field.required && <span className="required">*</span>}
        </label>
        <input
          id={field.key}
          type={field.key.includes('extent') || field.key.includes('area') ? 'number' : 'text'}
          value={value}
          onChange={(e) => handleFieldChange(field.key, e.target.value)}
          className="field-input"
          placeholder={`Enter ${field.label.toLowerCase()}...`}
          step={field.key.includes('extent') || field.key.includes('area') ? '0.01' : undefined}
        />
        {field.key.includes('extent') && (
          <small className="field-help">Area in hectares (max 4.0 hectares as per FRA)</small>
        )}
        {validation && !validation.valid && (
          <div className="field-error">{validation.message}</div>
        )}
      </div>
    );
  };

  const fieldsTemplate = getFieldsTemplate();

  return (
    <div className="field-extractor">
      <div className="extractor-header">
        <div className="header-info">
          <h3>Extracted Fields</h3>
          <div className="form-type-badge">
            {formType?.replace('_', ' ') || 'Unknown Form'}
          </div>
        </div>
        
        {hasUnsavedChanges && (
          <div className="unsaved-indicator">
            <span className="dot"></span>
            Unsaved changes
          </div>
        )}
      </div>

      <div className="fields-container">
        <div className="section-header">
          <h4>Personal Information</h4>
        </div>
        
        {fieldsTemplate.slice(0, 10).map(renderField)}

        <div className="section-header">
          <h4>Claim Details</h4>
        </div>
        
        {fieldsTemplate.slice(10).map(renderField)}
      </div>

      <div className="claimant-type-selector">
        <h4>Claimant Type</h4>
        <div className="type-options">
          {Object.entries(CLAIMANT_TYPES).map(([key, label]) => (
            <label key={key} className="type-option">
              <input
                type="radio"
                name="claimantType"
                value={key}
                checked={
                  (key === 'FDST' && fields.isScheduledTribe === 'Yes') ||
                  (key === 'OTFD' && fields.isOTFD === 'Yes')
                }
                onChange={() => {
                  if (key === 'FDST') {
                    handleFieldChange('isScheduledTribe', 'Yes');
                    handleFieldChange('isOTFD', 'No');
                  } else {
                    handleFieldChange('isScheduledTribe', 'No');
                    handleFieldChange('isOTFD', 'Yes');
                  }
                }}
              />
              <div className="type-info">
                <strong>{key}</strong>
                <span>{label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="evidence-validation">
        <h4>Evidence Validation</h4>
        <div className="validation-checklist">
          <div className="validation-item">
            <span className="validation-icon">
              {fields.evidence && fields.evidence.split(',').length >= 2 ? '✓' : '✗'}
            </span>
            <span>Minimum 2 evidences (Rule 13 requirement)</span>
          </div>
          <div className="validation-item">
            <span className="validation-icon">
              {fields.evidence && IDENTITY_DOCUMENTS.some(doc => 
                fields.evidence.toLowerCase().includes(doc.toLowerCase())
              ) ? '✓' : '✗'}
            </span>
            <span>At least one identity document present</span>
          </div>
          {fields.evidence && (
            <div className="evidence-categories">
              <h5>Evidence Categories:</h5>
              {fields.evidence.split(',').map((evidence, index) => (
                <div key={index} className="evidence-category">
                  <span className="evidence-text">{evidence.trim()}</span>
                  <span className="category-tag">
                    {FRAValidation.categorizeEvidence(evidence)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="extractor-actions">
        <button 
          className="save-button" 
          onClick={handleSave}
          disabled={isSaving || !hasUnsavedChanges}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default FieldExtractor;