#!/usr/bin/env python3
"""Remove orphaned HTML after </html> on physics stub pages."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PHYSICS = ROOT / "learn" / "physics"


def main() -> None:
    fixed = 0
    for path in PHYSICS.rglob("*.html"):
        if path.name == "index.html":
            continue
        text = path.read_text(encoding="utf-8")
        lower = text.lower()
        idx = lower.rfind("</html>")
        if idx == -1:
            continue
        end = idx + len("</html>")
        if len(text) > end and text[end:].strip():
            path.write_text(text[:end] + "\n", encoding="utf-8")
            fixed += 1
    print(f"Trimmed orphaned markup on {fixed} files")


if __name__ == "__main__":
    main()
