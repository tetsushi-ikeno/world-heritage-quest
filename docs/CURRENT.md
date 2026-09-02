# 現行実装の正本（CURRENT）

更新日: 2026-09-02

このファイルは、世界遺産クエストの**現在動いている実装を判断するための最上位の案内**です。

## 現行バージョンと入口

- 現行: Beta3
- GitHub Pagesのルート入口: `index.html`
- 実装本体: `beta3.html`
- チュートリアル正式入口: `tutorial.html`
- 全国マップ正式入口: `world-map.html`
- 研究センター正式入口: `research-center-beta3.html`
- 研究センター正式CSS入口: `research-center.css`

`index.html` は `beta3.html` へ移動するだけのランチャー。Beta3本体から旧世代名・Lab名を直接呼ばず、正式入口を介する。

## Beta3 実行時の主要依存関係

```text
index.html
└─ beta3.html
   ├─ beta-save.js
   ├─ tutorial.html
   │  ├─ tutorial-lab.html
   │  └─ piramiton-expr.js
   ├─ world-map.html
   │  ├─ area-map-beta-loader.html
   │  │  ├─ area-map-game.html
   │  │  │  ├─ beta-save.js
   │  │  │  └─ data/heritage-images.json
   │  │  ├─ piramiton-expr.js
   │  │  ├─ data/branch-sites.json
   │  │  └─ data/branch-quiz-data.json
   │  ├─ beta-save.js
   │  ├─ piramiton-svg.js
   │  └─ world-map-runtime.js
   │     └─ japan-map-runtime.html
   │        └─ japan-map-beta-loader.html
   │           └─ japan-6x-map-lab.html
   └─ research-center-beta3.html
      ├─ beta-save.js
      ├─ [互換stub] beta2-center-theme.css
      ├─ [互換stub] beta2-center-theme-r04.css
      ├─ [互換stub] beta2-center-theme-r05.css
      ├─ [互換registry] beta3-center-overrides.css
      │  └─ research-center.css
      │     ├─ research-center-theme.css
      │     ├─ beta3-center-overrides-base-r20260902-01.css
      │     └─ beta3-center-approved-graphics.css
      │        └─ docs/assets/heritage-graphics/approved/*.webp
      ├─ data/beta-heritage-content.json
      ├─ data/beta3-vertical-slice.json
      └─ docs/assets/heritage/<site>/01.jpg～03.jpg
```

全国マップの現行runtimeは `world-map-runtime.js` と `japan-map-runtime.html`。`world-map-runtime.js` がブラウザ実行時に日本地図iframeを `japan-map-runtime.html` へ差し替える。

研究センターの確定済み木調テーマ・主人公・調査員・展示のr04/r05補正は `research-center-theme.css` に統合済み。`research-center.css` がBeta3調整と確定グラフィックを同じ順序で読み込む正式CSS入口である。

## 互換URL / 互換ローダー / 互換CSS

次は実装本体ではない。過去URL・過去参照の互換維持専用。

- `tutorial-lab-final.html` → `tutorial.html`
- `area-map-beta2-wrapper.html` → `world-map.html`
- `japan-map-r05-wrapper.html` → `japan-map-runtime.html`
- `beta2-r05-map-hotfix.js` → `world-map-runtime.js` を読み込む互換ローダー
- `beta2-center-theme.css` → 互換stub
- `beta2-center-theme-r04.css` → 互換stub
- `beta2-center-theme-r05.css` → 互換stub
- `beta3-center-overrides.css` → `research-center.css` を読み込む互換registry

新規実装・新規修正を互換ファイルへ追加しない。

## UI正本

- `data/ui-current.json`
- `docs/ui-current.md`

current指定:
- 研究センター確認Lab: `beta3-center-lab.html`
- ピラミトン本部Lab: `pyraminton-headquarters-lab.html`

ファイル名・日付・Revision番号から最新版を推測しない。

## 現行データ・素材

- `data/beta-heritage-content.json`
- `data/beta3-vertical-slice.json`
- `data/branch-sites.json`
- `data/branch-quiz-data.json`
- `data/heritage-images.json`
- `docs/assets/heritage/`
- `docs/assets/branch-sites/`
- `docs/assets/heritage-graphics/approved/`
- `docs/heritage-graphics-decisions.md`
- `docs/beta3-baseline.md`
- `docs/beta3-stars.md`

## 実装時の禁止事項

1. `phase*.js/css` や削除済み旧Betaファイルを正本として参照しない。
2. Beta3本体からチュートリアルは `tutorial.html`、全国マップは `world-map.html` を呼ぶ。
3. 全国マップの追加修正は `world-map-runtime.js` / `japan-map-runtime.html` を優先し、`beta2-r05-map-hotfix.js` / `japan-map-r05-wrapper.html` に新しい実装を足さない。
4. 研究センターのスタイル修正は `research-center.css` とそこから参照される現行CSSを使用し、`beta2-center-theme*.css` へ実装を戻さない。
5. ファイル名に `beta2` / `hotfix` / `lab` が含まれることだけを理由に削除しない。まだ内部依存に残るものがある。
6. `*-lab.html` を本番実装へ流用する場合は `data/ui-current.json` / `docs/ui-current.md` または本書で正本指定されているか確認する。
7. 仕様判断は `docs/beta3-baseline.md` と `docs/heritage-graphics-decisions.md` を優先する。
8. 確定遺産グラフィックは `docs/assets/heritage-graphics/approved/` を正とし、仮グラフィックへ戻さない。
9. runtime・CSSの統合や名称変更はCIと表示確認を通してから旧ファイルを削除する。

## 整理方針

- mainには現行実装・現行データ・必要な制作ツールだけを残す。
- 過去版はGit履歴と退避ブランチから復元する。
- 正式実装と互換ファイルを明確に分離する。
- JavaScriptが動的に参照するローカルHTMLもCIで存在確認する。
- 互換CSSには実装ルールを残さず、正式CSSへのポインタだけを置く。
- mainへ書き込む生成系GitHub Actionsは手動実行のみとする。

## 退避地点

- 整理開始前: `backup/pre-repo-cleanup-20260902`
- 確定グラフィック反映後: `backup/pre-repo-cleanup-20260902-r2`
- 整理基盤反映後: `backup/post-cleanup-foundation-20260902`
- Pages入口統一後: `backup/post-pages-entry-20260902`
- 旧α/Phase削除後: `backup/post-alpha-cleanup-20260902`
- 旧プレビュー削除後: `backup/post-preview-cleanup-20260902`
- 正式画面入口追加後: `backup/post-canonical-entry-20260902`
- マップ依存修復後: `backup/post-map-dependency-fix-20260902`
- マップruntime正式名化後: `backup/post-map-runtime-names-20260902`
