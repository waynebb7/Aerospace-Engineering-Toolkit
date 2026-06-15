#!/usr/bin/env python3
"""Verify catalog links resolve to existing topic pages."""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOGS = {
    "learn/mathematics/index.html": "Mathematics",
    "learn/physics/index.html": "Physics",
    "learn/quantum/index.html": "Quantum",
}


def extract_links(html_path: Path) -> list[str]:
    text = html_path.read_text(encoding="utf-8")
    links: list[str] = []
    seen: set[str] = set()
    for href in re.findall(r'href="([^"]+\.html)"', text):
        if href in seen or href == "index.html":
            continue
        seen.add(href)
        links.append(href)
    return links


def resolve_href(catalog_path: Path, href: str) -> Path:
    if href.startswith(("http://", "https://", "//")):
        return catalog_path  # skip external
    if href.startswith("/"):
        return ROOT / href.lstrip("/")
    return (catalog_path.parent / href).resolve()


def main() -> int:
    missing: list[tuple[str, str]] = []
    for catalog_href, label in CATALOGS.items():
        catalog_path = ROOT / catalog_href
        if not catalog_path.exists():
            print(f"MISSING catalog: {catalog_href}")
            missing.append((catalog_href, catalog_href))
            continue
        for href in extract_links(catalog_path):
            target = resolve_href(catalog_path, href)
            if not target.exists():
                missing.append((catalog_href, href))

    print(f"Catalog link check: {len(missing)} missing")
    for cat, href in missing[:50]:
        print(f"  {cat} -> {href}")
    if len(missing) > 50:
        print(f"  ... and {len(missing) - 50} more")
    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(main())
