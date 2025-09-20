"""
NER module for FRA document entity recognition.
"""

from app.ner.predict_ner import extract_entities
from app.ner.train_ner import train_ner_model
from app.ner.dataset_utils import load_training_data, convert_to_spacy_format

__all__ = [
    'extract_entities',
    'train_ner_model',
    'load_training_data',
    'convert_to_spacy_format'
]