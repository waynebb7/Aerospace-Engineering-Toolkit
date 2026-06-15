"""Extract formulas and labels from TRU and battery sheets."""
import re
import sys
import zipfile
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

path = Path(r"d:/git/engineering/excel/ELA_PWA (new).xlsx")

with zipfile.ZipFile(path) as z:
    wb = z.read("xl/workbook.xml").decode("utf-8", "replace")
    sheets = re.findall(r'<sheet[^>]*name="([^"]+)"', wb)

    shared = []
    if "xl/sharedStrings.xml" in z.namelist():
        ss = z.read("xl/sharedStrings.xml").decode("utf-8", "replace")
        shared = re.findall(r"<t(?:[^>]*)?>([\s\S]*?)</t>", ss)

    def dump(name, row_range=(1, 35), cols="ABCDEFGHIJKLMNOPQRSTUVW"):
        idx = sheets.index(name) + 1
        xml = z.read(f"xl/worksheets/sheet{idx}.xml").decode("utf-8", "replace")
        # also get formulas from sheet if present - check for calcChain
        print(f"\n{'='*60}\n{name} (sheet{idx})\n{'='*60}")
        rows = re.findall(r'<row[^>]*r="(\d+)"[^>]*>([\s\S]*?)</row>', xml)
        rmin, rmax = row_range
        for rn, content in rows:
            ri = int(rn)
            if ri < rmin or ri > rmax:
                continue
            cells = re.findall(r"<c([^>]*)>([\s\S]*?)</c>", content)
            for attrs, inner in cells:
                ref = re.search(r'\sr="([A-Z]+)(\d+)"', attrs)
                if not ref:
                    continue
                col, row = ref.group(1), ref.group(2)
                if col not in cols:
                    continue
                f = re.search(r"<f(?:[^>]*)?>([\s\S]*?)</f>", inner)
                inline = re.search(r"<is><t(?:[^>]*)?>([\s\S]*?)</t></is>", inner)
                vtag = re.search(r"<v>([\s\S]*?)</v>", inner)
                if inline:
                    val = inline.group(1)
                elif vtag:
                    raw = vtag.group(1)
                    if 't="s"' in attrs and raw.isdigit() and int(raw) < len(shared):
                        val = shared[int(raw)]
                    else:
                        val = raw
                else:
                    val = ""
                val = re.sub(r"\s+", " ", val).strip()
                if f:
                    val = val + "  [=" + f.group(1)[:80] + "]"
                if val:
                    print(f"  {col}{row}: {val[:120]}")

    dump("MAX TRU CALC", (1, 30), "BCDEFGHIJKLMNOPQRSTUVWXY")
    dump("BATT ENDURANCE", (1, 30), "BCDEFGHIJK")
