from dataclasses import dataclass


@dataclass(frozen=True)
class SimulationResult:
    action: str
    revenue_delta_pct: float
    er_wait_delta_pct: float
    cost_delta_pct: float
    occupancy_delta_pct: float
    payback_months: int
    staffing_note: str


def run_simulation(message: str) -> SimulationResult:
    prompt = message.lower()

    if "icu" in prompt or "bed" in prompt:
        return SimulationResult(
            action="Added 10 ICU beds at Hyderabad Banjara Hills",
            revenue_delta_pct=8.1,
            er_wait_delta_pct=-18.0,
            cost_delta_pct=5.4,
            occupancy_delta_pct=3.2,
            payback_months=14,
            staffing_note="Requires 18 ICU nurses, 2 intensivists, 1 respiratory therapist.",
        )

    if "nurse" in prompt or "hire" in prompt:
        return SimulationResult(
            action="Hired 18 ICU nurses and reduced agency dependency",
            revenue_delta_pct=2.3,
            er_wait_delta_pct=-7.0,
            cost_delta_pct=3.1,
            occupancy_delta_pct=1.4,
            payback_months=8,
            staffing_note="Cuts agency-nurse spend and reduces night-shift burnout risk.",
        )

    return SimulationResult(
        action="Opened one extra evening OR block",
        revenue_delta_pct=5.6,
        er_wait_delta_pct=-11.0,
        cost_delta_pct=2.9,
        occupancy_delta_pct=2.0,
        payback_months=6,
        staffing_note="Requires 1 anesthetist pool and 2 rotating OT nurses.",
    )
