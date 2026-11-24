"""Parse the ISSCC Advance Program PDF into structured paper/author/affiliation data.

Usage: python scripts/parse_program.py ISSCC2027AdvanceProgram.pdf data/papers_raw.json

Relies on the typography of the program:
  paper title  : bold, ~8-9pt, line starts with "<session>.<n>"
  author list  : oblique, ~7.5-8pt, affiliation indices as superscripts
  affiliations : regular, ~7.5-8pt, leading superscript index
"""
import json
import re
import sys

import fitz  # PyMuPDF

PAPER_RE = re.compile(r"^(\d{1,2})\.(\d{1,2})\s+(.*)$")
SESSION_LIST_RE = re.compile(r"Session\s+(\d{1,2}):\s*(.+)")
TIME_RE = re.compile(r"^\d{1,2}:\d{2}\s*[AP]M")


def classify(span, line_max):
    if span["size"] < 0.75 * line_max:
        return "sup"
    font = span["font"]
    if "Bold" in font:
        return "bold"
    if "Obl" in font or "Ital" in font:
        return "ital"
    return "reg"


def encode(spans, kinds):
    """Join spans, wrapping superscripts in braces: 'A. Guo{1}, G. Chen{1,2}'."""
    out = ""
    for s, k in zip(spans, kinds):
        out += "{" + s["text"].strip() + "}" if k == "sup" else s["text"]
    return out.strip()


def session_titles(doc):
    """Session titles from the schedule overview pages (first ~6 pages)."""
    titles = {}
    for pno in range(6):
        lines = doc[pno].get_text().splitlines()
        cur = None
        for raw in lines:
            ln = raw.strip()
            m = SESSION_LIST_RE.search(ln)
            if m:
                cur = int(m.group(1))
                titles[cur] = m.group(2).strip()
            elif cur and ln and not TIME_RE.match(ln) and not ln.startswith(("ISSCC", "Session")) \
                    and "•" not in ln and "•" not in ln and ln[0].islower() is False \
                    and titles[cur].rstrip().endswith(("Management", "Performance", "Wireless Transceivers", "Domain-Specific",
                                                       "Signal", "Frequency,", "Phased Arrays", "Power Management")):
                titles[cur] += " " + ln
                cur = None
            else:
                cur = None
    return titles


def main(pdf_path, out_path):
    doc = fitz.open(pdf_path)
    papers = []
    cur = None
    state = None

    def finish():
        nonlocal cur, state
        if cur:
            papers.append(cur)
        cur, state = None, None

    for pno, page in enumerate(doc):
        for block in page.get_text("dict")["blocks"]:
            for line in block.get("lines", []):
                spans = [s for s in line["spans"] if s["text"].strip()]
                if not spans:
                    continue
                line_max = max(s["size"] for s in spans)
                kinds = [classify(s, line_max) for s in spans]
                main_kinds = {k for k in kinds if k != "sup"}
                text = "".join(s["text"] for s in spans).strip()
                is_title_font = main_kinds == {"bold"} and 7.5 <= line_max <= 10.5

                m = PAPER_RE.match(text)
                if m and is_title_font and not spans[0]["text"][:1].isspace():
                    finish()
                    cur = {"id": f"{m.group(1)}.{m.group(2)}", "session": int(m.group(1)),
                           "title": m.group(3).strip(), "authors_raw": [], "affils_raw": [], "page": pno + 1}
                    state = "title"
                    continue
                if cur is None:
                    continue

                if state == "title" and is_title_font and not TIME_RE.match(text) \
                        and not text.startswith(("Break", "Conclusion", "Lunch", "SESSION")):
                    cur["title"] += " " + text
                elif state in ("title", "authors") and "ital" in main_kinds and 7.0 <= line_max <= 8.5:
                    cur["authors_raw"].append(encode(spans, kinds))
                    state = "authors"
                elif state in ("authors", "affils") and main_kinds == {"reg"} and 7.0 <= line_max <= 8.5:
                    cur["affils_raw"].append(encode(spans, kinds))
                    state = "affils"
                else:
                    finish()
    finish()

    for p in papers:
        p["title"] = re.sub(r"\s+", " ", p["title"]).strip()
    data = {"sessions": session_titles(doc), "papers": papers}
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print(f"{len(papers)} papers, {len(data['sessions'])} session titles")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
