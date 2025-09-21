import React, { useState, useEffect } from "react";
import {
  FORM_A_FIELDS,
  FORM_B_FIELDS,
  FORM_C_FIELDS,
  FRA_FORM_TYPES,
  CLAIMANT_TYPES,
} from "../constants/fraFields.js";
import { FRAValidation } from "../utils/fraValidation.js";

const FieldExtractor = ({
  extractedFields,
  formType,
  onFieldChange,
  onSave,
  isSaving,
}) => {
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

    if (fieldKey === "area") {
      const validation = FRAValidation.validateLandArea(value);
      setValidationResults((prev) => ({
        ...prev,
        [fieldKey]: validation,
      }));
    }
  };

  const handleSave = async () => {
    const validationReport = FRAValidation.generateValidationReport({
      ...fields,
      evidenceList: fields.evidence
        ? fields.evidence.split(",").map((e) => e.trim())
        : [],
      area: fields.extentForHabitation || fields.extentForCultivation,
      occupationDates: [],
    });

    if (
      validationReport.overall.valid ||
      validationReport.overall.warnings.length === 0
    ) {
      if (onSave) {
        await onSave(fields);
        setHasUnsavedChanges(false);
      }
    } else {
      alert(
        "Please fix validation errors before saving:\n" +
          validationReport.overall.errors.join("\n")
      );
    }
  };

  const renderField = (field) => {
    const value = fields[field.key] || "";
    const validation = validationResults[field.key];

    if (field.key === "isScheduledTribe" || field.key === "isOTFD") {
      return (
        <div key={field.key} className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="flex space-x-6">
            <label className="flex items-center">
              <input
                type="radio"
                name={field.key}
                value="Yes"
                checked={value === "Yes"}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Yes</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name={field.key}
                value="No"
                checked={value === "No"}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">No</span>
            </label>
          </div>
          {validation && !validation.valid && (
            <p className="text-sm text-red-600">{validation.message}</p>
          )}
        </div>
      );
    }

    if (
      field.key === "familyMembers" ||
      field.key === "evidence" ||
      field.key === "additionalInfo"
    ) {
      return (
        <div key={field.key} className="space-y-2">
          <label
            htmlFor={field.key}
            className="block text-sm font-medium text-gray-700"
          >
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            id={field.key}
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
            rows={4}
            placeholder={`Enter ${field.label.toLowerCase()}...`}
          />
          {field.key === "evidence" && (
            <p className="text-xs text-gray-500">
              List all evidence as per Rule 13. Separate multiple items with
              commas.
            </p>
          )}
          {validation && !validation.valid && (
            <p className="text-sm text-red-600">{validation.message}</p>
          )}
        </div>
      );
    }

    return (
      <div key={field.key} className="space-y-2">
        <label
          htmlFor={field.key}
          className="block text-sm font-medium text-gray-700"
        >
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          id={field.key}
          type={
            field.key.includes("extent") || field.key.includes("area")
              ? "number"
              : "text"
          }
          value={value}
          onChange={(e) => handleFieldChange(field.key, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          placeholder={`Enter ${field.label.toLowerCase()}...`}
          step={
            field.key.includes("extent") || field.key.includes("area")
              ? "0.01"
              : undefined
          }
        />
        {field.key.includes("extent") && (
          <p className="text-xs text-gray-500">
            Area in hectares (max 4.0 hectares as per FRA)
          </p>
        )}
        {validation && !validation.valid && (
          <p className="text-sm text-red-600">{validation.message}</p>
        )}
      </div>
    );
  };

  const fieldsTemplate = getFieldsTemplate();

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Extracted Fields
          </h3>
          <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
            {formType?.replace("_", " ") || "Unknown Form"}
          </span>
        </div>
        {hasUnsavedChanges && (
          <div className="flex items-center space-x-2 text-amber-600">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Unsaved changes</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-8">
        <div>
          <h4 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Personal Information
          </h4>
          <div className="space-y-6">
            {fieldsTemplate.slice(0, 10).map(renderField)}
          </div>
        </div>

        <div>
          <h4 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Claim Details
          </h4>
          <div className="space-y-6">
            {fieldsTemplate.slice(10).map(renderField)}
          </div>
        </div>

        <div>
          <h4 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Claimant Type
          </h4>
          <div className="space-y-3">
            {Object.entries(CLAIMANT_TYPES).map(([key, label]) => (
              <label
                key={key}
                className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="radio"
                  name="claimantType"
                  value={key}
                  checked={
                    (key === "FDST" && fields.isScheduledTribe === "Yes") ||
                    (key === "OTFD" && fields.isOTFD === "Yes")
                  }
                  onChange={() => {
                    if (key === "FDST") {
                      handleFieldChange("isScheduledTribe", "Yes");
                      handleFieldChange("isOTFD", "No");
                    } else {
                      handleFieldChange("isScheduledTribe", "No");
                      handleFieldChange("isOTFD", "Yes");
                    }
                  }}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 mt-0.5"
                />
                <div>
                  <div className="font-medium text-gray-900">{key}</div>
                  <div className="text-sm text-gray-600">{label}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Evidence Validation
          </h4>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      fields.evidence && fields.evidence.split(",").length >= 2
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {fields.evidence && fields.evidence.split(",").length >= 2
                      ? "✓"
                      : "✗"}
                  </div>
                  <span className="text-sm text-gray-700">
                    Minimum 2 evidences (Rule 13 requirement)
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      fields.evidence &&
                      ["ration card", "voter id", "aadhar", "passport"].some(
                        (doc) => fields.evidence.toLowerCase().includes(doc)
                      )
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {fields.evidence &&
                    ["ration card", "voter id", "aadhar", "passport"].some(
                      (doc) => fields.evidence.toLowerCase().includes(doc)
                    )
                      ? "✓"
                      : "✗"}
                  </div>
                  <span className="text-sm text-gray-700">
                    At least one identity document present
                  </span>
                </div>
              </div>
            </div>

            {fields.evidence && (
              <div>
                <h5 className="text-sm font-medium text-gray-900 mb-2">
                  Evidence Categories:
                </h5>
                <div className="space-y-2">
                  {fields.evidence.split(",").map((evidence, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded"
                    >
                      <span className="text-sm text-gray-900">
                        {evidence.trim()}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {FRAValidation.categorizeEvidence
                          ? FRAValidation.categorizeEvidence(evidence)
                          : "Document"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-gray-200 bg-white">
        <button
          onClick={handleSave}
          // disabled={isSaving || !hasUnsavedChanges}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default FieldExtractor;
