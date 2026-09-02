# リポジトリ整理インベントリ

更新日: 2026-09-02

目的: ファイル名やRevision番号を推測材料にせず、実際の参照関係と正本レジストリに基づいて整理する。

## 判定ルール

- **RUNTIME**: 現行Beta3の実行に必要。削除禁止。
- **CANONICAL / TOOLING**: 正本UI、仕様、制作・検証に必要。保持。
- **CONSOLIDATE**: 現役だが旧世代名・hotfix・lab名のまま。正式ファイルへ統合後に削除。
- **SAFE DELETE**: 現行参照なし・完成物あり・Git履歴から復元可能。削除してよい。
- **LEGACY CANDIDATE**: 現行参照なしの旧版・試作。関連グループを確認してから削除。
- **COMPATIBILITY**: リダイレクトなど。現在の内部参照は不要だが、外部ブックマーク互換を考えて最後に判断。

## RUNTIME / 削除禁止

### エントリー・保存
- `beta3.html`
- `beta-save.js`

### チュートリアル
- `tutorial-lab-final.html`
- `tutorial-lab.html`
- `piramiton-expr.js`

### 全国マップ
- `area-map-beta2-wrapper.html`
- `area-map-beta-loader.html`
- `area-map-game.html`
- `japan-map-beta-loader.html`
- `japan-6x-map-lab.html`
- `piramiton-svg.js`
- `beta2-r05-map-hotfix.js`

### 研究センター
- `research-center-beta3.html`
- `beta2-center-theme.css`
- `beta2-center-theme-r04.css`
- `beta2-center-theme-r05.css`
- `beta3-center-overrides.css`
- `beta3-center-overrides-base-r20260902-01.css`
- `beta3-center-approved-graphics.css`

### データ・画像
- `data/beta-heritage-content.json`
- `data/beta3-vertical-slice.json`
- `data/branch-sites.json`
- `data/branch-quiz-data.json`
- `data/heritage-images.json`
- `docs/assets/heritage/`
- `docs/assets/branch-sites/`
- `docs/assets/heritage-graphics/approved/`

## CANONICAL / TOOLING / 保持

### UI正本
`data/ui-current.json` と `docs/ui-current.md` がUI正本管理の基準。ここにcurrent指定されたLabは削除しない。

- `data/ui-current.json`
- `docs/ui-current.md`
- `beta3-center-lab.html` — 研究センターUIのcurrent確認Lab
- `pyraminton-headquarters-lab.html` — ピラミトン本部current専用Lab
- `docs/pyraminton-headquarters-lab.md`

### 仕様・判断記録
- `docs/CURRENT.md`
- `docs/beta3-baseline.md`
- `docs/beta3-stars.md`
- `docs/heritage-graphics-decisions.md`
- `docs/heritage-graphics-style-guide.md`
- `docs/quiz-data.md`
- `docs/development-decision-policy.md`
- `docs/development-roadmap.md`
- `docs/post-beta-improvement-backlog.md`

### 過去問データ
- `data/sekaken_4_2024_03_rpg.json`
- `data/sekaken_4_2024_07_rpg.json`
- `data/sekaken_4_2024_12_rpg.json`

### 素材・自動化
- `docs/heritage-image-credits.md`
- `docs/branch-site-image-credits.md`
- `data/branch-site-images.json`
- `.github/workflows/assemble-hq-retina-assets.yml`
- `.github/workflows/collect-heritage-images.yml`
- `.github/workflows/collect-branch-site-images.yml`
- `.github/workflows/beta-check.yml`
- `scripts/`

## CONSOLIDATE / 現役だが名称・構造を整理したいもの

以下は現時点では削除禁止。参照先を正式ファイルへ切り替え、回帰確認後に旧名を削除する。

- `area-map-beta2-wrapper.html`
- `area-map-beta-loader.html`
- `japan-map-beta-loader.html`
- `japan-6x-map-lab.html`
- `beta2-r05-map-hotfix.js`
- `beta2-center-theme.css`
- `beta2-center-theme-r04.css`
- `beta2-center-theme-r05.css`
- `beta3-center-overrides-base-r20260902-01.css`
- `tutorial-lab-final.html`
- `tutorial-lab.html`

## SAFE DELETE / 第1回削除対象

### 中間アップロード断片
- `docs/assets/heritage-graphics/staging/`
  - `*.partXX` など承認済みWebP作成前の中間断片。
  - 現在の実装・workflowから参照なし。
  - 完成物は `docs/assets/heritage-graphics/approved/*.webp` に存在し、CIで27件を検証済み。
- `docs/assets/approved-sheet/`
  - `ref600.part0.txt` / `ref600.part1.txt` の分割中間ファイル。
  - 現在のコードから参照なし。

### 旧Beta r8/r9 hotfix
- `beta-hotfix-loader.js`
- `beta-hotfix.js`
  - `beta-hotfix-loader.js` は `beta-hotfix.js?source=r9` を動的evalする旧互換処理。
  - 現行Beta3依存グラフには含まれず、リポジトリ検索でも参照元なし。
  - 現行のピラミトン・マップ処理はBeta3側の正式経路で実装済み。

## LEGACY CANDIDATE / 次段階

### 旧Beta入口
- `beta-r4.html` ～ `beta-r9.html`
- `beta2-r1.html`
- `beta.html`
- `beta2.html`

### 旧研究センター・試作
- `beta2-center-interior-lab.html`
- `beta2-center-object-lab.html`
- `beta2-center-theme.js`
- `research-center-beta2-wrapper.html`
- `research-center-beta2.html`
- `research-center-game.html`
- `research-center-style-lab.html`

※ `beta3-center-lab.html` は current UI Lab のためこのグループから除外。

### 旧マップ・試作
- `area-map-lab.html`
- `japan-follow-camera-lab.html`
- `japan-map-r05-wrapper.html`
- `kinki-scale-lab.html`
- `phase9-common-ui-lab.html`
- `phase9-movement-ui-lab.html`
- `coast-lab.html`

### 旧Phase系
- `index.html`（現在はα v17 Phase 7.5。Beta3入口ではない）
- `app.js` / `style.css`
- `phase1.*` / `phase41.*` / `phase56.*` / `phase57.*` / `phase62.*`
- `phase7.*` / `phase71.*` / `phase72.*` / `phase72fix.js`
- `phase73.*` / `phase74.*` / `phase75.*`
- `phase8-preview/`

### 旧展示・プレビュー系
- `approved-cultural/`
- `cultural-heritage-approved-gallery.html`
- `cultural-heritage-center-placement-lab.html`
- `cultural-heritage-exhibit-batch01-lab.html`
- `cultural-heritage-exhibit-batch02-lab.html`
- `cultural-heritage-exhibit-lab.html`
- `cultural-heritage-graphics-status.html`
- `heritage-discovery-effect-lab.html`
- `criteria-branch-lab.html`
- `integrated-preview.html`
- `piramiton-lab.css` / `piramiton-lab.html` / `piramiton-lab.js`
- `tutorial-design-baseline.html`
- `tutorial.html`
- `tutorial-merge.js`
- `test-links.html`

## COMPATIBILITY / 最後に判断

- `lab-pyraminton-headquarters.html`
  - 内容は `pyraminton-headquarters-lab.html` への即時リダイレクトのみ。
  - 内部正本ではないが、過去URLのブックマーク互換として残す価値はあるため、初期整理では削除しない。

## まだ保留するドキュメント

以下は実行時不要でも、確定判断・設計経緯として有用な可能性があるため今回の削除対象から外す。

- `docs/piramiton-lab.md`
- `docs/design-baseline.md`
- `docs/phase9-map-ux-decisions.md`
- `docs/ipad-verification-hub.md`
- `heritage-image-credits.html`
- `heritage-image-review.html`
- `docs/heritage-image-review.html`

## 構造上の主要リスク

1. `beta3.html` と旧 `index.html` が別アプリとして併存。
2. 現行Beta3が `beta2-*` / `*-hotfix.js` / `*-lab.html` という誤解しやすい名称に依存。
3. `area-map-beta-loader.html` / `japan-map-beta-loader.html` がHTML文字列置換で機能注入しており壊れやすい。
4. 研究センターCSSがBeta2テーマ＋Beta3 registry/base/approved graphicsの多層構造。
5. 画像収集ActionsはPRからmainへ書き込む構成だったが、2026-09-02に手動実行専用へ修正済み。
6. Beta3静的チェックは2026-09-02に現行依存・27グラフィック・登録基準問題まで拡張済み。

## 次の作業

1. SAFE DELETEを整理ブランチで削除し、Beta3静的チェックを通す。
2. 旧Beta/旧Phase群の相互参照を確認し、グループ単位で削除する。
3. Loader/hotfix/CSS積層を正式ファイルへ段階統合する。
4. 最後に `index.html` を現行Beta3入口へ統一する。
