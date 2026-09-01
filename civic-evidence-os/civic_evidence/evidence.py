"""Minimal evidence ledger that avoids retaining raw resident questions or profile tags."""

from datetime import datetime, timezone
from hashlib import sha256
import json
from pathlib import Path
from uuid import uuid4

from .finder import Decision


def append_record(
    decision: Decision,
    query: str,
    path: str | Path = "evidence.jsonl",
    *,
    channel: str = "self_service",
    profile_id: str | None = None,
) -> str:
    if channel not in {"self_service", "assisted"}:
        raise ValueError("invalid channel")

    record_id = str(uuid4())
    record = {
        "record_id": record_id,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "query_sha256": sha256(query.encode("utf-8")).hexdigest(),
        "decision": decision.to_dict(),
        "channel": channel,
    }
    if profile_id is not None:
        record["profile_id"] = profile_id

    with Path(path).open("a", encoding="utf-8") as stream:
        stream.write(json.dumps(record, ensure_ascii=False) + "\n")
    return record_id
