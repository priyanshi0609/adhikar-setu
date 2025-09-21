import React, { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

const paragraphStyle = {
  fontFamily: "Open Sans",
  margin: 0,
  fontSize: 13,
};

const LocationDetail = ({ formData, handleInputChange, language = "en" }) => {
  const mapContainerRef = useRef();
  const mapRef = useRef();
  const drawRef = useRef();
  const [roundedArea, setRoundedArea] = useState();

  useEffect(() => {
    console.log("Initializing map...");

    mapboxgl.accessToken =
      import.meta.env.VITE_MAPBOX_TOKEN ||
      "pk.eyJ1IjoiYXJzaHRpd2FyaSIsImEiOiJjbTJhODE2dm8wZ2MxMmlxdTJkbnJ1aTZnIn0.m9ky2-2MfcdA37RIVoxC_w";

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [-91.874, 42.76],
      zoom: 12,
    });

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: "draw_polygon",
    });

    drawRef.current = draw;
    mapRef.current.addControl(draw);
    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    mapRef.current.on("draw.create", updateArea);
    mapRef.current.on("draw.delete", updateArea);
    mapRef.current.on("draw.update", updateArea);

    function updateArea(e) {
      const data = draw.getAll();
      if (data.features.length > 0) {
        const area = turf.area(data);
        const areaInSquareMeters = Math.round(area * 100) / 100;
        const areaInHectares = Math.round((area / 10000) * 100) / 100;
        setRoundedArea({
          squareMeters: areaInSquareMeters,
          hectares: areaInHectares,
        });

        // Auto-update land area in form
        handleInputChange("landArea", areaInHectares.toString());
      } else {
        setRoundedArea();
        if (e.type !== "draw.delete") {
          console.log("Click the map to draw a polygon.");
        }
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        drawRef.current = null;
      }
    };
  }, [handleInputChange]);

  const handleMapClick = () => {
    if (mapRef.current && drawRef.current) {
      // Get center coordinates and update form
      const center = mapRef.current.getCenter();
      handleInputChange("coordinates", {
        lat: center.lat.toFixed(6),
        lng: center.lng.toFixed(6),
      });
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">
        {language === "en" ? "Location Details" : "स्थान विवरण"}
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="relative" style={{ height: "500px" }}>
            <div
              ref={mapContainerRef}
              id="map"
              style={{
                height: "100%",
                width: "100%",
                borderRadius: "8px",
              }}
            ></div>
            <div
              className="calculation-box"
              style={{
                height: "auto",
                minHeight: 75,
                width: 180,
                position: "absolute",
                bottom: 20,
                left: 10,
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                padding: 15,
                textAlign: "center",
                borderRadius: 8,
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                border: "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <p style={paragraphStyle}>
                {language === "en"
                  ? "Draw a polygon on the map"
                  : "मानचित्र पर एक बहुभुज बनाएं"}
              </p>
              <div id="calculated-area">
                {roundedArea && (
                  <>
                    <p style={{ ...paragraphStyle, marginTop: 8 }}>
                      <strong>{roundedArea.squareMeters}</strong>{" "}
                      {language === "en" ? "sq meters" : "वर्ग मीटर"}
                    </p>
                    <p style={paragraphStyle}>
                      <strong>{roundedArea.hectares}</strong>{" "}
                      {language === "en" ? "hectares" : "हेक्टेयर"}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === "en" ? "Latitude" : "अक्षांश"}
            </label>
            <input
              type="text"
              value={formData.coordinates.lat}
              onChange={(e) =>
                handleInputChange("coordinates", {
                  ...formData.coordinates,
                  lat: e.target.value,
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="20.2961"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === "en" ? "Longitude" : "देशांतर"}
            </label>
            <input
              type="text"
              value={formData.coordinates.lng}
              onChange={(e) =>
                handleInputChange("coordinates", {
                  ...formData.coordinates,
                  lng: e.target.value,
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="85.8245"
            />
          </div>

          <button
            onClick={handleMapClick}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            {language === "en"
              ? "Get Current Map Center"
              : "वर्तमान मैप केंद्र प्राप्त करें"}
          </button>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">
              {language === "en" ? "Map Instructions" : "मैप निर्देश"}
            </h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>
                •{" "}
                {language === "en"
                  ? "Click polygon tool to start drawing"
                  : "ड्राइंग शुरू करने के लिए पॉलीगॉन टूल पर क्लिक करें"}
              </li>
              <li>
                •{" "}
                {language === "en"
                  ? "Click points to create boundary"
                  : "सीमा बनाने के लिए बिंदुओं पर क्लिक करें"}
              </li>
              <li>
                •{" "}
                {language === "en"
                  ? "Double-click to finish polygon"
                  : "पॉलीगॉन समाप्त करने के लिए डबल-क्लिक करें"}
              </li>
              <li>
                •{" "}
                {language === "en"
                  ? "Use trash tool to delete"
                  : "हटाने के लिए ट्रैश टूल का उपयोग करें"}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetail;
