// v17 Phase 4.1 UX refinements
// - show only the active Hokkaido area
// - keep maps visible behind dialogs/actions/codex
// - reduce guide over-explanation

const phase41BaseRender = render;
const phase41BaseRows = rows;
const phase41BaseMove = move;
const phase41BaseContinueFromDiscovery = continueFromDiscovery;
const phase41BaseUpdateMapScale = updateMapScale;

const phase41HokkaidoRows = [
  "~~~~~~~~~~~~~~~~",
  "~~~~~LLLL~~~~~~~",
  "~~~~LLLLLLL~~~~~",
  "~~~LLLLLLLLLS~~~",
  "~~~LLLLLLLLL~~~~",
  "~~~~LLLLLLLL~~~~",
  "~~~~~LLLLLL~~~~~",
  "~~~~~~LLLL~~~~~~",
  "~~~~~~~LG~~~~~~~",
  "~~~~~~~~~~~~~~~~"
];

let phase41WindowOpen = false;

function phase41MountWindows(){
  const host = document.querySelector(".gameMapSide");
  if(!host) return;
  ["dialog","discovery","phaseAction","phaseCodex"].forEach(id => {
    const el = document.getElementById(id);
    if(el && el.parentElement !== host){
      host.appendChild(el);
    }
    if(el) el.classList.add("phaseMapWindow");
  });
}

function phase41SetWindowOpen(open){
  phase41WindowOpen = open;
  const host = document.querySelector(".gameMapSide");
  if(host) host.classList.toggle("phaseWindowOpen", open);
}

function phase41HideWindows(){
  ["dialog","discovery","phaseAction","phaseCodex"].forEach(id => {
    document.getElementById(id)?.classList.add("hidden");
  });
  phase41SetWindowOpen(false);
}

rows = function(){
  if(mode === "japan") return phase41HokkaidoRows;
  return phase41BaseRows();
};

updateMapScale = function(){
  const wrap = document.getElementById("mapWrap");
  const r = rows();
  if(!wrap || !r.length || wrap.clientWidth === 0 || wrap.clientHeight === 0) return;
  const W = r[0].length;
  const H = r.length;
  const availableW = Math.max(0, wrap.clientWidth - 20);
  const availableH = Math.max(0, wrap.clientHeight - 20);
  const fit = Math.floor(Math.min(availableW / W, availableH / H));
  const cap = mode === "japan" ? 58 : mode === "site" ? 58 : 60;
  const tile = Math.max(24, Math.min(cap, fit));
  document.documentElement.style.setProperty("--tile", tile + "px");
};

function phase41AvatarHtml(){
  return '<div class="mapHair"></div><div class="mapFace"></div><div class="mapBody"></div><div class="mapItem">' + avatar.item + '</div>';
}

function phase41RenderHokkaido(){
  phase41MountWindows();
  const r = phase41HokkaidoRows;
  const map = document.getElementById("map");
  const W = r[0].length;
  const H = r.length;
  map.innerHTML = "";
  map.dataset.mode = "hokkaido";
  map.style.gridTemplateColumns = `repeat(${W},var(--tile))`;
  map.style.gridTemplateRows = `repeat(${H},var(--tile))`;

  for(let y=0; y<H; y++){
    for(let x=0; x<W; x++){
      const d = document.createElement("div");
      const c = r[y][x];
      let cls = c === "~" ? "areaSea" : "areaLand";
      if(c === "S") cls = "areaSite " + (discovered["知床"] ? "areaDiscovered" : "areaUndiscovered");
      if(c === "G") cls = "areaNextGate";
      d.className = "tile " + cls + (x === px && y === py ? " player" : "");
      d.dataset.x = x;
      d.dataset.y = y;

      if(x === px && y === py){
        const av = document.createElement("div");
        av.className = "mapAvatar";
        av.innerHTML = phase41AvatarHtml();
        d.appendChild(av);
      }

      if(c === "S" && discovered["知床"]){
        const label = document.createElement("span");
        label.className = "areaSiteLabel";
        label.textContent = "知床";
        d.appendChild(label);
      }
      map.appendChild(d);
    }
  }

  document.getElementById("progressHud")?.classList.add("phaseHidden");
  document.getElementById("phaseCodexButton")?.classList.add("hidden");
  setMapTitle("北海道エリア");
  setGuideMessage("北海道を歩いてみよう！");
  document.getElementById("status").textContent = "北海道エリア";
  document.getElementById("legend").textContent = "？＝まだ見つけていない世界遺産　🔒＝次のエリアへの道";
  requestAnimationFrame(updateMapScale);
}

render = function(){
  phase41MountWindows();
  if(mode === "japan"){
    phase41RenderHokkaido();
    return;
  }

  phase41BaseRender();

  if(mode === "site"){
    setGuideMessage("気になるところに触れてみよう！");
    document.getElementById("status").textContent = `知床の図鑑：${acquiredCardCount()} / ${shiretokoCards.length} 記録`;
  }
};

// Keep interaction messages inside the right-hand map area.
showAction = function(title, text, options, kicker="SHIRETOKO"){
  ensurePhaseUi();
  phase41MountWindows();
  document.getElementById("phaseCodex")?.classList.add("hidden");
  document.getElementById("dialog")?.classList.add("hidden");
  document.getElementById("discovery")?.classList.add("hidden");
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
  phase41SetWindowOpen(true);
};

showGame = function(){
  phase41HideWindows();
  document.getElementById("game").classList.remove("hidden");
};

closeAction = function(){
  document.getElementById("phaseAction")?.classList.add("hidden");
  phase41SetWindowOpen(false);
  render();
};

openCodex = function(){
  ensurePhaseUi();
  phase41MountWindows();
  document.getElementById("phaseAction")?.classList.add("hidden");
  document.getElementById("dialog")?.classList.add("hidden");
  document.getElementById("phaseCodex")?.classList.remove("hidden");
  phase41SetWindowOpen(true);
  renderCodex(phaseCodexSelected);
};

closeCodex = function(){
  phaseCodexSelected = null;
  document.getElementById("phaseCodex")?.classList.add("hidden");
  phase41SetWindowOpen(false);
  render();
};

document.getElementById("phaseCodexClose") && (document.getElementById("phaseCodexClose").onclick = closeCodex);
document.getElementById("phaseCodexButton") && (document.getElementById("phaseCodexButton").onclick = openCodex);

// Opening-village conversations also stay over the map instead of replacing the whole game.
openDialog = function(npc, callback=null){
  phase41MountWindows();
  activeNpc = npc;
  dialogIndex = 0;
  afterDialog = callback;
  document.getElementById("dialog").classList.remove("hidden");
  showDialogLine();
  phase41SetWindowOpen(true);
};

nextDialog = function(){
  dialogIndex++;
  if(dialogIndex < activeNpc.lines.length){
    showDialogLine();
    return;
  }
  document.getElementById("dialog").classList.add("hidden");
  phase41SetWindowOpen(false);
  const cb = afterDialog;
  afterDialog = null;
  if(cb) cb();
  else render();
};

// Discovery is a special moment, but still appears on top of the area map.
discoverCurrentSite = function(){
  transitionLock = true;
  const overlay = document.getElementById("encounterOverlay");
  overlay.classList.remove("run");
  overlay.style.removeProperty("opacity");
  overlay.style.removeProperty("transform");
  overlay.style.animation = "none";
  void overlay.offsetWidth;
  overlay.style.removeProperty("animation");
  void overlay.offsetWidth;
  overlay.classList.add("run");

  setTimeout(() => {
    discovered[currentSite] = true;
    render();
    document.getElementById("discoveryName").textContent = currentSite;
    document.getElementById("discovery").classList.remove("hidden");
    phase41SetWindowOpen(true);
  }, 650);

  setTimeout(() => {
    overlay.classList.remove("run");
    overlay.style.removeProperty("opacity");
    overlay.style.removeProperty("transform");
    transitionLock = false;
  }, 850);
};

continueFromDiscovery = function(){
  document.getElementById("discovery")?.classList.add("hidden");
  phase41SetWindowOpen(false);
  phase41BaseContinueFromDiscovery();
};

move = function(dx,dy){
  if(phase41WindowOpen || transitionLock) return;

  if(mode !== "japan"){
    phase41BaseMove(dx,dy);
    return;
  }

  const nx = px + dx;
  const ny = py + dy;
  if(ny < 0 || ny >= phase41HokkaidoRows.length || nx < 0 || nx >= phase41HokkaidoRows[0].length) return;
  const c = phase41HokkaidoRows[ny][nx];

  if(c === "~"){
    setGuideMessage("海の向こうには進めないみたい。");
    return;
  }
  if(c === "G"){
    setGuideMessage("🔒 この先はまだ開いていないみたい。");
    return;
  }

  px = nx;
  py = ny;
  render();

  if(c === "S"){
    currentSite = "知床";
    if(!discovered[currentSite]) discoverCurrentSite();
    else enterShiretokoVillage();
  }
};

enterJapanMap = function(){
  mode = "japan";
  px = 8;
  py = 7;
  phase41HideWindows();
  render();
};

// Return from Shiretoko to the enlarged Hokkaido area rather than to the old full-Japan coordinates.
const phase41BaseEnterShiretokoVillage = enterShiretokoVillage;
enterShiretokoVillage = function(){
  phase41HideWindows();
  phase41BaseEnterShiretokoVillage();
};

// phase1's site-exit movement returns to old Japan coordinates, so handle the site map here as well.
const phase41SiteBaseMove = phase41BaseMove;
move = (function(previousMove){
  return function(dx,dy){
    if(phase41WindowOpen || transitionLock) return;

    if(mode === "japan"){
      const nx = px + dx;
      const ny = py + dy;
      if(ny < 0 || ny >= phase41HokkaidoRows.length || nx < 0 || nx >= phase41HokkaidoRows[0].length) return;
      const c = phase41HokkaidoRows[ny][nx];
      if(c === "~"){
        setGuideMessage("海の向こうには進めないみたい。");
        return;
      }
      if(c === "G"){
        setGuideMessage("🔒 この先はまだ開いていないみたい。");
        return;
      }
      px = nx; py = ny; render();
      if(c === "S"){
        currentSite = "知床";
        if(!discovered[currentSite]) discoverCurrentSite();
        else enterShiretokoVillage();
      }
      return;
    }

    if(mode === "site"){
      const nx = px + dx;
      const ny = py + dy;
      if(ny >= 0 && ny < shiretokoRows.length && nx >= 0 && nx < shiretokoRows[0].length && shiretokoRows[ny][nx] === "E"){
        mode = "japan";
        px = 8;
        py = 7;
        render();
        setGuideMessage("北海道にもどってきた！");
        return;
      }
    }

    previousMove(dx,dy);
  };
})(phase41BaseMove);

phase41MountWindows();
render();
