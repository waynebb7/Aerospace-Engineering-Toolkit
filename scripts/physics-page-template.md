# Physics teaching page template

Use for every page under `learn/physics/`.

## Paths (topic in subfolder e.g. `ks2-ks3/`, `gcse/`, `a-level/`)

- CSS/JS: `../../../assets/css/corporate.css`, `../../../assets/js/site-layout.js`
- Hub breadcrumb: `../../../index.html`
- Catalog nav: `../index.html` (Physics Subjects Catalog)

## Structure

```html
<body class="content-page">
  <div class="page-container">
    <div class="content-hero">...</div>
    <div class="content-body">
      <!-- Topic review key injected by scripts/apply-content-key.py -->
      <!-- 7 or 8 numbered teaching cards -->
      <!-- 1 quiz card with <details class="quiz-answers"> -->
      <p class="page-footer-note">LEVEL footer text.</p>
    </div>
  </div>
</body>
```

Do NOT add Pre-requisites / Next topics cards — `apply-catalog-progression.py` injects them.

## Level guides

| Folder | Subtitle prefix | Footer note | MathJax |
|--------|-----------------|-------------|---------|
| ks2-ks3 | KS2 to KS3 guide. | KS2 to KS3 physics content. | No |
| gcse | GCSE guide. | GCSE Physics content. | Optional light |
| a-level | A-Level guide. | A-Level Physics content. | Yes 2.7.7 |
| undergraduate | Undergraduate guide. | Undergraduate Physics content. | Yes |
| postgraduate | Postgraduate guide. | Postgraduate / research-level Physics content. | Yes |
| frontier | Frontier research guide. | Frontier Physics content. | Yes |
| applied | Applied physics guide. | Applied physics and engineering content. | Yes |
| speculative | Critical review. | Speculative topics — read with scientific skepticism. | Optional |

## Each teaching card

- `<div class="card"><h2>N) Title</h2>` with substantive paragraphs, lists, equations
- Use `callout`, `two-col`, `warning`, `table-wrap` where helpful
- Include worked examples with real numbers for GCSE+

## Quiz card

- 6 questions in `<ol>`
- `<details class="quiz-answers"><summary class="quiz-answers__summary">Show answers</summary><ol>...</ol></details>`
- Real answers, not "review sections above"
