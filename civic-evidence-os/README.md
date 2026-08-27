# KUBERA Civic Evidence OS

A small, explainable civic-service navigator for residents, newcomers and staff-assisted lookup.

## What it does

1. Accepts a plain-language question.
2. Matches only against a controlled service catalogue.
3. Returns an official source URL and the evidence terms used.
4. Falls back when evidence is weak, ambiguous or unsafe.
5. Writes a privacy-conscious JSONL evidence record without storing the original query.

This prototype connects the direction of the [Mitcham Survival Map](../mitcham-survival-map/) with the Council AI Service Finder research. It is **not** a council service, legal adviser, eligibility checker or form-submission system.

## Run

```bash
cd civic-evidence-os
python -m civic_evidence.cli "I need help because my toilet is leaking"
python -m unittest discover -s tests -v
```

No external Python dependencies are required.

## Trust rules

- controlled service IDs only;
- official URLs only;
- no invented council actions;
- ambiguity produces a fallback;
- source and catalogue review date are shown;
- raw resident queries are not written to the evidence log;
- human confirmation remains mandatory before external action.

## Current scope

The included catalogue is deliberately small and demonstrates housing repair, benefits advice, waste services and general council contact. Production use requires council-approved data, accessibility testing, multilingual validation and an information-maintenance owner.
