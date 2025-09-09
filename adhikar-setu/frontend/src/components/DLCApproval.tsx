import React, { useState } from 'react';
import { Award, FileText, Stamp, Download, CheckCircle, Lock, User, MapPin } from 'lucide-react';


interface DLCApprovalProps {
  user: User;
  language: 'en' | 'hi';
}

const DLCApproval: React.FC<DLCApprovalProps> = ({ user, language }) => {
  const [selectedClaim, setSelectedClaim] = useState('CLM-2024-001');
  const [annexureType, setAnnexureType] = useState('annexure-ii');
  const [isLocked, setIsLocked] = useState(false);

  const claimsForApproval = [
    {
      id: 'CLM-2024-001',
      claimant: 'Ram Singh',
      village: 'Jagdalpur',
      area: '2.5 Ha',
      type: 'Individual Forest Rights',
      status: 'ready_for_approval',
      submittedDate: '2024-01-15',
      lastAction: 'SDLC Verified'
    },
    {
      id: 'CLM-2024-002',
      claimant: 'Village Community',
      village: 'Kondagaon',
      area: '15.8 Ha',
      type: 'Community Forest Rights',
      status: 'ready_for_approval',
      submittedDate: '2024-01-12',
      lastAction: 'SDLC Verified'
    }
  ];

  const annexureTemplates = [
    {
      id: 'annexure-ii',
      name: language === 'en' ? 'Annexure II - Individual Forest Rights' : 'अनुलग्नक II - व्यक्तिगत वन अधिकार',
      description: language === 'en' ? 'For individual forest dwelling rights' : 'व्यक्तिगत वन निवासी अधिकारों के लिए'
    },
    {
      id: 'annexure-iii',
      name: language === 'en' ? 'Annexure III - Community Forest Rights' : 'अनुलग्नक III - सामुदायिक वन अधिकार',
      description: language === 'en' ? 'For community forest resource rights' : 'सामुदायिक वन संसाधन अधिकारों के लिए'
    },
    {
      id: 'annexure-iv',
      name: language === 'en' ? 'Annexure IV - Habitat Rights' : 'अनुलग्नक IV - आवास अधिकार',
      description: language === 'en' ? 'For primitive tribal group habitat rights' : 'आदिम जनजातीय समूह आवास अधिकारों के लिए'
    }
  ];

  const handleSignAndLock = () => {
    if (window.confirm(language === 'en' 
      ? 'This action cannot be undone. Are you sure you want to sign and lock this document?' 
      : 'यह कार्रवाई पूर्ववत नहीं की जा सकती। क्या आप वाकई इस दस्तावेज़ पर हस्ताक्षर करना और लॉक करना चाहते हैं?'
    )) {
      setIsLocked(true);
      alert(language === 'en' 
        ? 'Document signed and locked successfully. Title granted!'
        : 'दस्तावेज़ सफलतापूर्वक हस्ताक्षरित और लॉक किया गया। पट्टा दिया गया!'
      );
    }
  };

  const selectedClaimData = claimsForApproval.find(claim => claim.id === selectedClaim);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {language === 'en' ? 'DLC Approval & Title Generation' : 'DLC अनुमोदन और पट्टा निर्माण'}
        </h1>
        <p className="mt-2 text-gray-600">
          {language === 'en' 
            ? 'Final approval stage with auto-generated annexure documents'
            : 'स्वचालित रूप से जेनरेट किए गए अनुलग्नक दस्तावेजों के साथ अंतिम अनुमोदन चरण'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Claims List */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'en' ? 'Claims for Approval' : 'अनुमोदन के लिए दावे'}
            </h3>
            <div className="space-y-3">
              {claimsForApproval.map((claim) => (
                <div
                  key={claim.id}
                  onClick={() => setSelectedClaim(claim.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedClaim === claim.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">{claim.id}</p>
                    <Award className="h-4 w-4 text-yellow-500" />
                  </div>
                  <p className="text-sm text-gray-600">{claim.claimant}</p>
                  <p className="text-xs text-gray-500">{claim.village} • {claim.area}</p>
                  <div className="mt-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {language === 'en' ? 'Ready for Approval' : 'अनुमोदन के लिए तैयार'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{claim.lastAction}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="xl:col-span-3 space-y-6">
          {/* Claim Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'en' ? 'Claim Summary' : 'दावा सारांश'}
            </h3>
            {selectedClaimData && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {language === 'en' ? 'Claim ID' : 'दावा आईडी'}
                    </label>
                    <p className="text-gray-900 font-mono">{selectedClaimData.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {language === 'en' ? 'Claimant' : 'दावेदार'}
                    </label>
                    <p className="text-gray-900">{selectedClaimData.claimant}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {language === 'en' ? 'Village' : 'गांव'}
                    </label>
                    <p className="text-gray-900">{selectedClaimData.village}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {language === 'en' ? 'Land Area' : 'भूमि क्षेत्र'}
                    </label>
                    <p className="text-gray-900">{selectedClaimData.area}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {language === 'en' ? 'Rights Type' : 'अधिकार प्रकार'}
                    </label>
                    <p className="text-gray-900">{selectedClaimData.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {language === 'en' ? 'Submitted Date' : 'जमा करने की तारीख'}
                    </label>
                    <p className="text-gray-900">{selectedClaimData.submittedDate}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Annexure Selection */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'en' ? 'Select Annexure Type' : 'अनुलग्नक प्रकार चुनें'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {annexureTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => !isLocked && setAnnexureType(template.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    annexureType === template.id
                      ? 'border-green-500 bg-green-50'
                      : isLocked
                      ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start">
                    <FileText className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 mb-1">{template.name}</p>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Preview */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {language === 'en' ? 'Auto-Generated Annexure Document' : 'स्वचालित रूप से जेनरेट किया गया अनुलग्नक दस्तावेज़'}
              </h3>
              <div className="flex items-center space-x-2">
                {isLocked && (
                  <div className="flex items-center text-green-600">
                    <Lock className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">
                      {language === 'en' ? 'Signed & Locked' : 'हस्ताक्षरित और लॉक्ड'}
                    </span>
                  </div>
                )}
                <button
                  className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  disabled={isLocked}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Download' : 'डाउनलोड'}
                </button>
              </div>
            </div>

            {/* Document Content */}
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-200">
              <div className="bg-white p-8 rounded-lg shadow-sm max-h-96 overflow-y-auto">
                {/* Government Header */}
                <div className="text-center border-b-2 border-gray-200 pb-4 mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {language === 'en' ? 'GOVERNMENT OF INDIA' : 'भारत सरकार'}
                  </h2>
                  <h3 className="text-lg font-semibold text-gray-700">
                    {language === 'en' ? 'Ministry of Tribal Affairs' : 'जनजातीय कार्य मंत्रालय'}
                  </h3>
                  <h4 className="text-base font-medium text-gray-600 mt-2">
                    {language === 'en' ? 'Forest Rights Act, 2006 - Title Document' : 'वन अधिकार अधिनियम, 2006 - पट्टा दस्तावेज़'}
                  </h4>
                </div>

                {/* Annexure Content */}
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>{language === 'en' ? 'Claim Number:' : 'दावा संख्या:'}</strong> {selectedClaim}
                    </div>
                    <div>
                      <strong>{language === 'en' ? 'Date of Issue:' : 'जारी करने की तारीख:'}</strong> {new Date().toLocaleDateString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>{language === 'en' ? 'Name of Claimant:' : 'दावेदार का नाम:'}</strong> {selectedClaimData?.claimant}
                    </div>
                    <div>
                      <strong>{language === 'en' ? 'Village:' : 'गांव:'}</strong> {selectedClaimData?.village}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>{language === 'en' ? 'District:' : 'जिला:'}</strong> {user.district}
                    </div>
                    <div>
                      <strong>{language === 'en' ? 'State:' : 'राज्य:'}</strong> Chhattisgarh
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-6">
                    <h4 className="font-semibold mb-2">
                      {language === 'en' ? 'Rights Granted:' : 'प्रदत्त अधिकार:'}
                    </h4>
                    <p>
                      {language === 'en' 
                        ? `Individual Forest Rights over ${selectedClaimData?.area} of forest land as per the provisions of the Forest Rights Act, 2006.`
                        : `वन अधिकार अधिनियम, 2006 के प्रावधानों के अनुसार ${selectedClaimData?.area} वन भूमि पर व्यक्तिगत वन अधिकार।`
                      }
                    </p>
                  </div>

                  <div className="border-t pt-4 mt-6">
                    <h4 className="font-semibold mb-2">
                      {language === 'en' ? 'Coordinates:' : 'निर्देशांक:'}
                    </h4>
                    <p className="font-mono">20.2961°N, 85.8245°E</p>
                  </div>
                </div>

                {/* Signature Section */}
                <div className="mt-8 pt-6 border-t-2 border-gray-200">
                  <div className="flex justify-between">
                    <div>
                      <div className="border-b border-gray-400 w-40 mb-2"></div>
                      <p className="text-xs text-gray-600">
                        {language === 'en' ? 'Date' : 'तारीख'}
                      </p>
                    </div>
                    <div>
                      {isLocked ? (
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Stamp className="h-8 w-8 text-red-600" />
                          </div>
                          <p className="text-xs font-semibold text-gray-900">DIGITALLY SIGNED</p>
                          <p className="text-xs text-gray-600">{user.name}</p>
                        </div>
                      ) : (
                        <div>
                          <div className="border-b border-gray-400 w-40 mb-2"></div>
                          <p className="text-xs text-gray-600">
                            {language === 'en' ? 'District Collector Signature' : 'जिला कलेक्टर हस्ताक्षर'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                disabled={isLocked}
                className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FileText className="h-5 w-5 mr-2" />
                {language === 'en' ? 'Preview Document' : 'दस्तावेज़ का पूर्वावलोकन'}
              </button>
              
              <button
                disabled={isLocked}
                className="flex items-center justify-center px-6 py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="h-5 w-5 mr-2" />
                {language === 'en' ? 'Generate Draft' : 'मसौदा बनाएं'}
              </button>
              
              <button
                onClick={handleSignAndLock}
                disabled={isLocked}
                className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-green-600 to-brown-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-brown-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLocked ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    {language === 'en' ? 'Title Granted' : 'पट्टा प्रदान किया गया'}
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    {language === 'en' ? 'Sign & Lock Document' : 'दस्तावेज़ पर हस्ताक्षर करें और लॉक करें'}
                  </>
                )}
              </button>
            </div>
            
            {!isLocked && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-yellow-600 mr-2" />
                  <p className="text-sm text-yellow-800">
                    {language === 'en' 
                      ? 'This action requires District Collector authorization and cannot be delegated.'
                      : 'इस कार्रवाई के लिए जिला कलेक्टर का प्राधिकरण आवश्यक है और यह प्रत्यायोजित नहीं की जा सकती।'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DLCApproval;