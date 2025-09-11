import React, { useState } from "react";

const FilterBar = ({ onFilterChange }) => {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [village, setVillage] = useState("");
  const [beneficiary, setBeneficiary] = useState("");

  // Example dummy data (you can fetch from API later)
  const states = ["Madhya Pradesh", "Chhattisgarh", "Odisha"];
  const districtsData = {
    "Madhya Pradesh": ["Bhopal", "Indore"],
    Chhattisgarh: ["Raipur", "Bilaspur"],
    Odisha: ["Cuttack", "Puri"],
  };
  const villagesData = {
    Bhopal: ["Village A", "Village B"],
    Indore: ["Village C", "Village D"],
    Raipur: ["Village E", "Village F"],
    Bilaspur: ["Village G", "Village H"],
    Cuttack: ["Village I", "Village J"],
    Puri: ["Village K", "Village L"],
  };
  const beneficiaryTypes = ["Individual", "Community", "Tribal Group"];

  // Handle filter change
  const handleChange = () => {
    onFilterChange({ state, district, village, beneficiary });
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex flex-wrap gap-4 items-center">
      {/* State Dropdown */}
      <select
        className="border rounded-lg p-2"
        value={state}
        onChange={(e) => {
          setState(e.target.value);
          setDistrict("");
          setVillage("");
          handleChange();
        }}
      >
        <option value="">Select State</option>
        {states.map((st) => (
          <option key={st} value={st}>
            {st}
          </option>
        ))}
      </select>

      {/* District Dropdown */}
      <select
        className="border rounded-lg p-2"
        value={district}
        onChange={(e) => {
          setDistrict(e.target.value);
          setVillage("");
          handleChange();
        }}
        disabled={!state}
      >
        <option value="">Select District</option>
        {state &&
          districtsData[state].map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
      </select>

      {/* Village Dropdown */}
      <select
        className="border rounded-lg p-2"
        value={village}
        onChange={(e) => {
          setVillage(e.target.value);
          handleChange();
        }}
        disabled={!district}
      >
        <option value="">Select Village</option>
        {district &&
          villagesData[district].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
      </select>

      {/* Beneficiary Dropdown */}
      <select
        className="border rounded-lg p-2"
        value={beneficiary}
        onChange={(e) => {
          setBeneficiary(e.target.value);
          handleChange();
        }}
      >
        <option value="">Select Beneficiary Type</option>
        {beneficiaryTypes.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterBar;
