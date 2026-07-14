#!/usr/bin/env python3
"""Publish one five-asset factory run into the bundled Harbor Network site."""

from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path


SKILL_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SITE_ROOT = SKILL_ROOT / "integrations" / "harbor-network"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Copy five generated ads and their dry-run copy plan into Harbor Network."
    )
    parser.add_argument("--run-root", required=True, type=Path)
    parser.add_argument("--site-root", type=Path, default=DEFAULT_SITE_ROOT)
    parser.add_argument("--count", type=int, default=5)
    return parser.parse_args()


def load_json(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def resolve_actual_root(run_root: Path) -> Path:
    candidates = [run_root, run_root / "factory_actual"]
    for candidate in candidates:
        if (candidate / "run_manifest.json").is_file() and (candidate / "images").is_dir():
            manifest = load_json(candidate / "run_manifest.json")
            if not manifest.get("dry_run", False):
                return candidate.resolve()
    raise FileNotFoundError(
        "Could not find a real factory run containing run_manifest.json and images/."
    )


def copy_plan_root(actual_root: Path, requested_root: Path) -> Path:
    candidates = [
        requested_root / "factory_dry_run",
        actual_root,
        actual_root.parent / "factory_dry_run",
    ]
    for candidate in candidates:
        if (candidate / "on_image_text_plan.json").is_file():
            return candidate
    raise FileNotFoundError("Could not find on_image_text_plan.json for the run.")


def image_for_asset(images_dir: Path, asset_id: str) -> Path:
    matches = sorted(
        path
        for path in images_dir.glob(f"{asset_id}*")
        if path.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}
    )
    if not matches:
        raise FileNotFoundError(f"No generated image found for {asset_id}.")
    return matches[0]


def main() -> int:
    args = parse_args()
    if args.count != 5:
        raise ValueError("Harbor Network launch publishing requires exactly five assets.")

    requested_root = args.run_root.expanduser().resolve()
    site_root = args.site_root.expanduser().resolve()
    actual_root = resolve_actual_root(requested_root)
    plan_root = copy_plan_root(actual_root, requested_root)

    public_root = (site_root / "public" / "generated-ads").resolve()
    app_data_path = (site_root / "app" / "generated-ads.json").resolve()
    if site_root not in public_root.parents or site_root not in app_data_path.parents:
        raise ValueError("Resolved Harbor output paths escaped the selected site root.")
    if not (site_root / ".openai" / "hosting.json").is_file():
        raise FileNotFoundError("The selected site root is not a Harbor Network Sites project.")

    plan = load_json(plan_root / "on_image_text_plan.json")
    manifest = load_json(actual_root / "run_manifest.json")
    plan_assets = plan.get("assets", [])
    if len(plan_assets) < args.count:
        raise ValueError(f"The copy plan contains only {len(plan_assets)} assets; five are required.")

    if public_root.exists():
        shutil.rmtree(public_root)
    public_root.mkdir(parents=True, exist_ok=True)

    ads = []
    for plan_asset in plan_assets[: args.count]:
        asset_id = str(plan_asset["asset_id"])
        source_image = image_for_asset(actual_root / "images", asset_id)
        destination_name = f"{asset_id}{source_image.suffix.lower()}"
        shutil.copy2(source_image, public_root / destination_name)

        visible_copy = []
        for slot_id, slot in plan_asset.get("visible_text", {}).items():
            text = str(slot.get("text", "")).strip()
            if not text:
                continue
            visible_copy.append(
                {
                    "slot": slot_id,
                    "label": str(slot.get("label") or slot_id.replace("_", " ").title()),
                    "text": text,
                }
            )

        if not visible_copy:
            raise ValueError(f"The dry-run copy plan has no visible copy for {asset_id}.")
        copy_by_slot = {item["slot"]: item["text"] for item in visible_copy}
        ads.append(
            {
                "asset_id": asset_id,
                "image": f"/generated-ads/{destination_name}",
                "pattern_id": plan_asset.get("pattern_id", ""),
                "pattern_name": plan_asset.get("pattern_name", ""),
                "visual_id": plan_asset.get("visual_id", ""),
                "visual_name": plan_asset.get("visual_name", ""),
                "headline": copy_by_slot.get("headline") or visible_copy[0]["text"],
                "post_text": copy_by_slot.get("subheadline") or copy_by_slot.get("headline") or "",
                "cta": copy_by_slot.get("cta") or "Learn more",
                "dry_run_copy": visible_copy,
            }
        )

    payload = {
        "campaign": {
            "title": manifest.get("project_name") or "Latest generated campaign",
            "generated_at": manifest.get("created_at"),
            "source_run": actual_root.name,
            "asset_count": len(ads),
        },
        "ads": ads,
    }
    app_data_path.parent.mkdir(parents=True, exist_ok=True)
    app_data_path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(
        json.dumps(
            {
                "site_root": str(site_root),
                "source_run": str(actual_root),
                "published_assets": len(ads),
                "manifest": str(app_data_path),
            },
            ensure_ascii=False,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
