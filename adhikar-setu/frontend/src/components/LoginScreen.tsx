import React, { useState } from 'react';
import { Shield, MapPin, Users, Eye, EyeOff } from 'lucide-react';
import type { User, UserRole } from '../App';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, language, setLanguage }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const roles = [
    { id: 'gram_sabha', name: language === 'en' ? 'Gram Sabha' : 'ग्राम सभा', icon: Users, color: 'bg-green-600' },
    { id: 'frc', name: language === 'en' ? 'Forest Rights Committee' : 'वन अधिकार समिति', icon: Shield, color: 'bg-brown-600' },
    { id: 'sdlc', name: language === 'en' ? 'Sub-Divisional Committee' : 'उप-मंडल समिति', icon: MapPin, color: 'bg-yellow-600' },
    { id: 'dlc', name: language === 'en' ? 'District Level Committee' : 'जिला स्तरीय समिति', icon: Shield, color: 'bg-green-700' },
    { id: 'mota', name: language === 'en' ? 'Ministry of Tribal Affairs' : 'जनजातीय कार्य मंत्रालय', icon: Shield, color: 'bg-blue-700' }
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleLogin = () => {
    if (selectedRole && credentials.username && credentials.password) {
      const user: User = {
        id: '1',
        name: credentials.username,
        role: selectedRole,
        district: 'Bastar',
        village: selectedRole === 'gram_sabha' ? 'Jagdalpur' : undefined
      };
      onLogin(user);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-brown-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-brown-700 p-8 text-white text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 mr-3" />
            <div>
              <h1 className="text-3xl font-bold">FRA Atlas DSS</h1>
              <p className="text-green-100 mt-1">
                {language === 'en' ? 'Forest Rights Act Digital Support System' : 'वन अधिकार अधिनियम डिजिटल सहायता प्रणाली'}
              </p>
            </div>
          </div>
          
          {/* Language Toggle */}
          <div className="flex justify-center space-x-2 mt-4">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                language === 'en' ? 'bg-white text-green-700' : 'bg-green-600 hover:bg-green-500'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                language === 'hi' ? 'bg-white text-green-700' : 'bg-green-600 hover:bg-green-500'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Role Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {language === 'en' ? 'Select Your Role' : 'अपनी भूमिका चुनें'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id as UserRole)}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                      selectedRole === role.id
                        ? 'border-green-500 bg-green-50 shadow-lg'
                        : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`${role.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3 mx-auto`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800 text-center">{role.name}</h3>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          {selectedRole && (
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                {language === 'en' ? 'Sign In' : 'साइन इन करें'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Username' : 'उपयोगकर्ता नाम'}
                  </label>
                  <input
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder={language === 'en' ? 'Enter your username' : 'अपना उपयोगकर्ता नाम दर्ज करें'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Password' : 'पासवर्ड'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder={language === 'en' ? 'Enter your password' : 'अपना पासवर्ड दर्ज करें'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleLogin}
                  disabled={!credentials.username || !credentials.password}
                  className="w-full bg-gradient-to-r from-green-600 to-brown-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-brown-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {language === 'en' ? 'Sign In' : 'साइन इन करें'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 text-center text-sm text-gray-600">
          <p>
            {language === 'en' 
              ? 'Government of India • Ministry of Tribal Affairs • Secure Login Portal'
              : 'भारत सरकार • जनजातीय कार्य मंत्रालय • सुरक्षित लॉगिन पोर्टल'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;