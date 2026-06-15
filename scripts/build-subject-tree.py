#!/usr/bin/env python3
"""Generate meta/tree.html — site-wide subject hierarchy from topic catalog."""

from __future__ import annotations

import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOG_FILE = ROOT / "assets" / "js" / "topic-catalog.json"
OUT = ROOT / "meta" / "tree.html"

LEARNING_META = {
    "math": {
        "drilldown": "legacy/math-drill-down/explorer.html",
        "map": "maps/math-prereq-map.html",
    },
    "physics": {
        "drilldown": "legacy/physics-drill-down/explorer.html",
        "map": "maps/physics-prereq-map.html",
    },
    "quantum": {
        "drilldown": "legacy/quantum-drill-down/explorer.html",
        "map": "maps/quantum-prereq-map.html",
    },
}

OTHER_BRANCHES = [
    {
        "title": "Reference",
        "desc": "Symbols, variables, and equations by subject.",
        "items": [
            ("Electrical Engineering Variables", "reference/electrical/variables.html"),
            ("Electrical Engineering Equations", "reference/electrical/equations.html"),
            ("Physics Variables", "reference/physics/variables.html"),
            ("Physics Equations", "reference/physics/equations.html"),
            ("Mathematics Variables", "reference/mathematics/variables.html"),
            ("Mathematics Equations", "reference/mathematics/equations.html"),
            ("Quantum Variables", "reference/quantum/variables.html"),
            ("Quantum Equations", "reference/quantum/equations.html"),
        ],
    },
    {
        "title": "Calculators & tools",
        "desc": "Interactive engineering and physics calculators.",
        "items": [
            ("All calculators", "calculators/index.html"),
            ("Power calculators", "calculators/power/dc-power.html"),
            ("AC circuit calculators", "calculators/ac-circuits/impedance.html"),
            ("Unit converters", "calculators/converters/unit-power.html"),
            ("Digital logic tools", "calculators/logic/truth-table.html"),
            ("Physics calculators", "calculators/practical/force.html"),
        ],
    },
    {
        "title": "Site utilities",
        "desc": "Navigation aids and feedback.",
        "items": [
            ("All learning paths", "learn/index.html"),
            ("Learning progress", "progress.html"),
            ("Submit feedback", "feedback.html"),
        ],
    },
]


def esc(text: str) -> str:
    return html.escape(text, quote=True)


def rel_href(target: str) -> str:
    return "../" + target.replace("\\", "/")


def render_learning(catalogs: list[dict]) -> str:
    parts = [
        '      <section class="subject-tree__branch">',
        '        <h2><a href="' + rel_href("learn/index.html") + '">Learning paths</a></h2>',
        '        <p class="subject-tree__desc">Structured lesson catalogs from school level through research topics.</p>',
    ]
    for catalog in catalogs:
        meta = LEARNING_META.get(catalog["id"], {})
        topic_count = sum(len(s.get("topics", [])) for s in catalog.get("sections", []))
        parts.append('        <article class="subject-tree__subject">')
        parts.append(
            f'          <h3><a href="{rel_href(catalog["catalog_href"])}">{esc(catalog["label"])}</a>'
            f' <span class="subject-tree__count">({topic_count} topics)</span></h3>'
        )
        if meta:
            parts.append('          <p class="subject-tree__links">')
            parts.append(
                f'            <a href="{rel_href(meta["drilldown"])}">Drill-down explorer</a> · '
                f'<a href="{rel_href(meta["map"])}">Prerequisite map</a>'
            )
            parts.append("          </p>")
        if catalog["id"] == "math":
            parts.append('          <p class="subject-tree__links">')
            parts.append(
                f'            <a href="{rel_href("learn/mathematics/digital-logic/index.html")}">Digital Logic catalogue</a> · '
                f'<a href="{rel_href("legacy/digital-logic-drill-down/explorer.html")}">Digital Logic explorer</a>'
            )
            parts.append("          </p>")
        parts.append('          <ul class="subject-tree__sections">')
        for section in catalog.get("sections", []):
            count = len(section.get("topics", []))
            parts.append(
                f'            <li>{esc(section["title"])} '
                f'<span class="subject-tree__count">({count})</span></li>'
            )
        parts.append("          </ul>")
        parts.append("        </article>")
    parts.append("      </section>")
    return "\n".join(parts)


def render_branch(branch: dict) -> str:
    parts = [
        '      <section class="subject-tree__branch">',
        f"        <h2>{esc(branch['title'])}</h2>",
        f'        <p class="subject-tree__desc">{esc(branch["desc"])}</p>',
        '        <ul class="subject-tree__sections">',
    ]
    for label, href in branch["items"]:
        parts.append(f'          <li><a href="{rel_href(href)}">{esc(label)}</a></li>')
    parts.append("        </ul>")
    parts.append("      </section>")
    return "\n".join(parts)


def build_html(catalogs: list[dict]) -> str:
    body = "\n".join([render_learning(catalogs)] + [render_branch(b) for b in OTHER_BRANCHES])
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../assets/css/corporate.css">
    <script src="../assets/js/site-layout.js" defer></script>
    <title>Subject Hierarchy | Engineering Knowledge</title>
</head>
<body>
    <div class="page-container">
        <a href="../index.html" class="back-link">&larr; Back to Hub</a>

        <h1>Subject Hierarchy</h1>
        <p class="lead">High-level map of learning paths, reference material, calculators, and utilities across this hub.</p>

        <div class="subject-tree">
{body}
        </div>
    </div>
</body>
</html>
"""


def main() -> None:
    catalog = json.loads(CATALOG_FILE.read_text(encoding="utf-8"))
    catalogs = catalog.get("catalogs", [])
    OUT.write_text(build_html(catalogs), encoding="utf-8")
    total = sum(
        len(s.get("topics", []))
        for c in catalogs
        for s in c.get("sections", [])
    )
    print(f"Wrote {OUT.relative_to(ROOT)} ({len(catalogs)} subjects, {total} catalog topics)")


if __name__ == "__main__":
    main()
