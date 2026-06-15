#!/usr/bin/env python3
"""Deprecated wrapper — use scripts/build-drilldown-explorers.py."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

if __name__ == "__main__":
    script = Path(__file__).resolve().parent / "build-drilldown-explorers.py"
    subprocess.run([sys.executable, str(script)], check=True)
