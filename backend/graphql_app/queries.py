from datetime import UTC, datetime

import strawberry
from sqlalchemy import select

from db import SessionLocal
from graphql_app.types.executive import ExecutiveFlashType, FacilityType
from models import ExecutiveMetric, Facility


@strawberry.type
class Query:
    @strawberry.field
    def health(self) -> str:
        return "ok"

    @strawberry.field
    def facilities(self) -> list[FacilityType]:
        with SessionLocal() as session:
            rows = session.scalars(select(Facility).order_by(Facility.city)).all()
            return [
                FacilityType(
                    id=row.id,
                    name=row.name,
                    city=row.city,
                    operational_beds=row.operational_beds,
                )
                for row in rows
            ]

    @strawberry.field
    def executive_flash(self, facility_id: str = "hyd-banjara") -> ExecutiveFlashType:
        with SessionLocal() as session:
            row = session.scalar(
                select(ExecutiveMetric)
                .where(ExecutiveMetric.facility_id == facility_id)
                .order_by(ExecutiveMetric.captured_at.desc())
            )

        if row is None:
            return ExecutiveFlashType(
                facility_id=facility_id,
                captured_at=datetime.now(UTC),
                revenue_cr=0,
                arpob=0,
                occupancy_pct=0,
                alos_days=0,
                operating_ebitda_margin_pct=0,
                ebitda_per_bed_lakh=0,
                is_simulated=False,
            )

        return ExecutiveFlashType(
            facility_id=row.facility_id,
            captured_at=row.captured_at,
            revenue_cr=row.revenue_cr,
            arpob=row.arpob,
            occupancy_pct=row.occupancy_pct,
            alos_days=row.alos_days,
            operating_ebitda_margin_pct=row.operating_ebitda_margin_pct,
            ebitda_per_bed_lakh=row.ebitda_per_bed_lakh,
            is_simulated=row.is_simulated,
        )
