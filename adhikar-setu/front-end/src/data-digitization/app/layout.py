import cv2
import numpy as np
from typing import List, Dict, Optional
from app.config import config
from app.logger import setup_logger

logger = setup_logger(__name__)

def detect_layout(image: np.ndarray) -> List[Dict]:
    """Detect text blocks and layout elements in image"""
    try:
        # Simple layout detection using contour analysis
        # For production, consider using layoutparser library
        
        # Preprocess for layout detection
        blurred = cv2.GaussianBlur(image, (5, 5), 0)
        _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        
        # Find contours
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        blocks = []
        for contour in contours:
            # Filter by area
            area = cv2.contourArea(contour)
            if area < 100:  # Minimum area threshold
                continue
            
            # Get bounding rectangle
            x, y, w, h = cv2.boundingRect(contour)
            
            # Check aspect ratio to filter non-text elements
            aspect_ratio = w / h
            if aspect_ratio > 10 or aspect_ratio < 0.1:  # Likely not text
                continue
            
            blocks.append({
                'bbox': [x, y, x + w, y + h],
                'type': 'text',  # Assume text block
                'confidence': 0.8
            })
        
        logger.info(f"Detected {len(blocks)} layout blocks")
        return blocks
        
    except Exception as e:
        logger.error(f"Error in layout detection: {str(e)}")
        return []

def detect_tables(image: np.ndarray) -> List[Dict]:
    """Detect tables in the image"""
    try:
        # Simple table detection using horizontal and vertical line detection
        # For production, use specialized table detection libraries
        
        # Detect horizontal lines
        horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (40, 1))
        detect_horizontal = cv2.morphologyEx(image, cv2.MORPH_OPEN, horizontal_kernel, iterations=2)
        
        # Detect vertical lines
        vertical_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 40))
        detect_vertical = cv2.morphologyEx(image, cv2.MORPH_OPEN, vertical_kernel, iterations=2)
        
        # Combine detections
        table_mask = cv2.bitwise_or(detect_horizontal, detect_vertical)
        
        # Find table contours
        contours, _ = cv2.findContours(table_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        tables = []
        for contour in contours:
            area = cv2.contourArea(contour)
            if area > 1000:  # Minimum table area
                x, y, w, h = cv2.boundingRect(contour)
                tables.append({
                    'bbox': [x, y, x + w, y + h],
                    'type': 'table',
                    'confidence': 0.7
                })
        
        logger.info(f"Detected {len(tables)} tables")
        return tables
        
    except Exception as e:
        logger.error(f"Error in table detection: {str(e)}")
        return []