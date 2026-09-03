"""Consent-based ResidentProfile example.

The profile can influence presentation context in future versions, but it does
not bypass the deterministic lookup or safety fallbacks.
"""

import json

from civic_evidence import MemoryProfileStore, create_profile, erase_profile, predict


store = MemoryProfileStore()
profile = create_profile(
    council_id="merton",
    preferred_language="en-GB",
    situation_tags=("private-tenant", "housing-repair"),
    consent=True,
    store=store,
)

decision = predict("My rented home has a leaking toilet that needs repair", profile=profile)
print(json.dumps(decision.to_dict(), indent=2, ensure_ascii=False))

# Explicit erasure is supported by the profile store.
erased = erase_profile(profile.profile_id, store)
print(f"profile_erased={erased}")
