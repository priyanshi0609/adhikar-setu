import React from "react";

export default function SchemeCard({ scheme, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition"
    >
      <h3 className="text-lg font-bold">{scheme.name}</h3>
      <p className="text-sm text-gray-600 mt-2">{scheme.description}</p>
    </div>
  );
}
