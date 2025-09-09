import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
// Import Firebase functions - you'll need to set up Firebase config
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
// import { doc, setDoc, getDoc } from 'firebase/firestore';
// import { auth, db } from '../firebase/config';

const AuthenticationForm = ({ formData, onLogin }) => {
  const { role, language, state, district, village } = formData;
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    confirmPassword: ''
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
        
        // For MVP - simulate Firebase auth
        // const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
        // const user = userCredential.user;

        // Create user profile in Firestore
        // await setDoc(doc(db, 'users', user.uid), {
        //   email: credentials.email,
        //   role: role,
        //   language: language,
        //   state: state,
        //   district: district,
        //   village: village,
        //   createdAt: new Date(),
        //   isApproved: role === 'public' ? true : false // Public users auto-approved
        // });

        // For MVP simulation
        simulateLogin();
      } else {
        // Login
        // const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
        // const user = userCredential.user;
        
        // Get user profile
        // const userDoc = await getDoc(doc(db, 'users', user.uid));
        // if (!userDoc.exists()) {
        //   throw new Error('User profile not found');
        // }
        
        // const userData = userDoc.data();
        
        // For MVP simulation
        simulateLogin();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const simulateLogin = () => {
    // MVP simulation - replace with actual Firebase data
    const user = {
      id: `${role}_${Date.now()}`,
      email: credentials.email,
      role: role,
      language: language,
      state: state,
      district: district,
      village: village,
      name: credentials.email.split('@')[0],
      isApproved: true
    };
    
    onLogin(user);
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