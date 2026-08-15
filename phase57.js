// v17 Phase 6.1: Plan-D Hokkaido grid + Japan -> Hokkaido zoom transition
// Visible tiles and movement rules are intentionally identical: green = passable, blue = blocked.

const phase57BaseRender = render;
const phase57BaseRows = rows;
const phase57BaseMove = move;
const phase57BaseUpdateMapScale = updateMapScale;

// 32 x 20 Hokkaido grid reconstructed from the selected Plan D concept.
// L = land, ~ = sea. S/G are placed on land tiles below.
const phase57PlanDBase = [
  "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
  "~~~~~~~~~~~LL~~~~~~~~~~~~~~~~~~~",
  "~~~~~~~~~~LLLL~~~~~~~~~~~~~~~~~~",
  "~~~~~~~~~~~LLLL~~~~~~~~~~~~~~~~~",
  "~~~~~~~~~~~LLLLL~~~~~~~~~~~L~~~~",
  "~~~~~~~~~~~LLLLLL~~~~~~~~~LL~~~~",
  "~~~~~~~~~~LLLLLLLL~~~~~~~LL~~~~~",
  "~~~~~~~~~~LLLLLLLLLL~LL~LL~~~~~~",
  "~~~~~~~~~~LLLLLLLLLLLLLLL~~~~~~~",
  "~~~~~~~~~LLLLLLLLLLLLLLL~~~~~~~~",
  "~~~~~~~~~LLLLLLLLLLLLLLLLL~~~~~~",
  "~~~~~~L~~LLLLLLLLLLLLLLL~~~~~~~~",
  "~~~~~~LLLLLLLLLLLLLLLLL~~~~~~~~~",
  "~~~~~~LLLLLLLLLLLLLL~~~~~~~~~~~~",
  "~~~~~LLLLLLLLLLLLLL~~~~~~~~~~~~~",
  "~~~~LLLLLL~LLLLLLL~~~~~~~~~~~~~~",
  "~~~~LL~L~~~~~LLLLL~~~~~~~~~~~~~~",
  "~~~~LLL~~~~~~~~LL~~~~~~~~~~~~~~~",
  "~~~~~LLL~~~~~~~~L~~~~~~~~~~~~~~~",
  "~~~~~LLLL~~~~~~~~~~~~~~~~~~~~~~~"
];

function phase57ReplaceAt(text, index, char){
  return text.slice(0,index) + char + text.slice(index+1);
}

const phase57HokkaidoRows = [...phase57PlanDBase];
// Shiretoko: northeast tip (row 5, col 28). Next-area gate: southwest tip (row 20, col 6).
phase57HokkaidoRows[4] = phase57ReplaceAt(phase57HokkaidoRows[4], 27, "S");
phase57HokkaidoRows[19] = phase57ReplaceAt(phase57HokkaidoRows[19], 5, "G");

let phase57ZoomTimer1 = null;
let phase57ZoomTimer2 = null;
let phase57OverviewActive = false;

rows = function(){
  if(mode === "japanOverview") return japanRows;
  if(mode === "japan") return phase57HokkaidoRows;
  return phase57BaseRows();
};

updateMapScale = function(){
  const wrap = document.getElementById("mapWrap");
  const r = rows();
  if(!wrap || !r.length || wrap.clientWidth===0 || wrap.clientHeight===0) return;
  const W=r[0].length, H=r.length;
  const availableW=Math.max(0,wrap.clientWidth-18);
  const availableH=Math.max(0,wrap.clientHeight-18);
  const fit=Math.floor(Math.min(availableW/W,availableH/H));
  const cap = mode === "japan" ? 34 : mode === "japanOverview" ? 30 : mode === "site" ? 58 : 60;
  const tile=Math.max(mode === "japan" ? 20 : 22, Math.min(cap,fit));
  document.documentElement.style.setProperty("--tile",tile+"px");
};

function phase57AvatarHtml(){
  if(typeof phase41AvatarHtml === "function") return phase41AvatarHtml();
  return '<div class="mapHair"></div><div class="mapFace"></div><div class="mapBody"></div>';
}

function phase57RenderOverview(){
  phase56MountPiramiton?.();
  const r=japanRows;
  const W=r[0].length,H=r.length;
  const map=document.getElementById("map");
  map.innerHTML="";
  map.dataset.mode="japanOverview";
  map.classList.remove("phase57Zooming");
  map.style.gridTemplateColumns=`repeat(${W},var(--tile))`;
  map.style.gridTemplateRows=`repeat(${H},var(--tile))`;

  for(let y=0;y<H;y++){
    for(let x=0;x<W;x++){
      const d=document.createElement("div");
      const c=r[y][x];
      const land = c === "L" || c === "S";
      const hokkaido = land && y <= 5 && x >= 18;
      d.className="tile "+(land ? (hokkaido ? "phase57OverviewHokkaido" : "phase57OverviewLand") : "phase57OverviewSea");
      d.dataset.x=x; d.dataset.y=y;
      map.appendChild(d);
    }
  }

  const marker=document.createElement("div");
  marker.className="phase57OverviewMarker";
  marker.innerHTML='<span>北海道</span><div class="mapAvatar">'+phase57AvatarHtml()+'</div>';
  map.appendChild(marker);

  document.getElementById("progressHud")?.classList.add("phaseHidden");
  document.getElementById("phaseCodexButton")?.classList.add("hidden");
  setMapTitle("日本マップ");
  setGuideMessage("北海道へ行ってみよう！");
  document.getElementById("status").textContent="日本マップから北海道エリアへ移動中";
  document.getElementById("legend").textContent="北海道エリアを拡大します";
  requestAnimationFrame(updateMapScale);
}

function phase57RenderHokkaido(){
  phase56MountPiramiton?.();
  phase56EnsureQuizUi?.();
  const r=phase57HokkaidoRows;
  const W=r[0].length,H=r.length;
  const map=document.getElementById("map");
  map.innerHTML="";
  map.dataset.mode="hokkaidoGridD";
  map.classList.remove("phase57Zooming");
  map.style.gridTemplateColumns=`repeat(${W},var(--tile))`;
  map.style.gridTemplateRows=`repeat(${H},var(--tile))`;

  for(let y=0;y<H;y++){
    for(let x=0;x<W;x++){
      const d=document.createElement("div");
      const c=r[y][x];
      let cls="phase57Sea";
      if(c==="L") cls="phase57Land";
      if(c==="S") cls="phase57Site "+(phase56ShiretokoCleared?"areaCleared":discovered["知床"]?"areaDiscovered":"areaUndiscovered");
      if(c==="G") cls="phase57Gate";
      d.className="tile "+cls+(x===px&&y===py?" player":"");
      d.dataset.x=x; d.dataset.y=y;

      if(x===px&&y===py){
        const av=document.createElement("div");
        av.className="mapAvatar";
        av.innerHTML=phase57AvatarHtml();
        d.appendChild(av);
      }
      if(c==="S" && (discovered["知床"] || phase56ShiretokoCleared)){
        const label=document.createElement("span");
        label.className="areaSiteLabel";
        label.textContent="知床";
        d.appendChild(label);
      }
      map.appendChild(d);
    }
  }

  document.getElementById("progressHud")?.classList.add("phaseHidden");
  document.getElementById("phaseCodexButton")?.classList.add("hidden");
  setMapTitle("北海道エリア");
  setGuideMessage(phase56ShiretokoCleared?"次に気になる場所を探してみよう！":"気になるところへ行ってみよう！");
  document.getElementById("status").textContent=phase56ShiretokoCleared?"知床 ✓ CLEAR":"北海道エリアを探索中";
  document.getElementById("legend").textContent="緑＝移動できる　青＝海・移動できない　？＝未発見　✓＝CLEAR　🔒＝次のエリア";
  requestAnimationFrame(updateMapScale);
}

render = function(){
  if(mode === "japanOverview"){
    phase57RenderOverview();
    return;
  }
  if(mode === "japan"){
    phase57RenderHokkaido();
    return;
  }
  phase57BaseRender();
};

function phase57StartZoomToHokkaido(){
  clearTimeout(phase57ZoomTimer1);
  clearTimeout(phase57ZoomTimer2);
  transitionLock=true;
  phase57OverviewActive=true;
  mode="japanOverview";
  render();

  phase57ZoomTimer1=setTimeout(()=>{
    document.getElementById("map")?.classList.add("phase57Zooming");
  },500);

  phase57ZoomTimer2=setTimeout(()=>{
    phase57OverviewActive=false;
    mode="japan";
    // Start near the center of the selected Plan-D landmass (row 13, col 15).
    px=14; py=12;
    transitionLock=false;
    render();
  },1450);
}

enterJapanMap = function(){
  if(typeof phase41HideWindows === "function") phase41HideWindows();
  if(typeof phase56HideQuiz === "function") phase56HideQuiz();
  phase57StartZoomToHokkaido();
};

move = function(dx,dy){
  if(mode === "japanOverview" || phase57OverviewActive || transitionLock) return;
  if(typeof phase41WindowOpen !== "undefined" && phase41WindowOpen) return;

  if(mode === "japan"){
    const nx=px+dx, ny=py+dy;
    if(ny<0||ny>=phase57HokkaidoRows.length||nx<0||nx>=phase57HokkaidoRows[0].length) return;
    const c=phase57HokkaidoRows[ny][nx];
    if(c==="~"){
      setGuideMessage("そこは海だよ。");
      return;
    }
    if(c==="G"){
      setGuideMessage("🔒 この先はまだ開いていないみたい。");
      return;
    }

    px=nx; py=ny; render();
    if(c==="S"){
      currentSite="知床";
      if(!discovered[currentSite]) discoverCurrentSite();
      else enterShiretokoVillage();
    }
    return;
  }

  if(mode==="site"){
    const nx=px+dx,ny=py+dy;
    if(ny>=0&&ny<shiretokoRows.length&&nx>=0&&nx<shiretokoRows[0].length&&shiretokoRows[ny][nx]==="E"){
      mode="japan";
      px=14; py=12;
      if(typeof phase56HideQuiz === "function") phase56HideQuiz();
      render();
      return;
    }
  }

  phase57BaseMove(dx,dy);
};

// Re-entry after CLEAR or returning from Shiretoko uses the same Plan-D area map.
phase56MountPiramiton?.();
render();
