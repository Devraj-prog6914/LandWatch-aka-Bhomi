import pytest
import sys
import os

# Ensure backend root is on sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from fastapi.testclient import TestClient
from app.main import app
from seed_db import seed_database

# Ensure database is seeded for tests
seed_database()
client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["platform"] == "LandWatch"
    assert data["status"] == "OPERATIONAL"


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "gov_connectors" in data


def test_login_demo_admin():
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@landwatch.gov.in", "password": "LandWatch@2026"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "ADMIN"


def test_dashboard_kpis():
    response = client.get("/api/v1/dashboard/kpis")
    assert response.status_code == 200
    data = response.json()
    assert "total_projects" in data
    assert "budget_at_risk_cr" in data
    assert data["total_projects"] > 0


def test_list_projects():
    response = client.get("/api/v1/projects?limit=10")
    assert response.status_code == 200
    projects = response.json()
    assert isinstance(projects, list)
    assert len(projects) > 0
    assert "project_id" in projects[0]
    assert "delay_probability" in projects[0]


def test_project_detail_and_explainability():
    # Fetch first project
    list_res = client.get("/api/v1/projects?limit=1")
    projects = list_res.json()
    project_id = projects[0]["project_id"]

    res = client.get(f"/api/v1/projects/{project_id}")
    assert res.status_code == 200
    detail = res.json()
    assert detail["project_id"] == project_id
    assert "top_risk_drivers" in detail
    assert "waterfall_steps" in detail
    assert "recommendations" in detail
    assert "timeline_milestones" in detail


def test_what_if_simulation():
    list_res = client.get("/api/v1/projects?limit=1")
    project_id = list_res.json()[0]["project_id"]

    sim_payload = {
        "compensation_disbursed_pct": 95.0,
        "active_court_disputes": 0,
        "cadastral_digitized_pct": 98.0,
        "forest_clearance_status": "Stage 2 Approved",
        "collector_meetings_last_quarter": 6
    }
    res = client.post(f"/api/v1/projects/{project_id}/simulate", json=sim_payload)
    assert res.status_code == 200
    sim_data = res.json()
    assert "delay_probability_reduction_pct" in sim_data
    assert "delay_months_saved" in sim_data
    assert "shap_deltas" in sim_data
    assert sim_data["delay_probability_reduction_pct"] >= 0.0


def test_alerts_listing_and_resolution():
    res = client.get("/api/v1/alerts")
    assert res.status_code == 200
    alerts = res.json()
    assert isinstance(alerts, list)
    if len(alerts) > 0:
        alert_id = alerts[0]["id"]
        # Test acknowledge
        ack_res = client.post(f"/api/v1/alerts/{alert_id}/action", json={"action": "ACKNOWLEDGE"})
        assert ack_res.status_code == 200
        assert ack_res.json()["status"] == "ACKNOWLEDGED"


def test_ml_governance():
    res = client.get("/api/v1/ml/governance")
    assert res.status_code == 200
    gov = res.json()
    assert "primary_metrics" in gov
    assert gov["primary_metrics"]["accuracy"] > 0.80
    assert "feature_importances" in gov
    assert len(gov["feature_importances"]) > 0
