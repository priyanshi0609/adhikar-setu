import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  MapPin, 
  Home, 
  Filter, 
  Download, 
  Printer, 
  ChevronDown,
  CheckCircle,
  AlertCircle,
  FileText,
  Building,
  PieChart,
  Target,
  TrendingUp
} from 'lucide-react';

import { schemes } from '../data/schemes';
import { 
  mockBeneficiaries, 
  villageData, 
  getUniqueVillages, 
  getUniqueStates, 
  getVillagesByState, 
  getBeneficiariesByFilters,
  getBeneficiariesByVillage,
  interventionPriorities
} from '../data/mockdata';

// Eligibility Rules (same as in DSS)
const checkEligibility = (beneficiary, schemeId) => {
  const rules = {
    'pm-kisan': (b) => ({
      eligible: b.fraHolder && b.landSize <= 2.0 && b.landSize > 0 && b.hasAadhaar && b.hasBankAccount,
      requirements: [
        { field: 'fraHolder', label: 'FRA Holder', value: b.fraHolder, required: true },
        { field: 'landSize', label: 'Land Size (0-2 ha)', value: b.landSize, required: b.landSize <= 2.0 && b.landSize > 0 },
        { field: 'hasAadhaar', label: 'Aadhaar Card', value: b.hasAadhaar, required: true },
        { field: 'hasBankAccount', label: 'Bank Account', value: b.hasBankAccount, required: true }
      ]
    }),
    'mgnrega': (b) => ({
      eligible: b.hasJobCard && (b.category === 'ST' ? b.fraHolder : true),
      requirements: [
        { field: 'hasJobCard', label: 'Job Card', value: b.hasJobCard, required: true },
        { field: 'fraHolder', label: 'FRA Holder (if ST)', value: b.fraHolder, required: b.category === 'ST' }
      ]
    }),
    'pmay-gramin': (b) => ({
      eligible: b.fraHolder && b.housingStatus !== 'Pucca' && b.seccVerified,
      requirements: [
        { field: 'fraHolder', label: 'FRA Holder', value: b.fraHolder, required: true },
        { field: 'housingStatus', label: 'Non-Pucca House', value: b.housingStatus !== 'Pucca', required: true },
        { field: 'seccVerified', label: 'SECC Verified', value: b.seccVerified, required: true }
      ]
    }),
    'jal-jeevan': (b) => ({
      eligible: (b.villageWaterCoverage < 100) && (b.communityFRAStatus || b.fraHolder),
      requirements: [
        { field: 'villageWaterCoverage', label: 'Water Coverage <100%', value: b.villageWaterCoverage < 100, required: true },
        { field: 'communityFRAStatus', label: 'Community FRA or Individual FRA', value: b.communityFRAStatus || b.fraHolder, required: true }
      ]
    }),
    'dajgua': (b) => ({
      eligible: b.fraHolder && b.category === 'ST' && b.villageSTPopulationPercent >= 50 && b.villageTotalPopulation >= 500,
      requirements: [
        { field: 'fraHolder', label: 'FRA Holder', value: b.fraHolder, required: true },
        { field: 'category', label: 'ST Category', value: b.category === 'ST', required: true },
        { field: 'villageSTPopulationPercent', label: 'ST Population ≥50%', value: b.villageSTPopulationPercent >= 50, required: true },
        { field: 'villageTotalPopulation', label: 'Village Population ≥500', value: b.villageTotalPopulation >= 500, required: true }
      ]
    }),
    'pmjay': (b) => ({
      eligible: (b.householdIncomeStatus === 'BPL' || b.seccDeprivationCategory) && (b.fraHolder || ['ST', 'SC'].includes(b.category)),
      requirements: [
        { field: 'incomeOrDeprivation', label: 'BPL or SECC Deprivation', value: b.householdIncomeStatus === 'BPL' || b.seccDeprivationCategory, required: true },
        { field: 'fraHolderOrCategory', label: 'FRA Holder or ST/SC Category', value: b.fraHolder || ['ST', 'SC'].includes(b.category), required: true }
      ]
    })
  };
  
  return rules[schemeId] ? rules[schemeId](beneficiary) : { eligible: false, requirements: [] };
};

const DSSResults = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    state: '',
    village: '',
    scheme: ''
  });
  const [availableVillages, setAvailableVillages] = useState(getUniqueVillages());
  const [isLoading, setIsLoading] = useState(false);
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState(mockBeneficiaries);
  const [schemeEligibility, setSchemeEligibility] = useState({});
  const [villageStats, setVillageStats] = useState({});
  const [priorityInterventions, setPriorityInterventions] = useState([]);

  // Color scheme based on original DSS file
  const colors = {
    primary: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
      950: "#052e16",
    },
    secondary: {
      50: "#ecfdf5",
      100: "#d1fae5",
      200: "#a7f3d0",
      300: "#6ee7b7",
      400: "#34d399",
      500: "#10b981",
      600: "#059669",
      700: "#047857",
      800: "#065f46",
      900: "#064e3b",
      950: "#022c22",
    },
    accent: {
      amber: {
        50: "#fffbeb",
        100: "#fef3c7",
        200: "#fde68a",
        500: "#f59e0b",
        600: "#d97706",
      },
      brown: {
        50: "#fdf8f6",
        100: "#f2e8e5",
        200: "#eaddd7",
        500: "#92400e",
        600: "#78350f",
      },
    },
    neutral: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
      950: "#030712",
    },
    status: {
      success: {
        bg: "#dcfce7",
        text: "#14532d",
        border: "#bbf7d0",
      },
      warning: {
        bg: "#fef3c7",
        text: "#92400e",
        border: "#fde68a",
      },
      error: {
        bg: "#fee2e2",
        text: "#991b1b",
        border: "#fecaca",
      },
      info: {
        bg: "#dbeafe",
        text: "#1e40af",
        border: "#bfdbfe",
      },
    },
  };

  useEffect(() => {
    if (filters.state) {
      const villages = getVillagesByState(filters.state);
      setAvailableVillages(villages);
      
      if (filters.village && !villages.includes(filters.village)) {
        setFilters(prev => ({ ...prev, village: '' }));
      }
    } else {
      setAvailableVillages(getUniqueVillages());
    }
  }, [filters.state]);

  useEffect(() => {
    calculateResults();
  }, [filters]);

  const calculateResults = () => {
    setIsLoading(true);
    
    // Filter beneficiaries based on selected filters
    let beneficiaries = mockBeneficiaries;
    if (filters.state) {
      beneficiaries = beneficiaries.filter(b => b.state === filters.state);
    }
    if (filters.village) {
      beneficiaries = beneficiaries.filter(b => b.village === filters.village);
    }
    
    setFilteredBeneficiaries(beneficiaries);
    
    // Calculate scheme eligibility statistics
    const eligibilityStats = {};
    schemes.forEach(scheme => {
      const eligibleCount = beneficiaries.filter(b => checkEligibility(b, scheme.id).eligible).length;
      eligibilityStats[scheme.id] = {
        eligible: eligibleCount,
        total: beneficiaries.length,
        percentage: beneficiaries.length > 0 ? Math.round((eligibleCount / beneficiaries.length) * 100) : 0
      };
    });
    setSchemeEligibility(eligibilityStats);
    
    // Calculate village statistics
    const stats = {};
    beneficiaries.forEach(b => {
      if (!stats[b.village]) {
        stats[b.village] = {
          total: 0,
          fraHolders: 0,
          eligibleForPmKisan: 0,
          eligibleForPmay: 0,
          eligibleForMgnrega: 0,
          eligibleForJalJeevan: 0,
          eligibleForDajgua: 0,
          eligibleForPmjay: 0
        };
      }
      
      stats[b.village].total++;
      if (b.fraHolder) stats[b.village].fraHolders++;
      if (checkEligibility(b, 'pm-kisan').eligible) stats[b.village].eligibleForPmKisan++;
      if (checkEligibility(b, 'pmay-gramin').eligible) stats[b.village].eligibleForPmay++;
      if (checkEligibility(b, 'mgnrega').eligible) stats[b.village].eligibleForMgnrega++;
      if (checkEligibility(b, 'jal-jeevan').eligible) stats[b.village].eligibleForJalJeevan++;
      if (checkEligibility(b, 'dajgua').eligible) stats[b.village].eligibleForDajgua++;
      if (checkEligibility(b, 'pmjay').eligible) stats[b.village].eligibleForPmjay++;
    });
    setVillageStats(stats);
    
    // Identify priority interventions
    const priorities = interventionPriorities.map(priority => {
      const relevantBeneficiaries = beneficiaries.filter(b => 
        priority.beneficiaries?.includes(b.id) || 
        (priority.villages && priority.villages.includes(b.village.toLowerCase().replace(/\s+/g, '')))
      );
      
      return {
        ...priority,
        count: relevantBeneficiaries.length,
        beneficiaries: relevantBeneficiaries
      };
    }).filter(p => p.count > 0);
    
    setPriorityInterventions(priorities);
    
    setIsLoading(false);
  };

  const CustomSelect = ({ value, onChange, options, placeholder, disabled = false }) => (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none transition-colors duration-200 ${
          disabled ? 'bg-gray-50 cursor-not-allowed text-gray-400' : 'cursor-pointer text-gray-700 hover:border-gray-300'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );

  const PriorityBadge = ({ priority }) => {
    const getPriorityStyle = () => {
      switch(priority) {
        case 'Very High':
          return 'bg-red-100 text-red-800';
        case 'High':
          return 'bg-orange-100 text-orange-800';
        case 'Medium':
          return 'bg-blue-100 text-blue-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityStyle()}`}>
        {priority} Priority
      </span>
    );
  };

  const SchemeEligibilityCard = ({ scheme }) => {
    const stats = schemeEligibility[scheme.id] || { eligible: 0, total: 0, percentage: 0 };
    
    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200 transition-all duration-200 ">
        <div className="flex items-center mb-3">
          <div className="p-2 bg-green-100 rounded-lg mr-3">
            <scheme.icon className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-800">{scheme.name}</h3>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600">Eligibility Rate</span>
            <span className="font-semibold text-green-600">{stats.percentage}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${stats.percentage}%`,
                backgroundColor: stats.percentage > 50 ? '#16a34a' : 
                                stats.percentage > 25 ? '#f59e0b' : 
                                '#dc2626'
              }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500">Eligible: </span>
            <span className="font-semibold text-green-600">{stats.eligible}</span>
          </div>
          <div>
            <span className="text-gray-500">Total: </span>
            <span className="font-semibold">{stats.total}</span>
          </div>
        </div>
      </div>
    );
  };

  const VillageStatsCard = ({ village, stats }) => {
    return (
      <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-blue-500" />
          {village}
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold mb-1 text-green-600">{stats.total}</div>
            <div className="text-xs text-gray-500">Total Beneficiaries</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold mb-1 text-green-600">{stats.fraHolders}</div>
            <div className="text-xs text-gray-500">FRA Holders</div>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Scheme Eligibility</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">PM-KISAN</span>
              <span className="font-semibold text-green-600">{stats.eligibleForPmKisan}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">PMAY-Gramin</span>
              <span className="font-semibold text-green-600">{stats.eligibleForPmay}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">MGNREGA</span>
              <span className="font-semibold text-green-600">{stats.eligibleForMgnrega}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const InterventionCard = ({ intervention }) => {
    return (
      <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-gray-800">{intervention.type}</h3>
          <PriorityBadge priority={intervention.priority} />
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{intervention.description}</p>
        
        <div className="mb-3">
          <span className="text-sm font-medium text-gray-700">Relevant Schemes: </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {intervention.schemes.map(schemeId => {
              const scheme = schemes.find(s => s.id === schemeId);
              return scheme ? (
                <span 
                  key={schemeId}
                  className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                >
                  {scheme.name}
                </span>
              ) : null;
            })}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {intervention.count} {intervention.count === 1 ? 'Beneficiary' : 'Beneficiaries'}
          </span>
          <button 
            className="text-sm px-3 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
            onClick={() => {
              // In a real app, this would show detailed beneficiary list
              alert(`Showing details for ${intervention.type} intervention`);
            }}
          >
            View Details
          </button>
        </div>
      </div>
    );
  };

 

  const printReport = () => {
    
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            <Building className="inline-block w-8 h-8 mr-2 align-text-bottom text-green-600" />
            Decision Support System Results
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Analysis of scheme eligibility and intervention priorities for your jurisdiction
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Filter className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Filter Results</h2>
            </div>
            
            <div className="flex space-x-2">
              
              <button
                onClick={printReport}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <CustomSelect
                value={filters.state}
                onChange={(value) => setFilters({...filters, state: value, village: ''})}
                options={getUniqueStates()}
                placeholder="All States"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
              <CustomSelect
                value={filters.village}
                onChange={(value) => setFilters({...filters, village: value})}
                options={availableVillages}
                placeholder="All Villages"
                disabled={!filters.state}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scheme</label>
              <CustomSelect
                value={filters.scheme}
                onChange={(value) => setFilters({...filters, scheme: value})}
                options={schemes.map(s => s.name)}
                placeholder="All Schemes"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            <p className="mt-4 text-gray-600">Calculating results...</p>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 text-center border border-gray-200">
                <Users className="w-10 h-10 mx-auto mb-3 text-green-500" />
                <div className="text-3xl font-bold mb-1 text-gray-800">{filteredBeneficiaries.length}</div>
                <div className="text-gray-500">Total Beneficiaries</div>
              </div>
              
              <div className="bg-white rounded-lg p-6 text-center border border-gray-200">
                <CheckCircle className="w-10 h-10 mx-auto mb-3 text-green-500" />
                <div className="text-3xl font-bold mb-1 text-gray-800">
                  {Object.values(schemeEligibility).reduce((sum, stats) => sum + stats.eligible, 0)}
                </div>
                <div className="text-gray-500">Total Eligible Claims</div>
              </div>
              
              <div className="bg-white rounded-lg p-6 text-center border border-gray-200">
                <FileText className="w-10 h-10 mx-auto mb-3 text-amber-500" />
                <div className="text-3xl font-bold mb-1 text-gray-800">{priorityInterventions.length}</div>
                <div className="text-gray-500">Priority Interventions</div>
              </div>
            </div>

            {/* Scheme Eligibility Overview */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
                Scheme Eligibility Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {schemes.map(scheme => (
                  <SchemeEligibilityCard key={scheme.id} scheme={scheme} />
                ))}
              </div>
            </div>

            {/* Village-wise Statistics */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                Village-wise Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(villageStats).map(([village, stats]) => (
                  <VillageStatsCard key={village} village={village} stats={stats} />
                ))}
              </div>
            </div>

            {/* Priority Interventions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-amber-500" />
                Priority Interventions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {priorityInterventions.map((intervention, index) => (
                  <InterventionCard key={index} intervention={intervention} />
                ))}
              </div>
            </div>

            
            
          </>
        )}
      </div>
    </div>
  );
};

export default DSSResults;