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
  const [loading, setLoading] = useState(true);
  const [showMapNote, setShowMapNote] = useState(true);

  // Load GeoJSON data
  useEffect(() => {
    const loadGeoJsonData = async () => {
      try {
        const response = await fetch("/data/india_state_geo.json");
        if (!response.ok) {
          throw new Error(`Failed to load GeoJSON: ${response.statusText}`);
        }
        const data = await response.json();
        setHighlightedStates(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading GeoJSON:", error);
        setLoading(false);
      }
    };

    loadGeoJsonData();
  }, []);

  useEffect(() => {
    if (mapInstance.current || !highlightedStates) return;

    // Initialize map
    mapInstance.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [78.9629, 20.5937], // Center of India
      zoom: 4,
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
      bbox: [68.1766451354, 7.96553477623, 97.4025614766, 35.4940095078] // India bounding box
    });

    // Add geocoder to custom container instead of map
    geocoderContainer.current.appendChild(geocoder.onAdd(mapInstance.current));

    // Wait for map to load before adding layers
    mapInstance.current.on('load', () => {
      // Add source for highlighted states
      mapInstance.current.addSource('highlighted-states', {
        type: 'geojson',
        data: highlightedStates
      });

      // Add fill layer for states
      mapInstance.current.addLayer({
        id: 'states-fill',
        type: 'fill',
        source: 'highlighted-states',
        paint: {
          'fill-color': '#F08D30',
          'fill-opacity': 0.5
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

      // Enhanced hover effects
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
    });

    return () => {
      mapInstance.current?.remove();
    };
  }, [highlightedStates]);

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
      {highlightedStates && (
        <div style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          background: "rgba(255, 255, 255, 0.95)",
          padding: "15px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
          zIndex: 1000,
          minWidth: "200px"
        }}>
          <h4 style={{ margin: "0 0 10px 0", color: "#2C3E50", fontSize: "14px", fontWeight: "bold" }}>
            HIGHLIGHTED STATES
          </h4>
          {highlightedStates.features.map((feature, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
              <div style={{
                width: "20px",
                height: "12px",
                backgroundColor: feature.properties.color,
                borderRadius: "3px",
                marginRight: "10px",
                border: "1px solid rgba(0,0,0,0.1)"
              }} />
              <span style={{ fontSize: "12px", color: "#2C3E50", fontWeight: "500" }}>
                {feature.properties.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}