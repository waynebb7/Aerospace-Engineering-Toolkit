#!/usr/bin/env python3
"""Verify quantum catalog links resolve to existing topic pages."""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / "learn/quantum/index.html"


def main() -> int:
    if not CATALOG.exists():
        print(f"MISSING catalog: {CATALOG.relative_to(ROOT)}")
        return 1

    text = CATALOG.read_text(encoding="utf-8")
    missing: list[str] = []
    for href in re.findall(r'href="([^"]+\.html)"', text):
        if href == "index.html":
            continue
        target = (CATALOG.parent / href).resolve()
        if not target.exists():
            missing.append(href)

    print(f"Quantum catalog links: {len(missing)} missing")
    for m in missing:
        print(" ", m)
    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(main())
