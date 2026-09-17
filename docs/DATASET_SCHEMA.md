# LandWatch - Dataset Dictionary & Schema Specification

**Dataset File:** `data/processed/synthetic_land_acquisition_projects.csv`  
**Record Count:** 2,750 comprehensive infrastructure land acquisition records  
**Alignment:** PM GatiShakti National Master Plan, RFCTLARR Act 2013, PARIVESH 2.0, DILRMP

---

## 1. Data Fields & Attribute Dictionary

| Column Name | Data Type | Unit / Format | Description | Statutory / Policy Context |
| :--- | :--- | :--- | :--- | :--- |
| `project_id` | String | `LW-IN-{ST}-{DIS}-{NUM}` | Unique national requisition identifier | PM GatiShakti ID |
| `project_name` | String | Text | Infrastructure corridor or project segment | Implementing gazette |
| `sector` | String | Categorical | Sector (Expressway, High Speed Rail, Metro, Solar, etc.) | Central Infrastructure Ministry |
| `implementing_agency`| String | Categorical | NHAI, NHSRCL, DFCCIL, DMRC, NTPC, SECI, State PWD | Nodal Executing Authority |
| `state` | String | Text | Indian State | Jurisdiction |
| `district` | String | Text | Revenue District | District Magistrate / SLAO |
| `latitude` | Float | Decimal Degrees | Spatial centroid latitude (WGS84) | Survey of India / GIS |
| `longitude` | Float | Decimal Degrees | Spatial centroid longitude (WGS84) | Survey of India / GIS |
| `current_stage` | String | Categorical | Current RFCTLARR statutory stage | Sections 4, 11, 19, 23, 38 |
| `target_duration_months`| Integer | Months | Target gazetted timeframe for acquisition | Statutory schedule |
| `elapsed_months` | Integer | Months | Timeline consumed since Preliminary Notification | Administrative tracking |
| `total_land_required_ha`| Float | Hectares | Total requisition land footprint | Section 11 Notification |
| `private_land_ha` | Float | Hectares | Private patta land requiring compensation | Section 23 Award |
| `government_land_ha`| Float | Hectares | State revenue or municipal land transfer | Inter-departmental transfer |
| `forest_land_ha` | Float | Hectares | Reserve / protected forest land | Forest (Conservation) Act |
| `parcels_count` | Integer | Count | Distinct cadastral survey numbers / khasras | Bhoomi RoR records |
| `owners_count` | Integer | Count | Total recorded titleholders and legal heirs | Aadhaar / Revenue records |
| `budget_inr_cr` | Float | INR Crores | Total sanctioned land acquisition compensation | Ministry Sanction / PFMS |
| `compensation_disbursed_pct`| Float | Percentage | Electronic DBT payout completed via PFMS | Section 77, RFCTLARR 2013 |
| `active_court_disputes`| Integer | Count | Active civil suits, writs, and title challenges | e-Courts NJDG / High Court |
| `cadastral_digitized_pct`| Float | Percentage | Share of parcels georeferenced via drone/GIS | DILRMP / Bhoomi |
| `aadhaar_seeded_pct`| Float | Percentage | Landowner bank accounts seeded with NPCI | Direct Benefit Transfer |
| `sia_objection_rate_pct`| Float | Percentage | Gram Sabha and public hearing objections | Sections 15 & 16 |
| `rr_packages_pending_pct`| Float | Percentage | Resettlement packages awaiting allocation | Second Schedule, RFCTLARR |
| `forest_clearance_status`| String | Categorical | Stage 1, Stage 2, Approved, Not Applicable | PARIVESH 2.0 (MoEFCC) |
| `environment_clearance_status`| String | Categorical| Approved, In-Review, Terms of Reference, Exempt | EIA Notification 2006 |
| `utility_shifting_pending`| Integer| Count | Pending high-tension lines, gas mains, water lines | PM GatiShakti 3D RoW |
| `collector_meetings_last_quarter`| Integer| Count | Formal review meetings convened by District Collector | Administrative Cadence |
| `primary_bottleneck` | String | Text | Dominant statutory or field impediment | Explainability classification |
| `delay_probability` | Float | Probability (0 to 1) | Calibrated ML probability of delay $\ge 6$ mos | Target Output |
| `risk_tier` | String | High / Medium / Low | Tri-color triage status (Red, Amber, Green) | Escalation Classification |
| `is_delayed` | Integer | Binary (0 or 1) | Ground truth delay status | Supervised Target Label |
| `delay_months_predicted`| Integer | Months | Projected timeline slippage | Predictive Gantt |

---

## 2. Derived Engineered Features (No Leakage)

1. **Dispute Density:** $\text{active\_court\_disputes} / \text{parcels\_count}$ (Measures legal contagion across the corridor).
2. **Fragmentation Ratio:** $\text{owners\_count} / \text{parcels\_count}$ (Measures negotiation complexity per parcel).
3. **Progress Velocity:** $\text{elapsed\_months} / \text{target\_duration\_months}$ (Timeline consumption rate).
4. **Forest Exposure Ratio:** $\text{forest\_land\_ha} / \text{total\_land\_required\_ha}$ (Regulatory clearance friction).
5. **Digitization Gap:** $100 - \text{cadastral\_digitized\_pct}$ (Exposure to paper record title disputes).
