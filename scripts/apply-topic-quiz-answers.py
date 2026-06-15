#!/usr/bin/env python3
"""Replace generic A-Level practical-template quiz answers with topic-specific model answers."""
from __future__ import annotations

import re
from pathlib import Path

from quiz_model_answers_physics_alevel_practical import PHYSICS_ALEVEL_PRACTICAL_MODEL_ANSWERS

ROOT = Path(__file__).resolve().parent.parent
TARGET = ROOT / "learn" / "physics" / "a-level"

QUIZ_MARKER = "State the main model condition used in this topic"
ANSWERS_BLOCK_RE = re.compile(
    r"(<ol class=\"quiz-answers__list\">)(.*?)(</ol>)",
    re.DOTALL,
)


def build_answers_block(answers: list[str]) -> str:
    items = "\n".join(f"          <li>{a}</li>" for a in answers)
    return f"          <ol class=\"quiz-answers__list\">\n{items}\n          </ol>"


def topic_path(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def process_file(path: Path) -> bool:
    rel = topic_path(path)
    answers = PHYSICS_ALEVEL_PRACTICAL_MODEL_ANSWERS.get(rel)
    if not answers:
        return False
    text = path.read_text(encoding="utf-8")
    if QUIZ_MARKER not in text:
        return False
    match = ANSWERS_BLOCK_RE.search(text)
    if not match:
        return False
    replacement = build_answers_block(answers)
    new_text = text[: match.start()] + replacement + text[match.end() :]
    if new_text == text:
        return False
    path.write_text(new_text, encoding="utf-8")
    return True


def main() -> None:
    updated = 0
    for path in sorted(TARGET.glob("*.html")):
        if process_file(path):
            updated += 1
            print(f"Updated {path.name}")
    print(f"Topic quiz answers updated on {updated} files")


if __name__ == "__main__":
    main()
