import React, { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Upload,
  FileText,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
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

const ClaimSubmission = ({ user = {}, language = "en" }) => {
  const mapContainerRef = useRef();
  const mapRef = useRef();
  const drawRef = useRef();
  const [roundedArea, setRoundedArea] = useState();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    claimantName: user.name || "",
    village: user.village || "",
    coordinates: { lat: "", lng: "" },
    landArea: "",
    claimType: "individual",
    documents: [],
  });

  useEffect(() => {
    // Only initialize map when on step 2 (Location Details)
    if (currentStep !== 2) return;

    if (mapRef.current) return;
    if (!mapContainerRef.current) return;

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
  }, [currentStep]);

  const steps = [
    {
      id: 1,
      name: language === "en" ? "Basic Info" : "बुनियादी जानकारी",
      icon: FileText,
    },
    { id: 2, name: language === "en" ? "Location" : "स्थान", icon: MapPin },
    {
      id: 3,
      name: language === "en" ? "Documents" : "दस्तावेज़",
      icon: Upload,
    },
    {
      id: 4,
      name: language === "en" ? "Review" : "समीक्षा",
      icon: CheckCircle,
    },
  ];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileUpload = (files) => {
    console.log("Files uploaded:", files);
  };

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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {language === "en" ? "Basic Information" : "बुनियादी जानकारी"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "en" ? "Claimant Name" : "दावेदार का नाम"}
                </label>
                <input
                  type="text"
                  value={formData.claimantName}
                  onChange={(e) =>
                    handleInputChange("claimantName", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder={
                    language === "en"
                      ? "Enter claimant name"
                      : "दावेदार का नाम दर्ज करें"
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "en" ? "Village" : "गांव"}
                </label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => handleInputChange("village", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder={
                    language === "en"
                      ? "Enter village name"
                      : "गांव का नाम दर्ज करें"
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "en"
                    ? "Land Area (Hectares)"
                    : "भूमि क्षेत्र (हेक्टेयर)"}
                </label>
                <input
                  type="number"
                  value={formData.landArea}
                  onChange={(e) =>
                    handleInputChange("landArea", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "en" ? "Claim Type" : "दावा प्रकार"}
                </label>
                <select
                  aria-label="Claim Type"
                  value={formData.claimType}
                  onChange={(e) =>
                    handleInputChange("claimType", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="individual">
                    {language === "en"
                      ? "Individual Forest Rights"
                      : "व्यक्तिगत वन अधिकार"}
                  </option>
                  <option value="community">
                    {language === "en"
                      ? "Community Forest Rights"
                      : "सामुदायिक वन अधिकार"}
                  </option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
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
                    <p style={paragraphStyle}>Draw a polygon on the map</p>
                    <div id="calculated-area">
                      {roundedArea && (
                        <>
                          <p style={{ ...paragraphStyle, marginTop: 8 }}>
                            <strong>{roundedArea.squareMeters}</strong> sq
                            meters
                          </p>
                          <p style={paragraphStyle}>
                            <strong>{roundedArea.hectares}</strong> hectares
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

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {language === "en" ? "Upload Documents" : "दस्तावेज़ अपलोड करें"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {language === "en" ? "Identity Proof" : "पहचान प्रमाण"}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {language === "en"
                    ? "Aadhaar, Voter ID, etc."
                    : "आधार, वोटर आईडी, आदि"}
                </p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    e.target.files && handleFileUpload(e.target.files)
                  }
                  className="hidden"
                  id="identity-upload"
                />
                <label
                  htmlFor="identity-upload"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-green-700 transition-colors"
                >
                  {language === "en" ? "Upload File" : "फ़ाइल अपलोड करें"}
                </label>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {language === "en" ? "Land Evidence" : "भूमि साक्ष्य"}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {language === "en"
                    ? "Survey records, photos"
                    : "सर्वे रिकॉर्ड, फोटो"}
                </p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  onChange={(e) =>
                    e.target.files && handleFileUpload(e.target.files)
                  }
                  className="hidden"
                  id="evidence-upload"
                />
                <label
                  htmlFor="evidence-upload"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-green-700 transition-colors"
                >
                  {language === "en" ? "Upload Files" : "फ़ाइलें अपलोड करें"}
                </label>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                {language === "en" ? "Upload Guidelines" : "अपलोड दिशा-निर्देश"}
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  •{" "}
                  {language === "en"
                    ? "Maximum file size: 5MB"
                    : "अधिकतम फ़ाइल आकार: 5MB"}
                </li>
                <li>
                  •{" "}
                  {language === "en"
                    ? "Supported formats: PDF, JPG, PNG"
                    : "समर्थित प्रारूप: PDF, JPG, PNG"}
                </li>
                <li>
                  •{" "}
                  {language === "en"
                    ? "Ensure documents are clearly visible"
                    : "सुनिश्चित करें कि दस्तावेज़ स्पष्ट रूप से दिखाई दे रहे हैं"}
                </li>
              </ul>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {language === "en"
                ? "Review Your Claim"
                : "अपने दावे की समीक्षा करें"}
            </h3>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700">
                    {language === "en" ? "Claimant Name" : "दावेदार का नाम"}
                  </h4>
                  <p className="text-gray-900">{formData.claimantName}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">
                    {language === "en" ? "Village" : "गांव"}
                  </h4>
                  <p className="text-gray-900">{formData.village}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">
                    {language === "en" ? "Land Area" : "भूमि क्षेत्र"}
                  </h4>
                  <p className="text-gray-900">{formData.landArea} hectares</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">
                    {language === "en" ? "Coordinates" : "निर्देशांक"}
                  </h4>
                  <p className="text-gray-900">
                    {formData.coordinates.lat}, {formData.coordinates.lng}
                  </p>
                </div>
              </div>

              {roundedArea && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">
                    {language === "en"
                      ? "Drawn Area Details"
                      : "खींचे गए क्षेत्र का विवरण"}
                  </h4>
                  <p className="text-green-800">
                    {language === "en"
                      ? `Total area: ${roundedArea.hectares} hectares (${roundedArea.squareMeters} square meters)`
                      : `कुल क्षेत्र: ${roundedArea.hectares} हेक्टेयर (${roundedArea.squareMeters} वर्ग मीटर)`}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">
                {language === "en"
                  ? "Claim Process Timeline"
                  : "दावा प्रक्रिया समयसीमा"}
              </h4>
              <div className="flex items-center justify-between">
                {[
                  { step: "Submitted", icon: FileText, active: true },
                  { step: "FRC Review", icon: Clock, active: false },
                  {
                    step: "SDLC Verification",
                    icon: CheckCircle,
                    active: false,
                  },
                  { step: "DLC Approval", icon: CheckCircle, active: false },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          item.active
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <p className="text-xs mt-2 text-gray-600">{item.step}</p>
                      {index < 3 && (
                        <div className="w-full h-1 bg-gray-200 mt-2">
                          <div
                            className={`h-1 ${
                              item.active ? "bg-green-500" : "bg-gray-200"
                            }`}
                            style={{ width: "0%" }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center">
              <button className="bg-gradient-to-r from-green-600 to-brown-600 text-white px-12 py-4 rounded-lg font-semibold hover:from-green-700 hover:to-brown-700 transition-all duration-200 text-lg">
                {language === "en" ? "Submit Claim" : "दावा जमा करें"}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {language === "en" ? "Submit New Claim" : "नया दावा जमा करें"}
        </h1>
        <p className="mt-2 text-gray-600">
          {language === "en"
            ? "Follow the steps below to submit your Forest Rights Act claim"
            : "अपने वन अधिकार अधिनियम दावे को जमा करने के लिए नीचे दिए गए चरणों का पालन करें"}
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                    isActive
                      ? "border-green-500 bg-green-500 text-white"
                      : isCompleted
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-300 bg-white text-gray-400"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <p
                    className={`text-sm font-medium ${
                      isActive ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {language === "en" ? `Step ${step.id}` : `चरण ${step.id}`}
                  </p>
                  <p
                    className={`text-xs ${
                      isActive ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {step.name}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div
                      className={`h-1 ${
                        isCompleted ? "bg-green-500" : "bg-gray-200"
                      } rounded`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        {renderStepContent()}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
          disabled={currentStep === 1}
          className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {language === "en" ? "Previous" : "पिछला"}
        </button>

        {currentStep < 4 && (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            {language === "en" ? "Next" : "अगला"}
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ClaimSubmission;

// later - if someone makes the claim here then it must be visible on the map in the home page too
// and then the download report for the area viewing will be available too

// this is just a sample code that i used for testing nothing else..
// import React, { useEffect, useRef, useState } from 'react';
// import mapboxgl from 'mapbox-gl';
// import MapboxDraw from '@mapbox/mapbox-gl-draw';
// import * as turf from '@turf/turf';

// import 'mapbox-gl/dist/mapbox-gl.css';
// import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

// const paragraphStyle = {
//   fontFamily: 'Open Sans',
//   margin: 0,
//   fontSize: 13
// };

// const ClaimSubmission = () => {
//   const mapContainerRef = useRef();
//   const mapRef = useRef();
//   const [roundedArea, setRoundedArea] = useState();

//   useEffect(() => {
//     // Prevent multiple map initializations
//     if (mapRef.current) return;
//     if (!mapContainerRef.current) return;

//     console.log("Initializing map...");
//     mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

//     mapRef.current = new mapboxgl.Map({
//       container: mapContainerRef.current,
//       style: "mapbox://styles/mapbox/satellite-v9",
//       center: [-91.874, 42.76],
//       zoom: 12, // Changed from 20 to 12 for better initial view
//     });

//     const draw = new MapboxDraw({
//       displayControlsDefault: false,
//       controls: {
//         polygon: true,
//         trash: true
//       },
//       defaultMode: 'draw_polygon'
//     });

//     mapRef.current.addControl(draw);
//     mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

//     mapRef.current.on('draw.create', updateArea);
//     mapRef.current.on('draw.delete', updateArea);
//     mapRef.current.on('draw.update', updateArea);

//     function updateArea(e) {
//       const data = draw.getAll();
//       if (data.features.length > 0) {
//         const area = turf.area(data);
//         setRoundedArea(Math.round(area * 100) / 100);
//       } else {
//         setRoundedArea();
//         if (e.type !== 'draw.delete') {
//           console.log('Click the map to draw a polygon.');
//         }
//       }
//     }

//     return () => {
//       if (mapRef.current) {
//         mapRef.current.remove();
//         mapRef.current = null;
//       }
//     };

//   }, []);

//   return (
//     <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
//       <div ref={mapContainerRef} id="map" style={{ height: '100%', width: '100%' }}></div>
//       <div
//         className="calculation-box"
//         style={{
//           height: 75,
//           width: 150,
//           position: 'absolute',
//           bottom: 40,
//           left: 10,
//           backgroundColor: 'rgba(255, 255, 255, 0.9)',
//           padding: 15,
//           textAlign: 'center',
//           borderRadius: 8,
//           boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
//         }}
//       >
//         <p style={paragraphStyle}>Click the map to draw a polygon.</p>
//         <div id="calculated-area">
//           {roundedArea && (
//             <>
//               <p style={paragraphStyle}>
//                 <strong>{roundedArea}</strong>
//               </p>
//               <p style={paragraphStyle}>square meters</p>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ClaimSubmission;
