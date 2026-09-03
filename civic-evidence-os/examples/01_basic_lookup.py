"""Minimal Civic Evidence OS lookup example."""

import json

from civic_evidence import find_service


query = "I need to report a pothole in the road"
decision = find_service(query)

print(json.dumps(decision.to_dict(), indent=2, ensure_ascii=False))
