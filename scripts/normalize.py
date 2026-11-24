"""Normalize raw parsed program data into papers with structured authors/affiliations.

Usage: python scripts/normalize.py data/papers_raw.json data/papers.json [--dump-orgs]
"""
import json
import re
import sys
import unicodedata

US_STATES = set("""AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC
ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC""".split())
CA_PROVINCES = {"ON", "QC", "BC", "AB"}

COUNTRY_ALIASES = {
    "The Netherlands": "Netherlands", "Netherland": "Netherlands", "UK": "United Kingdom", "U.K.": "United Kingdom",
    "England": "United Kingdom", "Scotland": "United Kingdom", "South Korea": "Korea", "Republic of Korea": "Korea",
    "USA": "USA", "U.S.A.": "USA", "United States": "USA", "P.R. China": "China", "PRC": "China",
}

ACADEMIC_PAT = re.compile(
    r"Universit|Institute of Technology|Institute of Science|College|School|KAIST|POSTECH|DGIST|UNIST|GIST\b|ETH\b|EPFL"
    r"|Politecnico|Polytechnique|Technion|Academy of Sciences|Chinese Academy|KU Leuven|TU Delft|Delft|MIT\b|Caltech"
    r"|Hochschule|Universidad|Universidade|Università|NTU\b|NUS\b|HKUST|IIT\b|Indian Institute|Tokyo Tech|Science Tokyo"
    r"|ShanghaiTech|SUSTech|Fudan|Tsinghua|Peking|Zhejiang|Keio|Waseda|Kyoto|Osaka|Tohoku|UCLA|UCSD|Berkeley|Stanford"
    r"|Purdue|Cornell|Princeton|Harvard|Yale|Columbia|Rice|Duke|NYU|USC|Georgia Tech|KTH|Chalmers|Aalto|Ecole|École"
    r"|Fondazione|National Lab|Laboratory|Research Center|Research Institute|Center of|Centre|BNRist|imec|IMEC|CEA"
    r"|Fraunhofer|CSEM|A\*STAR|IME\b|ITRI|AIST|ETRI|RIKEN|NIST|Max Planck|Sandia|Lincoln",
    re.I,
)
RESEARCH_PAT = re.compile(
    r"imec|IMEC|CEA|Fraunhofer|CSEM|A\*STAR|Institute of Microelectronics|ITRI|AIST|ETRI|RIKEN|NIST|Max Planck|Sandia|Lincoln"
    r"|National Lab|National Center|Research Institute|Research Center|BNRist|Fondazione|Laboratory|Zhangjiang|Pengcheng"
    r"|Chinese Academy|Academy of Sciences|Innovation Center|Institute for|Institute of (?!Technology|Science)",
    re.I,
)
UNIV_PAT = re.compile(r"Universit|College|Institute of Technology|Institute of Science|Politecnico|Polytechnique|KAIST|POSTECH"
                      r"|DGIST|UNIST|ETH|EPFL|Technion|KU Leuven|TU Delft|Hochschule|HKUST|Indian Institute|School", re.I)
# Corporate-research labs and departments that contain "Research"/"Lab" but are companies
INDUSTRY_OVERRIDE = re.compile(r"IBM|TSMC|Samsung|Intel|Microsoft|Google|Nokia|Bell Lab|Sony|Huawei|DAMO|Alibaba|Hupan|NVIDIA"
                               r"|Nvidia|MediaTek|Qualcomm|Apple|Meta|AMD|Toshiba|Hitachi|NTT|Mitsubishi|Panasonic|Bosch"
                               r"|Infineon|NXP|Analog Devices|Texas Instruments|Broadcom|Marvell|SK hynix|SK Hynix|Micron", re.I)


def clean(s):
    s = unicodedata.normalize("NFKC", s).replace("\xa0", " ")
    s = s.replace("‐", "-").replace("‑", "-")
    return re.sub(r"\s+", " ", s).strip()


COUNTRIES = set("""Argentina Australia Austria Belgium Brazil Canada China Czech Republic Denmark Egypt Finland France Germany
Greece Hungary India Ireland Israel Italy Japan Korea Macau Malaysia Mexico Netherlands Norway Poland Portugal Qatar
Romania Russia Saudi Arabia Singapore Slovenia Spain Sweden Switzerland Taiwan Thailand Turkey United Kingdom
United Arab Emirates Vietnam""".replace("Czech Republic", "Czech_Republic").replace("United Kingdom", "United_Kingdom")
    .replace("United Arab Emirates", "United_Arab_Emirates").replace("Saudi Arabia", "Saudi_Arabia").split())
COUNTRIES = {c.replace("_", " ") for c in COUNTRIES} | set(COUNTRY_ALIASES)


def is_complete(text):
    last = text.rstrip(" ,;").split(",")[-1].strip()
    return last in COUNTRIES or last in US_STATES


def merge_affil_lines(lines):
    """Return list of (index_or_None, text) affiliation entries."""
    entries = []
    for ln in lines:
        ln = clean(ln)
        ln = re.sub(r",?\s*\*\s*Equally Credited Authors\s*\(ECAs\)\.?", "", ln, flags=re.I).strip()
        if not ln:
            continue
        for part in re.split(r";\s*(?=\{)", ln):
            part = part.strip().rstrip(";").strip()
            m = re.match(r"^\{([\d,\s]+)\}\s*(.*)$", part)
            if m:
                entries.append([m.group(1).strip(), m.group(2).strip()])
            elif entries and not is_complete(entries[-1][1]):
                entries[-1][1] = (entries[-1][1] + " " + part).strip()
            else:
                entries.append([None, part])
    return [(idx, re.sub(r"\s+,", ",", txt).strip().rstrip(",")) for idx, txt in entries]


def split_location(text):
    """'Org, Dept, City, ST' -> (org_parts, city, country)."""
    parts = [p.strip() for p in text.split(",") if p.strip()]
    if len(parts) >= 2 and parts[-1] in US_STATES:
        return parts[:-2], parts[-2] if len(parts) >= 2 else "", "USA"
    country = COUNTRY_ALIASES.get(parts[-1], parts[-1])
    if country in ("Canada",) and len(parts) >= 3 and parts[-2] in CA_PROVINCES:
        return parts[:-3], parts[-3], country
    if len(parts) >= 3:
        return parts[:-2], parts[-2], country
    if len(parts) == 2:
        return parts[:-1], "", country
    return parts, "", country


def pick_org(org_parts):
    if not org_parts:
        return ""
    if len(org_parts) == 1:
        return org_parts[0]
    # Prefer the university-level component over a department / school prefix
    for p in org_parts:
        if re.search(r"Universit|KAIST|POSTECH|Politecnico|EPFL|ETH Z|Technion|KU Leuven", p, re.I):
            return p
    for p in org_parts:
        if INDUSTRY_OVERRIDE.search(p):
            return p
    return ", ".join(org_parts)


def org_type(org, raw):
    if INDUSTRY_OVERRIDE.search(org):
        return "industry"
    if UNIV_PAT.search(org):
        return "academia"
    if RESEARCH_PAT.search(org):
        return "research"
    return "industry"


AUTHOR_SPLIT = re.compile(r",\s*(?![^{]*\})")


def parse_authors(lines):
    text = clean(" ".join(lines))
    text = re.sub(r"\s*,\s*$", "", text)
    authors = []
    for tok in AUTHOR_SPLIT.split(text):
        tok = tok.strip()
        if not tok:
            continue
        idx = re.findall(r"\{([^}]*)\}", tok)
        name = re.sub(r"\{[^}]*\}", "", tok)
        eca = "*" in name
        name = name.replace("*", "").strip()
        nums = []
        for grp in idx:
            nums += [int(x) for x in re.findall(r"\d+", grp)]
        authors.append({"name": name, "affil_idx": nums, "eca": eca})
    return authors


SESSION_TITLE_FIX = {
    2: "Digital Circuits for Clocking, Power Management and Adaptive Techniques",
    14: "High-Performance Multi-Band Wireless Transceivers and Receivers",
    20: "Advanced Beamforming Techniques for Phased Arrays and Reflectarrays",
    25: "Compute-In-Memory-Centric SoCs and Domain-Specific Accelerators",
}
CAMPUS_ORGS = ("University of California", "University of Texas")


def main(src, dst, dump=False):
    raw = json.load(open(src, encoding="utf-8"))
    meta = json.load(open("data/org_meta.json", encoding="utf-8"))
    aliases, types = meta["aliases"], meta["types"]
    out = []
    for p in raw["papers"]:
        if p["session"] == 1:  # plenary invited talks, not regular submissions
            continue
        affils, idx_map = [], {}
        for idx, txt in merge_affil_lines(p["affils_raw"]):
            now_at = bool(re.match(r"^\*?\s*now (at|with)\s+", txt, re.I))
            txt = re.sub(r"^\*?\s*now (at|with)\s+", "", txt, flags=re.I)
            org_parts, city, country = split_location(txt)
            org = pick_org(org_parts)
            if org in CAMPUS_ORGS and city:
                org = f"{org}, {city}"
            canon = aliases.get(org, org)
            affils.append({"org": canon, "city": city, "country": country,
                           "type": types.get(canon) or org_type(org, txt), "raw": txt, "now_at": now_at})
            if idx:
                for n in re.findall(r"\d+", idx):
                    idx_map[int(n)] = len(affils) - 1
        authors = parse_authors(p["authors_raw"])
        for au in authors:
            if au["affil_idx"]:
                au["affils"] = sorted({idx_map[n] for n in au["affil_idx"] if n in idx_map})
            else:
                au["affils"] = [i for i, a in enumerate(affils) if not a["now_at"]] if not idx_map else [0]
            del au["affil_idx"]
            # primary = affiliations where the work was done (exclude "now at")
            au["primary"] = [i for i in au["affils"] if not affils[i]["now_at"]] or au["affils"]
        out.append({"id": p["id"], "session": p["session"], "title": clean(p["title"]),
                    "authors": authors, "affils": affils, "page": p["page"]})

    sessions = {int(k): SESSION_TITLE_FIX.get(int(k), clean(v)) for k, v in raw["sessions"].items()}
    if dump:
        from collections import Counter
        c = Counter((a["org"], a["country"], a["type"]) for p in out for a in p["affils"])
        for (o, ct, t), n in sorted(c.items()):
            print(f"{n:3d} | {o} | {ct} | {t}")
        return
    data = {"source": "ISSCC 2027 Advance Program", "sessions": sessions, "papers": out}
    with open(dst, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    # JS copy so index.html also works when opened directly from disk (file://, no fetch)
    js_path = re.sub(r"\.json$", ".js", dst)
    for p in data["papers"]:
        for a in p["affils"]:
            a.pop("raw", None)
    with open(js_path, "w", encoding="utf-8") as f:
        f.write("window.ISSCC_DATA = ")
        json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
        f.write(";\n")
    print(f"wrote {len(out)} papers -> {dst}, {js_path}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], "--dump-orgs" in sys.argv)
