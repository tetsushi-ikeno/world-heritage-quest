# Phase 8 ゲームループ再構築

## 目的

Phase 7.5 までのコンテンツ・データ・見た目を土台として残しつつ、Phase ごとに `move()` / `render()` / 画面遷移を上書きする構造を廃止する。

Phase 8 では以下を唯一の流れとする。

`Input -> dispatch(event) -> GameState -> Renderer`

## 実行時ファイル

Phase 8 の `index.html` は旧コントローラである `app.js`、`phase1.js`、`phase41.js`、`phase56.js`、`phase57.js`、`phase62.js`、`phase7.js`、`phase71.js`、`phase72.js`、`phase73.js`、`phase75.js` を読み込まない。

代わりに以下を読み込む。

- `phase8-content.js`
  - 北海道マップ
  - 登録基準
  - 登録基準支部教材
  - 世界遺産ごとの里・カード・クイズ
- `phase8-engine.js`
  - GameState
  - `dispatch(event)`
  - 移動判定
  - イベント判定
  - 画面・オーバーレイ遷移
- `phase8-render.js`
  - 唯一の Renderer
  - GameState を読み取り画面を描画
- `phase8-input.js`
  - スティック
  - キーボード
  - 隣接マスタップ
  - 3方式すべて `MOVE` イベントへ統合
- `phase8-main.js`
  - 初期化のみ

旧 Phase ファイルは削除せず、Phase 7.5 の比較・ロールバック用としてリポジトリに残す。

## GameState

主要な状態は `Phase8Engine.getState()` で一元管理する。

- `screen`
  - avatar
  - intro
  - orientation
  - area
  - site
- `areaId`
- `siteId`
- `position`
- `progress.criteriaBranchCleared`
- `progress.discovered`
- `progress.siteCards`
- `progress.siteCleared`
- `ui.overlay`
  - branch
  - discovery
  - action
  - codex
  - quiz
  - quizResult

DOM の hidden 状態をゲーム状態として扱わない。DOM は Renderer が GameState から導出する。

## Golden Path

Phase 8 の最優先正常系は以下。

1. 北海道に到着
2. 登録基準支部へ移動
3. 支部教材を最後まで進める
4. 支部の確認問題を完了
5. 北海道へ戻る
6. 知床の `？` へ移動
7. 発見画面を表示
8. `知床の里へ` を選択
9. 知床の里へ入る
10. 里から北海道へ戻る
11. 再度知床へ入ると発見画面を再表示せず里へ入る

支部をクリアする前に知床へ到達した場合は、知床を発見状態にせず「先に登録基準支部へ行ってみよう」を表示する。

## 入力

スティック、キーボード、マップタップはすべて以下のイベントに変換する。

```js
Phase8Engine.dispatch({ type: 'MOVE', dx, dy });
```

入力側は海・施設・世界遺産などの意味を判断しない。すべて Game Engine 側で判断する。

スティックは `pointerup`、`pointercancel`、`lostpointercapture` のいずれでも停止する。オーバーレイ表示や画面遷移時にも Engine から停止させる。

## 自動テスト

Golden Path の状態遷移は以下で確認する。

```bash
node tests/phase8-golden-path.test.js
```

テスト対象:

- 支部CLEAR前は知床を発見できない
- 登録基準支部を完了できる
- 知床初回到達で discovery になる
- discovery から知床の里へ入れる
- 知床の里から北海道へ戻れる
- 2回目以降は discovery を再生せず直接里へ入る

## 公開条件

Phase 8 は以下が確認できるまで `main` / GitHub Pages に公開しない。

- Golden Path 自動テスト成功
- PCブラウザでGolden Path完走
- キーボード移動確認
- 隣接マスタップ確認
- iPad横向きSafariでスティック上下左右確認
- スティック長押し確認
- スティック途中方向変更確認
- イベント接触時に移動が停止することを確認
- 知床発見から里への遷移確認

