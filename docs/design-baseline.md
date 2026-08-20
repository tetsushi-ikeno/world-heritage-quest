# World Heritage Quest — Design Baseline

このファイルは、別チャット・別Lab・統合作業で「どれが確定版か」を迷わないための正本台帳です。

## Tutorial
- Status: **APPROVED DESIGN BASELINE**
- Canonical page: `tutorial-design-baseline.html`
- Baseline version: **1**
- Base tutorial flow/layout: `tutorial-lab.html`
- Rule: チュートリアルの画面構成・色・文字階層・メッセージ領域・ボタン表現は、今後の本編UIデザインの基準として扱う。
- Rule: 統合時に旧PhaseのCSSで見た目を上書きしない。必要な場合は共通UI側へ基準を移植する。

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

## Workflow rule
1. Labで単機能を確認する。
2. APPROVEDになったものはこの台帳へ正本を登録する。
3. Previewでは、この台帳に記載された正本を必ず参照して統合する。
4. Preview確認後にMainへ反映する。
5. 別チャットで作業する場合も、最初にこの台帳を確認する。
