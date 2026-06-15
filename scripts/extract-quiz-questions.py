#!/usr/bin/env python3
"""Extract quiz questions from content pages into scripts/quiz-questions.json."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

QUIZ_CARD_RE = re.compile(
    r'<h2>\d*\)?\s*Quick knowledge check</h2>\s*<div class="quiz">\s*<ol>(.*?)</ol>\s*</div>',
    re.DOTALL | re.IGNORECASE,
)
LI_RE = re.compile(r"<li>(.*?)</li>", re.DOTALL | re.IGNORECASE)


def clean_question(raw: str) -> str:
    text = re.sub(r"<[^>]+>", " ", raw)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def topic_id(path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    return rel


def main():
    data = {}
    for path in sorted(ROOT.rglob("*.html")):
        if any(p.startswith(".") for p in path.parts):
            continue
        text = path.read_text(encoding="utf-8")
        if 'class="content-page"' not in text:
            continue
        m = QUIZ_CARD_RE.search(text)
        if not m:
            continue
        questions = [clean_question(q) for q in LI_RE.findall(m.group(1))]
        if questions:
            data[topic_id(path)] = questions

    out = ROOT / "scripts" / "quiz-questions.json"
    out.write_text(json.dumps(data, indent=2), encoding="utf-8")
    print(f"Extracted {len(data)} quizzes, {sum(len(v) for v in data.values())} questions -> {out}")


if __name__ == "__main__":
    main()
