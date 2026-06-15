#!/usr/bin/env python3
"""Remove duplicate teaching cards and renumber section headings."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TARGET = ROOT / "learn" / "physics" / "a-level"

CARD_START_RE = re.compile(r'<div class="card\b', re.IGNORECASE)
DIV_TAG_RE = re.compile(r"<div\b|</div>", re.IGNORECASE)
H2_NUM_RE = re.compile(r"(<h2>)\d+\)\s*", re.IGNORECASE)
CONTENT_BODY_RE = re.compile(
    r'(<div class="content-body">)(.*?)(<p class="page-footer-note">)',
    re.DOTALL | re.IGNORECASE,
)


def find_div_end(text: str, start: int) -> int | None:
    depth = 0
    for match in DIV_TAG_RE.finditer(text, start):
        if match.group().lower().startswith("<div"):
            depth += 1
        else:
            depth -= 1
            if depth == 0:
                return match.end()
    return None


def extract_cards(body: str) -> list[str]:
    cards: list[str] = []
    pos = 0
    while True:
        match = CARD_START_RE.search(body, pos)
        if not match:
            break
        end = find_div_end(body, match.start())
        if end is None:
            break
        cards.append(body[match.start() : end])
        pos = end
    return cards


def card_fingerprint(card: str) -> str:
    normalized = H2_NUM_RE.sub(r"\1", card, count=1)
    normalized = re.sub(r"\s+", " ", normalized)
    return normalized.strip().lower()


def renumber_card(card: str, number: int) -> str:
    return H2_NUM_RE.sub(rf"\g<1>{number}) ", card, count=1)


def dedupe_cards(cards: list[str]) -> tuple[list[str], int]:
    seen: set[str] = set()
    unique: list[str] = []
    removed = 0
    for card in cards:
        fingerprint = card_fingerprint(card)
        if fingerprint in seen:
            removed += 1
            continue
        seen.add(fingerprint)
        unique.append(card)
    renumbered = [renumber_card(card, index) for index, card in enumerate(unique, start=1)]
    return renumbered, removed


def process_file(path: Path) -> int:
    text = path.read_text(encoding="utf-8")
    match = CONTENT_BODY_RE.search(text)
    if not match:
        return 0

    body_open, body_inner, footer = match.groups()
    cards = extract_cards(body_inner)
    if not cards:
        return 0

    deduped, removed = dedupe_cards(cards)
    if removed == 0:
        return 0

    first_card = CARD_START_RE.search(body_inner)
    if not first_card:
        return 0
    prefix = body_inner[: first_card.start()]
    suffix_start = first_card.start()
    for card in cards:
        suffix_start += len(card)
    suffix = body_inner[suffix_start:]

    new_cards = "\n\n      ".join(deduped)
    new_inner = f"{prefix}{new_cards}{suffix}"
    new_text = (
        text[: match.start(2)]
        + new_inner
        + text[match.end(2) :]
    )
    path.write_text(new_text, encoding="utf-8")
    return removed


def main() -> None:
    total_removed = 0
    files_changed = 0
    for path in sorted(TARGET.glob("*.html")):
        if path.name == "index.html":
            continue
        removed = process_file(path)
        if removed:
            files_changed += 1
            total_removed += removed
            print(f"{path.name}: removed {removed} duplicate card(s)")

    print(f"Updated {files_changed} files, removed {total_removed} duplicate cards total")


if __name__ == "__main__":
    main()
