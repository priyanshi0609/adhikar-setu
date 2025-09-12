import spacy
from typing import List, Dict
from app.config import config
from app.logger import setup_logger

logger = setup_logger(__name__)

# Load spaCy model
try:
    nlp = spacy.load(config.NER_MODEL_NAME)
    logger.info(f"Loaded NER model from {config.NER_MODEL_NAME}")
except:
    logger.warning(f"Could not load NER model from {config.NER_MODEL_NAME}, using blank model")
    nlp = spacy.blank("en")

def extract_entities(text: str, blocks: List[Dict] = None) -> List[Dict]:
    """Extract entities from text using NER model"""
    try:
        doc = nlp(text)
        
        entities = []
        for ent in doc.ents:
            # Find corresponding block if available
            provenance = None
            if blocks:
                provenance = find_block_for_entity(ent, blocks)
            
            entity_data = {
                "text": ent.text,
                "label": ent.label_,
                "start_char": ent.start_char,
                "end_char": ent.end_char,
                "confidence": 0.9,  # Placeholder - spaCy doesn't provide confidence by default
                "provenance": provenance
            }
            entities.append(entity_data)
        
        return entities
        
    except Exception as e:
        logger.error(f"Error in NER extraction: {str(e)}")
        return []

def find_block_for_entity(entity, blocks: List[Dict]) -> Dict:
    """Find the OCR block that contains this entity"""
    for block in blocks:
        block_text = block.get('text', '')
        if entity.text in block_text:
            return {
                "page": 1,  # This would need to be updated for multi-page docs
                "bbox": block.get('bbox', [])
            }
    return None