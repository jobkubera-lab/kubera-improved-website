"""Assisted-channel presentation over the same deterministic retrieval decision."""

def render_assisted(decision) -> str:
    score = len(decision.matched_terms)
    terms = ", ".join(decision.matched_terms) if decision.matched_terms else "none"
    return "\n".join([
        f"service: {decision.service_name or 'No controlled service match'}",
        f"description: {decision.description}",
        f"official URL: {decision.official_url or 'none'}",
        f"reason: {decision.reason}",
        f"matched terms: {terms}",
        f"engineering score: {score} (number of matched terms; not certainty)",
        "lookup does not submit a form",
        "language is not translated beyond the controlled catalogue",
    ])
