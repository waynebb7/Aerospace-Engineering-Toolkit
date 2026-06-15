#!/usr/bin/env python3
"""Inject expandable topic review keys on teaching pages (content-page)."""
from __future__ import annotations

import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Pages with hand-tuned review keys — auto-regeneration would overwrite correct symbols.
CONTENT_KEY_CURATED_PATHS: frozenset[str] = frozenset(
    {
        "learn/mathematics/digital-logic/set-theory-basics.html",
        "learn/mathematics/digital-logic/sequential-logic.html",
    }
)

SET_THEORY_MARKERS = (
    "∪",
    "∩",
    "∈",
    "∉",
    "⊆",
    "⊂",
    "∅",
    "set theory",
    "universal set",
    "venn diagram",
    "set-builder",
    "roster form",
    "de morgan",
)

SET_THEORY_UNICODE_SYMBOLS: list[tuple[str, str, str, str]] = [
    ("∪", r"\cup", "union", "Union — elements in either set (logic OR)."),
    ("∩", r"\cap", "intersection", "Intersection — elements in both sets (logic AND)."),
    ("∈", r"\in", "element-of", r"Element-of — \(x \in A\) means x is a member of set A."),
    ("∉", r"\notin", "not-in", r"Not-in — \(x \notin A\) means x is not a member of A."),
    ("⊆", r"\subseteq", "subset", "Subset — every element of A is also in B."),
    ("⊂", r"\subset", "proper subset", r"Proper subset — \(A \subset B\) means \(A \subseteq B\) and \(A \neq B\)."),
    ("≠", r"\neq", "not equal", "Not equal — used when two sets differ, e.g. in proper subset."),
    ("∅", r"\emptyset", "empty set", r"Empty set — no elements (also written \(\{\}\))."),
    ("∖", r"\setminus", "set minus", r"Set difference \(A \setminus B\) (also written \(A - B\))."),
]

SET_THEORY_LETTERS: dict[str, tuple[str, str]] = {
    "A": ("capital A", "Set A — a collection of elements."),
    "B": ("capital B", "Set B — a collection of elements."),
    "C": ("capital C", "Set C — a collection of elements."),
    "U": ("capital U", "Universal set — all objects under discussion in a given problem."),
    "x": ("lowercase x", "A typical element ranging over members of a set."),
}

CONTENT_KEY_RE = re.compile(
    r'\s*<details class="content-key"[^>]*>.*?</details>\s*',
    re.DOTALL | re.IGNORECASE,
)

CARD_RE = re.compile(
    r'<div class="card(?:\s+[^"]*)?">(.*?)</div>',
    re.DOTALL | re.IGNORECASE,
)
H2_RE = re.compile(r"<h2>(.*?)</h2>", re.DOTALL | re.IGNORECASE)
H3_RE = re.compile(r"<h3>(.*?)</h3>", re.DOTALL | re.IGNORECASE)
STRONG_RE = re.compile(r"<strong>(.*?)</strong>", re.DOTALL | re.IGNORECASE)
CODE_RE = re.compile(r"<code>(.*?)</code>", re.DOTALL | re.IGNORECASE)
TAG_RE = re.compile(r"<[^>]+>")
MATH_INLINE_RE = re.compile(r"\\\((.+?)\\\)", re.DOTALL)
MATH_BLOCK_RE = re.compile(r"\\\[(.+?)\\\]", re.DOTALL)
DOLLAR_INLINE_RE = re.compile(r"(?<!\$)\$(?!\$)(.+?)(?<!\$)\$(?!\$)", re.DOTALL)
DOLLAR_BLOCK_RE = re.compile(r"\$\$(.+?)\$\$", re.DOTALL)

SKIP_TERMS = {
    "example",
    "note",
    "warning",
    "important",
    "key idea",
    "worked example",
    "learning anchor",
    "success criteria",
    "exam trap",
    "common exam trap",
    "calculation strategy",
    "method step",
    "why it improves marks",
    "question prompt",
    "worked answer",
    "high-value habits",
    "communication quality",
    "define terms",
    "prerequisites",
    "next topics",
    "recommended next",
    "parallel options",
    "go deeper",
    "catalog navigation",
    "show answers",
    "quick quiz",
    "quick knowledge check",
    "revision habit",
    "banding risk",
    "reliability checklist",
    "start",
    "stop",
    "push",
    "pull",
    "arrow",
    "balanced",
    "speed up",
    "slow down",
    "change direction",
    "change shape",
}

TEMPLATE_SECTIONS = {
    "big picture and core ideas",
    "vocabulary precision and concept mapping",
    "equations, rearrangement, and unit discipline",
    "worked numerical examples with units",
    "required practical focus",
    "exam technique and command words",
    "misconceptions and synoptic links",
    "quiz (6 questions)",
    "quick knowledge check",
    "high-value habits",
    "communication quality",
    "define terms",
    "success criteria",
    # A-Level (and similar) page template card headings — not glossary terms
    "foundations and context",
    "core equations and interpretation",
    "worked example a",
    "worked example b",
    "conceptual depth and synoptic links",
    "practical methods and uncertainty",
    "common mistakes and correction strategy",
    "extended revision narrative",
    "extended worked reasoning and exam communication",
    "topic extension and exam drills",
    "problem",
    "method",
    "interpretation",
}

GENERIC_DEFINITION_SNIPPETS = (
    "introduced and explained in the sections below",
    "key equations used repeatedly in this topic",
    "synoptic a-level questions often combine",
    "at a-level is best learned as a modelling language",
    "this extension section reinforces",
    "high-quality practical work begins with deliberate planning",
    "in long-response questions, communicate as a scientist",
    "rewards deliberate practice with mixed-format",
    "a second question extends the same model",
    "examiners frequently reward structure",
    "each relation has a validity range",
)

SKIP_ACRONYMS = {
    "THE", "AND", "FOR", "NOT", "ARE", "BUT", "YOU", "ALL", "ANY", "ONE", "TWO",
    "USE", "CAN", "HAS", "HAD", "WAS", "ITS", "OUR", "WHO", "HOW", "WHY", "NEW",
    "OLD", "BIG", "TOP", "LOW", "HIGH", "TRUE", "FALSE", "HTML", "HTTP", "HREF",
    "SRC", "CSS", "JS", "UK", "US", "EE", "EK",
    # Subsystem labels in Dirac/tensor notation — not acronyms
    "AB", "AC", "BC", "AD", "BD", "CD",
}

ACRONYM_GLOSSARY: dict[str, str] = {
    "KS2": "Key Stage 2 — primary school years 3–6 (ages 7–11) in England.",
    "KS3": "Key Stage 3 — lower secondary years 7–9 (ages 11–14).",
    "GCSE": "General Certificate of Secondary Education — qualifications typically taken at age 16.",
    "A-Level": "Advanced Level qualifications — typically ages 16–18 in England.",
    "BSc": "Bachelor of Science undergraduate degree.",
    "MSc": "Master of Science postgraduate degree.",
    "PhD": "Doctor of Philosophy — research doctorate.",
    "SI": "International System of Units (m, kg, s, A, K, mol, cd).",
    "AC": "Alternating current — current that reverses direction periodically.",
    "DC": "Direct current — current flowing in one direction.",
    "EM": "Electromagnetism — unified theory of electric and magnetic fields.",
    "EMF": "Electromotive force — energy per unit charge driving current in a circuit.",
    "RF": "Radio frequency — electromagnetic signals used in communications and radar.",
    "SHM": "Simple harmonic motion — oscillation where restoring force is proportional to displacement.",
    "QM": "Quantum mechanics — physics of atomic and subatomic systems.",
    "QFT": "Quantum field theory — relativistic quantum framework for particles and fields.",
    "NISQ": "Noisy Intermediate-Scale Quantum — devices with limited qubits and significant noise.",
    "QKD": "Quantum key distribution — secure key exchange using quantum states.",
    "EPR": "Einstein–Podolsky–Rosen (1935) argument: if quantum mechanics is complete, outcomes may require non-local correlations or hidden variables.",
    "CHSH": r"Clauser–Horne–Shimony–Holt Bell test. Local hidden-variable models satisfy \(|S| \leq 2\); quantum mechanics allows \(|S| \leq 2\sqrt{2}\) (Tsirelson bound).",
    "QED": "Quantum electrodynamics — quantum theory of light and its interaction with charged matter. Cavity QED and circuit QED study atoms or qubits coupled to confined photon modes.",
    "HOM": "Hong–Ou–Mandel effect — two indistinguishable photons on a beam splitter exit together; coincidence probability drops to zero.",
    "LIGO": "Laser Interferometer Gravitational-Wave Observatory — detects gravitational waves; squeezed light improves its sensitivity.",
    "QAOA": "Quantum Approximate Optimization Algorithm — hybrid quantum-classical optimizer.",
    "VQE": "Variational Quantum Eigensolver — algorithm for estimating ground-state energies.",
    "PDE": "Partial differential equation — equation involving partial derivatives.",
    "ODE": "Ordinary differential equation — equation involving derivatives of one variable.",
    "FFT": "Fast Fourier Transform — efficient algorithm for frequency analysis.",
    "CFD": "Computational fluid dynamics — numerical simulation of fluid flow.",
    "MHD": "Magnetohydrodynamics — study of conducting fluids coupled to magnetic fields.",
    "AMO": "Atomic, molecular, and optical physics.",
    "LHC": "Large Hadron Collider — high-energy particle accelerator at CERN.",
    "CERN": "European laboratory for particle physics research.",
    "GPS": "Global Positioning System — satellite navigation using precise timing.",
    "TRU": "Transformer rectifier unit — aircraft power conversion equipment.",
    "FSM": "Finite state machine — model of sequential digital logic states and transitions.",
    "K-map": "Karnaugh map — graphical method for Boolean logic minimization.",
    "NAND": "NOT-AND logic gate — universal gate in digital electronics.",
    "NOR": "NOT-OR logic gate — universal gate in digital electronics.",
    "XOR": "Exclusive OR — logic output true when inputs differ.",
    "ASCII": "American Standard Code for Information Interchange — character encoding.",
    "AES": "Advanced Encryption Standard — widely used symmetric encryption.",
    "RSA": "Rivest–Shamir–Adleman — public-key cryptography algorithm.",
    "UV": "Ultraviolet radiation — electromagnetic radiation shorter than visible light.",
    "IR": "Infrared radiation — electromagnetic radiation longer than visible light.",
}

FORMULA_HINTS: dict[str, str] = {
    "speed": "Rate of distance travelled per unit time.",
    "velocity": "Rate of change of displacement; includes direction.",
    "acceleration": "Rate of change of velocity.",
    "displacement": "Change in position from start to finish, including direction.",
    "distance": "Total path length travelled (scalar).",
    "force": "Push or pull that can change motion or shape.",
    "weight": "Gravitational force on an object (often W = mg).",
    "mass": "Quantity of matter in an object (kg).",
    "energy": "Capacity to do work or cause heating.",
    "power": "Rate of energy transfer (energy per unit time).",
    "pressure": "Force per unit area.",
    "density": "Mass per unit volume.",
    "current": "Rate of flow of electric charge.",
    "voltage": "Energy transferred per unit charge (potential difference).",
    "resistance": "Opposition to electric current.",
    "momentum": "Product of mass and velocity.",
    "impulse": "Change in momentum; force multiplied by time.",
    "frequency": "Number of cycles per unit time.",
    "wavelength": "Distance between successive wave crests.",
    "period": "Time for one complete oscillation or cycle.",
    "charge": "Property of matter that produces electric forces.",
    "field": "Region where a force acts on objects or charges.",
    "potential": "Stored energy per unit charge (electric potential).",
    "capacitance": "Charge stored per unit potential difference.",
    "inductance": "Property opposing change in current in a circuit.",
    "flux": "Flow of a field through a surface.",
    "entropy": "Measure of disorder or number of accessible microstates.",
    "temperature": "Measure of average kinetic energy of particles.",
    "probability": "Likelihood of an outcome, between 0 and 1.",
    "variance": "Spread of a distribution around its mean.",
    "gradient": "Rate of change of a quantity with position or input.",
    "derivative": "Instantaneous rate of change of a function.",
    "integral": "Accumulated sum of a quantity over an interval.",
    "eigenvalue": "Scalar factor by which an eigenvector is scaled by a matrix.",
    "eigenvector": "Non-zero vector unchanged in direction by a linear map.",
    "hamiltonian": "Operator or function representing total energy in a system.",
    "lagrangian": "Function used in mechanics; typically kinetic minus potential energy.",
    "lambda": "Wavelength or decay constant, depending on context.",
    "sigma": "Standard deviation, conductivity, or cross-section, depending on context.",
    "omega": "Angular frequency (rad s⁻¹).",
    "theta": "Angle (often in radians).",
    "phi": "Phase angle or azimuthal angle.",
    "psi": "Wavefunction in quantum mechanics.",
    "hbar": "Reduced Planck constant ℏ = h/(2π).",
}


def strip_tags(text: str) -> str:
    text = re.sub(r"</(p|li|h[1-6]|div|tr)>", "\n", text, flags=re.I)
    text = TAG_RE.sub(" ", text)
    text = html.unescape(text)
    text = re.sub(r"^>+\s*", "", text, flags=re.M)
    return re.sub(r"[ \t]+", " ", text).strip()


def normalize_term(term: str) -> str:
    term = strip_tags(term)
    term = re.sub(r"^\d+\)\s*", "", term)
    return term.strip(" :—-.")


def is_skip_term(term: str) -> bool:
    low = term.lower().strip()
    if not low or len(low) < 2:
        return True
    if low in SKIP_TERMS or low in TEMPLATE_SECTIONS:
        return True
    if len(low) <= 2 and low.isalpha():
        return True
    if low.startswith("http"):
        return True
    if re.fullmatch(r"[a-z]+", low) and low in {"and", "the", "for", "with", "from", "that", "this"}:
        return True
    return False


def is_template_section(title: str) -> bool:
    return normalize_term(title).lower() in TEMPLATE_SECTIONS


def is_poor_term(term: str) -> bool:
    low = term.lower()
    if term.endswith("?"):
        return True
    if low.startswith(
        (
            "experiment ",
            "ks2 to ks3 guide",
            "gcse guide",
            "a-level guide",
            "and ",
            "how ",
            "or ",
            "describing ",
            "simple ",
            "friction is ",
        )
    ):
        return True
    if "guide." in low:
        return True
    if len(term.split()) > 6:
        return True
    return False


def strip_term_echo(term: str, definition: str) -> str:
    term_clean = normalize_term(term)
    defn = re.sub(r"\s+", " ", definition).strip()
    if not term_clean or not defn:
        return defn
    term_low = term_clean.lower()
    defn_low = defn.lower()
    for prefix in (
        term_low,
        f"{term_low}:",
        f"{term_low} —",
        f"{term_low} -",
        f"{term_low} problem:",
        f"{term_low} problem",
    ):
        if defn_low.startswith(prefix):
            rest = defn[len(prefix) :].lstrip(" :—-.")
            if len(rest) >= 12:
                return rest
    return defn


def is_generic_definition(defn: str) -> bool:
    low = defn.lower()
    if "\\[" in defn or "$$" in defn:
        return True
    return any(snippet in low for snippet in GENERIC_DEFINITION_SNIPPETS)


def is_section_heading_title(term: str) -> bool:
    low = normalize_term(term).lower()
    if is_template_section(term):
        return True
    if re.fullmatch(r"worked example [a-z]", low):
        return True
    if len(low.split()) > 3:
        return True
    if low.endswith(" worked example"):
        return True
    return False


def clean_definition(defn: str, *, term: str = "") -> str:
    defn = strip_tags(defn)
    defn = re.sub(r"^\d+\)\s*", "", defn)
    defn = re.sub(r"\s+", " ", defn).strip()
    if term:
        defn = strip_term_echo(term, defn)
    sents = sentences(defn)
    if sents:
        sent = sents[0]
        if term and sent.lower().startswith(normalize_term(term).lower()):
            if len(sents) > 1:
                return sents[1]
        return sent
    return defn[:220] + ("..." if len(defn) > 220 else "")


MAX_FORMULA_DISPLAY = 200

PROSE_FORMULA_WORDS = {
    "for", "the", "and", "from", "with", "often", "linked", "perpendicular",
    "clockwise", "anticlockwise", "equilibrium", "design", "between", "into",
    "that", "this", "when", "where", "each", "both", "are", "is", "not",
    "should", "focus", "these", "key", "relationships", "tool", "pivot",
}

SYMBOL_STOP_WORDS = PROSE_FORMULA_WORDS | SKIP_TERMS | TEMPLATE_SECTIONS


MATHJAX_SCRIPT = """  <script type="text/javascript" async
    src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML">
  </script>"""

MATH_IN_TEXT_RE = re.compile(
    r"[A-Za-z][A-Za-z0-9_]*\s*=\s*[A-Za-z0-9+\-*/^()_:.·×∝→±' ]+"
)


def page_has_mathjax(page_html: str) -> bool:
    return "mathjax" in page_html.lower()


def page_has_math_content(
    cards: list[str], formulae: list[tuple[str, str]], page_html: str
) -> bool:
    if formulae:
        return True
    corpus = "\n".join(cards)
    if re.search(r"\\\(|\\\[|\$\$", corpus):
        return True
    for card in cards:
        for match in CODE_RE.finditer(card):
            raw = strip_tags(match.group(1))
            if is_key_formula(raw) and looks_like_math_expression(raw):
                return True
    if re.search(r"\\\(|\\\[|\$\$", page_html):
        return True
    return False


def ensure_mathjax(page_html: str, *, needs_math: bool) -> str:
    if not needs_math or page_has_mathjax(page_html):
        return page_html
    return re.sub(
        r"</head>",
        MATHJAX_SCRIPT + "\n</head>",
        page_html,
        count=1,
        flags=re.IGNORECASE,
    )


def is_key_formula(raw: str) -> bool:
    raw = raw.strip()
    if len(raw) < 4:
        return False
    if len(raw) > MAX_FORMULA_DISPLAY:
        return False
    if re.search(r"\d{2,}", raw):
        return False
    if re.search(r"\d+x", raw, re.I):
        return False
    if re.search(r"=\s*[1-9]", raw):
        return False
    if re.search(r"y\s*=\s*(?:u\^|x)", raw, re.I):
        return False
    if raw.count("=") > 2:
        return False
    if "\\" in raw or looks_like_latex(raw):
        return "=" in raw or any(sym in raw for sym in ("×", "∝", "→", "±", "^", "_"))
    words = re.findall(r"[a-zA-Z]+", raw)
    if words and words[0].lower() in PROSE_FORMULA_WORDS:
        return False
    if any(w.lower() in PROSE_FORMULA_WORDS for w in words[:2]):
        return False
    if "\\" not in raw and (len(words) >= 5 or any(len(w) > 10 for w in words)):
        return False
    if re.search(r"\([^)]*\b(often|linked|usually|typically)\b", raw, re.I):
        return False
    if len(words) > 12:
        return False
    if "=" not in raw:
        return False
    lhs = raw.split("=")[0].strip()
    if len(lhs.split()) > 4:
        return False
    return True


def is_actual_symbol(display: str) -> bool:
    plain = strip_tags(display).strip()
    if not plain:
        return False
    if "\\" in plain or looks_like_latex(plain):
        return True
    if re.fullmatch(r"[A-Za-z]", plain):
        return True
    if re.fullmatch(r"[A-Za-z][0-9]+(?:'|′)?", plain):
        return True
    if re.fullmatch(r"[A-Za-z]\^[\w{}]+", plain):
        return True
    if re.fullmatch(r"[A-Za-z]_[\w{}]+", plain):
        return True
    if plain.lower() in SYMBOL_STOP_WORDS:
        return False
    if re.fullmatch(r"[a-zA-Z]+", plain):
        return False
    return False


def is_set_theory_context(text: str) -> bool:
    low = text.lower()
    return any(marker in text or marker in low for marker in SET_THEORY_MARKERS)


def formula_hint(term: str, *, set_theory: bool = False) -> str | None:
    low = term.lower()
    if set_theory and term in SET_THEORY_LETTERS:
        return SET_THEORY_LETTERS[term][1]
    for key, hint in FORMULA_HINTS.items():
        if low == key or low == f"{key}s":
            return hint
    if len(term) == 1 and term.isupper():
        single_letter = {
            "F": "Force.",
            "E": "Energy or electric field (context-dependent).",
            "V": "Voltage or volume (context-dependent).",
            "I": "Electric current.",
            "R": "Resistance or radius (context-dependent).",
            "P": "Power or pressure (context-dependent).",
            "Q": "Charge or heat transfer (context-dependent).",
            "T": "Temperature, period, or kinetic energy (context-dependent).",
            "U": "Internal energy or potential energy.",
            "W": "Work done or weight.",
            "B": "Magnetic flux density.",
            "L": "Inductance or angular momentum (context-dependent).",
            "C": "Capacitance or heat capacity (context-dependent).",
            "N": "Number of particles or turns in a coil (context-dependent).",
            "S": "Entropy or action (context-dependent).",
            "H": "Enthalpy or magnetic field strength (context-dependent).",
            "G": "Gravitational constant or Gibbs free energy (context-dependent).",
            "K": "Spring constant or kinetic energy symbol (context-dependent).",
            "M": "Mass or magnetization (context-dependent).",
            "A": "Area or amplitude (context-dependent).",
            "D": "Distance, displacement, or electric displacement (context-dependent).",
        }
        return single_letter.get(term)
    return None


def describe_set_formula(plain: str, context: str) -> str | None:
    if "∪" in plain and "∩" in plain and "'" in plain:
        if "(A ∪ B)'" in plain or "(A ∩ B)'" in plain:
            return "De Morgan's law — complement of union or intersection."
        return "Identity or absorption law in set algebra."
    if "∪" in plain and "∩" not in plain.replace("∪", ""):
        if "'" in plain:
            return "De Morgan's law for union and complement."
        return "Union — elements in either set (logic OR)."
    if "∩" in plain and "∪" not in plain.replace("∩", ""):
        if "'" in plain:
            return "De Morgan's law for intersection and complement."
        return "Intersection — elements in both sets (logic AND)."
    if re.search(r"A['′]|Aᶜ", plain) or ("'" in plain and "∈ U" in plain):
        return "Complement of A relative to universal set U."
    if "∖" in plain or re.search(r"A\s*[-−\\]\s*B", plain):
        return "Set difference — elements in A but not in B."
    if "⊆" in plain or "⊂" in plain:
        return "Subset relationship between sets."
    if re.fullmatch(r"[A-Z]\s*=\s*\{[^}]+\}", plain):
        return f"Example or roster notation for set {plain[0]}."
    if "Boolean" in plain or "·" in plain:
        return "Parallel Boolean-algebra form of the same law."
    return None


def describe_formula(raw: str, context: str) -> str:
    plain = strip_tags(normalize_extracted_math(raw)).strip()
    if not plain:
        return "Equation used in this topic."

    set_theory = is_set_theory_context(context)
    if set_theory:
        set_desc = describe_set_formula(plain, context)
        if set_desc:
            return set_desc

    if "=" in plain:
        lhs = plain.split("=")[0].strip()
        for token in reversed(re.findall(r"[A-Za-z]+", lhs)):
            hint = formula_hint(token, set_theory=set_theory)
            if hint:
                return hint
        needle = plain[: min(40, len(plain))]
        for sentence in sentences(context):
            if needle in sentence or (len(lhs) > 2 and lhs in sentence):
                cleaned = clean_definition(sentence)
                if (
                    len(cleaned) > 25
                    and cleaned.lower() != plain.lower()
                    and "key relationship" not in cleaned.lower()
                ):
                    return cleaned
        lhs_disp = lhs if len(lhs) <= 40 else lhs[:37] + "..."
        return f"Defines {lhs_disp} in terms of the other quantities in this equation."

    hint = formula_hint(plain, set_theory=set_theory)
    if hint:
        return hint
    return "Equation used in this topic."


def sentences(text: str) -> list[str]:
    text = strip_tags(text)
    parts = re.split(r"(?<=[.!?])\s+", text)
    return [p.strip() for p in parts if len(p.strip()) > 15]


def enrich_definition_from_context(term: str, definition: str, scope_html: str) -> str:
    definition = definition.strip()
    if not definition.rstrip().endswith(":"):
        return definition
    term_esc = re.escape(term)
    idx = -1
    for pat in (
        rf"<strong>{term_esc}</strong>",
        rf"<strong>{term_esc}[^<]*</strong>",
    ):
        m = re.search(pat, scope_html, re.I)
        if m:
            idx = m.end()
            break
    if idx == -1:
        return definition
    tail = scope_html[idx:]
    math_m = re.search(r"\\\[(.*?)\\\]", tail, re.DOTALL)
    if math_m:
        expr = normalize_extracted_math(strip_tags(math_m.group(1)))
        return f"{definition.rstrip()} \\({expr}\\)"
    for sentence in sentences(tail):
        if len(sentence) > 20 and term.lower() not in sentence.lower()[: len(term) + 5]:
            return f"{definition.rstrip()} {sentence}"
        if len(sentence) > 20:
            return f"{definition.rstrip()} {sentence}"
    return definition


def is_false_acronym(acr: str, page_html: str) -> bool:
    if len(acr) <= 2 and acr not in ACRONYM_GLOSSARY:
        return True
    if re.search(rf"[_{{]\\s*{re.escape(acr)}\\s*[}}]|\\rangle_{{?{re.escape(acr)}", page_html):
        return True
    return False


def guess_definition(term: str, scope: str) -> str:
    plain = strip_tags(scope)
    term_esc = re.escape(term)
    patterns = [
        rf"\b{term_esc}\b\s+is\s+([^.!?]+[.!?])",
        rf"\b{term_esc}\b\s+are\s+([^.!?]+[.!?])",
        rf"\b{term_esc}\b\s+means\s+([^.!?]+[.!?])",
        rf"\b{term_esc}\b\s+refers to\s+([^.!?]+[.!?])",
        rf"\b{term_esc}\b\s*:\s*([^.!?]+[.!?])",
        rf"\b{term_esc}\b\s+—\s*([^.!?]+[.!?])",
        rf"A\s+{term_esc}\b\s+is\s+([^.!?]+[.!?])",
        rf"The\s+{term_esc}\b\s+is\s+([^.!?]+[.!?])",
    ]
    for pat in patterns:
        m = re.search(pat, plain, re.IGNORECASE)
        if m:
            start = m.start()
            if plain.rfind("(", 0, start) > plain.rfind(")", 0, start):
                continue
            definition = m.group(1).strip()
            if 10 < len(definition) < 200:
                return definition

    for sentence in sentences(scope):
        if re.search(rf"\b{term_esc}\b", sentence, re.I):
            if 20 < len(sentence) < 220:
                if re.search(rf"\([^)]*\b{term_esc}\b[^)]*is\b", sentence, re.I):
                    continue
                return sentence

    hint = formula_hint(term)
    if hint:
        return hint

    if term.upper() in ACRONYM_GLOSSARY:
        return ACRONYM_GLOSSARY[term.upper()]

    return "Introduced and explained in the sections below."


def first_paragraph(card_html: str) -> str:
    m = re.search(r"<p[^>]*>(.*?)</p>", card_html, re.DOTALL | re.IGNORECASE)
    return m.group(1) if m else card_html


def first_paragraph_after_h2(card_html: str, h2_match: re.Match[str]) -> str:
    tail = card_html[h2_match.end() :]
    m = re.search(r"<p[^>]*>(.*?)</p>", tail, re.DOTALL | re.IGNORECASE)
    return m.group(1) if m else ""


def text_after_heading(card_html: str, heading: str) -> str:
    idx = card_html.lower().find(f">{heading.lower()}<")
    if idx == -1:
        return card_html
    tail = card_html[idx:]
    m = re.search(r"<p[^>]*class=\"mini\"[^>]*>(.*?)</p>", tail, re.DOTALL | re.I)
    if m:
        return m.group(1)
    m = re.search(r"<p[^>]*>(.*?)</p>", tail, re.DOTALL | re.I)
    return m.group(1) if m else tail


def get_teaching_cards(page_html: str) -> list[str]:
    body_match = re.search(
        r'<div class="content-body">(.*)</div>\s*</div>\s*</body>',
        page_html,
        re.DOTALL | re.IGNORECASE,
    )
    if not body_match:
        return []
    chunk = body_match.group(1)
    chunk = CONTENT_KEY_RE.sub(" ", chunk)
    cards = []
    for m in CARD_RE.finditer(chunk):
        card = m.group(0)
        if any(x in card for x in ("progression-card", "prerequisites-card", "next-topics-card")):
            continue
        if re.search(r"quick\s+(?:knowledge\s+check|quiz)", card, re.I):
            continue
        cards.append(m.group(1))
    return cards


def extract_hero_terms(page_html: str) -> list[tuple[str, str]]:
    found: dict[str, tuple[str, str]] = {}
    hero = re.search(
        r'<div class="content-hero">(.*?)</div>\s*<div class="content-body">',
        page_html,
        re.DOTALL | re.IGNORECASE,
    )
    if not hero:
        return []
    hero_html = hero.group(1)
    desc = re.search(r"<p>(.*?)</p>", hero_html, re.DOTALL | re.I)
    if not desc:
        return []
    text = strip_tags(desc.group(1))
    text = re.sub(
        r"^(?:KS2 to KS3|GCSE|A-Level|Undergraduate|Postgraduate|Applied physics|"
        r"Frontier research|Critical review|Quantum)\s+guide\.\s*",
        "",
        text,
        flags=re.I,
    )
    phrases: list[str] = []
    for segment in text.split(","):
        segment = segment.strip()
        if not segment:
            continue
        if " and " in segment:
            left, right = segment.rsplit(" and ", 1)
            if left.strip():
                phrases.append(left.strip())
            phrases.append(right.strip())
        else:
            phrases.append(segment)
    for phrase in phrases:
        phrase = normalize_term(phrase)
        if is_skip_term(phrase) or is_poor_term(phrase):
            continue
        if len(phrase) < 3 or len(phrase.split()) > 5:
            continue
        key = phrase.lower()
        if key not in found:
            found[key] = (phrase, guess_definition(phrase, page_html))
    return list(found.values())


def formula_display_key(raw: str) -> str | None:
    """Never truncate LaTeX mid-command — invalid math won't render in MathJax."""
    raw = raw.strip()
    if not raw:
        return None
    if looks_like_latex(raw):
        if len(raw) > MAX_FORMULA_DISPLAY:
            return None
        return raw
    if len(raw) > 120:
        return raw[:117] + "..."
    return raw


def store_formula(found: dict[str, str], raw: str, text: str) -> None:
    key = formula_display_key(raw)
    if not key or key in found:
        return
    found[key] = describe_formula(raw, text)


def extract_formulae(cards: list[str]) -> list[tuple[str, str]]:
    text = "\n".join(cards)
    found: dict[str, str] = {}
    for regex in (MATH_BLOCK_RE, DOLLAR_BLOCK_RE):
        for m in regex.finditer(text):
            raw = normalize_extracted_math(strip_tags(m.group(1)))
            if not is_key_formula(raw):
                continue
            store_formula(found, raw, text)

    for m in DOLLAR_INLINE_RE.finditer(text):
        raw = strip_tags(m.group(1))
        if not is_key_formula(raw):
            continue
        store_formula(found, raw, text)

    for m in MATH_INLINE_RE.finditer(text):
        raw = strip_tags(m.group(1))
        if not is_key_formula(raw):
            continue
        store_formula(found, raw, text)

    for m in CODE_RE.finditer(text):
        raw = strip_tags(m.group(1))
        if not is_key_formula(raw):
            continue
        if raw not in found:
            lhs_parts = raw.split("=")[0].strip().split()
            lhs = lhs_parts[-1] if lhs_parts else raw
            definition = describe_formula(raw, text)
            if definition.strip().rstrip(".") == raw.strip().rstrip("."):
                definition = f"Defines {lhs} in this topic."
            found[raw] = definition

    for m in re.finditer(
        r"<div class=\"callout\">.*?<strong>([^<:]+):</strong>\s*([^<]+)",
        text,
        re.DOTALL | re.IGNORECASE,
    ):
        label = strip_tags(m.group(1)).lower()
        if any(k in label for k in ("equation", "formula", "key equation", "si form")):
            body = strip_tags(m.group(2))
            if body and body not in found:
                found[body] = body if len(body) < 120 else "Highlighted equation from the lesson."

    return sorted(found.items(), key=lambda x: x[0].lower())


def extract_acronyms(cards: list[str], page_html: str) -> list[tuple[str, str]]:
    plain = strip_tags("\n".join(cards))
    found: dict[str, str] = {}

    for acr, definition in ACRONYM_GLOSSARY.items():
        if re.search(rf"\b{re.escape(acr)}\b", plain):
            found[acr] = definition

    for m in re.finditer(r"\b[A-Z][A-Z0-9]{1,5}(?:-[A-Z0-9]+)?\b", plain):
        acr = m.group(0)
        if acr in SKIP_ACRONYMS or acr in found:
            continue
        if is_false_acronym(acr, page_html):
            continue
        definition = guess_definition(acr, plain)
        if definition.startswith("Introduced and explained"):
            continue
        definition = strip_term_echo(acr, clean_definition(definition, term=acr))
        if is_generic_definition(definition) or definition.rstrip().endswith(":"):
            continue
        found[acr] = definition

    return sorted(found.items(), key=lambda x: x[0])


def definition_quality(defn: str, term: str) -> int:
    score = max(0, 180 - len(defn))
    low = defn.lower()
    if low.startswith(term.lower()):
        score -= 40
    if "introduced and explained" in low:
        score -= 20
    if term.lower() in low and "(" in defn:
        score -= 10
    return score


def add_term(
    found: dict[str, tuple[str, str]],
    term: str,
    definition: str,
    *,
    context_html: str = "",
) -> None:
    term = normalize_term(term)
    if is_skip_term(term) or is_template_section(term) or is_poor_term(term):
        return
    if is_section_heading_title(term):
        return
    definition = clean_definition(definition, term=term)
    if context_html:
        definition = enrich_definition_from_context(term, definition, context_html)
    if definition and definition[0].islower():
        definition = definition[0].upper() + definition[1:]
    if len(definition) < 12 or is_generic_definition(definition):
        return
    if definition.rstrip().endswith(":"):
        return
    if len(definition) > 240:
        definition = definition[:237] + "..."
    key = term.lower()
    if key not in found or definition_quality(definition, term) > definition_quality(
        found[key][1], term
    ):
        found[key] = (term, definition)


def extract_terms(cards: list[str], page_html: str) -> list[tuple[str, str]]:
    found: dict[str, tuple[str, str]] = {}

    for card in cards:
        li_defined: set[str] = set()
        for m in re.finditer(
            r"<li>\s*<strong>(.*?)</strong>\s*(?:\(([^)]+)\)|[—–-]\s*(.*?))\s*</li>",
            card,
            re.DOTALL | re.IGNORECASE,
        ):
            term = normalize_term(m.group(1))
            definition = strip_tags(m.group(2) or m.group(3) or "")
            if definition and not definition.endswith("."):
                definition += "."
            add_term(found, term, definition)
            li_defined.add(term.lower())

        for m in H3_RE.finditer(card):
            title = normalize_term(m.group(1))
            if is_skip_term(title) or is_section_heading_title(title) or is_poor_term(title):
                continue
            scope = text_after_heading(card, title)
            scoped = sentences(scope)
            definition = scoped[0] if scoped else guess_definition(title, scope)
            if is_generic_definition(definition):
                continue
            add_term(found, title, definition, context_html=card)

        for m in re.finditer(
            r"<(?:p|div class=\"callout\"|div class=\"warning\")[^>]*>(.*?)</(?:p|div)>",
            card,
            re.DOTALL | re.IGNORECASE,
        ):
            block = m.group(1)
            if "<li>" in block:
                continue
            for sm in STRONG_RE.finditer(block):
                term = normalize_term(sm.group(1))
                if term.lower().endswith(":") or "?" in term:
                    continue
                if term.lower() in li_defined:
                    continue
                add_term(found, term, guess_definition(term, block), context_html=card)

        for m in re.finditer(r"<th>(.*?)</th>", card, re.DOTALL | re.IGNORECASE):
            term = normalize_term(m.group(1))
            add_term(found, term, guess_definition(term, card))

        for m in re.finditer(r"misconception is:\s*([^.<]+)", card, re.I):
            statement = strip_tags(m.group(1))
            if statement:
                add_term(found, "Common misconception", statement.strip() + ".")

        for m in re.finditer(
            r"<strong>([^<]+):</strong>\s*([^<]{10,200})",
            card,
            re.DOTALL | re.IGNORECASE,
        ):
            label = normalize_term(m.group(1)).lower()
            if label in SKIP_TERMS or label in {"learning anchor", "calculation strategy"}:
                body = strip_tags(m.group(2))
                for sm in STRONG_RE.finditer(m.group(2)):
                    term = normalize_term(sm.group(1))
                    add_term(found, term, guess_definition(term, body))
                continue
            if label in {"common exam trap", "key idea"}:
                body = strip_tags(m.group(2))
                add_term(found, label.title(), body)

        for m in re.finditer(r"<li>(.*?)</li>", card, re.DOTALL | re.IGNORECASE):
            li = m.group(1)
            if "<code>" in li and "=" not in strip_tags(li):
                continue
            plain_li = strip_tags(li)
            if "=" in plain_li and len(plain_li) < 12:
                continue
            if len(plain_li) > 25 and not plain_li.startswith("State "):
                for sm in STRONG_RE.finditer(li):
                    term = normalize_term(sm.group(1))
                    add_term(found, term, guess_definition(term, li), context_html=card)

    # Drop near-duplicate shorter terms when a longer term contains them
    items = sorted(found.values(), key=lambda x: x[0].lower())
    pruned: list[tuple[str, str]] = []
    for term, definition in items:
        low = term.lower()
        if any(low != other.lower() and low in other.lower() for other, _ in pruned):
            continue
        pruned.append((term, definition))
    return pruned


LATEX_MARKERS = re.compile(r"\\[a-zA-Z]+|\\[^a-zA-Z]|[_^{}]")


def looks_like_latex(text: str) -> bool:
    text = text.strip()
    if not text:
        return False
    if text.startswith((r"\(", r"\[", "$$", "$")):
        return True
    return bool(LATEX_MARKERS.search(text))


def looks_like_math_expression(text: str) -> bool:
    text = strip_tags(text).strip()
    if not text:
        return False
    if looks_like_latex(text):
        return True
    if re.fullmatch(r"[A-Za-z]", text):
        return True
    if re.fullmatch(r"[A-Za-z][0-9]+(?:'|′)?", text):
        return True
    if re.search(
        r"\b(the|and|for|with|from|that|this|when|where|often|linked)\b", text, re.I
    ):
        return False
    if len(text) > MAX_FORMULA_DISPLAY:
        return False
    if "=" in text and text.count("=") <= 3:
        residue = re.sub(
            r"[A-Za-z0-9=+\-*/^()_\[\]:,.|·×∝→±'√∀∃≤≥≠≈Σπ²³⁴\s]",
            "",
            text,
        )
        if not residue:
            return True
        if re.search(r"[A-Za-z]\([^)]+\)", text):
            return True
        if text.startswith("[") and re.search(r"\[[^\]]+\]", text):
            return True
    return False


def _convert_divisions(expr: str) -> str:
    match = re.fullmatch(r"([^/]+?) / (.+)", expr.strip())
    if match:
        numerator = match.group(1).strip()
        denominator = match.group(2).strip()
        return rf"\frac{{{numerator}}}{{{denominator}}}"
    return expr


def plain_math_to_latex(expr: str) -> str:
    expr = strip_tags(expr).strip()
    expr = expr.replace("π", r"\pi ")
    expr = re.sub(r"\\pi\s+", r"\\pi ", expr)
    expr = expr.replace("²", "^2").replace("³", "^3").replace("⁴", "^4")
    expr = re.sub(r"√\(([^)]+)\)", r"\\sqrt{\1}", expr)
    expr = re.sub(r"√([A-Za-z0-9]+)", r"\\sqrt{\1}", expr)
    expr = re.sub(r"\s*=\s*", " = ", expr)
    if " / " not in expr:
        return expr
    if " = " in expr:
        lhs, rhs = expr.split(" = ", 1)
        return f"{lhs.strip()} = {_convert_divisions(rhs)}"
    return _convert_divisions(expr)


def fix_latex_escaping(text: str) -> str:
    """Collapse double-escaped TeX (\\\\frac) that breaks MathJax rendering."""
    prev = None
    while prev != text:
        prev = text
        text = re.sub(r"\\{2,}(?=[a-zA-Z{\[])", r"\\", text)
    return text


def fix_latex_in_html(html: str) -> str:
    for pattern in (
        re.compile(r"\\\((.*?)\\\)", re.DOTALL),
        re.compile(r"\\\[(.*?)\\\]", re.DOTALL),
        re.compile(r"\$\$(.*?)\$\$", re.DOTALL),
    ):
        html = pattern.sub(
            lambda m: m.group(0).replace(m.group(1), fix_latex_escaping(m.group(1)), 1),
            html,
        )
    return html


def normalize_extracted_math(raw: str) -> str:
    raw = re.sub(r"\s+", " ", raw).strip()
    if raw.startswith(r"\[") and raw.endswith(r"\]"):
        raw = raw[2:-2].strip()
    if raw.startswith(r"\(") and raw.endswith(r"\)"):
        raw = raw[2:-2].strip()
    return fix_latex_escaping(raw)


def format_formula_label(name: str, *, mathjax: bool = True) -> str:
    name = normalize_extracted_math(name)
    if mathjax and looks_like_math_expression(name):
        latex = plain_math_to_latex(name)
        return rf"\({latex}\)"
    if re.fullmatch(r"[A-Za-z]", name):
        return f"<var>{html.escape(name)}</var>"
    return html.escape(name)


def format_definition(defn: str, *, mathjax: bool = False) -> str:
    defn = defn.strip()
    if looks_like_latex(defn) or re.search(r"\\\(|\\\[|\$\$", defn):
        return defn
    if mathjax and MATH_IN_TEXT_RE.search(defn):
        parts: list[str] = []
        last = 0
        for match in MATH_IN_TEXT_RE.finditer(defn):
            parts.append(html.escape(defn[last : match.start()]))
            expr = re.sub(r"[.,;:!?]+$", "", match.group(0).strip())
            expr = plain_math_to_latex(expr)
            parts.append(rf"\({expr}\)")
            last = match.end()
        parts.append(html.escape(defn[last:]))
        return "".join(parts)
    return html.escape(defn)


GREEK_UNICODE: dict[str, tuple[str, str]] = {
    "alpha": ("alpha", "α"),
    "beta": ("beta", "β"),
    "gamma": ("gamma", "γ"),
    "delta": ("delta", "δ"),
    "epsilon": ("epsilon", "ε"),
    "varepsilon": ("epsilon", "ε"),
    "zeta": ("zeta", "ζ"),
    "eta": ("eta", "η"),
    "theta": ("theta", "θ"),
    "vartheta": ("theta", "ϑ"),
    "iota": ("iota", "ι"),
    "kappa": ("kappa", "κ"),
    "lambda": ("lambda", "λ"),
    "mu": ("mu", "μ"),
    "nu": ("nu", "ν"),
    "xi": ("xi", "ξ"),
    "pi": ("pi", "π"),
    "rho": ("rho", "ρ"),
    "sigma": ("sigma", "σ"),
    "tau": ("tau", "τ"),
    "upsilon": ("upsilon", "υ"),
    "phi": ("phi", "φ"),
    "varphi": ("phi", "φ"),
    "chi": ("chi", "χ"),
    "psi": ("psi", "ψ"),
    "omega": ("omega", "ω"),
    "hbar": ("h-bar", "ℏ"),
    "Gamma": ("capital Gamma", "Γ"),
    "Delta": ("capital Delta", "Δ"),
    "Theta": ("capital Theta", "Θ"),
    "Lambda": ("capital Lambda", "Λ"),
    "Sigma": ("capital Sigma", "Σ"),
    "Phi": ("capital Phi", "Φ"),
    "Psi": ("capital Psi", "Ψ"),
    "Omega": ("capital Omega", "Ω"),
}

MATH_FUNCTION_NAMES: dict[str, tuple[str, str]] = {
    "sin": ("sine", "Trigonometric sine function."),
    "cos": ("cosine", "Trigonometric cosine function."),
    "tan": ("tangent", "Trigonometric tangent function."),
    "ln": ("natural logarithm", "Logarithm base e."),
    "log": ("logarithm", "Logarithm function."),
    "exp": ("exponential", "Exponential function (e to the power)."),
    "sqrt": ("square root", "Square-root radical."),
    "sum": ("summation", "Sum over an index range."),
    "int": ("integral", "Integral sign."),
    "lim": ("limit", "Limit operator."),
    "partial": ("partial derivative", "Partial-derivative symbol (∂)."),
    "nabla": ("nabla (del)", "Vector differential operator (∇)."),
    "infty": ("infinity", "Infinity symbol (∞)."),
    "cdot": ("centred dot", "Multiplication dot (·)."),
    "times": ("times", "Multiplication cross (×)."),
    "pm": ("plus-minus", "Plus-or-minus sign (±)."),
    "leq": ("less than or equal", "Inequality symbol (≤)."),
    "geq": ("greater than or equal", "Inequality symbol (≥)."),
    "neq": ("not equal", "Inequality symbol (≠)."),
    "approx": ("approximately equal", "Approximation symbol (≈)."),
    "propto": ("proportional to", "Proportionality symbol (∝)."),
    "rightarrow": ("right arrow", "Arrow (→)."),
    "leftarrow": ("left arrow", "Arrow (←)."),
    "Rightarrow": ("implies arrow", "Double arrow (⇒)."),
    "frac": ("fraction bar", "Fraction layout (numerator over denominator)."),
    "dfrac": ("display fraction bar", "Display-style fraction."),
}

VARIABLE_NAMES: dict[str, tuple[str, str]] = {
    "H": ("capital H", "Hamiltonian (energy operator)."),
    "Q": ("capital Q", "Quality factor."),
    "P": ("capital P", "Pressure or momentum quadrature (context-dependent)."),
    "X": ("capital X", "Position quadrature or variable."),
    "D": ("capital D", "Displacement operator or distance."),
    "g": ("lowercase g", "Coupling strength or gravitational acceleration."),
    "n": ("lowercase n", "Photon number or integer index."),
    "m": ("lowercase m", "Mass or slope."),
    "v": ("lowercase v", "Velocity."),
    "a": ("lowercase a", "Annihilation operator or acceleration."),
    "t": ("lowercase t", "Time."),
    "f": ("lowercase f", "Function or frequency."),
    "x": ("lowercase x", "Position or independent variable."),
    "y": ("lowercase y", "Dependent variable."),
    "u": ("lowercase u", "Substitution variable or internal mode."),
    "i": ("lowercase i", "Imaginary unit (√−1)."),
    "e": ("lowercase e", "Euler's number (base of natural log)."),
    "c": ("lowercase c", "Speed of light or subscript label (cavity)."),
    "R": ("capital R", "Radius, reflectivity, or resistance."),
    "F": ("capital F", "Force or finesse."),
    "W": ("capital W", "Weight or work."),
    "E": ("capital E", "Energy or electric field."),
    "B": ("capital B", "Magnetic field."),
    "I": ("capital I", "Current or moment of inertia."),
    "V": ("capital V", "Voltage or volume."),
    "T": ("capital T", "Temperature or period."),
    "N": ("capital N", "Newton (unit) or particle number."),
    "S": ("capital S", "Entropy or action."),
    "L": ("capital L", "Length, angular momentum, or inductance."),
    "p": ("lowercase p", "Momentum or pressure."),
    "k": ("lowercase k", "Spring constant or wave number."),
    "r": ("lowercase r", "Radius or position vector magnitude."),
    "q": ("lowercase q", "Charge or generalised coordinate."),
}

EXPLICIT_SYMBOL_RULES: list[tuple[str, str, str, str]] = [
    (r"\\begin\{pmatrix\}", r"\begin{pmatrix}", "parenthesis matrix (pmatrix)", "Matrix or vector written in large parentheses."),
    (r"a\^\\dagger", r"a^\dagger", "a-dagger", "Creation operator (dagger superscript on a)."),
    (r"(?<![a-zA-Z])a\|", r"a", "a (lowercase)", "Annihilation operator."),
    (r"(?<![a-zA-Z])a\^", r"a", "a (lowercase)", "Annihilation operator."),
    (r"\\hat\{n\}", r"\hat{n}", "n-hat", "Number operator (circumflex over n)."),
    (r"\\langle\s*\\hat\{n\}\s*\\rangle", r"\langle\hat{n}\rangle", "expectation of n-hat", "Angle brackets — expectation value (mean photon number)."),
    (r"\\|0\\rangle", r"|0\rangle", "ket zero", "Dirac ket — vacuum (zero-photon) state."),
    (r"\\|n\\rangle", r"|n\rangle", "ket n", "Dirac ket — Fock state with n photons."),
    (r"\\|\alpha\\rangle", r"|\alpha\rangle", "ket alpha", "Dirac ket — coherent state with amplitude α."),
    (r"\\alpha\^\*", r"\alpha^*", "alpha-star", "Complex conjugate of α (asterisk superscript)."),
    (r"\\mathcal\{F\}", r"\mathcal{F}", "calligraphic F", "Calligraphic capital F (cavity finesse)."),
    (r"\\mathcal\{R\}", r"\mathcal{R}", "calligraphic R", "Calligraphic capital R (mirror reflectivity)."),
    (r"\\omega_c", r"\omega_c", "omega-sub-c", "Greek omega with subscript c (cavity frequency)."),
    (r"\\omega_a", r"\omega_a", "omega-sub-a", "Greek omega with subscript a (atomic frequency)."),
    (r"\\sigma_z", r"\sigma_z", "sigma-sub-z", "Pauli Z operator (sigma with subscript z)."),
    (r"\\sigma_\+", r"\sigma_+", "sigma-plus", "Raising operator (sigma with plus subscript)."),
    (r"\\sigma_-", r"\sigma_-", "sigma-minus", "Lowering operator (sigma with minus subscript)."),
    (r"P_\{\\text\{coincidence\}\}", r"P_{\text{coincidence}}", "P-sub-coincidence", "Probability with subscript label coincidence."),
    (r"a_1'", r"a_1'", "a-one-prime", "Annihilation operator for output mode 1 (prime mark)."),
    (r"a_2'", r"a_2'", "a-two-prime", "Annihilation operator for output mode 2 (prime mark)."),
    (r"a_1", r"a_1", "a-sub-1", "Annihilation operator for mode 1."),
    (r"a_2", r"a_2", "a-sub-2", "Annihilation operator for mode 2."),
    (r"\\dagger", r"\dagger", "dagger", "Hermitian-conjugate / creation-operator dagger (†)."),
    (r"f'", r"f'", "f-prime", "Prime notation — first derivative of f."),
    (r"f''", r"f''", "f-double-prime", "Double-prime notation — second derivative of f."),
    (r"\\dfrac\{dy\}\{dx\}", r"\dfrac{dy}{dx}", "dy by dx", "Derivative of y with respect to x."),
    (r"\\frac\{dy\}\{dx\}", r"\frac{dy}{dx}", "dy by dx", "Derivative of y with respect to x."),
    (r"\\frac\{d\^2y\}\{dx\^2\}", r"\frac{d^2y}{dx^2}", "d-squared y by dx-squared", "Second derivative of y with respect to x."),
]


def gather_code_corpus(cards: list[str]) -> str:
    chunks: list[str] = []
    for card in cards:
        for m in CODE_RE.finditer(card):
            chunks.append(strip_tags(m.group(1)))
    return "\n".join(chunks)


def gather_math_corpus(cards: list[str], formulae: list[tuple[str, str]]) -> str:
    chunks = [name for name, _ in formulae]
    chunks.append(gather_code_corpus(cards))
    for card in cards:
        for regex in (MATH_BLOCK_RE, MATH_INLINE_RE, DOLLAR_BLOCK_RE, DOLLAR_INLINE_RE):
            for m in regex.finditer(card):
                chunks.append(strip_tags(m.group(1)))
    return "\n".join(chunks)


def symbol_store_key(display: str) -> str:
    key = re.sub(r"\s+", "", display).lower()
    key = re.sub(r"\{([^}]+)\}", r"\1", key)
    return key


def role_from_page(symbol_latex: str, page_text: str) -> str:
    compact = re.sub(r"\s+", "", symbol_latex)
    patterns = [
        rf"([a-z][a-z\s\-]{{2,40}}?)\s*\\\(\s*{re.escape(compact)}\s*\\\)",
        rf"\\\(\s*{re.escape(compact)}\s*\\\)\s*(?:is|means|counts|denotes|represents)\s+([^.,;]+)",
    ]
    scoped = CONTENT_KEY_RE.sub("", page_text)
    plain = strip_tags(scoped)
    bad_fragments = ("symbol names", "formulae", "topic review", "acronyms", "key terms")
    bad_starts = (
        "states ", "separable", "measuring", "es are", "pure state", "joint ",
        "subsystem", "and ", "the ", "for ", "when ", "if ",
    )
    for pat in patterns:
        m = re.search(pat, plain, re.I)
        if m:
            role = re.sub(r"\s+", " ", m.group(1).strip())
            role_low = role.lower()
            if 8 < len(role) < 100 and not any(b in role_low for b in bad_fragments):
                if not any(role_low.startswith(b) for b in bad_starts):
                    return role[0].upper() + role[1:] + "."
    return ""


INCOMPLETE_TEX_COMMANDS = {
    "frac", "dfrac", "sqrt", "sum", "int", "text", "mathrm", "mathbf",
    "mathcal", "hat", "left", "right", "begin", "end", "big", "Big",
}


def symbol_priority(called: str) -> int:
    low = called.lower()
    if any(k in low for k in ("dagger", "hat", "ket", "expectation", "sigma-", "omega-sub")):
        return 0
    if "calligraphic" in low or "greek" in low or "h-bar" in low:
        return 1
    if "sub" in low or "prime" in low:
        return 2
    if low.startswith("capital ") or low.startswith("lowercase "):
        return 4
    return 3


def add_symbol_entry(
    found: dict[str, tuple[str, str, str]],
    display: str,
    called: str,
    meaning: str,
    page_text: str = "",
) -> None:
    display = display.strip()
    if not display:
        return
    role = role_from_page(display, page_text) if page_text else ""
    if role and role not in meaning:
        meaning = f"{meaning} On this page: {role}"
    key = symbol_store_key(display)
    if key not in found:
        found[key] = (display, called, meaning)


def extract_symbols(
    cards: list[str],
    formulae: list[tuple[str, str]],
    page_html: str,
) -> list[tuple[str, str, str]]:
    corpus = gather_math_corpus(cards, formulae)
    code_corpus = gather_code_corpus(cards)
    if not corpus.strip():
        return []

    found: dict[str, tuple[str, str, str]] = {}
    set_theory = is_set_theory_context(corpus + code_corpus + page_html)

    if set_theory:
        for char, display, called, meaning in SET_THEORY_UNICODE_SYMBOLS:
            if char in code_corpus or char in corpus:
                add_symbol_entry(found, display, called, meaning, page_html)
        if re.search(r"A['′]|Aᶜ|A\^c", code_corpus + corpus):
            add_symbol_entry(
                found,
                r"A', A^c",
                "A prime or A complement",
                "Elements of U not in A (logic NOT).",
                page_html,
            )
        if "iff" in code_corpus.lower() or r"\iff" in corpus:
            add_symbol_entry(
                found,
                r"\iff",
                "if and only if",
                "Equivalence — used for set equality and proper subset definitions.",
                page_html,
            )
        if "{" in code_corpus and "}" in code_corpus:
            add_symbol_entry(
                found,
                r"\{ \}",
                "set braces",
                r"Enclose roster or set-builder elements, e.g. \(\{1,2,3\}\).",
                page_html,
            )

    quantum_rule_markers = ("ket", "dagger", "annihilation", "creation", "fock", "dirac")

    for pattern, display, called, meaning in EXPLICIT_SYMBOL_RULES:
        if set_theory and any(marker in called.lower() for marker in quantum_rule_markers):
            continue
        if re.search(pattern, corpus):
            add_symbol_entry(found, display, called, meaning, page_html)

    for m in re.finditer(r"\\mathcal\{([^}]+)\}", corpus):
        letter = m.group(1)
        add_symbol_entry(
            found,
            rf"\mathcal{{{letter}}}",
            f"calligraphic {letter}",
            f"Calligraphic capital {letter} (script face).",
            page_html,
        )

    for m in re.finditer(r"\\hat\{([^}]+)\}", corpus):
        inner = m.group(1)
        add_symbol_entry(
            found,
            rf"\hat{{{inner}}}",
            f"{inner}-hat",
            f"Operator hat over {inner} — quantum observable or operator.",
            page_html,
        )

    for m in re.finditer(r"\\mathbf\{([^}]+)\}", corpus):
        inner = m.group(1)
        add_symbol_entry(
            found,
            rf"\mathbf{{{inner}}}",
            f"bold {inner}",
            f"Bold vector or matrix ({inner}).",
            page_html,
        )

    for m in re.finditer(r"\\mathrm\{([^}]+)\}", corpus):
        inner = m.group(1)
        add_symbol_entry(
            found,
            rf"\mathrm{{{inner}}}",
            f"roman {inner}",
            f"Upright (roman) typesetting for {inner}.",
            page_html,
        )

    for m in re.finditer(
        r"\\(omega|tau|sigma|alpha|beta|gamma|delta|theta|pi|mu|lambda|rho|phi|psi|epsilon|eta|kappa|nu|xi|chi)_(?:\{([^}]+)\}|([a-zA-Z0-9]+))",
        corpus,
    ):
        base = m.group(1)
        sub = m.group(2) or m.group(3)
        if not base or not sub:
            continue
        display = rf"\{base}_{{{sub}}}"
        greek = GREEK_UNICODE.get(base, (base, ""))[0]
        add_symbol_entry(
            found,
            display,
            f"{greek}-sub-{sub}",
            f"Greek {greek} with subscript {sub}.",
            page_html,
        )

    for m in re.finditer(r"\\big\|_\{([^}]+)\}", corpus):
        sub = m.group(1)
        add_symbol_entry(
            found,
            rf"\big|_{{{sub}}}",
            f"evaluated-at subscript {sub}",
            "Vertical bar with subscript — evaluated at a point.",
            page_html,
        )

    for m in re.finditer(r"\\([a-zA-Z]+)", corpus):
        cmd = m.group(1)
        if cmd in INCOMPLETE_TEX_COMMANDS:
            continue
        if cmd in GREEK_UNICODE:
            greek_name, unicode_ch = GREEK_UNICODE[cmd]
            add_symbol_entry(
                found,
                f"\\{cmd}",
                f"Greek {greek_name}",
                f"Greek letter {greek_name} ({unicode_ch}).",
                page_html,
            )
        elif cmd in MATH_FUNCTION_NAMES and cmd not in {"frac", "dfrac", "cdot", "geq", "leq"}:
            called, meaning = MATH_FUNCTION_NAMES[cmd]
            add_symbol_entry(found, f"\\{cmd}", called, meaning, page_html)

    formula_corpus = " ".join(name for name, _ in formulae)
    has_latex = "\\" in corpus

    def letter_in_formulae(letter: str) -> bool:
        if re.search(
            rf"(?<=[a-zA-Z])\s{re.escape(letter)}\s(?=[a-zA-Z])",
            formula_corpus,
        ):
            return False
        if has_latex:
            return bool(
                re.search(
                    rf"(?<![a-zA-Z\\]){re.escape(letter)}(?![a-zA-Z0-9])",
                    formula_corpus,
                )
            )
        return bool(
            re.search(
                rf"(?:\({re.escape(letter)}[^)]*\)|"
                rf"(?<![a-zA-Z]){re.escape(letter)}\s*=|"
                rf"=\s*{re.escape(letter)}(?![a-zA-Z0-9]))",
                formula_corpus,
            )
        )

    active_letters = SET_THEORY_LETTERS if set_theory else VARIABLE_NAMES
    for letter, (called, meaning) in active_letters.items():
        in_formula = letter_in_formulae(letter)
        in_latex = has_latex and bool(
            re.search(
                rf"(?<![a-zA-Z\\]){re.escape(letter)}(?![a-zA-Z0-9])",
                corpus,
            )
        )
        in_code = bool(
            re.search(
                rf"(?<![a-zA-Z]){re.escape(letter)}(?![a-zA-Z0-9])",
                code_corpus,
            )
        )
        if set_theory:
            if not in_formula and not in_latex and not in_code:
                continue
        elif not in_formula and not in_latex:
            continue
        add_symbol_entry(found, letter, called, meaning, page_html)

    items = [item for item in found.values() if is_actual_symbol(item[0])]
    items = sorted(items, key=lambda x: (symbol_priority(x[1]), x[1].lower()))
    return items[:45]


def build_symbols_section(symbols: list[tuple[str, str, str]], *, mathjax: bool = True) -> str:
    if not symbols:
        return ""
    rows = []
    for display, called, meaning in symbols:
        label = format_formula_label(display, mathjax=mathjax)
        rows.append(
            f'        <div class="content-key__item">'
            f'<dt class="content-key__symbol">{label}</dt>'
            f'<dd><strong>Called:</strong> {html.escape(called)}. {html.escape(meaning)}</dd></div>'
        )
    return (
        '      <h3 class="content-key__heading">Symbol names in formulae</h3>\n'
        '      <dl class="content-key__list">\n'
        + "\n".join(rows)
        + "\n      </dl>\n"
    )


def build_section(
    title: str,
    items: list[tuple[str, str]],
    *,
    formula_labels: bool = False,
    mathjax: bool = True,
) -> str:
    if not items:
        return ""
    rows = []
    for name, definition in items:
        label = (
            format_formula_label(name, mathjax=mathjax)
            if formula_labels
            else html.escape(name)
        )
        dt_class = ' class="content-key__formula"' if formula_labels else ""
        rows.append(
            f'        <div class="content-key__item">'
            f"<dt{dt_class}>{label}</dt>"
            f"<dd>{format_definition(definition, mathjax=mathjax)}</dd></div>"
        )
    return (
        f'      <h3 class="content-key__heading">{html.escape(title)}</h3>\n'
        f'      <dl class="content-key__list">\n'
        + "\n".join(rows)
        + "\n      </dl>\n"
    )


def build_content_key(
    formulae: list[tuple[str, str]],
    symbols: list[tuple[str, str, str]],
    acronyms: list[tuple[str, str]],
    terms: list[tuple[str, str]],
    *,
    mathjax: bool = True,
) -> str | None:
    if not formulae and not symbols and not acronyms and not terms:
        return None

    body = (
        '      <p class="content-key__intro">'
        "Expand this review key before you read, then use it afterwards to check you can "
        "name every symbol, explain each formula, acronym, and term without looking at the lesson."
        "</p>\n"
    )
    body += build_section(
        "Formulae & relationships", formulae[:20], formula_labels=True, mathjax=mathjax
    )
    body += build_symbols_section(symbols, mathjax=mathjax)
    body += build_section("Acronyms", acronyms[:24])
    body += build_section("Key terms & phrases", terms[:35])

    return (
        f'    <details class="content-key" id="topic-review-key">\n'
        f'      <summary class="content-key__summary">Topic review key — formulae, symbols, terms &amp; acronyms</summary>\n'
        f'      <div class="content-key__body">\n'
        f"{body}"
        f"      </div>\n"
        f"    </details>\n"
    )


def inject_key(page_html: str, key_html: str) -> str:
    page_html = CONTENT_KEY_RE.sub("\n", page_html)
    marker = '<div class="content-body">'
    idx = page_html.find(marker)
    if idx == -1:
        return page_html
    insert_at = idx + len(marker)
    return page_html[:insert_at] + "\n\n" + key_html + page_html[insert_at:]


def should_process(path: Path, html_text: str) -> bool:
    if 'class="content-page"' not in html_text and "content-page" not in html_text:
        return False
    return "content-body" in html_text


def process_file(path: Path) -> bool:
    rel = path.relative_to(ROOT).as_posix()
    if rel in CONTENT_KEY_CURATED_PATHS:
        return False

    original = path.read_text(encoding="utf-8")
    if not should_process(path, original):
        return False

    text = fix_latex_in_html(original)
    cards = get_teaching_cards(text)
    if not cards:
        return False

    formulae = extract_formulae(cards)
    symbols = extract_symbols(cards, formulae, text)
    acronyms = extract_acronyms(cards, text)
    terms = extract_terms(cards, text)
    needs_math = page_has_math_content(cards, formulae, text)
    text = ensure_mathjax(text, needs_math=needs_math)
    mathjax = page_has_mathjax(text)
    key = build_content_key(
        formulae, symbols, acronyms, terms, mathjax=mathjax
    )
    if not key:
        return False

    new_text = inject_key(text, key)
    if new_text != original:
        path.write_text(new_text, encoding="utf-8")
        return True
    return False


def main() -> None:
    updated = 0
    skipped = 0
    for path in sorted(ROOT.rglob("*.html")):
        if any(part.startswith(".") for part in path.parts):
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except OSError:
            continue
        if not should_process(path, text):
            skipped += 1
            continue
        if process_file(path):
            updated += 1

    print(f"Content keys added/updated: {updated}, skipped: {skipped}")


if __name__ == "__main__":
    main()
