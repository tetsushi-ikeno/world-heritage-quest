# リポジトリ整理インベントリ

更新日: 2026-09-02

目的: ファイル名・日付・Revision番号ではなく、実際の参照関係と正本レジストリに基づいて整理する。

## 保持ルール

- **RUNTIME**: 現行Beta3の実行に必要。削除禁止。
- **CANONICAL / TOOLING**: 正本UI、仕様、制作・検証に必要。保持。
- **CONSOLIDATE**: 現役だが旧世代名・lab名のまま。正式ファイルへ統合後に削除。
- **COMPATIBILITY**: 過去URL・過去参照互換。実装本体として使用しない。

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
- `world-map-runtime.js`
- `japan-map-runtime.html`
- `japan-map-beta-loader.html`
- `japan-6x-map-lab.html`
- `piramiton-svg.js`

`world-map-runtime.js` がブラウザ実行時に日本地図iframeを `japan-map-runtime.html` へ差し替える。CIでこの動的参照先も検査する。

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
- `japan-map-r05-wrapper.html` → `japan-map-runtime.html`
- `beta2-r05-map-hotfix.js` → `world-map-runtime.js` を読み込む互換ローダー
- `lab-pyraminton-headquarters.html` → current HQ Lab

新規コードから互換ファイルを直接参照しない。

## CONSOLIDATE / 次に整理する現役内部

- `area-map-beta-loader.html`
- `japan-map-beta-loader.html`
- `japan-6x-map-lab.html`
- `beta2-center-theme.css`
- `beta2-center-theme-r04.css`
- `beta2-center-theme-r05.css`
- `beta3-center-overrides-base-r20260902-01.css`
- `tutorial-lab.html`

これらは現在実行中。名前だけを理由に削除しない。

## 整理履歴（2026-09-02）

- **Phase 2**: 中間生成物・旧hotfixを削除。
- **Phase 3**: 旧Beta1/2入口・旧研究センターを削除。
- **Phase 4**: 旧マップLab・Phase9試作を削除。
- **Phase 5**: `index.html` をBeta3ランチャーへ統一。
- **Phase 6**: 旧α / `phase*.js/css` 等を削除。
- **Phase 7**: 確定成果物へ置換済みの旧制作Lab・旧プレビューを削除。
- **Phase 8**: `tutorial.html` / `world-map.html` を正式入口として追加。
- **Phase 9**: 正式入口へ実装シェルを移し、旧入口を互換リダイレクト化。
- **Phase 9後修復**: `beta2-r05-map-hotfix.js` の動的参照先 `japan-map-r05-wrapper.html` 欠落を発見し復元。CIに動的参照検査を追加。
- **Phase 10**: 全国マップの現役 `hotfix` / `r05` 実装を `world-map-runtime.js` / `japan-map-runtime.html` へ移し、旧名を互換専用へ縮小。

## 保留ドキュメント・補助ページ

実行時不要でもライセンス確認・設計経緯として有用な可能性があるため現段階では削除しない。

- `docs/design-baseline.md`
- `docs/phase9-map-ux-decisions.md`
- `docs/ipad-verification-hub.md`
- `heritage-image-credits.html`
- `heritage-image-review.html`
- `docs/heritage-image-review.html`

## 残る主要リスク

1. 全国マップ内部が `area-map-beta-loader.html` / `japan-map-beta-loader.html` によるHTML文字列置換を使っている。
2. 研究センターCSSがBeta2テーマ3枚＋Beta3 registry/base/approved graphicsの多層構造。
3. `tutorial-lab.html` と `japan-6x-map-lab.html` が現役内部なのにLab名のまま。

## 次の作業

1. Phase 10をCIで確認しmainへ反映する。
2. 研究センターCSSの読み込み入口を一本化する。
3. 全国マップLoader群・Lab名の内部実装を、挙動を変えず段階統合する。
