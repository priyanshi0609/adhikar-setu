import os
import json
import glob
from typing import List, Dict, Tuple
from app.config import config
from app.logger import setup_logger

logger = setup_logger(__name__)

def load_training_data() -> List[Dict]:
    """Load all training data from annotations directory"""
    training_data = []
    
    # Supported file formats
    patterns = [
        os.path.join(config.DATA_ANNOTATIONS, "*.json"),
        os.path.join(config.DATA_ANNOTATIONS, "*.jsonl"),
        os.path.join(config.DATA_ANNOTATIONS, "*.spacy"),
    ]
    
    for pattern in patterns:
        for file_path in glob.glob(pattern):
            try:
                if file_path.endswith('.json'):
                    data = load_json_annotations(file_path)
                elif file_path.endswith('.jsonl'):
                    data = load_jsonl_annotations(file_path)
                elif file_path.endswith('.spacy'):
                    data = load_spacy_annotations(file_path)
                
                training_data.extend(data)
                logger.info(f"Loaded {len(data)} examples from {file_path}")
                
            except Exception as e:
                logger.error(f"Error loading {file_path}: {str(e)}")
    
    return training_data

def load_json_annotations(file_path: str) -> List[Dict]:
    """Load annotations from JSON file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Handle different JSON formats
    if isinstance(data, list):
        return data
    elif isinstance(data, dict) and 'examples' in data:
        return data['examples']
    else:
        return [data]

def load_jsonl_annotations(file_path: str) -> List[Dict]:
    """Load annotations from JSONL file"""
    data = []
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            if line.strip():
                data.append(json.loads(line))
    return data

def load_spacy_annotations(file_path: str) -> List[Dict]:
    """Load spaCy binary training data"""
    # This would require spacy's binary format handling
    # For now, return empty list - implement if needed
    logger.warning("spaCy binary format not yet implemented")
    return []

def convert_to_spacy_format(training_data: List[Dict]) -> List[Tuple[str, Dict]]:
    """Convert training data to spaCy format (text, annotations)"""
    spacy_data = []
    
    for example in training_data:
        if not isinstance(example, dict):
            continue
        
        text = example.get('text', '')
        if not text:
            continue
        
        entities = []
        for entity in example.get('entities', []):
            if (isinstance(entity, list) and len(entity) >= 3 and 
                isinstance(entity[0], int) and isinstance(entity[1], int)):
                start, end, label = entity[0], entity[1], entity[2]
                entities.append((start, end, label))
        
        spacy_data.append((text, {'entities': entities}))
    
    return spacy_data

def split_training_data(data: List[Dict], train_ratio: float = 0.8) -> Tuple[List[Dict], List[Dict]]:
    """Split data into training and validation sets"""
    split_index = int(len(data) * train_ratio)
    return data[:split_index], data[split_index:]

def get_entity_statistics(training_data: List[Dict]) -> Dict:
    """Get statistics about entities in training data"""
    entity_counts = {}
    total_entities = 0
    
    for example in training_data:
        for entity in example.get('entities', []):
            if isinstance(entity, list) and len(entity) >= 3:
                label = entity[2]
                entity_counts[label] = entity_counts.get(label, 0) + 1
                total_entities += 1
    
    return {
        'total_examples': len(training_data),
        'total_entities': total_entities,
        'entity_counts': entity_counts,
        'entities_per_example': total_entities / len(training_data) if training_data else 0
    }

def validate_annotations(training_data: List[Dict]) -> List[Dict]:
    """Validate training data and return valid examples"""
    valid_data = []
    
    for example in training_data:
        if not isinstance(example, dict):
            continue
        
        text = example.get('text', '')
        if not text or not isinstance(text, str):
            continue
        
        valid_entities = []
        for entity in example.get('entities', []):
            if (isinstance(entity, list) and len(entity) >= 3 and
                isinstance(entity[0], int) and isinstance(entity[1], int) and
                entity[0] >= 0 and entity[1] <= len(text) and
                entity[0] < entity[1] and
                isinstance(entity[2], str)):
                valid_entities.append(entity)
        
        if valid_entities:
            valid_data.append({
                'text': text,
                'entities': valid_entities
            })
    
    return valid_data

def export_to_spacy_jsonl(training_data: List[Dict], output_path: str):
    """Export training data to spaCy JSONL format"""
    spacy_data = convert_to_spacy_format(training_data)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        for text, annotations in spacy_data:
            record = {
                'text': text,
                'entities': annotations['entities']
            }
            f.write(json.dumps(record, ensure_ascii=False) + '\n')
    
    logger.info(f"Exported {len(spacy_data)} examples to {output_path}")