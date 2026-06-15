#!/usr/bin/env python3
"""Audit physics teaching pages for completeness."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "learn" / "physics"


def main() -> None:
    stats = []
    for path in sorted(ROOT.rglob("*.html")):
        if path.name == "index.html":
            continue
        text = path.read_text(encoding="utf-8")
        words = len(re.findall(r"\w+", text))
        cards = len(re.findall(r'<div class="card', text))
        has_quiz = "quiz" in text.lower()
        has_prog = "progression-card" in text
        rel = "/".join(path.relative_to(ROOT).parts)
        stats.append((words, cards, has_quiz, has_prog, rel))

    stats.sort(key=lambda x: x[0])
    print(f"Total topic pages: {len(stats)}")
    print(f"Min words: {stats[0][0]} ({stats[0][4]})")
    print(f"Median words: {stats[len(stats) // 2][0]}")
    print(f"Max words: {stats[-1][0]} ({stats[-1][4]})")
    thin = [s for s in stats if s[0] < 1500]
    print(f"Pages under 1500 words: {len(thin)}")
    missing = [s for s in stats if not s[2] or not s[3]]
    print(f"Missing quiz or progression: {len(missing)}")


if __name__ == "__main__":
    main()
