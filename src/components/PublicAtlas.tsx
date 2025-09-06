import React, { useState } from 'react';
import { Globe, Search, MapPin, BarChart3, Download, Filter, Eye } from 'lucide-react';

interface PublicAtlasProps {
  language: 'en' | 'hi';
}

const PublicAtlas: React.FC<PublicAtlasProps> = ({ language }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('Chhattisgarh');
  const [selectedDistrict, setSelectedDistrict] = useState('Bastar');
  const [viewMode, setViewMode] = useState('map');

  const states = ['Chhattisgarh', 'Jharkhand', 'Odisha', 'Madhya Pradesh'];
  const districts = ['Bastar', 'Kanker', 'Kondagaon', 'Sukma'];

  const publicStats = [
    {
      title: language === 'en' ? 'Total Claims Processed' : 'कुल प्रसंस्कृत दावे',
      value: '2,84,567',
      subtitle: language === 'en' ? 'Across all states' : 'सभी राज्यों में'
    },
    {
      title: language === 'en' ? 'Rights Granted' : 'अधिकार प्रदान किए गए',
      value: '1,98,432',
      subtitle: language === 'en' ? '69.7% success rate' : '69.7% सफलता दर'
    },
    {
      title: language === 'en' ? 'Land Area Recognized' : 'मान्यता प्राप्त भूमि क्षेत्र',
      value: '45,892 Ha',
      subtitle: language === 'en' ? 'Forest rights granted' : 'वन अधिकार प्रदान किए गए'
    },
    {
      title: language === 'en' ? 'Beneficiary Families' : 'लाभार्थी परिवार',
      value: '1,76,234',
      subtitle: language === 'en' ? 'Lives impacted positively' : 'सकारात्मक प्रभाव वाले जीवन'
    }
  ];

  const districtData = [
    { name: 'Bastar', totalClaims: 4567, granted: 3234, area: '12,456 Ha', families: 2890 },
    { name: 'Kanker', totalClaims: 3421, granted: 2567, area: '8,923 Ha', families: 2134 },
    { name: 'Kondagaon', totalClaims: 2890, granted: 2123, area: '7,234 Ha', families: 1876 },
    { name: 'Sukma', totalClaims: 3456, granted: 2890, area: '9,567 Ha', families: 2456 }
  ];

  const villageHighlights = [
    {
      village: 'Jagdalpur',
      district: 'Bastar',
      claims: 234,
      granted: 189,
      area: '456 Ha',
      status: 'completed'
    },
    {
      village: 'Kondagaon',
      district: 'Kondagaon',
      claims: 189,
      granted: 156,
      area: '378 Ha',
      status: 'in-progress'
    },
    {
      village: 'Keskal',
      district: 'Bastar',
      claims: 145,
      granted: 123,
      area: '289 Ha',
      status: 'completed'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Globe className="h-12 w-12 text-green-600 mr-4" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              {language === 'en' ? 'FRA Public Atlas' : 'FRA सार्वजनिक एटलस'}
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              {language === 'en' 
                ? 'Transparent access to Forest Rights Act implementation data'
                : 'वन अधिकार अधिनियम कार्यान्वयन डेटा तक पारदर्शी पहुंच'
              }
            </p>
          </div>
        </div>
        
        {/* Public Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-3xl mx-auto">
          <p className="text-sm text-blue-800">
            {language === 'en' 
              ? 'This portal provides anonymized statistics for public transparency. Individual claimant details are protected as per privacy regulations.'
              : 'यह पोर्टल सार्वजनिक पारदर्शिता के लिए गुमनाम आंकड़े प्रदान करता है। व्यक्तिगत दावेदार विवरण गोपनीयता नियमों के अनुसार सुरक्षित हैं।'
            }
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 lg:mr-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={language === 'en' ? 'Search by village, district, or state...' : 'गांव, जिला या राज्य से खोजें...'}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
            
            <button className="flex items-center px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
              <Filter className="h-5 w-5 mr-2" />
              {language === 'en' ? 'Filter' : 'फ़िल्टर'}
            </button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="mt-4 flex items-center justify-center">
          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                viewMode === 'map' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MapPin className="h-4 w-4 mr-2 inline" />
              {language === 'en' ? 'Map View' : 'मैप व्यू'}
            </button>
            <button
              onClick={() => setViewMode('stats')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                viewMode === 'stats' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="h-4 w-4 mr-2 inline" />
              {language === 'en' ? 'Statistics' : 'आंकड़े'}
            </button>
          </div>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {publicStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{stat.title}</h3>
            <p className="text-3xl font-bold text-green-600 mb-1">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      {viewMode === 'map' ? (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {language === 'en' ? 'Interactive Map' : 'इंटरैक्टिव मैप'}
            </h3>
            <div className="flex items-center space-x-2">
              <button className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Eye className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Layers' : 'परतें'}
              </button>
              <button className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                <Download className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Export' : 'एक्सपोर्ट'}
              </button>
            </div>
          </div>

          {/* Map Visualization */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg h-96 flex items-center justify-center border-2 border-dashed border-green-200 relative">
            <div className="text-center">
              <Globe className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-700">
                {language === 'en' ? 'Public FRA Atlas Map' : 'सार्वजनिक FRA एटलस मैप'}
              </p>
              <p className="text-gray-500 mt-2">
                {language === 'en' 
                  ? `Showing granted forest rights polygons for ${selectedDistrict} district`
                  : `${selectedDistrict} जिले के लिए प्रदत्त वन अधिकार बहुभुज दिखा रहा है`
                }
              </p>
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-sm">
              <div className="flex flex-col space-y-2">
                <button className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center">+</button>
                <button className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center">-</button>
              </div>
            </div>
          </div>

          {/* Map Legend */}
          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">
              {language === 'en' ? 'Map Legend' : 'मैप व्याख्या'}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                <span className="text-sm">{language === 'en' ? 'Granted Rights' : 'प्रदत्त अधिकार'}</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                <span className="text-sm">{language === 'en' ? 'Under Process' : 'प्रक्रियाधीन'}</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                <span className="text-sm">{language === 'en' ? 'Community Rights' : 'सामुदायिक अधिकार'}</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
                <span className="text-sm">{language === 'en' ? 'Individual Rights' : 'व्यक्तिगत अधिकार'}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* District-wise Statistics */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {language === 'en' ? 'District-wise Statistics' : 'जिलावार आंकड़े'}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      {language === 'en' ? 'District' : 'जिला'}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      {language === 'en' ? 'Total Claims' : 'कुल दावे'}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      {language === 'en' ? 'Rights Granted' : 'अधिकार प्रदान'}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      {language === 'en' ? 'Area (Ha)' : 'क्षेत्रफल (हे.)'}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      {language === 'en' ? 'Families' : 'परिवार'}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      {language === 'en' ? 'Success Rate' : 'सफलता दर'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {districtData.map((district, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{district.name}</td>
                      <td className="py-3 px-4 text-gray-700">{district.totalClaims.toLocaleString()}</td>
                      <td className="py-3 px-4 text-green-600 font-medium">{district.granted.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-700">{district.area}</td>
                      <td className="py-3 px-4 text-gray-700">{district.families.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                          {((district.granted / district.totalClaims) * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Village Highlights */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {language === 'en' ? 'Village Highlights' : 'गांव की मुख्य बातें'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {villageHighlights.map((village, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{village.village}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      village.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {village.status === 'completed' 
                        ? (language === 'en' ? 'Completed' : 'पूर्ण') 
                        : (language === 'en' ? 'In Progress' : 'प्रगति में')
                      }
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{village.district} District</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{language === 'en' ? 'Claims:' : 'दावे:'}</span>
                      <span className="font-medium">{village.claims}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{language === 'en' ? 'Granted:' : 'प्रदान:'}</span>
                      <span className="font-medium text-green-600">{village.granted}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{language === 'en' ? 'Area:' : 'क्षेत्र:'}</span>
                      <span className="font-medium">{village.area}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 text-center">
        <div className="bg-gray-50 rounded-xl p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'en' ? 'About FRA Implementation' : 'FRA कार्यान्वयन के बारे में'}
          </h3>
          <p className="text-gray-600 max-w-3xl mx-auto">
            {language === 'en' 
              ? 'The Forest Rights Act, 2006 recognizes and vests forest rights in forest dwelling Scheduled Tribes and other traditional forest dwellers. This portal provides transparent access to implementation statistics while protecting individual privacy.'
              : 'वन अधिकार अधिनियम, 2006 वन निवासी अनुसूचित जनजातियों और अन्य पारंपरिक वन निवासियों में वन अधिकारों को मान्यता देता है और निहित करता है। यह पोर्टल व्यक्तिगत गोपनीयता की रक्षा करते हुए कार्यान्वयन आंकड़ों तक पारदर्शी पहुंच प्रदान करता है।'
            }
          </p>
          <div className="mt-6 flex justify-center space-x-6">
            <button className="flex items-center text-blue-600 hover:text-blue-700">
              <Download className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Download Report' : 'रिपोर्ट डाउनलोड करें'}
            </button>
            <button className="flex items-center text-green-600 hover:text-green-700">
              <BarChart3 className="h-4 w-4 mr-2" />
              {language === 'en' ? 'View Analytics' : 'विश्लेषण देखें'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicAtlas;