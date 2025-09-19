import os
import uuid
from datetime import datetime
from fastapi import UploadFile
import aiofiles
from app.config import config
from app.logger import setup_logger

logger = setup_logger(__name__)

async def ingest_file(file: UploadFile) -> str:
    """Save uploaded file and return document ID"""
    try:
        # Generate unique document ID
        document_id = f"doc_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:8]}"
        
        # Create raw data directory if it doesn't exist
        os.makedirs(config.DATA_RAW, exist_ok=True)
        
        # Determine file extension
        file_extension = os.path.splitext(file.filename)[1].lower()
        if not file_extension:
            file_extension = ".pdf" if file.content_type == "application/pdf" else ".jpg"
        
        # Save file
        file_path = os.path.join(config.DATA_RAW, f"{document_id}{file_extension}")
        
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)
        
        logger.info(f"Saved uploaded file to {file_path}")
        return document_id
        
    except Exception as e:
        logger.error(f"Error ingesting file: {str(e)}")
        raise