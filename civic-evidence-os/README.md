# KUBERA Civic Evidence OS

A small, explainable civic-service navigator for residents, newcomers and staff-assisted lookup.

## What it does

1. Accepts a plain-language question.
2. Matches only against the existing controlled Merton service catalogue.
3. Returns an official source URL and the evidence terms used.
4. Falls back when evidence is weak, ambiguous or unsafe.
5. Writes a privacy-conscious JSONL evidence record without storing the original query.
6. Supports an optional consent-based ResidentProfile with a strict allow-list and an erase operation.
7. Supports self-service and assisted presentation channels over the same deterministic retrieval decision.

This prototype is **not** a council service, legal adviser, eligibility checker or form-submission system.

## ResidentProfile

Profiles are anonymous by default: no profile is created unless explicit consent is supplied. Supported languages are `en`, `en-GB`, `ru`, `uk`, `pl`.

Allowed situation tags:

`private-tenant`, `council-tenant`, `homeowner`, `universal-credit`, `benefits-advice`, `street-issue`, `housing-repair`.

Special-category tags such as health, disability, immigration, citizenship, asylum, religion, sexual orientation, ethnicity and mental health are rejected.

`predict(query, profile=None)` uses the same retrieval logic as `find_service`; profile data cannot bypass safety, ambiguity or no-evidence fallbacks.

## Assisted channel

```bash
cd civic-evidence-os
PYTHONPATH=. python -m civic_evidence.cli --channel assisted "My toilet is leaking and needs repair"
```

Assisted output is plain text and shows service, description, official URL, reason, matched terms and an engineering score equal only to the number of matched terms. The score is **not certainty**.

Lookup does not submit a form. Language is not translated beyond the controlled catalogue.

## Evidence log

The evidence log stores the presentation channel (`self_service` or `assisted`) and a SHA-256 hash of the query. It does not store the raw resident question or profile situation tags. An optional `profile_id` may be recorded; PII must not be added.

## Test

```bash
cd civic-evidence-os
PYTHONPATH=. python -m unittest discover -s tests -v
```

No external Python dependencies are required.

## Trust rules

- existing deterministic `find_service` matching remains the retrieval authority;
- controlled service IDs only;
- official URLs only;
- no invented council actions;
- ambiguity produces a fallback;
- source and catalogue review date are shown;
- raw resident queries are not written to the evidence log;
- profiles require explicit consent and support erasure;
- human confirmation remains mandatory before external action.

## Current scope

The included catalogue is deliberately small and demonstrates housing repair, benefits advice, waste services and general council contact. It is a prototype and makes no claim of council approval or eligibility determination.
