"""
Synthetic Dataset Generator for LandWatch
Problem Statement 26017: Land Acquisition Risk & Delay Prediction System for Infrastructure Projects in India.

Generates 2,500+ realistic infrastructure land acquisition records across Indian states,
sectors, agencies, and socio-legal risk indicators with realistic correlations.
"""

import os
import random
import numpy as np
import pandas as pd

# Fix random seeds for reproducibility
SEED = 42
random.seed(SEED)
np.random.seed(SEED)

SECTORS = [
    ("Expressway / Highway", ["NHAI", "MoRTH", "MSRDC", "UPSIDA"]),
    ("High Speed Rail / Rail", ["NHSRCL", "DFCCIL", "Indian Railways", "KRCL"]),
    ("Metro Rail Transit", ["DMRC", "MMRDA", "BMRCL", "CMRL", "UPMRC"]),
    ("Renewable Energy / Solar Park", ["SECI", "NTPC", "Adani Green", "Tata Power"]),
    ("Irrigation & Water Resources", ["State Water Resources Dept", "CWC", "NWDA"]),
    ("Industrial Corridors / Logistics", ["NICDC", "DMICDC", "MIDC", "TIDCO", "GIDC"]),
    ("Port & Airport Connectivity", ["AAI", "IPA", "JNPA", "Adani Ports"])
]

STATES_DISTRICTS = {
    "Maharashtra": ["Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Raigad"],
    "Uttar Pradesh": ["Varanasi", "Lucknow", "Agra", "Prayagraj", "Gorakhpur", "Kanpur Nagar", "Gautam Buddha Nagar"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Bharuch", "Rajkot", "Kutch"],
    "Karnataka": ["Bengaluru Rural", "Belagavi", "Mysuru", "Tumakuru", "Kalaburagi", "Ballari"],
    "Tamil Nadu": ["Kanchipuram", "Coimbatore", "Salem", "Tiruvallur", "Madurai", "Tiruchirappalli"],
    "Andhra Pradesh": ["Visakhapatnam", "Krishna", "Guntur", "Nellore", "Ananthapuramu"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Rewa"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Alwar", "Ajmer", "Bikaner"],
    "Odisha": ["Khordha", "Sundargarh", "Jharsuguda", "Sambalpur", "Cuttack", "Angul"],
    "Bihar": ["Patna", "Muzaffarpur", "Gaya", "Bhagalpur", "Darbhanga", "Vaishali"],
    "West Bengal": ["North 24 Parganas", "Hooghly", "Paschim Bardhaman", "Howrah", "Nadia"],
    "Haryana": ["Gurugram", "Faridabad", "Sonipat", "Panipat", "Rewari", "Karnal"]
}

STAGES = [
    "Section 4 Preliminary Survey",
    "Section 11 Notification",
    "Social Impact Assessment (SIA)",
    "Section 19 Declaration",
    "Section 23 Award Inquiry",
    "Section 38 Possession Handover"
]

PROJECT_PREFIXES = {
    "Expressway / Highway": ["Golden Quadrilateral Spur", "Greenfield Ring Road", "Economic Corridor Phase-II", "Expressway Bypass", "Inter-State Coastal Highway"],
    "High Speed Rail / Rail": ["Bullet Train Feeder Line", "Dedicated Freight Corridor Yard", "Quadrupling Rail Corridor", "High Speed Rail Station Area"],
    "Metro Rail Transit": ["Metro Line-4 Extension", "Airport Metro Link Corridor", "Light Rail Feeder Network", "Metro Depot & Multimodal Hub"],
    "Renewable Energy / Solar Park": ["Ultra Mega Solar Power Park", "Green Hydrogen Corridor", "Wind-Solar Hybrid Zone", "Transmission Evacuation Substation"],
    "Irrigation & Water Resources": ["River Inter-Linking Canal", "Multi-Purpose Dam Reservoir", "Lift Irrigation Canal Network", "Pressurized Irrigation Pipeline"],
    "Industrial Corridors / Logistics": ["Integrated Logistics Zone", "Defense Industrial Hub", "Mega Textile Park (PM MITRA)", "Electronic Manufacturing Cluster"],
    "Port & Airport Connectivity": ["Deepwater Port Express Link", "Greenfield Cargo Airport Link", "Port Hinterland Rail Line", "Coastal Economic Zone Access"]
}


def generate_project_record(idx: int):
    sector_info = random.choice(SECTORS)
    sector = sector_info[0]
    agency = random.choice(sector_info[1])
    
    state = random.choice(list(STATES_DISTRICTS.keys()))
    district = random.choice(STATES_DISTRICTS[state])
    
    prefix = random.choice(PROJECT_PREFIXES[sector])
    project_name = f"{state} {district} {prefix} - Sec {idx + 1}"
    project_id = f"LW-IN-{state[:2].upper()}-{district[:3].upper()}-{1000 + idx}"
    
    stage = random.choice(STAGES)
    stage_idx = STAGES.index(stage)
    
    # Land parameters
    total_land_ha = round(random.uniform(25.0, 1850.0), 2)
    private_pct = random.uniform(0.40, 0.90)
    gov_pct = random.uniform(0.05, 1.0 - private_pct)
    forest_pct = max(0.0, 1.0 - private_pct - gov_pct)
    
    private_land_ha = round(total_land_ha * private_pct, 2)
    government_land_ha = round(total_land_ha * gov_pct, 2)
    forest_land_ha = round(total_land_ha * forest_pct, 2)
    
    parcels_count = int(total_land_ha * random.uniform(2.5, 7.8)) + random.randint(10, 50)
    owners_count = int(parcels_count * random.uniform(1.2, 2.9)) + random.randint(5, 20)
    
    # Financials
    budget_cr = round(total_land_ha * random.uniform(0.45, 1.85) + random.uniform(10.0, 150.0), 2)
    
    # Stage expected duration vs actual
    target_months = 12 + stage_idx * 6 + random.randint(2, 10)
    elapsed_months = max(2, int(target_months * random.uniform(0.3, 1.4)))
    
    # Non-deterministic risk factors with realistic correlations
    # High forest land usually correlates with clearance delays
    has_forest = forest_land_ha > 5.0
    if has_forest:
        forest_clearance_stage = random.choice(["Stage 1 Pending", "Stage 1 In-Review", "Stage 2 Pending", "Stage 2 Approved", "Clearance Rejected"])
    else:
        forest_clearance_stage = "Not Applicable"
        
    environment_clearance = random.choice(["Approved", "Approved", "In-Review", "Terms of Reference Issued", "Pending"])
    
    # Land records digitization and title disputes
    cadastral_digitized_pct = round(random.uniform(35.0, 100.0), 1)
    aadhaar_seeded_pct = round(random.uniform(40.0, 99.0), 1)
    
    # Title disputes correlate inversely with cadastral digitization
    base_dispute_rate = (100.0 - cadastral_digitized_pct) * 0.003 + random.uniform(0.01, 0.08)
    disputes_count = max(0, int(parcels_count * base_dispute_rate) + random.randint(0, 12))
    
    # Compensation disbursement: if Section 19 or later, should be higher unless delayed
    if stage_idx >= 3:
        compensation_disbursed_pct = round(random.uniform(15.0, 98.0), 1)
    else:
        compensation_disbursed_pct = round(random.uniform(0.0, 30.0), 1)
        
    sia_objection_rate_pct = round(random.uniform(1.5, 38.0), 1)
    rr_packages_pending_pct = round(random.uniform(0.0, 75.0), 1)
    utility_shifting_pending = random.randint(0, 28)
    collector_meetings_last_quarter = random.randint(0, 6)
    
    # Synthetic ground truth risk calculation (multi-factor non-linear function + noise)
    risk_score = 0.0
    
    # Factor 1: Title disputes relative to parcels
    dispute_ratio = min(1.0, disputes_count / max(1, parcels_count))
    risk_score += dispute_ratio * 35.0
    
    # Factor 2: Low compensation disbursement in late stages
    if stage_idx >= 3 and compensation_disbursed_pct < 50.0:
        risk_score += (50.0 - compensation_disbursed_pct) * 0.45
        
    # Factor 3: Environmental & Forest friction
    if forest_clearance_stage in ["Stage 1 Pending", "Stage 2 Pending", "Clearance Rejected"]:
        risk_score += 18.0
    if environment_clearance in ["Pending", "Terms of Reference Issued"]:
        risk_score += 12.0
        
    # Factor 4: SIA objections & R&R bottlenecks
    if sia_objection_rate_pct > 20.0:
        risk_score += (sia_objection_rate_pct - 20.0) * 0.65
    if rr_packages_pending_pct > 35.0:
        risk_score += (rr_packages_pending_pct - 35.0) * 0.35
        
    # Factor 5: Administrative cadence
    if collector_meetings_last_quarter <= 1:
        risk_score += 8.0
        
    # Factor 6: Low cadastral digitization
    if cadastral_digitized_pct < 65.0:
        risk_score += (65.0 - cadastral_digitized_pct) * 0.2
        
    # Factor 7: Large number of fragmented landowners
    if owners_count > 1200:
        risk_score += 7.0
        
    # Add random noise
    risk_score += np.random.normal(0, 5.0)
    risk_score = max(5.0, min(98.0, risk_score))
    
    # Delay probability (sigmoid-like scaling)
    delay_prob = 1.0 / (1.0 + np.exp(-(risk_score - 42.0) / 11.0))
    delay_prob = round(float(np.clip(delay_prob, 0.02, 0.98)), 4)
    
    # Ground truth delay label
    is_delayed = 1 if delay_prob >= 0.50 else 0
    
    # Delay months calculation
    if is_delayed:
        delay_months = int(np.clip(np.random.gamma(shape=3.5, scale=2.8) + (delay_prob * 14.0), 3, 36))
    else:
        delay_months = int(np.clip(np.random.exponential(scale=1.5), 0, 5))
        
    if delay_prob >= 0.65:
        risk_tier = "High"
    elif delay_prob >= 0.38:
        risk_tier = "Medium"
    else:
        risk_tier = "Low"
        
    # Primary bottleneck
    bottlenecks = []
    if dispute_ratio > 0.08:
        bottlenecks.append("Litigation in District / High Court")
    if forest_clearance_stage in ["Stage 1 Pending", "Stage 2 Pending", "Clearance Rejected"]:
        bottlenecks.append("Forest & Wildlife Stage-II Clearance")
    if compensation_disbursed_pct < 45.0 and stage_idx >= 3:
        bottlenecks.append("Slow Direct Benefit Transfer (PFMS)")
    if rr_packages_pending_pct > 30.0:
        bottlenecks.append("R&R Resettlement Package Disputes")
    if utility_shifting_pending > 12:
        bottlenecks.append("Pending High-Tension/Pipeline Utility Shifting")
    if cadastral_digitized_pct < 60.0:
        bottlenecks.append("Disputed Cadastral Map Boundaries")
    if not bottlenecks:
        bottlenecks.append("Standard Procedural Progress")
        
    primary_bottleneck = random.choice(bottlenecks)
    
    # Lat/Long coordinates within India
    state_center_coords = {
        "Maharashtra": (19.7515, 75.7139),
        "Uttar Pradesh": (26.8467, 80.9462),
        "Gujarat": (22.2587, 71.1924),
        "Karnataka": (15.3173, 75.7139),
        "Tamil Nadu": (11.1271, 78.6569),
        "Andhra Pradesh": (15.9129, 79.7400),
        "Madhya Pradesh": (22.9734, 78.6569),
        "Rajasthan": (27.0238, 74.2179),
        "Odisha": (20.9517, 85.0985),
        "Bihar": (25.0961, 85.3131),
        "West Bengal": (22.9868, 87.8550),
        "Haryana": (29.0588, 76.0856)
    }
    base_lat, base_lng = state_center_coords.get(state, (20.5937, 78.9629))
    latitude = round(base_lat + random.uniform(-1.2, 1.2), 6)
    longitude = round(base_lng + random.uniform(-1.2, 1.2), 6)
    
    return {
        "project_id": project_id,
        "project_name": project_name,
        "sector": sector,
        "implementing_agency": agency,
        "state": state,
        "district": district,
        "latitude": latitude,
        "longitude": longitude,
        "current_stage": stage,
        "target_duration_months": target_months,
        "elapsed_months": elapsed_months,
        "total_land_required_ha": total_land_ha,
        "private_land_ha": private_land_ha,
        "government_land_ha": government_land_ha,
        "forest_land_ha": forest_land_ha,
        "parcels_count": parcels_count,
        "owners_count": owners_count,
        "budget_inr_cr": budget_cr,
        "compensation_disbursed_pct": compensation_disbursed_pct,
        "active_court_disputes": disputes_count,
        "cadastral_digitized_pct": cadastral_digitized_pct,
        "aadhaar_seeded_pct": aadhaar_seeded_pct,
        "sia_objection_rate_pct": sia_objection_rate_pct,
        "rr_packages_pending_pct": rr_packages_pending_pct,
        "forest_clearance_status": forest_clearance_stage,
        "environment_clearance_status": environment_clearance,
        "utility_shifting_pending": utility_shifting_pending,
        "collector_meetings_last_quarter": collector_meetings_last_quarter,
        "primary_bottleneck": primary_bottleneck,
        # Target variables:
        "delay_probability": delay_prob,
        "risk_tier": risk_tier,
        "is_delayed": is_delayed,
        "delay_months_predicted": delay_months
    }


def generate_dataset(num_records=2750, output_path="../data/processed/synthetic_land_acquisition_projects.csv"):
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    records = [generate_project_record(i) for i in range(num_records)]
    df = pd.DataFrame(records)
    df.to_csv(output_path, index=False)
    print(f"Successfully generated {len(df)} records at {output_path}")
    print(f"Risk Tier Distribution:\n{df['risk_tier'].value_counts(normalize=True)}")
    print(f"Delayed Distribution:\n{df['is_delayed'].value_counts(normalize=True)}")
    return df


if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    target_csv = os.path.join(current_dir, "..", "data", "processed", "synthetic_land_acquisition_projects.csv")
    generate_dataset(num_records=2750, output_path=target_csv)
