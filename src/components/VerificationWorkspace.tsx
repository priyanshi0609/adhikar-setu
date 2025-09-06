import React, { useState } from 'react';
import { FileText, MapPin, MessageSquare, CheckCircle, XCircle, AlertCircle, Download, ZoomIn as Zoom } from 'lucide-react';
import type { User } from '../App';

interface VerificationWorkspaceProps {
  user: User;
  language: 'en' | 'hi';
}

const VerificationWorkspace: React.FC<VerificationWorkspaceProps> = ({ user, language }) => {
  const [selectedClaim, setSelectedClaim] = useState('CLM-2024-001');
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'FRC Officer',
      message: 'Documents are clear and complete',
      timestamp: '2 hours ago',
      type: 'info'
    },
    {
      id: 2,
      author: 'Field Surveyor',
      message: 'GPS coordinates verified on ground',
      timestamp: '1 day ago',
      type: 'success'
    }
  ]);
  const [newComment, setNewComment] = useState('');

  const claimsToReview = [
    { id: 'CLM-2024-001', claimant: 'Ram Singh', village: 'Jagdalpur', area: '2.5 Ha', status: 'pending', priority: 'high' },
    { id: 'CLM-2024-002', claimant: 'Sita Devi', village: 'Kondagaon', area: '1.8 Ha', status: 'review', priority: 'medium' },
    { id: 'CLM-2024-003', claimant: 'Krishna Babu', village: 'Keskal', area: '3.2 Ha', status: 'pending', priority: 'low' }
  ];

  const documents = [
    { id: 1, name: 'Aadhaar Card', type: 'pdf', size: '1.2 MB', status: 'verified' },
    { id: 2, name: 'Land Survey Map', type: 'pdf', size: '2.8 MB', status: 'pending' },
    { id: 3, name: 'Community Certificate', type: 'jpg', size: '890 KB', status: 'verified' },
    { id: 4, name: 'Land Photos', type: 'jpg', size: '3.1 MB', status: 'pending' }
  ];

  const handleApprove = () => {
    alert(`Claim ${selectedClaim} approved and forwarded to next level`);
  };

  const handleRequestMoreEvidence = () => {
    alert(`Additional evidence requested for claim ${selectedClaim}`);
  };

  const handleReject = () => {
    alert(`Claim ${selectedClaim} has been rejected`);
  };

  const addComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: user.name,
        message: newComment,
        timestamp: 'Just now',
        type: 'info' as const
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {language === 'en' ? 'Verification Workspace' : 'सत्यापन कार्यक्षेत्र'}
        </h1>
        <p className="mt-2 text-gray-600">
          {language === 'en' 
            ? 'Review and verify Forest Rights Act claims with supporting documents'
            : 'सहायक दस्तावेजों के साथ वन अधिकार अधिनियम दावों की समीक्षा और सत्यापन करें'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Claims List */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'en' ? 'Claims to Review' : 'समीक्षा के लिए दावे'}
            </h3>
            <div className="space-y-3">
              {claimsToReview.map((claim) => (
                <div
                  key={claim.id}
                  onClick={() => setSelectedClaim(claim.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedClaim === claim.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">{claim.id}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      claim.priority === 'high' ? 'bg-red-100 text-red-700' :
                      claim.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {claim.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{claim.claimant}</p>
                  <p className="text-xs text-gray-500">{claim.village} • {claim.area}</p>
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      claim.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {claim.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="xl:col-span-3 space-y-6">
          {/* Documents Panel */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {language === 'en' ? 'Documents Review' : 'दस्तावेज़ समीक्षा'}
              </h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg" title="Download All">
                  <Download className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg" title="Zoom View">
                  <Zoom className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Documents List */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-4">
                  {language === 'en' ? 'Uploaded Documents' : 'अपलोड किए गए दस्तावेज़'}
                </h4>
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-500">{doc.type.toUpperCase()} • {doc.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          doc.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {doc.status}
                        </span>
                        <button className="text-blue-600 hover:text-blue-800">
                          {language === 'en' ? 'View' : 'देखें'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Document Viewer */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-4">
                  {language === 'en' ? 'Document Preview' : 'दस्तावेज़ पूर्वावलोकन'}
                </h4>
                <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      {language === 'en' ? 'Select a document to preview' : 'पूर्वावलोकन के लिए एक दस्तावेज़ चुनें'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map and Location Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              {language === 'en' ? 'Location Verification' : 'स्थान सत्यापन'}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Location Details */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-4">
                  {language === 'en' ? 'Claim Details' : 'दावा विवरण'}
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {language === 'en' ? 'GPS Coordinates' : 'जीपीएस निर्देशांक'}
                    </label>
                    <p className="text-gray-900 font-mono">20.2961°N, 85.8245°E</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {language === 'en' ? 'Survey Number' : 'सर्वेक्षण संख्या'}
                    </label>
                    <p className="text-gray-900">SY/123/2024</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {language === 'en' ? 'Land Classification' : 'भूमि वर्गीकरण'}
                    </label>
                    <p className="text-gray-900">Forest Land (Revenue)</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {language === 'en' ? 'Boundaries Verified' : 'सीमाएं सत्यापित'}
                    </label>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-green-700">
                        {language === 'en' ? 'Yes' : 'हाँ'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Map */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-4">
                  {language === 'en' ? 'Parcel Boundaries' : 'पार्सल सीमाएं'}
                </h4>
                <div className="bg-gradient-to-br from-green-50 to-brown-50 rounded-lg h-80 flex items-center justify-center border-2 border-dashed border-green-200">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <p className="text-lg font-semibold text-gray-700">
                      {language === 'en' ? 'Claim Boundary Map' : 'दावा सीमा मानचित्र'}
                    </p>
                    <p className="text-gray-500 mt-2">
                      {language === 'en' 
                        ? 'Interactive map showing parcel boundaries and survey data'
                        : 'पार्सल सीमाओं और सर्वेक्षण डेटा को दिखाने वाला इंटरैक्टिव मैप'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'en' ? 'Verification Comments' : 'सत्यापन टिप्पणियां'}
            </h3>

            {/* Add Comment */}
            <div className="mb-6">
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={language === 'en' ? 'Add your verification comments...' : 'अपनी सत्यापन टिप्पणियां जोड़ें...'}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows={3}
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={addComment}
                      disabled={!newComment.trim()}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {language === 'en' ? 'Add Comment' : 'टिप्पणी जोड़ें'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    comment.type === 'success' ? 'bg-green-100' :
                    comment.type === 'warning' ? 'bg-yellow-100' :
                    'bg-blue-100'
                  }`}>
                    {comment.type === 'success' ? <CheckCircle className="h-5 w-5 text-green-600" /> :
                     comment.type === 'warning' ? <AlertCircle className="h-5 w-5 text-yellow-600" /> :
                     <MessageSquare className="h-5 w-5 text-blue-600" />}
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">{comment.author}</p>
                      <p className="text-sm text-gray-500">{comment.timestamp}</p>
                    </div>
                    <p className="text-gray-700">{comment.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleReject}
                className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                <XCircle className="h-5 w-5 mr-2" />
                {language === 'en' ? 'Reject Claim' : 'दावा अस्वीकार करें'}
              </button>
              
              <button
                onClick={handleRequestMoreEvidence}
                className="flex items-center justify-center px-6 py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
              >
                <AlertCircle className="h-5 w-5 mr-2" />
                {language === 'en' ? 'Request More Evidence' : 'अधिक साक्ष्य का अनुरोध करें'}
              </button>
              
              <button
                onClick={handleApprove}
                className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                {language === 'en' ? 'Approve & Forward' : 'स्वीकार करें और आगे भेजें'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationWorkspace;