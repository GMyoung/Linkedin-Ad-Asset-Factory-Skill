#!/usr/bin/env python3
"""Report portable skill setup status without reading or printing secrets."""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path


SKILL_ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--factory-root", type=Path)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    result = {
        "skill_root": str(SKILL_ROOT),
        "skill_file_present": (SKILL_ROOT / "SKILL.md").is_file(),
        "api_key_configured": bool(os.environ.get("OPENAI_API_KEY")),
        "factory_root": str(args.factory_root) if args.factory_root else None,
        "factory_root_exists": args.factory_root.exists() if args.factory_root else None,
        "next_steps": [],
    }
    if not result["api_key_configured"]:
        result["next_steps"].append("Set OPENAI_API_KEY yourself before real image generation; dry-run is still available.")
    if args.factory_root and not result["factory_root_exists"]:
        result["next_steps"].append("Provide an existing FACTORY_ROOT or ask the skill to scaffold one.")

    if args.json:
        print(json.dumps(result, indent=2))
    else:
        for key, value in result.items():
            print(f"{key}: {value}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
