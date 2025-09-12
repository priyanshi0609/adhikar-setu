import React from "react";

export default function BeneficiaryList({ beneficiaries, onSelect }) {
  if (!beneficiaries.length) return <p className="mt-4 text-gray-600">No beneficiaries found.</p>;

  return (
    <div className="mt-6 bg-white p-4 rounded-xl shadow">
      <h3 className="font-bold mb-3">Beneficiaries</h3>
      <ul className="space-y-2">
        {beneficiaries.map((b) => (
          <li
            key={b.id}
            onClick={() => onSelect(b)}
            className="cursor-pointer p-2 rounded-lg hover:bg-gray-100"
          >
            <span className="font-medium">{b.name}</span> — {b.type}
          </li>
        ))}
      </ul>
    </div>
  );
}
