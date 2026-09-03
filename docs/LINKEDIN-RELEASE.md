# LinkedIn release

The LinkedIn edition is a focused static build containing only:

- Power calculators
- AC circuit calculators
- Aerospace electrical design
- Unit converters
- Practical electrical-engineering tools
- Digital logic tools

Build it from the repository root:

```bash
python scripts/build-linkedin-release.py
```

This creates both a browsable folder and an upload-ready ZIP under `dist/`. The
generated directory is intentionally ignored by Git. The full website source is
not changed or reduced by this build.

Serve the folder locally for testing (some browser features do not work over
`file://`):

```bash
python -m http.server 8080 --directory dist/aerospace-engineering-toolkit-linkedin
```

Then open <http://localhost:8080/>.
