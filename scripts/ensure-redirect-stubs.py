#!/usr/bin/env python3
"""Create missing redirect stub HTML files from path-relocation-map.json."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MAP_FILE = ROOT / "scripts" / "path-relocation-map.json"
REDIRECT_MARKER = "<!-- ek-redirect-stub -->"


def os_path_relpath(from_dir: Path, to_path: Path) -> str:
    from_parts = from_dir.parts if str(from_dir) != "." else ()
    to_parts = to_path.parts
    common = 0
    for a, b in zip(from_parts, to_parts):
        if a != b:
            break
        common += 1
    ups = [".."] * (len(from_parts) - common)
    return "/".join(ups + list(to_parts[common:]))


def redirect_html(target: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="0; url={target}" />
  <link rel="canonical" href="{target}" />
  <title>Page moved</title>
  {REDIRECT_MARKER}
</head>
<body>
  <p>This page has moved to <a href="{target}">{target}</a>.</p>
</body>
</html>
"""


def main() -> int:
    if not MAP_FILE.exists():
        print(f"Missing {MAP_FILE}", file=sys.stderr)
        return 1

    moves = json.loads(MAP_FILE.read_text(encoding="utf-8"))
    created = 0
    skipped = 0

    for old, new in sorted(moves.items()):
        if old.startswith(("css/", "js/")):
            continue
        stub = ROOT / old
        if stub.exists():
            skipped += 1
            continue
        target_path = ROOT / new
        if not target_path.exists():
            print(f"Skip (target missing): {old} -> {new}", file=sys.stderr)
            continue
        target = os_path_relpath(stub.parent, target_path)
        stub.parent.mkdir(parents=True, exist_ok=True)
        stub.write_text(redirect_html(target), encoding="utf-8")
        created += 1

    print(f"Redirect stubs: created {created}, already present {skipped}")

    import subprocess

    exclude_script = ROOT / "scripts" / "build-vscode-excludes.py"
    subprocess.run([sys.executable, str(exclude_script)], check=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
