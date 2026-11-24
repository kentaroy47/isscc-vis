(() => {
  "use strict";

  const D = window.ISSCC_DATA;
  const PAPERS = D.papers;
  const SESSIONS = D.sessions;

  // ---------- i18n ----------
  const I18N = {
    ja: {
      title: "ISSCC 2027 採択統計",
      lede: "Advance Program に掲載された通常論文を、所属機関・国・著者ごとに集計しています。",
      theme: "テーマ", themeAria: "表示テーマを切り替え", langBtn: "English",
      controlsAria: "集計条件", overviewAria: "概要",
      countBy: "数え方", modeFirst: "第一著者", modePaper: "全著者（論文単位）", modeAuthor: "著者のべ人数",
      session: "セッション", orgType: "機関種別", all: "すべて",
      allSessions: (n) => `すべて（${n}件）`, sessOpt: (s, t, n) => `S${s}. ${t}（${n ? n + "件" : "未掲載"}）`,
      modeNote: {
        first: "第一著者の所属（筆頭の所属）で 1 論文 = 1 件として数えます。",
        paper: "著者の誰か 1 人でもその機関・国に所属していれば 1 件。共著先も含めた「関与した論文数」です（合計は論文数を超えます）。",
        author: "著者 1 人 = 1 件として、所属ごとに人数を数えます（兼務の著者は各所属に計上）。",
      },
      types: { academia: "大学", industry: "企業", research: "研究機関" },
      chipType: (v) => `機関種別: ${v}`, chipCountry: (v) => `国・地域: ${v}`, chipOrg: (v) => `機関: ${v}`,
      chipClear: (v) => `${v} の絞り込みを解除`, clearAll: "すべて解除",
      tPapers: "論文数", tPapersAll: (n) => `全 ${n} 件中`, tPapersNote: "通常論文（S1 除く）",
      tAuthors: "著者数（のべ）", tAuthorsNote: (x) => `平均 ${x} 人 / 論文`,
      tCountries: "国・地域", tCountriesFirst: "第一著者の所属国", tCountriesAll: "著者の所属国",
      tOrgs: "機関", tOrgsFirst: "第一著者の所属機関", tOrgsAll: "著者の所属機関",
      tIntl: "国際共著", tIntlNote: (n) => `${n} 件`,
      tIA: "産学連携", tIANote: (n) => `大学と企業の共著 ${n} 件`,
      tJapan: "日本", tJapanNote: (r, n) => `${r} 位 / ${n} か国・地域`, none: "該当なし",
      unitPaper: "件", unitAuthor: "人",
      byCountry: "国・地域別",
      countrySubAuthor: (n) => `著者 ${n} 人の所属国（クリックで絞り込み）`,
      countrySubPaper: (n) => `${n} 論文中の件数と割合（クリックで絞り込み）`,
      noData: "該当するデータがありません",
      ttPapers: "論文数", ttAuthors: "著者数", ttShare: "割合", ttOrgs: "機関数", ttMainOrgs: "主な機関",
      ttType: "種別", ttSites: "拠点の国", ttPaperIds: "論文", more: (n) => ` ほか${n}件`,
      collabTitle: "機関の組み合わせ",
      collabSub: "論文ごとに、著者の所属機関の種別構成で分類（数え方によらず論文単位）",
      onlyAcademia: "大学のみ", onlyIndustry: "企業のみ", onlyResearch: "研究機関のみ", mixed: "複数種別の共同",
      mixedDetail: "複数種別の内訳", joinPlus: " + ",
      intlTitle: "国際共著", intlSub: "著者の所属国が 2 か国以上にまたがる論文",
      intl: "国際共著", domestic: "単一の国・地域", topPairs: "多い組み合わせ",
      nPapers: (n) => `${n}件`,
      byOrg: "機関別ランキング",
      orgSub: (n, k) => `${n} 機関中 ${k === null ? "全件" : "上位 " + k + " 機関"}（クリックで絞り込み）`,
      orgTop: "上位 30 機関のみ表示", orgAll: (n) => `すべて表示（${n} 機関）`,
      heatTitle: "セッション × 国・地域",
      heatSub: (a) => `${a ? "著者数" : "論文数"}（数え方・機関種別・国・機関の絞り込みを反映。行クリックでセッションを選択）`,
      other: "その他", total: "計", few: "少", many: (m) => `多（最大 ${m}）`,
      authorTitle: "著者ランキング",
      authorSub: "同姓同名・イニシャル表記の重複を避けるため「氏名 + 所属機関」で同一人物と見なしています",
      authorPosAria: "著者の位置", posFirst: "第一著者", posLast: "最終著者", posAny: "全ての位置",
      posName: { first: "第一著者", last: "最終著者", any: "著者（位置問わず）" },
      authorCaption: (pos, showAll, m, capped) => `${pos}として${showAll ? "の論文数上位" : " 2 件以上の著者（" + m + " 人）"}${capped ? "・上位 40 人まで表示" : ""}`,
      colRank: "順位", colAuthor: "著者", colAffil: "所属", colCountry: "国・地域", colCount: "件数", colPapers: "論文",
      paperTitle: "論文一覧", paperSub: (n) => `${n} 件（行をクリックすると全著者と所属を表示）`,
      searchPh: "タイトル・著者・機関で検索", searchAria: "論文を検索",
      colId: "ID", colTitle: "タイトル", colFirst: "第一著者", colFirstAffil: "第一著者の所属", colNAuth: "著者数",
      nowAt: "（現所属）", eca: " ・ * 同等貢献著者", page: (n) => `Advance Program p.${n}`,
      foot1: "出典: ISSCC 2027 Advance Program（PDF）から自動抽出。プレナリー講演（Session 1）は除外。Session 26「Late Breaking Industry Highlights」は Advance Program 時点で論文未掲載のため含みません。",
      foot2: "国・地域は Program の表記に従います（香港・マカオの機関は “China” と表記されているため中国に含まれます）。機関名は表記ゆれを統合し、企業の部門・研究所は親会社にまとめています（例: TSMC Corporate Research → TSMC）。",
    },
    en: {
      title: "ISSCC 2027 Acceptance Statistics",
      lede: "Regular papers in the Advance Program, broken down by affiliation, country and author.",
      theme: "Theme", themeAria: "Toggle color theme", langBtn: "日本語",
      controlsAria: "Filters", overviewAria: "Overview",
      countBy: "Count by", modeFirst: "First author", modePaper: "Any author (per paper)", modeAuthor: "Author count",
      session: "Session", orgType: "Organization type", all: "All",
      allSessions: (n) => `All (${n} papers)`, sessOpt: (s, t, n) => `S${s}. ${t} (${n ? n : "TBA"})`,
      modeNote: {
        first: "Each paper counts once, credited to the first author's (primary) affiliation.",
        paper: "A paper counts once for every organization / country that any of its authors belongs to, so totals exceed the number of papers.",
        author: "Each author counts once per affiliation (authors with joint appointments count for each).",
      },
      types: { academia: "Academia", industry: "Industry", research: "Research institute" },
      chipType: (v) => `Type: ${v}`, chipCountry: (v) => `Country: ${v}`, chipOrg: (v) => `Org: ${v}`,
      chipClear: (v) => `Remove filter ${v}`, clearAll: "Clear all",
      tPapers: "Papers", tPapersAll: (n) => `of ${n} total`, tPapersNote: "Regular papers (excl. S1)",
      tAuthors: "Authors (total)", tAuthorsNote: (x) => `${x} per paper on average`,
      tCountries: "Countries / regions", tCountriesFirst: "of first authors", tCountriesAll: "of all authors",
      tOrgs: "Organizations", tOrgsFirst: "of first authors", tOrgsAll: "of all authors",
      tIntl: "International", tIntlNote: (n) => `${n} papers`,
      tIA: "Academia–industry", tIANote: (n) => `${n} joint papers`,
      tJapan: "Japan", tJapanNote: (r, n) => `#${r} of ${n} countries`, none: "None",
      unitPaper: "", unitAuthor: "",
      byCountry: "By country / region",
      countrySubAuthor: (n) => `Affiliation country of ${n} authors (click to filter)`,
      countrySubPaper: (n) => `Count and share of ${n} papers (click to filter)`,
      noData: "No matching data",
      ttPapers: "Papers", ttAuthors: "Authors", ttShare: "Share", ttOrgs: "Organizations", ttMainOrgs: "Top organizations",
      ttType: "Type", ttSites: "Locations", ttPaperIds: "Papers", more: (n) => ` +${n} more`,
      collabTitle: "Organization mix",
      collabSub: "Each paper classified by the types of its authors' organizations (always per paper)",
      onlyAcademia: "Academia only", onlyIndustry: "Industry only", onlyResearch: "Research inst. only", mixed: "Mixed types",
      mixedDetail: "Mixed breakdown", joinPlus: " + ",
      intlTitle: "International collaboration", intlSub: "Papers whose authors span two or more countries",
      intl: "International", domestic: "Single country", topPairs: "Top pairs",
      nPapers: (n) => `${n}`,
      byOrg: "Organization ranking",
      orgSub: (n, k) => `${k === null ? "All" : "Top " + k + " of"} ${n} organizations (click to filter)`,
      orgTop: "Show top 30 only", orgAll: (n) => `Show all (${n})`,
      heatTitle: "Session × country",
      heatSub: (a) => `${a ? "Authors" : "Papers"} (reflects count mode and type/country/org filters; click a row to select the session)`,
      other: "Other", total: "Total", few: "Fewer", many: (m) => `More (max ${m})`,
      authorTitle: "Author ranking",
      authorSub: "Authors are identified by name + organization, since names are given as initials",
      authorPosAria: "Author position", posFirst: "First author", posLast: "Last author", posAny: "Any position",
      posName: { first: "first author", last: "last author", any: "author (any position)" },
      authorCaption: (pos, showAll, m, capped) => showAll ? `Most papers as ${pos}${capped ? " (top 40)" : ""}` : `Authors with 2+ papers as ${pos} (${m})${capped ? ", top 40 shown" : ""}`,
      colRank: "Rank", colAuthor: "Author", colAffil: "Affiliation", colCountry: "Country", colCount: "Papers", colPapers: "IDs",
      paperTitle: "Papers", paperSub: (n) => `${n} papers (click a row for all authors and affiliations)`,
      searchPh: "Search title, author, organization", searchAria: "Search papers",
      colId: "ID", colTitle: "Title", colFirst: "First author", colFirstAffil: "First author affiliation", colNAuth: "Authors",
      nowAt: " (now at)", eca: " · * equally credited authors", page: (n) => `Advance Program p.${n}`,
      foot1: "Source: automatically extracted from the ISSCC 2027 Advance Program (PDF). Plenary talks (Session 1) are excluded. Session 26 “Late Breaking Industry Highlights” is not included because its papers were not yet listed in the Advance Program.",
      foot2: "Countries follow the program's notation (institutions in Hong Kong and Macau are listed as “China”). Organization names are normalized, and corporate divisions / labs are merged into the parent company (e.g., TSMC Corporate Research → TSMC).",
    },
  };
  const COUNTRY_JA = {
    China: "中国", USA: "米国", Korea: "韓国", Japan: "日本", Taiwan: "台湾", Netherlands: "オランダ",
    Switzerland: "スイス", Canada: "カナダ", Belgium: "ベルギー", Germany: "ドイツ", "United Kingdom": "英国",
    Italy: "イタリア", Ireland: "アイルランド", Singapore: "シンガポール", Egypt: "エジプト", India: "インド",
    Argentina: "アルゼンチン", Vietnam: "ベトナム", Greece: "ギリシャ", Poland: "ポーランド",
    "Czech Republic": "チェコ", "United Arab Emirates": "UAE", France: "フランス", Israel: "イスラエル",
    Austria: "オーストリア", Sweden: "スウェーデン", Spain: "スペイン", Australia: "オーストラリア",
  };
  const TYPE_VAR = { academia: "--s1", industry: "--s2", research: "--s3" };

  function initialLang() {
    try { const s = localStorage.getItem("isscc-lang"); if (s === "ja" || s === "en") return s; } catch (_) { /* ignore */ }
    const q = new URLSearchParams(location.search).get("lang");
    if (q === "ja" || q === "en") return q;
    return (navigator.language || "ja").toLowerCase().startsWith("ja") ? "ja" : "en";
  }

  const state = { lang: initialLang(), mode: "first", session: "", type: "", country: "", org: "", authorPos: "first", search: "", orgAll: false, open: new Set() };
  const L = () => I18N[state.lang];

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const cname = (c) => (state.lang === "ja" && COUNTRY_JA[c]) || c;
  const tname = (t) => L().types[t] || t;
  const fmtPct = (x) => (x * 100).toFixed(x < 0.1 && x > 0 ? 1 : 0) + "%";
  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const paperKey = (id) => id.split(".").map(Number);
  const byId = (a, b) => { const x = paperKey(a.id), y = paperKey(b.id); return x[0] - y[0] || x[1] - y[1]; };
  const unit = () => (state.mode === "author" ? L().unitAuthor : L().unitPaper);

  function applyStaticText() {
    const t = L();
    document.documentElement.lang = state.lang;
    document.title = t.title;
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t[el.dataset.i18n]; });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => el.setAttribute("aria-label", t[el.dataset.i18nAria]));
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => el.setAttribute("placeholder", t[el.dataset.i18nPh]));
    const lb = $("langBtn");
    lb.textContent = t.langBtn;
    lb.lang = state.lang === "ja" ? "en" : "ja";
    lb.setAttribute("aria-label", state.lang === "ja" ? "Switch to English" : "日本語に切り替え");

    const counts = {};
    PAPERS.forEach((p) => { counts[p.session] = (counts[p.session] || 0) + 1; });
    const sel = $("sessionSel");
    sel.innerHTML = `<option value="">${esc(t.allSessions(PAPERS.length))}</option>` +
      Object.keys(SESSIONS).map(Number).filter((s) => s !== 1).sort((a, b) => a - b)
        .map((s) => `<option value="${s}" ${counts[s] ? "" : "disabled"}>${esc(t.sessOpt(s, SESSIONS[s], counts[s]))}</option>`).join("");
    sel.value = state.session;
    $("typeSel").innerHTML = `<option value="">${esc(t.all)}</option>` +
      Object.keys(TYPE_VAR).map((k) => `<option value="${k}">${esc(tname(k))}</option>`).join("");
    $("typeSel").value = state.type;
  }

  // ---------- data access ----------
  const authorAffils = (p, au) => au.primary.map((i) => p.affils[i]).filter(Boolean);
  const firstAffil = (p) => authorAffils(p, p.authors[0])[0] || p.affils[0];
  const allAffils = (p) => p.authors.flatMap((au) => authorAffils(p, au));
  const typeOk = (a) => !state.type || a.type === state.type;

  /** Values of `dim` the paper "belongs to" in the current mode (for filtering). */
  function paperValues(p, dim) {
    if (state.mode === "first") return new Set([firstAffil(p)[dim]]);
    return new Set(allAffils(p).filter(typeOk).map((a) => a[dim]));
  }

  function filteredPapers({ ignoreSession = false } = {}) {
    return PAPERS.filter((p) => {
      if (!ignoreSession && state.session && String(p.session) !== state.session) return false;
      if (state.mode === "first") {
        if (state.type && firstAffil(p).type !== state.type) return false;
      } else if (state.type && !allAffils(p).some(typeOk)) return false;
      if (state.country && !paperValues(p, "country").has(state.country)) return false;
      if (state.org && !paperValues(p, "org").has(state.org)) return false;
      return true;
    });
  }

  /** Count papers/authors by dimension under the current mode. */
  function countBy(papers, dim) {
    const m = new Map();
    const add = (a, p) => {
      const key = a[dim];
      let e = m.get(key);
      if (!e) { e = { key, n: 0, papers: new Set(), countries: new Map(), type: a.type }; m.set(key, e); }
      e.n += 1; e.papers.add(p.id);
      e.countries.set(a.country, (e.countries.get(a.country) || 0) + 1);
    };
    const uniq = (affils) => { const seen = new Map(); for (const a of affils) if (typeOk(a) && !seen.has(a[dim])) seen.set(a[dim], a); return seen.values(); };
    for (const p of papers) {
      if (state.mode === "first") { const a = firstAffil(p); if (typeOk(a)) add(a, p); }
      else if (state.mode === "paper") { for (const a of uniq(allAffils(p))) add(a, p); }
      else { for (const au of p.authors) for (const a of uniq(authorAffils(p, au))) add(a, p); }
    }
    return [...m.values()].sort((a, b) => b.n - a.n || String(a.key).localeCompare(String(b.key)));
  }

  function denominator(papers) {
    if (state.mode === "author") return papers.reduce((s, p) => s + p.authors.length, 0);
    return papers.length;
  }

  // ---------- tooltip ----------
  const tip = $("tooltip");
  function showTip(html, evt, el) {
    tip.innerHTML = html;
    tip.hidden = false;
    let x, y;
    if (evt && evt.clientX !== undefined && evt.type.startsWith("mouse")) { x = evt.clientX + 14; y = evt.clientY + 14; }
    else { const r = el.getBoundingClientRect(); x = r.left + 20; y = r.bottom + 6; }
    const w = tip.offsetWidth, h = tip.offsetHeight;
    if (x + w > window.innerWidth - 8) x = Math.max(8, x - w - 28);
    if (y + h > window.innerHeight - 8) y = Math.max(8, y - h - 28);
    tip.style.left = x + "px"; tip.style.top = y + "px";
  }
  const hideTip = () => { tip.hidden = true; };
  function bindTip(el, fn) {
    el.addEventListener("mousemove", (e) => showTip(fn(), e, el));
    el.addEventListener("mouseleave", hideTip);
    el.addEventListener("focus", (e) => showTip(fn(), e, el));
    el.addEventListener("blur", hideTip);
  }
  const ttRow = (k, v) => `<div class="tt-row"><span>${esc(k)}</span><b>${esc(v)}</b></div>`;
  const idList = (set, max = 8) => { const a = [...set].sort((x, y) => byId({ id: x }, { id: y })); return a.slice(0, max).join(", ") + (a.length > max ? L().more(a.length - max) : ""); };

  // ---------- controls ----------
  function initControls() {
    $("sessionSel").addEventListener("change", (e) => { state.session = e.target.value; render(); });
    $("typeSel").addEventListener("change", (e) => { state.type = e.target.value; render(); });
    segGroup($("modeSeg"), "mode", (v) => { state.mode = v; render(); });
    segGroup($("authorSeg"), "pos", (v) => { state.authorPos = v; renderAuthors(filteredPapers()); });
    $("paperSearch").addEventListener("input", (e) => { state.search = e.target.value.trim().toLowerCase(); renderPapers(filteredPapers()); });
    $("orgMore").addEventListener("click", () => { state.orgAll = !state.orgAll; renderOrgs(filteredPapers()); });

    $("langBtn").addEventListener("click", () => {
      state.lang = state.lang === "ja" ? "en" : "ja";
      try { localStorage.setItem("isscc-lang", state.lang); } catch (_) { /* storage unavailable */ }
      applyStaticText();
      render();
    });
    $("themeBtn").addEventListener("click", () => {
      const dark = matchMedia("(prefers-color-scheme: dark)").matches;
      const cur = document.documentElement.dataset.theme || (dark ? "dark" : "light");
      const next = cur === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem("isscc-theme", next); } catch (_) { /* storage unavailable */ }
      render();
    });
    try { const t = localStorage.getItem("isscc-theme"); if (t) document.documentElement.dataset.theme = t; } catch (_) { /* ignore */ }
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", render);
  }

  function segGroup(root, attr, onChange) {
    const btns = [...root.querySelectorAll("button")];
    btns.forEach((b) => b.addEventListener("click", () => {
      btns.forEach((x) => x.setAttribute("aria-checked", String(x === b)));
      onChange(b.dataset[attr]);
    }));
    root.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const i = btns.findIndex((b) => b.getAttribute("aria-checked") === "true");
      const n = btns[(i + (e.key === "ArrowRight" ? 1 : btns.length - 1)) % btns.length];
      n.focus(); n.click();
    });
  }

  function renderChips() {
    const t = L();
    const chips = [];
    if (state.session) chips.push(["session", `S${state.session}. ${SESSIONS[state.session]}`]);
    if (state.type) chips.push(["type", t.chipType(tname(state.type))]);
    if (state.country) chips.push(["country", t.chipCountry(cname(state.country))]);
    if (state.org) chips.push(["org", t.chipOrg(state.org)]);
    const el = $("chips");
    el.innerHTML = chips.map(([k, label]) => `<button type="button" class="chip" data-k="${k}" aria-label="${esc(t.chipClear(label))}">${esc(label)}<span class="x" aria-hidden="true">×</span></button>`).join("") +
      (chips.length > 1 ? `<button type="button" class="chip" data-k="all">${esc(t.clearAll)}<span class="x" aria-hidden="true">×</span></button>` : "");
    el.querySelectorAll(".chip").forEach((c) => c.addEventListener("click", () => {
      const k = c.dataset.k;
      if (k === "all") { state.session = state.type = state.country = state.org = ""; }
      else state[k] = "";
      $("sessionSel").value = state.session; $("typeSel").value = state.type;
      render();
    }));
  }

  // ---------- tiles ----------
  function renderTiles(papers) {
    const t = L();
    const nAuthors = papers.reduce((s, p) => s + p.authors.length, 0);
    const countries = countBy(papers, "country");
    const orgs = countBy(papers, "org");
    const intl = papers.filter((p) => new Set(allAffils(p).map((a) => a.country)).size > 1).length;
    const ia = papers.filter((p) => { const ty = new Set(allAffils(p).map((a) => a.type)); return ty.has("academia") && ty.has("industry"); }).length;
    const jpIdx = countries.findIndex((c) => c.key === "Japan");
    const jp = countries[jpIdx];
    const filtered = state.session || state.type || state.country || state.org;
    const first = state.mode === "first";
    const tiles = [
      [t.tPapers, papers.length.toLocaleString(), filtered ? t.tPapersAll(PAPERS.length) : t.tPapersNote],
      [t.tAuthors, nAuthors.toLocaleString(), papers.length ? t.tAuthorsNote((nAuthors / papers.length).toFixed(1)) : ""],
      [t.tCountries, countries.length, first ? t.tCountriesFirst : t.tCountriesAll],
      [t.tOrgs, orgs.length, first ? t.tOrgsFirst : t.tOrgsAll],
      [t.tIntl, papers.length ? fmtPct(intl / papers.length) : "–", t.tIntlNote(intl)],
      [t.tIA, papers.length ? fmtPct(ia / papers.length) : "–", t.tIANote(ia)],
      [t.tJapan, `${jp ? jp.n : 0}${unit()}`, jp ? t.tJapanNote(jpIdx + 1, countries.length) : t.none],
    ];
    $("tiles").innerHTML = tiles.map(([l, v, n]) => `<div class="tile"><div class="label">${esc(l)}</div><div class="value">${esc(v)}</div><div class="note">${esc(n)}</div></div>`).join("");
  }

  // ---------- horizontal bars ----------
  function renderBars(el, rows, { denom, selected, labelFn, colorFn, tipFn, onPick }) {
    if (!rows.length) { el.innerHTML = `<div class="empty">${esc(L().noData)}</div>`; return; }
    const max = rows[0].n;
    el.innerHTML = "";
    rows.forEach((r, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "bar-row" + (selected === r.key ? " selected" : "");
      b.setAttribute("aria-pressed", String(selected === r.key));
      b.setAttribute("aria-label", `${labelFn(r, true)}: ${r.n}${unit()} (${fmtPct(r.n / denom)})`);
      const w = Math.max(0.5, (r.n / max) * 100);
      b.innerHTML = `<span class="bar-label"><span class="rank">${i + 1}</span>${labelFn(r)}</span>
        <span class="bar-track"><span class="bar" style="width:calc(${w}% - ${w * 0.7}px);background:${colorFn ? colorFn(r) : "var(--s1)"}"></span>
        <span class="bar-val">${r.n}<span class="pct">${fmtPct(r.n / denom)}</span></span></span>`;
      bindTip(b, () => tipFn(r));
      b.addEventListener("click", () => { hideTip(); onPick(r.key); });
      el.appendChild(b);
    });
  }

  function renderCountries(papers) {
    const t = L();
    const rows = countBy(papers, "country");
    const denom = denominator(papers);
    $("countrySub").textContent = state.mode === "author" ? t.countrySubAuthor(denom) : t.countrySubPaper(denom);
    renderBars($("countryChart"), rows, {
      denom, selected: state.country,
      labelFn: (r, plain) => plain ? cname(r.key) : esc(cname(r.key)) + (state.lang === "ja" && COUNTRY_JA[r.key] ? ` <span class="aside">${esc(r.key)}</span>` : ""),
      tipFn: (r) => {
        const orgs = countBy(papers.filter((p) => r.papers.has(p.id)), "org").filter((o) => o.countries.has(r.key));
        return `<div class="tt-title">${esc(cname(r.key))}</div>${ttRow(state.mode === "author" ? t.ttAuthors : t.ttPapers, `${r.n}${unit()}`)}${ttRow(t.ttShare, fmtPct(r.n / denom))}${ttRow(t.ttOrgs, orgs.length)}` +
          `<div class="tt-foot">${esc(t.ttMainOrgs)}: ${esc(orgs.slice(0, 3).map((o) => o.key).join(", "))}</div>`;
      },
      onPick: (k) => { state.country = state.country === k ? "" : k; render(); },
    });
  }

  function renderOrgs(papers) {
    const t = L();
    const rows = countBy(papers, "org");
    const denom = denominator(papers);
    const LIMIT = 30;
    const shown = state.orgAll ? rows : rows.slice(0, LIMIT);
    if (state.org && !shown.find((r) => r.key === state.org)) { const s = rows.find((r) => r.key === state.org); if (s) shown.push(s); }
    $("orgSub").textContent = t.orgSub(rows.length, state.orgAll ? null : Math.min(LIMIT, rows.length));
    $("orgLegend").innerHTML = Object.keys(TYPE_VAR).map((k) => `<span><i style="background:var(${TYPE_VAR[k]})"></i>${esc(tname(k))}</span>`).join("");
    const mainCountry = (r) => [...r.countries.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => cname(c));
    renderBars($("orgChart"), shown, {
      denom, selected: state.org,
      labelFn: (r, plain) => plain ? r.key : `${esc(r.key)} <span class="aside">${esc(mainCountry(r)[0])}</span>`,
      colorFn: (r) => `var(${TYPE_VAR[r.type] || "--s-mixed"})`,
      tipFn: (r) => `<div class="tt-title">${esc(r.key)}</div>${ttRow(t.ttType, tname(r.type))}${ttRow(t.ttSites, mainCountry(r).join(", "))}` +
        `${ttRow(state.mode === "author" ? t.ttAuthors : t.ttPapers, `${r.n}${unit()}`)}${ttRow(t.ttShare, fmtPct(r.n / denom))}` +
        `<div class="tt-foot">${esc(t.ttPaperIds)}: ${esc(idList(r.papers))}</div>`,
      onPick: (k) => { state.org = state.org === k ? "" : k; render(); },
    });
    const btn = $("orgMore");
    btn.hidden = rows.length <= LIMIT;
    btn.textContent = state.orgAll ? t.orgTop : t.orgAll(rows.length);
  }

  // ---------- segmented whole bars ----------
  function segBar(el, parts, total, extraHtml = "") {
    const t = L();
    const live = parts.filter((p) => p.n > 0);
    el.innerHTML = `<div class="segbar" role="img" aria-label="${esc(live.map((p) => `${p.label} ${p.n} ${fmtPct(p.n / total)}`).join(", "))}">` +
      live.map((p, i) => `<div class="part" data-i="${i}" style="flex:${p.n} 1 0;background:${p.color};color:#fff">${p.n / total >= 0.09 ? fmtPct(p.n / total) : ""}</div>`).join("") +
      `</div><div class="seg-legend">` +
      parts.map((p) => `<i style="background:${p.color}"></i><span>${esc(p.label)}</span><span class="num">${esc(t.nPapers(p.n))}</span><span class="pct">${total ? fmtPct(p.n / total) : "–"}</span>`).join("") +
      `</div>${extraHtml}`;
    el.querySelectorAll(".part").forEach((node) => {
      const p = live[+node.dataset.i];
      bindTip(node, () => `<div class="tt-title">${esc(p.label)}</div>${ttRow(t.ttPapers, t.nPapers(p.n))}${ttRow(t.ttShare, fmtPct(p.n / total))}`);
    });
  }
  const extraLine = (label, entries) => entries.length
    ? `<div class="seg-extra">${esc(label)}: ` + entries.map(([k, n]) => `${esc(k)} <b>${n}</b>`).join("　") + `</div>` : "";

  function renderCollab(papers) {
    const t = L();
    const combo = { academia: 0, industry: 0, research: 0, mixed: 0 };
    const mixedDetail = new Map();
    const order = ["academia", "industry", "research"];
    for (const p of papers) {
      const ty = order.filter((x) => allAffils(p).some((a) => a.type === x));
      if (ty.length === 1) combo[ty[0]]++;
      else {
        combo.mixed++;
        const k = ty.map(tname).join(t.joinPlus);
        mixedDetail.set(k, (mixedDetail.get(k) || 0) + 1);
      }
    }
    const total = papers.length;
    segBar($("collabChart"), [
      { label: t.onlyAcademia, n: combo.academia, color: "var(--s1)" },
      { label: t.onlyIndustry, n: combo.industry, color: "var(--s2)" },
      { label: t.onlyResearch, n: combo.research, color: "var(--s3)" },
      { label: t.mixed, n: combo.mixed, color: "var(--s-mixed)" },
    ], total, extraLine(t.mixedDetail, [...mixedDetail.entries()].sort((a, b) => b[1] - a[1])));

    const pairs = new Map();
    let intl = 0;
    for (const p of papers) {
      const cs = [...new Set(allAffils(p).map((a) => a.country))].sort();
      if (cs.length < 2) continue;
      intl++;
      for (let i = 0; i < cs.length; i++) for (let j = i + 1; j < cs.length; j++) {
        const k = `${cname(cs[i])} – ${cname(cs[j])}`;
        pairs.set(k, (pairs.get(k) || 0) + 1);
      }
    }
    segBar($("intlChart"), [
      { label: t.intl, n: intl, color: "var(--s1)" },
      { label: t.domestic, n: total - intl, color: "var(--s-mixed)" },
    ], total, extraLine(t.topPairs, [...pairs.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)));
  }

  // ---------- heatmap ----------
  function luminance(color) {
    const probe = document.createElement("span");
    probe.style.color = color; document.body.appendChild(probe);
    const m = getComputedStyle(probe).color.match(/\d+(\.\d+)?/g).map(Number);
    probe.remove();
    const [r, g, b] = m.slice(0, 3).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function renderHeat() {
    const t = L();
    const papers = filteredPapers({ ignoreSession: true });
    const totals = countBy(papers, "country");
    const TOPN = 8;
    const cols = totals.slice(0, TOPN).map((c) => c.key);
    const hasOther = totals.length > TOPN;
    const sessions = [...new Set(PAPERS.map((p) => p.session))].sort((a, b) => a - b);
    const grid = sessions.map((s) => {
      const cnt = new Map(countBy(papers.filter((p) => p.session === s), "country").map((r) => [r.key, r.n]));
      const row = cols.map((c) => cnt.get(c) || 0);
      const other = [...cnt.entries()].filter(([k]) => !cols.includes(k)).reduce((x, [, v]) => x + v, 0);
      return { s, row: hasOther ? [...row, other] : row, total: [...cnt.values()].reduce((x, v) => x + v, 0) };
    });
    const max = Math.max(1, ...grid.flatMap((g) => g.row));
    const steps = [1, 2, 3, 4, 5, 6, 7].map((i) => cssVar(`--seq-${i}`));
    const ink = steps.map((c) => (luminance(c) > 0.35 ? "#0b0b0b" : "#ffffff"));
    const stepOf = (v) => (v <= 0 ? -1 : Math.min(6, Math.floor(((v - 1) / Math.max(1, max - 1)) * 6.999)));
    const headers = [...cols.map(cname), ...(hasOther ? [t.other] : [])];
    $("heatSub").textContent = t.heatSub(state.mode === "author");

    let html = `<table class="heat"><thead><tr><th></th>${headers.map((h) => `<th scope="col">${esc(h)}</th>`).join("")}<th scope="col">${esc(t.total)}</th></tr></thead><tbody>`;
    for (const g of grid) {
      html += `<tr><th scope="row" data-s="${g.s}" title="${esc(SESSIONS[g.s])}" class="${String(g.s) === state.session ? "sel" : ""}">S${g.s}. ${esc(SESSIONS[g.s])}</th>`;
      g.row.forEach((v, i) => {
        const st = stepOf(v);
        html += `<td data-s="${g.s}" data-c="${i}" data-v="${v}" style="background:${st < 0 ? "var(--seq-0)" : steps[st]};color:${st < 0 ? "var(--muted)" : ink[st]}">${v || ""}</td>`;
      });
      html += `<td class="total">${g.total || ""}</td></tr>`;
    }
    html += `</tbody></table><div class="heat-scale"><span>${esc(t.few)}</span><span class="ramp">${steps.map((c) => `<i style="background:${c}"></i>`).join("")}</span><span>${esc(t.many(max))}</span></div>`;
    const el = $("heatChart");
    el.innerHTML = html;
    el.querySelectorAll("tbody th").forEach((th) => th.addEventListener("click", () => {
      state.session = state.session === th.dataset.s ? "" : th.dataset.s;
      $("sessionSel").value = state.session; render();
    }));
    el.querySelectorAll("td[data-c]").forEach((td) => bindTip(td, () => {
      const s = +td.dataset.s;
      return `<div class="tt-title">S${s}. ${esc(SESSIONS[s])}</div>${ttRow(headers[+td.dataset.c], `${td.dataset.v}${unit()}`)}`;
    }));
  }

  // ---------- authors ----------
  function renderAuthors(papers) {
    const t = L();
    const pos = state.authorPos;
    const m = new Map();
    for (const p of papers) {
      const list = pos === "first" ? [p.authors[0]] : pos === "last" ? [p.authors[p.authors.length - 1]] : p.authors;
      for (const au of list) {
        const a = authorAffils(p, au)[0] || p.affils[0];
        if (!typeOk(a)) continue;
        if (state.country && state.mode === "first" && a.country !== state.country) continue;
        const key = au.name + "|" + a.org;
        let e = m.get(key);
        if (!e) { e = { name: au.name, org: a.org, country: a.country, type: a.type, papers: [] }; m.set(key, e); }
        if (!e.papers.includes(p.id)) e.papers.push(p.id);
      }
    }
    let rows = [...m.values()].sort((a, b) => b.papers.length - a.papers.length || a.name.localeCompare(b.name));
    const multi = rows.filter((r) => r.papers.length >= 2);
    const showAll = multi.length < 5;
    const pool = showAll ? rows : multi;
    rows = pool.slice(0, 40);
    const tbl = $("authorTable");
    if (!rows.length) { tbl.innerHTML = `<tbody><tr><td class="muted">${esc(t.none)}</td></tr></tbody>`; return; }
    let rank = 0, prev = -1;
    tbl.innerHTML = `<caption>${esc(t.authorCaption(t.posName[pos], showAll, multi.length, pool.length > 40))}</caption>
      <thead><tr><th>${esc(t.colRank)}</th><th>${esc(t.colAuthor)}</th><th>${esc(t.colAffil)}</th><th>${esc(t.colCountry)}</th><th class="r">${esc(t.colCount)}</th><th>${esc(t.colPapers)}</th></tr></thead><tbody>` +
      rows.map((r, i) => {
        if (r.papers.length !== prev) { rank = i + 1; prev = r.papers.length; }
        return `<tr><td class="num muted">${rank}</td><td>${esc(r.name)}</td><td><span class="type-dot" style="background:var(${TYPE_VAR[r.type]})" aria-hidden="true"></span>${esc(r.org)}</td><td>${esc(cname(r.country))}</td><td class="num">${r.papers.length}</td><td class="id">${esc(r.papers.sort((a, b) => byId({ id: a }, { id: b })).join(", "))}</td></tr>`;
      }).join("") + `</tbody>`;
  }

  // ---------- paper list ----------
  function renderPapers(papers) {
    const t = L();
    const q = state.search;
    const list = papers.filter((p) => !q || p.title.toLowerCase().includes(q) ||
      p.authors.some((a) => a.name.toLowerCase().includes(q)) ||
      p.affils.some((a) => a.org.toLowerCase().includes(q) || a.country.toLowerCase().includes(q) || (COUNTRY_JA[a.country] || "").includes(q))).sort(byId);
    $("paperSub").textContent = t.paperSub(list.length);
    const tbl = $("paperTable");
    tbl.innerHTML = `<thead><tr><th>${esc(t.colId)}</th><th>${esc(t.colTitle)}</th><th>${esc(t.colFirst)}</th><th>${esc(t.colFirstAffil)}</th><th>${esc(t.colCountry)}</th><th class="r">${esc(t.colNAuth)}</th></tr></thead><tbody>` +
      list.map((p) => {
        const a = firstAffil(p);
        const countries = [...new Set(allAffils(p).map((x) => cname(x.country)))];
        const open = state.open.has(p.id);
        let row = `<tr class="paper-row" data-id="${p.id}" tabindex="0" aria-expanded="${open}"><td class="id">${p.id}</td><td>${esc(p.title)}</td><td class="nowrap">${esc(p.authors[0].name)}</td>` +
          `<td><span class="type-dot" style="background:var(${TYPE_VAR[a.type]})" aria-hidden="true"></span>${esc(a.org)}</td><td>${esc(countries.join(", "))}</td><td class="num">${p.authors.length}</td></tr>`;
        if (open) {
          const authors = p.authors.map((au) => `${esc(au.name)}${au.eca ? "*" : ""}<sup>${au.affils.map((i) => i + 1).join(",")}</sup>`).join(", ");
          const affils = p.affils.map((x, i) => `<li><sup>${i + 1}</sup> <span class="type-dot" style="background:var(${TYPE_VAR[x.type]})" aria-hidden="true"></span>${esc(x.org)}${x.city ? ", " + esc(x.city) : ""}, ${esc(x.country)}${x.now_at ? esc(t.nowAt) : ""}</li>`).join("");
          row += `<tr class="detail"><td></td><td colspan="5"><p class="detail-authors">${authors}</p><ul class="detail-affils">${affils}</ul><div class="muted detail-meta">Session ${p.session}: ${esc(SESSIONS[p.session])} · ${esc(t.page(p.page))}${p.authors.some((x) => x.eca) ? esc(t.eca) : ""}</div></td></tr>`;
        }
        return row;
      }).join("") + `</tbody>`;
    tbl.querySelectorAll("tr.paper-row").forEach((tr) => {
      const toggle = () => { const id = tr.dataset.id; state.open.has(id) ? state.open.delete(id) : state.open.add(id); renderPapers(filteredPapers()); };
      tr.addEventListener("click", toggle);
      tr.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
    });
  }

  // ---------- main ----------
  function render() {
    hideTip();
    $("modeNote").textContent = L().modeNote[state.mode];
    const papers = filteredPapers();
    renderChips();
    renderTiles(papers);
    renderCountries(papers);
    renderCollab(papers);
    renderOrgs(papers);
    renderHeat();
    renderAuthors(papers);
    renderPapers(papers);
  }

  initControls();
  applyStaticText();
  render();
})();
