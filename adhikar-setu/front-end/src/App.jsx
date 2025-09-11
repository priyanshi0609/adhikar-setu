import React, { useState, lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './pages/LandingPage';
import Navigation from './components/Navigation';
import LoginContainer from './Login/LoginContainer';
import { onAuthStateChange, getCurrentUserProfile } from './firebase/authService';
import DSS from './dss/pages/DSS';

// Lazy load route components for better performance
const Dashboard = lazy(() => import('./components/Dashboard'));
const ClaimSubmission = lazy(() => import('./components/ClaimSubmission'));
const VerificationWorkspace = lazy(() => import('./components/VerificationWorkspace'));
const DLCApproval = lazy(() => import('./components/DLCApproval'));
const DSSLayer = lazy(() => import('./components/DSSLayer'));
const PublicAtlas = lazy(() => import('./components/PublicAtlas'));


// ---------- Protected Route Component ----------
const ProtectedRoute = ({
  children,
  allowedRoles,
  user,
  language
}) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {language === 'en' ? 'Access Denied' : 'पहुंच अस्वीकृत'}
          </h2>
          <p className="text-gray-600">
            {language === 'en'
              ? 'You do not have permission to access this page.'
              : 'आपके पास इस पृष्ठ तक पहुंचने की अनुमति नहीं है।'
            }
          </p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

// ---------- Error Boundary Component ----------
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              {this.props.language === 'en' ? 'Something went wrong' : 'कुछ गलत हो गया'}
            </h2>
            <p className="text-gray-600 mb-4">
              {this.props.language === 'en'
                ? 'An error occurred while loading this page.'
                : 'इस पृष्ठ को लोड करते समय एक त्रुटि हुई।'
              }
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: undefined })}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              {this.props.language === 'en' ? 'Try Again' : 'पुनः प्रयास करें'}
            </button>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        // User is signed in
        const userProfile = await getCurrentUserProfile(user.uid);
        if (userProfile.success) {
          setCurrentUser(userProfile.user);
        } else {
          console.error('Error getting user profile:', userProfile.error);
          setCurrentUser(null);
        }
      } else {
        // User is signed out
        setCurrentUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    navigate('/dashboard'); // Redirect to dashboard after login
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/'); // Redirect to landing page after logout
  };

  const currentScreen = location.pathname === '/login' ? '/dashboard' :
    location.pathname.slice(1);

  const handleScreenChange = (screen) => {
    navigate(`/${screen}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'
        }`}
    >
      {/* Show navigation only when user is logged in */}
      {currentUser && (
        <Navigation
          user={currentUser}
          currentScreen={currentScreen}
          onScreenChange={handleScreenChange}
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          language={language}
          setLanguage={setLanguage}
        />
      )}

      {/* Routes */}
      <main className={currentUser ? 'pt-16' : ''}>
        <ErrorBoundary language={language}>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {language === 'en' ? 'Loading...' : 'लोड हो रहा है...'}
                </p>
              </div>
            </div>
          }>
            <Routes>
              {/* Landing Page Route */}
              <Route
                path="/"
                element={<HomePage />}
              />
              <Route path="/dss" element={<DSS />} />

              {/* Login Route */}
              <Route
                path="/login"
                element={
                  currentUser ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <LoginContainer onLogin={handleLogin} />
                  )
                }
              />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute
                    allowedRoles={['gram_sabha', 'frc', 'sdlc', 'dlc', 'mota']}
                    user={currentUser}
                    language={language}
                  >
                    <Dashboard user={currentUser} language={language} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/claim-submission"
                element={
                  <ProtectedRoute
                    allowedRoles={['gram_sabha']}
                    user={currentUser}
                    language={language}
                  >
                    <ClaimSubmission user={currentUser} language={language} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/verification"
                element={
                  <ProtectedRoute
                    allowedRoles={['frc', 'sdlc']}
                    user={currentUser}
                    language={language}
                  >
                    <VerificationWorkspace user={currentUser} language={language} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dlc-approval"
                element={
                  <ProtectedRoute
                    allowedRoles={['dlc']}
                    user={currentUser}
                    language={language}
                  >
                    <DLCApproval user={currentUser} language={language} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dss"
                element={
                  <ProtectedRoute
                    allowedRoles={['sdlc', 'dlc', 'mota']}
                    user={currentUser}
                    language={language}
                  >
                    <DSSLayer user={currentUser} language={language} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/public-atlas"
                element={
                  <ProtectedRoute
                    allowedRoles={['gram_sabha', 'frc', 'sdlc', 'dlc', 'mota']}
                    user={currentUser}
                    language={language}
                  >
                    <PublicAtlas language={language} />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all → Redirect to appropriate page */}
              <Route
                path="*"
                element={
                  currentUser ?
                    <Navigate to="/dashboard" replace /> :
                    <Navigate to="/" replace />
                }
              />
              
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;