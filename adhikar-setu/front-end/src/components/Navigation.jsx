import React, { useState } from 'react';
import { 
  Home, FileText, CheckSquare, Award, BarChart3, Globe, 
  LogOut, Sun, Moon, Languages, Menu, X, ChevronDown,
  Map, Settings, HelpCircle, Bell, UserRound
} from 'lucide-react';

const Navigation = ({
  user,
  currentScreen,
  onScreenChange,
  onLogout,
  isDarkMode,
  setIsDarkMode,
  language,
  setLanguage
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const getMenuItems = () => {
    const allItems = [
      { id: 'dashboard', name: language === 'en' ? 'Dashboard' : 'डैशबोर्ड', icon: Home, roles: ['gram_sabha', 'frc', 'sdlc', 'dlc', 'mota'] },
      { id: 'claim-submission', name: language === 'en' ? 'Submit Claim' : 'दावा जमा करें', icon: FileText, roles: ['gram_sabha'] },
      { id: 'verification', name: language === 'en' ? 'Verification' : 'सत्यापन', icon: CheckSquare, roles: ['frc', 'sdlc'] },
      { id: 'dlc-approval', name: language === 'en' ? 'Approval' : 'अनुमोदन', icon: Award, roles: ['dlc'] },
      { id: 'dss', name: language === 'en' ? 'Decision Support' : 'निर्णय सहायता', icon: BarChart3, roles: ['sdlc', 'dlc', 'mota'] },
      { id: 'public-atlas', name: language === 'en' ? 'Public Atlas' : 'सार्वजनिक एटलस', icon: Globe, roles: ['gram_sabha', 'frc', 'sdlc', 'dlc', 'mota'] },
      { id:'dss_results', name: language === 'en' ? 'DSS Results' : 'DSS परिणाम', icon: BarChart3, roles: ['gram_sabha'] },
    ];

    return allItems.filter(item => item.roles.includes(user.role));
  };

  const menuItems = getMenuItems();

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border-b shadow-sm transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-2 rounded-lg shadow-md">
                  <Map className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Adhikar-Setu
                  </h1>
                  <p className="text-xs text-green-600 font-medium">
                    {language === 'en' ? 'Forest Rights Portal' : 'वन अधिकार पोर्टल'}
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onScreenChange(item.id)}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentScreen === item.id
                          ? `${isDarkMode ? 'bg-green-700 text-white shadow-md' : 'bg-green-100 text-green-700 shadow-sm'}`
                          : isDarkMode
                          ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-2">
              {/* Notifications */}
              <button
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} relative`}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Language */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                <Languages className="h-5 w-5" />
              </button>

              {/* Dark Mode */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                {isDarkMode ? <Sun className="h-5 w-5 text-amber-300" /> : <Moon className="h-5 w-5 text-gray-600" />}
              </button>

              {/* Profile Dropdown (Desktop) */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className={`flex items-center space-x-2 p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-600 to-green-700 flex items-center justify-center text-white font-semibold text-sm">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role?.replace('_', ' ')}</p>
                  </div>
                  <ChevronDown className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileDropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} z-50`}>
                    <button className={`flex items-center w-full px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                      <UserRound className="h-4 w-4 mr-3" />
                      {language === 'en' ? 'Profile' : 'प्रोफाइल'}
                    </button>
                    <button className={`flex items-center w-full px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                      <Settings className="h-4 w-4 mr-3" />
                      {language === 'en' ? 'Settings' : 'सेटिंग्स'}
                    </button>
                    <button className={`flex items-center w-full px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                      <HelpCircle className="h-4 w-4 mr-3" />
                      {language === 'en' ? 'Help & Support' : 'सहायता'}
                    </button>
                    <div className="border-t my-1"></div>
                    <button
                      onClick={onLogout}
                      className={`flex items-center w-full px-4 py-2 text-sm ${isDarkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'}`}
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      {language === 'en' ? 'Logout' : 'लॉग आउट'}
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onScreenChange(item.id);
                        setIsMenuOpen(false);
                      }}
                      className={`flex items-center w-full px-3 py-3 rounded-lg text-base font-medium ${
                        currentScreen === item.id
                          ? `${isDarkMode ? 'bg-green-700 text-white' : 'bg-green-100 text-green-700'}`
                          : isDarkMode
                          ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </button>
                  );
                })}

                {/* Mobile User Actions */}
                <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-800">
                  <div className={`flex items-center px-3 py-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-600 to-green-700 flex items-center justify-center text-white font-semibold text-sm mr-3">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-base font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user.role?.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <button className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      <UserRound className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Profile' : 'प्रोफाइल'}
                    </button>
                    <button className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      <Settings className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Settings' : 'सेटिंग्स'}
                    </button>
                  </div>
                  <button
                    onClick={onLogout}
                    className={`mt-3 flex items-center w-full px-3 py-3 rounded-lg text-base font-medium ${
                      isDarkMode ? 'text-red-400 hover:bg-gray-800' : 'text-red-600 hover:bg-gray-100'
                    }`}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    {language === 'en' ? 'Logout' : 'लॉग आउट'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Backdrop for closing dropdown */}
      {isProfileDropdownOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileDropdownOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navigation;
