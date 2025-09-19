"use client";

import { useState } from "react";
import ClaimStatus from "./ClaimStatus.jsx";
import {
  FORM_A_FIELDS,
  FORM_B_FIELDS,
  FORM_C_FIELDS,
  FRA_FORM_TYPES,
} from "../constants/fraFields.js";

const ClaimDetail = ({ claim, onBack }) => {
  const [activeTab, setActiveTab] = useState("details");

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
    if (!value)
      return <span className="text-gray-400 italic">Not provided</span>;

    if (
      fieldKey === "familyMembers" ||
      fieldKey === "evidence" ||
      fieldKey === "additionalInfo"
    ) {
      return (
        <div className="space-y-1">
          {value.split("\n").map((line, index) => (
            <p key={index} className="text-gray-900">
              {line}
            </p>
          ))}
        </div>
      );
    }

    if (fieldKey === "isScheduledTribe" || fieldKey === "isOTFD") {
      return (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            value === "Yes"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {value === "Yes" ? "Yes" : "No"}
        </span>
      );
    }

    if (fieldKey.includes("extent") || fieldKey.includes("area")) {
      return (
        <span className="text-gray-900 font-medium">{value} hectares</span>
      );
    }

    return <span className="text-gray-900">{value}</span>;
  };

  const tabs = [
    { id: "details", label: "Claim Details", icon: "📋" },
    { id: "status", label: "Status", icon: "📊" },
    { id: "documents", label: "Documents", icon: "📄" },
    { id: "history", label: "History", icon: "🕒" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span>Back to Claims</span>
            </button>

            <div className="border-l border-gray-300 pl-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {String(claim.formType).replace("_", " ")} Claim
              </h1>
              <p className="text-gray-600 mt-1">
                Submitted on{" "}
                {claim.createdAt
                  ? new Date(claim.createdAt).toLocaleDateString("en-IN")
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "details" && (
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Claimant Name
                  </label>
                  {renderFieldValue(
                    "claimantName",
                    claim.fields && claim.fields.claimantName
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Village
                  </label>
                  {renderFieldValue(
                    "village",
                    claim.fields && claim.fields.village
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District
                  </label>
                  {renderFieldValue(
                    "district",
                    claim.fields && claim.fields.district
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gram Panchayat
                  </label>
                  {renderFieldValue(
                    "gramPanchayat",
                    claim.fields && claim.fields.gramPanchayat
                  )}
                </div>
              </div>
            </div>

            {/* All Extracted Fields */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                All Extracted Fields
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getFieldsTemplate().map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {renderFieldValue(
                        field.key,
                        claim.fields && claim.fields[field.key]
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "status" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <ClaimStatus status={claim.status} updatedAt={claim.updatedAt} />
          </div>
        )}

        {activeTab === "documents" && (
          <div className="space-y-6">
            {/* Uploaded Documents */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Uploaded Documents
              </h3>
              {claim.documents && claim.documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {claim.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        {doc.type && doc.type.startsWith("image/") ? (
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5 text-blue-600"
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
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {doc.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Size: {(doc.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <p className="text-xs text-gray-400">
                          Type: {doc.type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg
                    className="w-12 h-12 text-gray-400 mx-auto mb-4"
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
                  <p className="text-gray-500">No documents available</p>
                </div>
              )}
            </div>

            {/* OCR Results */}
            {claim.ocrResults && claim.ocrResults.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  OCR Processing Results
                </h3>
                <div className="space-y-4">
                  {claim.ocrResults.map((result, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-gray-900">
                          Page {result.pageNumber}
                        </h4>
                        <div className="flex space-x-4 text-sm">
                          <span className="text-gray-600">
                            Confidence:{" "}
                            <span className="font-medium">
                              {result.confidence
                                ? result.confidence.toFixed(1)
                                : "0"}
                              %
                            </span>
                          </span>
                          <span
                            className={`font-medium ${
                              result.success ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {result.success ? "Success" : "Failed"}
                          </span>
                        </div>
                      </div>
                      {result.text && (
                        <details className="mt-3">
                          <summary className="cursor-pointer text-sm text-emerald-600 hover:text-emerald-700">
                            View Extracted Text
                          </summary>
                          <pre className="mt-2 p-3 bg-gray-50 rounded text-xs text-gray-700 whitespace-pre-wrap">
                            {result.text}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Claim History
            </h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Claim Submitted</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Submitted on{" "}
                    {claim.createdAt
                      ? new Date(claim.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>

              {claim.updatedAt && claim.updatedAt !== claim.createdAt && (
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
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
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      Status Updated
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Last updated on{" "}
                      {claim.updatedAt
                        ? new Date(claim.updatedAt).toLocaleDateString(
                            "en-IN",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "N/A"}
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
