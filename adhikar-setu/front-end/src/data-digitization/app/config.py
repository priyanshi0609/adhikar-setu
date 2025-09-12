import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Environment
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
    
    # File paths
    DATA_RAW = os.getenv("DATA_RAW", "data/raw")
    DATA_PROCESSED = os.getenv("DATA_PROCESSED", "data/processed")
    DATA_ANNOTATIONS = os.getenv("DATA_ANNOTATIONS", "data/annotations")
    MODELS_DIR = os.getenv("MODELS_DIR", "models")
    
    # OCR Configuration
    OCR_PROVIDER = os.getenv("OCR_PROVIDER", "tesseract")  # tesseract, google, aws
    TESSERACT_LANG = os.getenv("TESSERACT_LANG", "eng+hin")
    DPI = int(os.getenv("DPI", "300"))
    
    # NER Configuration
    NER_MODEL_NAME = os.getenv("NER_MODEL_NAME", "models/ner")
    NER_CONFIDENCE_THRESHOLD = float(os.getenv("NER_CONFIDENCE_THRESHOLD", "0.7"))
    
    # Gazetteer Configuration
    GAZETTEER_PATH = os.getenv("GAZETTEER_PATH", "docs/gazetteer.csv")
    FUZZY_MATCH_THRESHOLD = int(os.getenv("FUZZY_MATCH_THRESHOLD", "85"))
    
    # API Configuration
    API_HOST = os.getenv("API_HOST", "0.0.0.0")
    API_PORT = int(os.getenv("API_PORT", "8000"))
    
    # Security
    ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY", "dev-key-change-in-production")
    TRAINING_TOKEN = os.getenv("TRAINING_TOKEN", "training-token")
    
    # Cloud OCR (optional)
    GOOGLE_APPLICATION_CREDENTIALS = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

config = Config()