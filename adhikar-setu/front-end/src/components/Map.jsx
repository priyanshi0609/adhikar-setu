// src/components/Map.jsx
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function Map() {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (mapInstance.current) return;

    // Initialize map
    mapInstance.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [85.0985, 20.9517],
      zoom: 10,
    });

    // Add geocoder search bar
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl,
      marker: true,
      placeholder: "Search for places", // nice UX
    });

    mapInstance.current.addControl(geocoder, "top-right");

    return () => {
      mapInstance.current?.remove();
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{ position: "relative", height: "100vh", width: "100%" }}
    />
  );
}
