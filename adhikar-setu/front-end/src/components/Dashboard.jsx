import React, { useState, useRef, useEffect } from "react";
import {
  BarChart3,
  FileText,
  CheckCircle,
  Clock,
  MapPin,
  Users,
  AlertTriangle,
  TrendingUp,
  ChevronDown,
  Filter,
  Plus,
  Download,
} from "lucide-react";
import { Link } from "react-router-dom";
import mapboxgl from "mapbox-gl"; // Import mapbox-gl
import "mapbox-gl/dist/mapbox-gl.css"; // Import default Mapbox CSS
mapboxgl.accessToken =
  "pk.eyJ1IjoiYXJzaHRpd2FyaSIsImEiOiJjbTJhODE2dm8wZ2MxMmlxdTJkbnJ1aTZnIn0.m9ky2-2MfcdA37RIVoxC_w";

const Dashboard = ({ user, language }) => {
  const [selectedState, setSelectedState] = useState("Chhattisgarh");
  const [selectedDistrict, setSelectedDistrict] = useState("Bastar");
  const [selectedVillage, setSelectedVillage] = useState("All Villages");
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const states = ["Chhattisgarh", "Jharkhand", "Odisha", "Madhya Pradesh"];
  const districts = ["Bastar", "Kanker", "Kondagaon", "Sukma"];
  const villages = [
    "All Villages",
    "Jagdalpur",
    "Kondagaon",
    "Keskal",
    "Bakawand",
  ];

  const getKPIData = () => {
    switch (user.role) {
      case "gram_sabha":
        return [
          {
            title: language === "en" ? "My Claims" : "मेरे दावे",
            value: "12",
            icon: FileText,
            color: "bg-blue-500",
            change: "+2 this month",
            trend: "up",
          },
          {
            title: language === "en" ? "Approved" : "स्वीकृत",
            value: "8",
            icon: CheckCircle,
            color: "bg-green-500",
            change: "+1 this week",
            trend: "up",
          },
          {
            title: language === "en" ? "Pending" : "लंबित",
            value: "4",
            icon: Clock,
            color: "bg-amber-500",
            change: "2 in review",
            trend: "neutral",
          },
          {
            title: language === "en" ? "Village Area" : "गांव का क्षेत्रफल",
            value: "450 Ha",
            icon: MapPin,
            color: "bg-purple-500",
            change: "Total area",
            trend: "neutral",
          },
        ];
      case "dlc":
        return [
          {
            title: language === "en" ? "Total Claims" : "कुल दावे",
            value: "2,847",
            icon: FileText,
            color: "bg-blue-500",
            change: "+47 this month",
            trend: "up",
          },
          {
            title: language === "en" ? "Verified Claims" : "सत्यापित दावे",
            value: "2,103",
            icon: CheckCircle,
            color: "bg-green-500",
            change: "73.8% completion",
            trend: "up",
          },
          {
            title: language === "en" ? "Approved Titles" : "स्वीकृत पट्टे",
            value: "1,876",
            icon: CheckCircle,
            color: "bg-green-600",
            change: "89.2% of verified",
            trend: "up",
          },
          {
            title: language === "en" ? "Pending Claims" : "लंबित दावे",
            value: "744",
            icon: Clock,
            color: "bg-amber-500",
            change: "26.2% pending",
            trend: "down",
          },
        ];
      default:
        return [
          {
            title: language === "en" ? "Total Claims" : "कुल दावे",
            value: "1,234",
            icon: FileText,
            color: "bg-blue-500",
            change: "+23 this week",
            trend: "up",
          },
          {
            title: language === "en" ? "Verified Claims" : "सत्यापित दावे",
            value: "987",
            icon: CheckCircle,
            color: "bg-green-500",
            change: "80% completion",
            trend: "up",
          },
          {
            title: language === "en" ? "Pending Review" : "समीक्षा लंबित",
            value: "156",
            icon: Clock,
            color: "bg-amber-500",
            change: "Avg: 7 days",
            trend: "down",
          },
          {
            title: language === "en" ? "Active Users" : "सक्रिय उपयोगकर्ता",
            value: "89",
            icon: Users,
            color: "bg-purple-500",
            change: "+12 this month",
            trend: "up",
          },
        ];
    }
  };
  useEffect(() => {
    if (mapRef.current) return; // prevent multiple maps on re-render
    if (!mapContainerRef.current) return; // ensure container is available

    mapRef.current = new mapboxgl.Map({
      // container: mapContainerRef.current!, // container ID
      container: mapContainerRef.current, // container ID
      style: "mapbox://styles/mapbox/streets-v12", // style URL
      center: [77.209, 28.6139], // [lng, lat] -> example: New Delhi
      zoom: 10, // zoom level
    });

    // ✅ Optional: Add navigation controls
    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      mapRef.current?.remove(); // cleanup on unmount
    };
  }, []);
  const kpiData = getKPIData();

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {language === "en" ? "Adhikar Setu" : "अधिकार सेतु"}
            <span className="text-green-600 ml-2">|</span>
          </h1>
          <p className="mt-1 text-gray-600">
            {language === "en"
              ? `Welcome back, ${user.name}`
              : `वापसी पर स्वागत, ${user.name}`}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
          {user.role === "gram_sabha" && (
            <Link to="/claim-submission">
              <button className="flex items-center bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2.5 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg">
                <Plus className="h-5 w-5 mr-2" />
                {language === "en" ? "m" : "नया दावा जमा करें"}
              </button>
            </Link>
          )}
          <Link to="/reports">
            <button className="flex items-center bg-white text-gray-700 border border-gray-300 px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md">
              <Download className="h-5 w-5 mr-2" />
              {language === "en" ? "Generate Report" : "रिपोर्ट बनाएं"}
            </button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Filter className="h-5 w-5 mr-2 text-green-600" />
            {language === "en" ? "Location Filters" : "स्थान फिल्टर"}
          </h2>
          <button className="text-sm text-green-600 hover:text-green-700 font-medium">
            {language === "en" ? "Reset Filters" : "फिल्टर रीसेट करें"}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: language === "en" ? "State" : "राज्य",
              value: selectedState,
              options: states,
              onChange: setSelectedState,
            },
            {
              label: language === "en" ? "District" : "जिला",
              value: selectedDistrict,
              options: districts,
              onChange: setSelectedDistrict,
            },
            {
              label: language === "en" ? "Village" : "गांव",
              value: selectedVillage,
              options: villages,
              onChange: setSelectedVillage,
            },
          ].map((filter, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {filter.label}
              </label>
              <div className="relative">
                <select
                  aria-label={filter.label}
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
                >
                  {filter.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          const trendColor =
            kpi.trend === "up"
              ? "text-green-500"
              : kpi.trend === "down"
              ? "text-red-500"
              : "text-gray-500";
          const trendIcon =
            kpi.trend === "up" ? (
              <TrendingUp className="h-4 w-4" />
            ) : kpi.trend === "down" ? (
              <TrendingUp className="h-4 w-4 transform rotate-180" />
            ) : null;

          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {kpi.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {kpi.value}
                  </p>
                </div>
                <div className={`${kpi.color} p-3 rounded-xl`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span
                  className={`text-sm font-medium ${trendColor} flex items-center`}
                >
                  {trendIcon}
                  <span className="ml-1">{kpi.change}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <div className="lg:col-span-2">
          <div
            ref={mapContainerRef}
            className="w-full h-[500px] rounded-xl shadow-sm border border-gray-200"
          />
        </div>

        {/* Activity Panel */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
              {language === "en" ? "Recent Activity" : "हाल की गतिविधि"}
            </h3>
            <div className="space-y-4">
              {[
                {
                  action: "Claim submitted",
                  user: "Ram Singh",
                  time: "2 hours ago",
                  status: "pending",
                },
                {
                  action: "Verification completed",
                  user: "FRC Team",
                  time: "4 hours ago",
                  status: "completed",
                },
                {
                  action: "Document uploaded",
                  user: "Sita Devi",
                  time: "6 hours ago",
                  status: "info",
                },
                {
                  action: "Approval granted",
                  user: "DLC Officer",
                  time: "1 day ago",
                  status: "success",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full mt-2.5 flex-shrink-0 ${
                      activity.status === "pending"
                        ? "bg-amber-500"
                        : activity.status === "completed"
                        ? "bg-blue-500"
                        : activity.status === "success"
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500">{activity.user}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-center text-sm text-green-600 font-medium hover:text-green-700 pt-2 border-t border-gray-100">
              {language === "en" ? "View all activity" : "सभी गतिविधियाँ देखें"}
            </button>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              {language === "en"
                ? "Alerts & Notifications"
                : "अलर्ट और सूचनाएं"}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    {language === "en" ? "Pending Reviewss" : "लंबित समीक्षा"}
                  </p>
                  <p className="text-xs text-amber-700">
                    {language === "en"
                      ? "15 claims need attention"
                      : "15 दावों पर ध्यान देने की जरूरत"}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-100">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    {language === "en" ? "System Update" : "सिस्टम अपडेट"}
                  </p>
                  <p className="text-xs text-green-700">
                    {language === "en"
                      ? "New features available"
                      : "नई सुविधाएं उपलब्ध"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
