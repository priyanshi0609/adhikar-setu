import json
import csv
import os
from datetime import datetime
from typing import Dict, List, Any , Optional
from app.config import config
from app.logger import setup_logger

logger = setup_logger(__name__)

def export_to_json(document_data: Dict, output_path: str = None) -> str:
    """Export document data to JSON format"""
    try:
        # Add audit information
        if 'audit' not in document_data:
            document_data['audit'] = {
                'created_at': datetime.now().isoformat(),
                'pipeline_version': '1.0.0',
                'logs': []
            }
        
        # Generate output filename if not provided
        if not output_path:
            doc_id = document_data.get('document_id', f"doc_{datetime.now().strftime('%Y%m%d_%H%M%S')}")
            output_path = os.path.join(config.DATA_PROCESSED, f"{doc_id}.json")
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Write JSON file
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(document_data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Exported JSON to {output_path}")
        return output_path
        
    except Exception as e:
        logger.error(f"Error exporting to JSON: {str(e)}")
        raise

def export_to_csv(document_data: Dict, output_path: str = None) -> str:
    """Export document data to CSV format"""
    try:
        # Generate output filename if not provided
        if not output_path:
            doc_id = document_data.get('document_id', f"doc_{datetime.now().strftime('%Y%m%d_%H%M%S')}")
            output_path = os.path.join(config.DATA_PROCESSED, f"{doc_id}.csv")
        
        # Extract fields for CSV
        extracted_fields = document_data.get('extracted_fields', {})
        
        # Prepare CSV data
        csv_data = {
            'document_id': document_data.get('document_id', ''),
            'source_file': document_data.get('source_file', ''),
            'processing_date': datetime.now().isoformat()
        }
        
        # Add extracted fields
        for field_name, field_data in extracted_fields.items():
            if isinstance(field_data, dict) and 'value' in field_data:
                csv_data[field_name] = field_data['value']
            else:
                csv_data[field_name] = field_data
        
        # Write CSV file
        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=csv_data.keys())
            writer.writeheader()
            writer.writerow(csv_data)
        
        logger.info(f"Exported CSV to {output_path}")
        return output_path
        
    except Exception as e:
        logger.error(f"Error exporting to CSV: {str(e)}")
        raise

def export_to_geojson(document_data: Dict, output_path: str = None) -> Optional[str]:
    """Export geographic data to GeoJSON format"""
    try:
        extracted_fields = document_data.get('extracted_fields', {})
        coordinates = extracted_fields.get('coordinates_geojson', {}).get('value')
        
        if not coordinates:
            logger.warning("No coordinates found for GeoJSON export")
            return None
        
        # Generate output filename if not provided
        if not output_path:
            doc_id = document_data.get('document_id', f"doc_{datetime.now().strftime('%Y%m%d_%H%M%S')}")
            output_path = os.path.join(config.DATA_PROCESSED, f"{doc_id}.geojson")
        
        # Create GeoJSON feature
        feature = {
            'type': 'Feature',
            'properties': {
                'document_id': document_data.get('document_id', ''),
                'claimant_name': extracted_fields.get('claimant_name', {}).get('value', ''),
                'village': extracted_fields.get('village', {}).get('value', ''),
                'area_ha': extracted_fields.get('area_ha', {}).get('value', ''),
                'title_no': extracted_fields.get('title_no', {}).get('value', '')
            },
            'geometry': coordinates
        }
        
        # Write GeoJSON file
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(feature, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Exported GeoJSON to {output_path}")
        return output_path
        
    except Exception as e:
        logger.error(f"Error exporting to GeoJSON: {str(e)}")
        return None

def export_all_formats(document_data: Dict, base_path: str = None) -> Dict:
    """Export document data to all available formats"""
    try:
        if not base_path:
            doc_id = document_data.get('document_id')
            base_path = os.path.join(config.DATA_PROCESSED, doc_id)
        
        results = {
            'json': export_to_json(document_data, f"{base_path}.json"),
            'csv': export_to_csv(document_data, f"{base_path}.csv")
        }
        
        # Only export GeoJSON if coordinates are available
        geojson_path = export_to_geojson(document_data, f"{base_path}.geojson")
        if geojson_path:
            results['geojson'] = geojson_path
        
        return results
        
    except Exception as e:
        logger.error(f"Error exporting all formats: {str(e)}")
        raise