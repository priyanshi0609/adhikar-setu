import { CLAIM_STATUS } from "../constants/fraFields.js";

const ClaimStatus = ({ status, updatedAt }) => {
  const getStatusConfig = (status) => {
    const configs = {
      [CLAIM_STATUS.DRAFT]: {
        label: "Draft",
        color: "bg-gray-100 text-gray-800",
        icon: "📝",
        description: "Claim is being prepared",
      },
      [CLAIM_STATUS.SUBMITTED]: {
        label: "Submitted",
        color: "bg-blue-100 text-blue-800",
        icon: "📤",
        description: "Submitted to Forest Rights Committee",
      },
      [CLAIM_STATUS.VERIFIED]: {
        label: "Verified",
        color: "bg-purple-100 text-purple-800",
        icon: "✅",
        description: "Documents and fields verified",
      },
      [CLAIM_STATUS.HEARING]: {
        label: "Hearing",
        color: "bg-yellow-100 text-yellow-800",
        icon: "🏛️",
        description: "Under review at committee level",
      },
      [CLAIM_STATUS.FINAL]: {
        label: "Final Review",
        color: "bg-orange-100 text-orange-800",
        icon: "⚖️",
        description: "Final decision pending",
      },
      [CLAIM_STATUS.APPROVED]: {
        label: "Approved",
        color: "bg-green-100 text-green-800",
        icon: "🎉",
        description: "Claim approved - Title ready for download",
      },
      [CLAIM_STATUS.REJECTED]: {
        label: "Rejected",
        color: "bg-red-100 text-red-800",
        icon: "❌",
        description: "Claim rejected - Appeal possible",
      },
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
      status === CLAIM_STATUS.APPROVED
        ? CLAIM_STATUS.APPROVED
        : CLAIM_STATUS.REJECTED,
    ];

    const currentIndex = allSteps.indexOf(status);

    return allSteps.map((step, index) => ({
      ...getStatusConfig(step),
      isCompleted: index <= currentIndex,
      isCurrent: index === currentIndex,
      isRejected:
        step === CLAIM_STATUS.REJECTED && status === CLAIM_STATUS.REJECTED,
    }));
  };

  return (
    <div className="space-y-8">
      {/* Current Status */}
      <div className="text-center">
        <div
          className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full ${statusConfig.color}`}
        >
          <span className="text-2xl">{statusConfig.icon}</span>
          <span className="font-semibold text-lg">{statusConfig.label}</span>
        </div>
        <p className="text-gray-600 mt-3 text-lg">{statusConfig.description}</p>
        {updatedAt && (
          <p className="text-sm text-gray-500 mt-2">
            Updated:{" "}
            {updatedAt
              ? new Date(updatedAt.seconds * 1000).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "N/A"}
          </p>
        )}
      </div>

      {/* Progress Timeline */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-6">
          Progress Timeline
        </h4>
        <div className="space-y-6">
          {getStatusSteps().map((step, index) => (
            <div key={step.label} className="flex items-start space-x-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    step.isCompleted
                      ? step.isRejected
                        ? "bg-red-100 text-red-600"
                        : "bg-emerald-100 text-emerald-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step.icon}
                </div>
                {index < getStatusSteps().length - 1 && (
                  <div
                    className={`w-0.5 h-12 mt-2 ${
                      step.isCompleted ? "bg-emerald-300" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
              <div className="flex-1 pb-8">
                <h5
                  className={`font-medium ${
                    step.isCurrent ? "text-emerald-600" : "text-gray-900"
                  }`}
                >
                  {step.label}
                </h5>
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      {status === CLAIM_STATUS.APPROVED && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <h4 className="text-lg font-semibold text-green-900 mb-2">
            Congratulations!
          </h4>
          <p className="text-green-700 mb-4">
            Your claim has been approved. You can now download your title
            document.
          </p>
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
            📄 Download Title Document
          </button>
        </div>
      )}

      {status === CLAIM_STATUS.REJECTED && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h4 className="text-lg font-semibold text-red-900 mb-2">
            Claim Rejected
          </h4>
          <p className="text-red-700 mb-4">
            Your claim has been rejected. You can file an appeal within 60 days
            of this decision.
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
            📝 File Appeal
          </button>
        </div>
      )}
    </div>
  );
};

export default ClaimStatus;
