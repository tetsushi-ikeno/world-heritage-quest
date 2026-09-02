# リポジトリ整理インベントリ

更新日: 2026-09-02

目的: ファイル名・日付・Revision番号ではなく、実際の参照関係と正本レジストリに基づいて整理する。

## 保持ルール

- **RUNTIME**: 現行Beta3の実行に必要。削除禁止。
- **CANONICAL / TOOLING**: 正本UI、仕様、制作・検証に必要。保持。
- **CONSOLIDATE**: 現役だが旧世代名・hotfix・lab名のまま。正式ファイルへ統合後に削除。
- **COMPATIBILITY**: 過去URL互換のリダイレクト。実装本体として使用しない。

## RUNTIME / 削除禁止

### 正式入口・実装シェル
- `index.html` — GitHub Pages入口 → `beta3.html`
- `beta3.html`
- `tutorial.html`
- `world-map.html`
- `research-center-beta3.html`
- `beta-save.js`

### チュートリアル内部
- `tutorial-lab.html`
- `piramiton-expr.js`

### 全国マップ内部
- `area-map-beta-loader.html`
- `area-map-game.html`
- `japan-map-beta-loader.html`
- `japan-map-r05-wrapper.html`
- `japan-6x-map-lab.html`
- `piramiton-svg.js`
- `beta2-r05-map-hotfix.js`

`beta2-r05-map-hotfix.js` はブラウザ実行時に `japan-map-r05-wrapper.html` を動的指定する。両方とも現役であり削除禁止。CIで動的参照先の存在も検査する。

### 研究センター内部
- `beta2-center-theme.css`
- `beta2-center-theme-r04.css`
- `beta2-center-theme-r05.css`
- `beta3-center-overrides.css`
- `beta3-center-overrides-base-r20260902-01.css`
- `beta3-center-approved-graphics.css`

### データ・素材
- `data/beta-heritage-content.json`
- `data/beta3-vertical-slice.json`
- `data/branch-sites.json`
- `data/branch-quiz-data.json`
- `data/heritage-images.json`
- `docs/assets/heritage/`
- `docs/assets/branch-sites/`
- `docs/assets/heritage-graphics/approved/`

## CANONICAL / TOOLING / 保持

`data/ui-current.json` と `docs/ui-current.md` がUI正本管理の基準。current指定されたLabは削除しない。

- `data/ui-current.json`
- `docs/ui-current.md`
- `beta3-center-lab.html`
- `pyraminton-headquarters-lab.html`
- `docs/pyraminton-headquarters-lab.md`
- `docs/CURRENT.md`
- `docs/beta3-baseline.md`
- `docs/beta3-stars.md`
- `docs/heritage-graphics-decisions.md`
- `docs/heritage-graphics-style-guide.md`
- `docs/quiz-data.md`
- `docs/development-decision-policy.md`
- `docs/development-roadmap.md`
- `docs/post-beta-improvement-backlog.md`
- `data/sekaken_4_2024_03_rpg.json`
- `data/sekaken_4_2024_07_rpg.json`
- `data/sekaken_4_2024_12_rpg.json`
- `docs/heritage-image-credits.md`
- `docs/branch-site-image-credits.md`
- `data/branch-site-images.json`
- `.github/workflows/`
- `scripts/`

## COMPATIBILITY / 実装本体ではない

- `tutorial-lab-final.html` → `tutorial.html`
- `area-map-beta2-wrapper.html` → `world-map.html`
- `lab-pyraminton-headquarters.html` → current HQ Lab

新規コードから互換URLを直接参照しない。

## CONSOLIDATE / 次に整理する現役内部

- `area-map-beta-loader.html`
- `japan-map-beta-loader.html`
- `japan-map-r05-wrapper.html`
- `japan-6x-map-lab.html`
- `beta2-r05-map-hotfix.js`
- `beta2-center-theme.css`
- `beta2-center-theme-r04.css`
- `beta2-center-theme-r05.css`
- `beta3-center-overrides-base-r20260902-01.css`
- `tutorial-lab.html`

これらは現在実行中。名前だけを理由に削除しない。

## 整理履歴（2026-09-02）

### Phase 2 — 中間生成物・旧hotfix
画像アップロード用 `staging/`、`approved-sheet/`、旧Beta hotfixを削除。

### Phase 3 — 旧Beta入口・旧研究センター
旧Beta1/2入口と旧研究センター実装を削除。現行Beta3が使うBeta2名CSSは保持。

### Phase 4 — 旧マップ・Phase9試作
旧マップLab群を削除。この際 `japan-map-r05-wrapper.html` も削除したが、後に現役hotfixからの動的参照が判明したため復元。

### Phase 5 — Pages入口統一
`index.html` を旧αアプリから `beta3.html` ランチャーへ変更。CIで旧Phase依存の復帰を防止。

### Phase 6 — 旧α / Phase実装
`app.js` / `style.css` / `phase*.js/css` / `phase8-preview/` 等を削除。

### Phase 7 — 確定成果物へ置換済みの旧制作Lab
旧展示グラフィックLab、旧ピラミトン比較Lab、旧プレビューを削除。旧 `tutorial.html` もこの段階で削除したが、Phase 8で正式入口として新規作成。

### Phase 8 — 正式画面入口
`tutorial.html` / `world-map.html` を正式入口として追加し、`beta3.html` から旧内部名の直接参照を廃止。クレジットページの削除済み `beta.html` リンクも修正。

### Phase 9 — 正式シェルへの昇格
従来 `tutorial-lab-final.html` / `area-map-beta2-wrapper.html` にあった現行シェルを `tutorial.html` / `world-map.html` へ移し、旧名は互換リダイレクトへ縮小。

### Phase 9後の依存修復
`beta2-r05-map-hotfix.js` が削除済み `japan-map-r05-wrapper.html` を動的に指定していることを発見。バックアップから復元し、CIに動的HTML参照先の存在検査を追加。

## 保留ドキュメント・補助ページ

実行時不要でも、ライセンス確認・設計経緯として有用な可能性があるため現段階では削除しない。

- `docs/design-baseline.md`
- `docs/phase9-map-ux-decisions.md`
- `docs/ipad-verification-hub.md`
- `heritage-image-credits.html`
- `heritage-image-review.html`
- `docs/heritage-image-review.html`

## 残る主要リスク

1. 全国マップ内部がLoaderによるHTML文字列置換＋hotfixによるiframe差し替えで複雑。
2. 研究センターCSSがBeta2テーマ3枚＋Beta3 registry/base/approved graphicsの多層構造。
3. `tutorial-lab.html` と `japan-6x-map-lab.html` が実装内部なのにLab名のまま。

## 次の作業

1. 復元した `japan-map-r05-wrapper.html` を含むCIを通し、mainへ反映する。
2. 全国マップ内部の動的差し替えを、挙動を変えず段階的に正式ファイルへ統合する。
3. 研究センターCSSの読み込み入口を一本化し、最終的に旧世代CSSを統合する。
