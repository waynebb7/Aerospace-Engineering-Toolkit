#!/usr/bin/env python3
"""Fix digital-logic lesson breadcrumbs after catalogue consolidation."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DL = ROOT / "learn" / "mathematics" / "digital-logic"
OLD = '<a href="../index.html">&larr; Pure Math Subjects Catalog</a>'
NEW = '<a href="index.html">&larr; Digital Logic Catalogue</a>'


def decode_best(raw: bytes) -> str:
    for enc in ("utf-8", "cp1252", "latin-1"):
        try:
            return raw.decode(enc)
        except UnicodeDecodeError:
            continue
    return raw.decode("latin-1")


def main() -> None:
    for path in sorted(DL.glob("*.html")):
        if path.name == "index.html":
            continue
        text = decode_best(path.read_bytes())
        if OLD not in text:
            print(f"skip {path.name}")
            continue
        path.write_text(text.replace(OLD, NEW), encoding="utf-8")
        print(f"fixed {path.name}")


if __name__ == "__main__":
    main()
