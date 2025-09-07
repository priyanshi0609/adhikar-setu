import React, { useState } from 'react';
import { MapPin, Users, FileCheck, Clock, Shield, Globe, Menu, Sun, Moon } from 'lucide-react';
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
  const [currentScreen, setCurrentScreen] = useState<string>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('login');
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} language={language} setLanguage={setLanguage} />;
  }

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard user={currentUser} language={language} />;
      case 'claim-submission':
        return <ClaimSubmission user={currentUser} language={language} />;
      case 'verification':
        return <VerificationWorkspace user={currentUser} language={language} />;
      case 'dlc-approval':
        return <DLCApproval user={currentUser} language={language} />;
      case 'dss':
        return <DSSLayer user={currentUser} language={language} />;
      case 'public-atlas':
        return <PublicAtlas language={language} />;
      default:
        return <Dashboard user={currentUser} language={language} />;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <Navigation
        user={currentUser}
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        language={language}
        setLanguage={setLanguage}
      />
      
      <main className="pt-16">
        {renderCurrentScreen()}import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    // Login view
    return <LoginScreen onLogin={handleLogin} language={language} setLanguage={setLanguage} />;
  }

  return (
    <Router>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
        
        {/* Navigation stays persistently */}
        <Navigation
          user={currentUser}
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          language={language}
          setLanguage={setLanguage}
        />

        {/* Routes */}
        <main className="pt-16">
          <Routes>
            <Route path="/dashboard" element={<Dashboard user={currentUser} language={language} />} />
            <Route path="/claim-submission" element={<ClaimSubmission user={currentUser} language={language} />} />
            <Route path="/verification" element={<VerificationWorkspace user={currentUser} language={language} />} />
            <Route path="/dlc-approval" element={<DLCApproval user={currentUser} language={language} />} />
            <Route path="/dss" element={<DSSLayer user={currentUser} language={language} />} />
            <Route path="/public-atlas" element={<PublicAtlas language={language} />} />
            
            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
      </main>
    </div>
  );
}

export default App;