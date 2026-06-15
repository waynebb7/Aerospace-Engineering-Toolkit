#!/usr/bin/env python3
"""Fix 'Back to Hub' and footer links that still point at local index.html."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

KEEP_AT_ROOT = {"index.html", "progress.html", "feedback.html"}

PATTERNS = [
    (re.compile(r'(<a\s+href=")index\.html("(?:\s+[^>]*)?>&larr;\s*Back to Hub</a>)', re.I), r"\1{hub}\2"),
    (re.compile(r'(<li><a\s+href=")index\.html(">Engineering Knowledge Hub</a></li>)', re.I), r"\1{hub}\2"),
]


def hub_href(path: Path) -> str:
    depth = len(path.relative_to(ROOT).parts) - 1
    return ("../" * depth) + "index.html"


def main() -> None:
    updated = 0
    for html in ROOT.rglob("*.html"):
        rel = html.relative_to(ROOT).as_posix()
        if rel in KEEP_AT_ROOT:
            continue
        if html.name == "index.html" and rel.count("/") <= 1:
            continue
        text = html.read_text(encoding="utf-8")
        hub = hub_href(html)
        new_text = text
        for pattern, repl in PATTERNS:
            new_text = pattern.sub(repl.format(hub=hub), new_text)
        if new_text != text:
            html.write_text(new_text, encoding="utf-8")
            updated += 1
    print(f"Updated hub breadcrumbs in {updated} files")


if __name__ == "__main__":
    main()
