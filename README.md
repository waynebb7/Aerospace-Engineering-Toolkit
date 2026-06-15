# Engineering Knowledge Hub

A static reference, calculator, and learning site for electrical engineering, mathematics, physics, and quantum computing. Most pages are plain HTML/CSS/JS; **catalog and prerequisite-map artifacts are regenerated with Python scripts** after content changes.

**Live site:** [https://waynebb7.github.io/engineering/](https://waynebb7.github.io/engineering/)

See [PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md) for the full folder layout and maintenance workflow.

## Start here for contributors

**Browse the repo by folder, not the flat root file list.** Real pages live under `calculators/`, `learn/`, `reference/`, and `maps/`. The ~280 HTML files at the repo root (and in folders like `quantum/`, `basic_physics/`) are **redirect stubs** for old bookmarks — they are hidden in Cursor/VS Code via `.vscode/settings.json`.

| Goal | Where to go |
|------|-------------|
| Site hub | `index.html` |
| Calculators | `calculators/` |
| Lessons & catalogs | `learn/` |
| Variables, equations, PDFs | `reference/` |
| Prerequisite maps | `maps/` |
| Shared CSS/JS | `assets/` |
| Build scripts | `scripts/` |

One-page contributor guide: [docs/CONTRIBUTOR-MAP.md](docs/CONTRIBUTOR-MAP.md)

Refresh IDE hide rules after stub changes:

```bash
python scripts/build-vscode-excludes.py
```

(`ensure-redirect-stubs.py` runs this automatically.)

## Features

- **40+ interactive calculators** — power, AC/three-phase, unit conversion, digital logic, physics, aerospace
- **300+ teaching pages** — mathematics, physics, and quantum catalogs with quizzes and progress tracking
- **Prerequisite maps** — interactive dependency graphs for math, physics, and quantum paths
- **Engineering reference** — variables and equations with click-to-learn modals
- **Shared assets** — `assets/css/corporate.css`, `assets/js/calculator-core.js`, `assets/js/site-layout.js`

## Local development

Use a local web server. Pages that `fetch()` JSON (progress, maps) will not work from `file://` URLs.

```bash
cd engineering
python -m http.server 8080
```

Open [http://localhost:8080/index.html](http://localhost:8080/index.html)

## Project structure (summary)

```
engineering/
├── index.html              # Site hub
├── progress.html           # Learning progress dashboard
├── assets/                 # Shared CSS and JS
├── calculators/            # Calculator pages by category
├── learn/                  # Teaching pages (math, physics, quantum)
├── reference/              # Variables, equations, industry reference
├── maps/                   # Prerequisite maps and topic JSON
├── legacy/                 # Older exploratory tools
├── scripts/                # Build and maintenance scripts
└── docs/                   # Documentation exports
```

Old root paths (e.g. `pure_math_subjects.html`, `differentiation.html`) remain as **redirect stubs** for bookmarks. New content lives under `learn/` and `calculators/`. Redirect stubs are hidden in the IDE — see [docs/CONTRIBUTOR-MAP.md](docs/CONTRIBUTOR-MAP.md).

## Refresh after catalog or map edits

```bash
python scripts/build-topic-catalog.py
python scripts/build-topic-progression.py
python scripts/build-prereq-node-pages.py
python scripts/build-prereq-maps.py
python scripts/build-legacy-physics-list.py
python scripts/apply-catalog-progression.py
python scripts/ensure-redirect-stubs.py
python scripts/check-links.py --scope core
python scripts/check-links.py --scope all
```

Optional script dependencies (quiz answer generation with algebra support):

```bash
pip install -r scripts/requirements.txt
python scripts/build-quiz-answers.py
```

## Adding a calculator

1. Add a shell under `calculators/{category}/`:

```html
<body class="calculator-page" data-calc="my_calc"></body>
```

2. Register fields and `compute` in `assets/js/calculator-registry.js`.

3. Test at `http://localhost:8080/calculators/.../my_calc.html`.

## Quality checks

### JavaScript syntax (matches CI)

```bash
for file in assets/js/*.js; do node --check "$file"; done
```

### Python scripts

```bash
python -m compileall scripts
```

### Internal links

```bash
python scripts/check-links.py --scope core
```

### Catalog link integrity

```bash
python scripts/verify-catalog-links.py
python scripts/verify-quantum-links.py
python scripts/verify-redirect-stubs.py
```

## CI and deployment

GitHub Actions [`.github/workflows/ci.yml`](.github/workflows/ci.yml):

| Job | When | What |
|-----|------|------|
| **check** | Every push and PR | JS syntax, Python compile, generated-artifact drift check, core link check |
| **deploy** | Push to `main` after check passes | GitHub Pages |

### First-time GitHub Pages setup

1. Push this repository to GitHub.
2. **Settings → Pages → Build and deployment → GitHub Actions**
3. Push to `main` or run the workflow manually.

Site URL: `https://<username>.github.io/engineering/`

## License

MIT — see [LICENSE](LICENSE).
