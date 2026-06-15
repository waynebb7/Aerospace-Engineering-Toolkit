#!/usr/bin/env python3
"""Maintain maps/physics-topics.json (skip if already generated from template build)."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "maps" / "physics-prereq-map.html"
OUT = ROOT / "maps" / "physics-topics.json"

if OUT.exists():
    data = json.loads(OUT.read_text(encoding="utf-8"))
    print(
        f"Using existing {OUT.relative_to(ROOT)} "
        f"({len(data.get('nodes', []))} nodes)"
    )
    sys.exit(0)

text = SRC.read_text(encoding="utf-8")
nodes_block = re.search(r"const NODES = \[(.*?)\];", text, re.DOTALL)
edges_block = re.search(r"const EDGES = \[(.*?)\];", text, re.DOTALL)
if not nodes_block or not edges_block:
    raise SystemExit("physics-topics.json missing and could not parse legacy inline graph")

node_re = re.compile(
    r'\{\s*id:"([^"]+)",\s*title:"([^"]+)",\s*level:"([^"]+)"\s*\}'
)
edge_re = re.compile(
    r'\{\s*from:"([^"]+)",\s*to:"([^"]+)"(?:,\s*type:"([^"]+)")?\s*\}'
)

nodes = [
    {"id": m.group(1), "title": m.group(2), "level": m.group(3), "subject": "physics"}
    for m in node_re.finditer(nodes_block.group(1))
]
edges = [
    {"from": m.group(1), "to": m.group(2), **({"type": m.group(3)} if m.group(3) else {})}
    for m in edge_re.finditer(edges_block.group(1))
]

payload = {
    "meta": {
        "title": "Physics Prerequisite Graph",
        "version": "1.0.0",
        "levels": ["KS2", "KS3", "GCSE", "A-Level", "BSc", "MSc", "Frontier"],
    },
    "nodes": nodes,
    "edges": edges,
    "cross_edges": [],
}

OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Wrote {len(nodes)} nodes -> {OUT.relative_to(ROOT)}")
