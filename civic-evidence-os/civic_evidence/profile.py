"""Consent-based resident profile support with conservative data minimisation."""
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Protocol
from uuid import uuid4

ALLOWED_TAGS = {"private-tenant", "council-tenant", "homeowner", "universal-credit", "benefits-advice", "street-issue", "housing-repair"}
REJECTED_SPECIAL_CATEGORY_TAGS = {"health", "disability", "immigration", "citizenship", "asylum", "religion", "sexual-orientation", "ethnicity", "mental-health"}
ALLOWED_LANGUAGES = {"en", "en-GB", "ru", "uk", "pl"}

@dataclass(frozen=True)
class ResidentProfile:
    profile_id: str
    council_id: str
    preferred_language: str
    situation_tags: tuple[str, ...]
    created_at: str
    updated_at: str
    schema_version: str = "1.0"

class ProfileStore(Protocol):
    def save(self, profile: ResidentProfile) -> None: ...
    def get(self, profile_id: str) -> ResidentProfile | None: ...
    def erase(self, profile_id: str) -> bool: ...

class MemoryProfileStore:
    def __init__(self): self._profiles = {}
    def save(self, profile): self._profiles[profile.profile_id] = profile
    def get(self, profile_id): return self._profiles.get(profile_id)
    def erase(self, profile_id): return self._profiles.pop(profile_id, None) is not None

def _validate(preferred_language: str, situation_tags):
    if preferred_language not in ALLOWED_LANGUAGES:
        raise ValueError("unsupported language")
    tags = tuple(situation_tags)
    special = set(tags) & REJECTED_SPECIAL_CATEGORY_TAGS
    if special:
        raise ValueError(f"special-category tags are not allowed: {', '.join(sorted(special))}")
    invalid = set(tags) - ALLOWED_TAGS
    if invalid:
        raise ValueError(f"unsupported situation tags: {', '.join(sorted(invalid))}")
    return tags

def create_profile(council_id: str, preferred_language: str = "en-GB", situation_tags=(), *, consent: bool = False, store: ProfileStore | None = None) -> ResidentProfile:
    if not consent:
        raise ValueError("explicit consent is required to create a resident profile")
    tags = _validate(preferred_language, situation_tags)
    now = datetime.now(timezone.utc).isoformat()
    profile = ResidentProfile(str(uuid4()), council_id, preferred_language, tags, now, now)
    if store is not None:
        store.save(profile)
    return profile

def erase_profile(profile_id: str, store: ProfileStore) -> bool:
    return store.erase(profile_id)
