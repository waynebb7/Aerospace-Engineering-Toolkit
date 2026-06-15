#!/usr/bin/env python3
"""Map prereq graph node IDs to lesson page hrefs."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / "assets" / "js" / "topic-catalog.json"
OVERRIDES = ROOT / "scripts" / "prereq-node-pages-overrides.json"
OUT = ROOT / "maps" / "prereq-node-pages.json"

TOPIC_FILES = {
    "math": ROOT / "maps" / "math-topics.json",
    "physics": ROOT / "maps" / "physics-topics.json",
    "quantum": ROOT / "maps" / "quantum-topics.json",
}

LEVEL_FOLDERS_MATH = {
    "KS2": "ks2-ks3",
    "KS3": "ks2-ks3",
    "GCSE": "gcse",
    "A-Level": "a-level",
    "BSc": "undergraduate",
    "MSc": "postgraduate",
    "Frontier": "research",
}

LEVEL_FOLDERS_PHYSICS = {
    **LEVEL_FOLDERS_MATH,
    "Frontier": "frontier",
}

SUBJECT_LEVEL_FOLDERS = {
    "mathematics": LEVEL_FOLDERS_MATH,
    "physics": LEVEL_FOLDERS_PHYSICS,
    "quantum": {"A-Level": "topics", "BSc": "topics", "MSc": "topics", "Frontier": "topics"},
}

LEVEL_SUFFIXES = (
    "_basics",
    "_ks2",
    "_ks3",
    "_gcse",
    "_alevel",
    "_bsc",
    "_msc",
    "_frontier",
    "_intro",
)


def norm(s: str) -> str:
    s = s.lower()
    s = re.sub(r"\(.*?\)", "", s)
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def node_slug(node_id: str) -> str:
    core = node_id
    for suffix in LEVEL_SUFFIXES:
        if core.endswith(suffix):
            core = core[: -len(suffix)]
    return core.replace("_", "-")


def load_topics(catalog_id: str) -> list[dict]:
    data = json.loads(CATALOG.read_text(encoding="utf-8"))
    cat = next(c for c in data["catalogs"] if c["id"] == catalog_id)
    topics: list[dict] = []
    for section in cat["sections"]:
        for topic in section["topics"]:
            topics.append(topic)
    return topics


def existing_hrefs(hrefs: list[str]) -> list[str]:
    return [h for h in hrefs if (ROOT / h).exists()]


def slug_guess(node: dict, subject: str) -> str | None:
    level = node.get("level", "")
    folders = SUBJECT_LEVEL_FOLDERS.get(subject, LEVEL_FOLDERS_MATH)
    folder = folders.get(level, "")
    if not folder:
        return None
    slug = node_slug(node["id"])
    base = f"learn/{subject}/{folder}"
    candidates = [f"{base}/{slug}.html"]
    if level == "A-Level":
        candidates.extend([f"{base}/{slug}-a-level.html", f"{base}/{slug}-gcse.html"])
    elif level == "GCSE":
        candidates.append(f"{base}/{slug}-gcse.html")
    for c in candidates:
        if (ROOT / c).exists():
            return c
    return None


def physics_guess(node: dict) -> str | None:
    return slug_guess(node, "physics")


def math_guess(node: dict) -> str | None:
    return slug_guess(node, "mathematics")


def scan_slug_guess(node: dict) -> str | None:
    slug = node_slug(node["id"])
    matches = sorted(ROOT.glob(f"learn/**/{slug}.html"))
    if not matches:
        matches = sorted(ROOT.glob(f"learn/**/*{slug}*.html"))
    for path in matches:
        if path.name == "index.html":
            continue
        return path.relative_to(ROOT).as_posix()
    return None


def best_title_match(node_title: str, topics: list[dict]) -> str | None:
    target = norm(node_title)
    best = None
    best_score = 0
    for topic in topics:
        title = norm(topic["title"])
        href = topic["href"]
        if not (ROOT / href).exists():
            continue
        if title == target:
            return href
        if target in title or title in target:
            score = min(len(target), len(title))
            if score > best_score:
                best_score = score
                best = href
    return best


def resolve_href(node: dict, map_id: str, catalog_topics: list[dict]) -> str | None:
    if map_id == "physics":
        href = physics_guess(node)
        if href:
            return href
    elif map_id == "math":
        href = math_guess(node)
        if href:
            return href
    else:
        href = slug_guess(node, "quantum")
        if href:
            return href

    href = scan_slug_guess(node)
    if href and (ROOT / href).exists():
        return href

    return best_title_match(node["title"], catalog_topics)


def audit_unmapped(by_node: dict[str, dict[str, list[str]]]) -> int:
    total = 0
    for map_id, path in TOPIC_FILES.items():
        if not path.exists():
            continue
        graph = json.loads(path.read_text(encoding="utf-8"))
        mapped = set(by_node.get(map_id, {}).keys())
        nodes = graph.get("nodes", [])
        unmapped = [n for n in nodes if n["id"] not in mapped]
        if unmapped:
            print(f"  unmapped {map_id}: {len(unmapped)}", file=sys.stderr)
            for node in unmapped:
                print(f"    - {node['id']}: {node['title']}", file=sys.stderr)
        total += len(unmapped)
    return total


def main() -> None:
    overrides: dict[str, dict[str, list[str]]] = {}
    if OVERRIDES.exists():
        overrides = json.loads(OVERRIDES.read_text(encoding="utf-8"))

    invalid_overrides: list[str] = []
    for map_id, mapping in overrides.items():
        for node_id, hrefs in list(mapping.items()):
            kept = existing_hrefs(hrefs)
            if kept:
                mapping[node_id] = kept
            else:
                invalid_overrides.append(f"{map_id}/{node_id}: {hrefs}")
                del mapping[node_id]

    if invalid_overrides:
        print(f"Warning: {len(invalid_overrides)} override(s) point to missing files", file=sys.stderr)
        for item in invalid_overrides[:10]:
            print(f"  - {item}", file=sys.stderr)
        if len(invalid_overrides) > 10:
            print(f"  ... and {len(invalid_overrides) - 10} more", file=sys.stderr)

    math_topics = load_topics("math")
    physics_topics = load_topics("physics")
    quantum_topics = load_topics("quantum")

    by_node: dict[str, dict[str, list[str]]] = {"math": {}, "physics": {}, "quantum": {}}

    for map_id, path in TOPIC_FILES.items():
        if not path.exists():
            continue
        graph = json.loads(path.read_text(encoding="utf-8"))
        map_overrides = overrides.get(map_id, {})
        catalog_topics = {"math": math_topics, "physics": physics_topics, "quantum": quantum_topics}[map_id]

        for node in graph.get("nodes", []):
            node_id = node["id"]
            if node_id in map_overrides:
                kept = existing_hrefs(map_overrides[node_id])
                if kept:
                    by_node[map_id][node_id] = kept
                continue

            href = resolve_href(node, map_id, catalog_topics)
            if href and (ROOT / href).exists():
                by_node[map_id][node_id] = [href]

        for node in graph.get("nodes", []):
            if node.get("subject") == "math" and node["id"] not in by_node.get(map_id, {}):
                math_path = TOPIC_FILES["math"]
                if not math_path.exists():
                    continue
                math_graph = json.loads(math_path.read_text(encoding="utf-8"))
                math_node = next((n for n in math_graph["nodes"] if n["id"] == node["id"]), None)
                if not math_node:
                    continue
                if math_node["id"] in by_node.get("math", {}):
                    by_node.setdefault(map_id, {})[math_node["id"]] = by_node["math"][math_node["id"]]
                    continue
                href = resolve_href(math_node, "math", math_topics)
                if href and (ROOT / href).exists():
                    by_node.setdefault(map_id, {})[math_node["id"]] = [href]

    by_page: dict[str, dict[str, str]] = {}
    for map_id, mapping in by_node.items():
        by_page[map_id] = {}
        for node_id, hrefs in mapping.items():
            for href in hrefs:
                by_page[map_id][href] = node_id

    payload = {"byNode": by_node, "byPage": by_page}
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    for k, v in by_node.items():
        print(f"{k}: mapped {len(v)} nodes")

    unmapped_count = audit_unmapped(by_node)
    if unmapped_count:
        print(f"Audit: {unmapped_count} node(s) still without lesson pages", file=sys.stderr)


if __name__ == "__main__":
    main()
