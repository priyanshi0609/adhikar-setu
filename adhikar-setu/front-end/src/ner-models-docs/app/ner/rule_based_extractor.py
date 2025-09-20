import re
from typing import Dict, List, Optional
from app.postprocess import normalize_date, parse_area, parse_coordinates, normalize_khasra
from app.logger import setup_logger

logger = setup_logger(__name__)

class RuleBasedExtractor:
    """Fallback rule-based entity extractor for when NER model is not available"""
    
    def __init__(self):
        self.patterns = {
            'TITLE_NO': [
                r'Title\s*No\.?:\s*([A-Z0-9\-]+)',
                r'Record\s*ID:\s*([A-Z0-9\-]+)',
                r'MP-\w+-\d+-\d+'
            ],
            'CLAIMANT_NAME': [
                r'Name\s*of\s*Title\s*Holder:\s*([A-Za-z\s]+)',
                r'Holder:\s*([A-Za-z\s]+)',
                r'Claimant:\s*([A-Za-z\s]+)'
            ],
            'GUARDIAN_NAME': [
                r"Father's\s*/\s*Husband's\s*Name:\s*([A-Za-z\s]+)",
                r'Guardian:\s*([A-Za-z\s]+)',
                r'Father\'s\s*Name:\s*([A-Za-z\s]+)'
            ],
            'AGE': [
                r'Age:\s*(\d+)',
                r'Age\s*(\d+)'
            ],
            'GENDER': [
                r'Gender:\s*([MaleFemaleOther]+)',
                r'Sex:\s*([MaleFemale]+)'
            ],
            'VILLAGE': [
                r'Village\s*/\s*Gram\s*Panchayat:\s*([A-Za-z\s]+)',
                r'Village:\s*([A-Za-z\s]+)',
                r'Gram:\s*([A-Za-z\s]+)'
            ],
            'DISTRICT': [
                r'District:\s*([A-Za-z\s]+)',
                r'Dist\.:\s*([A-Za-z\s]+)'
            ],
            'STATE': [
                r'State:\s*([A-Za-z\s]+)',
                r'State\s*Name:\s*([A-Za-z\s]+)'
            ],
            'AREA_HA': [
                r'Area\s*\(ha\):\s*([\d\.]+)',
                r'Area:\s*([\d\.]+)\s*ha',
                r'([\d\.]+)\s*hectares'
            ],
            'COORDINATES': [
                r'Coordinates\s*/\s*WKT:\s*(.+)',
                r'POLYGON\(\([^)]+\)\)',
                r'[\d\.]+\s+[\d\.]+(?:,\s*[\d\.]+\s+[\d\.]+)+'
            ],
            'OCCUPATION_DATE': [
                r'Date\s*of\s*Occupation.*?:\s*([\d\-]+)',
                r'Occupation\s*Date:\s*([\d\-]+)'
            ],
            'ISSUE_DATE': [
                r'Date\s*of\s*Issue.*?:\s*([\d\-]+)',
                r'Issue\s*Date:\s*([\d\-]+)'
            ],
            'CLAIM_TYPE': [
                r'Individual\s*Forest\s*Rights',
                r'Community\s*Forest\s*Resource',
                r'Annexure\s+[IIIV]+'
            ]
        }
    
    def extract_entities(self, text: str) -> List[Dict]:
        """Extract entities using rule-based patterns"""
        entities = []
        
        for entity_type, patterns in self.patterns.items():
            for pattern in patterns:
                matches = re.finditer(pattern, text, re.IGNORECASE)
                for match in matches:
                    start, end = match.span()
                    entity_text = match.group(1) if match.groups() else match.group()
                    
                    entities.append({
                        'text': entity_text.strip(),
                        'label': entity_type,
                        'start_char': start,
                        'end_char': end,
                        'confidence': 0.7,  # Moderate confidence for rule-based
                        'method': 'rule_based'
                    })
        
        return entities
    
    def extract_from_ocr_blocks(self, ocr_blocks: List[Dict]) -> List[Dict]:
        """Extract entities from OCR blocks by analyzing text structure"""
        entities = []
        full_text = " ".join([block['text'] for block in ocr_blocks if block['text'].strip()])
        
        # Extract using patterns
        entities.extend(self.extract_entities(full_text))
        
        # Additional structural analysis
        lines = full_text.split('\n')
        for i, line in enumerate(lines):
            line = line.strip()
            
            # Look for key-value pairs
            if ':' in line:
                key, value = line.split(':', 1)
                key = key.strip().lower()
                value = value.strip()
                
                if 'name' in key and 'holder' in key:
                    entities.append({
                        'text': value,
                        'label': 'CLAIMANT_NAME',
                        'start_char': full_text.find(value),
                        'end_char': full_text.find(value) + len(value),
                        'confidence': 0.8,
                        'method': 'key_value'
                    })
                elif 'father' in key or 'husband' in key:
                    entities.append({
                        'text': value,
                        'label': 'GUARDIAN_NAME',
                        'start_char': full_text.find(value),
                        'end_char': full_text.find(value) + len(value),
                        'confidence': 0.8,
                        'method': 'key_value'
                    })
                elif 'village' in key:
                    entities.append({
                        'text': value,
                        'label': 'VILLAGE',
                        'start_char': full_text.find(value),
                        'end_char': full_text.find(value) + len(value),
                        'confidence': 0.8,
                        'method': 'key_value'
                    })
                elif 'district' in key:
                    entities.append({
                        'text': value,
                        'label': 'DISTRICT',
                        'start_char': full_text.find(value),
                        'end_char': full_text.find(value) + len(value),
                        'confidence': 0.8,
                        'method': 'key_value'
                    })
                elif 'area' in key:
                    entities.append({
                        'text': value,
                        'label': 'AREA_HA',
                        'start_char': full_text.find(value),
                        'end_char': full_text.find(value) + len(value),
                        'confidence': 0.8,
                        'method': 'key_value'
                    })
        
        return entities

# Global instance
rule_extractor = RuleBasedExtractor()