// v17 Phases 1-4: guided opening + Hokkaido lock + Shiretoko learning loop
// The v16 engine remains intact; this file layers the vertical-slice prototype on top.

const phaseBaseRender = render;
const phaseBaseRows = rows;
const phaseBasePassable = passable;
const phaseBaseMove = move;
const phaseBaseContinueFromDiscovery = continueFromDiscovery;
const phaseBaseOpenSiteDialog = openSiteDialog;
const phaseBaseRecommendedSiteKey = recommendedSiteKey;

// ------------------------------------------------------------
// Phase 0: opening village reads clearly from right to left.
// ------------------------------------------------------------
const phaseVillageRows = [
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

villageRows.splice(0, villageRows.length, ...phaseVillageRows);
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
// Shiretoko village shell shared by the learning-loop prototype.
// N: heritage object / R: researcher / B: book / K: locked gate / E: exit
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

// ------------------------------------------------------------
// Phase 4: Shiretoko card model.
// property = what kind of knowledge it is; value = concrete knowledge collected.
// ------------------------------------------------------------
const shiretokoCards = [
  { id:"type", property:"遺産の種類", icon:"◆", value:"自然遺産", description:"知床は、自然そのものの価値が認められた世界自然遺産。" },
  { id:"place", property:"場所", icon:"📍", value:"北海道北東部・知床半島", description:"知床は北海道の北東部にある半島で、周辺の海域も世界遺産の範囲に含まれる。" },
  { id:"ice", property:"自然現象", icon:"❄️", value:"流氷", description:"冬にはオホーツク海から流氷がやってくる。知床周辺は、低い緯度で海氷が見られる「季節海氷域」として知られる。" },
  { id:"owl", property:"生き物", icon:"🐾", value:"シマフクロウ", description:"知床で見られる代表的な希少な鳥のひとつ。" },
  { id:"bear", property:"生き物", icon:"🐾", value:"ヒグマ", description:"知床に生息する大型の野生動物。海や川の恵みとも深く関わって暮らしている。" },
  { id:"ecosystem", property:"生態系", icon:"🔗", value:"海・川・森のつながり", description:"海の栄養が魚やサケを通して川や森へ運ばれ、海と陸の生き物がつながっている。" },
  { id:"year", property:"登録年", icon:"🗓️", value:"2005年", description:"知床が世界自然遺産に登録されたのは2005年。" },
  { id:"criteria", property:"登録基準", icon:"📜", value:"(ix)・(x)", description:"生態系の営みと、生物多様性・希少な生き物の生息地としての価値が認められている。" }
];

const phaseCardState = Object.fromEntries(shiretokoCards.map(card => [card.id, { acquired:false, isNew:false }]));
let phaseAnimalSearchGap = 0;
let phaseCodexSelected = null;
let phaseIntroNoticePending = false;

function getPhaseCard(id){ return shiretokoCards.find(card => card.id === id); }
function isCardAcquired(id){ return !!phaseCardState[id]?.acquired; }
function acquiredCardCount(){ return shiretokoCards.filter(card => isCardAcquired(card.id)).length; }
function newCardCount(){ return shiretokoCards.filter(card => phaseCardState[card.id]?.isNew).length; }

function acquireCard(id, markNew=true){
  const state = phaseCardState[id];
  if(!state || state.acquired) return false;
  state.acquired = true;
  state.isNew = markNew;
  updateCodexBadge();
  return true;
}

function ensureDiscoveryCards(){
  const addedType = acquireCard("type", true);
  const addedPlace = acquireCard("place", true);
  if(addedType || addedPlace) phaseIntroNoticePending = true;
}

// ------------------------------------------------------------
// Lightweight UI injected for phases 2-4.
// ------------------------------------------------------------
function ensurePhaseUi(){
  if(!document.getElementById("phaseAction")){
    const action = document.createElement("section");
    action.id = "phaseAction";
    action.className = "panel hidden phaseActionPanel";
    action.innerHTML = `
      <div class="phaseActionKicker" id="phaseActionKicker">SHIRETOKO</div>
      <h2 id="phaseActionTitle"></h2>
      <div id="phaseActionText" class="phaseActionText"></div>
      <div id="phaseActionButtons" class="phaseActionButtons"></div>
    `;
    document.getElementById("app").appendChild(action);
  }

  if(!document.getElementById("phaseCodex")){
    const codex = document.createElement("section");
    codex.id = "phaseCodex";
    codex.className = "panel hidden phaseCodexPanel";
    codex.innerHTML = `
      <div class="phaseCodexHeader">
        <div>
          <div class="phaseActionKicker">WORLD HERITAGE BOOK</div>
          <h2>知床の図鑑</h2>
        </div>
        <button class="bigbtn phaseSmallButton" id="phaseCodexClose">里にもどる</button>
      </div>
      <div class="phaseCodexCount" id="phaseCodexCount"></div>
      <div class="phaseCardGrid" id="phaseCardGrid"></div>
      <div class="phaseCodexDetail" id="phaseCodexDetail">カードを選ぶと、くわしく見られます。</div>
    `;
    document.getElementById("app").appendChild(codex);
    document.getElementById("phaseCodexClose").onclick = closeCodex;
  }

  if(!document.getElementById("phaseCodexButton")){
    const button = document.createElement("button");
    button.id = "phaseCodexButton";
    button.className = "phaseCodexButton hidden";
    button.innerHTML = `<span>📖 知床の図鑑</span><span id="phaseCodexBadge" class="phaseNewBadge hidden">NEW</span>`;
    button.onclick = openCodex;
    const record = document.querySelector(".recordSection");
    if(record) record.appendChild(button);
  }
}

function showGame(){
  document.getElementById("phaseAction")?.classList.add("hidden");
  document.getElementById("phaseCodex")?.classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
}

function showAction(title, text, options, kicker="SHIRETOKO"){
  ensurePhaseUi();
  document.getElementById("game").classList.add("hidden");
  document.getElementById("phaseCodex").classList.add("hidden");
  const panel = document.getElementById("phaseAction");
  panel.classList.remove("hidden");
  document.getElementById("phaseActionKicker").textContent = kicker;
  document.getElementById("phaseActionTitle").textContent = title;
  document.getElementById("phaseActionText").textContent = text;
  const buttons = document.getElementById("phaseActionButtons");
  buttons.innerHTML = "";
  options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "bigbtn" + (index === 0 ? " phasePrimary" : "");
    button.textContent = option.label;
    button.onclick = option.action;
    buttons.appendChild(button);
  });
}

function closeAction(){
  showGame();
  render();
}

function updateCodexBadge(){
  ensurePhaseUi();
  const badge = document.getElementById("phaseCodexBadge");
  if(!badge) return;
  const count = newCardCount();
  badge.textContent = count > 1 ? `NEW ${count}` : "NEW";
  badge.classList.toggle("hidden", count === 0);
}

function openCodex(){
  ensurePhaseUi();
  document.getElementById("game").classList.add("hidden");
  document.getElementById("phaseAction").classList.add("hidden");
  document.getElementById("phaseCodex").classList.remove("hidden");
  renderCodex(phaseCodexSelected);
}

function closeCodex(){
  phaseCodexSelected = null;
  showGame();
  render();
}

function renderCodex(selectedId=null){
  ensurePhaseUi();
  const grid = document.getElementById("phaseCardGrid");
  grid.innerHTML = "";
  document.getElementById("phaseCodexCount").textContent = `${acquiredCardCount()} / ${shiretokoCards.length} 記録`;

  shiretokoCards.forEach(card => {
    const state = phaseCardState[card.id];
    const item = document.createElement("button");
    item.className = "phaseCardSlot " + (state.acquired ? "acquired" : "missing") + (selectedId === card.id ? " selected" : "");
    item.innerHTML = `
      <span class="phaseCardProperty"><span class="phaseCardIcon">${card.icon}</span>${card.property}</span>
      <span class="phaseCardValue">${state.acquired ? card.value : "？？？"}</span>
      ${state.isNew ? '<span class="phaseCardNew">NEW</span>' : ''}
    `;
    if(state.acquired){
      item.onclick = () => {
        state.isNew = false;
        phaseCodexSelected = card.id;
        updateCodexBadge();
        renderCodex(card.id);
      };
    }
    grid.appendChild(item);
  });

  const detail = document.getElementById("phaseCodexDetail");
  const selected = selectedId ? getPhaseCard(selectedId) : null;
  if(selected && isCardAcquired(selected.id)){
    detail.innerHTML = `<strong>${selected.icon} ${selected.property}｜${selected.value}</strong><br>${selected.description}`;
  }else{
    detail.textContent = "NEWのカードを選ぶと確認できます。未取得のカードは、属性を手がかりに里を調べてみよう。";
  }
}

// ------------------------------------------------------------
// Phase 2: heritage investigation / animal discovery.
// ------------------------------------------------------------
function openHeritageActions(){
  showAction(
    "知床をしらべてみよう！",
    "森や海のようすを、自分で調べてみよう。",
    [
      { label:"流氷をしらべる", action: investigateIce },
      { label:"生き物をさがす", action: searchAnimals },
      { label:"またあとで", action: closeAction }
    ]
  );
}

function investigateIce(){
  const isNew = acquireCard("ice", true);
  const text = isNew
    ? "海に白い氷がうかんでいる！\n\n冬になるとオホーツク海から流氷がやってくるんだ。\n\n「流氷」を図鑑に記録した！"
    : "流氷が海をおおっている。\n\n「流氷」のことは、もう図鑑に記録してあるよ。";
  showAction("流氷をしらべた！", text, [
    { label:"もどる", action:closeAction }
  ], "FOUND");
}

function remainingAnimalCards(){
  return ["owl","bear"].filter(id => !isCardAcquired(id));
}

function searchAnimals(){
  const remaining = remainingAnimalCards();
  if(remaining.length === 0){
    showAction(
      "生き物をさがした！",
      "ほかにもたくさんの生き物がくらしているようだ。\n\nこの場所で図鑑に記録できる生き物は、全部見つけた！",
      [{ label:"もどる", action:closeAction }],
      "COMPLETE"
    );
    return;
  }

  phaseAnimalSearchGap += 1;
  const firstDiscovery = remaining.length === 2;
  let found = false;

  // Controlled randomness: misses are part of the experience, but bad luck cannot continue forever.
  if(firstDiscovery){
    if(phaseAnimalSearchGap >= 3) found = true;
    else if(phaseAnimalSearchGap === 2) found = Math.random() < 0.45;
  }else{
    if(phaseAnimalSearchGap >= 2) found = true;
    else found = Math.random() < 0.45;
  }

  if(!found){
    showAction(
      "生き物をさがした！",
      "…………。\n\nなにも見つからなかった。\nまたさがしてみよう。",
      [
        { label:"もう一度さがす", action:searchAnimals },
        { label:"いったんもどる", action:closeAction }
      ],
      "SEARCH"
    );
    return;
  }

  const foundId = remaining[Math.floor(Math.random() * remaining.length)];
  const card = getPhaseCard(foundId);
  phaseAnimalSearchGap = 0;
  acquireCard(foundId, true);
  const stillRemaining = remainingAnimalCards().length > 0;
  const text = stillRemaining
    ? `${card.value}をみつけた！\n\n図鑑に記録した！\n\nほかにもまだ生き物がいそうだ。`
    : `${card.value}をみつけた！\n\n図鑑に記録した！\n\nほかにもたくさんの生き物がくらしているようだ。\nこの場所で図鑑に記録できる生き物は、全部見つけた！`;

  const options = stillRemaining
    ? [
        { label:"もう少しさがす", action:searchAnimals },
        { label:"いったんもどる", action:closeAction }
      ]
    : [{ label:"もどる", action:closeAction }];

  showAction(`${card.value}をみつけた！`, text, options, "FOUND");
}

// ------------------------------------------------------------
// Phase 3: learn from a person / read a book.
// ------------------------------------------------------------
function openResearcherActions(){
  showAction(
    "ちょうさいんがいる！",
    "知床のことを調べているみたいだ。",
    [
      { label:"はなしてみる", action:talkToResearcher },
      { label:"またあとで", action:closeAction }
    ]
  );
}

function talkToResearcher(){
  const isNew = acquireCard("ecosystem", true);
  const text = isNew
    ? "「知床では、海の栄養が魚やサケを通して川や森へ運ばれているんだ。海と陸の生き物は、深くつながっているんだよ。」\n\n「海・川・森のつながり」を図鑑に記録した！"
    : "「流氷、魚、サケ、森の生き物。知床では海と陸がつながっているんだよ。」\n\nこのことは、もう図鑑に記録してあるよ。";
  showAction("ちょうさいんの話を聞いた！", text, [{ label:"もどる", action:closeAction }], "LEARNED");
}

function openBookActions(){
  showAction(
    "本をみつけた！",
    "知床の世界遺産登録について書かれているみたいだ。",
    [
      { label:"読んでみる", action:readBook },
      { label:"またあとで", action:closeAction }
    ]
  );
}

function readBook(){
  const addedYear = acquireCard("year", true);
  const addedCriteria = acquireCard("criteria", true);
  let text;
  if(addedYear || addedCriteria){
    text = "知床が世界自然遺産に登録されたのは2005年。\n登録基準は (ix) と (x) なんだ。\n\n「2005年」と「(ix)・(x)」を図鑑に記録した！";
  }else{
    text = "知床が登録されたのは2005年。登録基準は (ix) と (x)。\n\nこの内容は、もう図鑑に記録してあるよ。";
  }
  showAction("本を読んだ！", text, [{ label:"もどる", action:closeAction }], "READ");
}

function showLockedGate(){
  showAction(
    "鍵のかかった門がある！",
    "かたい扉で閉ざされている。\n今はまだ開け方がわからないみたいだ。",
    [{ label:"またあとで", action:closeAction }],
    "LOCKED"
  );
}

// ------------------------------------------------------------
// Map behavior.
// ------------------------------------------------------------
function isHokkaidoAccessible(x, y){
  if(y < 0 || y >= japanRows.length || x < 0 || x >= japanRows[0].length) return false;
  const cell = japanRows[y][x];
  return y <= 5 && cell !== "~";
}

rows = function(){
  if(mode === "site") return shiretokoRows;
  return phaseBaseRows();
};

recommendedSiteKey = function(){
  if(mode === "japan") return discovered["知床"] ? null : "22,3";
  return phaseBaseRecommendedSiteKey();
};

function renderShiretokoVillage(){
  ensurePhaseUi();
  const r = shiretokoRows;
  const W = r[0].length;
  const H = r.length;
  const map = document.getElementById("map");
  map.innerHTML = "";
  map.dataset.mode = "site";
  map.style.gridTemplateColumns = `repeat(${W},var(--tile))`;
  map.style.gridTemplateRows = `repeat(${H},var(--tile))`;

  for(let y=0; y<H; y++){
    for(let x=0; x<W; x++){
      const d = document.createElement("div");
      const c = r[y][x];
      let cls = "grass";
      if(c === "F") cls = "forest";
      if(c === "N") cls = "heritageNature";
      if(c === "R") cls = "npc researcher siteNpc";
      if(c === "B") cls = "siteBook";
      if(c === "K") cls = "siteGateLocked";
      if(c === "E") cls = "siteExit";

      d.className = "tile " + cls + (x === px && y === py ? " player" : "");
      d.dataset.x = x;
      d.dataset.y = y;

      if(x === px && y === py){
        const av = document.createElement("div");
        av.className = "mapAvatar";
        av.innerHTML = '<div class="mapHair"></div><div class="mapFace"></div><div class="mapBody"></div><div class="mapItem">' + avatar.item + '</div>';
        d.appendChild(av);
      }
      map.appendChild(d);
    }
  }

  document.getElementById("progressHud").classList.add("phaseHidden");
  const codexButton = document.getElementById("phaseCodexButton");
  codexButton.classList.remove("hidden");
  updateCodexBadge();

  setMapTitle("知床の里");
  if(phaseIntroNoticePending){
    setGuideMessage("知床を発見して、「遺産の種類」と「場所」が図鑑に記録されたよ。里を歩いて、ほかの知識も集めてみよう！");
    phaseIntroNoticePending = false;
  }else{
    setGuideMessage("中央の知床、本、ちょうさいんに近づいてみよう。図鑑の「？？？」を埋められるかも！");
  }
  document.getElementById("status").textContent = `知床の図鑑：${acquiredCardCount()} / ${shiretokoCards.length} 記録`;
  document.getElementById("legend").textContent = "中央＝自分で調べる　📖＝読む　人＝聞く　🔒＝まだ開かない門　↓＝北海道へもどる";
  requestAnimationFrame(updateMapScale);
}

render = function(){
  ensurePhaseUi();
  if(mode === "site"){
    renderShiretokoVillage();
    return;
  }

  document.getElementById("progressHud")?.classList.remove("phaseHidden");
  document.getElementById("phaseCodexButton")?.classList.add("hidden");
  phaseBaseRender();

  if(mode === "japan"){
    setMapTitle("北海道エリア");
    setGuideMessage(discovered["知床"]
      ? "知床を発見したね。もう一度「！」に触れると、知床の里へ入れるよ。"
      : "北海道から冒険スタート！ まずは近くの「？」を探してみよう！");
    document.getElementById("status").textContent = "今は北海道だけを冒険できます。本州（東）へ続く道はまだ閉じています。";
    document.getElementById("legend").textContent = "？＝未発見　！＝発見済み　🔒＝まだ進めないエリア";
  }
};

passable = function(x,y){
  if(mode === "site"){
    const c = shiretokoRows[y] && shiretokoRows[y][x];
    return c === "." || c === "E";
  }
  if(mode === "japan" && !isHokkaidoAccessible(x,y)) return false;
  return phaseBasePassable(x,y);
};

function enterShiretokoVillage(){
  ensureDiscoveryCards();
  mode = "site";
  px = 6;
  py = 8;
  document.getElementById("discovery").classList.add("hidden");
  document.getElementById("siteDialog").classList.add("hidden");
  document.getElementById("quiz").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  render();
}

move = function(dx,dy){
  if(transitionLock) return;

  if(mode === "japan"){
    const nx = px + dx;
    const ny = py + dy;
    if(ny >= 0 && ny < japanRows.length && nx >= 0 && nx < japanRows[0].length){
      const target = japanRows[ny][nx];
      if(target !== "~" && !isHokkaidoAccessible(nx,ny)){
        setGuideMessage("🔒 この先の本州（東）はまだ開いていないみたい。まずは北海道を冒険しよう！");
        return;
      }
    }
    phaseBaseMove(dx,dy);
    return;
  }

  if(mode !== "site"){
    phaseBaseMove(dx,dy);
    return;
  }

  const nx = px + dx;
  const ny = py + dy;
  if(ny < 0 || ny >= shiretokoRows.length || nx < 0 || nx >= shiretokoRows[0].length) return;
  const c = shiretokoRows[ny][nx];

  if(c === "N"){ openHeritageActions(); return; }
  if(c === "R"){ openResearcherActions(); return; }
  if(c === "B"){ openBookActions(); return; }
  if(c === "K"){ showLockedGate(); return; }

  if(c === "E"){
    mode = "japan";
    px = 22;
    py = 4;
    render();
    setGuideMessage("北海道マップにもどったよ。知床の「！」に触れれば、また里に入れるよ。");
    return;
  }

  if(!passable(nx,ny)){
    setGuideMessage("そこには進めないみたい。別の道を探してみよう！");
    return;
  }

  px = nx;
  py = ny;
  render();
};

continueFromDiscovery = function(){
  if(currentSite === "知床"){
    enterShiretokoVillage();
    return;
  }
  phaseBaseContinueFromDiscovery();
};

openSiteDialog = function(){
  if(currentSite === "知床"){
    enterShiretokoVillage();
    return;
  }
  phaseBaseOpenSiteDialog();
};

enterJapanMap = function(){
  mode = "japan";
  px = 20;
  py = 4;
  render();
  setGuideMessage("北海道から冒険スタート！ まずは近くの「？」を探してみよう！");
};

// Fresh-start state for the vertical slice.
ensurePhaseUi();
mode = "village";
px = 12;
py = 5;
currentSite = null;
talked.traveler = false;
talked.researcher = false;
talked.elder = false;
render();
