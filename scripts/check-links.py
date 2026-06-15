#!/usr/bin/env python3
"""Check internal links and asset references in HTML files."""

from __future__ import annotations

import argparse
import re
import sys
from collections import deque
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parent.parent
ATTR_RE = re.compile(r"""(?:href|src)=["']([^"']+)["']""", re.IGNORECASE)
SKIP_PREFIXES = (
    "http://",
    "https://",
    "mailto:",
    "tel:",
    "javascript:",
    "#",
    "data:",
    "//",
)

# Subject catalogs list many pages that are not written yet.
CATALOG_PAGES = {
    "learn/mathematics/index.html",
    "learn/physics/index.html",
    "learn/quantum/index.html",
    "meta/tree.html",
    "learn/mathematics/digital-logic/digital-math-classification.html",
}


def is_checkable(ref: str) -> bool:
    ref = ref.strip()
    if not ref:
        return False
    return not ref.startswith(SKIP_PREFIXES)


def resolve(ref: str, source: Path) -> Path:
    ref = unquote(ref.split("?")[0].split("#")[0].strip())
    if ref.startswith("/"):
        return (ROOT / ref.lstrip("/")).resolve()
    return (source.parent / ref).resolve()


def collect_html_files() -> list[Path]:
    files: list[Path] = []
    for path in ROOT.rglob("*.html"):
        if any(part.startswith(".") for part in path.parts):
            continue
        files.append(path)
    return sorted(files)


def crawl_from_index() -> list[Path]:
    start = ROOT / "index.html"
    if not start.exists():
        return collect_html_files()

    queue: deque[Path] = deque([start])
    seen: set[Path] = set()
    pages: list[Path] = []

    while queue:
        html = queue.popleft()
        if html in seen or not html.exists() or html.suffix.lower() != ".html":
            continue
        seen.add(html)
        pages.append(html)

        try:
            text = html.read_text(encoding="utf-8")
        except OSError:
            continue

        for ref in ATTR_RE.findall(text):
            if not is_checkable(ref):
                continue
            target = resolve(ref, html)
            try:
                target.relative_to(ROOT)
            except ValueError:
                continue
            if target.suffix.lower() == ".html" and target.exists():
                queue.append(target)

    return sorted(pages)


def select_html_files(scope: str) -> list[Path]:
    if scope == "all":
        return collect_html_files()
    if scope == "core":
        return [
            path
            for path in crawl_from_index()
            if path.relative_to(ROOT).as_posix() not in CATALOG_PAGES
        ]
    raise ValueError(f"Unknown scope: {scope}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Check internal HTML links.")
    parser.add_argument(
        "--scope",
        choices=("core", "all"),
        default="core",
        help="core: hub-linked pages excluding subject catalogs (CI default); all: every HTML file",
    )
    args = parser.parse_args()

    errors: list[str] = []
    html_files = select_html_files(args.scope)

    for html in html_files:
        try:
            text = html.read_text(encoding="utf-8")
        except OSError as exc:
            errors.append(f"{html.relative_to(ROOT)}: cannot read file ({exc})")
            continue

        seen: set[str] = set()
        for ref in ATTR_RE.findall(text):
            if not is_checkable(ref) or ref in seen:
                continue
            seen.add(ref)
            target = resolve(ref, html)
            try:
                target.relative_to(ROOT)
            except ValueError:
                continue
            if not target.exists():
                errors.append(
                    f"{html.relative_to(ROOT)}: {ref} -> missing ({target.relative_to(ROOT)})"
                )

    if errors:
        print(f"Found {len(errors)} broken internal link(s):\n")
        for line in errors[:100]:
            print(f"  {line}")
        if len(errors) > 100:
            print(f"\n  ... and {len(errors) - 100} more")
        return 1

    print(
        f"OK: no broken internal links in {len(html_files)} HTML files (scope={args.scope})"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
