# リポジトリ整理インベントリ

更新日: 2026-09-02

目的: ファイル名の印象ではなく、実際の参照関係・ワークフロー・仕様上の役割に基づいて整理する。

## 判定ルール

- **RUNTIME**: 現行Beta3の実行に直接または間接的に必要。削除禁止。
- **TOOLING / SOURCE**: 自動チェック、素材生成、正本仕様などに必要。実行時には不要でも保持。
- **CONSOLIDATE**: 現行で使っているが、旧世代名・hotfix・lab名のまま。正式ファイルへ統合後に削除候補。
- **LEGACY CANDIDATE**: 現行Beta3の依存グラフには入っていない過去版・試作。参照有無を追加確認後に削除候補。
- **UNRESOLVED**: 用途確認が終わっていないため保留。

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

### データ
- `data/beta-heritage-content.json`
- `data/beta3-vertical-slice.json`
- `data/branch-sites.json`
- `data/branch-quiz-data.json`
- `data/heritage-images.json`

### 実行時画像
- `docs/assets/heritage/`
- `docs/assets/branch-sites/`
- `docs/assets/heritage-graphics/approved/`

## TOOLING / SOURCE / 保持

### 正本仕様
- `docs/beta3-baseline.md`
- `docs/beta3-stars.md`
- `docs/heritage-graphics-decisions.md`
- `docs/heritage-graphics-style-guide.md`
- `docs/quiz-data.md`
- `docs/development-decision-policy.md`
- `docs/development-roadmap.md`
- `docs/post-beta-improvement-backlog.md`
- `docs/CURRENT.md`

### 承認済み素材・素材メタデータ
- `docs/heritage-image-credits.md`
- `docs/branch-site-image-credits.md`
- `data/branch-site-images.json`（画像収集スクリプトの生成・管理対象）

### 過去問データ
- `data/sekaken_4_2024_03_rpg.json`
- `data/sekaken_4_2024_07_rpg.json`
- `data/sekaken_4_2024_12_rpg.json`

### 自動化・検証
- `.github/workflows/assemble-hq-retina-assets.yml`
- `.github/workflows/collect-heritage-images.yml`
- `.github/workflows/collect-branch-site-images.yml`
- `.github/workflows/beta-check.yml`
- `scripts/collect-branch-site-images.mjs`
- `scripts/collect-heritage-images-batch.mjs`
- `scripts/merge-heritage-image-metadata.mjs`
- `scripts/finalize-heritage-image-curation.mjs`
- `scripts/validate-beta.mjs`

## CONSOLIDATE / 現役だが名称・構造を整理したいもの

以下は**現時点では削除禁止**。正式ファイルへ内容を統合し、参照先を切り替えて検証した後に旧ファイルを削除する。

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

理由: これらはBeta3の正式実行経路に含まれる一方、ファイル名からは旧版・試作・一時差分に見えるため、先祖返りや誤削除を誘発する。

## LEGACY CANDIDATE / 第1次削除候補

現行Beta3の確認済み依存グラフには含まれていない。まだ削除は行わず、コード検索・ワークフロー参照・設計上の用途を最終確認する。

### 旧Beta入口
- `beta-r4.html`
- `beta-r5.html`
- `beta-r6.html`
- `beta-r7.html`
- `beta-r8.html`
- `beta-r9.html`
- `beta2-r1.html`
- `beta.html`
- `beta2.html`

### 旧研究センター・試作
- `beta2-center-interior-lab.html`
- `beta2-center-object-lab.html`
- `beta2-center-theme.js`
- `beta3-center-lab.html`
- `research-center-beta2-wrapper.html`
- `research-center-beta2.html`
- `research-center-game.html`
- `research-center-style-lab.html`

### 旧マップ・試作
- `area-map-lab.html`
- `japan-follow-camera-lab.html`
- `japan-map-r05-wrapper.html`
- `kinki-scale-lab.html`
- `phase9-common-ui-lab.html`
- `phase9-movement-ui-lab.html`
- `coast-lab.html`

### 旧Phase系
- `app.js`
- `style.css`
- `phase1.css` / `phase1.js`
- `phase41.css` / `phase41.js`
- `phase56.css` / `phase56.js`
- `phase57.css` / `phase57.js`
- `phase62.css` / `phase62.js`
- `phase7.css` / `phase7.js`
- `phase71.css` / `phase71.js`
- `phase72.css` / `phase72.js`
- `phase72fix.js`
- `phase73.css` / `phase73.js`
- `phase74.css` / `phase74.js`
- `phase75.css` / `phase75.js`
- `phase8-preview/`
- `index.html`（現在はα v17 Phase 7.5。Beta3入口ではない）

### 展示・グラフィック制作Lab
- `approved-cultural/`
- `cultural-heritage-approved-gallery.html`
- `cultural-heritage-center-placement-lab.html`
- `cultural-heritage-exhibit-batch01-lab.html`
- `cultural-heritage-exhibit-batch02-lab.html`
- `cultural-heritage-exhibit-lab.html`
- `cultural-heritage-graphics-status.html`
- `heritage-discovery-effect-lab.html`

### その他プレビュー・Lab
- `criteria-branch-lab.html`
- `integrated-preview.html`
- `piramiton-lab.css`
- `piramiton-lab.html`
- `piramiton-lab.js`
- `tutorial-design-baseline.html`
- `tutorial.html`
- `tutorial-merge.js`
- `test-links.html`

## UNRESOLVED / 追加確認

- `beta-hotfix-loader.js`
- `beta-hotfix.js`
- `data/ui-current.json`
- `docs/assets/heritage-graphics/staging/`
- `docs/assets/approved-sheet/`
- `heritage-image-credits.html`
- `heritage-image-review.html`
- `docs/heritage-image-review.html`
- `lab-pyraminton-headquarters.html`
- `pyraminton-headquarters-lab.html`
- `docs/pyraminton-headquarters-lab.md`
- `docs/piramiton-lab.md`
- `docs/ui-current.md`
- `docs/design-baseline.md`
- `docs/phase9-map-ux-decisions.md`
- `docs/ipad-verification-hub.md`

## 現時点で見つかった構造上のリスク

### 1. Beta3と旧版の入口が併存
`beta3.html` が現行だが、ルートの `index.html` は古いPhase系を大量に読み込む別アプリになっている。

### 2. 現行Beta3が旧世代名のファイルに依存
`beta2-*`、`*-hotfix.js`、`*-lab.html` が実際には現役。名前だけでは要否を判断できない。

### 3. LoaderがHTML文字列を動的置換
`area-map-beta-loader.html` と `japan-map-beta-loader.html` が、別HTMLをfetchして文字列置換している。元HTMLの文言やコードが少し変わるだけで injection point not found になり得る。

### 4. 研究センターCSSが多層
`research-center-beta3.html` はBeta2テーマ3枚＋Beta3 registryを読み込み、registryがさらにbaseとapproved graphicsをimportする。現行では確定グラフィックが正しく分離されたが、依存関係を知らずに一部だけ編集すると先祖返りし得る。

### 5. 自動チェックが現行Beta3を十分監視していない
mainの `.github/workflows/beta-check.yml` と `scripts/validate-beta.mjs` は旧Beta中心。整理ブランチではBeta3直接検証へ更新する。

### 6. 画像収集Actionsが通常PRでmainへ書き込み得る
`collect-heritage-images.yml` と `collect-branch-site-images.yml` はPRを契機に起動し、mainをcheckoutして生成画像をmainへcommitする構成だった。整理ブランチでは `workflow_dispatch` の手動実行専用へ変更する。

## 次の作業

1. Beta3ファイルを自動チェック対象へ追加する。
2. 画像収集Actionsを手動実行専用にする。
3. UNRESOLVEDを参照検索して分類する。
4. Loader/hotfix/CSS積層を、機能を変えずに正式ファイルへ段階統合する。
5. 回帰テスト後にLEGACY CANDIDATEを削除する。
6. 最後に `index.html` を正式なBeta3入口へ統一する。

削除は上記1〜5の安全確認が完了するまで行わない。
