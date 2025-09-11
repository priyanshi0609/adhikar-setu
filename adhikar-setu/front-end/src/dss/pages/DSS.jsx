import React, { useState, useEffect } from "react";
import SchemeCard from "../components/SchemeCard";
import SchemeModal from "../components/SchemeModal";
import FilterBar from "../components/FilterBar";
import EligibilityTable from "../components/Eligliblity";
import beneficiaries from "../data/beneficiaries.json";
import { checkEligibility } from "../utils/ruleEngine";

const DSS = () => {
  const [ruleset, setRuleset] = useState([]); // load dynamically
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [eligibilityResults, setEligibilityResults] = useState([]);

  // Load ruleset.json from public folder
  useEffect(() => {
    fetch("/ruleset.json")
      .then((res) => res.json())
      .then((data) => setRuleset(data))
      .catch((err) => console.error("Error loading ruleset:", err));
  }, []);

  // When user selects a person → check eligibility
  useEffect(() => {
    if (selectedPerson && ruleset.length > 0) {
      const results = ruleset.map((scheme) =>
        checkEligibility(scheme, selectedPerson)
      );
      setEligibilityResults(results);
    }
  }, [selectedPerson, ruleset]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Decision Support System (DSS)</h1>

      {/* Scheme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ruleset.map((scheme) => (
          <SchemeCard
            key={scheme.id}
            scheme={scheme}
            onClick={() => setSelectedScheme(scheme)}
          />
        ))}
      </div>

      {/* Modal */}
      {selectedScheme && (
        <SchemeModal
          scheme={selectedScheme}
          onClose={() => setSelectedScheme(null)}
        />
      )}

      {/* Filters */}
      <div className="mt-10">
        <FilterBar
          beneficiaries={beneficiaries}
          onVillageSelect={setSelectedVillage}
          onPersonSelect={setSelectedPerson}
        />
      </div>

      {/* Eligibility Results */}
      {selectedPerson && (
        <div className="mt-6">
          <EligibilityTable
            person={selectedPerson}
            eligibilityResults={eligibilityResults}
          />
        </div>
      )}
    </div>
  );
};

export default DSS;
