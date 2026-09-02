# 現行実装の正本（CURRENT）

更新日: 2026-09-02

このファイルは、世界遺産クエストの**現在動いている実装を判断するための最上位の案内**です。

## 現行バージョンと入口

- 現行: Beta3
- 実装本体: `beta3.html`
- GitHub Pagesのルート入口: `index.html`
- `index.html` はゲーム実装を持たず、`beta3.html` へ移動するだけのランチャーとする。
- 旧 α / Phase 系を現行実装の参照元にしない。

## Beta3 実行時の主要依存関係

```text
index.html
└─ beta3.html
   ├─ beta-save.js
   ├─ tutorial-lab-final.html
   │  ├─ tutorial-lab.html
   │  └─ piramiton-expr.js
   ├─ area-map-beta2-wrapper.html
   │  ├─ area-map-beta-loader.html
   │  │  ├─ area-map-game.html
   │  │  │  ├─ beta-save.js
   │  │  │  └─ data/heritage-images.json
   │  │  ├─ piramiton-expr.js
   │  │  ├─ data/branch-sites.json
   │  │  └─ data/branch-quiz-data.json
   │  ├─ beta-save.js
   │  ├─ piramiton-svg.js
   │  └─ beta2-r05-map-hotfix.js
   │
   │  area-map-game.html → japan-map-beta-loader.html
   │  japan-map-beta-loader.html → japan-6x-map-lab.html
   │
   └─ research-center-beta3.html
      ├─ beta-save.js
      ├─ beta2-center-theme.css
      ├─ beta2-center-theme-r04.css
      ├─ beta2-center-theme-r05.css
      ├─ beta3-center-overrides.css
      │  ├─ beta3-center-overrides-base-r20260902-01.css
      │  └─ beta3-center-approved-graphics.css
      │     └─ docs/assets/heritage-graphics/approved/*.webp
      ├─ data/beta-heritage-content.json
      ├─ data/beta3-vertical-slice.json
      └─ docs/assets/heritage/<site>/01.jpg～03.jpg
```

## UI正本

UIの正本判定は次を使用する。

- `data/ui-current.json`
- `docs/ui-current.md`

現在current指定されているもの:

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

1. `phase*.js/css` や旧BetaファイルをBeta3の正本として参照しない。
2. ファイル名に `beta2` / `hotfix` / `lab` が含まれることだけを理由に削除・置換しない。現行依存に残っているものがある。
3. `*-lab.html` を本番実装へ流用する場合は、`data/ui-current.json` / `docs/ui-current.md` またはこのCURRENTで正本指定されているか確認する。
4. 仕様判断は `docs/beta3-baseline.md` と `docs/heritage-graphics-decisions.md` を優先する。
5. 確定遺産グラフィックは `docs/assets/heritage-graphics/approved/` を正とし、仮グラフィックへ戻さない。
6. runtimeの統合・名称変更は、Beta3静的チェックと表示確認を通した後で旧ファイルを削除する。

## 整理方針

- mainには現行実装・現行データ・必要な制作ツールだけを残す。
- 過去版はGit履歴と退避ブランチから復元する。
- `index.html` は常に現行版への入口だけを担い、過去実装を内包しない。
- mainへ書き込む生成系GitHub Actionsは手動実行のみとする。

## 退避地点

- 整理開始前: `backup/pre-repo-cleanup-20260902`
- 確定グラフィック反映後: `backup/pre-repo-cleanup-20260902-r2`
- 整理基盤反映後: `backup/post-cleanup-foundation-20260902`
