import React from 'react';

type Role =
    | 'gram_sabha'
    | 'frc'
    | 'revenue_officer'
    | 'sdlc'
    | 'dlc'
    | 'slmc'
    | 'mota'
    | 'ngo'
    | 'researcher'
    | 'public';

interface RoleSelectionProps {
    selectedRole: Role | null;
    onRoleSelect: (role: Role) => void;
    language: 'en' | 'hi';
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ selectedRole, onRoleSelect, language }) => {
    const roles: { id: Role; name: string; subtitle: string }[] = [
        {
            id: 'gram_sabha',
            name: language === 'hi' ? 'ग्राम सभा / दावेदार' : 'Gram Sabha / Claimant',
            subtitle: language === 'hi' ? 'गांव स्तर' : 'Village Level',
        },
        {
            id: 'frc',
            name: language === 'hi' ? 'वन अधिकार समिति' : 'Forest Rights Committee',
            subtitle: language === 'hi' ? 'FRC सदस्य' : 'FRC Member',
        },
        {
            id: 'revenue_officer',
            name: language === 'hi' ? 'राजस्व अधिकारी' : 'Revenue Officer',
            subtitle: language === 'hi' ? 'तहसील स्तर' : 'Tehsil Level',
        },
        {
            id: 'sdlc',
            name: language === 'hi' ? 'उप-मंडल समिति' : 'Sub-Divisional Committee',
            subtitle: language === 'hi' ? 'SDLC सदस्य' : 'SDLC Member',
        },
        {
            id: 'dlc',
            name: language === 'hi' ? 'जिला स्तरीय समिति' : 'District Level Committee',
            subtitle: language === 'hi' ? 'DLC / कलेक्टर' : 'DLC / Collector',
        },
        {
            id: 'slmc',
            name: language === 'hi' ? 'राज्य स्तरीय निगरानी समिति' : 'State Level Monitoring Committee',
            subtitle: language === 'hi' ? 'SLMC' : 'SLMC',
        },
        {
            id: 'mota',
            name: language === 'hi' ? 'जनजातीय कार्य मंत्रालय' : 'Ministry of Tribal Affairs',
            subtitle: language === 'hi' ? 'MoTA (नोडल)' : 'MoTA (Nodal)',
        },
        {
            id: 'ngo',
            name: language === 'hi' ? 'एनजीओ / अनुसंधानकर्ता' : 'NGO / Researcher',
            subtitle: language === 'hi' ? 'बाहरी हितधारक' : 'External Stakeholder',
        },
        {
            id: 'public',
            name: language === 'hi' ? 'सार्वजनिक दृश्य' : 'Public View',
            subtitle: language === 'hi' ? 'लॉगिन आवश्यक नहीं' : 'No Login Required',
        },
    ];

    return (
        <div>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {language === 'hi'
                        ? 'आप किस विभाग से संबंधित हैं?'
                        : 'Which department do you belong to?'}
                </h2>
                <p className="text-gray-600 text-sm">
                    {language === 'hi' ? 'कृपया अपनी भूमिका चुनें' : 'Please select your role'}
                </p>
            </div>

            <div className="space-y-3">
                {roles.map((role) => (
                    <button
                        key={role.id}
                        onClick={() => onRoleSelect(role.id)}
                        className={`w-full p-4 border-2 rounded-lg text-left transition-all duration-200 ${selectedRole === role.id
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                            }`}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-gray-800">{role.name}</h3>
                                <p className="text-sm text-gray-600">{role.subtitle}</p>
                            </div>
                            <div
                                className={`w-4 h-4 rounded-full border-2 ${selectedRole === role.id
                                    ? 'border-green-600 bg-green-600'
                                    : 'border-gray-300'
                                    }`}
                            >
                                {selectedRole === role.id && (
                                    <div className="w-full h-full rounded-full bg-green-600"></div>
                                )}
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* MVP Note */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                    <span className="font-semibold">
                        {language === 'hi' ? 'MVP के लिए:' : 'For MVP:'}
                    </span>{' '}
                    {language === 'hi'
                        ? 'हम Firebase role-based लॉगिन का उपयोग कर रहे हैं। उत्पादन में, ये NIC SSO (सरकारी अधिकारियों के लिए) और Aadhaar e-KYC (ग्राम सभा दावेदारों के लिए) के साथ एकीकृत होंगे।'
                        : 'We are using Firebase role-based login. In production, these will integrate with NIC SSO (govt officers) and Aadhaar e-KYC (Gram Sabha claimants).'}
                </p>
            </div>
        </div>
    );
};

export default RoleSelection;
