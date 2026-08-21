# World Heritage Quest — Design Baseline

このファイルは、別チャット・別Lab・統合作業で「どれが確定版か」を迷わないための正本台帳です。

## Tutorial
- Status: **APPROVED DESIGN BASELINE**
- Canonical page: `tutorial-design-baseline.html`
- Baseline version: **1**
- Base tutorial flow/layout: `tutorial-lab.html`
- Rule: チュートリアルの画面構成・色・文字階層・メッセージ領域・ボタン表現は、今後の本編UIデザインの基準として扱う。
- Rule: 統合時に旧PhaseのCSSで見た目を上書きしない。必要な場合は共通UI側へ基準を移植する。
- Approved copy patch: アブ・シンベル神殿は「約3300年前に建造」「今から約60年前（1960年代）にダム建設で水没危機」という時間軸が分かる説明を使用する。
- Nationwide transition rule: 全国移動方式の採用後は、チュートリアル末尾の北海道は「最初のエリア」ではなく、**全国自由移動の中で最初に向かう推奨地点**として扱う。

## Piramiton
- Status: **APPROVED**
- Canonical implementation: `piramiton-svg.js`
- Current approved blob SHA: `ccfb4364d2eec5b9abe72b45aee3b421ea322261`
- Tutorial usage: `tutorial-design-baseline.html` は `piramiton-svg.js` を直接利用する。
- Forbidden for new/approved screens: `piramiton-expr.js` / `piramiton-action.js` を最新版ピラミトンの代替として使用しない。
- Approved tuning defaults:
  - armThickness: 10
  - armLength: 3
  - armY: 66
  - armSpread: 4.5
  - mouthY: -4
  - faceX: -3
  - sideRatio: 0.20
- Expression rule: happy / excited は通常と同じ口を使い、目だけ軽く弓形にする。

## Nationwide Movement
- Status: **APPROVED**
- Canonical Lab: `area-map-lab.html`
- Scope: 旧4エリア切替を廃止し、北海道から沖縄までを一枚の日本地図として自由に移動する方式を定義する。
- Map rule: 旧4エリアLabで確認したマス粒度を維持し、日本列島であることを視認できる縮尺を優先する。
- Map rule: 旧エリア境界のグレー部分は全国版では通常の陸地として接続し、画面切替用の境界は設けない。
- Movement rule: 北海道〜沖縄まで、浅瀬を含む一枚のマップ内を移動する。エリアCLEARを移動解放条件にはしない。
- Camera rule: **主人公を画面中央に固定し、移動すると日本地図全体が反対方向へ動く方式**を採用する。
- Rejected approach: `japan-follow-camera-lab.html` のデッドゾーン追従方式は不採用。
- Tutorial rule: 北海道は開始推奨地点として案内してよいが、全国移動そのものを北海道エリアに限定しない。

## Research Center Growth
- Status: **APPROVED**
- Canonical Lab: `research-center-style-lab.html`
- Approved Lab version: **RESEARCH CENTER GROWTH LAB 3**
- Approved blob SHA: `51e46c97fa0893002378ceda06ff5e4bbeb00cd5`
- Scope: 国内世界遺産の研究センターについて、マップ上の成長表現と施設内部の共通構造を定義する。
- Map progression:
  1. **LV1 = 未発見**。マップ上は施設を表示せず `?` とする。
  2. **LV2 = 小さな研究拠点**。発見後に初めて施設が現れる。
  3. **LV3 = 研究センター**。
  4. **LV4 = 完成研究施設**。
- Map rule: 施設は本番マップの粒度を崩さない **1〜2タイル程度の小さなドット表現**とし、大きな建物イラストを重ねない。
- Interior rule: 研究センター内部は一枚絵ではなく、**主人公が自由に歩けるRPG型タイルマップ**とする。
- Interior progression:
  - LV1: 未発見のため内部なし。
  - LV2: 質素な研究拠点。中央展示、本、最低限の調査員などから開始。
  - LV3: 本棚・調査員・資料・展示が増え、研究センターらしく発展する。
  - LV4: 本棚・複数調査員・詳細資料・追加展示などが揃った完成状態。
- Interaction rule: 展示・本・本棚・調査員・資料等の隣まで主人公が移動すると、`しらべる` / `読む` / `はなす` などの調査アクションを出す。
- Type rule: 施設の基本デザインは **自然遺産 / 文化遺産の2タイプ**を共通ベースとする。
- Heritage-specific rule: 遺産ごとの専用デザインは増やしすぎず、**壁の額などのワンポイント**で象徴を表現する。マップ上施設には原則として遺産固有アイコンを載せない。
- Growth intent: プレイヤーの調査・再訪・やり込みに応じて、研究センターの外観と内部が育つこと自体を報酬・達成感として扱う。
- Rule: 今後の遺産別Lab（知床、北海道・北東北の縄文遺跡群など）は、この共通仕様を土台として作成する。

## Phase 8 — Playable Game Loop
- Status: **APPROVED / COMPLETE**
- Approved date: **2026-08-22**
- Integrated page: `integrated-preview.html`
- Nationwide game page: `area-map-game.html`
- Research center game page: `research-center-game.html`
- Rule: Labはデザイン・単機能検証用として残し、本編ではゲーム用画面からLabを直接見せない。
- Nationwide implementation: `area-map-game.html` は `area-map-lab.html` の確定済み地形生成・中央固定移動ロジックを再利用し、Lab用タイトル、地形調整、世界遺産一覧、ジャンプ、デバッグ表示を除去する。
- Nationwide game UI: 未発見遺産は `?`、接近時に `しらべる`、発見後は研究センター外観と `入る` を表示する。最低限の調査HUDとメニューを持つ。
- Research center implementation: `research-center-game.html` はLabで確定した自然遺産研究センターの見た目をゲーム画面へ移植し、レベル切替・遺産選択・比較・説明UIを持たない。
- Research center controls: 全国マップと同様にキーボード / WASD / iPad向けスティックで主人公を移動する。
- Approved Golden Path:
  1. チュートリアルを完了する。
  2. 日本全国マップへ移動する。
  3. 知床の `?` に到達する。
  4. `しらべる` で発見し、LV2研究拠点になる。
  5. 研究センター内部へ入り、主人公を自由移動する。
  6. `本を読む` / `展示をしらべる` / `調査員とはなす` の3項目を実行する。
  7. 調査 3/3 でLV2 → LV3へ成長する。
  8. 出口から全国マップへ戻る。
  9. 全国マップ上の知床研究センター外観もLV3へ同期する。
- State note: Phase 8統合版では確認用に `sessionStorage` を利用する。永続セーブは後続フェーズで実装する。
- Query shortcuts: `?start=tutorial|map|center`。`?reset=1` で知床のゲーム進行状態を初期化して確認できる。

## Phase 9 — UI / UX Baseline
- Status: **NEXT**
- Goal: Phase 8で成立したGolden Pathを、子どもが迷わず楽しく操作できる本編UIへ整える。
- Scope: 全国マップHUD、研究センターのメッセージ・アクションUI、主人公・`?`・研究対象の視認性、iPad横向き操作、共通ボタン・文字階層、ピラミトンの配置方針を確定する。
- Rule: Phase 9ではゲームの骨格を変えず、Phase 8で承認した遷移・全国移動方式・研究センター成長構造を前提にブラッシュアップする。
- Deferred: クイズ本格実装、図鑑/調査記録の本格化、全27遺産展開、効果音/BGM最終調整、セリフ最終稿、最終演出磨き込みは後続フェーズへ回す。

## Workflow rule
1. Labで単機能を確認する。
2. APPROVEDになったものはこの台帳へ正本を登録する。
3. Previewでは、この台帳に記載された正本を必ず参照して統合する。
4. Preview確認後にMainへ反映する。
5. 別チャットで作業する場合も、最初にこの台帳を確認する。
