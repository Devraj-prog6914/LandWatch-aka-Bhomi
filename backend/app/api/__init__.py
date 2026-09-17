from fastapi import APIRouter
from app.api.auth import router as auth_router
from app.api.projects import router as projects_router
from app.api.dashboard import router as dashboard_router
from app.api.alerts import router as alerts_router
from app.api.audit_logs import router as audit_router
from app.api.ml import router as ml_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(projects_router)
api_router.include_router(dashboard_router)
api_router.include_router(alerts_router)
api_router.include_router(audit_router)
api_router.include_router(ml_router)

__all__ = ["api_router"]
