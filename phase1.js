// v17 Phase 1: movement flow + Hokkaido lock + Shiretoko village shell
// Keep the v16 engine intact and layer the new vertical-slice behavior here.

const phase1BaseRender = render;
const phase1BaseRows = rows;
const phase1BasePassable = passable;
const phase1BaseMove = move;
const phase1BaseContinueFromDiscovery = continueFromDiscovery;
const phase1BaseOpenSiteDialog = openSiteDialog;
const phase1BaseRecommendedSiteKey = recommendedSiteKey;

// ------------------------------------------------------------
// Phase 0: make the opening village read from right to left.
// ------------------------------------------------------------
const phase1VillageRows = [
  "FFFFFFFFFFFFFF",
  "F............F",
  "F...H....H...F",
  "F............F",
  "F............F",
  "GPPPPPPPPPPPPF",
  "F............F",
  "F....H....H..F",
  "F............F",
  "F............F",
  "FFFFFFFFFFFFFF"
];

villageRows.splice(0, villageRows.length, ...phase1VillageRows);
Object.keys(npcs).forEach(key => delete npcs[key]);
Object.assign(npcs, {
  "10,4": {
    id: "traveler",
    name: "旅人",
    cls: "",
    lines: [
      "旅に出るなら、まず世界遺産のことを少し知っておくといいよ。",
      "世界遺産には「文化遺産」「自然遺産」「複合遺産」の3つの種類があるんだ。"
    ]
  },
  "7,6": {
    id: "researcher",
    name: "森の研究者",
    cls: "researcher",
    lines: [
      "自然遺産は、すばらしい自然や、生き物、地形などに大きな価値がある場所だよ。",
      "これから日本の自然遺産をめぐるなら、どんな自然が守られているのか見てみると面白いよ。"
    ]
  },
  "4,4": {
    id: "elder",
    name: "村の長老",
    cls: "elder",
    lines: [
      "世界遺産として認められるための「登録基準」は、全部で10個ある。",
      "今は10個の中身まで覚えなくてよいぞ。旅をしながら少しずつ知っていけばよい。"
    ]
  }
});

// ------------------------------------------------------------
// Phase 1: generic site-village shell. No investigation commands yet.
// ------------------------------------------------------------
const shiretokoRows = [
  "FFFFFFFFFFFFFF",
  "F.....K......F",
  "F............F",
  "F....R.......F",
  "F............F",
  "F.....NN.....F",
  "F.....NN..B..F",
  "F............F",
  "F............F",
  "F.....E......F",
  "FFFFFFFFFFFFFF"
];

function isHokkaidoAccessible(x, y) {
  if (y < 0 || y >= japanRows.length || x < 0 || x >= japanRows[0].length) return false;
  const cell = japanRows[y][x];
  // The current Hokkaido island occupies the top part of the Japan map.
  // The light-blue sea route below it will become the future gate to Honshu (East).
  return y <= 5 && cell !== "~";
}

rows = function () {
  if (mode === "site") return shiretokoRows;
  return phase1BaseRows();
};

recommendedSiteKey = function () {
  if (mode === "japan") {
    return discovered["知床"] ? null : "22,3";
  }
  return phase1BaseRecommendedSiteKey();
};

function renderShiretokoVillage() {
  const r = shiretokoRows;
  const W = r[0].length;
  const H = r.length;
  const map = document.getElementById("map");
  map.innerHTML = "";
  map.dataset.mode = "site";
  map.style.gridTemplateColumns = `repeat(${W},var(--tile))`;
  map.style.gridTemplateRows = `repeat(${H},var(--tile))`;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const d = document.createElement("div");
      const c = r[y][x];
      let cls = "grass";
      if (c === "F") cls = "forest";
      if (c === "N") cls = "heritageNature";
      if (c === "R") cls = "npc researcher siteNpc";
      if (c === "B") cls = "siteBook";
      if (c === "K") cls = "siteGateLocked";
      if (c === "E") cls = "siteExit";

      d.className = "tile " + cls + (x === px && y === py ? " player" : "");
      d.dataset.x = x;
      d.dataset.y = y;

      if (x === px && y === py) {
        const av = document.createElement("div");
        av.className = "mapAvatar";
        av.innerHTML = '<div class="mapHair"></div><div class="mapFace"></div><div class="mapBody"></div><div class="mapItem">' + avatar.item + '</div>';
        d.appendChild(av);
      }
      map.appendChild(d);
    }
  }

  document.getElementById("progressHud").classList.remove("show");
  setMapTitle("知床の里");
  setGuideMessage("知床の里に着いたよ。まずは歩いて、どんな場所か見てみよう！");
  document.getElementById("status").textContent = "フェーズ1では、里の中を歩いて見て回れます。調査コマンドはまだありません。";
  document.getElementById("legend").textContent = "中央＝世界遺産の象徴　📖＝本　人＝NPC　🔒＝門　↓＝北海道マップへもどる";
  requestAnimationFrame(updateMapScale);
}

render = function () {
  if (mode === "site") {
    renderShiretokoVillage();
    return;
  }

  phase1BaseRender();

  if (mode === "japan") {
    setMapTitle("北海道エリア");
    setGuideMessage(discovered["知床"]
      ? "知床を発見したね。もう一度「！」に触れると、知床の里へ入れるよ。"
      : "北海道から冒険スタート！ まずは近くの「？」を探してみよう！");
    document.getElementById("status").textContent = "今は北海道だけを冒険できます。本州（東）へ続く道はまだ閉じています。";
    document.getElementById("legend").textContent = "？＝未発見　！＝発見済み　🔒＝まだ進めないエリア";
  }
};

passable = function (x, y) {
  if (mode === "site") {
    const c = shiretokoRows[y] && shiretokoRows[y][x];
    return c === "." || c === "E";
  }
  if (mode === "japan" && !isHokkaidoAccessible(x, y)) return false;
  return phase1BasePassable(x, y);
};

function enterShiretokoVillage() {
  mode = "site";
  px = 6;
  py = 8;
  document.getElementById("discovery").classList.add("hidden");
  document.getElementById("siteDialog").classList.add("hidden");
  document.getElementById("quiz").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  render();
}

move = function (dx, dy) {
  if (transitionLock) return;

  if (mode === "japan") {
    const nx = px + dx;
    const ny = py + dy;
    if (ny >= 0 && ny < japanRows.length && nx >= 0 && nx < japanRows[0].length) {
      const target = japanRows[ny][nx];
      if (target !== "~" && !isHokkaidoAccessible(nx, ny)) {
        setGuideMessage("🔒 この先の本州（東）はまだ開いていないみたい。まずは北海道を冒険しよう！");
        return;
      }
    }
    phase1BaseMove(dx, dy);
    return;
  }

  if (mode !== "site") {
    phase1BaseMove(dx, dy);
    return;
  }

  const nx = px + dx;
  const ny = py + dy;
  if (ny < 0 || ny >= shiretokoRows.length || nx < 0 || nx >= shiretokoRows[0].length) return;

  const c = shiretokoRows[ny][nx];
  if (c === "E") {
    mode = "japan";
    px = 22;
    py = 4;
    render();
    setGuideMessage("北海道マップにもどったよ。知床の「！」に触れれば、また里に入れるよ。");
    return;
  }

  if (!passable(nx, ny)) {
    setGuideMessage("ここには何かあるみたい。調べられるようになるのは次のフェーズから！");
    return;
  }

  px = nx;
  py = ny;
  render();
};

continueFromDiscovery = function () {
  if (currentSite === "知床") {
    enterShiretokoVillage();
    return;
  }
  phase1BaseContinueFromDiscovery();
};

openSiteDialog = function () {
  if (currentSite === "知床") {
    enterShiretokoVillage();
    return;
  }
  phase1BaseOpenSiteDialog();
};

enterJapanMap = function () {
  mode = "japan";
  px = 20;
  py = 4;
  render();
  setGuideMessage("北海道から冒険スタート！ まずは近くの「？」を探してみよう！");
};

// Fresh-start position for this phase.
mode = "village";
px = 12;
py = 5;
currentSite = null;
talked.traveler = false;
talked.researcher = false;
talked.elder = false;
render();
