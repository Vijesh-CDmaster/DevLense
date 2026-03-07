"""Verification Tax Eliminator engine — generates targeted verification checklists."""

from app.data.trust_engine_data import VTE_PROTOCOLS, PER_SUGGESTION_SCORES


def get_vte_checklist(suggestion_id: str) -> list[dict]:
    """Build a flat checklist for a given suggestion's VTE protocol."""
    protocol = next((p for p in VTE_PROTOCOLS if p.suggestion_id == suggestion_id), None)
    if protocol is None:
        return []

    items: list[dict] = []

    for sf in protocol.security_fast_paths:
        items.append({
            "section": "security",
            "priority": "CRITICAL",
            "label": f"{sf.owasp_id} — {sf.risk_label} (lines {sf.lines})",
            "estimated_sec": 10,
        })

    for sc in protocol.symbol_checks:
        if sc.status != "verified":
            items.append({
                "section": "symbol",
                "priority": "HIGH",
                "label": f"Verify {sc.symbol} — {sc.location}",
                "estimated_sec": 5,
            })

    for bt in protocol.boundary_tests:
        items.append({
            "section": "logic",
            "priority": "MEDIUM",
            "label": f"Test: {bt.input_desc} ({bt.target_line})",
            "estimated_sec": 6,
        })

    for ap in protocol.arch_probes:
        items.append({
            "section": "arch",
            "priority": "MEDIUM",
            "label": ap.check,
            "estimated_sec": 7,
        })

    return items


def compute_verification_tax_summary() -> dict:
    """Compute org-level verification tax savings."""
    total_protocols = len(VTE_PROTOCOLS)
    avg_vte_sec = sum(p.estimated_seconds for p in VTE_PROTOCOLS) / max(total_protocols, 1)
    avg_unstructured_min = 31
    savings_per_protocol_min = avg_unstructured_min - (avg_vte_sec / 60)

    return {
        "total_protocols_available": total_protocols,
        "avg_vte_seconds": round(avg_vte_sec),
        "avg_unstructured_minutes": avg_unstructured_min,
        "savings_per_verification_minutes": round(savings_per_protocol_min, 1),
        "total_suggestions_scored": len(PER_SUGGESTION_SCORES),
        "avg_trust_score": round(sum(s.trust_score for s in PER_SUGGESTION_SCORES) / max(len(PER_SUGGESTION_SCORES), 1)),
        "pct_requiring_verification": round(
            len([s for s in PER_SUGGESTION_SCORES if s.trust_score < 50]) / max(len(PER_SUGGESTION_SCORES), 1) * 100
        ),
    }
