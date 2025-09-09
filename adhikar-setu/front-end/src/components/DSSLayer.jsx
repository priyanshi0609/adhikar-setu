import React, { useState } from 'react';
import { BarChart3, TrendingUp, Droplets, Wifi, TreePine, Users, AlertTriangle, CheckCircle } from 'lucide-react';

const DSSLayer = ({ user, language }) => {
  const [activeOverlay, setActiveOverlay] = useState('land-use');
  const [selectedVillage, setSelectedVillage] = useState('Jagdalpur');

  const overlayLayers = [
    {
      id: 'land-use',
      name: language === 'en' ? 'Land Use Classification' : 'भूमि उपयोग वर्गीकरण',
      icon: TreePine,
      description: language === 'en' ? 'AI-classified land use patterns' : 'AI-वर्गीकृत भूमि उपयोग पैटर्न',
      color: 'bg-green-500'
    },
    {
      id: 'water-bodies',
      name: language === 'en' ? 'Water Bodies' : 'जल निकाय',
      icon: Droplets,
      description: language === 'en' ? 'Rivers, lakes, and water sources' : 'नदियां, झीलें और जल स्रोत',
      color: 'bg-blue-500'
    },
    {
      id: 'forest-cover',
      name: language === 'en' ? 'Forest Cover' : 'वन आवरण',
      icon: TreePine,
      description: language === 'en' ? 'Forest density analysis' : 'वन घनत्व विश्लेषण',
      color: 'bg-green-600'
    },
    {
      id: 'infrastructure',
      name: language === 'en' ? 'Infrastructure' : 'अवसंरचना',
      icon: Wifi,
      description: language === 'en' ? 'Roads, schools, hospitals' : 'सड़कें, स्कूल, अस्पताल',
      color: 'bg-purple-500'
    }
  ];

  const recommendations = [
    {
      id: 1,
      type: 'scheme',
      priority: 'high',
      title: language === 'en' ? 'PM-KISAN Eligibility' : 'PM-KISAN पात्रता',
      description: language === 'en' 
        ? 'Village Jagdalpur has 847 eligible farmers for PM-KISAN scheme based on land records'
        : 'भूमि रिकॉर्ड के आधार पर जगदलपुर गांव में PM-KISAN योजना के लिए 847 पात्र किसान हैं',
      action: language === 'en' ? 'Generate Beneficiary List' : 'लाभार्थी सूची बनाएं',
      icon: Users
    },
    {
      id: 2,
      type: 'infrastructure',
      priority: 'medium',
      title: language === 'en' ? 'Water Infrastructure Gap' : 'जल अवसंरचना अंतर',
      description: language === 'en' 
        ? 'Low water availability index detected. Recommend for Jal Jeevan Mission priority list'
        : 'कम पानी की उपलब्धता सूचकांक का पता चला। जल जीवन मिशन प्राथमिकता सूची के लिए सुझाव',
      action: language === 'en' ? 'Add to JJM Priority' : 'JJM प्राथमिकता में जोड़ें',
      icon: Droplets
    },
    {
      id: 3,
      type: 'forest',
      priority: 'high',
      title: language === 'en' ? 'Forest Degradation Alert' : 'वन क्षरण चेतावनी',
      description: language === 'en' 
        ? 'Satellite imagery shows 12% forest cover reduction in Grid-C23. Immediate attention required'
        : 'उपग्रह इमेजरी ग्रिड-C23 में 12% वन आवरण कमी दिखाती है। तत्काल ध्यान की आवश्यकता',
      action: language === 'en' ? 'Schedule Field Survey' : 'फील्ड सर्वे निर्धारित करें',
      icon: AlertTriangle
    },
    {
      id: 4,
      type: 'development',
      priority: 'low',
      title: language === 'en' ? 'MGNREGA Work Opportunity' : 'MGNREGA कार्य अवसर',
      description: language === 'en' 
        ? 'High unemployment index in sector 4. Suitable for watershed development projects'
        : 'सेक्टर 4 में उच्च बेरोजगारी सूचकांक। वाटरशेड डेवलपमेंट प्रोजेक्ट के लिए उपयुक्त',
      action: language === 'en' ? 'Plan MGNREGA Works' : 'MGNREGA कार्यों की योजना बनाएं',
      icon: Users
    }
  ];

  const analyticsData = [
    {
      title: language === 'en' ? 'Total Forest Area' : 'कुल वन क्षेत्र',
      value: '45,672 Ha',
      change: '-2.3%',
      trend: 'down',
      color: 'text-red-600'
    },
    {
      title: language === 'en' ? 'Water Index Score' : 'पानी सूचकांक स्कोर',
      value: '6.8/10',
      change: '-0.5',
      trend: 'down',
      color: 'text-yellow-600'
    },
    {
      title: language === 'en' ? 'Infrastructure Score' : 'अवसंरचना स्कोर',
      value: '7.2/10',
      change: '+0.3',
      trend: 'up',
      color: 'text-green-600'
    },
    {
      title: language === 'en' ? 'Development Index' : 'विकास सूचकांक',
      value: '0.687',
      change: '+0.02',
      trend: 'up',
      color: 'text-green-600'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {language === 'en' ? 'Decision Support System' : 'निर्णय सहायता प्रणाली'}
        </h1>
        <p className="mt-2 text-gray-600">
          {language === 'en' 
            ? 'AI-powered insights and recommendations for policy decisions'
            : 'नीतिगत निर्णयों के लिए AI-संचालित अंतर्दृष्टि और सिफारिशें'
          }
        </p>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {analyticsData.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
              </div>
              <div className={`flex items-center ${metric.color}`}>
                <TrendingUp className={`h-5 w-5 mr-1 ${metric.trend === 'down' ? 'transform rotate-180' : ''}`} />
                <span className="text-sm font-medium">{metric.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Overlay Controls */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'en' ? 'Map Overlays' : 'मैप ओवरले'}
            </h3>
            <div className="space-y-3">
              {overlayLayers.map((layer) => {
                const Icon = layer.icon;
                return (
                  <button
                    key={layer.id}
                    onClick={() => setActiveOverlay(layer.id)}
                    className={`w-full p-4 rounded-lg border text-left transition-all duration-200 ${
                      activeOverlay === layer.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`${layer.color} p-2 rounded-lg mr-3 flex-shrink-0`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 mb-1">{layer.name}</p>
                        <p className="text-sm text-gray-600">{layer.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Village Selector */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Focus Village' : 'फोकस गांव'}
              </label>
              <select
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="Jagdalpur">Jagdalpur</option>
                <option value="Kondagaon">Kondagaon</option>
                <option value="Keskal">Keskal</option>
                <option value="Bakawand">Bakawand</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="xl:col-span-3 space-y-6">
          {/* Interactive Map */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {language === 'en' ? 'GIS Analysis Map' : 'GIS विश्लेषण मैप'}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {language === 'en' ? 'Active Layer:' : 'सक्रिय स्तर:'}
                </span>
                <span className="text-sm font-medium text-green-600">
                  {overlayLayers.find(l => l.id === activeOverlay)?.name}
                </span>
              </div>
            </div>

            {/* Map Visualization */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg h-96 flex items-center justify-center border-2 border-dashed border-green-200 relative">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-700">
                  {language === 'en' ? 'Advanced GIS Analytics' : 'उन्नत GIS विश्लेषण'}
                </p>
                <p className="text-gray-500 mt-2">
                  {language === 'en' 
                    ? `Showing ${overlayLayers.find(l => l.id === activeOverlay)?.name} for ${selectedVillage}`
                    : `${selectedVillage} के लिए ${overlayLayers.find(l => l.id === activeOverlay)?.name} दिखा रहा है`
                  }
                </p>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-sm">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  {language === 'en' ? 'Legend' : 'व्याख्या'}
                </h4>
                <div className="space-y-1">
                  <div className="flex items-center text-xs">
                    <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                    <span>{language === 'en' ? 'High Density' : 'उच्च घनत्व'}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                    <span>{language === 'en' ? 'Medium Density' : 'मध्यम घनत्व'}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                    <span>{language === 'en' ? 'Low Density' : 'कम घनत्व'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'en' ? 'AI-Powered Recommendations' : 'AI-संचालित सिफारिशें'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec) => {
                const Icon = rec.icon;
                return (
                  <div key={rec.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-3 ${
                          rec.priority === 'high' ? 'bg-red-100' :
                          rec.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            rec.priority === 'high' ? 'text-red-600' :
                            rec.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{rec.title}</p>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                            rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {rec.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{rec.description}</p>
                    
                    <button className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                      rec.priority === 'high' ? 'bg-red-600 hover:bg-red-700 text-white' :
                      rec.priority === 'medium' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' :
                      'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}>
                      {rec.action}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Data Insights */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'en' ? 'Key Insights' : 'मुख्य अंतर्दृष्टि'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-green-800">847</p>
                <p className="text-sm text-green-600">
                  {language === 'en' ? 'Eligible Farmers' : 'पात्र किसान'}
                </p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-yellow-800">23</p>
                <p className="text-sm text-yellow-600">
                  {language === 'en' ? 'Villages at Risk' : 'जोखिम में गांव'}
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Droplets className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-blue-800">156</p>
                <p className="text-sm text-blue-600">
                  {language === 'en' ? 'Water Projects Needed' : 'आवश्यक जल परियोजनाएं'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSSLayer;
