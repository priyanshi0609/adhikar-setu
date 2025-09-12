import React from "react";

export default function BeneficiaryModal({ beneficiary, schemes, onClose }) {
  if (!beneficiary) return null;

  // Simple eligibility logic (mocked)
  const checkEligibility = (scheme, b) => {
    switch (scheme.id) {
      case "pm-kisan":
        return b.landSize <= 2 && b.hasFRA;
      case "mgnrega":
        return b.hasJobCard;
      case "pmay":
        return !b.hasHouse && b.hasFRA;
      case "jjm":
        return b.hasFRA;
      case "pm-juga":
        return true; // assume eligible if in tribal area
      case "pmjay":
        return b.isBPL;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <h2 className="text-xl font-bold mb-2">{beneficiary.name}</h2>
        <p className="text-sm text-gray-600 mb-4">
          {beneficiary.state}, {beneficiary.district}, {beneficiary.village} —{" "}
          {beneficiary.type}
        </p>

        <h3 className="font-semibold mb-2">Eligibility Results:</h3>
        <ul className="space-y-1 text-sm">
          {schemes.map((scheme) => (
            <li key={scheme.id}>
              <span className="font-medium">{scheme.name}:</span>{" "}
              {checkEligibility(scheme, beneficiary) ? (
                <span className="text-green-600">Eligible</span>
              ) : (
                <span className="text-red-600">Not Eligible</span>
              )}
            </li>
          ))}
        </ul>

        <button
          onClick={onClose}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
