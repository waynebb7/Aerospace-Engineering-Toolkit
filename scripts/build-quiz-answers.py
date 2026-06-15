#!/usr/bin/env python3
"""Generate quiz-answers.json from quiz-questions.json and page content."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
QUESTIONS_FILE = ROOT / "scripts" / "quiz-questions.json"
ANSWERS_FILE = ROOT / "scripts" / "quiz-answers.json"
MODEL_ANSWERS_FILE = ROOT / "scripts" / "quiz-model-answers.json"


def load_model_answers() -> dict[str, list[str]]:
    if not MODEL_ANSWERS_FILE.exists():
        return {}
    return json.loads(MODEL_ANSWERS_FILE.read_text(encoding="utf-8"))

try:
    import sympy as sp
except ImportError:
    sp = None

QUIZ_CARD_RE = re.compile(
    r"Quick knowledge check</h2>(.*?)(?=<div class=\"card progression|<div class=\"card\">|\Z)",
    re.DOTALL | re.IGNORECASE,
)
ANSWERS_MINI_RE = re.compile(
    r'<p class="mini">\s*Answers:\s*(.*?)</p>',
    re.DOTALL | re.IGNORECASE,
)
GUIDANCE_MINI_RE = re.compile(
    r'<p class="mini">\s*(?!Answers:)(.*?)\s*</p>',
    re.DOTALL | re.IGNORECASE,
)
CALLOUT_RE = re.compile(
    r'<div class="callout">.*?<strong>(?:Example|Worked example|Answer|Why they matter|KS3 note)[^:]*:</strong>\s*(.*?)</div>',
    re.DOTALL | re.IGNORECASE,
)
WARNING_RE = re.compile(
    r'<div class="warning">.*?<strong>Common mistake:</strong>\s*(.*?)</div>',
    re.DOTALL | re.IGNORECASE,
)


def clean_text_fragment(raw: str) -> str:
    text = re.sub(r"<br\s*/?>", " ", raw, flags=re.IGNORECASE)
    text = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def parse_quiz_card_answers(card_html: str) -> list[str]:
    match = ANSWERS_MINI_RE.search(card_html)
    if not match:
        return []
    return [part.strip() for part in match.group(1).split(";") if part.strip()]


def read_page_context(path: Path) -> dict:
    if not path.exists():
        return {"guidance": "", "examples": [], "hints": [], "quiz_answers": []}
    text = path.read_text(encoding="utf-8")
    card = QUIZ_CARD_RE.search(text)
    card_html = card.group(1) if card else ""

    guidance = ""
    if card_html:
        for mini in GUIDANCE_MINI_RE.findall(card_html):
            plain = clean_text_fragment(mini)
            if plain and "prerequisite map" not in plain.lower():
                guidance = plain
                break

    examples = []
    for ex in CALLOUT_RE.findall(text):
        cleaned = clean_text_fragment(ex)
        if cleaned:
            examples.append(cleaned)

    hints = [clean_text_fragment(h) for h in WARNING_RE.findall(text) if clean_text_fragment(h)]

    return {
        "guidance": guidance,
        "examples": examples,
        "hints": hints,
        "quiz_answers": parse_quiz_card_answers(card_html),
    }


def solve_linear_simple(expr: str) -> str | None:
    """Fallback linear solver when sympy is unavailable."""
    expr = expr.replace("−", "-").replace("×", "*").replace("÷", "/").replace(" ", "")
    m = re.match(r"(-?\d*)x([+\-]\d+)=(-?\d+)", expr, re.I)
    if m:
        coeff_raw, b_raw, rhs_raw = m.groups()
        coeff = int(coeff_raw or "1")
        if coeff == 0:
            return None
        b = int(b_raw)
        rhs = int(rhs_raw)
        val = (rhs - b) / coeff
        if val == int(val):
            val = int(val)
        return f"<code>x = {val}</code>"
    m = re.match(r"x([+\-]\d+)=(-?\d+)", expr, re.I)
    if m:
        b = int(m.group(1))
        rhs = int(m.group(2))
        val = rhs - b
        return f"<code>x = {val}</code>"
    return None


def solve_linear(code: str) -> str | None:
    code = code.replace("−", "-").replace("×", "*").replace("÷", "/").replace(" ", "")
    m = re.search(r"([0-9a-zA-Z+\-*/().]+=[0-9a-zA-Z+\-*/().]+)", code)
    if not m:
        return None
    expr = m.group(1).strip()
    if "x" not in expr.lower():
        return None
    if sp is not None:
        try:
            x = sp.symbols("x")
            lhs, rhs = expr.split("=")
            sol = sp.solve(sp.Eq(sp.sympify(lhs), sp.sympify(rhs)), x)
            if sol:
                val = sol[0]
                if val == int(val):
                    val = int(val)
                return f"<code>x = {val}</code>"
        except Exception:
            pass
    return solve_linear_simple(expr)


def gradient_through_points(q: str) -> str | None:
    pts = re.findall(r"\((-?\d+)\s*,\s*(-?\d+)\)", q)
    if len(pts) >= 2:
        x1, y1 = map(int, pts[0])
        x2, y2 = map(int, pts[1])
        if x2 != x1:
            m = (y2 - y1) / (x2 - x1)
            if m == int(m):
                return f"Gradient <code>m = {int(m)}</code> (rise {y2 - y1}, run {x2 - x1})."
            return f"Gradient <code>m = {m}</code> (rise {y2 - y1}, run {x2 - x1})."
    return None


def line_equation_answer(q: str) -> str | None:
    gm = re.search(r"gradient\s*\\?\(?\s*(-?\d+)\s*\\?\)?", q, re.I)
    cm = re.search(r"y-?intercept\s*(\d+)", q, re.I)
    if gm and cm:
        m = int(gm.group(1))
        c = int(cm.group(1))
        sign = "+" if c >= 0 else "&minus;"
        cabs = abs(c)
        return f"<code>y = {m}x {sign} {cabs}</code>."
    pts = re.findall(r"\((-?\d+)\s*,\s*(-?\d+)\)", q)
    if len(pts) >= 2 and "equation" in q.lower():
        x1, y1 = map(int, pts[0])
        x2, y2 = map(int, pts[1])
        if x2 != x1:
            m = (y2 - y1) / (x2 - x1)
            c = y1 - m * x1
            if m == int(m) and c == int(c):
                sign = "+" if c >= 0 else "&minus;"
                return f"<code>y = {int(m)}x {sign} {abs(int(c))}</code>."
    return None


def parallel_perpendicular(q: str) -> str | None:
    if "parallel" in q.lower():
        ms = re.findall(r"=\s*(-?\d+)x", q.replace("−", "-"))
        if len(ms) >= 2 and ms[0] == ms[1]:
            return f"Yes &mdash; both lines have gradient <code>m = {ms[0]}</code>, so they are parallel."
        if len(ms) >= 2:
            return f"No &mdash; gradients are <code>{ms[0]}</code> and <code>{ms[1]}</code>."
    if "perpendicular" in q.lower():
        m = re.search(r"=\s*(-?\d+)x", q.replace("−", "-"))
        if m:
            grad = int(m.group(1))
            if grad != 0:
                perp = -1 / grad
                return f"Perpendicular gradient <code>m = {perp}</code> (negative reciprocal of {grad})."
    return None


def general_form_answer(q: str) -> str | None:
    m = re.search(r"<code>([^<]+)</code>", q)
    if not m:
        m = re.search(r"(\d+x\s*[+\-−]\s*\d+y\s*[+\-−]\s*\d+\s*=\s*0)", q)
    if not m:
        return None
    expr = m.group(1).replace("−", "-")
    parts = re.match(r"\s*(-?\d+)x\s*([+\-])\s*(\d+)y\s*([+\-])\s*(\d+)\s*=\s*0", expr)
    if parts:
        a, bsign, b, csign, c = parts.groups()
        a, b, c = int(a), int(bsign + b), int(csign + c)
        if b != 0:
            m_val = -a / b
            intercept = -c / b
            m_str = int(m_val) if m_val == int(m_val) else m_val
            i_str = int(intercept) if intercept == int(intercept) else intercept
            return (
                f"Rearrange to <code>y = {m_str}x + {i_str}</code>; "
                f"gradient <code>{m_str}</code>, y-intercept <code>{i_str}</code>."
            )
    return None


def taxi_cost_answer(q: str) -> str | None:
    if "taxi" in q.lower() or "per mile" in q.lower():
        return "<code>C = 2n + 3</code>; fixed charge &pound;3, &pound;2 per mile &mdash; gradient (rate) is <code>2</code>."
    return None


def counting_answer(q: str) -> str | None:
    ql = q.lower()
    if "what question does counting answer" in ql:
        return "Counting answers <strong>“how many?”</strong> — the total number of objects."
    if "touch or mark each object" in ql:
        return "So each object is counted <strong>once</strong> (one-to-one matching) and none is missed or double-counted."
    if "count on from 14" in ql:
        return "<code>15, 16, 17, 18</code>"
    if "skip counting in 5" in ql:
        return "<code>5, 10, 15, 20, 25</code>"
    if "number line" in ql and "9" in ql and "6" in ql:
        return "9 is to the <strong>right</strong> of 6, so <code>9 &gt; 6</code>."
    if "digit 0" in ql and "408" in ql:
        return "0 is a <strong>placeholder</strong> in the tens place — there are no tens in 408."
    return None


def check_solution(q: str) -> str | None:
    if "check whether" in q.lower() and "solution" in q.lower():
        m = re.search(r"x\s*=\s*(\d+)", q)
        eq = re.search(r"<code>([^<]+)</code>", q)
        if m and eq:
            x = int(m.group(1))
            expr = eq.group(1).replace("−", "-")
            if sp is not None:
                try:
                    x_sym = sp.symbols("x")
                    lhs_rhs = expr.split("=")
                    lhs = sp.sympify(lhs_rhs[0])
                    rhs = sp.sympify(lhs_rhs[1])
                    ok = lhs.subs(x_sym, x) == rhs.subs(x_sym, x)
                    if ok:
                        return f"Yes — substituting <code>x = {x}</code> makes both sides equal."
                    return f"No — substituting <code>x = {x}</code> does not satisfy the equation."
                except Exception:
                    pass
            solved = solve_linear_simple(expr.replace(" ", ""))
            if solved and f"x = {x}" in solved.replace("<code>", "").replace("</code>", ""):
                return f"Yes — substituting <code>x = {x}</code> makes both sides equal."
    return None


def sum_equation_word_problem(q: str) -> str | None:
    if "sum of a number and 12 is 31" in q.lower():
        return "Equation: <code>n + 12 = 31</code>; solution <code>n = 19</code>."
    return None


def expand_solve(q: str) -> str | None:
    if "expand and solve" in q.lower():
        ans = solve_linear(q)
        if ans:
            return f"Expand to <code>2x − 8 = 10</code>, then {ans}."
    return None


def format_number(value: float) -> str:
    if value == int(value):
        return str(int(value))
    return f"{value:.2f}".rstrip("0").rstrip(".")


def extract_numeric_expression(q: str) -> str | None:
    for code in re.findall(r"<code>([^<]+)</code>", q):
        expr = code.replace("−", "-").replace("×", "*").replace("÷", "/").strip()
        if re.fullmatch(r"[\d\s+\-*/().]+", expr) and re.search(r"[+\-*/]", expr):
            return expr

    plain = re.search(
        r"(?:calculate|evaluate|find|compute)\s+(-?\d+(?:\.\d+)?)\s*([+\-*/×÷])\s*(-?\d+(?:\.\d+)?)",
        q,
        re.I,
    )
    if plain:
        left, op, right = plain.groups()
        op = op.replace("×", "*").replace("÷", "/")
        return f"{left}{op}{right}"

    inline = re.search(r"(-?\d+(?:\.\d+)?)\s*([+\-*/×÷])\s*(-?\d+(?:\.\d+)?)", q)
    if inline and "same as" not in q.lower():
        left, op, right = inline.groups()
        op = op.replace("×", "*").replace("÷", "/")
        return f"{left}{op}{right}"
    return None


def evaluate_numeric_expression(expr: str) -> str | None:
    normalized = expr.replace("−", "-").replace("×", "*").replace("÷", "/").strip()
    if not re.fullmatch(r"[\d\s+\-*/().]+", normalized) or not re.search(r"[+\-*/]", normalized):
        return None
    try:
        value = eval(normalized, {"__builtins__": {}}, {})  # noqa: S307 — numeric literals only
    except Exception:
        return None
    if isinstance(value, (int, float)):
        return format_number(float(value))
    return None


def basic_arithmetic_answer(q: str) -> str | None:
    ql = q.lower()

    bond = re.search(r"adds to (\d+) with (\d+)", ql)
    if bond:
        target, number = int(bond.group(1)), int(bond.group(2))
        return f"<code>{number} + {target - number} = {target}</code> (number bond pair)."

    if "same as" in ql and "why" in ql and "+" in q:
        return "Yes — addition is <strong>commutative</strong> (order does not change the sum)."

    total = re.search(r"sum of (\d+(?:\.\d+)?) and (\d+(?:\.\d+)?)", ql)
    if total:
        left, right = map(float, total.groups())
        result = left + right
        return f"<code>{format_number(left)} + {format_number(right)} = {format_number(result)}</code>."

    amounts = re.findall(r"£(\d+(?:\.\d+)?)", q)
    if len(amounts) >= 2 and any(word in ql for word in ("has", "finds", "altogether", "total", "now")):
        left, right = map(float, amounts[:2])
        result = left + right
        return f"<code>£{amounts[0]} + £{amounts[1]} = £{result:.2f}</code>."

    perimeter = re.search(r"perimeter of a square with side (\d+(?:\.\d+)?)\s*cm", ql)
    if perimeter:
        side = float(perimeter.group(1))
        return f"<code>4 × {format_number(side)} = {format_number(4 * side)}</code> cm."

    area = re.search(
        r"area of a rectangle (\d+(?:\.\d+)?)\s*cm by (\d+(?:\.\d+)?)\s*cm",
        ql,
    )
    if area:
        length, width = map(float, area.groups())
        return f"<code>{format_number(length)} × {format_number(width)} = {format_number(length * width)}</code> cm²."

    expr = extract_numeric_expression(q)
    if expr:
        value = evaluate_numeric_expression(expr)
        if value is not None:
            return f"<code>{expr} = {value}</code>."
    return None


def contextual_fallback(question: str, ctx: dict, index: int) -> str:
    if ctx.get("examples"):
        example = ctx["examples"][index % len(ctx["examples"])]
        return f"See the worked example: {example}"

    if ctx.get("guidance"):
        return f"Your answer should include: {ctx['guidance']}"

    q_words = set(re.findall(r"[a-z]{5,}", question.lower()))
    for hint in ctx.get("hints", []):
        hint_words = set(re.findall(r"[a-z]{5,}", hint.lower()))
        if q_words & hint_words:
            return f"Avoid this common mistake: {hint}"

    plain = clean_text_fragment(question)
    if len(plain) > 120:
        plain = plain[:117] + "..."
    return f"Review the lesson sections above for the ideas needed to answer: “{plain}”."


def generate_answer(question: str, ctx: dict, index: int) -> str:
    quiz_answers = ctx.get("quiz_answers") or []
    if index < len(quiz_answers):
        return quiz_answers[index]

    q = question
    ordered = (
        counting_answer,
        basic_arithmetic_answer,
        line_equation_answer,
        gradient_through_points,
        parallel_perpendicular,
        taxi_cost_answer,
        general_form_answer,
        check_solution,
        sum_equation_word_problem,
        expand_solve,
    )
    for fn in ordered:
        ans = fn(q)
        if ans:
            return ans

    if "<code>" in q and ("solve" in q.lower() or "=" in q):
        ans = solve_linear(q)
        if ans:
            return ans

    return contextual_fallback(q, ctx, index)


def main():
    if sp is None:
        print("Note: sympy not installed — using basic linear-equation fallback (pip install -r scripts/requirements.txt for full coverage)")
    model_answers = load_model_answers()
    questions = json.loads(QUESTIONS_FILE.read_text(encoding="utf-8"))
    answers: dict[str, list[str]] = {}
    for topic, qs in questions.items():
        if topic in model_answers:
            if len(model_answers[topic]) != len(qs):
                raise SystemExit(
                    f"Model answer count mismatch for {topic}: "
                    f"{len(model_answers[topic])} answers, {len(qs)} questions"
                )
            answers[topic] = model_answers[topic]
            continue
        ctx = read_page_context(ROOT / topic)
        answers[topic] = [generate_answer(q, ctx, i) for i, q in enumerate(qs)]

    ANSWERS_FILE.write_text(json.dumps(answers, indent=2), encoding="utf-8")
    print(f"Wrote answers for {len(answers)} topics to {ANSWERS_FILE}")
    if model_answers:
        print(f"Used model answers for {len(model_answers)} topics")


if __name__ == "__main__":
    main()
