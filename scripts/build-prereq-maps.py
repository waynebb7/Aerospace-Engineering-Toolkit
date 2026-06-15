#!/usr/bin/env python3
"""Build prerequisite map HTML pages from topic JSON sources."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "maps" / "prereq-map.template.html"
NODE_PAGES = ROOT / "maps" / "prereq-node-pages.json"

MAP_SPECS = [
    {
        "out": "maps/math-prereq-map.html",
        "topics": "maps/math-topics.json",
        "title": "Mathematics Prerequisite Map",
        "subtitle": "Left is foundational. Right is advanced. Lines show prerequisite dependency. Required and recommended edges differ.",
        "config": {
            "id": "math",
            "defaultFocus": "bsc_real_analysis",
            "hasEdgeTypes": True,
            "hasDomains": True,
            "catalogHref": "learn/mathematics/index.html",
        },
    },
    {
        "out": "maps/physics-prereq-map.html",
        "topics": "maps/physics-topics.json",
        "title": "Physics Prerequisite Map",
        "subtitle": "Left is foundational. Right is advanced. Dashed purple lines show cross-subject mathematics prerequisites.",
        "config": {
            "id": "physics",
            "defaultFocus": "string_theory_frontier",
            "hasEdgeTypes": False,
            "hasDomains": False,
            "hasCrossSubject": True,
            "catalogHref": "learn/physics/index.html",
        },
        "merge_math_cross": True,
    },
    {
        "out": "maps/quantum-prereq-map.html",
        "topics": "maps/quantum-topics.json",
        "title": "Quantum Prerequisite Map",
        "subtitle": "Quantum computing and foundations. Math prerequisites appear in the first column.",
        "config": {
            "id": "quantum",
            "defaultFocus": "qc_qubits_and_bloch_sphere",
            "hasEdgeTypes": True,
            "hasDomains": True,
            "catalogHref": "learn/quantum/index.html",
        },
    },
]


def run_builder(script: str) -> None:
    subprocess.run([sys.executable, str(ROOT / "scripts" / script)], check=True)


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def graph_payload(spec: dict) -> dict:
    graph = load_json(ROOT / spec["topics"])
    payload = {
        "meta": graph.get("meta", {}),
        "nodes": list(graph.get("nodes", [])),
        "edges": list(graph.get("edges", [])),
    }
    if spec.get("merge_math_cross") and graph.get("cross_edges"):
        math_graph = load_json(ROOT / "maps" / "math-topics.json")
        math_by_id = {n["id"]: n for n in math_graph["nodes"]}
        existing = {n["id"] for n in payload["nodes"]}
        for edge in graph["cross_edges"]:
            mid = edge["from"]
            if mid not in existing and mid in math_by_id:
                node = dict(math_by_id[mid])
                node["subject"] = "math"
                payload["nodes"].append(node)
                existing.add(mid)
        payload["cross_edges"] = graph["cross_edges"]
        spec["config"]["levels"] = graph["meta"]["levels"]
    else:
        spec["config"]["levels"] = graph["meta"]["levels"]
    return payload


def node_pages_payload(spec: dict, graph: dict, pages: dict) -> dict:
    map_id = spec["config"]["id"]
    by_node = pages.get("byNode", pages if "math" in pages else {})
    payload = dict(by_node.get(map_id, {}))
    if spec.get("merge_math_cross"):
        math_pages = by_node.get("math", {})
        for node in graph.get("nodes", []):
            if node.get("subject") == "math" and node["id"] in math_pages:
                payload[node["id"]] = math_pages[node["id"]]
    return payload


def render_template(spec: dict, graph: dict, pages: dict) -> str:
    template = TEMPLATE.read_text(encoding="utf-8")
    map_id = spec["config"]["id"]
    level_checks = "\n".join(
        f'        <label class="level-filter-label"><input type="checkbox" class="level-filter" value="{lvl}" checked> {lvl}</label>'
        for lvl in graph["meta"]["levels"]
    )
    replacements = {
        "{{TITLE}}": spec["title"],
        "{{HEADER_TITLE}}": spec["title"],
        "{{SUBTITLE}}": spec["subtitle"],
        "{{LEVEL_FILTERS}}": level_checks,
        "{{MAP_CONFIG_JSON}}": json.dumps(spec["config"], ensure_ascii=False, indent=2),
        "{{GRAPH_DATA_JSON}}": json.dumps(graph, ensure_ascii=False, indent=2),
        "{{NODE_PAGES_JSON}}": json.dumps(
            node_pages_payload(spec, graph, pages),
            ensure_ascii=False,
            indent=2,
        ),
    }
    html = template
    for key, value in replacements.items():
        html = html.replace(key, value)
    return html


def main() -> None:
    run_builder("extract-physics-topics.py")
    run_builder("build-quantum-topics.py")
    run_builder("build-prereq-node-pages.py")

    all_pages = load_json(NODE_PAGES)

    for spec in MAP_SPECS:
        graph = graph_payload(spec)
        html = render_template(spec, graph, all_pages)
        out = ROOT / spec["out"]
        out.write_text(html, encoding="utf-8", newline="\n")
        print(f"Built {out.relative_to(ROOT)} ({len(graph['nodes'])} nodes)")


if __name__ == "__main__":
    main()
