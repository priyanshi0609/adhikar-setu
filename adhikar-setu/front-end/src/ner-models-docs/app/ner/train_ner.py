import spacy
from spacy.training import Example
from spacy.util import minibatch, compounding
import random
import os
import json
from typing import List, Dict
from app.config import config
from app.logger import setup_logger
from app.ner.dataset_utils import load_training_data, convert_to_spacy_format

logger = setup_logger(__name__)

def train_ner_model(epochs: int = 10, batch_size: int = 8, learning_rate: float = 5e-5):
    """Train a custom NER model for FRA documents"""
    try:
        # Load training data
        training_data = load_training_data()
        if not training_data:
            raise ValueError("No training data found. Please add annotated files to data/annotations/")
        
        logger.info(f"Loaded {len(training_data)} training examples")
        
        # Convert to spaCy format
        spacy_training_data = convert_to_spacy_format(training_data)
        
        # Create or load model
        if os.path.exists(config.NER_MODEL_NAME):
            nlp = spacy.load(config.NER_MODEL_NAME)
            logger.info(f"Loaded existing model from {config.NER_MODEL_NAME}")
        else:
            # Create blank model
            nlp = spacy.blank("en")
            logger.info("Created new blank model")
        
        # Add NER pipeline if it doesn't exist
        if "ner" not in nlp.pipe_names:
            ner = nlp.add_pipe("ner", last=True)
        else:
            ner = nlp.get_pipe("ner")
        
        # Add labels to NER
        for example in spacy_training_data:
            for ent in example.get("entities", []):
                ner.add_label(ent[2])
        
        # Get names of other pipes to disable during training
        other_pipes = [pipe for pipe in nlp.pipe_names if pipe != "ner"]
        
        # Training loop
        with nlp.disable_pipes(*other_pipes):
            optimizer = nlp.create_optimizer()
            optimizer.learn_rate = learning_rate
            
            logger.info("Starting training...")
            
            for epoch in range(epochs):
                random.shuffle(spacy_training_data)
                losses = {}
                
                # Batch the examples
                batches = minibatch(spacy_training_data, size=compounding(4.0, 32.0, 1.001))
                
                for batch in batches:
                    examples = []
                    for text, annotations in batch:
                        doc = nlp.make_doc(text)
                        example = Example.from_dict(doc, annotations)
                        examples.append(example)
                    
                    nlp.update(examples, drop=0.3, losses=losses, sgd=optimizer)
                
                logger.info(f"Epoch {epoch + 1}/{epochs}, Loss: {losses['ner']:.4f}")
        
        # Save the model
        os.makedirs(os.path.dirname(config.NER_MODEL_NAME), exist_ok=True)
        nlp.to_disk(config.NER_MODEL_NAME)
        logger.info(f"Model saved to {config.NER_MODEL_NAME}")
        
        # Evaluate the model
        evaluate_model(nlp, spacy_training_data)
        
        return {
            "status": "success",
            "model_path": config.NER_MODEL_NAME,
            "training_examples": len(spacy_training_data),
            "epochs": epochs
        }
        
    except Exception as e:
        logger.error(f"Error training NER model: {str(e)}")
        raise

def evaluate_model(nlp, evaluation_data: List, split_ratio: float = 0.8):
    """Evaluate the trained model"""
    try:
        # Split data into train and test
        split_index = int(len(evaluation_data) * split_ratio)
        train_data = evaluation_data[:split_index]
        test_data = evaluation_data[split_index:]
        
        if not test_data:
            logger.warning("Not enough data for proper evaluation")
            return
        
        # Evaluate on test data
        correct_entities = 0
        total_entities = 0
        total_predicted = 0
        
        for text, annotations in test_data:
            doc = nlp(text)
            gold_entities = annotations.get("entities", [])
            
            # Count correct entities
            for ent in doc.ents:
                total_predicted += 1
                for gold_start, gold_end, gold_label in gold_entities:
                    if (ent.start_char == gold_start and 
                        ent.end_char == gold_end and 
                        ent.label_ == gold_label):
                        correct_entities += 1
                        break
            
            total_entities += len(gold_entities)
        
        # Calculate metrics
        precision = correct_entities / total_predicted if total_predicted > 0 else 0
        recall = correct_entities / total_entities if total_entities > 0 else 0
        f1_score = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
        
        logger.info(f"Evaluation Results:")
        logger.info(f"  Precision: {precision:.3f}")
        logger.info(f"  Recall: {recall:.3f}")
        logger.info(f"  F1 Score: {f1_score:.3f}")
        logger.info(f"  Correct: {correct_entities}/{total_entities} entities")
        
        return {
            "precision": precision,
            "recall": recall,
            "f1_score": f1_score,
            "correct_entities": correct_entities,
            "total_entities": total_entities
        }
        
    except Exception as e:
        logger.error(f"Error evaluating model: {str(e)}")
        return None

def main():
    """Command-line interface for training"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Train FRA NER model")
    parser.add_argument("--epochs", type=int, default=10, help="Number of training epochs")
    parser.add_argument("--batch-size", type=int, default=8, help="Batch size")
    parser.add_argument("--learning-rate", type=float, default=5e-5, help="Learning rate")
    
    args = parser.parse_args()
    
    try:
        result = train_ner_model(args.epochs, args.batch_size, args.learning_rate)
        print(f"Training completed: {result}")
    except Exception as e:
        print(f"Training failed: {str(e)}")
        exit(1)

if __name__ == "__main__":
    main()