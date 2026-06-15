#!/usr/bin/env python3
"""Build drill-down explorer pages for math, physics, and quantum from maps/*-topics.json."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NODE_PAGES_FILE = ROOT / "maps" / "prereq-node-pages.json"
MATH_GRAPH_FILE = ROOT / "maps" / "math-topics.json"

LIST_START = "<!-- ek-drilldown-list:start -->"
LIST_END = "<!-- ek-drilldown-list:end -->"

SUBJECTS = [
    {
        "id": "math",
        "title": "Mathematics Topic Map",
        "subject_label": "Mathematics",
        "topics_file": "maps/math-topics.json",
        "out_dir": "legacy/math-drill-down",
        "map_href": "maps/math-prereq-map.html",
        "catalog_href": "learn/mathematics/index.html",
        "pages_key": "math",
        "merge_math_cross": False,
        "default_domain": "Mathematics",
        "include_map": True,
    },
    {
        "id": "physics",
        "title": "Physics Topic Map",
        "subject_label": "Physics",
        "topics_file": "maps/physics-topics.json",
        "out_dir": "legacy/physics-drill-down",
        "map_href": "maps/physics-prereq-map.html",
        "catalog_href": "learn/physics/index.html",
        "pages_key": "physics",
        "merge_math_cross": True,
        "default_domain": "Physics",
        "include_map": True,
    },
    {
        "id": "quantum",
        "title": "Quantum Topic Map",
        "subject_label": "Quantum",
        "topics_file": "maps/quantum-topics.json",
        "out_dir": "legacy/quantum-drill-down",
        "map_href": "maps/quantum-prereq-map.html",
        "catalog_href": "learn/quantum/index.html",
        "pages_key": "quantum",
        "merge_math_cross": False,
        "default_domain": "Quantum",
        "include_map": True,
    },
    {
        "id": "digital-logic",
        "title": "Digital Logic Topic Map",
        "subject_label": "Digital Logic",
        "topics_file": "maps/digital-logic-topics.json",
        "out_dir": "legacy/digital-logic-drill-down",
        "map_href": "maps/math-prereq-map.html",
        "catalog_href": "learn/mathematics/digital-logic/index.html",
        "pages_key": "digital_logic",
        "merge_math_cross": False,
        "default_domain": "Digital Logic",
        "include_map": False,
    },
]


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


def escape_html(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def merge_physics_math_nodes(graph: dict) -> dict:
    payload = {
        "meta": dict(graph.get("meta", {})),
        "nodes": list(graph.get("nodes", [])),
        "edges": list(graph.get("edges", [])),
    }
    cross_edges = graph.get("cross_edges") or []
    if not cross_edges:
        return payload

    math_graph = load_json(MATH_GRAPH_FILE)
    math_by_id = {n["id"]: n for n in math_graph["nodes"]}
    existing = {n["id"] for n in payload["nodes"]}
    for edge in cross_edges:
        mid = edge["from"]
        if mid not in existing and mid in math_by_id:
            node = dict(math_by_id[mid])
            node["subject"] = "math"
            if not node.get("domain"):
                node["domain"] = "Mathematics"
            payload["nodes"].append(node)
            existing.add(mid)
    payload["edges"].extend(cross_edges)
    return payload


def page_label(path: str) -> str:
    stem = Path(path).stem.replace("-", " ")
    return stem[:1].upper() + stem[1:]


def build_resources(
    node: dict,
    pages_by_node: dict,
    math_pages: dict,
    from_dir: Path,
    map_href: str,
    node_subject: str | None,
    *,
    include_map: bool = True,
) -> list[dict]:
    node_id = node["id"]
    resources: list[dict] = []

    lesson = node.get("lesson")
    if lesson:
        resources.append(
            {
                "label": page_label(lesson),
                "url": os_path_relpath(from_dir, ROOT / lesson),
            }
        )

    pages = pages_by_node.get(node_id, [])
    if node_subject == "math" and not pages:
        pages = math_pages.get(node_id, [])

    for page in pages:
        resources.append(
            {
                "label": page_label(page),
                "url": os_path_relpath(from_dir, ROOT / page),
            }
        )

    if include_map and map_href:
        map_topic = node.get("map_topic", node_id)
        resources.append(
            {
                "label": "Prerequisite map",
                "url": os_path_relpath(from_dir, ROOT / map_href) + f"?topic={map_topic}",
            }
        )
    return resources


def graph_to_drilldown(spec: dict, graph: dict, pages: dict) -> dict:
    out_dir = ROOT / spec["out_dir"]
    pages_by_node = pages.get("byNode", {}).get(spec["pages_key"], {})
    math_pages = pages.get("byNode", {}).get("math", {})

    topics_by_id: dict[str, dict] = {}
    for node in graph["nodes"]:
        subject = node.get("subject", spec["id"])
        domain = node.get("domain")
        if not domain:
            domain = "Mathematics" if subject == "math" else spec["default_domain"]
        topics_by_id[node["id"]] = {
            "id": node["id"],
            "title": node["title"],
            "level": node["level"],
            "domain": domain,
            "summary": node.get("summary", ""),
            "required": [],
            "recommended": [],
            "resources": build_resources(
                node,
                pages_by_node,
                math_pages,
                out_dir,
                spec["map_href"],
                subject,
                include_map=spec.get("include_map", True),
            ),
        }

    for edge in graph.get("edges", []):
        to_id = edge["to"]
        from_id = edge["from"]
        if to_id not in topics_by_id or from_id not in topics_by_id:
            continue
        edge_type = edge.get("type", "required")
        key = "required" if edge_type == "required" else "recommended"
        topics_by_id[to_id][key].append(from_id)

    domains = sorted({t["domain"] for t in topics_by_id.values()})
    levels = graph.get("meta", {}).get("levels", [])
    topics = sorted(
        topics_by_id.values(),
        key=lambda t: (levels.index(t["level"]) if t["level"] in levels else 999, t["title"].lower()),
    )
    return {"levels": levels, "domains": domains, "topics": topics}


def build_explorer_html(spec: dict) -> str:
    rel_assets = "../../"
    catalog_link = os_path_relpath(ROOT / spec["out_dir"], ROOT / spec["catalog_href"])
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="{rel_assets}assets/css/corporate.css">
  <script src="{rel_assets}assets/js/site-layout.js" defer></script>
  <title>{escape_html(spec["title"])} | Engineering Knowledge</title>
</head>

<body class="drill-down-page">
  <header class="drill-header">
    <h1>{escape_html(spec["title"])}</h1>
    <div class="sub">Click a topic to highlight prerequisites and downstream unlocks.
      Data source: <code>maps/{spec["id"]}-topics.json</code> ·
      <a href="{catalog_link}">Subject catalogue</a> ·
      <a href="list.html">Topic list</a></div>
  </header>

  <main class="drill-main">
    <section class="panel">
      <div class="controls">
        <input id="search" type="text" placeholder="Search topics by title or summary" />
        <select id="levelFilter"></select>
        <select id="domainFilter"></select>
      </div>

      <div class="legend">
        <span class="badge"><span class="dot req"></span>Required prerequisites</span>
        <span class="badge"><span class="dot rec"></span>Recommended prerequisites</span>
        <span class="badge"><span class="dot down"></span>Downstream unlocks</span>
      </div>

      <div id="cycleWarning" class="status warning" style="display:none;"></div>
      <div id="topicList" class="topic-list"></div>
    </section>

    <section class="panel detail">
      <h2 id="detailTitle">Select a topic</h2>
      <p id="detailSummary" class="summary">A topic selection will display prerequisites and downstream topics.</p>
      <div class="status" id="detailMeta"></div>

      <div class="grid">
        <div class="box">
          <h3>Required prerequisites</h3>
          <ul id="reqTree" class="tree"></ul>
        </div>
        <div class="box">
          <h3>Recommended prerequisites</h3>
          <ul id="recTree" class="tree"></ul>
        </div>
      </div>

      <div class="grid">
        <div class="box">
          <h3>Unlocked downstream topics</h3>
          <ul id="downList" class="tree"></ul>
        </div>
        <div class="box resources">
          <h3>Resources</h3>
          <ul id="resList" class="tree"></ul>
        </div>
      </div>

      <div class="status" id="statusLine">
        Tip: edit <code>maps/{spec["id"]}-topics.json</code>, then run
        <code>python scripts/build-drilldown-explorers.py</code>.
      </div>
    </section>
  </main>

  <script src="topics-data.js"></script>
  <script src="{rel_assets}assets/js/drilldown-explorer.js"></script>
  <script>
    initDrilldownExplorer({{ buildScript: "python scripts/build-drilldown-explorers.py" }});
  </script>
</body>
</html>
"""


def build_list_html(spec: dict, drilldown: dict, pages: dict) -> str:
    out_dir = ROOT / spec["out_dir"]
    pages_by_node = pages.get("byNode", {}).get(spec["pages_key"], {})
    levels = drilldown["levels"]
    topics = drilldown["topics"]

    map_href = os_path_relpath(out_dir, ROOT / spec["map_href"])
    catalog_href = os_path_relpath(out_dir, ROOT / spec["catalog_href"])
    if spec.get("include_map", True):
        map_note = (
            f'        Each topic links to lesson pages where available and to the'
            f'        <a href="{map_href}">{spec["subject_label"].lower()} prerequisite map</a>.'
        )
    else:
        map_note = (
            f'        Each topic links to lesson pages in the'
            f'        <a href="{catalog_href}">{spec["subject_label"].lower()} catalogue</a>.'
        )

    lines = [
        LIST_START,
        '    <div class="card">',
        f'      <h2>All {escape_html(spec["subject_label"])} topics</h2>',
        '      <p class="note">',
        map_note,
        "        Use the",
        '        <a href="explorer.html">drill-down explorer</a> for interactive navigation.',
        "      </p>",
    ]

    by_level: dict[str, list[dict]] = {level: [] for level in levels}
    for topic in topics:
        level = topic.get("level", "")
        if level in by_level:
            by_level[level].append(topic)

    for level in levels:
        group = by_level[level]
        if not group:
            continue
        lines.append(f'      <h3>{escape_html(level)}</h3>')
        lines.append("      <ul>")
        for topic in group:
            node_id = topic["id"]
            map_link = os_path_relpath(out_dir, ROOT / spec["map_href"]) + f"?topic={node_id}"
            title = escape_html(topic["title"])
            lesson_pages = pages_by_node.get(node_id, [])
            lesson_href = None
            if lesson_pages:
                lesson_href = os_path_relpath(out_dir, ROOT / lesson_pages[0])
            else:
                for resource in topic.get("resources", []):
                    if resource.get("label") != "Prerequisite map":
                        lesson_href = resource["url"]
                        break
            if lesson_href:
                if spec.get("include_map", True):
                    lines.append(
                        f'        <li><a href="{lesson_href}">{title}</a> '
                        f'(<a href="{map_link}">map</a>)</li>'
                    )
                else:
                    lines.append(f'        <li><a href="{lesson_href}">{title}</a></li>')
            elif spec.get("include_map", True):
                lines.append(f'        <li><a href="{map_link}">{title}</a></li>')
            else:
                lines.append(f"        <li>{title}</li>")
        lines.append("      </ul>")

    lines.extend(["    </div>", LIST_END])
    return "\n".join(lines) + "\n"


def list_page_shell(spec: dict) -> str:
    rel_assets = "../../"
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="{rel_assets}assets/css/corporate.css">
  <script src="{rel_assets}assets/js/site-layout.js" defer></script>
  <title>{escape_html(spec["subject_label"])} Topics | Engineering Knowledge</title>
</head>

<body class="content-page">
  <div class="page-container">
    <div class="content-hero">
      <nav class="page-hero-breadcrumb" aria-label="Breadcrumb">
        <a href="{rel_assets}index.html">&larr; Back to Hub</a>
      </nav>
      <h1>{escape_html(spec["subject_label"])} Topics</h1>
      <p class="lead">Topic index with links to lessons and the prerequisite map.</p>
    </div>

    <div class="content-body">
    {LIST_START}
    {LIST_END}
    </div>
  </div>
</body>
</html>
"""


def write_topics_bundle(out_dir: Path, drilldown: dict) -> None:
    topics_json = out_dir / "topics.json"
    topics_json.write_text(json.dumps(drilldown, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    payload = json.dumps(drilldown, ensure_ascii=False, indent=2)
    (out_dir / "topics-data.js").write_text(
        "/* Auto-generated — run scripts/build-drilldown-explorers.py */\n"
        f"window.DRILLDOWN_TOPICS = {payload};\n",
        encoding="utf-8",
    )


def update_list_page(spec: dict, list_block: str) -> None:
    list_path = ROOT / spec["out_dir"] / "list.html"
    if not list_path.exists():
        list_path.parent.mkdir(parents=True, exist_ok=True)
        list_path.write_text(list_page_shell(spec), encoding="utf-8")

    html = list_path.read_text(encoding="utf-8")
    html = re.sub(
        r"\s*<!-- ek-legacy-physics-list:start -->[\s\S]*?<!-- ek-legacy-physics-list:end -->\s*",
        "\n",
        html,
    )
    if LIST_START not in html:
        html = html.replace(
            '    <div class="content-body">',
            "    <div class=\"content-body\">\n" + list_block,
        )
    else:
        html = re.sub(
            LIST_START + r"[\s\S]*?" + LIST_END,
            list_block.rstrip("\n"),
            html,
        )
    list_path.write_text(html, encoding="utf-8")


def build_subject(spec: dict, pages: dict) -> None:
    graph = load_json(ROOT / spec["topics_file"])
    if spec.get("merge_math_cross"):
        graph = merge_physics_math_nodes(graph)

    drilldown = graph_to_drilldown(spec, graph, pages)
    out_dir = ROOT / spec["out_dir"]
    out_dir.mkdir(parents=True, exist_ok=True)

    write_topics_bundle(out_dir, drilldown)
    (out_dir / "explorer.html").write_text(build_explorer_html(spec), encoding="utf-8")
    update_list_page(spec, build_list_html(spec, drilldown, pages))

    print(
        f"Wrote {spec['out_dir']}/explorer.html "
        f"({len(drilldown['topics'])} topics, {len(drilldown['domains'])} domains)"
    )


def main() -> None:
    pages = load_json(NODE_PAGES_FILE)
    for spec in SUBJECTS:
        build_subject(spec, pages)


if __name__ == "__main__":
    main()
