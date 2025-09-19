import re
from datetime import datetime
from dateutil import parser
from typing import Optional, Tuple, Any
from app.config import config
from app.logger import setup_logger

logger = setup_logger(__name__)

def normalize_date(date_str: str) -> Optional[str]:
    """Normalize date string to ISO 8601 format"""
    if not date_str or not isinstance(date_str, str):
        return None
    
    try:
        # Clean the date string
        date_str = re.sub(r'[^\d/\-\.]', ' ', date_str.strip())
        
        # Try parsing with dateutil
        parsed_date = parser.parse(date_str, dayfirst=True, fuzzy=True)
        return parsed_date.strftime('%Y-%m-%d')
        
    except (ValueError, TypeError) as e:
        logger.warning(f"Could not parse date: {date_str} - {str(e)}")
        return None

def parse_area(area_text: str) -> Optional[float]:
    """Parse area text and convert to hectares"""
    if not area_text:
        return None
    
    try:
        # Extract numbers from text
        numbers = re.findall(r'\d+\.?\d*', area_text)
        if not numbers:
            return None
        
        area_value = float(numbers[0])
        
        # Check for common area units and convert to hectares
        if 'acre' in area_text.lower():
            area_value *= 0.404686  # acres to hectares
        elif 'bigha' in area_text.lower():
            area_value *= 0.25  # approximate conversion (varies by region)
        
        return round(area_value, 3)
        
    except (ValueError, TypeError) as e:
        logger.warning(f"Could not parse area: {area_text} - {str(e)}")
        return None

def parse_coordinates(coord_text: str) -> Optional[dict]:
    """Parse coordinates and convert to GeoJSON"""
    if not coord_text:
        return None
    
    try:
        # Try to extract coordinates using various patterns
        patterns = [
            r'(\d+\.\d+)[°\s]*[NS]?[\s,]+(\d+\.\d+)[°\s]*[EW]?',  # Decimal degrees
            r'(\d+)°\s*(\d+)\'\s*(\d+\.?\d*)"\s*[NS],\s*(\d+)°\s*(\d+)\'\s*(\d+\.?\d*)"\s*[EW]',  # DMS
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, coord_text)
            if matches:
                if len(matches[0]) == 2:  # Decimal degrees
                    lat, lon = float(matches[0][0]), float(matches[0][1])
                    return {
                        'type': 'Point',
                        'coordinates': [lon, lat]
                    }
                elif len(matches[0]) == 6:  # DMS
                    # Convert DMS to decimal degrees
                    lat_deg, lat_min, lat_sec = float(matches[0][0]), float(matches[0][1]), float(matches[0][2])
                    lon_deg, lon_min, lon_sec = float(matches[0][3]), float(matches[0][4]), float(matches[0][5])
                    
                    lat = lat_deg + lat_min/60 + lat_sec/3600
                    lon = lon_deg + lon_min/60 + lon_sec/3600
                    
                    return {
                        'type': 'Point',
                        'coordinates': [lon, lat]
                    }
        
        # Try to extract from WKT format
        if 'POLYGON' in coord_text.upper():
            # Extract coordinates from WKT
            coords = re.findall(r'[-+]?\d*\.\d+|\d+', coord_text)
            if len(coords) >= 4 and len(coords) % 2 == 0:
                polygon_coords = []
                for i in range(0, len(coords), 2):
                    polygon_coords.append([float(coords[i]), float(coords[i+1])])
                
                # Ensure polygon is closed
                if polygon_coords[0] != polygon_coords[-1]:
                    polygon_coords.append(polygon_coords[0])
                
                return {
                    'type': 'Polygon',
                    'coordinates': [polygon_coords]
                }
        
        return None
        
    except (ValueError, TypeError) as e:
        logger.warning(f"Could not parse coordinates: {coord_text} - {str(e)}")
        return None

def combine_confidences(ocr_confidence: float, ner_confidence: float) -> float:
    """Combine OCR and NER confidence scores"""
    # Weighted average favoring NER confidence
    return (ocr_confidence * 0.3 + ner_confidence * 0.7)

def normalize_khasra(khasra_text: str) -> Optional[str]:
    """Normalize khasra number format"""
    if not khasra_text:
        return None
    
    try:
        # Clean and standardize khasra format
        khasra_text = re.sub(r'[^\d/]', '', khasra_text.strip())
        if '/' not in khasra_text and len(khasra_text) > 3:
            # Insert slash if missing (e.g., "12345" -> "123/45")
            khasra_text = f"{khasra_text[:3]}/{khasra_text[3:]}"
        
        return khasra_text
        
    except Exception as e:
        logger.warning(f"Could not normalize khasra: {khasra_text} - {str(e)}")
        return khasra_text