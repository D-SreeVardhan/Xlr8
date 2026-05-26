from dataclasses import dataclass
from datetime import datetime

import strawberry


@strawberry.type
@dataclass
class FacilityType:
    id: str
    name: str
    city: str
    operational_beds: int


@strawberry.type
@dataclass
class ExecutiveFlashType:
    facility_id: str
    captured_at: datetime
    revenue_cr: float
    arpob: float
    occupancy_pct: float
    alos_days: float
    operating_ebitda_margin_pct: float
    ebitda_per_bed_lakh: float
    is_simulated: bool
