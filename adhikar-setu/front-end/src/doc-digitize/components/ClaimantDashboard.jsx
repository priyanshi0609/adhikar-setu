// components/ClaimantDashboard.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase.js';
import NewClaim from './NewClaim.jsx';
import ClaimDetail from './ClaimDetail.jsx';
import ClaimStatus from './ClaimStatus.jsx';
import { CLAIM_STATUS } from '../constants/fraFields.js';

const ClaimantDashboard = ({ user }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'fra_claims'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const claimsData = [];
      querySnapshot.forEach((doc) => {
        claimsData.push({ id: doc.id, ...doc.data() });
      });
      setClaims(claimsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredClaims = claims.filter(claim =>
    claim.fields?.claimantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.fields?.village?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.formType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStats = () => {
    const stats = {
      total: claims.length,
      submitted: claims.filter(c => c.status === CLAIM_STATUS.SUBMITTED).length,
      verified: claims.filter(c => c.status === CLAIM_STATUS.VERIFIED).length,
      approved: claims.filter(c => c.status === CLAIM_STATUS.APPROVED).length,
      rejected: claims.filter(c => c.status === CLAIM_STATUS.REJECTED).length
    };
    return stats;
  };

  const handleNewClaim = () => {
    setCurrentView('new-claim');
  };

  const handleViewClaim = (claim) => {
    setSelectedClaim(claim);
    setCurrentView('claim-detail');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedClaim(null);
  };

  const handleClaimCreated = (newClaim) => {
    if (newClaim) {
      setClaims(prev => [newClaim, ...prev]);
    }
    setCurrentView('dashboard');
  };

  if (currentView === 'new-claim') {
    return (
      <NewClaim
        user={user}
        onClaimCreated={handleClaimCreated}
      />
    );
  }

  if (currentView === 'claim-detail' && selectedClaim) {
    return (
      <ClaimDetail
        claim={selectedClaim}
        onBack={handleBackToDashboard}
      />
    );
  }

  const stats = getStatusStats();

  return (
    <div className="claimant-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>FRA Claims Dashboard</h1>
          <p>Welcome, {user.displayName || user.email}</p>
        </div>
        
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search claims, holders, villages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button onClick={handleNewClaim} className="new-claim-btn primary">
            Start New Claim
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="main-content">
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-info">
                <h3>{stats.total}</h3>
                <p>Total Claims</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">📤</div>
              <div className="stat-info">
                <h3>{stats.submitted}</h3>
                <p>Submitted</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3>{stats.verified}</h3>
                <p>Verified</p>
              </div>
            </div>
            
            <div className="stat-card success">
              <div className="stat-icon">🎉</div>
              <div className="stat-info">
                <h3>{stats.approved}</h3>
                <p>Approved</p>
              </div>
            </div>
          </div>

          <div className="claims-section">
            <div className="section-header">
              <h2>My Claims</h2>
              <div className="section-meta">
                <span>{filteredClaims.length} claims found</span>
              </div>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading claims...</p>
              </div>
            ) : filteredClaims.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📄</div>
                <h3>No Claims Found</h3>
                <p>
                  {searchTerm ? 
                    'No claims match your search criteria.' : 
                    'You haven\'t submitted any FRA claims yet.'
                  }
                </p>
                {!searchTerm && (
                  <button onClick={handleNewClaim} className="start-claim-btn">
                    Submit Your First Claim
                  </button>
                )}
              </div>
            ) : (
              <div className="claims-list">
                {filteredClaims.map((claim) => (
                  <div key={claim.id} className="claim-card">
                    <div className="claim-header">
                      <div className="claim-title">
                        <h3>{claim.formType?.replace('_', ' ')} - {claim.fields?.claimantName || 'Unknown'}</h3>
                        <p className="claim-location">
                          {claim.fields?.village}, {claim.fields?.district}
                        </p>
                      </div>
                      <div className="claim-date">
                        {new Date(claim.createdAt?.toDate()).toLocaleDateString('en-IN')}
                      </div>
                    </div>

                    <div className="claim-status-mini">
                      <ClaimStatus status={claim.status} updatedAt={claim.updatedAt} />
                    </div>

                    <div className="claim-actions">
                      <button 
                        onClick={() => handleViewClaim(claim)}
                        className="view-claim-btn"
                      >
                        View Details
                      </button>
                      
                      {claim.status === CLAIM_STATUS.APPROVED && (
                        <button className="download-title-btn success">
                          Download Title
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="sidebar">
          <div className="help-section">
            <h3>Help & FAQ</h3>
            <p>Documented FRA rules and guidelines</p>
            <ul className="help-links">
              <li><a href="#" onClick={(e) => e.preventDefault()}>How to fill Form A</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Required documents (Rule 13)</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Understanding the process</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Appeal procedure</a></li>
            </ul>
          </div>

          <div className="messages-section">
            <h3>Messages / Notices</h3>
            <p>Hearing notices and updates</p>
            <div className="messages-list">
              <div className="message-item">
                <div className="message-icon">📢</div>
                <div className="message-content">
                  <p>Gram Sabha meeting scheduled for verification</p>
                  <small>2 days ago</small>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Consent & Profile</h3>
            <p>Personal information and consent forms</p>
            <button className="profile-btn">Update Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimantDashboard;