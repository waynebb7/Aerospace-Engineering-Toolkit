#!/usr/bin/env python3
"""Insert expandable quiz answer sections into content pages."""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ANSWERS_FILE = ROOT / "scripts" / "quiz-answers.json"

QUIZ_BLOCK_RE = re.compile(
    r"(<div class=\"quiz\">\s*<ol>.*?</ol>\s*</div>)",
    re.DOTALL,
)


def build_answers_block(answers: list[str]) -> str:
    items = []
    for ans in answers:
        # Answers are pre-formatted HTML fragments from build-quiz-answers.py
        items.append(f"          <li>{ans}</li>")
    return (
        "\n      <details class=\"quiz-answers\">\n"
        "        <summary class=\"quiz-answers__summary\">Show answers</summary>\n"
        "        <ol class=\"quiz-answers__list\">\n"
        + "\n".join(items)
        + "\n        </ol>\n"
        "      </details>"
    )


def remove_existing_answers(text: str) -> str:
    return re.sub(
        r"\s*<details class=\"quiz-answers\">.*?</details>\s*",
        "\n",
        text,
        flags=re.DOTALL,
    )


def insert_answers(text: str, answers: list[str]) -> str:
    text = remove_existing_answers(text)
    if "Quick knowledge check" not in text:
        return text
    block = build_answers_block(answers)

    def replacer(match: re.Match) -> str:
        return match.group(1) + block

    return QUIZ_BLOCK_RE.sub(replacer, text, count=1)


def patch_file(path: Path, topic: str, answers_map: dict) -> bool:
    answers = answers_map.get(topic)
    if not answers:
        return False
    text = path.read_text(encoding="utf-8")
    if 'class="content-page"' not in text or '<div class="quiz">' not in text:
        return False
    updated = insert_answers(text, answers)
    if updated == text:
        return False
    path.write_text(updated, encoding="utf-8")
    return True


def main():
    if not ANSWERS_FILE.exists():
        print(f"Missing {ANSWERS_FILE}")
        return
    answers_map = json.loads(ANSWERS_FILE.read_text(encoding="utf-8"))
    updated = 0
    skipped = 0
    for topic in sorted(answers_map):
        path = ROOT / topic
        if patch_file(path, topic, answers_map):
            updated += 1
        else:
            skipped += 1
    print(f"Updated: {updated}, skipped: {skipped}")


if __name__ == "__main__":
    main()
