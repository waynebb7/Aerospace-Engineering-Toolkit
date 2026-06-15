#!/usr/bin/env python3
"""Build prerequisite and next-topic progression from catalog HTML files."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

CATALOGS = {
    "math": {
        "file": "learn/mathematics/index.html",
        "catalog_href": "learn/mathematics/index.html",
        "prereq_map": "maps/math-prereq-map.html",
        "label": "Mathematics",
        "prefix": "learn/mathematics/",
    },
    "physics": {
        "file": "learn/physics/index.html",
        "catalog_href": "learn/physics/index.html",
        "prereq_map": "maps/physics-prereq-map.html",
        "label": "Physics",
        "prefix": "learn/physics/",
    },
    "quantum": {
        "file": "learn/quantum/index.html",
        "catalog_href": "learn/quantum/index.html",
        "prereq_map": "maps/quantum-prereq-map.html",
        "label": "Quantum",
        "prefix": "learn/quantum/",
    },
}

RELOCATION_FILE = ROOT / "scripts" / "path-relocation-map.json"

# Replace auto-generated prereqs entirely (old href keys; remapped at runtime)
OVERRIDE_PREREQS_RAW: dict[str, list[str]] = {
    "quantum/wave-particle-duality.html": [
        "vectors.html",
        "complex-numbers.html",
        "../physics/a-level/quantum-physics-intro.html",
    ],
    "quantum-mechanics-1.html": [
        "quantum-physics-intro.html",
        "hilbert-spaces.html",
        "mathematical-methods-physics.html",
        "vectors.html",
    ],
    "quantum-mechanics-2.html": [
        "quantum-mechanics-1.html",
        "differentiation.html",
        "integration.html",
    ],
    "quantum-physics-intro.html": [
        "waves-a-level.html",
        "mathematical-methods-physics.html",
        "gcse/atomic-structure.html",
    ],
}

# Prepend to catalog-order prereqs (old href keys)
EXTRA_PREREQS_RAW: dict[str, list[str]] = {
    "equations.html": [
        "variables.html",
        "powers.html",
        "orders-of-operations.html",
        "fractions.html",
    ],
    "variables.html": ["powers.html", "negative-numbers.html", "orders-of-operations.html"],
    "functions.html": ["equations.html", "variables.html", "mappings.html"],
    "calculus.html": ["elementary-algebra.html", "functions.html", "trigonometry.html"],
    "differentiation.html": ["calculus.html", "limits.html"],
    "integration.html": ["differentiation.html"],
    "matrices.html": ["vectors.html", "elementary-algebra.html"],
    "linear-transformations.html": ["matrices.html", "vector-spaces.html"],
    "hilbert-spaces.html": ["vector-spaces.html", "linear-transformations.html"],
    "complex-numbers.html": ["elementary-algebra.html", "trigonometry.html"],
    "quantum/superposition-and-measurement.html": [
        "quantum/wave-particle-duality.html",
        "complex-numbers.html",
    ],
    "quantum/dirac-notation.html": [
        "quantum/superposition-and-measurement.html",
        "linear-transformations.html",
    ],
    "quantum/quantum-postulates.html": [
        "quantum/dirac-notation.html",
        "quantum/superposition-and-measurement.html",
    ],
    "quantum/qubits-and-bloch-sphere.html": [
        "quantum/dirac-notation.html",
        "complex-numbers.html",
    ],
    "quantum/quantum-gates.html": [
        "quantum/qubits-and-bloch-sphere.html",
        "matrices.html",
    ],
    "quantum/quantum-circuits.html": ["quantum/quantum-gates.html"],
    "quantum/deutsch-jozsa-algorithm.html": [
        "quantum/quantum-circuits.html",
        "quantum/quantum-gates.html",
    ],
    "quantum/grovers-algorithm.html": [
        "quantum/quantum-gates.html",
        "quantum/quantum-circuits.html",
    ],
    "quantum/shors-algorithm.html": ["quantum/quantum-fourier-transform.html"],
    "quantum/quantum-fourier-transform.html": [
        "quantum/quantum-circuits.html",
        "complex-numbers.html",
    ],
    "quantum/entanglement-and-bell.html": [
        "quantum/superposition-and-measurement.html",
        "quantum/dirac-notation.html",
    ],
    "quantum/density-matrices.html": [
        "quantum/entanglement-and-bell.html",
        "matrices.html",
    ],
    "quantum/quantum-error-correction.html": [
        "quantum/quantum-gates.html",
        "quantum/density-matrices.html",
    ],
    "quantum-physics-intro.html": ["waves-a-level.html", "mathematical-methods-physics.html"],
    "quantum-mechanics-1.html": ["quantum-physics-intro.html", "hilbert-spaces.html"],
    "classical-mechanics.html": ["mechanics-a-level.html", "vectors-in-physics.html"],
    "logic_and_digital_math/number-systems.html": [
        "orders-of-operations.html",
        "powers.html",
    ],
    "logic_and_digital_math/boolean-algebra.html": [
        "logic_and_digital_math/number-systems.html",
    ],
    "logic_and_digital_math/logic-gates.html": [
        "logic_and_digital_math/boolean-algebra.html",
        "logic_and_digital_math/truth-tables.html",
    ],
    "logic_and_digital_math/karnaugh-mapping.html": [
        "logic_and_digital_math/boolean-algebra.html",
        "logic_and_digital_math/truth-tables.html",
    ],
    "logic_and_digital_math/sequential-logic.html": [
        "logic_and_digital_math/combinational-logic.html",
        "logic_and_digital_math/logic-gates.html",
    ],
}

# Replace auto-generated next_required (old href keys)
EXTRA_NEXT_REQUIRED_RAW: dict[str, list[str]] = {
    "differentiation.html": ["integration.html"],
    "integration.html": ["vectors.html", "integration-in-engineering.html"],
    "calculus.html": ["limits.html", "differentiation.html"],
    "quantum/grovers-algorithm.html": ["quantum/shors-algorithm.html"],
    "quantum/deutsch-jozsa-algorithm.html": ["quantum/grovers-algorithm.html"],
}

OVERVIEW_PAGES = {
    "learn/mathematics/research/millennium-prize-problems.html",
    "learn/mathematics/digital-logic/digital-math-classification.html",
    "learn/quantum/topics/quantum-algorithms-overview.html",
}

LINK_RE = re.compile(
    r'<li>\s*<a\s+href="([^"]+\.html)">([^<]+)</a>\s*</li>',
    re.IGNORECASE,
)
SECTION_RE = re.compile(r"<section>(.*?)</section>", re.DOTALL | re.IGNORECASE)
H2_RE = re.compile(r"<h2>(.*?)</h2>", re.DOTALL | re.IGNORECASE)


def load_relocation_map() -> dict[str, str]:
    if RELOCATION_FILE.exists():
        return json.loads(RELOCATION_FILE.read_text(encoding="utf-8"))
    return {}


def key_anchor(key: str) -> str:
    if key.startswith("quantum/"):
        return "learn/quantum/index.html"
    if key.startswith("logic_and_digital_math/"):
        return "learn/mathematics/index.html"
    if key.startswith(
        ("quantum-", "classical-", "waves-", "mechanics-", "vectors-in", "mathematical-methods")
    ):
        return "learn/physics/index.html"
    return "learn/mathematics/index.html"


def resolve_old_href(href: str, moves: dict[str, str], anchor: str) -> str:
    if href in moves:
        return moves[href]
    return normalize_href(href, anchor)


def remap_href_dict(
    raw: dict[str, list[str]], moves: dict[str, str]
) -> dict[str, list[str]]:
    out: dict[str, list[str]] = {}
    for key, values in raw.items():
        anchor = key_anchor(key)
        full_key = resolve_old_href(key, moves, anchor)
        out[full_key] = [resolve_old_href(v, moves, anchor) for v in values]
    return out


def normalize_href(href: str, catalog_file: str) -> str:
    href = href.replace("\\", "/")
    if href.startswith("./"):
        href = href[2:]
    if href.startswith(("http://", "https://")):
        return href
    catalog_dir = (ROOT / catalog_file).parent
    return (catalog_dir / href).resolve().relative_to(ROOT).as_posix()


def parse_catalog(path: Path, catalog_file: str) -> list[dict]:
    text = path.read_text(encoding="utf-8")
    sections = []
    for block in SECTION_RE.findall(text):
        h2 = H2_RE.search(block)
        if not h2:
            continue
        title = re.sub(r"<[^>]+>", "", h2.group(1)).strip()
        topics = []
        for href, link_title in LINK_RE.findall(block):
            topics.append(
                {
                    "href": normalize_href(href, catalog_file),
                    "title": link_title.strip(),
                }
            )
        if topics:
            sections.append({"section": title, "topics": topics})
    return sections


def dedupe_keep_order(items: list[str]) -> list[str]:
    seen = set()
    out = []
    for x in items:
        if x not in seen:
            seen.add(x)
            out.append(x)
    return out


def dedupe_catalogs(entry: dict) -> None:
    seen: set[str] = set()
    out = []
    for cat in entry.get("catalogs", []):
        if cat["key"] not in seen:
            seen.add(cat["key"])
            out.append(cat)
    entry["catalogs"] = out


def build_progression() -> dict:
    all_topics: dict[str, dict] = {}
    moves = load_relocation_map()
    override_prereqs = remap_href_dict(OVERRIDE_PREREQS_RAW, moves)
    extra_prereqs = remap_href_dict(EXTRA_PREREQS_RAW, moves)
    extra_next = remap_href_dict(EXTRA_NEXT_REQUIRED_RAW, moves)

    for cat_key, meta in CATALOGS.items():
        sections = parse_catalog(ROOT / meta["file"], meta["file"])
        flat = [t for s in sections for t in s["topics"]]
        prefix = meta["prefix"]

        for si, sec in enumerate(sections):
            prev_section_last = None
            if si > 0 and sections[si - 1]["section"] != "Prerequisites":
                prev_section_last = sections[si - 1]["topics"][-1]["href"]

            next_section_first = None
            if si + 1 < len(sections):
                next_section_first = sections[si + 1]["topics"][0]["href"]

            for ti, topic in enumerate(sec["topics"]):
                href = topic["href"]
                entry = all_topics.setdefault(
                    href,
                    {
                        "title": topic["title"],
                        "catalogs": [],
                        "prereqs": [],
                        "next_required": [],
                        "next_parallel": [],
                        "next_deeper": [],
                        "section": sec["section"],
                    },
                )
                entry["title"] = topic["title"]

                # Record catalog membership (including cross-links)
                entry["catalogs"].append(
                    {
                        "key": cat_key,
                        "section": sec["section"],
                        "catalog_href": meta["catalog_href"],
                        "prereq_map": meta["prereq_map"],
                        "label": meta["label"],
                    }
                )

                # Only derive prereqs / next from the catalog that owns this page
                if not href.startswith(prefix):
                    continue

                entry["section"] = sec["section"]

                immediate_prev = sec["topics"][ti - 1]["href"] if ti > 0 else None
                immediate_next = (
                    sec["topics"][ti + 1]["href"] if ti + 1 < len(sec["topics"]) else None
                )

                if href in override_prereqs:
                    prereq_candidates = list(override_prereqs[href])
                else:
                    prereq_candidates = []
                    if immediate_prev and sections[si]["section"] != "Prerequisites":
                        prereq_candidates.append(immediate_prev)
                        if ti > 1:
                            prereq_candidates.append(sec["topics"][ti - 2]["href"])
                    elif prev_section_last:
                        prereq_candidates.append(prev_section_last)

                    if href in extra_prereqs:
                        prereq_candidates = extra_prereqs[href] + prereq_candidates

                entry["prereqs"] = dedupe_keep_order(prereq_candidates)[:6]

                if href in extra_next:
                    next_req = list(extra_next[href])
                else:
                    next_req = []
                    if immediate_next:
                        next_req.append(immediate_next)
                    elif next_section_first:
                        next_req.append(next_section_first)
                entry["next_required"] = dedupe_keep_order(next_req)[:3]

                parallel = []
                if href not in extra_next:
                    if immediate_next and ti + 2 < len(sec["topics"]):
                        parallel.append(sec["topics"][ti + 2]["href"])
                    if next_section_first and immediate_next is None:
                        if si + 1 < len(sections) and len(sections[si + 1]["topics"]) > 1:
                            parallel.append(sections[si + 1]["topics"][1]["href"])
                entry["next_parallel"] = dedupe_keep_order(parallel)[:3]

                try:
                    idx = next(i for i, t in enumerate(flat) if t["href"] == href)
                    skip = set(entry["next_required"]) | set(entry["next_parallel"])
                    deeper = [
                        flat[j]["href"]
                        for j in range(idx + 2, min(idx + 6, len(flat)))
                        if flat[j]["href"].startswith(prefix) and flat[j]["href"] not in skip
                    ]
                    entry["next_deeper"] = dedupe_keep_order(deeper)[:3]
                except StopIteration:
                    pass

    for entry in all_topics.values():
        dedupe_catalogs(entry)

    return all_topics


def main():
    progression = build_progression()
    out = ROOT / "scripts" / "topic-progression.json"
    out.write_text(json.dumps(progression, indent=2), encoding="utf-8")
    print(f"Wrote {len(progression)} topics to {out}")


if __name__ == "__main__":
    main()
