import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different types of rights
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const grantedRightsIcon = createCustomIcon('#10b981'); // green
const underProcessIcon = createCustomIcon('#f59e0b'); // yellow
const communityRightsIcon = createCustomIcon('#3b82f6'); // blue
const individualRightsIcon = createCustomIcon('#8b5cf6'); // purple

// Component to handle map view changes
function MapView({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
}

const MapComponent = ({ 
  selectedState, 
  selectedDistrict, 
  language, 
  onExport, 
  onLayerToggle 
}) => {
  // Default coordinates for Chhattisgarh, Bastar district
  const defaultCenter = [19.2000, 81.8667]; // Bastar, Chhattisgarh
  const defaultZoom = 10;

  // Sample data for demonstration - in real app, this would come from props or API
  const mapData = [
    {
      id: 1,
      position: [19.2000, 81.8667],
      type: 'granted',
      village: 'Jagdalpur',
      claims: 234,
      granted: 189,
      area: '456 Ha',
      families: 2890
    },
    {
      id: 2,
      position: [19.1500, 81.9000],
      type: 'under-process',
      village: 'Kondagaon',
      claims: 189,
      granted: 156,
      area: '378 Ha',
      families: 1876
    },
    {
      id: 3,
      position: [19.2500, 81.8000],
      type: 'community',
      village: 'Keskal',
      claims: 145,
      granted: 123,
      area: '289 Ha',
      families: 1234
    },
    {
      id: 4,
      position: [19.1000, 81.9500],
      type: 'individual',
      village: 'Narayanpur',
      claims: 98,
      granted: 87,
      area: '156 Ha',
      families: 567
    }
  ];

  const getIconForType = (type) => {
    switch (type) {
      case 'granted':
        return grantedRightsIcon;
      case 'under-process':
        return underProcessIcon;
      case 'community':
        return communityRightsIcon;
      case 'individual':
        return individualRightsIcon;
      default:
        return grantedRightsIcon;
    }
  };

  const getTypeLabel = (type) => {
    if (language === 'hi') {
      switch (type) {
        case 'granted': return 'प्रदत्त अधिकार';
        case 'under-process': return 'प्रक्रियाधीन';
        case 'community': return 'सामुदायिक अधिकार';
        case 'individual': return 'व्यक्तिगत अधिकार';
        default: return 'अधिकार';
      }
    } else {
      switch (type) {
        case 'granted': return 'Granted Rights';
        case 'under-process': return 'Under Process';
        case 'community': return 'Community Rights';
        case 'individual': return 'Individual Rights';
        default: return 'Rights';
      }
    }
  };

  return (
    <div className="relative">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '400px', width: '100%', borderRadius: '8px' }}
        className="z-0"
      >
        <MapView center={defaultCenter} zoom={defaultZoom} />
        
        {/* OpenStreetMap tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Markers for FRA data */}
        {mapData.map((item) => (
          <Marker
            key={item.id}
            position={item.position}
            icon={getIconForType(item.type)}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-gray-900 mb-2">{item.village}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.district || selectedDistrict} District</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {language === 'hi' ? 'दावे:' : 'Claims:'}
                    </span>
                    <span className="font-medium">{item.claims}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {language === 'hi' ? 'प्रदान:' : 'Granted:'}
                    </span>
                    <span className="font-medium text-green-600">{item.granted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {language === 'hi' ? 'क्षेत्र:' : 'Area:'}
                    </span>
                    <span className="font-medium">{item.area}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {language === 'hi' ? 'परिवार:' : 'Families:'}
                    </span>
                    <span className="font-medium">{item.families}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === 'granted' ? 'bg-green-100 text-green-700' :
                      item.type === 'under-process' ? 'bg-yellow-100 text-yellow-700' :
                      item.type === 'community' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {getTypeLabel(item.type)}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Controls Overlay */}
      <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-sm z-10">
        <div className="flex flex-col space-y-2">
          <button 
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center text-sm font-medium"
            title={language === 'hi' ? 'ज़ूम इन' : 'Zoom In'}
          >
            +
          </button>
          <button 
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center text-sm font-medium"
            title={language === 'hi' ? 'ज़ूम आउट' : 'Zoom Out'}
          >
            -
          </button>
        </div>
      </div>

      {/* Map Legend */}
      <div className="mt-4 bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">
          {language === 'en' ? 'Map Legend' : 'मैप व्याख्या'}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm">{language === 'en' ? 'Granted Rights' : 'प्रदत्त अधिकार'}</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm">{language === 'en' ? 'Under Process' : 'प्रक्रियाधीन'}</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm">{language === 'en' ? 'Community Rights' : 'सामुदायिक अधिकार'}</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
            <span className="text-sm">{language === 'en' ? 'Individual Rights' : 'व्यक्तिगत अधिकार'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
