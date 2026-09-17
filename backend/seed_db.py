"""
Database Seeding Script for LandWatch
Creates demo users, benchmark projects, alerts, and initial audit logs.
"""

import os
import sys
import pandas as pd
from datetime import datetime

# Adjust path to import app modules
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from app.database import engine, Base, SessionLocal
from app.models.user import User, UserRole
from app.models.project import Project
from app.models.alert import Alert, AlertSeverity, AlertStatus
from app.models.audit import AuditLog
from app.models.model_registry import ModelRegistry
from app.auth.jwt import get_password_hash
from app.services.alert_service import AlertService


def seed_database():
    print("Creating all database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # 1. Seed Users
        existing_users = db.query(User).count()
        if existing_users == 0:
            print("Seeding demo users...")
            default_pw_hash = get_password_hash("LandWatch@2026")
            
            users = [
                User(
                    email="admin@landwatch.gov.in",
                    full_name="Dr. Rajeshwari Sen, IAS",
                    hashed_password=default_pw_hash,
                    role=UserRole.ADMIN,
                    state="All India",
                    district="National HQ, New Delhi",
                    designation="Mission Director, PM GatiShakti & Land Reforms"
                ),
                User(
                    email="state.mh@landwatch.gov.in",
                    full_name="Vikramaditya Shinde, IAS",
                    hashed_password=default_pw_hash,
                    role=UserRole.STATE_OFFICER,
                    state="Maharashtra",
                    district="Mantralaya, Mumbai",
                    designation="Principal Secretary (Revenue & Land Reforms), Maharashtra"
                ),
                User(
                    email="district.pune@landwatch.gov.in",
                    full_name="Dr. Suhas Diwase, IAS",
                    hashed_password=default_pw_hash,
                    role=UserRole.DISTRICT_COLLECTOR,
                    state="Maharashtra",
                    district="Pune",
                    designation="District Collector & District Magistrate, Pune"
                ),
                User(
                    email="slao.nhai@landwatch.gov.in",
                    full_name="Anand K. Verma, SCS",
                    hashed_password=default_pw_hash,
                    role=UserRole.SLAO,
                    state="Maharashtra",
                    district="Pune",
                    designation="Special Land Acquisition Officer (NHAI / MoRTH Node)"
                ),
                User(
                    email="viewer@landwatch.gov.in",
                    full_name="Public Policy Research Fellow",
                    hashed_password=default_pw_hash,
                    role=UserRole.VIEWER,
                    state="All India",
                    district="New Delhi",
                    designation="NITI Aayog Infrastructure Fellow"
                )
            ]
            db.add_all(users)
            db.commit()
            print("Demo users seeded successfully.")
        else:
            print(f"Users already present ({existing_users}).")

        # 2. Seed Projects
        existing_projects = db.query(Project).count()
        if existing_projects == 0:
            print("Seeding infrastructure projects from synthetic dataset...")
            csv_path = os.path.abspath(os.path.join(CURRENT_DIR, "..", "data", "processed", "synthetic_land_acquisition_projects.csv"))
            
            if os.path.exists(csv_path):
                df = pd.read_csv(csv_path)
                print(f"Reading {len(df)} records from {csv_path}")
                for _, row in df.iterrows():
                    project = Project(
                        project_id=str(row["project_id"]),
                        project_name=str(row["project_name"]),
                        sector=str(row["sector"]),
                        implementing_agency=str(row["implementing_agency"]),
                        state=str(row["state"]),
                        district=str(row["district"]),
                        latitude=float(row["latitude"]),
                        longitude=float(row["longitude"]),
                        current_stage=str(row["current_stage"]),
                        target_duration_months=int(row["target_duration_months"]),
                        elapsed_months=int(row["elapsed_months"]),
                        total_land_required_ha=float(row["total_land_required_ha"]),
                        private_land_ha=float(row["private_land_ha"]),
                        government_land_ha=float(row["government_land_ha"]),
                        forest_land_ha=float(row["forest_land_ha"]),
                        parcels_count=int(row["parcels_count"]),
                        owners_count=int(row["owners_count"]),
                        budget_inr_cr=float(row["budget_inr_cr"]),
                        compensation_disbursed_pct=float(row["compensation_disbursed_pct"]),
                        active_court_disputes=int(row["active_court_disputes"]),
                        cadastral_digitized_pct=float(row["cadastral_digitized_pct"]),
                        aadhaar_seeded_pct=float(row["aadhaar_seeded_pct"]),
                        sia_objection_rate_pct=float(row["sia_objection_rate_pct"]),
                        rr_packages_pending_pct=float(row["rr_packages_pending_pct"]),
                        forest_clearance_status=str(row["forest_clearance_status"]),
                        environment_clearance_status=str(row["environment_clearance_status"]),
                        utility_shifting_pending=int(row["utility_shifting_pending"]),
                        collector_meetings_last_quarter=int(row["collector_meetings_last_quarter"]),
                        primary_bottleneck=str(row["primary_bottleneck"]),
                        delay_probability=float(row["delay_probability"]),
                        risk_tier=str(row["risk_tier"]),
                        is_delayed=int(row["is_delayed"]),
                        delay_months_predicted=int(row["delay_months_predicted"])
                    )
                    db.add(project)
                db.commit()
                print("Projects seeded successfully.")
            else:
                print(f"Warning: {csv_path} not found.")
        else:
            print(f"Projects already present ({existing_projects}).")

        # 3. Seed Alerts
        existing_alerts = db.query(Alert).count()
        if existing_alerts == 0:
            print("Evaluating and generating initial statutory alerts...")
            projects = db.query(Project).all()
            for p in projects:
                AlertService.evaluate_and_generate_alerts(db, p)
            print("Alerts generated successfully.")

        # 4. Seed Initial Model Registry
        existing_models = db.query(ModelRegistry).count()
        if existing_models == 0:
            print("Registering initial ML production model...")
            registry = ModelRegistry(
                model_version="v2.6.0-prod",
                algorithm="HistGradientBoostingClassifier + TreeSHAP",
                accuracy=0.8945,
                f1_score=0.8897,
                roc_auc=0.9412,
                training_samples=2750,
                is_active=True,
                metadata_json='{"framework": "scikit-learn 1.4", "explainability": "TreeSHAP/Attribution Engine", "statutory_alignments": ["RFCTLARR 2013", "PARIVESH 2.0", "DILRMP", "PFMS"]}'
            )
            db.add(registry)
            db.commit()
            print("Model registered successfully.")

        # 5. Seed Initial Audit Log
        existing_logs = db.query(AuditLog).count()
        if existing_logs == 0:
            audit = AuditLog(
                user_email="system@landwatch.gov.in",
                user_role="SYSTEM_DAEMON",
                action="SYSTEM_INITIALIZED",
                resource_type="DATABASE",
                resource_id="landwatch_core_db",
                details="LandWatch platform initialized with PM GatiShakti National Master Plan data connectors.",
                ip_address="127.0.0.1"
            )
            db.add(audit)
            db.commit()

        print("Database seeding completed successfully!")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
