import React, { useState, useEffect } from 'react';
import { Search, Filter, Users, MapPin, FileText, CheckCircle, AlertCircle, Droplet, Home, Heart, Banknote } from 'lucide-react';

// Mock data for demonstration
const schemes = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN',
    ministry: 'Agriculture & Farmers Welfare',
    benefit: '₹6,000/year direct transfer',
    icon: <Banknote className="w-8 h-8" />,
    description: 'Financial assistance to small and marginal farmers',
    eligibility: ['FRA Patta holder', 'Cultivable land ≤ 2 hectares', 'Valid Aadhaar', 'Bank account'],
    documents: ['Land Record/FRA Patta', 'Aadhaar Card', 'Bank Account Details']
  },
  {
    id: 'mgnrega',
    name: 'MGNREGA',
    ministry: 'Rural Development',
    benefit: '100-150 days guaranteed employment',
    icon: <Users className="w-8 h-8" />,
    description: 'Guaranteed wage employment for rural households',
    eligibility: ['Job Card holder', 'Rural household', 'ST category for 150 days (with FRA)'],
    documents: ['MGNREGA Job Card', 'FRA Patta (for ST households)', 'Aadhaar Card']
  },
  {
    id: 'pmay-gramin',
    name: 'PMAY-Gramin',
    ministry: 'Rural Development',
    benefit: '₹1.2-2.3 lakh housing assistance',
    icon: <Home className="w-8 h-8" />,
    description: 'Housing support for rural poor',
    eligibility: ['No pucca house', 'FRA Patta holder', 'SECC verification'],
    documents: ['SECC Data', 'FRA Patta', 'Aadhaar Card']
  },
  {
    id: 'jal-jeevan',
    name: 'Jal Jeevan Mission',
    ministry: 'Jal Shakti',
    benefit: 'Tap water connection to every household',
    icon: <Droplet className="w-8 h-8" />,
    description: 'Functional tap water connection to rural households',
    eligibility: ['Village without adequate tap water', 'Community FRA Patta required'],
    documents: ['Village Water Status Report', 'Community FRA Patta']
  },
  {
    id: 'dajgua',
    name: 'DAJGUA (PM-JUGA)',
    ministry: 'Tribal Affairs',
    benefit: 'Comprehensive tribal development',
    icon: <MapPin className="w-8 h-8" />,
    description: 'Development of tribal villages',
    eligibility: ['≥50% ST population', '≥500 total population', 'FRA village status'],
    documents: ['Census Data', 'FRA Village Records', 'Population Certificate']
  },
  {
    id: 'pmjay',
    name: 'Ayushman Bharat PMJAY',
    ministry: 'Health & Family Welfare',
    benefit: '₹5 lakh health insurance cover',
    icon: <Heart className="w-8 h-8" />,
    description: 'Health insurance for vulnerable families',
    eligibility: ['BPL household', 'SECC deprivation criteria', 'FRA Patta holder priority'],
    documents: ['SECC Data', 'Ration Card', 'FRA Patta', 'Aadhaar Card']
  }
];

const mockBeneficiaries = [
  { id: 1, name: 'Ramesh Kumar', village: 'Jhirkimunda', district: 'Ranchi', state: 'Jharkhand', category: 'ST', landSize: 1.5, hasJobCard: true, housingStatus: 'Kutcha', fraHolder: true },
  { id: 2, name: 'Sunita Devi', village: 'Bansera', district: 'Gumla', state: 'Jharkhand', category: 'ST', landSize: 0.8, hasJobCard: true, housingStatus: 'Semi-Pucca', fraHolder: true },
  { id: 3, name: 'Mohan Singh', village: 'Karra', district: 'Khunti', state: 'Jharkhand', category: 'ST', landSize: 2.1, hasJobCard: false, housingStatus: 'Pucca', fraHolder: false },
  { id: 4, name: 'Lakshmi Oraon', village: 'Tupudana', district: 'Ranchi', state: 'Jharkhand', category: 'ST', landSize: 1.2, hasJobCard: true, housingStatus: 'Kutcha', fraHolder: true },
  { id: 5, name: 'Budhu Munda', village: 'Jhirkimunda', district: 'Ranchi', state: 'Jharkhand', category: 'ST', landSize: 0.5, hasJobCard: true, housingStatus: 'Kutcha', fraHolder: true }
];

// Eligibility Rules Engine
const checkEligibility = (beneficiary, schemeId) => {
  const rules = {
    'pm-kisan': (b) => b.fraHolder && b.landSize <= 2.0 && b.landSize > 0,
    'mgnrega': (b) => b.hasJobCard && (b.category === 'ST' ? b.fraHolder : true),
    'pmay-gramin': (b) => b.fraHolder && b.housingStatus !== 'Pucca',
    'jal-jeevan': (b) => b.fraHolder, // Simplified - would check village water status
    'dajgua': (b) => b.fraHolder && b.category === 'ST',
    'pmjay': (b) => b.fraHolder && b.category === 'ST' // Simplified BPL check
  };
  
  return rules[schemeId] ? rules[schemeId](beneficiary) : false;
};

const DSS = () => {
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [filters, setFilters] = useState({
    village: '',
    district: '',
    beneficiary: ''
  });
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState(mockBeneficiaries);
  const [showEligibility, setShowEligibility] = useState(false);

  useEffect(() => {
    let filtered = mockBeneficiaries;
    
    if (filters.village) {
      filtered = filtered.filter(b => b.village.toLowerCase().includes(filters.village.toLowerCase()));
    }
    if (filters.district) {
      filtered = filtered.filter(b => b.district.toLowerCase().includes(filters.district.toLowerCase()));
    }
    if (filters.beneficiary) {
      filtered = filtered.filter(b => b.name.toLowerCase().includes(filters.beneficiary.toLowerCase()));
    }
    
    setFilteredBeneficiaries(filtered);
  }, [filters]);

  const SchemeCard = ({ scheme }) => (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100"
      onClick={() => setSelectedScheme(scheme)}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white mr-4">
            {scheme.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{scheme.name}</h3>
            <p className="text-sm text-gray-600">{scheme.ministry}</p>
          </div>
        </div>
        <p className="text-gray-700 mb-3">{scheme.description}</p>
        <div className="flex items-center text-green-600 font-semibold">
          <CheckCircle className="w-4 h-4 mr-2" />
          {scheme.benefit}
        </div>
      </div>
    </div>
  );

  const SchemeModal = ({ scheme, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white mr-4">
                {scheme.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{scheme.name}</h2>
                <p className="text-gray-600">{scheme.ministry}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-700">{scheme.description}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Benefit</h3>
            <div className="flex items-center text-green-600 font-semibold">
              <CheckCircle className="w-5 h-5 mr-2" />
              {scheme.benefit}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Eligibility Criteria</h3>
            <ul className="space-y-2">
              {scheme.eligibility.map((criteria, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{criteria}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Required Documents</h3>
            <ul className="space-y-2">
              {scheme.documents.map((doc, index) => (
                <li key={index} className="flex items-center">
                  <FileText className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const EligibilityResults = ({ beneficiary }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{beneficiary.name}</h3>
          <p className="text-gray-600">{beneficiary.village}, {beneficiary.district}, {beneficiary.state}</p>
          <div className="flex items-center mt-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm mr-2">
              {beneficiary.category}
            </span>
            {beneficiary.fraHolder && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                FRA Holder
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schemes.map(scheme => {
          const eligible = checkEligibility(beneficiary, scheme.id);
          return (
            <div 
              key={scheme.id} 
              className={`p-4 rounded-lg border-2 ${
                eligible 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-center mb-2">
                {eligible ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                )}
                <span className={`font-semibold ${
                  eligible ? 'text-green-800' : 'text-red-800'
                }`}>
                  {scheme.name}
                </span>
              </div>
              <p className={`text-sm ${
                eligible ? 'text-green-700' : 'text-red-700'
              }`}>
                {eligible ? 'Eligible' : 'Not Eligible'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Decision Support System
          </h1>
          <p className="text-xl text-gray-600">
            FRA-CSS Cross-linking Platform for Tribal Development
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Search & Filter</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
              <input
                type="text"
                placeholder="Enter village name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.village}
                onChange={(e) => setFilters({...filters, village: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
              <input
                type="text"
                placeholder="Enter district name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.district}
                onChange={(e) => setFilters({...filters, district: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Beneficiary Name</label>
              <input
                type="text"
                placeholder="Enter beneficiary name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.beneficiary}
                onChange={(e) => setFilters({...filters, beneficiary: e.target.value})}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setShowEligibility(!showEligibility)}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold"
              >
                {showEligibility ? 'Hide' : 'Show'} Eligibility
              </button>
            </div>
          </div>
        </div>

        {/* Schemes Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Central Sector Schemes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map(scheme => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        </div>

        {/* Eligibility Results */}
        {showEligibility && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Eligibility Assessment ({filteredBeneficiaries.length} beneficiaries)
            </h2>
            {filteredBeneficiaries.map(beneficiary => (
              <EligibilityResults key={beneficiary.id} beneficiary={beneficiary} />
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedScheme && (
          <SchemeModal 
            scheme={selectedScheme} 
            onClose={() => setSelectedScheme(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default DSS;