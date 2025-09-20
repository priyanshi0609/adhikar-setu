import React, { useState, useRef, useEffect } from "react";
import { MapPin, BarChart3, Image, ChevronDown, TrendingUp, Users, FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { stateVillageData, analyticsData, imageMapping } from "./data/stateVillageData";
import { colors } from "../colors";

// Set Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const AssetMapping = () => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showMapping, setShowMapping] = useState(false);
  const [activeTab, setActiveTab] = useState("analytics"); // "analytics" or "mapping"
  
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  const states = Object.keys(stateVillageData);

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

  // Initialize map
  useEffect(() => {
    if (mapInstance.current) return;

    mapInstance.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [78.6569, 23.2599], // Center of India
      zoom: 5,
    });

    // Add navigation controls
    mapInstance.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add state markers
    mapInstance.current.on("load", () => {
      // Create GeoJSON data for states
      const statesGeoJSON = {
        type: "FeatureCollection",
        features: Object.entries(stateVillageData).map(([stateName, stateData]) => ({
          type: "Feature",
          properties: { name: stateName },
          geometry: {
            type: "Point",
            coordinates: stateData.center
          }
        }))
      };

      // Add source
      mapInstance.current.addSource("states", {
        type: "geojson",
        data: statesGeoJSON
      });

      // Add markers
      mapInstance.current.addLayer({
        id: "state-markers",
        type: "circle",
        source: "states",
        paint: {
          "circle-radius": 12,
          "circle-color": colors.primary[600],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff"
        }
      });

      // Add labels
      mapInstance.current.addLayer({
        id: "state-labels",
        type: "symbol",
        source: "states",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": 14,
          "text-offset": [0, 2],
          "text-anchor": "top"
        },
        paint: {
          "text-color": colors.text.primary,
          "text-halo-color": "#ffffff",
          "text-halo-width": 2
        }
      });

      // Add click handler for states
      mapInstance.current.on("click", "state-markers", (e) => {
        const stateName = e.features[0].properties.name;
        setSelectedState(stateName);
        setSelectedVillage("");
        setShowAnalytics(false);
        setShowMapping(false);
      });

      // Change cursor on hover
      mapInstance.current.on("mouseenter", "state-markers", () => {
        mapInstance.current.getCanvas().style.cursor = "pointer";
      });

      mapInstance.current.on("mouseleave", "state-markers", () => {
        mapInstance.current.getCanvas().style.cursor = "";
      });
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update map when state is selected
  useEffect(() => {
    if (selectedState && mapInstance.current) {
      const stateData = stateVillageData[selectedState];
      mapInstance.current.flyTo({
        center: stateData.center,
        zoom: stateData.zoom
      });
    }
  }, [selectedState]);

  // Get current analytics data
  const getCurrentAnalytics = () => {
    if (!selectedState || !selectedVillage) return null;
    return analyticsData[selectedState]?.[selectedVillage] || null;
  };

  // Get current images
  const getCurrentImages = () => {
    if (!selectedState || !selectedVillage) return [];
    return imageMapping[selectedState]?.[selectedVillage] || [];
  };

  const currentAnalytics = getCurrentAnalytics();
  const currentImages = getCurrentImages();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 bg-clip-text text-transparent">
              Asset Mapping Dashboard
            </h1>
            <p className="text-lg text-gray-600 font-medium mt-2">
              Interactive Forest Rights Asset Mapping and Analytics
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-4 bg-gradient-to-r from-green-600 to-emerald-600">
              <h3 className="text-lg font-bold text-white flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Interactive India Map
              </h3>
            </div>
            <div
              ref={mapContainer}
              className="w-full h-[500px]"
            />
          </div>
        </div>

        {/* Selection Panel */}
        <div className="space-y-6">
          {/* State Selection */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-green-600" />
              Location Selection
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select State
                </label>
                <div className="relative">
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setSelectedVillage("");
                      setShowAnalytics(false);
                      setShowMapping(false);
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white font-medium transition-all duration-300 hover:border-gray-300"
                  >
                    <option value="">Choose a state...</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {selectedState && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Village
                  </label>
                  <div className="relative">
                    <select
                      value={selectedVillage}
                      onChange={(e) => {
                        setSelectedVillage(e.target.value);
                        setShowAnalytics(false);
                        setShowMapping(false);
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white font-medium transition-all duration-300 hover:border-gray-300"
                    >
                      <option value="">Choose a village...</option>
                      {villages.map((village) => (
                        <option key={village} value={village}>
                          {village}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              )}

              {selectedState && selectedVillage && (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setShowAnalytics(true);
                      setShowMapping(false);
                      setActiveTab("analytics");
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center transform hover:scale-105"
                  >
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Data Analytics
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowMapping(true);
                      setShowAnalytics(false);
                      setActiveTab("mapping");
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center transform hover:scale-105"
                  >
                    <Image className="h-5 w-5 mr-2" />
                    View Mapping
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          {selectedState && selectedVillage && currentAnalytics && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Quick Overview
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Total Claims</span>
                  <span className="text-sm font-bold text-blue-600">{currentAnalytics.totalClaims}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Success Rate</span>
                  <span className="text-sm font-bold text-green-600">{currentAnalytics.successRate}%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Total Area</span>
                  <span className="text-sm font-bold text-purple-600">{currentAnalytics.totalArea} Ha</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-600">Forest Cover</span>
                  <span className="text-sm font-bold text-emerald-600">{currentAnalytics.forestCover}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {(showAnalytics || showMapping) && selectedState && selectedVillage && (
        <div className="mt-6">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => {
                  setActiveTab("analytics");
                  setShowAnalytics(true);
                  setShowMapping(false);
                }}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-300 ${
                  activeTab === "analytics"
                    ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <BarChart3 className="h-5 w-5 inline mr-2" />
                Data Analytics
              </button>
              <button
                onClick={() => {
                  setActiveTab("mapping");
                  setShowMapping(true);
                  setShowAnalytics(false);
                }}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-300 ${
                  activeTab === "mapping"
                    ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <Image className="h-5 w-5 inline mr-2" />
                View Mapping
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === "analytics" && currentAnalytics && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Analytics for {selectedVillage}, {selectedState}
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Comprehensive data analysis and insights
                    </p>
                  </div>

                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm font-semibold">Total Claims</p>
                          <p className="text-3xl font-bold">{currentAnalytics.totalClaims}</p>
                        </div>
                        <FileText className="h-8 w-8 text-blue-200" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100 text-sm font-semibold">Approved Claims</p>
                          <p className="text-3xl font-bold">{currentAnalytics.approvedClaims}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-200" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-amber-100 text-sm font-semibold">Pending Claims</p>
                          <p className="text-3xl font-bold">{currentAnalytics.pendingClaims}</p>
                        </div>
                        <Clock className="h-8 w-8 text-amber-200" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-red-100 text-sm font-semibold">Rejected Claims</p>
                          <p className="text-3xl font-bold">{currentAnalytics.rejectedClaims}</p>
                        </div>
                        <AlertTriangle className="h-8 w-8 text-red-200" />
                      </div>
                    </div>
                  </div>

                  {/* Detailed Analytics */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Area & Coverage</h3>
                      <div className="space-y-4">
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

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Metrics</h3>
                      <div className="space-y-4">
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
              )}

              {activeTab === "mapping" && currentImages.length > 0 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Mapping Images for {selectedVillage}, {selectedState}
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Visual representation of the selected area
                    </p>
                  </div>

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
                            {selectedVillage}, {selectedState}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "mapping" && currentImages.length === 0 && (
                <div className="text-center py-12">
                  <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Images Available</h3>
                  <p className="text-gray-600">
                    No mapping images are currently available for {selectedVillage}, {selectedState}.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetMapping;
