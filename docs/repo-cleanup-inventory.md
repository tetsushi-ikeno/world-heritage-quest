# リポジトリ整理インベントリ

更新日: 2026-09-02

目的: ファイル名やRevision番号を推測材料にせず、実際の参照関係と正本レジストリに基づいて整理する。

## 判定ルール

- **RUNTIME**: 現行Beta3の実行に必要。削除禁止。
- **CANONICAL / TOOLING**: 正本UI、仕様、制作・検証に必要。保持。
- **CONSOLIDATE**: 現役だが旧世代名・hotfix・lab名のまま。正式ファイルへ統合後に削除。
- **LEGACY CANDIDATE**: 現行参照なしの旧版・試作。関連グループを確認してから削除。
- **COMPATIBILITY**: リダイレクトなど。外部ブックマーク互換を考えて最後に判断。

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

### 過去問・素材・自動化
- `data/sekaken_4_2024_03_rpg.json`
- `data/sekaken_4_2024_07_rpg.json`
- `data/sekaken_4_2024_12_rpg.json`
- `docs/heritage-image-credits.md`
- `docs/branch-site-image-credits.md`
- `data/branch-site-images.json`
- `.github/workflows/`
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

## 削除済み（2026-09-02）

### Phase 2: 中間生成物・旧hotfix
- `docs/assets/heritage-graphics/staging/`
- `docs/assets/approved-sheet/`
- `beta-hotfix-loader.js`
- `beta-hotfix.js`

理由: 現行参照なし。中間断片には完成済み正本が存在し、Beta3 CI通過後に削除。

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

理由: `beta3.html → research-center-beta3.html` の現行経路とは独立した旧Beta1/2系。現行Beta3が使用する `beta2-center-theme.css` / `r04` / `r05` は削除対象から明示的に除外。

## LEGACY CANDIDATE / 次段階

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
  - `pyraminton-headquarters-lab.html` への即時リダイレクト。
  - currentではないが過去URL互換用として初期整理では保持。

## まだ保留するドキュメント

実行時不要でも確定判断・設計経緯として有用な可能性があるため、現段階では削除しない。

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
6. Beta3静的チェックは現行依存・27グラフィック・登録基準問題まで拡張済み。

## 次の作業

1. Phase 3削除をCIで確認しmainへ反映する。
2. 旧マップLab群の相互参照を確認する。
3. `index.html` を現行Beta3入口に統一した後、旧Phase群を削除する。
4. Loader/hotfix/CSS積層を正式ファイルへ段階統合する。
