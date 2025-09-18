import React from "react";

const LanguageSelection = ({ selectedLanguage, onLanguageSelect, role }) => {
  const languages = [
    {
      code: "hi",
      name: "हिंदी",
      englishName: "Hindi",
    },
    {
      code: "en",
      name: "English",
      englishName: "English",
    },
  ];

  const getRoleNote = () => {
    const notes = {
      gram_sabha: {
        hi: "उत्पादन में, claimants Aadhaar OTP के माध्यम से लॉग इन करेंगे और सिस्टम उन्हें उनके गांव से स्वचालित रूप से मैप करेगा।",
        en: "In production, claimants will log in via Aadhaar OTP and system will auto-map to their village.",
      },
      frc: {
        hi: "उत्पादन में, FRC लॉगिन राज्य जनजातीय विभाग द्वारा जारी किया जाएगा।",
        en: "In production, FRC login will be issued by State Tribal Dept.",
      },
      revenue_officer: {
        hi: "उत्पादन में, लॉगिन अधिकारी के क्षेत्राधिकार से मैप किया गया NIC SSO होगा।",
        en: "In production, login will be NIC SSO mapped to officer's jurisdiction.",
      },
      sdlc: {
        hi: "उत्पादन में, जिला अधिकारी पोस्टिंग से स्वत: हल हो जाएगा।",
        en: "In production, district will be auto-resolved from officer posting.",
      },
      dlc: {
        hi: "उत्पादन में, केवल Collector/Deputy Commissioner NIC ID डिजिटल रूप से साइन कर सकता है।",
        en: "In production, only Collector/Deputy Commissioner NIC ID can sign digitally.",
      },
      slmc: {
        hi: "उत्पादन में, SLMC लॉगिन केवल पढ़ने की अनुमति के साथ MoTA NIC IDs होंगे।",
        en: "In production, SLMC logins will be MoTA NIC IDs with read-only permissions.",
      },
      mota: {
        hi: "उत्पादन में, SLMC लॉगिन केवल पढ़ने की अनुमति के साथ MoTA NIC IDs होंगे।",
        en: "In production, SLMC logins will be MoTA NIC IDs with read-only permissions.",
      },
      ngo: {
        hi: "उत्पादन में, डेटासेट पहुंच DTO/MoTA अनुमोदन के माध्यम से अनुरोध-आधारित होगी।",
        en: "In production, dataset access will be request-based via DTO/MoTA approval.",
      },
      public: {
        hi: "उत्पादन में, कोई व्यक्तिगत दावा डेटा उजागर नहीं किया जाएगा, केवल एकत्रित मैप्स/आंकड़े।",
        en: "In production, no personal claim data will be exposed, only aggregated maps/statistics.",
      },
    };

    return notes[role] || { hi: "", en: "" };
  };

  const roleNote = getRoleNote();

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {roleNote.hi && roleNote.en && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">
                  {selectedLanguage === "hi" ? "नोट:" : "Note:"}
                </span>{" "}
                {selectedLanguage === "hi" ? roleNote.hi : roleNote.en}
              </p>
            </div>
          )}

          {/* Multilingual Note */}
          <div className="mb-4 mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">
                {selectedLanguage === "hi" ? "भविष्य में:" : "Coming Soon:"}
              </span>{" "}
              {selectedLanguage === "hi"
                ? "उत्पादन में बहुभाषी समर्थन अन्य जनजातीय भाषाओं में विस्तारित किया जाएगा।"
                : "Multilingual support will be expanded to other tribal languages in production."}
            </p>
          </div>

          {selectedLanguage === "hi"
            ? "आप कौन सी भाषा पसंद करते हैं?"
            : "Which language do you prefer?"}
        </h2>
        <p className="text-gray-600 text-sm">
          {selectedLanguage === "hi"
            ? "कृपया अपनी भाषा चुनें"
            : "Please select your language preference"}
        </p>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => onLanguageSelect(language.code)}
            className={`w-full p-6 border-2 rounded-lg text-center transition-all duration-200 ${
              selectedLanguage === language.code
                ? "border-green-600 bg-green-50"
                : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-xl font-semibold text-gray-800">
                  {language.name}
                </h3>
                <p className="text-sm text-gray-600">{language.englishName}</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 ${
                  selectedLanguage === language.code
                    ? "border-green-600 bg-green-600"
                    : "border-gray-300"
                }`}
              >
                {selectedLanguage === language.code && (
                  <div className="w-full h-full rounded-full bg-green-600"></div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Role-specific Note */}
    </div>
  );
};

export default LanguageSelection;
