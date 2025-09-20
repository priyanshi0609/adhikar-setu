import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps
from app.config import config
from app.logger import setup_logger

logger = setup_logger(__name__)

def preprocess_image(image: np.ndarray, target_dpi: int = 300) -> np.ndarray:
    """Preprocess image for better OCR results with robust handling"""
    try:
        # Convert to PIL Image for consistent processing
        if isinstance(image, np.ndarray):
            # Convert BGR to RGB if needed
            if len(image.shape) == 3 and image.shape[2] == 3:
                image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            pil_image = Image.fromarray(image)
        else:
            pil_image = image
        
        # Store original size
        original_size = pil_image.size
        
        # Convert to grayscale for better OCR
        if pil_image.mode != 'L':
            pil_image = pil_image.convert('L')
        
        # Resize to reasonable dimensions if too large/small
        max_dimension = 4000
        if max(pil_image.size) > max_dimension:
            ratio = max_dimension / max(pil_image.size)
            new_size = (int(pil_image.size[0] * ratio), int(pil_image.size[1] * ratio))
            pil_image = pil_image.resize(new_size, Image.LANCZOS)
            logger.info(f"Resized image from {original_size} to {new_size}")
        
        # Enhance contrast using histogram equalization
        pil_image = ImageOps.equalize(pil_image)
        
        # Apply adaptive thresholding for better binarization
        np_image = np.array(pil_image)
        
        # Use adaptive thresholding instead of global threshold
        binary_image = cv2.adaptiveThreshold(
            np_image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv2.THRESH_BINARY, 11, 2
        )
        
        # Denoise using median blur
        binary_image = cv2.medianBlur(binary_image, 3)
        
        # Deskew the image
        binary_image = deskew_image(binary_image)
        
        # Convert back to PIL for additional enhancements
        pil_image = Image.fromarray(binary_image)
        
        # Enhance sharpness slightly
        enhancer = ImageEnhance.Sharpness(pil_image)
        pil_image = enhancer.enhance(1.2)
        
        logger.info("Image preprocessing completed successfully")
        return np.array(pil_image)
        
    except Exception as e:
        logger.error(f"Error in image preprocessing: {str(e)}")
        # Return original image if preprocessing fails
        if isinstance(image, np.ndarray):
            return image
        else:
            return np.array(image)

def deskew_image(image: np.ndarray) -> np.ndarray:
    """Deskew image using robust method"""
    try:
        # Find all contours
        contours, _ = cv2.findContours(
            image, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE
        )
        
        if not contours:
            return image
        
        # Find the largest contour likely to be text
        contours = sorted(contours, key=cv2.contourArea, reverse=True)
        largest_contour = contours[0]
        
        # Get minimum area rectangle
        rect = cv2.minAreaRect(largest_contour)
        angle = rect[2]
        
        # Adjust angle
        if angle < -45:
            angle = -(90 + angle)
        else:
            angle = -angle
        
        # Only rotate if significant skew
        if abs(angle) > 0.5:
            # Rotate image
            (h, w) = image.shape[:2]
            center = (w // 2, h // 2)
            M = cv2.getRotationMatrix2D(center, angle, 1.0)
            image = cv2.warpAffine(
                image, M, (w, h), flags=cv2.INTER_CUBIC,
                borderMode=cv2.BORDER_REPLICATE
            )
            logger.info(f"Deskewed image by {angle:.2f} degrees")
        
        return image
        
    except Exception as e:
        logger.warning(f"Deskewing failed: {str(e)}")
        return image

def enhance_for_ocr(image: np.ndarray) -> np.ndarray:
    """Additional enhancement specifically for OCR"""
    try:
        # Convert to numpy if it's PIL
        if hasattr(image, 'size'):
            image = np.array(image)
        
        # Ensure it's grayscale
        if len(image.shape) == 3:
            image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        
        # Apply Gaussian blur to reduce noise
        image = cv2.GaussianBlur(image, (1, 1), 0)
        
        # Use Otsu's thresholding
        _, image = cv2.threshold(image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # Morphological operations to clean up text
        kernel = np.ones((1, 1), np.uint8)
        image = cv2.morphologyEx(image, cv2.MORPH_CLOSE, kernel)
        
        return image
        
    except Exception as e:
        logger.error(f"OCR enhancement failed: {str(e)}")
        return image