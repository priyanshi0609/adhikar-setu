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
  Map,
} from "lucide-react";
import { Link } from "react-router-dom";
import mapboxgl from "mapbox-gl"; // Import mapbox-gl
import "mapbox-gl/dist/mapbox-gl.css"; // Import default Mapbox CSS
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

//  import data from "../data/claims.json"; // Sample GeoJSON data

const Dashboard = ({ user, language }) => {
  const [selectedState, setSelectedState] = useState("Tripura");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [selectedVillage, setSelectedVillage] = useState("All Villages");
  const [selectedClaimStatus, setSelectedClaimStatus] = useState("All Statuses");
  const [selectedTribalGroup, setSelectedTribalGroup] = useState("All Groups");
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const states = ["Tripura", "Telangana", "Odisha", "Madhya Pradesh"];
  const claimStatuses = ["All Statuses", "IFR", "CFR", "CR", "Submitted", "Verified", "Approved", "Rejected", "Under Review"];
  const tribalGroups = ["All Groups", "Santhal", "Gond", "Oraon", "Munda", "Bhil", "Kol", "Kharia", "Ho", "Sabar", "Bhumij"];

  // Dynamic data structure for districts and villages based on state with coordinates
  const stateData = {
    "Madhya Pradesh": {
      center: [78.6569, 23.2599],
      zoom: 7,
      districts: ["All Districts", "Bhind", "Satna"],
      districtCoordinates: {
        "All Districts": { center: [78.6569, 23.2599], zoom: 7 },
        Bhind: { center: [78.7831, 26.5647], zoom: 10 },
        Satna: { center: [80.8318, 24.5718], zoom: 10 },
      },
      villages: {
        "All Districts": ["All Villages"],
        Bhind: ["All Villages", "Bhind City", "Lahar", "Mehgaon"],
        Satna: ["All Villages", "Satna City", "Maihar", "Nagod"],
      },
      villageCoordinates: {
        "All Districts": {
          "All Villages": { center: [78.6569, 23.2599], zoom: 7 },
        },
        Bhind: {
          "All Villages": { center: [78.7831, 26.5647], zoom: 10 },
          "Bhind City": { center: [78.7831, 26.5647], zoom: 12 },
          Lahar: { center: [78.9436, 26.1963], zoom: 12 },
          Mehgaon: { center: [78.6525, 26.5836], zoom: 12 },
        },
        Satna: {
          "All Villages": { center: [80.8318, 24.5718], zoom: 10 },
          "Satna City": { center: [80.8318, 24.5718], zoom: 12 },
          Maihar: { center: [80.7589, 24.2659], zoom: 12 },
          Nagod: { center: [80.5858, 24.5687], zoom: 12 },
        },
      },
    },
    Tripura: {
      center: [91.9882, 23.9408],
      zoom: 8,
      districts: ["All Districts", "Nidaya", "Agartala"],
      districtCoordinates: {
        "All Districts": { center: [91.9882, 23.9408], zoom: 8 },
        Nidaya: { center: [92.3372, 24.3259], zoom: 11 },
        Agartala: { center: [91.2868, 23.8315], zoom: 11 },
      },
      villages: {
        "All Districts": ["All Villages"],
        Nidaya: ["All Villages", "Nidaya Town", "Kailashahar", "Dharmanagar"],
        Agartala: ["All Villages", "Agartala City", "Udaipur", "Sonamura"],
      },
      villageCoordinates: {
        "All Districts": {
          "All Villages": { center: [91.9882, 23.9408], zoom: 8 },
        },
        Nidaya: {
          "All Villages": { center: [92.3372, 24.3259], zoom: 11 },
          "Nidaya Town": { center: [92.3372, 24.3259], zoom: 13 },
          Kailashahar: { center: [92.0032, 24.332], zoom: 13 },
          Dharmanagar: { center: [92.1676, 24.3738], zoom: 13 },
        },
        Agartala: {
          "All Villages": { center: [91.2868, 23.8315], zoom: 11 },
          "Agartala City": { center: [91.2868, 23.8315], zoom: 13 },
          Udaipur: { center: [91.4985, 23.5333], zoom: 13 },
          Sonamura: { center: [91.2794, 23.4984], zoom: 13 },
        },
      },
    },
    Odisha: {
      center: [85.0985, 20.9517],
      zoom: 7,
      districts: ["All Districts", "Jagatsinghpur", "Kalahandi"],
      districtCoordinates: {
        "All Districts": { center: [85.0985, 20.9517], zoom: 7 },
        Jagatsinghpur: { center: [86.1711, 20.2543], zoom: 10 },
        Kalahandi: { center: [83.1656, 19.9151], zoom: 10 },
      },
      villages: {
        "All Districts": ["All Villages"],
        Jagatsinghpur: [
          "All Villages",
          "Jagatsinghpur Town",
          "Paradeep",
          "Tirtol",
        ],
        Kalahandi: ["All Villages", "Bhawanipatna", "Dharamgarh", "Junagarh"],
      },
      villageCoordinates: {
        "All Districts": {
          "All Villages": { center: [85.0985, 20.9517], zoom: 7 },
        },
        Jagatsinghpur: {
          "All Villages": { center: [86.1711, 20.2543], zoom: 10 },
          "Jagatsinghpur Town": { center: [86.1711, 20.2543], zoom: 12 },
          Paradeep: { center: [86.61, 20.3102], zoom: 12 },
          Tirtol: { center: [86.444, 20.3033], zoom: 12 },
        },
        Kalahandi: {
          "All Villages": { center: [83.1656, 19.9151], zoom: 10 },
          Bhawanipatna: { center: [83.1656, 19.9151], zoom: 12 },
          Dharamgarh: { center: [83.1735, 20.4621], zoom: 12 },
          Junagarh: { center: [82.9321, 20.2449], zoom: 12 },
        },
      },
    },
    Telangana: {
      center: [79.0193, 18.1124],
      zoom: 7,
      districts: ["All Districts", "Narayanpet", "Venkatapur"],
      districtCoordinates: {
        "All Districts": { center: [79.0193, 18.1124], zoom: 7 },
        Narayanpet: { center: [77.491, 16.7454], zoom: 10 },
        Venkatapur: { center: [79.5941, 19.2183], zoom: 10 },
      },
      villages: {
        "All Districts": ["All Villages"],
        Narayanpet: ["All Villages", "Narayanpet Town", "Makthal", "Utkoor"],
        Venkatapur: ["All Villages", "Venkatapur Town", "Asifabad", "Sirpur"],
      },
      villageCoordinates: {
        "All Districts": {
          "All Villages": { center: [79.0193, 18.1124], zoom: 7 },
        },
        Narayanpet: {
          "All Villages": { center: [77.491, 16.7454], zoom: 10 },
          "Narayanpet Town": { center: [77.491, 16.7454], zoom: 12 },
          Makthal: { center: [77.6674, 16.4387], zoom: 12 },
          Utkoor: { center: [77.3236, 16.0638], zoom: 12 },
        },
        Venkatapur: {
          "All Villages": { center: [79.5941, 19.2183], zoom: 10 },
          "Venkatapur Town": { center: [79.5941, 19.2183], zoom: 12 },
          Asifabad: { center: [79.2881, 19.3592], zoom: 12 },
          Sirpur: { center: [79.6, 18.8333], zoom: 12 },
        },
      },
    },
  };

  // Get districts for selected state
  const getDistrictsForState = (state) => {
    return stateData[state]?.districts || [];
  };

  // Get villages for selected state and district
  const getVillagesForDistrict = (state, district) => {
    return stateData[state]?.villages[district] || ["All Villages"];
  };

  // Get coordinates based on current selection
  const getCurrentCoordinates = () => {
    // If a specific village is selected (not "All Villages"), use village coordinates
    if (selectedVillage !== "All Villages") {
      const villageCoord =
        stateData[selectedState]?.villageCoordinates?.[selectedDistrict]?.[
          selectedVillage
        ];
      if (villageCoord) {
        return villageCoord;
      }
    }

    // If "All Districts" is selected, use state coordinates
    if (selectedDistrict === "All Districts") {
      const stateCoord = stateData[selectedState];
      if (stateCoord) {
        return { center: stateCoord.center, zoom: stateCoord.zoom };
      }
    }

    // If a specific district is selected, use district coordinates
    if (selectedDistrict) {
      const districtCoord =
        stateData[selectedState]?.districtCoordinates?.[selectedDistrict];
      if (districtCoord) {
        return districtCoord;
      }
    }

    // Otherwise use state coordinates
    const stateCoord = stateData[selectedState];
    if (stateCoord) {
      return { center: stateCoord.center, zoom: stateCoord.zoom };
    }

    // Fallback to default coordinates
    return { center: [85.0985, 20.9517], zoom: 7 };
  };

  const districts = getDistrictsForState(selectedState);
  const villages = getVillagesForDistrict(selectedState, selectedDistrict);

  const getKPIData = () => {
    switch (user.role) {
      case "gram_sabha":
        return [
          {
            title: language === "en" ? "My Claims" : "मेरे दावे",
            value: "12",
            icon: FileText,
            color: "bg-gradient-to-r from-blue-500 to-blue-600",
            change: "+2 this month",
            trend: "up",
          },
          {
            title: language === "en" ? "Approved" : "स्वीकृत",
            value: "8",
            icon: CheckCircle,
            color: "bg-gradient-to-r from-green-500 to-green-600",
            change: "+1 this week",
            trend: "up",
          },
          {
            title: language === "en" ? "Pending" : "लंबित",
            value: "4",
            icon: Clock,
            color: "bg-gradient-to-r from-amber-500 to-amber-600",
            change: "2 in review",
            trend: "neutral",
          },
          {
            title: language === "en" ? "Village Area" : "गांव का क्षेत्रफल",
            value: "450 Ha",
            icon: MapPin,
            color: "bg-gradient-to-r from-purple-500 to-purple-600",
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
            color: "bg-gradient-to-r from-blue-500 to-blue-600",
            change: "+47 this month",
            trend: "up",
          },
          {
            title: language === "en" ? "Verified Claims" : "सत्यापित दावे",
            value: "2,103",
            icon: CheckCircle,
            color: "bg-gradient-to-r from-green-500 to-green-600",
            change: "73.8% completion",
            trend: "up",
          },
          {
            title: language === "en" ? "Approved Titles" : "स्वीकृत पट्टे",
            value: "1,876",
            icon: CheckCircle,
            color: "bg-gradient-to-r from-emerald-500 to-emerald-600",
            change: "89.2% of verified",
            trend: "up",
          },
          {
            title: language === "en" ? "Pending Claims" : "लंबित दावे",
            value: "744",
            icon: Clock,
            color: "bg-gradient-to-r from-amber-500 to-amber-600",
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
            color: "bg-gradient-to-r from-blue-500 to-blue-600",
            change: "+23 this week",
            trend: "up",
          },
          {
            title: language === "en" ? "Verified Claims" : "सत्यापित दावे",
            value: "987",
            icon: CheckCircle,
            color: "bg-gradient-to-r from-green-500 to-green-600",
            change: "80% completion",
            trend: "up",
          },
          {
            title: language === "en" ? "Pending Review" : "समीक्षा लंबित",
            value: "156",
            icon: Clock,
            color: "bg-gradient-to-r from-amber-500 to-amber-600",
            change: "Avg: 7 days",
            trend: "down",
          },
          {
            title: language === "en" ? "Active Users" : "सक्रिय उपयोगकर्ता",
            value: "89",
            icon: Users,
            color: "bg-gradient-to-r from-purple-500 to-purple-600",
            change: "+12 this month",
            trend: "up",
          },
        ];
    }
  };

  const kpiData = getKPIData();

  const loadClaimsData = async () => {
    try {
      const response = await fetch("/data/claims.json");
      if (response.ok) {
        const data = await response.json();
        console.log("Successfully loaded claims.json from file");
        return data;
      } else {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
    } catch (error) {
      console.warn(
        "Could not load /data/claims.json, using fallback data:",
        error,
      );
      // Return empty data structure if file fails to load
      return {
        type: "FeatureCollection",
        features: []
      };
    }
  };

  useEffect(
    () => {
      // Prevent map re-creation
      if (mapRef.current) return;
      if (!mapContainerRef.current) return;

      console.log("Initializing map...");

      // Center set to Bhubaneswar (Odisha). Zoom 6 to show state-level.
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [91.3662, 23.8315], // [lng, lat] -> Agartala, Tripura
        zoom: 20,
      });

      // Add nav controls
      mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Wait for both style and map to load
      mapRef.current.on("style.load", async () => {
        console.log("Map style loaded, loading data...");

        try {
          // State data with centroid points for text labels
          const statesData = {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: { name: "Tripura", state_code: "TR" },
                geometry: {
                  type: "Point",
                  coordinates: [91.9882, 23.9408], // Centroid of Tripura
                },
              },
              {
                type: "Feature",
                properties: { name: "Telangana", state_code: "TG" },
                geometry: {
                  type: "Point",
                  coordinates: [79.0193, 18.1124], // Centroid of Telangana
                },
              },
              {
                type: "Feature",
                properties: { name: "Odisha", state_code: "OR" },
                geometry: {
                  type: "Point",
                  coordinates: [84.5187, 20.1517], // Centroid of Odisha
                },
              },
              {
                type: "Feature",
                properties: { name: "Madhya Pradesh", state_code: "MP" },
                geometry: {
                  type: "Point",
                  coordinates: [78.6569, 23.5734], // Centroid of Madhya Pradesh
                },
              },
            ],
          };

          // Add states source
          mapRef.current.addSource("indian-states", {
            type: "geojson",
            data: statesData,
          });

          // Add text labels for states with size-based highlighting
          mapRef.current.addLayer({
            id: "state-labels",
            type: "symbol",
            source: "indian-states",
            layout: {
              "text-field": ["get", "name"],
              "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
              "text-size": [
                "case",
                ["in", ["get", "name"], ["literal", states]], // Target states
                22, // Large text for target states
                14, // Small text for other states
              ],
              "text-transform": "uppercase",
            },
            paint: {
              "text-color": [
                "case",
                ["in", ["get", "name"], ["literal", states]],
                "#16a34a", // Green color for target states
                "#6b7280", // Gray color for other states
              ],
              "text-halo-color": "white",
              "text-halo-width": 2,
            },
          });

          // Fit map to show all target states
          const targetStateFeatures = statesData.features.filter((feature) =>
            states.includes(feature.properties.name),
          );

          if (targetStateFeatures.length > 0) {
            const bounds = new mapboxgl.LngLatBounds();
            targetStateFeatures.forEach((feature) => {
              bounds.extend(feature.geometry.coordinates);
            });
            mapRef.current.fitBounds(bounds, { padding: 100, maxZoom: 7 });
          }

          // Load claims data
          const geojson = await loadClaimsData();
          console.log("Claims data loaded:", geojson);

          // Add source and layers
          mapRef.current.addSource("claims", {
            type: "geojson",
            data: geojson,
          });

          // Fill layer colored by status
          mapRef.current.addLayer({
            id: "claims-fill",
            type: "fill",
            source: "claims",
            paint: {
              "fill-color": [
                "match",
                ["get", "status"],
                "Submitted",
                "#f9a825",
                "Verified",
                "#1976d2",
                "Approved",
                "#2e7d32",
                "Rejected",
                "#d32f2f",
                "#cccccc",
              ],
              "fill-opacity": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                0.85,
                0.5,
              ],
            },
          });

          // Outline
          mapRef.current.addLayer({
            id: "claims-outline",
            type: "line",
            source: "claims",
            paint: {
              "line-color": [
                "match",
                ["get", "status"],
                "Submitted",
                "#c17900",
                "Verified",
                "#0b5b9a",
                "Approved",
                "#1b5e20",
                "Rejected",
                "#a91d1d",
                "#888888",
              ],
              "line-width": 2,
            },
          });

          console.log("Layers added successfully");

          // Fit to data bounds (calculate simple bbox)
          try {
            const bounds = new mapboxgl.LngLatBounds();
            geojson.features.forEach((f) => {
              // handle polygons only (simple example); extend by each coordinate in first ring
              const coords = f.geometry.coordinates;
              if (f.geometry.type === "Polygon") {
                coords[0].forEach(([lng, lat]) => bounds.extend([lng, lat]));
              } else if (f.geometry.type === "MultiPolygon") {
                f.geometry.coordinates.forEach((polygon) =>
                  polygon[0].forEach(([lng, lat]) => bounds.extend([lng, lat])),
                );
              }
            });
            if (!bounds.isEmpty()) {
              mapRef.current.fitBounds(bounds, { padding: 40, maxZoom: 12 });
              console.log("Fitted to bounds");
            }
          } catch (err) {
            console.warn("Could not compute bounds", err);
          }

          // Hover (feature-state)
          let hoveredId = null;
          mapRef.current.on("mousemove", "claims-fill", (e) => {
            if (!e.features || !e.features.length) return;
            const feature = e.features[0];
            if (hoveredId !== null) {
              mapRef.current.setFeatureState(
                { source: "claims", id: hoveredId },
                { hover: false },
              );
            }
            hoveredId = feature.id;
            mapRef.current.setFeatureState(
              { source: "claims", id: hoveredId },
              { hover: true },
            );
            mapRef.current.getCanvas().style.cursor = "pointer";
          });

          mapRef.current.on("mouseleave", "claims-fill", () => {
            if (hoveredId !== null) {
              mapRef.current.setFeatureState(
                { source: "claims", id: hoveredId },
                { hover: false },
              );
            }
            hoveredId = null;
            mapRef.current.getCanvas().style.cursor = "";
          });

          // Click -> popup
          mapRef.current.on("click", "claims-fill", (e) => {
            if (!e.features || !e.features.length) return;
            const feat = e.features[0];
            const p = feat.properties || {};
            // area_m2 might be string — format defensively
            const area = p.area_m2 ? Number(p.area_m2).toFixed(2) + " m²" : "—";
            const html = `
            <div style="font-size:13px">
              <strong>${p.claimant_name || "—"}</strong><br/>
              ID: ${p.claim_id || "—"}<br/>
              Status: ${p.status || "—"}<br/>
              Area: ${area}
            </div>
          `;
            new mapboxgl.Popup({ offset: 12 })
              .setLngLat(e.lngLat)
              .setHTML(html)
              .addTo(mapRef.current);
          });

          // Simple legend inserted into map container (optional)
          const existingLegend = document.getElementById("claims-legend");
          if (!existingLegend && mapContainerRef.current) {
            const legend = document.createElement("div");
            legend.id = "claims-legend";
            legend.style.position = "absolute";
            legend.style.top = "12px";
            legend.style.right = "12px";
            legend.style.background = "white";
            legend.style.padding = "8px 10px";
            legend.style.borderRadius = "6px";
            legend.style.fontSize = "13px";
            legend.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
            legend.innerHTML = `
            <div style="margin-bottom:6px;font-weight:600">Claim Status</div>
            <div style="display:flex;gap:8px;align-items:center;margin:2px 0"><span style="width:12px;height:12px;background:#f9a825;display:inline-block;border:1px solid #ccc"></span>Submitted</div>
            <div style="display:flex;gap:8px;align-items:center;margin:2px 0"><span style="width:12px;height:12px;background:#1976d2;display:inline-block;border:1px solid #ccc"></span>Verified</div>
            <div style="display:flex;gap:8px;align-items:center;margin:2px 0"><span style="width:12px;height:12px;background:#2e7d32;display:inline-block;border:1px solid #ccc"></span>Approved</div>
            <div style="display:flex;gap:8px;align-items:center;margin:2px 0"><span style="width:12px;height:12px;background:#d32f2f;display:inline-block;border:1px solid #ccc"></span>Rejected</div>
          `;
            // append to the map container parent so it floats over the map
            mapContainerRef.current.appendChild(legend);
          }
        } catch (error) {
          console.error("Error setting up claims visualization:", error);
        }
      });

      // Cleanup on unmount
      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    },
    [
      /* empty */
    ],
  );

  const handleLocationZoom = () => {
    const { center, zoom } = getCurrentCoordinates();

    if (mapRef.current) {
      mapRef.current.flyTo({
        center: center,
        zoom: zoom,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 bg-clip-text text-transparent">
            {language === "en" ? "Adhikar Setu" : "अधिकार सेतु"}
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            {language === "en"
              ? `Welcome back, ${user.name}`
              : `वापसी पर स्वागत, ${user.name}`}
          </p>
          <p className="text-sm text-gray-500">
            {language === "en"
              ? "Empowering Forest Rights Management"
              : "वन अधिकार प्रबंधन को सशक्त बनाना"}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 lg:mt-0 flex flex-wrap gap-4">
          {user.role === "gram_sabha" && (
            <Link to="/claim-submission">
              <button className="flex items-center bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:via-green-800 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                <Plus className="h-5 w-5 mr-2" />
                {language === "en" ? "New Claim" : "नया दावा जमा करें"}
              </button>
            </Link>
          )}
          <Link to="/reports">
            <button className="flex items-center bg-white text-gray-700 border-2 border-gray-200 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
              <Download className="h-5 w-5 mr-2" />
              {language === "en" ? "Generate Report" : "रिपोर्ट बनाएं"}
            </button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          const trendColor =
            kpi.trend === "up"
              ? "text-green-600"
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
              className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    {kpi.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {kpi.value}
                  </p>
                  <div className="flex items-center">
                    <span
                      className={`text-sm font-semibold ${trendColor} flex items-center`}
                    >
                      {trendIcon}
                      <span className="ml-1">{kpi.change}</span>
                    </span>
                  </div>
                </div>
                <div className={`${kpi.color} p-4 rounded-xl shadow-lg`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Filter className="h-6 w-6 mr-3 text-green-600" />
            {language === "en" ? "Location & Filter Controls" : "स्थान और फिल्टर नियंत्रण"}
          </h2>
          <button 
            onClick={() => {
              setSelectedState("Tripura");
              setSelectedDistrict("All Districts");
              setSelectedVillage("All Villages");
              setSelectedClaimStatus("All Statuses");
              setSelectedTribalGroup("All Groups");
            }}
            className="text-sm text-green-600 hover:text-green-700 font-semibold px-4 py-2 rounded-xl hover:bg-green-50 transition-all duration-300 border border-green-200 hover:border-green-300"
          >
            {language === "en" ? "Reset All" : "सभी रीसेट करें"}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              label: language === "en" ? "State" : "राज्य",
              value: selectedState,
              options: states,
              onChange: (newState) => {
                setSelectedState(newState);
                // Reset district and village when state changes
                const newDistricts = getDistrictsForState(newState);
                if (newDistricts.length > 0) {
                  setSelectedDistrict("All Districts");
                  setSelectedVillage("All Villages");
                }
              },
            },
            {
              label: language === "en" ? "District" : "जिला",
              value: selectedDistrict,
              options: districts,
              onChange: (newDistrict) => {
                setSelectedDistrict(newDistrict);
                // Reset village when district changes
                if (newDistrict === "All Districts") {
                  setSelectedVillage("All Villages");
                } else {
                  const newVillages = getVillagesForDistrict(
                    selectedState,
                    newDistrict,
                  );
                  setSelectedVillage(newVillages[0] || "All Villages");
                }
              },
            },
            {
              label: language === "en" ? "Village" : "गांव",
              value: selectedVillage,
              options: villages,
              onChange: setSelectedVillage,
            },
            {
              label: language === "en" ? "Claim Status" : "दावा स्थिति",
              value: selectedClaimStatus,
              options: claimStatuses,
              onChange: setSelectedClaimStatus,
            },
            {
              label: language === "en" ? "Tribal Groups" : "आदिवासी समूह",
              value: selectedTribalGroup,
              options: tribalGroups,
              onChange: setSelectedTribalGroup,
            },
          ].map((filter, index) => (
            <div key={index}>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                {filter.label}
              </label>
              <div className="relative">
                <select
                  aria-label={filter.label}
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white font-medium transition-all duration-300 hover:border-gray-300"
                >
                  {filter.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <button 
            onClick={handleLocationZoom}
            className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:via-green-800 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center transform hover:scale-105"
          >
            <MapPin className="h-5 w-5 mr-2" />
            {language === "en" ? "Zoom to Location" : "स्थान पर ज़ूम करें"}
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map View */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-4 bg-gradient-to-r from-green-600 to-emerald-600">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Map className="h-5 w-5 mr-2" />
                {language === "en" ? "Interactive Claims Map" : "इंटरैक्टिव दावा मानचित्र"}
              </h3>
            </div>
            <div
              ref={mapContainerRef}
              className="w-full h-[500px]"
            />
          </div>
          
          <div className="flex justify-center">
            <Link to="/map">
              <button className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center transform hover:scale-105">
                <MapPin className="h-5 w-5 mr-2" />
                {language === "en" ? "View Full Map" : "पूरा नक्शा देखें"}
              </button>
            </Link>
          </div>
        </div>

        {/* Filter Panel */}
        <div className="space-y-6">
          {/* Advanced Filters */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <Filter className="h-5 w-5 mr-2 text-green-600" />
              {language === "en" ? "Advanced Filters" : "उन्नत फिल्टर"}
            </h3>
            
            <div className="space-y-6">
              {/* Claim Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  {language === "en" ? "Claim Status" : "दावा स्थिति"}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["IFR", "CFR", "CR", "Submitted", "Verified", "Approved", "Rejected", "Under Review"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedClaimStatus(selectedClaimStatus === status ? "All Statuses" : status)}
                      className={`px-3 py-2 text-sm rounded-lg border-2 transition-all duration-300 font-medium ${
                        selectedClaimStatus === status
                          ? "bg-green-100 border-green-500 text-green-700 shadow-md"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Tribal Groups Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  {language === "en" ? "Tribal Groups" : "आदिवासी समूह"}
                </label>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                  {tribalGroups.map((group) => (
                    <button
                      key={group}
                      onClick={() => setSelectedTribalGroup(group)}
                      className={`px-3 py-2 text-sm rounded-lg border-2 transition-all duration-300 font-medium ${
                        selectedTribalGroup === group
                          ? "bg-purple-100 border-purple-500 text-purple-700 shadow-md"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300"
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>

              {/* Area Range Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  {language === "en" ? "Area Range (Hectares)" : "क्षेत्र सीमा (हेक्टेयर)"}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    className="px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md hover:shadow-lg">
                {language === "en" ? "Apply Filters" : "फिल्टर लगाएं"}
              </button>
              <button 
                onClick={() => {
                  setSelectedClaimStatus("All Statuses");
                  setSelectedTribalGroup("All Groups");
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {language === "en" ? "Clear" : "साफ करें"}
              </button>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              {language === "en"
                ? "Alerts & Notifications"
                : "अलर्ट और सूचनाएं"}
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 shadow-sm">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">
                    {language === "en" ? "Pending Reviews" : "लंबित समीक्षा"}
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    {language === "en"
                      ? "15 claims need attention"
                      : "15 दावों पर ध्यान देने की जरूरत"}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-sm">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-800">
                    {language === "en" ? "System Update" : "सिस्टम अपडेट"}
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    {language === "en"
                      ? "New features available"
                      : "नई सुविधाएं उपलब्ध"}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
                <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-blue-800">
                    {language === "en" ? "Monthly Report" : "मासिक रिपोर्ट"}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    {language === "en"
                      ? "Performance analytics ready"
                      : "प्रदर्शन विश्लेषण तैयार"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              {language === "en" ? "Quick Statistics" : "त्वरित आंकड़े"}
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">
                  {language === "en" ? "Success Rate" : "सफलता दर"}
                </span>
                <span className="text-sm font-bold text-green-600">89.2%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">
                  {language === "en" ? "Avg. Processing Time" : "औसत प्रसंस्करण समय"}
                </span>
                <span className="text-sm font-bold text-blue-600">12 days</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-gray-600">
                  {language === "en" ? "Total Area Covered" : "कुल क्षेत्र कवर"}
                </span>
                <span className="text-sm font-bold text-purple-600">2,847 Ha</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;