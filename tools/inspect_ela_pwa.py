import re
import zipfile
from pathlib import Path


def sheet_names(path: Path) -> list[str]:
    with zipfile.ZipFile(path) as z:
        wb = z.read("xl/workbook.xml").decode("utf-8", "replace")
        return re.findall(r'<sheet[^>]*name="([^"]+)"', wb)


def sheet_sample(path: Path, sheet_file: str, limit: int = 25) -> None:
    with zipfile.ZipFile(path) as z:
        shared: list[str] = []
        if "xl/sharedStrings.xml" in z.namelist():
            ss = z.read("xl/sharedStrings.xml").decode("utf-8", "replace")
            shared = re.findall(r"<t(?:[^>]*)?>([\s\S]*?)</t>", ss)

        txt = z.read(sheet_file).decode("utf-8", "replace")
        rows = re.findall(r'<row[^>]*r="(\d+)"[^>]*>([\s\S]*?)</row>', txt)
        print(f"  rows: {len(rows)}")
        for rn, content in rows[:limit]:
            cells = re.findall(r'<c([^>]*)>([\s\S]*?)</c>', content)
            vals = []
            for attrs, inner in cells:
                ref = re.search(r'\sr="([A-Z]+)(\d+)"', attrs)
                if not ref:
                    continue
                col, row = ref.group(1), ref.group(2)
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
                if val:
                    vals.append(f"{col}{row}={val[:55]}")
            if vals:
                print(f"    r{rn}: " + " | ".join(vals[:8]))


def main() -> None:
    for name in ["ELA_PWA (new).xlsx", "ELA_PWA.xlsx"]:
        path = Path(__file__).resolve().parents[1] / "excel" / name
        if not path.exists():
            continue
        print("=" * 72)
        print(path.name)
        sheets = sheet_names(path)
        print(f"SHEETS ({len(sheets)}):")
        for i, s in enumerate(sheets, 1):
            print(f"  {i:2}. {s}")

        with zipfile.ZipFile(path) as z:
            worksheet_files = sorted(
                n for n in z.namelist() if re.match(r"xl/worksheets/sheet\d+\.xml", n)
            )

        # sample a few high-value tabs by name hints
        hints = [
            "PWA",
            "Calculations",
            "TRANSFORMER",
            "TRU",
            "COOLING",
            "BATT",
            "CIRCUIT",
            "BUS",
            "DATA",
            "SNAPSHOT",
            "MAX TRU",
            "IDG",
        ]
        print("\nSHEET SAMPLES:")
        for sheet_file in worksheet_files:
            with zipfile.ZipFile(path) as z:
                wb = z.read("xl/workbook.xml").decode("utf-8", "replace")
            # map sheet index to name
            idx = int(re.search(r"sheet(\d+)", sheet_file).group(1))
            if idx <= len(sheets):
                sname = sheets[idx - 1]
            else:
                sname = sheet_file
            if not any(h.lower() in sname.lower() for h in hints):
                continue
            print(f"\n  [{sname}] ({sheet_file})")
            sheet_sample(path, sheet_file)


if __name__ == "__main__":
    main()
