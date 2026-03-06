"""Seniority detection and AI impact analysis service."""

from app.data.dev_profiles_data import DEVELOPERS, BENEFIT_HARM, PRODUCTIVITY_TIMELINES


def detect_seniority_level(commits: int, pr_complexity: str, years_exp: int) -> str:
    """Auto-detect seniority from commit history, PR complexity, and experience."""
    score = 0
    if commits > 800:
        score += 4
    elif commits > 500:
        score += 3
    elif commits > 200:
        score += 2
    else:
        score += 1

    complexity_scores = {"Very High": 4, "High": 3, "Medium": 2, "Low": 1}
    score += complexity_scores.get(pr_complexity, 1)

    if years_exp >= 12:
        score += 4
    elif years_exp >= 7:
        score += 3
    elif years_exp >= 3:
        score += 2
    else:
        score += 1

    if score >= 10:
        return "EXPERT"
    elif score >= 7:
        return "SENIOR"
    elif score >= 5:
        return "MID"
    return "JUNIOR"


def compute_ai_impact(dev_name: str) -> dict:
    """Compute net AI benefit or harm for a specific developer."""
    bh = next((b for b in BENEFIT_HARM if b.dev == dev_name), None)
    if not bh:
        return {"net_impact": 0, "recommendation": "No data available"}

    if bh.net_impact < -20:
        rec = "Critical: Switch to Architect mode and disable inline completions"
    elif bh.net_impact < 0:
        rec = "Warning: Increase AI confidence threshold to reduce noise"
    elif bh.net_impact < 30:
        rec = "Standard mode is working well for this developer"
    else:
        rec = "AI is highly beneficial — maintain current Scaffold mode"

    return {"net_impact": bh.net_impact, "recommendation": rec}


def get_optimal_mode(dev_name: str) -> str:
    """Determine the optimal AI suggestion mode for a developer."""
    dev = next((d for d in DEVELOPERS if d.name == dev_name), None)
    if not dev:
        return "Standard"

    if dev.level >= 4:
        return "Architect"
    elif dev.level >= 2:
        return "Standard"
    return "Scaffold"
