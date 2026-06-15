#!/usr/bin/env python3
"""Remove orphaned catalog-nav fragment after quiz cards on A-Level physics pages."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TARGET = ROOT / "learn" / "physics" / "a-level"

ORPHAN = """l>
        <li><a href="../index.html">Physics Catalog</a></li>
        <li><a href="../../../index.html">Engineering Knowledge Hub</a></li>
      </ul>
    </div>
"""

fixed = 0
for path in sorted(TARGET.glob("*.html")):
    text = path.read_text(encoding="utf-8")
    if ORPHAN not in text:
        continue
    path.write_text(text.replace(ORPHAN, ""), encoding="utf-8")
    fixed += 1
    print(f"Fixed HTML: {path.name}")

print(f"Removed orphan fragment from {fixed} files")
