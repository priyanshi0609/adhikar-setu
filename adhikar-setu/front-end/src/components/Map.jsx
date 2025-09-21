// src/components/Map.jsx
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "./Map.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function Map() {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const geocoderContainer = useRef(null);
  const [highlightedStates, setHighlightedStates] = useState(null);
  const [claimsData, setClaimsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMapNote, setShowMapNote] = useState(true);

  // Load GeoJSON data and claims data
  useEffect(() => {
    const loadGeoJsonData = async () => {
      try {
        const [statesResponse, claimsResponse] = await Promise.all([
          fetch("/data/india_state_geo.json"),
          fetch("/data/claims.json")
        ]);
        
        if (!statesResponse.ok) {
          throw new Error(`Failed to load states GeoJSON: ${statesResponse.statusText}`);
        }
        
        const statesData = await statesResponse.json();
        setHighlightedStates(statesData);
        
        if (claimsResponse.ok) {
          const claimsData = await claimsResponse.json();
          setClaimsData(claimsData);
          console.log("Successfully loaded claims.json from file");
        } else {
          console.warn("Could not load claims.json, using empty data");
          setClaimsData({
            type: "FeatureCollection",
            features: []
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading GeoJSON:", error);
        setLoading(false);
      }
    };

    loadGeoJsonData();
  }, []);

  useEffect(() => {
    if (mapInstance.current || !highlightedStates || !claimsData) return;

    // Define expanded geographical boundaries to show more of South Asia region
    // Includes parts of neighboring countries for better context
    const expandedBounds = [
      [60.0, 0.0],   // Southwest coordinates [lng, lat] - includes Arabian Sea, parts of Iran/Afghanistan
      [105.0, 42.0]  // Northeast coordinates [lng, lat] - includes parts of China, Myanmar, extends further east and north
    ];

    // Initialize map
    mapInstance.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [78.9629, 20.5937], // Center of India
      zoom: 3.2, // More zoomed out to show larger area
      maxBounds: expandedBounds, // Expanded bounds to show more region
      renderWorldCopies: false, // Don't render multiple world copies
      worldview: 'IN' // Use India worldview for disputed boundaries
    });

    // Create geocoder with custom styling
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl,
      marker: true,
      placeholder: "🔍 Search for places, cities, landmarks in India...",
      countries: 'in', // Limit to India
      types: 'country,region,place,postcode,locality,neighborhood,address,poi',
      minLength: 2,
      limit: 10,
      proximity: { longitude: 78.9629, latitude: 20.5937 },
      bbox: [60.0, 0.0, 105.0, 42.0] // Expanded bounding box to match new map bounds
    });

    // Add geocoder to custom container instead of map
    geocoderContainer.current.appendChild(geocoder.onAdd(mapInstance.current));

    // Define claim status colors
    const getClaimColor = (status) => {
      switch (status) {
        case "Submitted":
          return "#F59E0B"; // Amber
        case "Verified":
          return "#3B82F6"; // Blue
        case "Approved":
          return "#10B981"; // Green
        case "Rejected":
          return "#EF4444"; // Red
        case "Under Review":
          return "#8B5CF6"; // Purple
        default:
          return "#6B7280"; // Gray
      }
    };

    // Wait for map to load before adding layers
    mapInstance.current.on('load', () => {
      // Add source for highlighted states
      mapInstance.current.addSource('highlighted-states', {
        type: 'geojson',
        data: highlightedStates
      });

      // Add claims data source
      mapInstance.current.addSource('claims-data', {
        type: 'geojson',
        data: claimsData
      });

      // Add fill layer for states
      mapInstance.current.addLayer({
        id: 'states-fill',
        type: 'fill',
        source: 'highlighted-states',
        paint: {
          'fill-color': '#F08D30',
          'fill-opacity': 0.3
        }
      });

      // Add inner glow effect
      mapInstance.current.addLayer({
        id: 'states-glow',
        type: 'line',
        source: 'highlighted-states',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 6,
          'line-opacity': 0.3,
          'line-blur': 3
        }
      });

      // Add outline layer for states (polygon borders)
      mapInstance.current.addLayer({
        id: 'states-outline',
        type: 'line',
        source: 'highlighted-states',
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 2.5,
          'line-opacity': 0.9
        }
      });

      // Add claims fill layer
      mapInstance.current.addLayer({
        id: 'claims-fill',
        type: 'fill',
        source: 'claims-data',
        paint: {
          'fill-color': [
            'case',
            ['==', ['get', 'status'], 'Submitted'], '#F59E0B',
            ['==', ['get', 'status'], 'Verified'], '#3B82F6',
            ['==', ['get', 'status'], 'Approved'], '#10B981',
            ['==', ['get', 'status'], 'Rejected'], '#EF4444',
            ['==', ['get', 'status'], 'Under Review'], '#8B5CF6',
            '#6B7280'
          ],
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.8,
            0.6
          ]
        }
      });

      // Add claims outline layer
      mapInstance.current.addLayer({
        id: 'claims-outline',
        type: 'line',
        source: 'claims-data',
        paint: {
          'line-color': '#FFFFFF',
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            3,
            1.5
          ],
          'line-opacity': 0.9
        }
      });

      // Add labels for states
      mapInstance.current.addLayer({
        id: 'states-labels',
        type: 'symbol',
        source: 'highlighted-states',
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 16,
          'text-transform': 'uppercase',
          'text-letter-spacing': 0.1,
          'text-offset': [0, 0],
          'text-anchor': 'center'
        },
        paint: {
          'text-color': '#2C3E50',
          'text-halo-color': '#FFFFFF',
          'text-halo-width': 3,
          'text-halo-blur': 1
        }
      });

      // Enhanced hover effects for states
      let hoveredStateId = null;

      mapInstance.current.on('mouseenter', 'states-fill', (e) => {
        mapInstance.current.getCanvas().style.cursor = 'pointer';
        
        if (e.features.length > 0) {
          if (hoveredStateId !== null) {
            mapInstance.current.setFeatureState(
              { source: 'highlighted-states', id: hoveredStateId },
              { hover: false }
            );
          }
          hoveredStateId = e.features[0].id;
          mapInstance.current.setFeatureState(
            { source: 'highlighted-states', id: hoveredStateId },
            { hover: true }
          );
        }
      });

      mapInstance.current.on('mouseleave', 'states-fill', () => {
        mapInstance.current.getCanvas().style.cursor = '';
        
        if (hoveredStateId !== null) {
          mapInstance.current.setFeatureState(
            { source: 'highlighted-states', id: hoveredStateId },
            { hover: false }
          );
        }
        hoveredStateId = null;
      });

      // Hover effects for claims
      let hoveredClaimId = null;

      mapInstance.current.on('mouseenter', 'claims-fill', (e) => {
        mapInstance.current.getCanvas().style.cursor = 'pointer';
        
        if (e.features.length > 0) {
          if (hoveredClaimId !== null) {
            mapInstance.current.setFeatureState(
              { source: 'claims-data', id: hoveredClaimId },
              { hover: false }
            );
          }
          hoveredClaimId = e.features[0].id;
          mapInstance.current.setFeatureState(
            { source: 'claims-data', id: hoveredClaimId },
            { hover: true }
          );
        }
      });

      mapInstance.current.on('mouseleave', 'claims-fill', () => {
        mapInstance.current.getCanvas().style.cursor = '';
        
        if (hoveredClaimId !== null) {
          mapInstance.current.setFeatureState(
            { source: 'claims-data', id: hoveredClaimId },
            { hover: false }
          );
        }
        hoveredClaimId = null;
      });

      // Click event for states
      mapInstance.current.on('click', 'states-fill', (e) => {
        if (e.features.length > 0) {
          const stateName = e.features[0].properties.name;
          
          // Create popup
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
              <div style="padding: 10px; text-align: center;">
                <h3 style="margin: 0 0 10px 0; color: #2C3E50; font-size: 18px;">${stateName}</h3>
                <p style="margin: 0; color: #7F8C8D; font-size: 14px;">Click to explore ${stateName}</p>
              </div>
            `)
            .addTo(mapInstance.current);
        }
      });

      // Click event for claims
      mapInstance.current.on('click', 'claims-fill', (e) => {
        if (e.features.length > 0) {
          const claim = e.features[0].properties;
          const areaInHectares = (claim.area_m2 / 10000).toFixed(2);
          
          // Create popup for claim
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
              <div style="padding: 15px; min-width: 250px;">
                <h3 style="margin: 0 0 10px 0; color: #2C3E50; font-size: 16px; font-weight: bold;">
                  Claim ID: ${claim.claim_id}
                </h3>
                <div style="margin-bottom: 8px;">
                  <strong style="color: #374151;">Claimant:</strong> 
                  <span style="color: #6B7280;">${claim.claimant_name}</span>
                </div>
                <div style="margin-bottom: 8px;">
                  <strong style="color: #374151;">Status:</strong> 
                  <span style="color: ${getClaimColor(claim.status)}; font-weight: bold;">${claim.status}</span>
                </div>
                <div style="margin-bottom: 8px;">
                  <strong style="color: #374151;">Area:</strong> 
                  <span style="color: #6B7280;">${areaInHectares} hectares</span>
                </div>
                <div style="margin-bottom: 8px;">
                  <strong style="color: #374151;">Location:</strong> 
                  <span style="color: #6B7280;">${claim.village}, ${claim.district}, ${claim.state}</span>
                </div>
                <div>
                  <strong style="color: #374151;">Submitted:</strong> 
                  <span style="color: #6B7280;">${new Date(claim.submitted_at).toLocaleDateString()}</span>
                </div>
              </div>
            `)
            .addTo(mapInstance.current);
        }
      });
    });

    return () => {
      mapInstance.current?.remove();
    };
  }, [highlightedStates, claimsData]);

  if (loading) {
    return (
      <div style={{ 
        position: "relative", 
        height: "100vh", 
        width: "100%", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        backgroundColor: "#f5f5f5"
      }}>
        <div style={{ 
          textAlign: "center", 
          color: "#666",
          fontSize: "16px"
        }}>
          Loading map data...
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>
      {/* Map Scope Note */}
      {showMapNote && (
        <div style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          right: "340px", // Leave space for search bar
          zIndex: 1000,
          background: "linear-gradient(to right, #dbeafe, #e0e7ff)",
          border: "1px solid #93c5fd",
          borderRadius: "16px",
          padding: "16px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{
                width: "32px",
                height: "32px",
                backgroundColor: "#dbeafe",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <span style={{ fontSize: "16px" }}>📍</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{
                fontSize: "14px",
                fontWeight: "bold",
                color: "#1e40af",
                margin: "0 0 4px 0"
              }}>
                Map Coverage Information
              </h4>
              <p style={{
                fontSize: "13px",
                color: "#1e3a8a",
                lineHeight: "1.5",
                margin: 0
              }}>
                This interactive map displays Forest Rights Act (FRA) claims data specifically for India, focusing on four key states: Odisha, Tripura, Telangana, and Madhya Pradesh. The visualization helps track claim statuses, geographical distribution, and progress across these regions as per FRA implementation guidelines.
              </p>
            </div>
            <button
              onClick={() => setShowMapNote(false)}
              style={{
                flexShrink: 0,
                padding: "4px",
                background: "transparent",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.2s ease"
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#bfdbfe"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
              aria-label="Close notice"
            >
              <span style={{ fontSize: "16px", color: "#1e40af" }}>×</span>
            </button>
          </div>
        </div>
      )}

      {/* Full-width search bar */}
      <div 
        ref={geocoderContainer}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "12px",
          padding: "8px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          width: "300px"
        }}
      />
      
      {/* Map container */}
      <div
        ref={mapContainer}
        style={{ 
          position: "absolute", 
          top: 0,
          left: 0,
          height: "100%", 
          width: "100%" 
        }}
      />

      {/* Legend */}
      {highlightedStates && claimsData && (
        <div style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          background: "rgba(255, 255, 255, 0.95)",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
          zIndex: 1000,
          minWidth: "280px",
          border: "1px solid rgba(255, 255, 255, 0.2)"
        }}>
          <h4 style={{
            margin: "0 0 15px 0",
            fontSize: "16px",
            fontWeight: "bold",
            color: "#1F2937",
            borderBottom: "2px solid #E5E7EB",
            paddingBottom: "8px"
          }}>
            Forest Rights Claims Legend
          </h4>
          
          {/* Claim Status Legend */}
          <div style={{ marginBottom: "15px" }}>
            <h5 style={{
              margin: "0 0 8px 0",
              fontSize: "14px",
              fontWeight: "600",
              color: "#374151"
            }}>
              Claim Status
            </h5>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {[
                { status: "Submitted", color: "#F59E0B", count: claimsData.features.filter(f => f.properties.status === "Submitted").length },
                { status: "Verified", color: "#3B82F6", count: claimsData.features.filter(f => f.properties.status === "Verified").length },
                { status: "Approved", color: "#10B981", count: claimsData.features.filter(f => f.properties.status === "Approved").length },
                { status: "Rejected", color: "#EF4444", count: claimsData.features.filter(f => f.properties.status === "Rejected").length },
                { status: "Under Review", color: "#8B5CF6", count: claimsData.features.filter(f => f.properties.status === "Under Review").length }
              ].map(({ status, color, count }) => (
                <div key={status} style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "13px"
                }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{
                      width: "16px",
                      height: "16px",
                      backgroundColor: color,
                      marginRight: "8px",
                      borderRadius: "3px",
                      border: "1px solid rgba(255, 255, 255, 0.5)"
                    }}></div>
                    <span style={{ color: "#4B5563", fontWeight: "500" }}>{status}</span>
                  </div>
                  <span style={{
                    color: "#6B7280",
                    fontSize: "12px",
                    fontWeight: "600",
                    backgroundColor: "#F3F4F6",
                    padding: "2px 6px",
                    borderRadius: "10px"
                  }}>
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Coverage Areas */}
          <div>
            <h5 style={{
              margin: "0 0 8px 0",
              fontSize: "14px",
              fontWeight: "600",
              color: "#374151"
            }}>
              Coverage Areas
            </h5>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
              <div style={{
                width: "16px",
                height: "16px",
                backgroundColor: "#F08D30",
                opacity: 0.6,
                marginRight: "8px",
                borderRadius: "3px",
                border: "2px solid #FFFFFF"
              }}></div>
              <span style={{ color: "#4B5563", fontSize: "13px", fontWeight: "500" }}>
                FRA Implementation States
              </span>
            </div>
          </div>

          {/* Total Stats */}
          <div style={{
            marginTop: "15px",
            paddingTop: "15px",
            borderTop: "1px solid #E5E7EB",
            textAlign: "center"
          }}>
            <div style={{
              fontSize: "12px",
              color: "#6B7280",
              marginBottom: "4px"
            }}>
              Total Claims
            </div>
            <div style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#1F2937"
            }}>
              {claimsData.features.length}
            </div>
          </div>

          {/* Interactive Note */}
          <div style={{
            marginTop: "12px",
            fontSize: "11px",
            color: "#9CA3AF",
            textAlign: "center",
            fontStyle: "italic"
          }}>
            Click on claims for details
          </div>
        </div>
      )}
    </div>
  );
}