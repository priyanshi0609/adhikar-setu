import spacy
from typing import List, Dict
from app.config import config
from app.logger import setup_logger
from app.ner.rule_based_extractor import rule_extractor

logger = setup_logger(__name__)

# Try to load spaCy model, fall back to rule-based
try:
    nlp = spacy.load(config.NER_MODEL_NAME)
    logger.info(f"Loaded NER model from {config.NER_MODEL_NAME}")
    model_available = True
except:
    logger.warning(f"Could not load NER model from {config.NER_MODEL_NAME}, using rule-based extraction")
    nlp = None
    model_available = False

def extract_entities(text: str, blocks: List[Dict] = None) -> List[Dict]:
    """Extract entities from text using available methods"""
    try:
        if model_available and nlp:
            return extract_with_model(text, blocks)
        else:
            return extract_with_rules(text, blocks)
    except Exception as e:
        logger.error(f"Error in entity extraction: {str(e)}")
        return []

def extract_with_model(text: str, blocks: List[Dict] = None) -> List[Dict]:
    """Extract entities using spaCy model"""
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
            "confidence": 0.9,  # Placeholder
            "provenance": provenance,
            "method": "model"
        }
        entities.append(entity_data)
    
    return entities

def extract_with_rules(text: str, blocks: List[Dict] = None) -> List[Dict]:
    """Extract entities using rule-based methods"""
    # Extract from full text
    entities = rule_extractor.extract_entities(text)
    
    # Also extract from OCR blocks structure
    if blocks:
        entities.extend(rule_extractor.extract_from_ocr_blocks(blocks))
    
    # Remove duplicates (keep highest confidence)
    unique_entities = {}
    for entity in entities:
        key = (entity['label'], entity['text'].lower())
        if key not in unique_entities or entity['confidence'] > unique_entities[key]['confidence']:
            unique_entities[key] = entity
    
    return list(unique_entities.values())

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