import pytesseract
from PIL import Image
import cv2
import numpy as np
from typing import List, Dict
from app.config import config
from app.logger import setup_logger

logger = setup_logger(__name__)

def ocr_tesseract(image: np.ndarray, lang: str = None, psm: int = 6) -> Dict:
    """Perform OCR using Tesseract with improved configuration"""
    try:
        if lang is None:
            lang = config.TESSERACT_LANG
            
        # Convert image to PIL format
        if isinstance(image, np.ndarray):
            pil_image = Image.fromarray(image)
        else:
            pil_image = image
        
        # Configure Tesseract for better results
        custom_config = f'--oem 3 --psm {psm} -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-/:().,\'\" '
        
        # Perform OCR with detailed data
        data = pytesseract.image_to_data(
            pil_image, 
            lang=lang, 
            output_type=pytesseract.Output.DICT,
            config=custom_config
        )
        
        # Extract text blocks with bounding boxes
        blocks = []
        n_boxes = len(data['level'])
        
        for i in range(n_boxes):
            text = data['text'][i].strip()
            confidence = float(data['conf'][i]) / 100.0
            
            # Only include meaningful text with reasonable confidence
            if text and confidence > 0.1 and len(text) > 1:
                block = {
                    'bbox': [
                        data['left'][i],
                        data['top'][i],
                        data['left'][i] + data['width'][i],
                        data['top'][i] + data['height'][i]
                    ],
                    'text': text,
                    'confidence': max(confidence, 0.1)  # Ensure minimum confidence
                }
                blocks.append(block)
        
        # Get full text by combining blocks
        full_text = ' '.join([block['text'] for block in blocks if block['text']])
        
        # If no text found, try with different PSM mode
        if not full_text.strip() and psm != 8:
            logger.warning("No text found with PSM 6, trying PSM 8 (single word)")
            return ocr_tesseract(image, lang, psm=8)
        
        # If still no text, try with different OEM
        if not full_text.strip():
            logger.warning("No text found, trying different OEM")
            custom_config = '--oem 1 --psm 6'  # Legacy engine
            full_text = pytesseract.image_to_string(pil_image, lang=lang, config=custom_config)
            if full_text.strip():
                blocks = [{'bbox': [0, 0, pil_image.width, pil_image.height], 
                          'text': full_text, 'confidence': 0.3}]
        
        logger.info(f"OCR extracted {len(full_text)} characters with {len(blocks)} blocks")
        return {
            'text': full_text,
            'blocks': blocks,
            'language': lang,
            'psm_mode': psm
        }
        
    except Exception as e:
        logger.error(f"Tesseract OCR error: {str(e)}")
        # Fallback: return empty but valid structure
        return {
            'text': '',
            'blocks': [],
            'language': lang or 'eng',
            'error': str(e)
        }

def perform_ocr(image: np.ndarray) -> Dict:
    """Perform OCR using configured provider with enhanced preprocessing"""
    try:
        # Apply additional OCR-specific enhancement
        enhanced_image = enhance_for_ocr(image)
        
        if config.OCR_PROVIDER == "google":
            result = ocr_google_vision(enhanced_image)
            if result:
                return result
        
        # Fall back to Tesseract with multiple attempts
        results = []
        
        # Try different PSM modes
        for psm in [6, 8, 11, 13]:  # 6: uniform block, 8: single word, 11: sparse text, 13: raw line
            result = ocr_tesseract(enhanced_image, psm=psm)
            if result['text'].strip():
                results.append(result)
                logger.info(f"PSM {psm} found {len(result['text'])} characters")
        
        # Return the best result (most text)
        if results:
            best_result = max(results, key=lambda x: len(x['text']))
            logger.info(f"Selected PSM {best_result.get('psm_mode', 6)} with {len(best_result['text'])} characters")
            return best_result
        
        # Final fallback
        return ocr_tesseract(enhanced_image, psm=6)
        
    except Exception as e:
        logger.error(f"OCR failed completely: {str(e)}")
        return {
            'text': '',
            'blocks': [],
            'language': config.TESSERACT_LANG,
            'error': str(e)
        }

def enhance_for_ocr(image: np.ndarray) -> np.ndarray:
    """Additional enhancement specifically for OCR"""
    try:
        # Convert to numpy if it's PIL
        if hasattr(image, 'size'):
            image = np.array(image)
        
        # Ensure it's grayscale
        if len(image.shape) == 3:
            image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        
        # Resize if too small for OCR (minimum 300px on smaller dimension)
        height, width = image.shape
        min_dimension = 300
        if min(height, width) < min_dimension:
            scale = min_dimension / min(height, width)
            new_width = int(width * scale)
            new_height = int(height * scale)
            image = cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_CUBIC)
        
        # Apply Gaussian blur to reduce noise
        image = cv2.GaussianBlur(image, (1, 1), 0)
        
        # Use adaptive thresholding for better results
        image = cv2.adaptiveThreshold(
            image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv2.THRESH_BINARY, 11, 2
        )
        
        # Morphological operations to clean up text
        kernel = np.ones((1, 1), np.uint8)
        image = cv2.morphologyEx(image, cv2.MORPH_CLOSE, kernel)
        image = cv2.medianBlur(image, 3)
        
        return image
        
    except Exception as e:
        logger.error(f"OCR enhancement failed: {str(e)}")
        return image