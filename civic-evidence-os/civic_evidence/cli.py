"""Command-line demonstration."""

import argparse
import json

from .assisted import render_assisted
from .evidence import append_record
from .finder import predict


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("query", nargs="+")
    parser.add_argument("--channel", choices=["self_service", "assisted"], default="self_service")
    args = parser.parse_args()

    query = " ".join(args.query)
    decision = predict(query)
    record_id = append_record(decision, query, channel=args.channel)

    if args.channel == "assisted":
        print(render_assisted(decision))
        print(f"evidence record: {record_id}")
    else:
        output = decision.to_dict()
        output["evidence_record_id"] = record_id
        print(json.dumps(output, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
