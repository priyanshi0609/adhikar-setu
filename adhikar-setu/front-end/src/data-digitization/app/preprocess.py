import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
from app.config import config
from app.logger import setup_logger

logger = setup_logger(__name__)

def preprocess_image(image: np.ndarray) -> np.ndarray:
    """Preprocess image for better OCR results"""
    try:
        # Convert to PIL Image for some operations
        if isinstance(image, np.ndarray):
            pil_image = Image.fromarray(image)
        else:
            pil_image = image
        
        # Convert to grayscale if needed
        if pil_image.mode != 'L':
            pil_image = pil_image.convert('L')
        
        # Enhance contrast
        enhancer = ImageEnhance.Contrast(pil_image)
        pil_image = enhancer.enhance(1.5)
        
        # Enhance sharpness
        enhancer = ImageEnhance.Sharpness(pil_image)
        pil_image = enhancer.enhance(2.0)
        
        # Apply mild denoising
        pil_image = pil_image.filter(ImageFilter.MedianFilter(size=3))
        
        # Convert back to numpy array for OpenCV operations
        image = np.array(pil_image)
        
        # Deskew image
        image = deskew_image(image)
        
        # Binarization (Otsu's method)
        _, image = cv2.threshold(image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # Remove noise using morphological operations
        kernel = np.ones((1, 1), np.uint8)
        image = cv2.morphologyEx(image, cv2.MORPH_CLOSE, kernel)
        image = cv2.medianBlur(image, 3)
        
        # Ensure proper DPI (resize if needed)
        height, width = image.shape
        target_height = int(height * (300 / 72))  # Assuming 72 DPI original
        if target_height > height:
            image = cv2.resize(image, (width, target_height), interpolation=cv2.INTER_CUBIC)
        
        logger.info("Image preprocessing completed successfully")
        return image
        
    except Exception as e:
        logger.error(f"Error in image preprocessing: {str(e)}")
        return image

def deskew_image(image: np.ndarray) -> np.ndarray:
    """Deskew image using Hough line detection"""
    try:
        # Convert to binary image
        _, binary = cv2.threshold(image, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        
        # Detect lines using Hough transform
        lines = cv2.HoughLinesP(
            binary, 1, np.pi/180, threshold=100, minLineLength=100, maxLineGap=10
        )
        
        if lines is not None:
            angles = []
            for line in lines:
                x1, y1, x2, y2 = line[0]
                angle = np.degrees(np.arctan2(y2 - y1, x2 - x1))
                angles.append(angle)
            
            # Calculate median angle
            median_angle = np.median(angles)
            
            # Rotate image to correct skew
            if abs(median_angle) > 0.5:  # Only rotate if significant skew
                (h, w) = image.shape[:2]
                center = (w // 2, h // 2)
                M = cv2.getRotationMatrix2D(center, median_angle, 1.0)
                image = cv2.warpAffine(image, M, (w, h), flags=cv2.INTER_CUBIC, 
                                     borderMode=cv2.BORDER_REPLICATE)
        
        return image
        
    except Exception as e:
        logger.warning(f"Deskewing failed: {str(e)}")
        return image