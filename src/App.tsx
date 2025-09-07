import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import ClaimSubmission from './components/ClaimSubmission';
import VerificationWorkspace from './components/VerificationWorkspace';
import DLCApproval from './components/DLCApproval';
import DSSLayer from './components/DSSLayer';
import PublicAtlas from './components/PublicAtlas';
import Navigation from './components/Navigation';

export type UserRole = 'gram_sabha' | 'frc' | 'sdlc' | 'dlc' | 'mota' | null;

export interface User {
  id: string;
  name: string;
  role: UserRole;
  district?: string;
  village?: string;
} 


function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const location = useLocation();
  const navigate = useNavigate();


  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };


  const handleLogout = () => {
    setCurrentUser(null);
  };


  if (!currentUser) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        language={language}
        setLanguage={setLanguage}
      />
    );
  }

  const currentScreen = location.pathname === '/' ? 'dashboard' : location.pathname.slice(1);
  const handleScreenChange = (screen: string) => {
    navigate(`/${screen}`);
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'
      }`}
    >
      {/* Persistent Navigation */}
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

      {/* Routes */}
      <main className="pt-16">
        <Routes>
          <Route
            path="/dashboard"
            element={<Dashboard user={currentUser} language={language} />}
          />
          <Route
            path="/claim-submission"
            element={<ClaimSubmission user={currentUser} language={language} />}
          />
          <Route
            path="/verification"
            element={<VerificationWorkspace user={currentUser} language={language} />}
          />
          <Route
            path="/dlc-approval"
            element={<DLCApproval user={currentUser} language={language} />}
          />
          <Route
            path="/dss"
            element={<DSSLayer user={currentUser} language={language} />}
          />
          <Route
            path="/public-atlas"
            element={<PublicAtlas language={language} />}
          />

          {/* Catch-all → Redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;