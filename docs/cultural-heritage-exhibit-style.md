# 文化遺産 展示グラフィック基準 v0.1

> **旧ルール / 参照用**  
> この文書は初期SVG・Lab制作時の記録として保持する。2026-08-30以降の研究センター展示グラフィック制作では、`docs/heritage-graphics-style-guide.md` と `docs/heritage-graphics-decisions.md` を正本として優先する。内容が衝突した場合は新しい2文書を採用する。

更新日: 2026-08-30  
対応Lab: `cultural-heritage-center-placement-lab.html`

## 2026-08-30 確定

初期3遺産（厳島神社・姫路城・法隆寺）の展示グラフィックを確定し、以下を正本SVGとして保存した。

- `docs/assets/heritage-exhibits/cultural/itsukushima-shrine.svg`
- `docs/assets/heritage-exhibits/cultural/himeji-castle.svg`
- `docs/assets/heritage-exhibits/cultural/horyuji.svg`

以後の文化遺産はこの3点のフラットトーン、細い滑らかな白縁、柔らかな落ち影、4×4マス基準に合わせる。  
Revision: `LAB / r20260830-04`

## 目的

研究センター内で、各文化遺産の展示物をセンターの主役として見せるためのグラフィック基準を固定する。

## 確定・準確定している基準

- 文化遺産と自然遺産は分けて検討する。現時点では文化遺産のみ対象。
- 展示物は研究センター内で **4×4マス相当** を基本サイズとする。
- グラフィックは **フラットなトーン** とし、写真風・3D風にはしない。
- 背景景観は原則描かず、遺産の識別に必要な構造・シルエットを優先する。
- 背景と同化しないよう **細い白縁** をつける。
- 白縁はCSSの多重drop-shadowではなく、SVGの `feMorphology` で外形を膨張させ、滑らかな輪郭を作る。
- 影は **下方向に柔らかく** 落とし、展示物が床・壁から分離して見えることを目的とする。
- 影による紙芝居・切り抜き感は許容する。視認性を優先する。
- 4×4表示で特徴が読めることを優先し、細密描写は避ける。

## 3遺産の基準

### 厳島神社
- 主役は大鳥居。
- 水面は残す。
- 山・空・遠景は描かない。
- 朱色の柱と長い横木で一目で識別できることを重視する。

### 姫路城
- 白い天守だけではなく、屋根端の反りと破風の形を識別要素にする。
- 入母屋・千鳥破風を簡略化して正面のリズムを作る。
- 石垣は残す。
- 桜は補助要素として使用可。

### 法隆寺
- 五重塔＋金堂の組み合わせで識別する。
- 五重塔の縦長シルエットと金堂の横長シルエットの対比を残す。

## 検証ポイント

1. 研究センター18×11マスの中で、4×4展示が主役として見えるか。
2. 主人公1マスとのサイズ関係が過大・過小でないか。
3. 白縁が太すぎず、背景との分離に十分か。
4. 白縁にギザギザが出ず、曲線や屋根端が滑らかに見えるか。
5. 影が強すぎず、視認性だけを補助しているか。
6. 4×4サイズで各遺産の識別特徴が残っているか。

## 現在の基準値

- 白縁: SVG `feMorphology radius=3` を基準。
- 影: `stdDeviation=3`, `dy=5`, opacity 約0.30 を基準。
- Lab上で白縁「細め/やや太め」、影「やわらか/やや強め/なし」を切り替えて比較可能。

## Batch 01（未確定・確認中）

Revision: `LAB / r20260830-05`

対象:
- 古都京都の文化財（金閣寺モチーフ）
- 古都奈良の文化財（東大寺モチーフ）
- 日光の社寺（陽明門モチーフ）
- 原爆ドーム
- 白川郷・五箇山の合掌造り集落

確認Lab: `cultural-heritage-exhibit-batch01-lab.html`

この5点は未確定。Lab確認後に修正し、確定時のみ個別SVGとして `docs/assets/heritage-exhibits/cultural/` へ保存する。

## Batch 01 確定（2026-08-30）

以下5点を確定し、正本SVGとして保存した。

- 古都京都の文化財（金閣寺）: `docs/assets/heritage-exhibits/cultural/kyoto-kinkakuji.svg`
- 古都奈良の文化財（東大寺大仏）: `docs/assets/heritage-exhibits/cultural/nara-todaiji-daibutsu.svg`
- 日光の社寺（陽明門）: `docs/assets/heritage-exhibits/cultural/nikko-yomeimon.svg`
- 原爆ドーム: `docs/assets/heritage-exhibits/cultural/hiroshima-genbaku-dome.svg`
- 白川郷・五箇山の合掌造り集落: `docs/assets/heritage-exhibits/cultural/shirakawago-gokayama.svg`

制作ルールは「実物の形状・プロポーションはできるだけ忠実に、表面表現だけフラットにする」を優先する。
