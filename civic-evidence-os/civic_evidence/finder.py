"""Deterministic, explainable service matching with conservative fallbacks."""

from dataclasses import asdict, dataclass
from typing import Iterable
import re

from .catalogue import SERVICES

UNSAFE_PATTERNS = (
    r"\bpretend (?:you are|to be) (?:the )?council\b",
    r"\bfake (?:a|an|the) (?:council|official)\b",
    r"\bguarantee (?:my )?eligibility\b",
)


@dataclass(frozen=True)
class Decision:
    status: str
    service_id: str | None
    service_name: str | None
    description: str
    official_url: str | None
    reviewed_on: str | None
    matched_terms: tuple[str, ...]
    reason: str

    def to_dict(self) -> dict:
        return asdict(self)


def _normalise(text: str) -> str:
    return " ".join(re.findall(r"[\w'-]+", text.casefold(), flags=re.UNICODE))


def _matches(query: str, terms: Iterable[str]) -> tuple[str, ...]:
    padded = f" {query} "
    return tuple(term for term in terms if f" {_normalise(term)} " in padded)


def find_service(query: str) -> Decision:
    normalised = _normalise(query)
    if not normalised:
        return _fallback("empty_query", "Please describe what help you need.")

    if any(re.search(pattern, normalised) for pattern in UNSAFE_PATTERNS):
        return _fallback("safety_guard", "I cannot impersonate a council or create an official decision.")

    ranked = []
    for service in SERVICES:
        matched = _matches(normalised, service["terms"])
        if matched:
            ranked.append((len(matched), service, matched))

    if not ranked:
        return _fallback("no_evidence", "No controlled service matched. Use the official council contact directory.")

    ranked.sort(key=lambda item: item[0], reverse=True)
    if len(ranked) > 1 and ranked[0][0] == ranked[1][0]:
        return _fallback("ambiguous", "More than one service matched. Please make the question more specific.")

    _, service, matched = ranked[0]
    return Decision(
        status="match",
        service_id=service["id"],
        service_name=service["name"],
        description=service["description"],
        official_url=service["url"],
        reviewed_on=service["reviewed_on"],
        matched_terms=matched,
        reason="controlled_terms_matched",
    )


def predict(query: str, profile=None) -> Decision:
    """Use exactly the same retrieval path as find_service; profile cannot override safeguards."""
    return find_service(query)


def _fallback(reason: str, description: str) -> Decision:
    return Decision(
        status="fallback",
        service_id=None,
        service_name=None,
        description=description,
        official_url="https://www.merton.gov.uk/council-and-local-democracy/contact-us",
        reviewed_on="2026-08-27",
        matched_terms=(),
        reason=reason,
    )
