#!/usr/bin/env python3
"""Verify redirect stub pages point at existing targets."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MAP_FILE = ROOT / "scripts" / "path-relocation-map.json"
MARKER = "<!-- ek-redirect-stub -->"
REFRESH_RE = re.compile(r'<meta\s+http-equiv="refresh"\s+content="0;\s*url=([^"]+)"', re.I)
CANONICAL_RE = re.compile(r'<link\s+rel="canonical"\s+href="([^"]+)"', re.I)
ANCHOR_RE = re.compile(r'<a\s+href="([^"]+)"', re.I)


def resolve(ref: str, source: Path) -> Path:
    ref = ref.split("#")[0].split("?")[0].strip()
    if ref.startswith("/"):
        return (ROOT / ref.lstrip("/")).resolve()
    return (source.parent / ref).resolve()


def target_from_stub(path: Path, text: str) -> str | None:
    m = REFRESH_RE.search(text)
    if m:
        return m.group(1).strip()
    m = CANONICAL_RE.search(text)
    if m:
        return m.group(1).strip()
    m = ANCHOR_RE.search(text)
    if m:
        return m.group(1).strip()
    return None


def missing_stubs_from_map() -> list[str]:
    if not MAP_FILE.exists():
        return []
    moves = json.loads(MAP_FILE.read_text(encoding="utf-8"))
    missing: list[str] = []
    for old, new in moves.items():
        if old.startswith(("css/", "js/")):
            continue
        stub = ROOT / old
        target = ROOT / new
        if stub.exists() or not target.exists():
            continue
        missing.append(old)
    return missing


def main() -> int:
    errors: list[str] = []
    count = 0

    for missing in missing_stubs_from_map():
        errors.append(f"{missing}: redirect stub missing (run scripts/ensure-redirect-stubs.py)")

    for path in sorted(ROOT.rglob("*.html")):
        if any(part.startswith(".") for part in path.parts):
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except OSError:
            continue
        if MARKER not in text:
            continue
        count += 1
        target_ref = target_from_stub(path, text)
        if not target_ref:
            errors.append(f"{path.relative_to(ROOT)}: no redirect target found")
            continue
        target = resolve(target_ref, path)
        if not target.exists():
            errors.append(
                f"{path.relative_to(ROOT)}: {target_ref} -> missing ({target.relative_to(ROOT)})"
            )

    if errors:
        print(f"Found {len(errors)} broken redirect stub(s) in {count} stubs:\n")
        for line in errors[:50]:
            print(f"  {line}")
        if len(errors) > 50:
            print(f"  ... and {len(errors) - 50} more")
        return 1

    print(f"OK: {count} redirect stub(s) point to existing targets")
    return 0


if __name__ == "__main__":
    sys.exit(main())
