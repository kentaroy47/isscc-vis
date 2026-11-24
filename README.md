# ISSCC 2027 採択統計

ISSCC 2027 Advance Program（PDF）から採択論文の著者・所属を抽出し、所属機関・国・著者別に可視化する静的サイト。日本語 / English 切り替え対応（ブラウザ言語で自動選択、`?lang=en` でも指定可）。

Static site visualizing ISSCC 2027 accepted papers by affiliation, country and author, extracted from the Advance Program. Japanese / English UI (auto-detected; force with `?lang=en`).

## 見る

`index.html` をブラウザで開くだけ（サーバー不要）。GitHub Pages などにそのまま置けます。

## データ更新

```sh
pip install pymupdf
python scripts/parse_program.py ISSCC2027AdvanceProgram.pdf data/papers_raw.json   # PDF → 生データ
python scripts/normalize.py data/papers_raw.json data/papers.json                  # 正規化 → papers.json / papers.js
```

- `data/org_meta.json` — 機関名の表記ゆれ統合（`aliases`）と、機関種別（大学/企業/研究機関）の手動上書き（`types`）。
  機関名がおかしい・種別が違うときはここを直して `normalize.py` を再実行。
- `python scripts/normalize.py data/papers_raw.json x --dump-orgs` で機関×国×種別の一覧を確認できます。

## 集計の定義

| 数え方 | 内容 |
|---|---|
| 第一著者 | 第一著者の（筆頭の）所属で 1 論文 = 1 件 |
| 全著者（論文単位） | 著者の誰かがその機関・国に所属していれば 1 件（合計は論文数を超える） |
| 著者のべ人数 | 著者 1 人 = 1 件（兼務は各所属に計上） |

- プレナリー（Session 1）は除外。Session 26 (Late Breaking) は Advance Program 時点で未掲載。
- 「*now at …」の現所属は集計に含めず、研究実施時の所属で数えます。
- 国・地域は Program の表記どおり（香港・マカオは China）。
