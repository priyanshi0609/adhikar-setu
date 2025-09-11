import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { registerUser, loginUser } from '../firebase/authService';

const AuthenticationForm = ({ formData, onLogin }) => {
  const { role, language, state, district, village } = formData;
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    organization: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getRoleName = () => {
    const roleNames = {
      gram_sabha: language === 'hi' ? 'ग्राम सभा / दावेदार' : 'Gram Sabha / Claimant',
      frc: language === 'hi' ? 'वन अधिकार समिति' : 'Forest Rights Committee',
      revenue_officer: language === 'hi' ? 'राजस्व अधिकारी' : 'Revenue Officer',
      sdlc: language === 'hi' ? 'उप-मंडल समिति' : 'Sub-Divisional Committee',
      dlc: language === 'hi' ? 'जिला स्तरीय समिति' : 'District Level Committee',
      slmc: language === 'hi' ? 'राज्य स्तरीय निगरानी समिति' : 'State Level Monitoring Committee',
      mota: language === 'hi' ? 'जनजातीय कार्य मंत्रालय' : 'Ministry of Tribal Affairs',
      ngo: language === 'hi' ? 'एनजीओ / अनुसंधानकर्ता' : 'NGO / Researcher'
    };
    return roleNames[role] || role;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!isLogin) {
        // Registration
        if (credentials.password !== credentials.confirmPassword) {
          throw new Error(language === 'hi' ? 'पासवर्ड मैच नहीं कर रहे' : 'Passwords do not match');
        }
        
        // Register user with Firebase
        const registrationData = {
          email: credentials.email,
          password: credentials.password,
          role: role,
          language: language,
          state: state,
          district: district,
          village: village,
          name: credentials.name || credentials.email.split('@')[0],
          phone: credentials.phone,
          organization: credentials.organization
        };

        const result = await registerUser(registrationData);
        
        if (!result.success) {
          throw new Error(result.error);
        }
        
        // For roles that don't need approval, log them in immediately
        if (role === 'public' || role === 'gram_sabha') {
          const loginResult = await loginUser(credentials.email, credentials.password);
          
          if (!loginResult.success) {
            throw new Error(loginResult.error);
          }
          
          onLogin(loginResult.user);
        } else {
          // For roles that need approval, show success message
          setError(language === 'hi' 
            ? 'पंजीकरण सफल! प्रशासक द्वारा अनुमोदन की प्रतीक्षा करें।' 
            : 'Registration successful! Please wait for administrator approval.'
          );
          setIsLogin(true); // Switch to login form
        }
      } else {
        // Login
        const result = await loginUser(credentials.email, credentials.password);
        
        if (!result.success) {
          throw new Error(result.error);
        }
        
        onLogin(result.user);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (role === 'public') {
    // Public users don't need authentication
    React.useEffect(() => {
      const publicUser = {
        id: 'public_user',
        role: 'public',
        language: language,
        name: 'Public User',
        isApproved: true
      };
      onLogin(publicUser);
    }, []);

    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p>{language === 'hi' ? 'सार्वजनिक डैशबोर्ड लोड हो रहा है...' : 'Loading public dashboard...'}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {language === 'hi' ? 'प्रमाणीकरण' : 'Authentication'}
        </h2>
        <p className="text-gray-600 text-sm">
          {getRoleName()} - {language === 'hi' ? 'कृपया लॉगिन करें' : 'Please sign in'}
        </p>
      </div>

      {/* Auth Toggle */}
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
          }`}
        >
          {language === 'hi' ? 'लॉगिन' : 'Sign In'}
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            !isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
          }`}
        >
          {language === 'hi' ? 'पंजीकरण' : 'Sign Up'}
        </button>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        {/* Name (for registration only) */}
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'hi' ? 'पूरा नाम' : 'Full Name'}
            </label>
            <input
              type="text"
              required
              value={credentials.name}
              onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder={language === 'hi' ? 'आपका पूरा नाम दर्ज करें' : 'Enter your full name'}
            />
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'hi' ? 'ईमेल' : 'Email'}
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              required
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder={language === 'hi' ? 'आपका ईमेल दर्ज करें' : 'Enter your email'}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'hi' ? 'पासवर्ड' : 'Password'}
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder={language === 'hi' ? 'आपका पासवर्ड दर्ज करें' : 'Enter your password'}
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

        {/* Confirm Password for Registration */}
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'hi' ? 'पासवर्ड की पुष्टि करें' : 'Confirm Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={credentials.confirmPassword}
                onChange={(e) => setCredentials({ ...credentials, confirmPassword: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder={language === 'hi' ? 'पासवर्ड दोबारा दर्ज करें' : 'Confirm your password'}
              />
            </div>
          </div>
        )}

        {/* Phone and Organization (for registration only) */}
        {!isLogin && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'hi' ? 'फोन नंबर' : 'Phone Number'}
              </label>
              <input
                type="tel"
                value={credentials.phone}
                onChange={(e) => setCredentials({ ...credentials, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder={language === 'hi' ? 'फोन नंबर' : 'Phone number'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'hi' ? 'संगठन' : 'Organization'}
              </label>
              <input
                type="text"
                value={credentials.organization}
                onChange={(e) => setCredentials({ ...credentials, organization: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder={language === 'hi' ? 'संगठन का नाम' : 'Organization name'}
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            language === 'hi' ? (isLogin ? 'लॉगिन करें' : 'पंजीकरण करें') : (isLogin ? 'Sign In' : 'Sign Up')
          )}
        </button>
      </form>

      {/* Location Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">
          {language === 'hi' ? 'चयनित जानकारी:' : 'Selected Information:'}
        </h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p><span className="font-medium">{language === 'hi' ? 'भूमिका:' : 'Role:'}</span> {getRoleName()}</p>
          <p><span className="font-medium">{language === 'hi' ? 'भाषा:' : 'Language:'}</span> {language === 'hi' ? 'हिंदी' : 'English'}</p>
          {state && <p><span className="font-medium">{language === 'hi' ? 'राज्य:' : 'State:'}</span> {state}</p>}
          {district && <p><span className="font-medium">{language === 'hi' ? 'जिला:' : 'District:'}</span> {district}</p>}
          {village && <p><span className="font-medium">{language === 'hi' ? 'गांव:' : 'Village:'}</span> {village}</p>}
        </div>
      </div>
    </div>
  );
};

export default AuthenticationForm;