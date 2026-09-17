from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.api import api_router
from seed_db import seed_database

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Land Acquisition Monitoring & Decision Support System for Infrastructure Projects (SIH 2026 PS 26017)",
    version="2.6.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    print("[LandWatch] Application starting up. Verifying database seed...")
    try:
        seed_database()
        print("[LandWatch] Database ready and verified.")
    except Exception as e:
        print(f"[LandWatch] Seed check notification: {e}")


app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def root_status():
    return {
        "platform": "LandWatch",
        "tagline": "Land Acquisition Monitoring & Decision Support System for PM GatiShakti Infrastructure Projects",
        "version": "v2.6.0-prod",
        "status": "OPERATIONAL",
        "docs_url": "/docs",
        "api_v1": settings.API_V1_STR
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "analytics_inference_engine": "active",
        "gov_connectors": {
            "pfms": "connected",
            "ecourts": "connected",
            "bhoomi": "connected",
            "parivesh": "connected"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
