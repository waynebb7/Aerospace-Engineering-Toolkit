#!/usr/bin/env python3
"""Build maps/quantum-topics.json from quantum catalog and topic progression."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / "assets" / "js" / "topic-catalog.json"
PROGRESSION = ROOT / "scripts" / "topic-progression.json"
OUT = ROOT / "maps" / "quantum-topics.json"

SECTION_LEVEL = {
    "Prerequisites": "Prerequisites",
    "Quantum Foundations": "Foundations",
    "Quantum Information": "Information",
    "Quantum Computing — Core": "Computing",
    "Quantum Algorithms": "Algorithms",
    "Error Correction & Fault Tolerance": "Error Correction",
    "Hardware & Engineering": "Hardware",
    "Applications & Security": "Applications",
    "Frontier Physics (linked)": "Frontier",
}

MATH_NODE_BY_HREF = {
    "learn/mathematics/a-level/vectors.html": "al_vectors",
    "learn/mathematics/a-level/matrices.html": "al_matrices",
    "learn/mathematics/a-level/complex-numbers.html": "al_complex",
    "learn/mathematics/a-level/linear-transformations.html": "al_linear_transforms",
    "learn/mathematics/a-level/hilbert-spaces.html": "al_hilbert_spaces",
    "learn/mathematics/a-level/statistics.html": "al_stats",
}

MATH_EXTERNAL_NODES = [
    {"id": "al_vectors", "title": "Vectors (A-Level)", "level": "Prerequisites", "domain": "Math", "subject": "math"},
    {"id": "al_matrices", "title": "Matrices (A-Level)", "level": "Prerequisites", "domain": "Math", "subject": "math"},
    {"id": "al_complex", "title": "Complex Numbers (A-Level)", "level": "Prerequisites", "domain": "Math", "subject": "math"},
    {"id": "al_linear_transforms", "title": "Linear Transformations (A-Level)", "level": "Prerequisites", "domain": "Math", "subject": "math"},
    {"id": "al_hilbert_spaces", "title": "Hilbert Spaces (A-Level)", "level": "Prerequisites", "domain": "Math", "subject": "math"},
    {"id": "al_stats", "title": "Statistics (A-Level)", "level": "Prerequisites", "domain": "Math", "subject": "math"},
]


def slug_id(href: str) -> str:
    name = Path(href).stem
    return "qc_" + re.sub(r"[^a-z0-9]+", "_", name.lower()).strip("_")


def title_for(href: str, fallback: str) -> str:
    return re.sub(r"\s*—.*$", "", fallback).strip()


catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
progression = json.loads(PROGRESSION.read_text(encoding="utf-8"))
quantum_cat = next(c for c in catalog["catalogs"] if c["id"] == "quantum")

nodes: list[dict] = []
href_to_id: dict[str, str] = {}

for section in quantum_cat["sections"]:
    level = SECTION_LEVEL.get(section["title"], "Foundations")
    for topic in section["topics"]:
        href = topic["href"]
        if href.startswith("learn/mathematics/"):
            continue
        node_id = slug_id(href)
        href_to_id[href] = node_id
        subject = "physics" if href.startswith("learn/physics/") else "quantum"
        nodes.append(
            {
                "id": node_id,
                "title": title_for(href, topic["title"]),
                "level": level,
                "domain": "Physics" if subject == "physics" else "Quantum",
                "subject": subject,
            }
        )

nodes = MATH_EXTERNAL_NODES + nodes

edges: list[dict] = []
seen_edges: set[tuple[str, str]] = set()

for href, entry in progression.items():
    if "learn/quantum/" not in href and href not in href_to_id:
        continue
    to_id = href_to_id.get(href)
    if not to_id:
        continue
    for prereq in entry.get("prereqs", []):
        if prereq in MATH_NODE_BY_HREF:
            from_id = MATH_NODE_BY_HREF[prereq]
            edge_type = "required"
            subject = "math"
        elif prereq in href_to_id:
            from_id = href_to_id[prereq]
            edge_type = "required"
            subject = nodes[[n["id"] for n in nodes].index(from_id)]["subject"] if from_id else "quantum"
            subject = "physics" if prereq.startswith("learn/physics/") else "quantum"
        else:
            continue
        key = (from_id, to_id)
        if key in seen_edges:
            continue
        seen_edges.add(key)
        edge = {"from": from_id, "to": to_id, "type": edge_type}
        if subject != "quantum":
            edge["subject"] = subject
        edges.append(edge)

# Conservative backbone when progression is sparse
backbone = [
    ("al_vectors", "qc_wave_particle_duality"),
    ("al_complex", "qc_dirac_notation"),
    ("qc_wave_particle_duality", "qc_superposition_and_measurement"),
    ("qc_superposition_and_measurement", "qc_quantum_postulates"),
    ("qc_quantum_postulates", "qc_qubits_and_bloch_sphere"),
    ("qc_qubits_and_bloch_sphere", "qc_quantum_gates"),
    ("qc_quantum_gates", "qc_quantum_circuits"),
    ("qc_quantum_circuits", "qc_deutsch_jozsa_algorithm"),
    ("qc_quantum_circuits", "qc_grovers_algorithm"),
    ("qc_grovers_algorithm", "qc_quantum_error_correction"),
    ("qc_quantum_error_correction", "qc_fault_tolerant_quantum_computing"),
]
for a, b in backbone:
    if a in {n["id"] for n in nodes} and b in {n["id"] for n in nodes}:
        key = (a, b)
        if key not in seen_edges:
            seen_edges.add(key)
            edges.append({"from": a, "to": b, "type": "required"})

payload = {
    "meta": {
        "title": "Quantum Prerequisite Graph",
        "version": "1.0.0",
        "levels": list(SECTION_LEVEL.values()),
        "notes": [
            "Covers quantum computing topics plus linked physics pages.",
            "Math prerequisites appear in the Prerequisites column.",
        ],
    },
    "nodes": nodes,
    "edges": edges,
}

OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Wrote {len(nodes)} nodes, {len(edges)} edges -> {OUT.relative_to(ROOT)}")
