#!/usr/bin/env python3
"""Inject Pre-requisites and Next topics sections on catalog topic pages."""
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROGRESSION_FILE = ROOT / "scripts" / "topic-progression.json"
NODE_PAGES_FILE = ROOT / "maps" / "prereq-node-pages.json"

PREREQ_CARD_MARKER = "progression-card prerequisites-card"
NEXT_CARD_MARKER = "progression-card next-topics-card"
MAP_STRIP_MARKER = "progression-card map-position-card"

MAP_GRAPH_FILES = {
    "math": ROOT / "maps" / "math-topics.json",
    "physics": ROOT / "maps" / "physics-topics.json",
    "quantum": ROOT / "maps" / "quantum-topics.json",
}

MAP_LABELS = {
    "math": "Mathematics",
    "physics": "Physics",
    "quantum": "Quantum",
}

CATALOG_LINKS = {
    "math": ("learn/mathematics/index.html", "Mathematics Catalog"),
    "physics": ("learn/physics/index.html", "Physics Catalog"),
    "quantum": ("learn/quantum/index.html", "Quantum Catalog"),
}

NEXT_TOPICS_CARD_RE = re.compile(
    r'<div class="card(?:\s+[^"]*)?">\s*<h2>(?:(\d+)\)\s*)?Next topics</h2>.*?</div>',
    re.DOTALL | re.IGNORECASE,
)


def os_path_relpath(from_dir: Path, to_path: Path) -> str:
    from_parts = from_dir.parts if str(from_dir) != "." else ()
    to_parts = to_path.parts
    common = 0
    for a, b in zip(from_parts, to_parts):
        if a != b:
            break
        common += 1
    ups = [".."] * (len(from_parts) - common)
    return "/".join(ups + list(to_parts[common:]))


def link(from_href: str, to_href: str) -> str:
    return os_path_relpath(Path(from_href).parent, Path(to_href))


def escape_html(s: str) -> str:
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def section_blurb(section: str) -> str:
    if not section:
        return "earlier material in the learning path"
    if " - " in section:
        return section.split(" - ", 1)[1].strip().lower()
    return section.lower()


def prereq_description(p_entry: dict) -> str:
    section = p_entry.get("section", "")
    title = p_entry.get("title", "this topic")
    if section == "Prerequisites":
        return "mathematical tool needed before quantum topics"
    if "KS2" in section or "KS3" in section or "Primary" in section:
        return f"foundational skills that support {title.lower()}"
    if "GCSE" in section:
        return f"GCSE-level background for {title.lower()}"
    if "A-Level" in section:
        return f"A-Level preparation relevant to this topic"
    if "Undergraduate" in section or "BSc" in section:
        return f"undergraduate background from {section_blurb(section)}"
    if "Postgraduate" in section or "Research" in section or "PhD" in section:
        return f"advanced background from {section_blurb(section)}"
    if "Quantum" in section:
        return "quantum learning path — study before advancing"
    if "Physics" in section:
        return f"physics background from {section_blurb(section)}"
    if "Logic" in section or "Digital" in section:
        return "digital logic pathway — review before advancing"
    return f"study before this topic — from {section_blurb(section)}"


def load_map_graphs() -> dict[str, dict]:
    graphs: dict[str, dict] = {}
    for map_id, path in MAP_GRAPH_FILES.items():
        if not path.exists():
            continue
        data = json.loads(path.read_text(encoding="utf-8"))
        nodes = {n["id"]: n for n in data.get("nodes", [])}
        deps_from: dict[str, list[str]] = {}
        reqs_to: dict[str, list[str]] = {}
        for edge in data.get("edges", []) + data.get("cross_edges", []):
            deps_from.setdefault(edge["from"], []).append(edge["to"])
            reqs_to.setdefault(edge["to"], []).append(edge["from"])
        graphs[map_id] = {
            "nodes": nodes,
            "deps_from": deps_from,
            "reqs_to": reqs_to,
        }
    return graphs


def build_map_strip_card(
    from_href: str,
    entry: dict,
    node_pages: dict,
    map_graphs: dict,
) -> str:
    by_page = node_pages.get("byPage", {})
    sections: list[str] = []

    for cat in entry.get("catalogs", []):
        if not cat.get("prereq_map"):
            continue
        cat_key = cat.get("key") or ""
        node_id = (by_page.get(cat_key) or {}).get(from_href.replace("\\", "/"))
        if not node_id:
            continue
        graph = map_graphs.get(cat_key)
        if not graph:
            continue
        node = graph["nodes"].get(node_id)
        if not node:
            continue

        map_href = link(from_href, cat["prereq_map"]) + f"?topic={node_id}"
        label = cat.get("label") or MAP_LABELS.get(cat_key, cat_key.title())
        deps = sorted(
            graph["deps_from"].get(node_id, []),
            key=lambda nid: graph["nodes"].get(nid, {}).get("title", nid),
        )
        reqs = sorted(
            graph["reqs_to"].get(node_id, []),
            key=lambda nid: graph["nodes"].get(nid, {}).get("title", nid),
        )

        unlock_items = []
        for dep_id in deps[:6]:
            dep = graph["nodes"].get(dep_id)
            if not dep:
                continue
            unlock_items.append(
                f'        <li><a href="{map_href.split("?")[0]}?topic={dep_id}">{escape_html(dep["title"])}</a></li>'
            )
        if len(deps) > 6:
            unlock_items.append(f"        <li><em>+ {len(deps) - 6} more on the map</em></li>")

        req_items = []
        for req_id in reqs[:5]:
            req = graph["nodes"].get(req_id)
            if not req:
                continue
            req_items.append(
                f'        <li><a href="{map_href.split("?")[0]}?topic={req_id}">{escape_html(req["title"])}</a></li>'
            )

        meta = f'Level: {escape_html(node.get("level", ""))}'
        if node.get("domain"):
            meta += f' · Domain: {escape_html(node["domain"])}'

        block = f"""    <div class="card {MAP_STRIP_MARKER}" data-map="{escape_html(cat_key)}">
      <h2>On the {escape_html(label)} map</h2>
      <p class="map-position__meta"><strong>{escape_html(node["title"])}</strong> — {meta}</p>
      <p><a href="{map_href}">Open this topic on the prerequisite map</a> to see upstream dependencies and study paths.</p>"""
        if req_items:
            block += f"""
      <h3>Builds on</h3>
      <ul>
{chr(10).join(req_items)}
      </ul>"""
        if unlock_items:
            block += f"""
      <h3>Unlocks</h3>
      <ul>
{chr(10).join(unlock_items)}
      </ul>"""
        elif not req_items:
            block += """
      <p class="mini"><em>Foundation topic — many advanced topics depend on this one.</em></p>"""
        block += "\n    </div>"
        sections.append(block)

    return "\n".join(sections)


def build_prereq_card(
    from_href: str, entry: dict, progression: dict, heading_number: int | None
) -> str:
    prereqs = entry.get("prereqs", [])
    catalogs = entry.get("catalogs", [])

    if heading_number:
        heading = f"<h2>{heading_number}) Pre-requisites</h2>"
    else:
        heading = "<h2>Pre-requisites</h2>"

    map_link = ""
    page_maps = json.loads(NODE_PAGES_FILE.read_text(encoding="utf-8")) if NODE_PAGES_FILE.exists() else {}
    by_page = page_maps.get("byPage", {})
    for cat in catalogs:
        if cat.get("prereq_map"):
            map_href = link(from_href, cat["prereq_map"])
            cat_key = cat.get("key") or ""
            node_id = (by_page.get(cat_key) or {}).get(from_href.replace("\\", "/"))
            if node_id:
                map_href += f"?topic={node_id}"
            map_link = (
                f'<p class="mini">See the '
                f'<a href="{map_href}">{escape_html(cat["label"])} prerequisite map</a> '
                f"for the wider dependency graph.</p>"
            )
            break

    if not prereqs:
        items = (
            "        <li><em>No formal prerequisites — this is a starting topic in its section.</em></li>"
        )
    else:
        lines = []
        for p in prereqs:
            p_entry = progression.get(p, {"title": Path(p).stem.replace("-", " ").title()})
            title = p_entry.get("title", Path(p).stem.replace("-", " ").title())
            href = link(from_href, p)
            blurb = prereq_description(p_entry)
            lines.append(
                f'        <li><a href="{href}">{escape_html(title)}</a> — {escape_html(blurb)}</li>'
            )
        items = "\n".join(lines)

    return f"""    <div class="card {PREREQ_CARD_MARKER}">
      {heading}
      <p>If you are struggling with this topic, review these subjects first.</p>
      <ul>
{items}
      </ul>
      {map_link}
    </div>
"""


def build_next_card(
    from_href: str, entry: dict, progression: dict, heading_number: int | None
) -> str:
    if heading_number:
        heading = f"<h2>{heading_number}) Next topics</h2>"
    else:
        heading = "<h2>Next topics</h2>"

    def topic_list(hrefs: list[str]) -> str:
        lines = []
        for h in hrefs:
            t = progression.get(h, {}).get("title", Path(h).stem.replace("-", " ").title())
            lines.append(f'        <li><a href="{link(from_href, h)}">{escape_html(t)}</a></li>')
        return "\n".join(lines)

    required = entry.get("next_required", [])
    parallel = entry.get("next_parallel", [])
    deeper = entry.get("next_deeper", [])

    sections = []
    if required:
        sections.append(
            f"""      <h3>Recommended next</h3>
      <p>Continue in catalog learning order.</p>
      <ul>
{topic_list(required)}
      </ul>"""
        )
    if parallel:
        sections.append(
            f"""      <h3>Parallel options</h3>
      <p>Related topics you can study alongside or instead.</p>
      <ul>
{topic_list(parallel)}
      </ul>"""
        )
    if deeper:
        sections.append(
            f"""      <h3>Go deeper</h3>
      <p>Further topics once you are comfortable with the core material.</p>
      <ul>
{topic_list(deeper)}
      </ul>"""
        )

    cat_lines = []
    seen: set[str] = set()
    for cat in entry.get("catalogs", []):
        key = cat["key"]
        if key in seen:
            continue
        seen.add(key)
        chref, clabel = CATALOG_LINKS[key]
        cat_lines.append(
            f'        <li><a href="{link(from_href, chref)}">{escape_html(clabel)}</a></li>'
        )
    cat_lines.append(
        f'        <li><a href="{link(from_href, "index.html")}">Engineering Knowledge Hub</a></li>'
    )

    body = "\n".join(sections)
    return f"""    <div class="card {NEXT_CARD_MARKER}">
      {heading}
      <p>Keep building your understanding — follow the path or explore branches.</p>
{body}
      <h3>Catalog navigation</h3>
      <ul>
{chr(10).join(cat_lines)}
      </ul>
    </div>
"""


def remove_existing_progression_cards(html: str) -> str:
    html = re.sub(
        rf'\s*<div class="card {re.escape(MAP_STRIP_MARKER)}".*?</div>\s*',
        "\n",
        html,
        flags=re.DOTALL,
    )
    # Preserve content-key — only remove progression cards
    html = re.sub(
        rf'\s*<div class="card {re.escape(PREREQ_CARD_MARKER)}">.*?</div>\s*',
        "\n",
        html,
        flags=re.DOTALL,
    )
    html = re.sub(
        rf'\s*<div class="card {re.escape(NEXT_CARD_MARKER)}">.*?</div>\s*',
        "\n",
        html,
        flags=re.DOTALL,
    )
    html = re.sub(
        r'\s*<div class="card">\s*<h2>(?:\d+\)\s*)?Pre-?requisites?</h2>.*?</div>\s*',
        "\n",
        html,
        flags=re.DOTALL | re.IGNORECASE,
    )
    html = re.sub(
        r'\s*<div class="card(?:\s+[^"]*)?">\s*<h2>(?:\d+\)\s*)?Next topics</h2>.*?</div>\s*',
        "\n",
        html,
        flags=re.DOTALL | re.IGNORECASE,
    )
    html = re.sub(
        r'\s*<div class="callout">\s*<strong>Prerequisites?:</strong>.*?</div>\s*',
        "\n",
        html,
        flags=re.DOTALL | re.IGNORECASE,
    )
    return html


def detect_heading_number(html: str) -> int | None:
    m = re.search(r"<h2>(\d+)\)\s*Quick knowledge check</h2>", html, re.I)
    if m:
        return int(m.group(1)) + 1
    match = NEXT_TOPICS_CARD_RE.search(html)
    if match and match.group(1):
        return int(match.group(1)) - 1
    return None


def insert_progression_cards(html: str, map_strip: str, prereq_card: str, next_card: str) -> str:
    if map_strip:
        body = re.search(r'(<div class="content-body">)', html)
        if body:
            insert_at = body.end()
            html = html[:insert_at] + "\n" + map_strip + "\n" + html[insert_at:]

    footer = re.search(r"(\s*<p class=\"page-footer-note\">)", html)
    if footer:
        return html[: footer.start()] + "\n" + prereq_card + "\n" + next_card + html[footer.start() :]
    return html + "\n" + prereq_card + "\n" + next_card


def patch_file(path: Path, href: str, entry: dict, progression: dict, node_pages: dict, map_graphs: dict) -> bool:
    if not path.exists():
        print(f"  MISSING {href}")
        return False
    html = path.read_text(encoding="utf-8")
    if 'class="content-page"' not in html and "content-body" not in html:
        print(f"  SKIP (no content-page) {href}")
        return False

    heading_number = detect_heading_number(html)
    html = remove_existing_progression_cards(html)

    prereq_num = heading_number
    next_num = heading_number + 1 if heading_number else None

    prereq = build_prereq_card(href, entry, progression, prereq_num)
    nxt = build_next_card(href, entry, progression, next_num)
    map_strip = build_map_strip_card(href, entry, node_pages, map_graphs)
    html = insert_progression_cards(html, map_strip, prereq, nxt)

    path.write_text(html, encoding="utf-8")
    return True


def main():
    if not PROGRESSION_FILE.exists():
        subprocess.run(
            [sys.executable, str(ROOT / "scripts" / "build-topic-progression.py")],
            check=True,
        )

    progression = json.loads(PROGRESSION_FILE.read_text(encoding="utf-8"))
    node_pages = {}
    if NODE_PAGES_FILE.exists():
        node_pages = json.loads(NODE_PAGES_FILE.read_text(encoding="utf-8"))
    map_graphs = load_map_graphs()
    updated = 0
    missing = 0
    skipped = 0
    map_strips = 0

    for href, entry in sorted(progression.items()):
        path = ROOT / href
        if patch_file(path, href, entry, progression, node_pages, map_graphs):
            updated += 1
            strip = build_map_strip_card(href, entry, node_pages, map_graphs)
            if strip.strip():
                map_strips += 1
        elif not path.exists():
            missing += 1
        else:
            skipped += 1

    print(f"Updated: {updated}, map strips: {map_strips}, missing files: {missing}, skipped: {skipped}")


if __name__ == "__main__":
    main()
