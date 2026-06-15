#!/usr/bin/env python3
"""Generate stub content pages for every subject linked from math/physics catalogs."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

CATALOGS = {
    "learn/mathematics/index.html": {
        "catalog_href": "learn/mathematics/index.html",
        "catalog_label": "Mathematics Catalog",
        "subject": "Mathematics",
    },
    "learn/physics/index.html": {
        "catalog_href": "learn/physics/index.html",
        "catalog_label": "Physics Catalog",
        "subject": "Physics",
    },
}


def extract_links(html_path: Path) -> list[str]:
    text = html_path.read_text(encoding="utf-8")
    links = re.findall(r'href="([^"]+\.html)"', text)
    seen: set[str] = set()
    unique: list[str] = []
    for href in links:
        if href in seen or href == "index.html":
            continue
        seen.add(href)
        unique.append(href)
    return unique


def title_from_href(href: str) -> str:
    name = Path(href).stem
    name = name.replace("-", " ").replace("_", " ")
    words = []
    for word in name.split():
        if word.lower() in {"and", "of", "in", "to", "the", "a", "an", "for", "vs"}:
            words.append(word.lower())
        elif word.upper() in {"AC", "DC", "RF", "SHM", "AMO", "MHD", "FSM", "PDE", "PDEs", "QFT"}:
            words.append(word.upper())
        else:
            words.append(word.capitalize())
    if words:
        words[0] = words[0].capitalize() if words[0].lower() in {"and", "of", "in", "to", "the", "a", "an", "for", "vs"} else words[0]
    return " ".join(words)


def catalog_for_href(href: str, source_catalog: str) -> tuple[str, str]:
    meta = CATALOGS[source_catalog]
    parts = href.split("/")
    depth = len(parts) - 1
    prefix = "../" * depth if depth else ""
    return prefix + meta["catalog_href"], meta["catalog_label"]


def render_page(title: str, href: str, catalog_href: str, catalog_label: str, subject: str) -> str:
    parts = href.split("/")
    depth = len(parts) - 1
    prefix = "../" * depth if depth else ""

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="{prefix}css/corporate.css">
  <script src="{prefix}js/site-layout.js" defer></script>
  <title>{title}</title>
</head>

<body class="content-page">
  <div class="page-container">
    <div class="content-hero">
      <nav class="page-hero-breadcrumb" aria-label="Breadcrumb">
        <a href="{prefix}index.html">&larr; Back to Hub</a>
      </nav>
      <h1>{title}</h1>
      <p>{subject} topic page. Content is being developed.</p>
      <div class="content-nav">
        <a href="{catalog_href}">&larr; {catalog_label}</a>
      </div>
    </div>

    <div class="content-body">
      <div class="card">
        <h2>Overview</h2>
        <p>
          This page is a placeholder for <strong>{title}</strong>. It is linked from the
          <a href="{catalog_href}">{catalog_label}</a> and will be expanded with explanations,
          worked examples, and engineering applications.
        </p>
      </div>

      <div class="card">
        <h2>Coming soon</h2>
        <ul>
          <li>Key definitions and notation</li>
          <li>Step-by-step examples</li>
          <li>Links to related calculators and reference material</li>
        </ul>
      </div>
    </div>
  </div>
</body>
</html>
"""


def main() -> None:
    created = 0
    skipped = 0
    link_sources: dict[str, str] = {}

    for catalog_file, meta in CATALOGS.items():
        catalog_path = ROOT / catalog_file
        for href in extract_links(catalog_path):
            link_sources.setdefault(href, catalog_file)

    for href, source_catalog in sorted(link_sources.items()):
        target = ROOT / Path(href)
        if target.exists():
            skipped += 1
            continue

        catalog_href, catalog_label = catalog_for_href(href, source_catalog)
        subject = CATALOGS[source_catalog]["subject"]
        title = title_from_href(href)
        html = render_page(title, href, catalog_href, catalog_label, subject)

        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(html, encoding="utf-8", newline="\n")
        created += 1

    print(f"Created {created} pages, skipped {skipped} existing.")


if __name__ == "__main__":
    main()
