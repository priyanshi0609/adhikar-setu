import React, { useState } from 'react';
import { BarChart3, FileText, CheckCircle, Clock, MapPin, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import type { User } from '../App';

interface DashboardProps {
  user: User;
  language: 'en' | 'hi';
}

const Dashboard: React.FC<DashboardProps> = ({ user, language }) => {
  const [selectedState, setSelectedState] = useState('Chhattisgarh');
  const [selectedDistrict, setSelectedDistrict] = useState('Bastar');
  const [selectedVillage, setSelectedVillage] = useState('All Villages');

  const states = ['Chhattisgarh', 'Jharkhand', 'Odisha', 'Madhya Pradesh'];
  const districts = ['Bastar', 'Kanker', 'Kondagaon', 'Sukma'];
  const villages = ['All Villages', 'Jagdalpur', 'Kondagaon', 'Keskal', 'Bakawand'];

  const getKPIData = () => {
    switch (user.role) {
      case 'gram_sabha':
        return [
          { title: language === 'en' ? 'My Claims' : 'मेरे दावे', value: '12', icon: FileText, color: 'bg-blue-500', change: '+2 this month' },
          { title: language === 'en' ? 'Approved' : 'स्वीकृत', value: '8', icon: CheckCircle, color: 'bg-green-500', change: '+1 this week' },
          { title: language === 'en' ? 'Pending' : 'लंबित', value: '4', icon: Clock, color: 'bg-yellow-500', change: '2 in review' },
          { title: language === 'en' ? 'Village Area' : 'गांव का क्षेत्रफल', value: '450 Ha', icon: MapPin, color: 'bg-purple-500', change: 'Total area' }
        ];
      case 'dlc':
        return [
          { title: language === 'en' ? 'Total Claims' : 'कुल दावे', value: '2,847', icon: FileText, color: 'bg-blue-500', change: '+47 this month' },
          { title: language === 'en' ? 'Verified Claims' : 'सत्यापित दावे', value: '2,103', icon: CheckCircle, color: 'bg-green-500', change: '73.8% completion' },
          { title: language === 'en' ? 'Approved Titles' : 'स्वीकृत पट्टे', value: '1,876', icon: CheckCircle, color: 'bg-green-600', change: '89.2% of verified' },
          { title: language === 'en' ? 'Pending Claims' : 'लंबित दावे', value: '744', icon: Clock, color: 'bg-yellow-500', change: '26.2% pending' }
        ];
      default:
        return [
          { title: language === 'en' ? 'Total Claims' : 'कुल दावे', value: '1,234', icon: FileText, color: 'bg-blue-500', change: '+23 this week' },
          { title: language === 'en' ? 'Verified Claims' : 'सत्यापित दावे', value: '987', icon: CheckCircle, color: 'bg-green-500', change: '80% completion' },
          { title: language === 'en' ? 'Pending Review' : 'समीक्षा लंबित', value: '156', icon: Clock, color: 'bg-yellow-500', change: 'Avg: 7 days' },
          { title: language === 'en' ? 'Active Users' : 'सक्रिय उपयोगकर्ता', value: '89', icon: Users, color: 'bg-purple-500', change: '+12 this month' }
        ];
    }
  };

  const kpiData = getKPIData();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'en' ? 'Adhikar-Setu' : 'अधिकार सेतु'}
          </h1>
          <p className="mt-1 text-gray-600">
            {language === 'en' ? `Welcome back, ${user.name}` : `वापसी पर स्वागत, ${user.name}`}
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-4 lg:mt-0 flex space-x-3">
          {user.role === 'gram_sabha' && (
            <button className="bg-gradient-to-r from-green-600 to-brown-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-700 hover:to-brown-700 transition-all duration-200">
              {language === 'en' ? 'Submit New Claim' : 'नया दावा जमा करें'}
            </button>
          )}
          <button className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-all duration-200">
            {language === 'en' ? 'Generate Report' : 'रिपोर्ट बनाएं'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {language === 'en' ? 'Location Filters' : 'स्थान फिल्टर'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'State' : 'राज्य'}
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'District' : 'जिला'}
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'Village' : 'गांव'}
            </label>
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {villages.map(village => (
                <option key={village} value={village}>{village}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center">
                <div className={`${kpi.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  {kpi.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {language === 'en' ? 'Interactive Map' : 'इंटरएक्टिव मैप'}
              </h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            {/* Simulated Map */}
            <div className="bg-gradient-to-br from-green-50 to-brown-50 rounded-lg h-96 flex items-center justify-center border-2 border-dashed border-green-200">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-700">
                  {language === 'en' ? 'WebGIS Map Integration' : 'WebGIS मैप एकीकरण'}
                </p>
                <p className="text-gray-500 mt-2">
                  {language === 'en' 
                    ? 'Interactive map showing FRA claims, boundaries, and land use'
                    : 'FRA दावे, सीमाएं और भूमि उपयोग दिखाने वाला इंटरैक्टिव मानचित्र'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Panel */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'en' ? 'Recent Activity' : 'हाल की गतिविधि'}
            </h3>
            <div className="space-y-4">
              {[
                { action: 'Claim submitted', user: 'Ram Singh', time: '2 hours ago', status: 'pending' },
                { action: 'Verification completed', user: 'FRC Team', time: '4 hours ago', status: 'completed' },
                { action: 'Document uploaded', user: 'Sita Devi', time: '6 hours ago', status: 'info' },
                { action: 'Approval granted', user: 'DLC Officer', time: '1 day ago', status: 'success' }
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    activity.status === 'pending' ? 'bg-yellow-500' :
                    activity.status === 'completed' ? 'bg-blue-500' :
                    activity.status === 'success' ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.user}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'en' ? 'Alerts & Notifications' : 'अलर्ट और सूचनाएं'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    {language === 'en' ? 'Pending Reviews' : 'लंबित समीक्षा'}
                  </p>
                  <p className="text-xs text-yellow-700">
                    {language === 'en' ? '15 claims need attention' : '15 दावों पर ध्यान देने की जरूरत'}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    {language === 'en' ? 'System Update' : 'सिस्टम अपडेट'}
                  </p>
                  <p className="text-xs text-green-700">
                    {language === 'en' ? 'New features available' : 'नई सुविधाएं उपलब्ध'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;