import pandas as pd
from rapidfuzz import process, fuzz
from typing import Dict, Optional, List
from app.config import config
from app.logger import setup_logger

logger = setup_logger(__name__)

class Gazetteer:
    def __init__(self):
        self.data = None
        self.load_gazetteer()
    
    def load_gazetteer(self) -> None:
        """Load village gazetteer from CSV"""
        try:
            self.data = pd.read_csv(config.GAZETTEER_PATH)
            logger.info(f"Loaded gazetteer with {len(self.data)} entries")
        except Exception as e:
            logger.error(f"Could not load gazetteer: {str(e)}")
            # Create empty dataframe as fallback
            self.data = pd.DataFrame(columns=['village', 'district', 'state', 'code'])
    
    def match_village(self, village_name: str, district: str = None, state: str = None) -> Optional[Dict]:
        """Fuzzy match village name with gazetteer"""
        if not village_name or self.data.empty:
            return None
        
        try:
            # Get all village names for matching
            village_names = self.data['village'].astype(str).tolist()
            
            # Find best match using fuzzy matching
            matches = process.extract(
                village_name, 
                village_names, 
                scorer=fuzz.token_sort_ratio,
                limit=5
            )
            
            # Filter matches above threshold
            valid_matches = [match for match in matches if match[1] >= config.FUZZY_MATCH_THRESHOLD]
            
            if not valid_matches:
                return None
            
            # Get the best match
            best_match_name, best_score, best_index = valid_matches[0]
            best_match = self.data.iloc[best_index].to_dict()
            
            # Additional filtering by district/state if provided
            if district and best_match.get('district'):
                district_score = fuzz.token_sort_ratio(str(district).lower(), str(best_match['district']).lower())
                if district_score < 70:  # District doesn't match well
                    return None
            
            if state and best_match.get('state'):
                state_score = fuzz.token_sort_ratio(str(state).lower(), str(best_match['state']).lower())
                if state_score < 70:  # State doesn't match well
                    return None
            
            return {
                'id': best_match.get('code', ''),
                'village': best_match.get('village', ''),
                'district': best_match.get('district', ''),
                'state': best_match.get('state', ''),
                'score': best_score,
                'match_type': 'fuzzy'
            }
            
        except Exception as e:
            logger.error(f"Error in village matching: {str(e)}")
            return None
    
    def search_villages(self, query: str, limit: int = 10) -> List[Dict]:
        """Search villages by query"""
        if not query or self.data.empty:
            return []
        
        try:
            matches = process.extract(
                query, 
                self.data['village'].astype(str).tolist(), 
                scorer=fuzz.token_sort_ratio,
                limit=limit
            )
            
            results = []
            for match_name, score, index in matches:
                if score >= config.FUZZY_MATCH_THRESHOLD:
                    match_data = self.data.iloc[index].to_dict()
                    results.append({
                        'id': match_data.get('code', ''),
                        'village': match_data.get('village', ''),
                        'district': match_data.get('district', ''),
                        'state': match_data.get('state', ''),
                        'score': score
                    })
            
            return results
            
        except Exception as e:
            logger.error(f"Error in village search: {str(e)}")
            return []

# Global gazetteer instance
gazetteer = Gazetteer()

def match_village(name: str, district: str = None, state: str = None) -> Optional[Dict]:
    """Convenience function to match village"""
    return gazetteer.match_village(name, district, state)