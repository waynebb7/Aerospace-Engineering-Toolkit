#!/usr/bin/env python3
"""Audit quantum catalog links for missing, stub, or thin pages."""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / "learn/quantum/index.html"
STUB_MARKERS = ("Content is being developed", "Coming soon")


def main() -> int:
    if not CATALOG.exists():
        print(f"MISSING catalog: {CATALOG.relative_to(ROOT)}")
        return 1

    text = CATALOG.read_text(encoding="utf-8")
    links: list[str] = []
    for href in re.findall(r'href="([^"]+\.html)"', text):
        if href not in links and href != "index.html":
            links.append(href)

    missing: list[str] = []
    stubs: list[str] = []
    short: list[str] = []
    for href in links:
        path = (CATALOG.parent / href).resolve()
        if not path.exists():
            missing.append(href)
            continue
        body = path.read_text(encoding="utf-8")
        if any(m in body for m in STUB_MARKERS):
            stubs.append(href)
        elif body.count('<div class="card">') < 5 and 'class="content-page"' not in body:
            short.append(href)

    print("Total catalog links:", len(links))
    print("Missing:", len(missing))
    for m in missing:
        print("  MISSING", m)
    print("Stubs:", len(stubs))
    for s in stubs:
        print("  STUB", s)
    print("Short/old format:", len(short))
    for s in short:
        print("  SHORT", s)
    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(main())
