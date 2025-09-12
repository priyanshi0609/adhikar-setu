import React, { useState } from "react";

const FilterBar = ({ beneficiaries, onFilterChange }) => {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [village, setVillage] = useState("");
  const [beneficiary, setBeneficiary] = useState("");

  // Extract options dynamically from beneficiaries.json
  const states = [...new Set(beneficiaries.map((b) => b.state))];

  const districtsData =
    state !== ""
      ? [...new Set(beneficiaries.filter((b) => b.state === state).map((b) => b.district))]
      : [];

  const villagesData =
    district !== ""
      ? [...new Set(beneficiaries.filter((b) => b.district === district).map((b) => b.village))]
      : [];

  const beneficiaryTypes =
    village !== ""
      ? [...new Set(beneficiaries.filter((b) => b.village === village).map((b) => b.type))]
      : [];

  // Handle filter change
  const handleChange = (updated = {}) => {
    const newFilters = {
      state,
      district,
      village,
      beneficiary,
      ...updated,
    };

    // Find the selected person from beneficiaries.json
    const person = beneficiaries.find(
      (b) =>
        b.state === newFilters.state &&
        b.district === newFilters.district &&
        b.village === newFilters.village &&
        b.type === newFilters.beneficiary
    );

    onFilterChange({ ...newFilters, person: person || null });
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
          setBeneficiary("");
          handleChange({ state: e.target.value, district: "", village: "", beneficiary: "" });
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
          setBeneficiary("");
          handleChange({ district: e.target.value, village: "", beneficiary: "" });
        }}
        disabled={!state}
      >
        <option value="">Select District</option>
        {districtsData.map((d) => (
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
          setBeneficiary("");
          handleChange({ village: e.target.value, beneficiary: "" });
        }}
        disabled={!district}
      >
        <option value="">Select Village</option>
        {villagesData.map((v) => (
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
          handleChange({ beneficiary: e.target.value });
        }}
        disabled={!village}
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
