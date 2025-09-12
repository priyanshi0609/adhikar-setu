from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
from datetime import datetime

class FieldExtraction(BaseModel):
    value: Any
    confidence: float
    provenance: Optional[List[Dict]] = None
    original_text: Optional[str] = None

class ExtractedFields(BaseModel):
    claimant_name: Optional[FieldExtraction] = None
    guardian_name: Optional[FieldExtraction] = None
    village: Optional[FieldExtraction] = None
    district: Optional[FieldExtraction] = None
    state: Optional[FieldExtraction] = None
    claim_type: Optional[FieldExtraction] = None
    area_ha: Optional[FieldExtraction] = None
    occupation_date: Optional[FieldExtraction] = None
    issue_date: Optional[FieldExtraction] = None
    coordinates_geojson: Optional[FieldExtraction] = None
    khasra_number: Optional[FieldExtraction] = None
    title_no: Optional[FieldExtraction] = None
    annexure_type: Optional[FieldExtraction] = None
    evidence_list: Optional[List[FieldExtraction]] = None
    claim_status: Optional[FieldExtraction] = None

class OCRBlock(BaseModel):
    bbox: List[float]
    text: str
    confidence: float

class Page(BaseModel):
    page_number: int
    width: int
    height: int
    ocr_text: str
    ocr_blocks: List[OCRBlock]

class AuditLog(BaseModel):
    created_at: datetime
    pipeline_version: str
    logs: List[Dict]

class ParseResponse(BaseModel):
    job_id: str
    status: str
    message: str
    result: Optional[Dict] = None

class ParseRequest(BaseModel):
    file: UploadFile

class TrainingRequest(BaseModel):
    epochs: int = Field(10, ge=1, le=100)
    batch_size: int = Field(8, ge=1, le=32)
    learning_rate: float = Field(5e-5, ge=1e-6, le=1e-3)