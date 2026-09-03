# Civic Evidence OS examples

Run from `civic-evidence-os/` so the local package is importable:

```bash
PYTHONPATH=. python examples/01_basic_lookup.py
PYTHONPATH=. python examples/02_with_profile.py
PYTHONPATH=. python examples/03_evidence_trail.py
```

## What each example proves

- `01_basic_lookup.py` — deterministic lookup returns a controlled service route and official source URL.
- `02_with_profile.py` — a profile requires explicit consent, uses an allow-list, and can be erased; it does not bypass lookup safeguards.
- `03_evidence_trail.py` — the evidence record contains a SHA-256 query hash and decision metadata without storing the raw resident question.

These examples do not submit forms, determine eligibility, impersonate a council, or perform external actions.
