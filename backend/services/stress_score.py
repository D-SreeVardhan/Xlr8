def calculate_stress_score(
    icu_occupancy: float,
    er_wait_minutes: int,
    nurse_shortfall: int,
    tpa_breaches: int,
) -> int:
    score = 0
    score += min(35, max(0, int((icu_occupancy - 65) * 1.4)))
    score += min(25, max(0, int((er_wait_minutes - 20) * 0.6)))
    score += min(25, nurse_shortfall * 5)
    score += min(15, tpa_breaches * 4)
    return max(0, min(100, score))
