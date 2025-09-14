// components/ClaimStatus.jsx
import React from 'react';
import { CLAIM_STATUS } from '../constants/fraFields.js';

const ClaimStatus = ({ status, updatedAt }) => {
  const getStatusConfig = (status) => {
    const configs = {
      [CLAIM_STATUS.DRAFT]: {
        label: 'Draft',
        color: '#6B7280',
        icon: '📝',
        description: 'Claim is being prepared'
      },
      [CLAIM_STATUS.SUBMITTED]: {
        label: 'Submitted',
        color: '#3B82F6',
        icon: '📤',
        description: 'Submitted to Forest Rights Committee'
      },
      [CLAIM_STATUS.VERIFIED]: {
        label: 'Verified',
        color: '#8B5CF6',
        icon: '✅',
        description: 'Documents and fields verified'
      },
      [CLAIM_STATUS.HEARING]: {
        label: 'Hearing',
        color: '#F59E0B',
        icon: '🏛️',
        description: 'Under review at committee level'
      },
      [CLAIM_STATUS.FINAL]: {
        label: 'Final Review',
        color: '#EF4444',
        icon: '⚖️',
        description: 'Final decision pending'
      },
      [CLAIM_STATUS.APPROVED]: {
        label: 'Approved',
        color: '#10B981',
        icon: '🎉',
        description: 'Claim approved - Title ready for download'
      },
      [CLAIM_STATUS.REJECTED]: {
        label: 'Rejected',
        color: '#EF4444',
        icon: '❌',
        description: 'Claim rejected - Appeal possible'
      }
    };
    return configs[status] || configs[CLAIM_STATUS.DRAFT];
  };

  const statusConfig = getStatusConfig(status);

  const getStatusSteps = () => {
    const allSteps = [
      CLAIM_STATUS.SUBMITTED,
      CLAIM_STATUS.VERIFIED,
      CLAIM_STATUS.HEARING,
      CLAIM_STATUS.FINAL,
      status === CLAIM_STATUS.APPROVED ? CLAIM_STATUS.APPROVED : CLAIM_STATUS.REJECTED
    ];

    const currentIndex = allSteps.indexOf(status);
    
    return allSteps.map((step, index) => ({
      ...getStatusConfig(step),
      isCompleted: index <= currentIndex,
      isCurrent: index === currentIndex,
      isRejected: step === CLAIM_STATUS.REJECTED && status === CLAIM_STATUS.REJECTED
    }));
  };

  return (
    <div className="claim-status">
      <div className="current-status">
        <div 
          className="status-badge"
          style={{ backgroundColor: statusConfig.color }}
        >
          <span className="status-icon">{statusConfig.icon}</span>
          <span className="status-label">{statusConfig.label}</span>
        </div>
        <p className="status-description">{statusConfig.description}</p>
        {updatedAt && (
          <p className="status-date">
            Updated: {new Date(updatedAt.toDate()).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        )}
      </div>

      <div className="status-timeline">
        <h4>Progress Timeline</h4>
        <div className="timeline">
          {getStatusSteps().map((step, index) => (
            <div 
              key={step.label}
              className={`timeline-step ${step.isCompleted ? 'completed' : ''} ${step.isCurrent ? 'current' : ''} ${step.isRejected ? 'rejected' : ''}`}
            >
              <div className="step-marker">
                <span className="step-icon">{step.icon}</span>
              </div>
              <div className="step-content">
                <h5>{step.label}</h5>
                <p>{step.description}</p>
              </div>
              {index < getStatusSteps().length - 1 && (
                <div className="step-connector"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {status === CLAIM_STATUS.APPROVED && (
        <div className="approved-actions">
          <button className="download-title-btn">
            📄 Download Title Document
          </button>
        </div>
      )}

      {status === CLAIM_STATUS.REJECTED && (
        <div className="rejected-actions">
          <p className="rejection-info">
            Your claim has been rejected. You can file an appeal within 60 days.
          </p>
          <button className="appeal-btn">
            📝 File Appeal
          </button>
        </div>
      )}
    </div>
  );
};

export default ClaimStatus;