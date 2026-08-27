"""Command-line demonstration."""

import json
import sys

from .evidence import append_record
from .finder import find_service


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: python -m civic_evidence.cli \"your question\"")
        return 2
    query = " ".join(sys.argv[1:])
    decision = find_service(query)
    record_id = append_record(decision, query)
    output = decision.to_dict()
    output["evidence_record_id"] = record_id
    print(json.dumps(output, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
