import pytesseract
from PIL import Image
import cv2
import numpy as np
from typing import List, Dict
from app.config import config
from app.logger import setup_logger

logger = setup_logger(__name__)

def ocr_tesseract(image: np.ndarray, lang: str = None) -> Dict:
    """Perform OCR using Tesseract"""
    try:
        if lang is None:
            lang = config.TESSERACT_LANG
            
        # Convert image to PIL format
        pil_image = Image.fromarray(image)
        
        # Perform OCR
        data = pytesseract.image_to_data(
            pil_image, 
            lang=lang, 
            output_type=pytesseract.Output.DICT
        )
        
        # Extract text blocks with bounding boxes
        blocks = []
        n_boxes = len(data['level'])
        
        for i in range(n_boxes):
            if int(data['conf'][i]) > 0:  # Only include confident detections
                block = {
                    'bbox': [
                        data['left'][i],
                        data['top'][i],
                        data['left'][i] + data['width'][i],
                        data['top'][i] + data['height'][i]
                    ],
                    'text': data['text'][i],
                    'confidence': float(data['conf'][i]) / 100.0
                }
                blocks.append(block)
        
        # Get full text
        full_text = pytesseract.image_to_string(pil_image, lang=lang)
        
        return {
            'text': full_text,
            'blocks': blocks,
            'language': lang
        }
        
    except Exception as e:
        logger.error(f"Tesseract OCR error: {str(e)}")
        raise

def ocr_google_vision(image: np.ndarray) -> Dict:
    """Perform OCR using Google Vision (if configured)"""
    try:
        # Check if Google Cloud credentials are available
        if not config.GOOGLE_APPLICATION_CREDENTIALS:
            logger.warning("Google Cloud credentials not configured")
            return None
            
        # Implementation for Google Vision OCR
        # This would require google-cloud-vision package
        logger.info("Google Vision OCR not implemented yet")
        return None
        
    except Exception as e:
        logger.error(f"Google Vision OCR error: {str(e)}")
        return None

def perform_ocr(image: np.ndarray) -> Dict:
    """Perform OCR using configured provider"""
    if config.OCR_PROVIDER == "google":
        result = ocr_google_vision(image)
        if result:
            return result
    
    # Fall back to Tesseract
    return ocr_tesseract(image)