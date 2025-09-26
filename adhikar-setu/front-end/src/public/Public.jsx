// src/pages/public/Public.jsx
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, LayersControl } from "react-leaflet";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Filter,
  Download,
  Info,
  Map,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import "leaflet/dist/leaflet.css";

// Mock data for demonstration
const mockData = {
  states: [
    { id: 1, name: "Madhya Pradesh", code: "MP" },
    { id: 2, name: "Tripura", code: "TR" },
    { id: 3, name: "Odisha", code: "OD" },
    { id: 4, name: "Telangana", code: "TS" },
  ],
  districts: {
    MP: [
      { id: 1, name: "Balaghat", ifrCount: 1250, crCount: 45, cfrCount: 12 },
      { id: 2, name: "Dindori", ifrCount: 980, crCount: 38, cfrCount: 8 },
      { id: 3, name: "Mandla", ifrCount: 1560, crCount: 52, cfrCount: 15 },
    ],
    TR: [
      { id: 1, name: "West Tripura", ifrCount: 650, crCount: 28, cfrCount: 6 },
      { id: 2, name: "South Tripura", ifrCount: 420, crCount: 22, cfrCount: 4 },
    ],
    OD: [
      { id: 1, name: "Kalahandi", ifrCount: 2100, crCount: 68, cfrCount: 25 },
      { id: 2, name: "Koraput", ifrCount: 1850, crCount: 72, cfrCount: 28 },
    ],
    TS: [
      { id: 1, name: "Adilabad", ifrCount: 890, crCount: 35, cfrCount: 10 },
      { id: 2, name: "Khamman", ifrCount: 760, crCount: 29, cfrCount: 8 },
    ],
  },
  tribalGroups: [
    "Gond",
    "Bhil",
    "Santal",
    "Munda",
    "Oraon",
    "Khasi",
    "Garo",
    "Mizo",
    "Scheduled Tribes",
  ],
  statistics: {
    totalIFR: 12560,
    totalCR: 420,
    totalCFR: 125,
    forestCover: "65%",
    avgLandHolding: "2.5 acres",
  },
  monthlyReports: [
    {
      title: "FRA Implementation Progress Report - January 2024",
      link: "https://tribal.nic.in/FRAProgressReports/Jan2024.pdf",
      date: "2024-01-31",
    },
    {
      title: "FRA Implementation Progress Report - December 2023",
      link: "https://tribal.nic.in/FRAProgressReports/Dec2023.pdf",
      date: "2023-12-31",
    },
  ],
};

const Public = () => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTribe, setSelectedTribe] = useState("");
  const [activeLayers, setActiveLayers] = useState({
    ifr: true,
    cr: true,
    cfr: true,
    forestCover: false,
    waterBodies: false,
  });
  const [viewMode, setViewMode] = useState("map"); // 'map' or 'stats'
  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    // Filter data based on selections
    let data = mockData.districts;
    if (selectedState) {
      data = { [selectedState]: mockData.districts[selectedState] };
    }
    setFilteredData(data);
  }, [selectedState, selectedDistrict, selectedTribe]);

  const handleLayerToggle = (layer) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  const handleDownloadReport = (format) => {
    // Mock download functionality
    alert(`Downloading ${format} report for selected filters`);
  };

  const chartData = filteredData ? Object.values(filteredData).flat() : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">FRA Public Atlas Viewer</h1>
          <p className="text-green-200">
            Explore aggregated and anonymized Forest Rights Act implementation
            data
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Controls Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-gray-600" />
                <span className="font-medium">Filters:</span>
              </div>

              <select
                className="border rounded-lg px-3 py-2 min-w-[200px]"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <option value="">All States</option>
                {mockData.states.map((state) => (
                  <option key={state.id} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>

              <select
                className="border rounded-lg px-3 py-2 min-w-[200px]"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                <option value="">All Districts</option>
                {selectedState &&
                  mockData.districts[selectedState]?.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
              </select>

              <select
                className="border rounded-lg px-3 py-2 min-w-[200px]"
                value={selectedTribe}
                onChange={(e) => setSelectedTribe(e.target.value)}
              >
                <option value="">All Tribal Groups</option>
                {mockData.tribalGroups.map((tribe) => (
                  <option key={tribe} value={tribe}>
                    {tribe}
                  </option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  viewMode === "map" ? "bg-green-600 text-white" : "bg-gray-200"
                }`}
                onClick={() => setViewMode("map")}
              >
                <Map size={18} />
                Map View
              </button>
              <button
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  viewMode === "stats"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setViewMode("stats")}
              >
                <BarChart3 size={18} />
                Statistics
              </button>
            </div>
          </div>

          {/* Layer Controls */}
          <div className="mt-4 flex flex-wrap gap-4">
            <span className="font-medium">Map Layers:</span>
            {Object.entries(activeLayers).map(([layer, isActive]) => (
              <label
                key={layer}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => handleLayerToggle(layer)}
                  className="rounded text-green-600"
                />
                <span className="capitalize">
                  {layer.replace(/([A-Z])/g, " $1")}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visualization */}
          <div className="lg:col-span-2">
            {viewMode === "map" ? (
              <div className="bg-white rounded-lg shadow-md p-4 h-96">
                <MapContainer
                  center={[23.5, 80.0]}
                  zoom={5}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />

                  <LayersControl position="topright">
                    {activeLayers.ifr && (
                      <LayersControl.Overlay
                        name="Individual Forest Rights"
                        checked
                      >
                        {/* IFR Layer would go here */}
                      </LayersControl.Overlay>
                    )}
                    {activeLayers.cr && (
                      <LayersControl.Overlay name="Community Rights" checked>
                        {/* CR Layer would go here */}
                      </LayersControl.Overlay>
                    )}
                    {activeLayers.cfr && (
                      <LayersControl.Overlay
                        name="Community Forest Resource Rights"
                        checked
                      >
                        {/* CFR Layer would go here */}
                      </LayersControl.Overlay>
                    )}
                  </LayersControl>
                </MapContainer>
                <div className="mt-2 text-sm text-gray-600 text-center">
                  Interactive Map Showing Aggregated FRA Data (Anonymized)
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 h-96">
                <h3 className="text-lg font-semibold mb-4">
                  FRA Rights Distribution
                </h3>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="ifrCount"
                      fill="#10b981"
                      name="Individual Rights"
                    />
                    <Bar
                      dataKey="crCount"
                      fill="#3b82f6"
                      name="Community Rights"
                    />
                    <Bar dataKey="cfrCount" fill="#8b5cf6" name="CFR Rights" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Download Options */}
            <div className="bg-white rounded-lg shadow-md p-4 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Download Aggregated Reports</h3>
                  <p className="text-sm text-gray-600">
                    Data is anonymized and aggregated at district level
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownloadReport("PDF")}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2"
                  >
                    <Download size={16} />
                    PDF Report
                  </button>
                  <button
                    onClick={() => handleDownloadReport("CSV")}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"
                  >
                    <Download size={16} />
                    CSV Data
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Information and Resources */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Info size={20} className="text-green-600" />
                FRA Implementation Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total IFR Titles:</span>
                  <span className="font-semibold">
                    {mockData.statistics.totalIFR.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Community Rights:</span>
                  <span className="font-semibold">
                    {mockData.statistics.totalCR}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>CFR Rights:</span>
                  <span className="font-semibold">
                    {mockData.statistics.totalCFR}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Forest Cover:</span>
                  <span className="font-semibold">
                    {mockData.statistics.forestCover}
                  </span>
                </div>
              </div>
            </div>

            {/* Educational Resources */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">
                Educational Resources
              </h3>
              <div className="space-y-3">
                <a
                  href="https://tribal.nic.in/FRA.html"
                  className="block p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2 text-blue-600">
                    <ExternalLink size={16} />
                    <span className="font-medium">
                      FRA Act, 2006 - Official Document
                    </span>
                  </div>
                </a>
                <a
                  href="https://tribal.nic.in/guidelines.html"
                  className="block p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2 text-blue-600">
                    <ExternalLink size={16} />
                    <span className="font-medium">
                      Implementation Guidelines
                    </span>
                  </div>
                </a>
                <a
                  href="https://tribal.nic.in/faq.html"
                  className="block p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2 text-blue-600">
                    <ExternalLink size={16} />
                    <span className="font-medium">
                      FRA Frequently Asked Questions
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Monthly Reports */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">
                Monthly Progress Reports
              </h3>
              <div className="space-y-3">
                {mockData.monthlyReports.map((report, index) => (
                  <a
                    key={index}
                    href={report.link}
                    className="block p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">
                        {report.title}
                      </span>
                      <ExternalLink size={14} className="text-blue-600" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {report.date}
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">
                Data Privacy Notice
              </h4>
              <p className="text-sm text-yellow-700">
                This portal displays only aggregated and anonymized data.
                Personal details of claimants are protected as per FRA
                guidelines. Access to detailed personal data requires explicit
                consent or statutory authorization.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>Ministry of Tribal Affairs, Government of India</p>
          <p className="text-gray-400 text-sm mt-2">
            For research and educational purposes only | Data last updated:{" "}
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Public;
