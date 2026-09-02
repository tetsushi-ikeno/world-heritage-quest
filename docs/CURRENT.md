# 現行実装の正本（CURRENT）

更新日: 2026-09-02

このファイルは、世界遺産クエストの**現在動いている実装を判断するための最上位の案内**です。

## 現行バージョン

- 現行: Beta3
- 現行エントリーポイント: `beta3.html`
- `index.html` は過去の α v17 / Phase 7.5 系であり、Beta3の実装判断には使用しない。

## Beta3 実行時の主要依存関係

```text
beta3.html
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

## 現行データ・素材

実行時または現在の制作で正本として扱うもの:

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

1. `index.html` や `phase*.js/css` をBeta3の正本として参照しない。
2. `beta-r*.html`、`beta2-r*.html` などの番号付き旧版を「新しそう」という理由で参照しない。
3. `*-lab.html` を、CURRENTに依存関係として明記されているもの以外は本番実装の参照元にしない。
4. `hotfix`、`beta2`、`lab` という名前だけを理由に削除しない。現行Beta3から参照されているものがある。
5. 仕様判断はまず `docs/beta3-baseline.md` と `docs/heritage-graphics-decisions.md` を確認する。
6. 本番コードの整理・統合は、見た目と機能の回帰確認を行いながら段階的に実施する。
7. 確定遺産グラフィックは `docs/assets/heritage-graphics/approved/` を正とし、仮グラフィックへ戻さない。

## 整理方針

- mainには最終的に現行実装・現行データ・必要な制作ツールだけを残す。
- 過去版はGit履歴から復元できるため、長期的にはmainに旧版コピーを残さない。
- 現行なのに `beta2` / `lab` / `hotfix` などの名前が残るファイルは、動作を変えずに内容を正式ファイルへ統合してから旧ファイルを削除する。
- 一括削除は行わない。依存関係を切り替え、テスト後に旧ファイルを削除する。
- mainへ書き込む生成系GitHub Actionsは通常PRで自動実行させず、意図した素材更新時だけ手動実行する。

## 退避地点

整理作業開始後に入った最新の確定グラフィック反映まで含むmainは、次に保存済み:

- `backup/pre-repo-cleanup-20260902-r2`

初回調査開始時点のmain:

- `backup/pre-repo-cleanup-20260902`

現在の整理作業ブランチ:

- `chore/repo-cleanup-v3`
