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
CODEX_HOME = Path(os.environ.get("CODEX_HOME", Path.home() / ".codex")).expanduser()
OPENCODE_HOME = Path(os.environ.get("OPENCODE_CONFIG_DIR", CONFIG_HOME / "opencode")).expanduser()
KIRO_HOME = Path(os.environ.get("KIRO_HOME", Path.home() / ".kiro")).expanduser()
UNIVERSAL_SKILLS_DIR = Path.home() / ".agents" / "skills"
HOSTS: dict[str, tuple[Path, str | None]] = {
    "codex": (CODEX_HOME / "skills", "codex"),
    "claude": (Path.home() / ".claude" / "skills", "claude"),
    "cursor": (Path.home() / ".cursor" / "skills", None),
    "opencode": (OPENCODE_HOME / "skills", "opencode"),
    "factory": (Path.home() / ".factory" / "skills", "droid"),
    "kiro": (KIRO_HOME / "skills", "kiro-cli"),
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


def validate_skill_directory(directory: Path) -> dict[str, object]:
    skill_file = directory / "SKILL.md"
    errors: list[str] = []
    if not skill_file.is_file():
        errors.append("SKILL.md is missing")
    else:
        try:
            lines = skill_file.read_text(encoding="utf-8").splitlines()
        except UnicodeDecodeError:
            errors.append("SKILL.md is not valid UTF-8")
        else:
            if not lines or lines[0] != "---":
                errors.append("SKILL.md must start with YAML frontmatter")
            else:
                try:
                    closing = lines.index("---", 1)
                except ValueError:
                    errors.append("SKILL.md frontmatter is not closed")
                else:
                    fields: dict[str, str] = {}
                    for line in lines[1:closing]:
                        if ":" in line:
                            key, value = line.split(":", 1)
                            fields[key.strip()] = value.strip().strip('"\'')
                    if fields.get("name") != SKILL_NAME:
                        errors.append(f"frontmatter name must be {SKILL_NAME}")
                    if not fields.get("description"):
                        errors.append("frontmatter description is required")
    return {
        "skill_file_present": skill_file.is_file(),
        "frontmatter_valid": not errors,
        "errors": errors,
    }


def installation_state(destination: Path) -> dict[str, object]:
    validation = validate_skill_directory(destination)
    if destination.is_symlink():
        mode = "symlink"
    elif destination.is_dir():
        mode = "copy"
    else:
        mode = "missing"
    return {
        "path": str(destination),
        "present": destination.exists() or destination.is_symlink(),
        "managed": destination_is_managed(destination),
        "mode": mode,
        **validation,
        "loadable": bool(validation["skill_file_present"] and validation["frontmatter_valid"]),
    }


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
    state = installation_state(destination)
    if not state["loadable"]:
        raise RuntimeError(f"Installed skill failed validation at {destination}: {state['errors']}")
    return destination


def selected_hosts(host: str, skills_dir: Path | None) -> Iterable[tuple[str, Path]]:
    if skills_dir:
        yield "custom", skills_dir.expanduser()
    elif host == "universal":
        yield "universal", UNIVERSAL_SKILLS_DIR
    elif host == "all":
        for name, (directory, _) in HOSTS.items():
            yield name, directory
    elif host == "auto":
        detected = [(name, directory) for name, (directory, _) in HOSTS.items() if host_is_present(name)]
        if not detected:
            yield "universal", UNIVERSAL_SKILLS_DIR
        else:
            yield from detected
    else:
        yield host, HOSTS[host][0]


def installation_status() -> dict[str, object]:
    target_roots = {name: directory for name, (directory, _) in HOSTS.items()}
    target_roots["universal"] = UNIVERSAL_SKILLS_DIR
    targets = {
        name: installation_state(directory / SKILL_NAME)
        for name, directory in target_roots.items()
    }
    return {
        "skill_source": str(SOURCE),
        "source_validation": validate_skill_directory(SOURCE),
        "api_key_configured": bool(os.environ.get("OPENAI_API_KEY")),
        "supported_hosts": [*HOSTS, "universal"],
        "installed_hosts": {name: state["loadable"] for name, state in targets.items()},
        "managed_hosts": {name: state["managed"] for name, state in targets.items()},
        "targets": targets,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", choices=["auto", "all", "universal", *HOSTS], default="auto")
    parser.add_argument("--skills-dir", type=Path, help="install into any Agent Skills-compatible parent directory")
    parser.add_argument("--copy", action="store_true", help="copy instead of symlinking (default on Windows)")
    parser.add_argument("--force", action="store_true", help="replace an existing unmanaged destination")
    parser.add_argument("--check", action="store_true", help="report setup state without modifying files")
    parser.add_argument("--json", action="store_true", help="write machine-readable output")
    args = parser.parse_args()
    if args.skills_dir and args.host != "auto":
        parser.error("--skills-dir cannot be combined with --host")
    source_validation = validate_skill_directory(SOURCE)
    if not source_validation["frontmatter_valid"]:
        raise RuntimeError(f"Invalid portable skill source at {SOURCE}: {source_validation['errors']}")

    if not args.check:
        copy_mode = args.copy or os.name == "nt"
        installs: dict[str, str] = {}
        for host, directory in selected_hosts(args.host, args.skills_dir):
            installs[host] = str(install(directory, copy_mode=copy_mode, force=args.force))
        result = installation_status()
        result["installed"] = installs
        result["mode"] = "copy" if copy_mode else "symlink"
        result["next_steps"] = [
            "Restart the target harness or open a new task.",
            "Confirm linkedin-ad-asset-factory appears in the harness skill list.",
            "If it does not appear, rerun with --skills-dir pointing to the directory that harness actually scans.",
        ]
    else:
        result = installation_status()
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
