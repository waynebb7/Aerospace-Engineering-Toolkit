#!/usr/bin/env python3
"""Audit topic review keys for formula display and symbol quality."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Import glossary for acronym audit (avoid flagging SI, AC, etc.)
import importlib.util

_spec = importlib.util.spec_from_file_location(
    "_ack", ROOT / "scripts" / "apply-content-key.py"
)
_ack = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_ack)
VALID_ACRONYMS = _ack.ACRONYM_GLOSSARY.keys() | _ack.SKIP_ACRONYMS

CONTENT_KEY_RE = re.compile(
    r'<details class="content-key"[^>]*>(.*?)</details>',
    re.DOTALL | re.IGNORECASE,
)
FORMULA_RE = re.compile(
    r'<dt class="content-key__formula">(.*?)</dt>',
    re.DOTALL | re.IGNORECASE,
)
SYMBOL_RE = re.compile(
    r'<dt class="content-key__symbol">(.*?)</dt>.*?<strong>Called:</strong>\s*([^.<]+)',
    re.DOTALL | re.IGNORECASE,
)
ENGLISH_WORD = re.compile(r"^[a-zA-Z]{2,}$")
PLAIN_MATH_RE = re.compile(
    r"^[A-Za-z0-9=+\-*/^()_\[\]:.·×∝→±' ]+$"
)
ALLOWED_SYMBOL_NAMES = {
    "sine", "cosine", "tangent", "times", "limit", "infinity", "logarithm",
    "exponential", "summation", "integral", "dagger", "fraction", "bar",
}


def audit_file(path: Path) -> list[str]:
    text = path.read_text(encoding="utf-8")
    if "content-key" not in text:
        return []

    issues: list[str] = []
    has_mathjax = "mathjax" in text.lower()
    key_html = CONTENT_KEY_RE.search(text)
    if not key_html:
        return issues
    chunk = key_html.group(1)

    formula_count = len(FORMULA_RE.findall(chunk))

    for m in re.finditer(
        r'<h3 class="content-key__heading">Acronyms</h3>.*?<dl class="content-key__list">(.*?)</dl>',
        chunk,
        re.DOTALL | re.I,
    ):
        for dm in re.finditer(r"<dt>(.*?)</dt><dd>(.*?)</dd>", m.group(1), re.DOTALL | re.I):
            acr = re.sub(r"<[^>]+>", "", dm.group(1)).strip()
            defn = re.sub(r"<[^>]+>", "", dm.group(2)).strip()
            if (
                len(acr) <= 2
                and acr.isupper()
                and acr not in VALID_ACRONYMS
            ):
                issues.append(f"suspect two-letter acronym: {acr}")
            if defn.rstrip().endswith(":"):
                issues.append(f"incomplete acronym definition: {acr}")

    for m in FORMULA_RE.finditer(chunk):
        raw = m.group(1).strip()
        if "..." in raw:
            issues.append(f"truncated formula: {raw[:60]}...")
        if not has_mathjax and raw.startswith(r"\("):
            issues.append(f"raw MathJax delimiter without MathJax: {raw[:50]}")
        if has_mathjax and "\\" in raw and not raw.startswith(r"\("):
            issues.append(f"unwrapped LaTeX formula: {raw[:50]}")
        plain = re.sub(r"<[^>]+>", "", raw)
        plain = plain.replace(r"\(", "").replace(r"\)", "").strip()
        if has_mathjax and not raw.startswith(r"\(") and PLAIN_MATH_RE.match(plain):
            issues.append(f"plain formula without MathJax delimiters: {raw[:50]}")
        if not has_mathjax and PLAIN_MATH_RE.match(plain) and "=" in plain:
            issues.append(f"math formula without MathJax script: {raw[:50]}")
        if re.search(r"\\\\[a-zA-Z]", raw):
            issues.append(f"double-escaped LaTeX in formula: {raw[:50]}")
        if "\n" in raw:
            issues.append("formula contains line breaks (may render poorly)")
        if len(plain.split()) > 14 and "\\" not in plain:
            issues.append(f"prose in formulae section: {plain[:60]}...")
        if re.search(r"\b(often|linked in tool)\b", plain, re.I):
            issues.append(f"prose qualifier in formula: {plain[:60]}...")
        dd = m.group(0)
        dd_m = re.search(r"<dd>(.*?)</dd>", dd, re.DOTALL | re.I)
        if dd_m:
            desc = re.sub(r"<[^>]+>", "", dd_m.group(1)).strip()
            if desc in {
                "Key relationship used in this topic.",
                "Relationship used in this topic.",
                "Key relationship highlighted in the lesson.",
            }:
                issues.append(f"placeholder formula description: {plain[:50]}...")

    for m in re.finditer(
        r'<h3 class="content-key__heading">Key terms[^<]*</h3>.*?<dl class="content-key__list">(.*?)</dl>',
        chunk,
        re.DOTALL | re.I,
    ):
        for dm in re.finditer(r"<dt>(.*?)</dt><dd>(.*?)</dd>", m.group(1), re.DOTALL | re.I):
            term = re.sub(r"<[^>]+>", "", dm.group(1)).strip()
            defn = re.sub(r"<[^>]+>", "", dm.group(2)).strip()
            if defn.rstrip().endswith(":"):
                issues.append(f"incomplete term definition: {term[:40]}")

    for m in SYMBOL_RE.finditer(chunk):
        sym_html = m.group(1).strip()
        called = m.group(2).strip()
        plain = re.sub(r"<[^>]+>", "", sym_html)
        plain = plain.replace(r"\(", "").replace(r"\)", "").strip()
        if ENGLISH_WORD.fullmatch(plain) and len(plain) > 1:
            issues.append(f"English word listed as symbol: {plain}")
        if (
            ENGLISH_WORD.fullmatch(called)
            and len(called) > 1
            and called.lower() not in ALLOWED_SYMBOL_NAMES
        ):
            issues.append(f"English word symbol name: {called}")
        if not has_mathjax and sym_html.startswith(r"\(") and re.fullmatch(r"\\?\([A-Za-z]\\?\)", plain):
            issues.append(f"single-letter shown as raw LaTeX: {sym_html}")
        if has_mathjax and sym_html.startswith("<var>"):
            issues.append(f"symbol using HTML var instead of MathJax: {sym_html}")
        if not has_mathjax and sym_html.startswith("<var>") and formula_count:
            issues.append(f"symbol using var on page with formulae: {sym_html}")

    return issues


def main() -> int:
    total_issues = 0
    affected = 0
    for path in sorted(ROOT.rglob("*.html")):
        if "learn" not in path.parts:
            continue
        issues = audit_file(path)
        if issues:
            affected += 1
            total_issues += len(issues)
            rel = path.relative_to(ROOT)
            print(f"\n{rel}:")
            for issue in issues[:8]:
                print(f"  - {issue}".encode("ascii", "replace").decode("ascii"))
            if len(issues) > 8:
                print(f"  ... and {len(issues) - 8} more")

    print(f"\nAudit complete: {total_issues} issues in {affected} files")
    return 1 if total_issues else 0


if __name__ == "__main__":
    sys.exit(main())
