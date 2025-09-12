from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, BackgroundTasks
from fastapi.responses import JSONResponse
import uuid
import os
from datetime import datetime
from typing import List

from app.config import config
from app.models import ParseResponse, ParseRequest, TrainingRequest
from app.ingestion import ingest_file
from app.worker import process_document
from app.ner.train_ner import train_ner_model
from app.logger import setup_logger

router = APIRouter()
logger = setup_logger(__name__)

# In-memory job store (replace with Redis in production)
jobs = {}

@router.post("/parse", response_model=ParseResponse)
async def parse_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """Parse a single document"""
    try:
        # Generate job ID
        job_id = str(uuid.uuid4())
        
        # Save uploaded file
        document_id = await ingest_file(file)
        
        # Store job info
        jobs[job_id] = {
            "job_id": job_id,
            "document_id": document_id,
            "status": "processing",
            "created_at": datetime.now(),
            "result": None
        }
        
        # Process document in background
        background_tasks.add_task(process_document_task, job_id, document_id)
        
        return ParseResponse(
            job_id=job_id,
            status="processing",
            message="Document processing started"
        )
        
    except Exception as e:
        logger.error(f"Error parsing document: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/parse/{job_id}", response_model=ParseResponse)
async def get_parse_result(job_id: str):
    """Get result of a parsing job"""
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = jobs[job_id]
    return ParseResponse(
        job_id=job_id,
        status=job["status"],
        result=job["result"],
        message="Job completed successfully" if job["status"] == "completed" else "Job still processing"
    )

@router.post("/parse/batch")
async def parse_batch(files: List[UploadFile] = File(...)):
    """Parse multiple documents in batch"""
    # Implementation for batch processing
    return {"message": "Batch processing not yet implemented"}

@router.post("/train-ner")
async def train_ner(
    request: TrainingRequest,
    token: str = Depends(validate_training_token)
):
    """Train NER model with current annotations"""
    try:
        result = train_ner_model(request.epochs, request.batch_size, request.learning_rate)
        return {"message": "Training started", "training_id": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def validate_training_token(token: str):
    """Validate training token"""
    if token != config.TRAINING_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid training token")
    return True

async def process_document_task(job_id: str, document_id: str):
    """Background task to process document"""
    try:
        result = process_document(document_id)
        jobs[job_id]["status"] = "completed"
        jobs[job_id]["result"] = result
        jobs[job_id]["completed_at"] = datetime.now()
    except Exception as e:
        jobs[job_id]["status"] = "failed"
        jobs[job_id]["error"] = str(e)
        logger.error(f"Error processing document {document_id}: {str(e)}")