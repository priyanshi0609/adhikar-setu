import React from 'react';
import { 
  Home, FileText, CheckSquare, Award, BarChart3, Globe, 
  LogOut, Sun, Moon, Languages, Menu, X 
} from 'lucide-react';
import type { User } from '../App';

interface NavigationProps {
  user: User;
  currentScreen: string;
  onScreenChange: (screen: string) => void;
  onLogout: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
}

const Navigation: React.FC<NavigationProps> = ({
  user,
  currentScreen,
  onScreenChange,
  onLogout,
  isDarkMode,
  setIsDarkMode,
  language,
  setLanguage
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const getMenuItems = () => {
    const allItems = [
      { id: 'dashboard', name: language === 'en' ? 'Dashboard' : 'डैशबोर्ड', icon: Home, roles: ['gram_sabha', 'frc', 'sdlc', 'dlc', 'mota'] },
      { id: 'claim-submission', name: language === 'en' ? 'Submit Claim' : 'दावा जमा करें', icon: FileText, roles: ['gram_sabha'] },
      { id: 'verification', name: language === 'en' ? 'Verification' : 'सत्यापन', icon: CheckSquare, roles: ['frc', 'sdlc'] },
      { id: 'dlc-approval', name: language === 'en' ? 'Approval' : 'अनुमोदन', icon: Award, roles: ['dlc'] },
      { id: 'dss', name: language === 'en' ? 'Decision Support' : 'निर्णय सहायता', icon: BarChart3, roles: ['sdlc', 'dlc', 'mota'] },
      { id: 'public-atlas', name: language === 'en' ? 'Public Atlas' : 'सार्वजनिक एटलस', icon: Globe, roles: ['gram_sabha', 'frc', 'sdlc', 'dlc', 'mota'] }
    ];

    return allItems.filter(item => item.roles.includes(user.role!));
  };

  const menuItems = getMenuItems();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-green-600 to-brown-600 p-2 rounded-lg">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    FRA Atlas DSS
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onScreenChange(item.id)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentScreen === item.id
                        ? 'bg-green-100 text-green-700'
                        : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Menu and Controls */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className={`p-2 rounded-md ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              title={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
            >
              <Languages className="h-5 w-5" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-md ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* User Info */}
            <div className={`hidden md:flex items-center space-x-3 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
              <div className="text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">
                  {user.role?.replace('_', ' ')}
                </p>
              </div>
              <button
                onClick={onLogout}
                className={`p-2 rounded-md ${isDarkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-600'}`}
                title={language === 'en' ? 'Logout' : 'लॉग आउट'}
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-md ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onScreenChange(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      currentScreen === item.id
                        ? 'bg-green-100 text-green-700'
                        : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </button>
                );
              })}
              
              {/* Mobile User Actions */}
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className={`flex items-center px-3 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                  <div>
                    <p className="text-base font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500 capitalize">
                      {user.role?.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className={`mt-3 flex items-center w-full px-3 py-2 rounded-md text-base font-medium ${
                    isDarkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'
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
  );
};

export default Navigation;