import React from "react";

const TextExtracted = ({
  extractedText,
  extractedFields,
  formType,
  onFieldUpdate,
}) => {
  if (!extractedText && Object.keys(extractedFields).length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Extracted Content
      </h3>

      {/* Extracted Fields Form */}
      {Object.keys(extractedFields).length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-3">
            Extracted Fields ({formType})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(extractedFields).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                </label>
                <input
                  type="text"
                  value={value || ""}
                  onChange={(e) => onFieldUpdate(key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder={`Enter ${key
                    .replace(/([A-Z])/g, " $1")
                    .toLowerCase()}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw Extracted Text */}
      {extractedText && (
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-3">
            Raw Extracted Text
          </h4>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap break-words">
              {extractedText}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextExtracted;
