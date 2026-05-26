# Data Model

Synthetic data represents a large Indian hospital chain, not a real company.

## Entities

| Entity | Purpose |
|---|---|
| `hospital` | Chain-level identity |
| `facility` | City/site-level unit |
| `department` | ICU, ER, Cardiac, Oncology, Neuro, Ortho, Diagnostics, etc. |
| `bed` | Bed inventory and live status |
| `or_room` | Operating rooms and scheduled blocks |
| `ambulance` | Fleet status and live location |
| `doctor` | Clinical provider details and scorecard inputs |
| `nurse` | Nurse roster, risk, availability |
| `staff_shift` | Current and historical shift assignments |
| `patient` | Synthetic patient profile |
| `admission` | IP/ER admission lifecycle |
| `or_case` | Surgery case data |
| `payer` | Cash, corporate, insurers, TPA, CGHS, ECHS, Ayushman, international |
| `tpa_claim` | Pre-auth, approval, denial, SLA clock |
| `diagnostic_machine` | MRI, CT, Cath Lab, Linac, USG availability |
| `inventory_item` | Medicines, implants, PPE, consumables |
| `blood_unit` | Blood group stock and expiry |
| `license` | NABH, Fire NOC, Pharmacy, Biomedical Waste, AERB, etc. |
| `patient_feedback` | Food, beds, nursing, doctors, hygiene, billing ratings |
| `alert` | Real-time risk event |
| `simulation_snapshot` | What-if overlay and rollback state |

## Synthetic Rules

- 4 facilities: Hyderabad, Bengaluru, Chennai, Mumbai.
- 90 days of history.
- Department-specific revenue and ARPOB.
- Festival and AQI events create realistic surges.
- TPA denial patterns vary by payer and specialty.
- Nurses and doctors have realistic shift limits and performance variance.
- Licenses include both expiry date and revenue blast-radius impact.

## Seed Determinism

The seed script supports `XL8_SEED=20260526` so demo data is reproducible.
