from datetime import UTC, datetime, timedelta
from pathlib import Path
from random import Random

from db import Base, SessionLocal, engine
from models import ExecutiveMetric, Facility
from settings import get_settings


def seed() -> None:
    settings = get_settings()
    rng = Random(settings.seed)

    Path("data").mkdir(exist_ok=True)
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    facilities = [
        Facility(
            id="hyd-banjara",
            name="Xlr8 Banjara Hills",
            city="Hyderabad",
            operational_beds=420,
        ),
        Facility(
            id="blr-whitefield",
            name="Xlr8 Whitefield",
            city="Bengaluru",
            operational_beds=360,
        ),
        Facility(id="chn-adyar", name="Xlr8 Adyar", city="Chennai", operational_beds=280),
        Facility(id="mum-powai", name="Xlr8 Powai", city="Mumbai", operational_beds=340),
    ]

    now = datetime.now(UTC)
    metrics: list[ExecutiveMetric] = []
    for facility in facilities:
        city_multiplier = {
            "Hyderabad": 1.0,
            "Bengaluru": 1.12,
            "Chennai": 0.94,
            "Mumbai": 1.18,
        }[facility.city]

        for day in range(90):
            captured_at = now - timedelta(days=89 - day)
            weekday_lift = 1.04 if captured_at.weekday() < 5 else 0.91
            noise = rng.uniform(0.94, 1.08)
            occupancy = min(88.0, max(55.0, 66 * city_multiplier * weekday_lift * noise))
            arpob = 58500 * city_multiplier * rng.uniform(0.97, 1.05)
            revenue_cr = (facility.operational_beds * occupancy / 100 * arpob) / 10_000_000
            margin = 21.5 * city_multiplier * rng.uniform(0.94, 1.06)
            metrics.append(
                ExecutiveMetric(
                    facility_id=facility.id,
                    captured_at=captured_at,
                    revenue_cr=round(revenue_cr, 2),
                    arpob=round(arpob, 0),
                    occupancy_pct=round(occupancy, 1),
                    alos_days=round(rng.uniform(3.2, 4.4), 1),
                    operating_ebitda_margin_pct=round(margin, 1),
                    ebitda_per_bed_lakh=round(
                        (revenue_cr * margin / 100) * 100 / facility.operational_beds,
                        2,
                    ),
                    is_simulated=False,
                )
            )

    with SessionLocal() as session:
        session.add_all(facilities)
        session.add_all(metrics)
        session.commit()


if __name__ == "__main__":
    seed()
