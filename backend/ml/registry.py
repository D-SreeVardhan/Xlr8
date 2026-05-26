from services.stress_score import calculate_stress_score


def denial_risk_score(tpa: str, specialty: str, documentation_complete: bool) -> int:
    base = {
        "Star Health": 74,
        "CGHS": 68,
        "HDFC Ergo": 54,
        "Bajaj Allianz": 42,
    }.get(tpa, 48)
    specialty_lift = 12 if specialty.lower() in {"ortho", "orthopaedics", "implants"} else 0
    documentation_penalty = 18 if not documentation_complete else 0
    return min(96, base + specialty_lift + documentation_penalty)


def nurse_attrition_risk(overtime_hours: int, night_shifts: int, leave_balance_days: int) -> int:
    score = overtime_hours * 2 + night_shifts * 5 - leave_balance_days
    return max(4, min(92, score))


def model_snapshot() -> dict[str, int]:
    return {
        "denialRisk": denial_risk_score("Star Health", "Orthopaedics", False),
        "attritionRisk": nurse_attrition_risk(22, 6, 4),
        "surgeForecastPct": 34,
        "stressScore": calculate_stress_score(91, 48, 5, 3),
    }
