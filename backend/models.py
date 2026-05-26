from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from db import Base


class Facility(Base):
    __tablename__ = "facilities"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    city: Mapped[str] = mapped_column(String, nullable=False)
    operational_beds: Mapped[int] = mapped_column(Integer, nullable=False)


class ExecutiveMetric(Base):
    __tablename__ = "executive_metrics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    facility_id: Mapped[str] = mapped_column(String, nullable=False)
    captured_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, index=True)
    revenue_cr: Mapped[float] = mapped_column(Float, nullable=False)
    arpob: Mapped[float] = mapped_column(Float, nullable=False)
    occupancy_pct: Mapped[float] = mapped_column(Float, nullable=False)
    alos_days: Mapped[float] = mapped_column(Float, nullable=False)
    operating_ebitda_margin_pct: Mapped[float] = mapped_column(Float, nullable=False)
    ebitda_per_bed_lakh: Mapped[float] = mapped_column(Float, nullable=False)
    is_simulated: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
