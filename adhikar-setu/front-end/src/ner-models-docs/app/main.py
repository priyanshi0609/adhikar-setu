from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.config import config
from app.api import router as api_router
from app.logger import setup_logger

# Setup logger
logger = setup_logger(__name__)

app = FastAPI(
    title="FRA Data Digitization API",
    description="API for digitizing Forest Rights Act documents",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "FRA Data Digitization API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=config.API_HOST, port=config.API_PORT)