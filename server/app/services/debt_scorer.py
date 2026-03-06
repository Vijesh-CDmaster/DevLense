"""Pre-commit Debt Scoring Service — analyses staged files for AI churn risk.

In production this would hook into git pre-commit and run ML-based analysis.
Currently returns mock data from the data layer.
"""

import logging
from app.models.debt_radar import StagedFile, SurvivalPrediction
from app.data.debt_radar_data import get_staged_files, get_survival_predictions

log = logging.getLogger(__name__)


async def score_staged_files() -> list[StagedFile]:
    """Score all staged files for AI-induced debt risk."""
    files = get_staged_files()
    log.info("Pre-commit scorer: evaluated %d staged files — %d blocked",
             len(files), sum(1 for f in files if f.verdict == "block"))
    return files


async def predict_survival() -> list[SurvivalPrediction]:
    """Run 14-day survival prediction on AI-generated code blocks."""
    predictions = get_survival_predictions()
    high_risk = sum(1 for p in predictions if p.survival_prob < 50)
    log.info("Survival predictor: %d blocks analysed — %d high-risk",
             len(predictions), high_risk)
    return predictions


async def compute_debt_score(ai_pct: int, churn_history: float, pattern_issues: int) -> int:
    """Compute a debt score for a single file.
    Formula: (ai_pct * 0.4) + (churn_history * 0.35) + (pattern_issues * 15 * 0.25)
    """
    score = int(ai_pct * 0.4 + churn_history * 100 * 0.35 + pattern_issues * 15 * 0.25)
    return min(score, 300)
