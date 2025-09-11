// src/components/EligibilityTable.jsx
import React from "react";

const EligibilityTable = ({ person, eligibilityResults }) => {
  if (!person) return null;

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">Eligibility for: {person.name}</h3>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Scheme</th>
            <th className="py-2">Eligible</th>
            <th className="py-2">Details / Reasons</th>
          </tr>
        </thead>
        <tbody>
          {eligibilityResults && eligibilityResults.length > 0 ? (
            eligibilityResults.map((r) => (
              <tr key={r.id} className="border-b">
                <td className="py-3 font-medium">{r.name}</td>
                <td className="py-3">
                  {r.eligible ? (
                    <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800">YES</span>
                  ) : (
                    <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-800">NO</span>
                  )}
                </td>
                <td className="py-3">
                  {r.eligible ? (
                    <>
                      {r.notes.length > 0 && (
                        <div className="text-gray-700">
                          <strong>Notes:</strong>
                          <ul className="list-disc ml-5">
                            {r.notes.map((n, i) => (
                              <li key={i}>{n}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {r.benefit && <div className="mt-2 text-gray-700"><strong>Benefit:</strong> {r.benefit}</div>}
                    </>
                  ) : (
                    <div className="text-gray-700">
                      <strong>Not eligible because:</strong>
                      <ul className="list-disc ml-5">
                        {r.reasons.map((reason, idx) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="py-4 text-center text-gray-500">
                No results to show.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EligibilityTable;
