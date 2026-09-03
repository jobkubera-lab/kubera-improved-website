# Building Civic Evidence OS: verified local-service lookup without pretending to be the council

Civic Evidence OS is a small, deterministic prototype for turning a resident's plain-language question into a reviewed local-service route and an official source URL.

The design goal is deliberately narrow: help a person find the right official starting point while keeping uncertainty visible and keeping consequential action with the human.

## Why deterministic lookup first

The prototype does not ask a language model to invent a council answer. It matches a normalized question against a controlled catalogue. If the evidence is weak, tied or unsafe, it falls back instead of guessing.

The current Merton catalogue contains 11 reviewed routes covering housing repairs, benefits advice, street cleaning, bulky waste, resident parking permits, Blue Badge guidance, Council Tax payment, noise and nuisance, school admissions, road and pavement problems, and general council contact.

Each controlled route stores an official URL and a review date. That makes the result inspectable: a user can see where the route came from rather than receiving an unsupported answer.

## Three trust rules

### 1. Source before claim

A successful match returns a reviewed official source. Unknown or ambiguous questions are routed to a fallback rather than being converted into confident-sounding advice.

### 2. Privacy before convenience

The evidence log does not store the raw resident question. It records a SHA-256 hash, the deterministic decision, presentation channel and optional profile ID.

Resident profiles are opt-in. They use a strict allow-list for language and non-sensitive situation tags, reject special-category tags, and support explicit erasure.

### 3. Human authority before action

The prototype performs lookup and presentation only. It does not submit forms, determine legal eligibility, make council decisions or impersonate a public authority.

## Python and browser parity

The Python implementation remains the retrieval authority. The dependency-free browser client in `web/` mirrors the same controlled matching rules and is checked with a JavaScript parity smoke test alongside the Python unit suite.

This matters because a demo is only useful if its visible behavior matches the tested engine rather than becoming a second, drifting implementation.

## What the demo proves

The browser demo lets a user type a question and see:

- matched service or conservative fallback;
- official source URL;
- matched evidence terms;
- source review date;
- an explicit statement that the prototype is not a council service or eligibility checker.

Run it locally from the project directory:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/web/`.

## Engineering examples

Three executable examples live in `examples/`:

1. basic deterministic lookup;
2. consent-based ResidentProfile creation and erasure;
3. privacy-conscious evidence logging that proves the raw query is not persisted.

## What this is not

Civic Evidence OS is not a live council system, legal service, benefits decision engine, automated publisher or form-submission bot. It is a transparent civic-tech prototype for verified discovery and reviewable preparation.

The operating rule is simple:

> Evidence before claims. Preparation before action. Human authority remains final.
