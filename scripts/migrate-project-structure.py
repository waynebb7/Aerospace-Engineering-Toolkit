#!/usr/bin/env python3
"""Reorganize Engineering Knowledge Hub into industry-standard folder layout."""
from __future__ import annotations

import json
import re
import shutil
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parent.parent

# --- Calculator destinations (filename at root -> path under calculators/) ---
CALCULATORS: dict[str, str] = {
    "dc_power_calculator.html": "calculators/power/dc-power.html",
    "ac_power_calculator.html": "calculators/power/ac-single-phase.html",
    "three_phase_power_calculator.html": "calculators/power/three-phase.html",
    "star_three_phase_power.html": "calculators/power/star-three-phase.html",
    "delta_three_phase_power.html": "calculators/power/delta-three-phase.html",
    "delta_phase_three_phase_power.html": "calculators/power/delta-phase-three-phase.html",
    "star_phase_three_phase_power.html": "calculators/power/star-phase-three-phase.html",
    "power_factor_calculator.html": "calculators/power/power-factor.html",
    "power_triangle_converter.html": "calculators/power/power-triangle.html",
    "reactive_power_calculator.html": "calculators/power/reactive-power.html",
    "apparent_power_calculator.html": "calculators/power/apparent-power.html",
    "tru_efficiency_calculator.html": "calculators/power/tru-efficiency.html",
    "energy_cost_calculator.html": "calculators/power/energy-cost.html",
    "power_ohms_law_calculator.html": "calculators/power/power-ohms-law.html",
    "ohms_law_calculator.html": "calculators/ac-circuits/ohms-law.html",
    "impedance_calculator.html": "calculators/ac-circuits/impedance.html",
    "inductive_reactance_calculator.html": "calculators/ac-circuits/inductive-reactance.html",
    "capacitive_reactance_calculator.html": "calculators/ac-circuits/capacitive-reactance.html",
    "star_voltage_calculator.html": "calculators/ac-circuits/star-voltage.html",
    "delta_current_calculator.html": "calculators/ac-circuits/delta-current.html",
    "motor_current_calculator.html": "calculators/practical/motor-current.html",
    "cable_voltage_drop_calculator.html": "calculators/practical/cable-voltage-drop.html",
    "transformer_ratio_calculator.html": "calculators/practical/transformer-ratio.html",
    "resistor_color_code_calculator.html": "calculators/practical/resistor-color-code.html",
    "db_converter.html": "calculators/practical/db-converter.html",
    "force_calculator.html": "calculators/practical/force.html",
    "kinetic_energy_calculator.html": "calculators/practical/kinetic-energy.html",
    "aircraft_bus_load_calculator.html": "calculators/practical/aircraft-bus-load.html",
    "generator_efficiency_calculator.html": "calculators/practical/generator-efficiency.html",
    "inverter_efficiency_calculator.html": "calculators/practical/inverter-efficiency.html",
    "fuel_energy_calculator.html": "calculators/practical/fuel-energy.html",
    "unit_converter_power.html": "calculators/converters/unit-power.html",
    "unit_converter_voltage.html": "calculators/converters/unit-voltage.html",
    "unit_converter_current.html": "calculators/converters/unit-current.html",
    "unit_converter_frequency.html": "calculators/converters/unit-frequency.html",
    "unit_converter_resistance.html": "calculators/converters/unit-resistance.html",
    "unit_converter_energy.html": "calculators/converters/unit-energy.html",
    "degrees_to_radians.html": "calculators/converters/degrees-to-radians.html",
    "radians_to_degrees.html": "calculators/converters/radians-to-degrees.html",
    "binary_decimal_hex_converter.html": "calculators/converters/binary-decimal-hex.html",
    "twos_complement_converter.html": "calculators/converters/twos-complement.html",
    "logic_truth_table.html": "calculators/logic/truth-table.html",
    "to_do_list.html": "calculators/tools/to-do-list.html",
}

MATH_SECTION_SLUGS = {
    "Basic Math - Primary/KS2 to KS3": "ks2-ks3",
    "Basic Math - GCSE level": "gcse",
    "Advanced Math - A-Level (Maths & Further Maths)": "a-level",
    "Advanced Math - Undergraduate (Engineering or Mathematics degree)": "undergraduate",
    "Serious Math - Postgraduate / Research-Level (Masters/PhD)": "postgraduate",
    "Genius Level Math - Advanced Research / Open Problems": "research",
    "AI Only - Speculative or Non-standard": "speculative",
}

PHYSICS_SECTION_SLUGS = {
    "Basic Physics - Primary/KS2 to KS3": "ks2-ks3",
    "Core Physics - GCSE Level": "gcse",
    "Advanced Physics - A-Level": "a-level",
    "Undergraduate Physics - Core (BSc Level)": "undergraduate",
    "Serious Physics - Postgraduate / Research-Level (MSc/PhD)": "postgraduate",
    "Frontier Physics - Highly Advanced / Active Research": "frontier",
    "Applied Physics and Engineering Interfaces": "applied",
    "Speculative / Non-standard (Labelled Explicitly)": "speculative",
}

LINK_RE = re.compile(r'<li>\s*<a\s+href="([^"]+\.html)">', re.I)
SECTION_RE = re.compile(r"<section>(.*?)</section>", re.S | re.I)
H2_RE = re.compile(r"<h2>(.*?)</h2>", re.S | re.I)
ATTR_RE = re.compile(r"""(?:href|src)=["']([^"']+)["']""", re.I)

SKIP_DIRS = {".git", ".github", "node_modules", "docs", "scripts", "assets", "legacy"}
REDIRECT_MARKER = "<!-- ek-redirect-stub -->"


def norm(path: str) -> str:
    return path.replace("\\", "/").lstrip("./")


def parse_catalog_sections(catalog: Path, slug_map: dict[str, str], prefix: str) -> dict[str, str]:
    text = catalog.read_text(encoding="utf-8")
    out: dict[str, str] = {}
    for block in SECTION_RE.findall(text):
        h2 = H2_RE.search(block)
        if not h2:
            continue
        title = re.sub(r"<[^>]+>", "", h2.group(1)).strip()
        if title == "Logic & Digital Mathematics":
            slug = "digital-logic"
        elif title not in slug_map and title != "Prerequisites":
            continue
        else:
            slug = slug_map.get(title, "topics")
        for href in LINK_RE.findall(block):
            href = norm(href)
            if href.startswith("logic_and_digital_math/"):
                fname = Path(href).name
                out[href] = f"{prefix}/digital-logic/{fname}"
            elif href.startswith("basic_physics/"):
                fname = Path(href).name
                out[href] = f"{prefix}/ks2-ks3/{fname}"
            elif href.startswith("quantum/"):
                fname = Path(href).name
                out[href] = f"learn/quantum/topics/{fname}"
            elif "/" not in href:
                out[href] = f"{prefix}/{slug}/{href}"
    return out


def parse_quantum_catalog(catalog: Path) -> dict[str, str]:
    text = catalog.read_text(encoding="utf-8")
    out: dict[str, str] = {}
    for block in SECTION_RE.findall(text):
        for href in LINK_RE.findall(block):
            href = norm(href)
            if href.startswith("quantum/"):
                out[href] = f"learn/quantum/topics/{Path(href).name}"
            elif "/" not in href:
                # cross-catalog physics/math links handled by other maps
                if href.startswith("quantum-"):
                    out[href] = f"learn/physics/a-level/{href}"
                else:
                    out[href] = f"learn/mathematics/a-level/{href}"
    return out


def build_relocation_map() -> dict[str, str]:
    moves: dict[str, str] = {}

    # Assets (directory move handled separately)
    for f in (ROOT / "css").glob("*"):
        if f.is_file():
            moves[f"css/{f.name}"] = f"assets/css/{f.name}"
    for f in (ROOT / "js").glob("*"):
        if f.is_file():
            moves[f"js/{f.name}"] = f"assets/js/{f.name}"

    # Reference
    moves["electrical_engineering_variables.html"] = "reference/electrical/variables.html"
    moves["electrical_equations.html"] = "reference/electrical/equations.html"
    moves["communication-equipment-manufacturers.html"] = "reference/industry/equipment-manufacturers.html"

    # Catalogs
    moves["pure_math_subjects.html"] = "learn/mathematics/index.html"
    moves["physics_subjects.html"] = "learn/physics/index.html"
    moves["quantum_subjects.html"] = "learn/quantum/index.html"

    # Maps
    moves["math/math-prereq-map.html"] = "maps/math-prereq-map.html"
    moves["math/math-topics.json"] = "maps/math-topics.json"
    moves["physics_subjects_drill_down/physics-prereq-map.html"] = "maps/physics-prereq-map.html"
    moves["physics_subjects_drill_down/physics_subjects_drill_down.html"] = "legacy/physics-drill-down/explorer.html"
    moves["physics_subjects_drill_down/physics_subjects_drill_down_list.html"] = "legacy/physics-drill-down/list.html"
    moves["physics_subjects_drill_down/topics.json"] = "legacy/physics-drill-down/topics.json"

    moves["tree.html"] = "meta/tree.html"

    # Calculators
    moves.update(CALCULATORS)

    # Catalog-driven learn paths
    moves.update(parse_catalog_sections(ROOT / "pure_math_subjects.html", MATH_SECTION_SLUGS, "learn/mathematics"))
    moves.update(parse_catalog_sections(ROOT / "physics_subjects.html", PHYSICS_SECTION_SLUGS, "learn/physics"))
    moves.update(parse_quantum_catalog(ROOT / "quantum_subjects.html"))

    # logic_and_digital_math bulk
    for f in (ROOT / "logic_and_digital_math").glob("*.html"):
        rel = f"logic_and_digital_math/{f.name}"
        if rel not in moves:
            moves[rel] = f"learn/mathematics/digital-logic/{f.name}"

    # basic_physics bulk
    for f in (ROOT / "basic_physics").glob("*.html"):
        rel = f"basic_physics/{f.name}"
        if rel not in moves:
            moves[rel] = f"learn/physics/ks2-ks3/{f.name}"

    # quantum folder bulk
    for f in (ROOT / "quantum").glob("*.html"):
        rel = f"quantum/{f.name}"
        if rel not in moves:
            moves[rel] = f"learn/quantum/topics/{f.name}"

    return moves


def find_unmapped_root_html(moves: dict[str, str]) -> list[str]:
    keep = {"index.html", "progress.html", "feedback.html"}
    unmapped = []
    for f in ROOT.glob("*.html"):
        if f.name in keep:
            continue
        if f.name not in moves:
            unmapped.append(f.name)
    return sorted(unmapped)


def relpath_link(from_file: Path, to_path: str) -> str:
    target = ROOT / to_path
    rel = Path(os_relpath(from_file.parent, target)).as_posix()
    return rel


def os_relpath(from_dir: Path, to_file: Path) -> str:
    from_parts = from_dir.parts
    to_parts = to_file.parts
    common = 0
    for a, b in zip(from_parts, to_parts):
        if a != b:
            break
        common += 1
    ups = [".."] * (len(from_parts) - common)
    return "/".join(ups + list(to_parts[common:]))


def resolve_ref(ref: str, source: Path) -> str | None:
    ref = unquote(ref.split("?")[0].split("#")[0].strip())
    if not ref or ref.startswith(("#", "http://", "https://", "mailto:", "data:", "//")):
        return None
    if ref.startswith("/"):
        return ref.lstrip("/")
    return norm((source.parent / ref).relative_to(ROOT).as_posix())


def rewrite_file(path: Path, moves: dict[str, str]) -> None:
    if path.suffix.lower() not in {".html", ".js", ".json", ".css", ".md", ".py"}:
        return
    try:
        text = path.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError):
        return
    if REDIRECT_MARKER in text and path.suffix == ".html":
        return

    def replace_attr(match: re.Match) -> str:
        attr = match.group(0)
        ref = match.group(1)
        resolved = resolve_ref(ref, path)
        if not resolved:
            # css/js legacy paths
            if ref in ("css/", "js/") or ref.startswith("css/") or ref.startswith("js/"):
                pass
            else:
                return attr
        key = resolved or norm(ref)
        # map css/ corporate.css etc.
        if key.startswith("css/"):
            key = "css/" + key.split("css/", 1)[-1]
            if key in moves:
                new = relpath_link(path, moves[key])
                return attr.replace(ref, new)
        if key.startswith("js/"):
            if key in moves:
                new = relpath_link(path, moves[key])
                return attr.replace(ref, new)
        if key in moves:
            new = relpath_link(path, moves[key])
            return attr.replace(ref, new)
        # partial filename match at end
        for old, new in sorted(moves.items(), key=lambda x: -len(x[0])):
            if key == old or key.endswith("/" + old):
                target = relpath_link(path, new)
                return attr.replace(ref, target)
        return attr

    new_text = ATTR_RE.sub(replace_attr, text)

    # bulk legacy replacements
    new_text = new_text.replace('href="css/', 'href="ASSETS_CSS_PLACEHOLDER')
    new_text = new_text.replace("href='css/", "href='ASSETS_CSS_PLACEHOLDER")
    new_text = new_text.replace('src="js/', 'src="ASSETS_JS_PLACEHOLDER')
    new_text = new_text.replace("src='js/", "src='ASSETS_JS_PLACEHOLDER")

    def assets_css(m):
        return f'href="{relpath_link(path, "assets/css/corporate.css").rsplit("/", 1)[0]}/'

    # Fix asset folder references
    if "ASSETS_CSS_PLACEHOLDER" in new_text:
        css_base = relpath_link(path, "assets/css/corporate.css")
        css_dir = css_base.rsplit("/", 1)[0] + "/" if "/" in css_base else ""
        new_text = new_text.replace("ASSETS_CSS_PLACEHOLDER", css_dir)
    if "ASSETS_JS_PLACEHOLDER" in new_text:
        js_base = relpath_link(path, "assets/js/site-layout.js")
        js_dir = js_base.rsplit("/", 1)[0] + "/" if "/" in js_base else ""
        new_text = new_text.replace("ASSETS_JS_PLACEHOLDER", js_dir)

    # Direct css/ and js/ in head
    for old_prefix, new_target in [("css/", "assets/css/corporate.css"), ("js/", "assets/js/site-layout.js")]:
        if f'{old_prefix}' in new_text:
            base = relpath_link(path, new_target)
            base_dir = base.rsplit("/", 1)[0] + "/" if "/" in base else ""
            new_text = re.sub(
                rf'((?:href|src)=["\']){re.escape(old_prefix)}',
                rf"\1{base_dir}",
                new_text,
            )

    if new_text != text:
        path.write_text(new_text, encoding="utf-8")


def redirect_html(target: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="0; url={target}" />
  <link rel="canonical" href="{target}" />
  <title>Page moved</title>
  {REDIRECT_MARKER}
</head>
<body>
  <p>This page has moved to <a href="{target}">{target}</a>.</p>
</body>
</html>
"""


def move_files(moves: dict[str, str]) -> None:
    # Move css and js dirs wholesale first
    if (ROOT / "css").exists():
        (ROOT / "assets" / "css").mkdir(parents=True, exist_ok=True)
        for f in (ROOT / "css").iterdir():
            if f.is_file():
                shutil.move(str(f), str(ROOT / "assets" / "css" / f.name))
        (ROOT / "css").rmdir()
    if (ROOT / "js").exists():
        (ROOT / "assets" / "js").mkdir(parents=True, exist_ok=True)
        for f in (ROOT / "js").iterdir():
            if f.is_file():
                shutil.move(str(f), str(ROOT / "assets" / "js" / f.name))
        (ROOT / "js").rmdir()

    for old, new in sorted(moves.items(), key=lambda x: x[0].count("/"), reverse=True):
        if old.startswith("css/") or old.startswith("js/"):
            continue
        src = ROOT / old
        dst = ROOT / new
        if not src.exists():
            continue
        dst.parent.mkdir(parents=True, exist_ok=True)
        if dst.exists():
            continue
        shutil.move(str(src), str(dst))


def create_redirects(moves: dict[str, str]) -> None:
    for old, new in moves.items():
        if old.startswith(("css/", "js/")):
            continue
        stub = ROOT / old
        if stub.exists():
            continue
        target = relpath_link(stub, new)
        stub.parent.mkdir(parents=True, exist_ok=True)
        stub.write_text(redirect_html(target), encoding="utf-8")


def create_hub_pages(moves: dict[str, str]) -> None:
    learn_index = ROOT / "learn" / "index.html"
    learn_index.parent.mkdir(parents=True, exist_ok=True)
    learn_index.write_text(
        """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="../assets/css/corporate.css">
  <script src="../assets/js/site-layout.js" defer></script>
  <title>Learn — Engineering Knowledge</title>
</head>
<body>
  <section class="page-hero">
    <h1>Learn</h1>
    <p class="lead">Structured learning paths in mathematics, physics, and quantum computing.</p>
  </section>
  <div class="page-container">
    <div class="card-grid">
      <article class="card">
        <h2 class="card__title">Mathematics</h2>
        <p class="card__desc">From KS2 foundations through postgraduate research topics.</p>
        <ul class="link-list">
          <li><a href="mathematics/index.html">Subject catalog</a></li>
          <li><a href="../maps/math-prereq-map.html">Prerequisite map</a></li>
          <li><a href="mathematics/digital-logic/boolean-algebra.html">Digital logic</a></li>
        </ul>
      </article>
      <article class="card">
        <h2 class="card__title">Physics</h2>
        <p class="card__desc">Classical mechanics through frontier and applied physics.</p>
        <ul class="link-list">
          <li><a href="physics/index.html">Subject catalog</a></li>
          <li><a href="../maps/physics-prereq-map.html">Prerequisite map</a></li>
          <li><a href="../legacy/physics-drill-down/explorer.html">Drill-down explorer</a></li>
        </ul>
      </article>
      <article class="card">
        <h2 class="card__title">Quantum</h2>
        <p class="card__desc">Quantum foundations, information, algorithms, and hardware.</p>
        <ul class="link-list">
          <li><a href="quantum/index.html">Subject catalog</a></li>
          <li><a href="quantum/topics/qubits-and-bloch-sphere.html">Qubits &amp; Bloch sphere</a></li>
          <li><a href="quantum/topics/quantum-gates.html">Quantum gates</a></li>
        </ul>
      </article>
    </div>
  </div>
</body>
</html>
""",
        encoding="utf-8",
    )

    calc_sections = [
        ("Power", "calculators/power"),
        ("AC circuits", "calculators/ac-circuits"),
        ("Practical EE", "calculators/practical"),
        ("Unit converters", "calculators/converters"),
        ("Digital logic tools", "calculators/logic"),
        ("Utilities", "calculators/tools"),
    ]
    calc_links: dict[str, list[tuple[str, str]]] = {s[0]: [] for s in calc_sections}
    folder_labels = {
        "calculators/power": "Power",
        "calculators/ac-circuits": "AC circuits",
        "calculators/practical": "Practical EE",
        "calculators/converters": "Unit converters",
        "calculators/logic": "Digital logic tools",
        "calculators/tools": "Utilities",
    }
    for _old, new in sorted(moves.items()):
        if not new.startswith("calculators/"):
            continue
        parts = new.split("/")
        if len(parts) < 3:
            continue
        folder = "/".join(parts[:2])
        label = folder_labels.get(folder)
        if not label:
            continue
        title = Path(new).stem.replace("-", " ").title()
        calc_links[label].append((new, title))

    cards = []
    for label, _ in calc_sections:
        items = calc_links.get(label) or []
        if not items:
            continue
        lis = "\n".join(
            f'          <li><a href="../{href}">{title}</a></li>'
            for href, title in items
        )
        cards.append(
            f"""      <article class="card">
        <h2 class="card__title">{label}</h2>
        <ul class="link-list">
{lis}
        </ul>
      </article>"""
        )

    calc_index = ROOT / "calculators" / "index.html"
    calc_index.parent.mkdir(parents=True, exist_ok=True)
    calc_index.write_text(
        f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="../assets/css/corporate.css">
  <script src="../assets/js/site-layout.js" defer></script>
  <title>Calculators — Engineering Knowledge</title>
</head>
<body>
  <section class="page-hero">
    <h1>Calculators</h1>
    <p class="lead">Interactive engineering calculators and unit converters.</p>
  </section>
  <div class="page-container">
    <div class="card-grid">
{chr(10).join(cards)}
    </div>
  </div>
</body>
</html>
""",
        encoding="utf-8",
    )


def remove_empty_dirs() -> None:
    for d in ["logic_and_digital_math", "basic_physics", "quantum", "math", "physics_subjects_drill_down", "css", "js"]:
        p = ROOT / d
        if p.exists() and p.is_dir():
            try:
                shutil.rmtree(p)
            except OSError:
                pass


def main() -> None:
    moves = build_relocation_map()
    unmapped = find_unmapped_root_html(moves)
    if unmapped:
        print("WARNING: unmapped root HTML (left in place):")
        for name in unmapped:
            print(f"  - {name}")

    map_file = ROOT / "scripts" / "path-relocation-map.json"
    map_file.write_text(json.dumps(moves, indent=2), encoding="utf-8")
    print(f"Relocation map: {len(moves)} entries")

    move_files(moves)

    # Rewrite all content files
    for path in ROOT.rglob("*"):
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if path.is_file():
            rewrite_file(path, moves)

    create_redirects(moves)
    create_hub_pages(moves)
    remove_empty_dirs()
    print("Migration complete. Run link check and regenerate topic-catalog.")


if __name__ == "__main__":
    main()
