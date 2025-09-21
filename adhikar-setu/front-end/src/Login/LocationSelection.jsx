import React from "react";

const LocationSelection = ({ formData, updateFormData }) => {
  const { role, language, state, district, village } = formData;

  // Mock data for MVP - replace with Firebase collections
  const states = [
    { id: "mp", name: language === "hi" ? "मध्य प्रदेश" : "Madhya Pradesh" },
    { id: "od", name: language === "hi" ? "ओडिशा" : "Odisha" },
    { id: "tr", name: language === "hi" ? "त्रिपुरा" : "Tripura" },
    { id: "tg", name: language === "hi" ? "तेलंगाना" : "Telangana" },
  ];

  const getDistricts = (stateId) => {
    const districtData = {
      mp: ["Bastar", "Dantewada", "Jagdalpur", "Kanker", "Kondagaon"],
      od: ["Koraput", "Malkangiri", "Nabarangpur", "Rayagada", "Kalahandi"],
      tr: ["Dhalai", "Gomati", "Khowai", "North Tripura", "South Tripura"],
      tg: [
        "Adilabad",
        "Bhadradri",
        "Jayashankar",
        "Komaram Bheem",
        "Mancherial",
      ],
    };
    return districtData[stateId] || [];
  };

  const getVillages = (districtName) => {
    // Mock villages - replace with Firestore query
    const villageData = {
      Bastar: ["Jagdalpur", "Tokapal", "Bakawand", "Lohandiguda"],
      Dantewada: ["Dantewada", "Geedam", "Kuakonda", "Barsoor"],
      Koraput: ["Koraput", "Jeypore", "Kotpad", "Kundra"],
      Dhalai: ["Ambassa", "Kamalpur", "Longtharai", "Gandacherra"],
    };
    return villageData[districtName] || [];
  };

  const needsVillage = ["gram_sabha", "frc", "revenue_officer"].includes(role);
  const needsDistrict = ![
    "slmc",
    "mota",
    "ngo",
    "researcher",
    "public",
  ].includes(role);
  const needsState = !["slmc", "mota", "ngo", "researcher", "public"].includes(
    role
  );

  const getLocationNote = () => {
    if (needsVillage) {
      return language === "hi"
        ? "उत्पादन में, गांव Aadhaar/ग्राम सभा पंजीकरण से स्वत: मैप होगा। MVP के लिए, हम मैन्युअल रूप से पूछते हैं।"
        : "In production, village is auto-mapped from Aadhaar/Gram Sabha registration. For MVP, we ask manually.";
    } else if (needsDistrict) {
      return language === "hi"
        ? "उत्पादन में, जिला क्षेत्राधिकार HRMS/NIC DB में अधिकारी की पोस्टिंग से आएगा। MVP के लिए, हम मैन्युअल रूप से पूछते हैं।"
        : "In production, district jurisdiction will come from officer's posting in HRMS/NIC DB. For MVP, we ask manually.";
    } else {
      return language === "hi"
        ? "उत्पादन में, राज्य/जिला NIC SSO निर्देशिका या Aadhaar गांव मैपिंग से स्वत: समाधान होगा। MVP में, हम मैन्युअल रूप से पूछते हैं।"
        : "In production, state/district will be auto-resolved from NIC SSO directory or Aadhaar village mapping. In MVP, we ask manually.";
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">
                {language === "hi" ? "नोट:" : "Note:"}
              </span>{" "}
              {getLocationNote()}
            </p>
          </div>
          {language === "hi" ? "अपना स्थान चुनें" : "Select Your Location"}
        </h2>
        <p className="text-gray-600 text-sm">
          {language === "hi"
            ? "कृपया अपनी कार्य स्थिति बताएं"
            : "Please provide your work location"}
        </p>
      </div>

      <div className="space-y-6">
        {/* State Selection */}
        {needsState && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === "hi" ? "राज्य" : "State"}
            </label>
            <div className="space-y-2">
              {states.map((stateOption) => (
                <button
                  key={stateOption.id}
                  onClick={() => {
                    updateFormData("state", stateOption.id);
                    updateFormData("district", null);
                    updateFormData("village", null);
                  }}
                  className={`w-full p-3 border-2 rounded-lg text-left transition-all duration-200 ${
                    state === stateOption.id
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{stateOption.name}</span>
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        state === stateOption.id
                          ? "border-green-600 bg-green-600"
                          : "border-gray-300"
                      }`}
                    >
                      {state === stateOption.id && (
                        <div className="w-full h-full rounded-full bg-green-600"></div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* District Selection */}
        {needsDistrict && state && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === "hi" ? "जिला" : "District"}
            </label>
            <div className="space-y-2">
              {getDistricts(state).map((districtOption) => (
                <button
                  key={districtOption}
                  onClick={() => {
                    updateFormData("district", districtOption);
                    updateFormData("village", null);
                  }}
                  className={`w-full p-3 border-2 rounded-lg text-left transition-all duration-200 ${
                    district === districtOption
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{districtOption}</span>
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        district === districtOption
                          ? "border-green-600 bg-green-600"
                          : "border-gray-300"
                      }`}
                    >
                      {district === districtOption && (
                        <div className="w-full h-full rounded-full bg-green-600"></div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Village Selection */}
        {needsVillage && district && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === "hi" ? "गांव" : "Village"}
            </label>
            <div className="space-y-2">
              {getVillages(district).map((villageOption) => (
                <button
                  key={villageOption}
                  onClick={() => updateFormData("village", villageOption)}
                  className={`w-full p-3 border-2 rounded-lg text-left transition-all duration-200 ${
                    village === villageOption
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{villageOption}</span>
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        village === villageOption
                          ? "border-green-600 bg-green-600"
                          : "border-gray-300"
                      }`}
                    >
                      {village === villageOption && (
                        <div className="w-full h-full rounded-full bg-green-600"></div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Location Note */}
    </div>
  );
};

export default LocationSelection;
