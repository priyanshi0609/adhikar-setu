import React from "react";

const SchemeModal = ({ scheme, onClose }) => {
  if (!scheme) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full p-6 relative">
        
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Scheme Name */}
        <h2 className="text-2xl font-bold mb-4">{scheme.name}</h2>

        {/* Description */}
        <p className="text-gray-700 mb-4">{scheme.description}</p>

        {/* Eligibility */}
        <h3 className="text-lg font-semibold mb-2">Eligibility:</h3>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          {scheme.eligibility.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>

        {/* Benefits */}
        <h3 className="text-lg font-semibold mb-2">Benefits:</h3>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          {scheme.benefits.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>

        {/* Documents */}
        <h3 className="text-lg font-semibold mb-2">Required Documents:</h3>
        <ul className="list-disc list-inside text-gray-600">
          {scheme.documents.map((doc, idx) => (
            <li key={idx}>{doc}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SchemeModal;
