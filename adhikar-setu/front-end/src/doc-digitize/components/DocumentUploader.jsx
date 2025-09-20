import React, { useCallback, useState, useEffect } from "react";
import { useOCR } from "../hooks/useOCR.js";

const DocumentUploader = ({
  onDocumentsProcessed,
  onFieldsExtracted,
  onDocumentsUploaded,
}) => {
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
    reprocessWithFormType,
  } = useOCR();

  console.log("OCR Results:", results);
  console.log("Extracted Fields:", extractedFields);
  console.log("Detected Form Type:", formType);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    async (e) => {
      e.preventDefault();
      setDragOver(false);

      const files = Array.from(e.dataTransfer.files).filter(
        (file) =>
          file.type.startsWith("image/") || file.type === "application/pdf"
      );

      if (files.length > 0) {
        setUploadedFiles(files);
        // Pass the files to parent component immediately
        if (onDocumentsUploaded) {
          onDocumentsUploaded(files);
        }
        await processDocuments(files);
      }
    },
    [processDocuments, onDocumentsUploaded]
  );

  const handleFileSelect = useCallback(
    async (e) => {
      const files = Array.from(e.target.files).filter(
        (file) =>
          file.type.startsWith("image/") || file.type === "application/pdf"
      );

      if (files.length > 0) {
        setUploadedFiles(files);
        // Pass the files to parent component immediately
        if (onDocumentsUploaded) {
          onDocumentsUploaded(files);
        }
        await processDocuments(files);
      }
    },
    [processDocuments, onDocumentsUploaded]
  );

  const handleFormTypeChange = useCallback(
    (newFormType) => {
      reprocessWithFormType(newFormType);
    },
    [reprocessWithFormType]
  );

  useEffect(() => {
    if (results.length > 0 && onDocumentsProcessed) {
      onDocumentsProcessed(results);
    }
  }, [results, onDocumentsProcessed]);

  useEffect(() => {
    if (Object.keys(extractedFields).length > 0 && onFieldsExtracted) {
      onFieldsExtracted(extractedFields, formType);
    }
  }, [extractedFields, formType, onFieldsExtracted]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 transition-all duration-200
          ${
            dragOver
              ? "border-emerald-400 bg-emerald-50"
              : "border-gray-300 hover:border-gray-400"
          }
          ${
            isProcessing
              ? "pointer-events-none opacity-75"
              : "cursor-pointer hover:bg-gray-50"
          }
        `}
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
          className="hidden"
          disabled={isProcessing}
        />

        <div className="text-center">
          {isProcessing ? (
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              </div>
              <p className="text-lg font-medium text-gray-900">
                Processing documents... {progress}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto text-gray-400">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14,2 14,8 20,8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10,9 9,9 8,9"></polyline>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Upload FRA Documents
                </h3>
                <p className="text-gray-600 mb-1">
                  Drag & drop your Form A, B, or C documents here
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Supports: Images (JPG, PNG) and PDF files
                </p>
                <label
                  htmlFor="file-input"
                  className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  Choose Files
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-800">
              <span className="font-medium">Error:</span> {error}
            </p>
          </div>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-lg font-medium text-gray-900 mb-3">
            Uploaded Files:
          </h4>
          <ul className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">{file.name}</span>
                </div>
                <span className="text-sm text-gray-500">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {formType && (
        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-lg font-medium text-gray-900 mb-3">
            Detected Form Type:
          </h4>
          <div className="flex space-x-2">
            {["FORM_A", "FORM_B", "FORM_C"].map((type) => (
              <button
                key={type}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  formType === type
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => handleFormTypeChange(type)}
              >
                {type.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-lg font-medium text-gray-900 mb-3">
            Processing Results:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {results.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium text-gray-900">
                  Page {result.pageNumber}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    result.success
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {result.success
                    ? `${result.confidence.toFixed(1)}% confidence`
                    : "Failed"}
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
