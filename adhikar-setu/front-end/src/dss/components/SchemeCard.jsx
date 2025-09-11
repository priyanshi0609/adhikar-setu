import React from "react";

const SchemeCard = ({ scheme, onClick }) => {
  return (
    <div
      className="bg-white p-5 rounded-2xl shadow hover:shadow-lg cursor-pointer transition"
      onClick={onClick}
    >
      <h2 className="text-xl font-semibold mb-2">{scheme.name}</h2>
      <p className="text-gray-600 text-sm line-clamp-3">
        {scheme.description}
      </p>
      <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
        View Details
      </button>
    </div>
  );
};

export default SchemeCard;
