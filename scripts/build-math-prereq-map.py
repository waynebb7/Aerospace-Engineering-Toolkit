#!/usr/bin/env python3
"""Backward-compatible entry point — builds all prerequisite maps."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

if __name__ == "__main__":
    subprocess.run([sys.executable, str(ROOT / "scripts" / "build-prereq-maps.py")], check=True)
