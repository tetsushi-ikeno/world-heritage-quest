# リポジトリ整理インベントリ

更新日: 2026-09-02

目的: ファイル名やRevision番号を推測材料にせず、実際の参照関係と正本レジストリに基づいて整理する。

## 保持ルール

- **RUNTIME**: 現行Beta3の実行に必要。削除禁止。
- **CANONICAL / TOOLING**: 正本UI、仕様、制作・検証に必要。保持。
- **CONSOLIDATE**: 現役だが旧世代名・hotfix・lab名のまま。正式ファイルへ統合後に削除。
- **COMPATIBILITY**: リダイレクトなど。外部ブックマーク互換を考えて最後に判断。

## RUNTIME / 削除禁止

- `index.html` — GitHub Pagesの正式入口。`beta3.html` へのランチャー。
- `beta3.html`
- `beta-save.js`
- `tutorial-lab-final.html`
- `tutorial-lab.html`
- `piramiton-expr.js`
- `area-map-beta2-wrapper.html`
- `area-map-beta-loader.html`
- `area-map-game.html`
- `japan-map-beta-loader.html`
- `japan-6x-map-lab.html`
- `piramiton-svg.js`
- `beta2-r05-map-hotfix.js`
- `research-center-beta3.html`
- `beta2-center-theme.css`
- `beta2-center-theme-r04.css`
- `beta2-center-theme-r05.css`
- `beta3-center-overrides.css`
- `beta3-center-overrides-base-r20260902-01.css`
- `beta3-center-approved-graphics.css`
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

## CONSOLIDATE / 現役だが名称・構造を整理したいもの

現時点では削除禁止。参照先を正式ファイルへ切り替え、回帰確認後に旧名を削除する。

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

## 削除済み（2026-09-02）

### Phase 2: 中間生成物・旧hotfix
- `docs/assets/heritage-graphics/staging/`
- `docs/assets/approved-sheet/`
- `beta-hotfix-loader.js`
- `beta-hotfix.js`

### Phase 3: 旧Beta入口・旧研究センター
- `beta-r4.html` ～ `beta-r9.html`
- `beta2-r1.html`
- `beta.html`
- `beta2.html`
- `beta2-center-interior-lab.html`
- `beta2-center-object-lab.html`
- `beta2-center-theme.js`
- `research-center-beta2-wrapper.html`
- `research-center-beta2.html`
- `research-center-game.html`
- `research-center-style-lab.html`

### Phase 4: 旧マップ・Phase9試作
- `area-map-lab.html`
- `japan-follow-camera-lab.html`
- `japan-map-r05-wrapper.html`
- `kinki-scale-lab.html`
- `phase9-common-ui-lab.html`
- `phase9-movement-ui-lab.html`
- `coast-lab.html`

### Phase 5: Pages入口統一
- 旧α v17 / Phase 7.5の `index.html` 本体を廃止。
- `index.html` は `beta3.html` へ遷移する薄いランチャーへ変更。
- `scripts/validate-entry.mjs` を追加し、旧Phase依存がPages入口へ戻らないようCIで固定。

### Phase 6: 旧α / Phase実装
- `app.js` / `style.css`
- `phase1.*` / `phase41.*` / `phase56.*` / `phase57.*` / `phase62.*`
- `phase7.*` / `phase71.*` / `phase72.*` / `phase72fix.js`
- `phase73.*` / `phase74.*` / `phase75.*`
- `phase8-preview/`
- `piramiton-action.js`
- `tutorial-merge.js`

Phase 2〜6はいずれも現行依存を確認し、Beta3静的チェック成功後にmainへ反映する。

## 次の整理候補

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
- `test-links.html`

制作確認に使う可能性があるため、正本・設計記録との関係を確認してから判断する。

## COMPATIBILITY / 最後に判断

- `lab-pyraminton-headquarters.html` — current HQ Labへのリダイレクト。過去URL互換用として保持。

## 保留ドキュメント

- `docs/piramiton-lab.md`
- `docs/design-baseline.md`
- `docs/phase9-map-ux-decisions.md`
- `docs/ipad-verification-hub.md`
- `heritage-image-credits.html`
- `heritage-image-review.html`
- `docs/heritage-image-review.html`

## 残る主要リスク

1. 現行Beta3が `beta2-*` / `*-hotfix.js` / `*-lab.html` という誤解しやすい名称に依存。
2. `area-map-beta-loader.html` / `japan-map-beta-loader.html` のHTML文字列置換が壊れやすい。
3. 研究センターCSSがBeta2テーマ＋Beta3 registry/base/approved graphicsの多層構造。

## 次の作業

1. Phase 6削除をCIで確認しmainへ反映する。
2. 旧展示・プレビュー系を、正本や制作ワークフローとの関係を確認して整理する。
3. 現行Loader/hotfix/CSS積層を正式ファイルへ段階統合する。
