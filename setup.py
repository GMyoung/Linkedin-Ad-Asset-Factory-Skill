#!/usr/bin/env python3
"""Install the portable skill into one or more Agent Skills-compatible harnesses."""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import shutil
import sys
from typing import Iterable


SKILL_NAME = "linkedin-ad-asset-factory"
ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / SKILL_NAME
MARKER = ".linkedin-ad-asset-factory-install.json"
CONFIG_HOME = Path(os.environ.get("XDG_CONFIG_HOME", Path.home() / ".config"))
HOSTS: dict[str, tuple[Path, str | None]] = {
    "codex": (Path.home() / ".codex" / "skills", "codex"),
    "claude": (Path.home() / ".claude" / "skills", "claude"),
    "cursor": (Path.home() / ".cursor" / "skills", None),
    "opencode": (CONFIG_HOME / "opencode" / "skills", "opencode"),
    "factory": (Path.home() / ".factory" / "skills", "droid"),
    "kiro": (Path.home() / ".kiro" / "skills", "kiro-cli"),
}


def host_is_present(host: str) -> bool:
    directory, command = HOSTS[host]
    return (command is not None and shutil.which(command) is not None) or directory.parent.exists()


def destination_is_managed(destination: Path) -> bool:
    if destination.is_symlink():
        return destination.resolve() == SOURCE.resolve()
    marker = destination / MARKER
    if not marker.is_file():
        return False
    try:
        data = json.loads(marker.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return False
    return data.get("source") == str(SOURCE.resolve())


def remove_destination(destination: Path) -> None:
    if destination.is_symlink() or destination.is_file():
        destination.unlink()
    else:
        shutil.rmtree(destination)


def install(destination_root: Path, *, copy_mode: bool, force: bool) -> Path:
    destination = destination_root / SKILL_NAME
    if destination.exists() or destination.is_symlink():
        if not destination_is_managed(destination) and not force:
            raise RuntimeError(
                f"Refusing to overwrite unmanaged skill at {destination}. Use --force only after reviewing it."
            )
        remove_destination(destination)
    destination_root.mkdir(parents=True, exist_ok=True)
    if copy_mode:
        shutil.copytree(
            SOURCE,
            destination,
            ignore=shutil.ignore_patterns(
                "__pycache__",
                "*.pyc",
                ".git",
                "node_modules",
                "dist",
                ".next",
                ".wrangler",
                ".env",
            ),
        )
        (destination / MARKER).write_text(
            json.dumps({"source": str(SOURCE.resolve()), "installer": "setup.py"}, indent=2) + "\n",
            encoding="utf-8",
        )
    else:
        destination.symlink_to(SOURCE, target_is_directory=True)
    return destination


def selected_hosts(host: str, skills_dir: Path | None) -> Iterable[tuple[str, Path]]:
    if skills_dir:
        yield "custom", skills_dir.expanduser()
    elif host == "all":
        for name, (directory, _) in HOSTS.items():
            yield name, directory
    elif host == "auto":
        detected = [(name, directory) for name, (directory, _) in HOSTS.items() if host_is_present(name)]
        if not detected:
            raise RuntimeError("No supported harness was detected. Use --host <name> or --skills-dir <directory>.")
        yield from detected
    else:
        yield host, HOSTS[host][0]


def installation_status() -> dict[str, object]:
    installed: dict[str, bool] = {}
    for host, (directory, _) in HOSTS.items():
        destination = directory / SKILL_NAME
        installed[host] = destination_is_managed(destination)
    return {
        "skill_source": str(SOURCE),
        "skill_file_present": (SOURCE / "SKILL.md").is_file(),
        "api_key_configured": bool(os.environ.get("OPENAI_API_KEY")),
        "supported_hosts": list(HOSTS),
        "installed_hosts": installed,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", choices=["auto", "all", *HOSTS], default="auto")
    parser.add_argument("--skills-dir", type=Path, help="install into any Agent Skills-compatible parent directory")
    parser.add_argument("--copy", action="store_true", help="copy instead of symlinking (default on Windows)")
    parser.add_argument("--force", action="store_true", help="replace an existing unmanaged destination")
    parser.add_argument("--check", action="store_true", help="report setup state without modifying files")
    parser.add_argument("--json", action="store_true", help="write machine-readable output")
    args = parser.parse_args()
    if args.skills_dir and args.host != "auto":
        parser.error("--skills-dir cannot be combined with --host")
    if not (SOURCE / "SKILL.md").is_file():
        raise RuntimeError(f"Missing portable skill source: {SOURCE / 'SKILL.md'}")

    result = installation_status()
    if not args.check:
        copy_mode = args.copy or os.name == "nt"
        installs: dict[str, str] = {}
        for host, directory in selected_hosts(args.host, args.skills_dir):
            installs[host] = str(install(directory, copy_mode=copy_mode, force=args.force))
        result["installed"] = installs
        result["mode"] = "copy" if copy_mode else "symlink"
    if args.json:
        print(json.dumps(result, indent=2))
    else:
        for key, value in result.items():
            print(f"{key}: {value}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except RuntimeError as error:
        print(f"setup failed: {error}", file=sys.stderr)
        raise SystemExit(2)
