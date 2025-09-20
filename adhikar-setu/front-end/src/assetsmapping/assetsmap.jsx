import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, BarChart3, Image, TrendingUp, Users, FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";

import { stateVillageData, analyticsData, imageMapping } from './data/stateVillageData';

function AssetMapping() {
  const [selectedState, setSelectedState] = useState('');
  const [village, setVillage] = useState('');
  const [mode, setMode] = useState(null); // 'analytics' | 'mapping' | null

  const isVillageEnabled = selectedState.length > 0;
  
  // Get villages for selected state
  const getVillagesForState = (state) => {
    if (!state || !stateVillageData[state]) return [];
    const villages = [];
    Object.values(stateVillageData[state].villages).forEach(villageList => {
      villages.push(...villageList);
    });
    return [...new Set(villages)]; // Remove duplicates
  };

  const villages = getVillagesForState(selectedState);
  
  // Get current analytics data
  const getCurrentAnalytics = () => {
    if (!selectedState || !village) return null;
    return analyticsData[selectedState]?.[village] || null;
  };

  // Get current images
  const getCurrentImages = () => {
    if (!selectedState || !village) return [];
    return imageMapping[selectedState]?.[village] || [];
  };

  const currentAnalytics = getCurrentAnalytics();
  const currentImages = getCurrentImages();

  const indiaOsmEmbedSrc = useMemo(() => {
    // India bounding box approximate (lng/lat): [minLon, minLat, maxLon, maxLat]
    const bbox = [68.1766, 6.5546, 97.4026, 35.6745];
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox.join('%2C')}&layer=mapnik`;
  }, []);

  const handleShowAnalytics = () => setMode('analytics');
  const handleCheckMapping = () => setMode('mapping');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 bg-clip-text text-transparent">
            Asset Mapping Dashboard
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Welcome back, Guest
          </p>
          <p className="text-sm text-gray-500">
            Interactive Forest Rights Asset Mapping and Analytics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
        <Card className="min-h-[420px]">
          <CardHeader>
            <CardTitle>India Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-hidden rounded-lg border">
              <iframe
                title="India Map"
                src={indiaOsmEmbedSrc}
                className="h-[420px] w-full"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Enter state</label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setVillage('');
                  }}
                  className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                >
                  <option value="" disabled>
                    Select a state
                  </option>
                  <option value="Odisha">Odisha</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Telangana">Telangana</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Select village</label>
                <select
                  value={village}
                  onChange={(e) => {
                    setVillage(e.target.value);
                    setMode(null); // Reset mode when village changes
                  }}
                  disabled={!isVillageEnabled}
                  className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                >
                  <option value="" disabled>
                    {isVillageEnabled ? `Select a village in ${selectedState}` : 'Select a state first'}
                  </option>
                  {villages.map((villageName) => (
                    <option key={villageName} value={villageName}>
                      {villageName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button onClick={handleShowAnalytics} disabled={!selectedState || !village}>
                  Show Data Analytics
                </Button>
                <Button variant="outline" onClick={handleCheckMapping} disabled={!selectedState || !village}>
                  Check Mapping
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {mode === 'analytics' && currentAnalytics && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
              Analytics for {village}, {selectedState}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-semibold">Total Claims</p>
                      <p className="text-2xl font-bold">{currentAnalytics.totalClaims}</p>
                    </div>
                    <FileText className="h-6 w-6 text-blue-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-semibold">Approved Claims</p>
                      <p className="text-2xl font-bold">{currentAnalytics.approvedClaims}</p>
                    </div>
                    <CheckCircle className="h-6 w-6 text-green-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-100 text-sm font-semibold">Pending Claims</p>
                      <p className="text-2xl font-bold">{currentAnalytics.pendingClaims}</p>
                    </div>
                    <Clock className="h-6 w-6 text-amber-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm font-semibold">Rejected Claims</p>
                      <p className="text-2xl font-bold">{currentAnalytics.rejectedClaims}</p>
                    </div>
                    <AlertTriangle className="h-6 w-6 text-red-200" />
                  </div>
                </div>
              </div>

              {/* Detailed Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Area & Coverage</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Area (Hectares)</span>
                      <span className="font-bold text-gray-900">{currentAnalytics.totalArea}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Forest Cover (%)</span>
                      <span className="font-bold text-green-600">{currentAnalytics.forestCover}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tribal Population</span>
                      <span className="font-bold text-blue-600">{currentAnalytics.tribalPopulation.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Performance Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Success Rate (%)</span>
                      <span className="font-bold text-green-600">{currentAnalytics.successRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Avg Processing Time (Days)</span>
                      <span className="font-bold text-amber-600">{currentAnalytics.avgProcessingTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Literacy Rate (%)</span>
                      <span className="font-bold text-purple-600">{currentAnalytics.literacyRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {mode === 'mapping' && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Image className="h-5 w-5 mr-2 text-purple-600" />
              Mapping Preview for {village}, {selectedState}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentImages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentImages.map((image, index) => (
                  <div key={index} className="bg-gray-100 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200 flex items-center justify-center">
                      <div className="text-center p-8">
                        <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">{image}</p>
                        <p className="text-sm text-gray-500 mt-2">Image placeholder</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 capitalize">
                        {image.replace(/_/g, ' ').replace('.jpg', '')}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {village}, {selectedState}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Images Available</h3>
                <p className="text-gray-600">
                  No mapping images are currently available for {village}, {selectedState}.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default AssetMapping;


