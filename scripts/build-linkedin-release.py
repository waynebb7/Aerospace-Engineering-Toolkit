#!/usr/bin/env python3
"""Build the focused, self-contained LinkedIn edition of the toolkit."""

from __future__ import annotations

import shutil
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parent.parent
DIST_ROOT = ROOT / "dist"
OUTPUT = DIST_ROOT / "aerospace-engineering-toolkit-linkedin"

CATEGORY_DIRS = (
    "power",
    "ac-circuits",
    "aerospace-electrical-design",
    "converters",
    "logic",
)

PRACTICAL_PAGES = (
    "aircraft-bus-load.html",
    "cable-voltage-drop.html",
    "db-converter.html",
    "fuel-energy.html",
    "generator-efficiency.html",
    "inverter-efficiency.html",
    "motor-current.html",
    "resistor-color-code.html",
    "transformer-ratio.html",
)

PWA_DOCUMENTS = (
    ("sae-arp4404c-aircraft-electrical-installations.pdf", "SAE ARP4404C — Aircraft Electrical Installations"),
    ("as50881h-wiring-aerospace-vehicle.pdf", "AS50881H — Wiring Aerospace Vehicle"),
)

LANDING_PAGE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Focused aerospace and electrical engineering calculators for power, AC circuits, aircraft electrical design, unit conversion, practical EE, and digital logic.">
  <title>Aerospace Engineering Toolkit — LinkedIn Edition</title>
  <link rel="stylesheet" href="assets/css/corporate.css">
  <script src="assets/js/site-layout.js" defer></script>
</head>
<body>
  <section class="page-hero">
    <img class="page-hero__logo" src="assets/images/aerospace-engineering-toolkit-logo.png" width="601" height="150" alt="Aerospace Engineering Toolkit">
    <p class="lead">A focused collection of practical aerospace and electrical engineering calculators.</p>
  </section>
  <div class="page-container">
    <div class="card-grid">
      <article class="card"><h2 class="card__title">Power Calculators</h2><p class="card__desc">DC, AC, three-phase, power factor, power triangle, reactive power, and efficiency calculations.</p><p><a class="btn" href="calculators/power/index.html">Open power calculators</a></p></article>
      <article class="card"><h2 class="card__title">AC Circuits</h2><p class="card__desc">Ohm's law, impedance, reactance, and star/delta relationships.</p><p><a class="btn" href="calculators/ac-circuits/index.html">Open AC circuit tools</a></p></article>
      <article class="card"><h2 class="card__title">Aerospace Electrical Design</h2><p class="card__desc">Power wire analysis, TRU sizing, battery endurance, bus loads, and aircraft power conversion.</p><p><a class="btn" href="calculators/aerospace-electrical-design/index.html">Open aerospace tools</a></p></article>
      <article class="card"><h2 class="card__title">Unit Converters</h2><p class="card__desc">Electrical, energy, frequency, angular, and number-system conversions.</p><p><a class="btn" href="calculators/converters/index.html">Open unit converters</a></p></article>
      <article class="card"><h2 class="card__title">Practical EE</h2><p class="card__desc">Cable voltage drop, motors, transformers, components, signal levels, and conversion efficiency.</p><p><a class="btn" href="calculators/practical/index.html">Open practical EE tools</a></p></article>
      <article class="card"><h2 class="card__title">Digital Logic Tools</h2><p class="card__desc">Truth tables, binary/decimal/hex conversion, and two's-complement conversion.</p><p><a class="btn" href="calculators/logic/index.html">Open digital logic tools</a></p></article>
    </div>
  </div>
</body>
</html>
"""

CATEGORY_LABELS = {
    "power": "Power Calculators",
    "ac-circuits": "AC Circuit Calculators",
    "converters": "Unit Converters",
    "logic": "Digital Logic Tools",
    "practical": "Practical EE Tools",
}


def title_for(filename: str) -> str:
    names = {
        "ac-single-phase": "AC Power (Single Phase)",
        "binary-decimal-hex": "Binary / Decimal / Hex Converter",
        "db-converter": "dB / dBm Converter",
        "dc-power": "DC Power Calculator",
        "ohms-law": "Ohm's Law",
        "tru-efficiency": "TRU Efficiency",
        "twos-complement": "Two's Complement Converter",
    }
    stem = Path(filename).stem
    return names.get(stem, stem.replace("-", " ").title())


def category_index(category: str, pages: list[str]) -> str:
    items = "\n".join(
        f'          <li><a href="{page}">{title_for(page)}</a></li>' for page in pages
    )
    label = CATEGORY_LABELS[category]
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{label} | Aerospace Engineering Toolkit</title>
  <link rel="stylesheet" href="../../assets/css/corporate.css">
  <script src="../../assets/js/site-layout.js" defer></script>
</head>
<body>
  <section class="page-hero"><h1>{label}</h1></section>
  <div class="page-container">
    <p class="content-nav"><a href="../../index.html">&larr; LinkedIn edition home</a></p>
    <article class="card"><ul class="link-list">
{items}
    </ul></article>
  </div>
</body>
</html>
"""


def focus_site_layout() -> None:
    path = OUTPUT / "assets/js/site-layout.js"
    text = path.read_text(encoding="utf-8")
    start = text.index("  var navItems = [")
    end = text.index("  ];", start) + len("  ];")
    nav = """  var navItems = [
    { href: 'index.html', label: 'Home' },
    { href: 'calculators/power/index.html', label: 'Power' },
    { href: 'calculators/ac-circuits/index.html', label: 'AC Circuits' },
    { href: 'calculators/aerospace-electrical-design/index.html', label: 'Aerospace' },
    { href: 'calculators/converters/index.html', label: 'Converters' },
    { href: 'calculators/practical/index.html', label: 'Practical EE' },
    { href: 'calculators/logic/index.html', label: 'Digital Logic' }
  ];"""
    text = text[:start] + nav + text[end:]
    text = text.replace(
        "var siteName = 'Aerospace Engineering Toolkit';",
        "var siteName = 'Aerospace Engineering Toolkit — LinkedIn Edition';",
    )
    # Feedback is not part of this focused release.
    text = text.replace(
        "  var footerLinks =\n    '<a href=\"' + base + 'feedback.html\">Feedback</a> &middot; ';\n  if (file !== 'feedback.html') {\n    footerLinks += '<a href=\"' + feedbackReportHref() + '\">Report this page</a> &middot; ';\n  }\n  footerLinks += 'MIT License';",
        "  var footerLinks = 'Focused LinkedIn Edition &middot; MIT License';",
    )
    path.write_text(text, encoding="utf-8")


def supporting_documents_index() -> str:
    items = "\n".join(
        f'        <li><a href="files/{filename}">{label}</a></li>'
        for filename, label in PWA_DOCUMENTS
    )
    return f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Power Wire Analysis References | Aerospace Engineering Toolkit</title>
<link rel="stylesheet" href="../../assets/css/corporate.css"><script src="../../assets/js/site-layout.js" defer></script></head>
<body><section class="page-hero"><h1>Power Wire Analysis References</h1><p class="lead">Standards used by the aerospace electrical design tools.</p></section>
<div class="page-container"><p class="content-nav"><a href="../../calculators/aerospace-electrical-design/index.html">&larr; Aerospace electrical design</a></p>
<article class="card"><ul class="link-list">{items}</ul></article></div></body></html>"""


class LinkCollector(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.references: list[str] = []

    def handle_starttag(self, _tag: str, attrs: list[tuple[str, str | None]]) -> None:
        for name, value in attrs:
            if name in {"href", "src"} and value:
                self.references.append(value)


def validate_links() -> None:
    missing: list[str] = []
    output_root = OUTPUT.resolve()
    for page in OUTPUT.rglob("*.html"):
        parser = LinkCollector()
        parser.feed(page.read_text(encoding="utf-8"))
        for reference in parser.references:
            parsed = urlsplit(reference)
            if parsed.scheme or parsed.netloc or not parsed.path:
                continue
            target = (page.parent / parsed.path).resolve()
            if output_root not in target.parents and target != output_root:
                missing.append(f"{page.relative_to(OUTPUT)}: escapes release: {reference}")
            elif not target.exists():
                missing.append(f"{page.relative_to(OUTPUT)}: missing: {reference}")
    if missing:
        raise RuntimeError("Packaged link check failed:\n" + "\n".join(missing))


def build() -> Path:
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    OUTPUT.mkdir(parents=True)

    shutil.copytree(ROOT / "assets", OUTPUT / "assets")
    (OUTPUT / "calculators").mkdir()

    for category in CATEGORY_DIRS:
        source = ROOT / "calculators" / category
        target = OUTPUT / "calculators" / category
        shutil.copytree(source, target)
        if category != "aerospace-electrical-design":
            pages = sorted(p.name for p in target.glob("*.html") if p.name != "index.html")
            (target / "index.html").write_text(category_index(category, pages), encoding="utf-8")
        else:
            overview = target / "index.html"
            overview.write_text(
                overview.read_text(encoding="utf-8").replace(
                    'href="../index.html"', 'href="../../index.html"'
                ),
                encoding="utf-8",
            )

    practical = OUTPUT / "calculators" / "practical"
    practical.mkdir()
    for filename in PRACTICAL_PAGES:
        shutil.copy2(ROOT / "calculators" / "practical" / filename, practical / filename)
    (practical / "index.html").write_text(
        category_index("practical", sorted(PRACTICAL_PAGES)), encoding="utf-8"
    )

    # Only the source data and two standards used directly by Power Wire Analysis.
    shutil.copytree(ROOT / "reference" / "wire-data", OUTPUT / "reference" / "wire-data")
    documents = OUTPUT / "reference" / "documents"
    files = documents / "files"
    files.mkdir(parents=True)
    for filename, _label in PWA_DOCUMENTS:
        shutil.copy2(ROOT / "reference" / "documents" / "files" / filename, files / filename)
    (documents / "index.html").write_text(supporting_documents_index(), encoding="utf-8")

    (OUTPUT / "index.html").write_text(LANDING_PAGE, encoding="utf-8")
    (OUTPUT / ".nojekyll").write_text("", encoding="utf-8")
    shutil.copy2(ROOT / "LICENSE", OUTPUT / "LICENSE")
    focus_site_layout()
    validate_links()

    archive = shutil.make_archive(str(OUTPUT), "zip", root_dir=OUTPUT)
    return Path(archive)


if __name__ == "__main__":
    archive = build()
    print(f"Built {OUTPUT.relative_to(ROOT)}")
    print(f"Created {archive.relative_to(ROOT)}")
