#!/usr/bin/env python3
"""Install or verify the local Codex plugin without reading secret values."""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
from typing import Any


PLUGIN_NAME = "linkedin-ad-asset-factory"
MARKETPLACE_NAME = "linkedin-ad-asset-factory"
REPO_ROOT = Path(__file__).resolve().parents[3]


def run_codex(*args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["codex", *args],
        check=False,
        capture_output=True,
        text=True,
    )


def parse_json(result: subprocess.CompletedProcess[str], action: str) -> dict[str, Any]:
    if result.returncode != 0:
        detail = result.stderr.strip() or result.stdout.strip() or "unknown Codex CLI error"
        raise RuntimeError(f"{action} failed: {detail}")
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError as error:
        raise RuntimeError(f"{action} returned invalid JSON: {error}") from error


def normalized(path: str) -> str:
    return str(Path(path).resolve()).casefold()


def marketplace_state() -> tuple[bool, str | None]:
    payload = parse_json(run_codex("plugin", "marketplace", "list", "--json"), "marketplace list")
    for marketplace in payload.get("marketplaces", []):
        if marketplace.get("name") == MARKETPLACE_NAME:
            return True, marketplace.get("root")
    return False, None


def plugin_state() -> tuple[bool, bool]:
    payload = parse_json(
        run_codex("plugin", "list", "--marketplace", MARKETPLACE_NAME, "--available", "--json"),
        "plugin list",
    )
    for entry in [*payload.get("installed", []), *payload.get("available", [])]:
        if entry.get("name") == PLUGIN_NAME:
            return bool(entry.get("installed")), bool(entry.get("enabled"))
    return False, False


def install_plugin() -> tuple[bool, bool]:
    exists, root = marketplace_state()
    if exists:
        if root and normalized(root) != normalized(str(REPO_ROOT)):
            raise RuntimeError(
                f"marketplace '{MARKETPLACE_NAME}' already points to a different location: {root}. "
                "Remove or rename that marketplace before using this repository."
            )
    else:
        parse_json(
            run_codex("plugin", "marketplace", "add", str(REPO_ROOT), "--json"),
            "marketplace add",
        )

    installed, enabled = plugin_state()
    if not installed or not enabled:
        parse_json(
            run_codex("plugin", "add", f"{PLUGIN_NAME}@{MARKETPLACE_NAME}", "--json"),
            "plugin add",
        )
        installed, enabled = plugin_state()
    return installed, enabled


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--install-plugin", action="store_true", help="register this repository and install its plugin")
    parser.add_argument("--check-only", action="store_true", help="report setup state without modifying Codex")
    parser.add_argument("--factory-root", type=Path, help="optional existing factory directory to check")
    parser.add_argument("--json", action="store_true", help="write a machine-readable status object")
    args = parser.parse_args()

    if args.install_plugin and args.check_only:
        parser.error("--install-plugin and --check-only cannot be used together")

    codex_available = shutil.which("codex") is not None
    result: dict[str, Any] = {
        "repo_root": str(REPO_ROOT),
        "codex_cli_available": codex_available,
        "api_key_configured": bool(os.environ.get("OPENAI_API_KEY")),
        "factory_root": str(args.factory_root) if args.factory_root else None,
        "factory_root_exists": args.factory_root.exists() if args.factory_root else None,
        "plugin_installed": False,
        "plugin_enabled": False,
        "next_steps": [],
    }

    if not codex_available:
        result["next_steps"].append("Install Codex CLI or run this inside the Codex desktop harness.")
    else:
        try:
            if args.install_plugin:
                installed, enabled = install_plugin()
            else:
                marketplace_exists, _ = marketplace_state()
                installed, enabled = plugin_state() if marketplace_exists else (False, False)
            result["plugin_installed"] = installed
            result["plugin_enabled"] = enabled
        except RuntimeError as error:
            result["plugin_error"] = str(error)

    if not result["plugin_installed"]:
        result["next_steps"].append("Run this script with --install-plugin from a local clone, then start a new Codex task.")
    if not result["api_key_configured"]:
        result["next_steps"].append("Set OPENAI_API_KEY yourself before real image generation; dry-run is still available.")
    if args.factory_root and not args.factory_root.exists():
        result["next_steps"].append("Provide an existing FACTORY_ROOT or ask the skill to scaffold one.")

    if args.json:
        print(json.dumps(result, indent=2))
    else:
        for key, value in result.items():
            print(f"{key}: {value}")
    return 0 if codex_available else 2


if __name__ == "__main__":
    sys.exit(main())
