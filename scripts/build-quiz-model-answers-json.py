#!/usr/bin/env python3
"""Merge topic-specific model answer modules into scripts/quiz-model-answers.json."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "scripts" / "quiz-model-answers.json"

from quiz_model_answers_math import MATH_MODEL_ANSWERS  # noqa: E402
from quiz_model_answers_physics_alevel_practical import PHYSICS_ALEVEL_PRACTICAL_MODEL_ANSWERS  # noqa: E402
from quiz_model_answers_physics_research import (  # noqa: E402
    PHYSICS_ALEVEL_MODEL_ANSWERS,
    PHYSICS_RESEARCH_Q1,
    build_research_answers,
)
from quiz_model_answers_quantum import QUANTUM_MODEL_ANSWERS  # noqa: E402

RESEARCH_TOPICS = sorted(PHYSICS_RESEARCH_Q1)


def main() -> None:
    merged: dict[str, list[str]] = {}
    merged.update(MATH_MODEL_ANSWERS)
    merged.update(QUANTUM_MODEL_ANSWERS)
    merged.update(PHYSICS_ALEVEL_PRACTICAL_MODEL_ANSWERS)
    merged.update(PHYSICS_ALEVEL_MODEL_ANSWERS)
    for topic in RESEARCH_TOPICS:
        merged[topic] = build_research_answers(topic)

    questions = json.loads((ROOT / "scripts" / "quiz-questions.json").read_text(encoding="utf-8"))
    for topic, answers in merged.items():
        if topic not in questions:
            raise SystemExit(f"Unknown topic in model answers: {topic}")
        if len(answers) != len(questions[topic]):
            raise SystemExit(
                f"Answer count mismatch for {topic}: {len(answers)} answers, {len(questions[topic])} questions"
            )

    OUT.write_text(json.dumps(merged, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {len(merged)} topic answer sets to {OUT}")


if __name__ == "__main__":
    main()
