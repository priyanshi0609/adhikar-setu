import React from "react";

export default function SchemeModal({ scheme, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-2">{scheme.name}</h2>
        <p className="text-gray-700 mb-4">{scheme.description}</p>

        <h4 className="font-semibold">Eligibility:</h4>
        <p className="text-sm text-gray-600 mb-2">{scheme.eligibility}</p>

        <h4 className="font-semibold">Benefits:</h4>
        <p className="text-sm text-gray-600 mb-2">{scheme.benefits}</p>

        <h4 className="font-semibold">Documents Required:</h4>
        <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
          {scheme.documents.map((doc, idx) => (
            <li key={idx}>{doc}</li>
          ))}
        </ul>

        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
