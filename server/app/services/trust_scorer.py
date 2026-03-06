"""Trust scoring engine — computes per-suggestion trust scores."""

from app.data.trust_engine_data import SUGGESTIONS, TASK_TYPES


def compute_trust_score(
    task_type: str,
    complexity: str,
    files_affected: int,
    context_match: float,
) -> dict:
    """Compute a trust score for a suggestion based on task type, complexity, files, and context."""
    # Base score = historical accuracy for the task type
    task_accuracy = next((t.accuracy for t in TASK_TYPES if t.type.lower() == task_type.lower()), 50)

    # Complexity penalty
    complexity_penalties = {"Low": 0, "Medium": 8, "High": 18, "Very High": 30}
    penalty = complexity_penalties.get(complexity, 10)

    # Multi-file penalty
    file_penalty = max(0, (files_affected - 1) * 5)

    # Context match bonus
    context_bonus = max(0, (context_match - 50) * 0.3)

    score = max(0, min(100, task_accuracy - penalty - file_penalty + context_bonus))

    if score >= 70:
        level, rec = "green", "Safe to accept"
    elif score >= 45:
        level, rec = "amber", "Verify carefully"
    else:
        level, rec = "red", "Human review required"

    return {
        "trust": round(score),
        "level": level,
        "rec": rec,
        "breakdown": {
            "base_accuracy": task_accuracy,
            "complexity_penalty": penalty,
            "file_penalty": file_penalty,
            "context_bonus": round(context_bonus, 1),
        },
    }


def should_verify(trust_score: float, task_type: str) -> bool:
    """Determine if a suggestion should be flagged for verification."""
    high_risk_types = {"Architecture", "Security", "Database migration", "Database operations"}
    if task_type in high_risk_types:
        return trust_score < 70
    return trust_score < 45
