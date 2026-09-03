"""Evidence-log example showing privacy-conscious query handling."""

import json
from pathlib import Path
from tempfile import TemporaryDirectory

from civic_evidence import find_service
from civic_evidence.evidence import append_record


query = "I need help paying my council tax"
decision = find_service(query)

with TemporaryDirectory() as tmp:
    evidence_path = Path(tmp) / "evidence.jsonl"
    record_id = append_record(decision, query, evidence_path)
    record = json.loads(evidence_path.read_text(encoding="utf-8"))

    # The raw resident query is not written to the evidence record.
    assert query not in evidence_path.read_text(encoding="utf-8")

    print(f"record_id={record_id}")
    print(json.dumps(record, indent=2, ensure_ascii=False))
