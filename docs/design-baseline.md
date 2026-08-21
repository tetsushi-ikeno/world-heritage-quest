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
- Map rule: `area-map-lab.html` で確定した地形生成を正本とし、統合Preview側で日本地図を再生成しない。
- Map rule: 旧4エリアLabで確認したマス粒度を維持し、日本列島であることを視認できる縮尺を優先する。
- Map rule: 旧エリア境界のグレー部分は全国版では通常の陸地として接続し、画面切替用の境界は設けない。
- World size in canonical Lab: **86 × 75 tiles**。
- Movement rule: 北海道〜沖縄まで、浅瀬を含む一枚のマップ内を移動する。エリアCLEARを移動解放条件にはしない。
- Camera rule: **主人公固定・地図移動方式**。主人公は常に画面中央に表示し、移動操作に応じて地図全体を反対方向へ動かす。
- Camera rule: 以前検討したデッドゾーン追従方式 `japan-follow-camera-lab.html` は採用しない。
- UX intent: 操作中も主人公の位置を見失いにくくしつつ、日本地図そのものを移動している感覚を優先する。
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

## Integrated Preview
- Status: **PREVIEW**
- Page: `integrated-preview.html`
- Purpose: 細部を完成させる前に、チュートリアル → 全国移動 → 遺産発見 → 研究センター成長というゲーム全体像を最短で確認する。
- Flow: チュートリアル完了 → `area-map-lab.html` ベースの日本全国マップ → 知床の `?` を発見 → LV2研究拠点 → 調査・成長確認 → 全国マップへ戻る。
- Preview rule: 全国マップは `area-map-lab.html` を直接利用し、地形・移動方式をPreview側で複製しない。
- Preview rule: 知床を代表地点として、全国マップ上の表示も `? → LV2 → LV3 → LV4` に同期させる。
- Preview rule: 研究センター内部は `research-center-style-lab.html` の確定仕様を直接利用し、Preview側で別デザインを作らない。
- Priority: 現段階では細かなセリフ・演出・個別遺産コンテンツの完成度よりも、ゲーム全体のループを早く把握できることを優先する。
- Query shortcuts: `?start=tutorial|map|center`、研究センターは `?start=center&level=1..4` で個別確認できる。

## Workflow rule
1. Labで単機能を確認する。
2. APPROVEDになったものはこの台帳へ正本を登録する。
3. Previewでは、この台帳に記載された正本を必ず参照して統合する。
4. Preview確認後にMainへ反映する。
5. 別チャットで作業する場合も、最初にこの台帳を確認する。
