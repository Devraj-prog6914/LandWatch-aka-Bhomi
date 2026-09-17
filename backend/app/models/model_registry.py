from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean
from app.database import Base


class ModelRegistry(Base):
    __tablename__ = "model_registry"

    id = Column(Integer, primary_key=True, index=True)
    model_version = Column(String(64), unique=True, index=True, nullable=False)
    algorithm = Column(String(120), nullable=False)
    accuracy = Column(Float, nullable=False)
    f1_score = Column(Float, nullable=False)
    roc_auc = Column(Float, nullable=False)
    training_samples = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=True)
    metadata_json = Column(Text, nullable=True)
    deployed_at = Column(DateTime, default=datetime.utcnow)
