import os
from pdf2image import convert_from_path
import cv2
import numpy as np
from typing import Dict
from app.config import config
from app.logger import setup_logger
from app.preprocess import preprocess_image
from app.ocr_provider import perform_ocr
from app.layout import detect_layout, detect_tables
from app.ner.predict_ner import extract_entities
from app.postprocess import (
    normalize_date, parse_area, parse_coordinates, 
    normalize_khasra, combine_confidences
)
from app.gazetteer import match_village
from app.exporter import export_all_formats

logger = setup_logger(__name__)

def process_document(document_id: str) -> Dict:
    """Main pipeline to process a document"""
    try:
        logger.info(f"Starting processing for document: {document_id}")
        
        # Find the document file
        document_path = find_document_file(document_id)
        if not document_path:
            raise FileNotFoundError(f"Document {document_id} not found")
        
        # Convert PDF to images or load image
        if document_path.lower().endswith('.pdf'):
            images = convert_from_path(document_path, dpi=config.DPI)
            logger.info(f"Converted PDF to {len(images)} pages")
        else:
            # Load single image
            image = cv2.imread(document_path)
            images = [image] if image is not None else []
            logger.info("Loaded image document")
        
        if not images:
            raise ValueError("No pages/images found in document")
        
        # Process each page
        pages_data = []
        all_entities = []  # Collect entities from all pages
        
        for page_num, image in enumerate(images):
            logger.info(f"Processing page {page_num + 1}")
            
            # Convert to numpy array if needed (PIL Image to numpy)
            if hasattr(image, 'size'):  # PIL Image
                image_np = np.array(image)
                # Convert RGB to BGR for OpenCV if needed
                if len(image_np.shape) == 3 and image_np.shape[2] == 3:
                    image_np = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
            else:
                image_np = image
            
            # Preprocess image
            processed_image = preprocess_image(image_np)
            
            # Perform OCR - CRITICAL: Pass numpy array, not PIL image
            ocr_result = perform_ocr(processed_image)
            
            # Extract entities using NER
            entities = extract_entities(ocr_result['text'], ocr_result['blocks'])
            
            # Store entities with page context
            for entity in entities:
                entity['page'] = page_num + 1
                all_entities.append(entity)
            
            # Store page data
            page_data = {
                'page_number': page_num + 1,
                'width': processed_image.shape[1],
                'height': processed_image.shape[0],
                'ocr_text': ocr_result['text'],
                'ocr_blocks': ocr_result['blocks'],
                'entities': entities
            }
            pages_data.append(page_data)
        
        # Group entities by type across all pages
        extracted_entities = {}
        for entity in all_entities:
            entity_type = entity['label']
            if entity_type not in extracted_entities:
                extracted_entities[entity_type] = []
            extracted_entities[entity_type].append(entity)
        
        # Post-process and normalize extracted data
        processed_data = process_extracted_entities(extracted_entities)
        
        # Build final document structure
        document_data = {
            'document_id': document_id,
            'source_file': document_path,
            'pages': pages_data,
            'extracted_fields': processed_data,
            'processing_summary': {
                'total_pages': len(pages_data),
                'entities_found': len(all_entities),
                'processing_time': 'TODO'
            }
        }
        
        # Export to all formats
        export_results = export_all_formats(document_data)
        document_data['export_paths'] = export_results
        
        logger.info(f"Completed processing for document: {document_id}")
        logger.info(f"Extracted fields: {list(processed_data.keys())}")
        
        return document_data
        
    except Exception as e:
        logger.error(f"Error processing document {document_id}: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        raise

def find_document_file(document_id: str) -> str:
    """Find the document file by ID"""
    for ext in ['.pdf', '.jpg', '.jpeg', '.png']:
        file_path = os.path.join(config.DATA_RAW, f"{document_id}{ext}")
        if os.path.exists(file_path):
            return file_path
    
    # Also check without extension in case it was already included
    file_path = os.path.join(config.DATA_RAW, document_id)
    if os.path.exists(file_path):
        return file_path
    
    return None

def process_extracted_entities(entities: Dict) -> Dict:
    """Process and normalize extracted entities"""
    processed = {}
    
    # Process each entity type
    for entity_type, entity_list in entities.items():
        if not entity_list:
            continue
        
        # Get the entity with highest confidence
        best_entity = max(entity_list, key=lambda x: x.get('confidence', 0))
        text = best_entity['text']
        confidence = best_entity.get('confidence', 0.8)
        
        # Apply type-specific processing
        if entity_type == 'CLAIMANT_NAME':
            processed['claimant_name'] = {
                'value': text.title(),
                'confidence': confidence,
                'provenance': [{
                    'page': best_entity.get('page', 1),
                    'bbox': best_entity.get('provenance', {}).get('bbox', []) if best_entity.get('provenance') else []
                }]
            }
        
        elif entity_type == 'GUARDIAN_NAME':
            processed['guardian_name'] = {
                'value': text.title(),
                'confidence': confidence,
                'provenance': [{
                    'page': best_entity.get('page', 1),
                    'bbox': best_entity.get('provenance', {}).get('bbox', []) if best_entity.get('provenance') else []
                }]
            }
        
        elif entity_type == 'VILLAGE':
            # Match with gazetteer
            match_result = match_village(text)
            processed['village'] = {
                'value': match_result['village'] if match_result else text,
                'confidence': combine_confidences(confidence, match_result['score']/100 if match_result else 0.5),
                'gazetteer_match': match_result,
                'provenance': [{
                    'page': best_entity.get('page', 1),
                    'bbox': best_entity.get('provenance', {}).get('bbox', []) if best_entity.get('provenance') else []
                }]
            }
        
        elif entity_type == 'DISTRICT':
            processed['district'] = {
                'value': text.title(),
                'confidence': confidence,
                'provenance': [{
                    'page': best_entity.get('page', 1),
                    'bbox': best_entity.get('provenance', {}).get('bbox', []) if best_entity.get('provenance') else []
                }]
            }
        
        elif entity_type == 'AREA_HA':
            area_value = parse_area(text)
            processed['area_ha'] = {
                'value': area_value,
                'confidence': confidence if area_value is not None else 0.3,
                'original_text': text,
                'provenance': [{
                    'page': best_entity.get('page', 1),
                    'bbox': best_entity.get('provenance', {}).get('bbox', []) if best_entity.get('provenance') else []
                }]
            }
        
        elif entity_type == 'OCCUPATION_DATE':
            date_value = normalize_date(text)
            processed['occupation_date'] = {
                'value': date_value,
                'confidence': confidence if date_value is not None else 0.3,
                'original_text': text,
                'provenance': [{
                    'page': best_entity.get('page', 1),
                    'bbox': best_entity.get('provenance', {}).get('bbox', []) if best_entity.get('provenance') else []
                }]
            }
        
        elif entity_type == 'COORDINATES':
            coords_value = parse_coordinates(text)
            processed['coordinates_geojson'] = {
                'value': coords_value,
                'confidence': confidence if coords_value is not None else 0.3,
                'original_text': text,
                'provenance': [{
                    'page': best_entity.get('page', 1),
                    'bbox': best_entity.get('provenance', {}).get('bbox', []) if best_entity.get('provenance') else []
                }]
            }
        
        elif entity_type == 'KHASRA':
            khasra_value = normalize_khasra(text)
            processed['khasra_number'] = {
                'value': khasra_value,
                'confidence': confidence,
                'original_text': text,
                'provenance': [{
                    'page': best_entity.get('page', 1),
                    'bbox': best_entity.get('provenance', {}).get('bbox', []) if best_entity.get('provenance') else []
                }]
            }
        
        elif entity_type == 'TITLE_NO':
            processed['title_no'] = {
                'value': text,
                'confidence': confidence,
                'provenance': [{
                    'page': best_entity.get('page', 1),
                    'bbox': best_entity.get('provenance', {}).get('bbox', []) if best_entity.get('provenance') else []
                }]
            }
        
        # Add more entity type processing as needed
    
    return processed