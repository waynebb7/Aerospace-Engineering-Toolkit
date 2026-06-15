#!/usr/bin/env python3
"""List topic links from subject catalogs."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOGS = [
    "learn/mathematics/index.html",
    "learn/physics/index.html",
    "learn/quantum/index.html",
]

for cat in CATALOGS:
    path = ROOT / cat
    if not path.exists():
        print(cat, "MISSING")
        continue
    text = path.read_text(encoding="utf-8")
    links: list[str] = []
    for href in re.findall(r'href="([^"]+\.html)"', text):
        if href not in links and href != "index.html":
            links.append(href)
    print(cat, len(links))
