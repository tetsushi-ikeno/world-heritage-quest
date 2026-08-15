// v17 Phase 5-6 + UX refinements
// - fixed-size map windows
// - detailed Hokkaido area silhouette
// - Piramiton moves to the map area
// - card gate -> 5-question quiz -> 80% clear

const phase56BaseRender = render;
const phase56BaseRows = rows;
const phase56BaseMove = move;

const PHASE56_GATE_CARD_COUNT = 6;
let phase56ShiretokoCleared = false;
let phase56QuizQuestions = [];
let phase56QuizIndex = 0;
let phase56QuizCorrect = 0;
let phase56QuizAnswered = false;

// A denser walk grid is used only for movement. The visible coastline is drawn
// separately as a more recognizable Hokkaido silhouette.
const phase56HokkaidoRows = [
  "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
  "~~~~~~~~~~~~~~~LL~~~~~~~~~~~~~~~",
  "~~~~~~~~~~~~~LLLLLL~~~~~~~~~~~~~",
  "~~~~~~~~~~~LLLLLLLLLLL~~~~~~~~~~",
  "~~~~~~~~~LLLLLLLLLLLLLLLLL~LL~~~",
  "~~~~~~~~LLLLLLLLLLLLLLLLLLLLLLS~",
  "~~~~~~~LLLLLLLLLLLLLLLLLLLLLLL~~",
  "~~~~~~LLLLLLLLLLLLLLLLLLLLLLL~~~",
  "~~~~~LLLLLLLLLLLLLLLLLLLLLLLLL~~",
  "~~~~LLLLLLLLLLLLLLLLLLLLLLLLL~~~",
  "~~~~~LLLLLLLLLLLLLLLLLLLLLLLLLL~",
  "~~~~~~LLLLLLLLLLLLLLLLLLLLLLLL~~",
  "~~~~~~~LLLLLLLLLLLLLLLLLLLLL~~~~",
  "~~~~~~~~LLLLLLLLLLLLLLLLLL~~~~~~",
  "~~~~~~~~~LLLLLLLLLLLLLL~~~~~~~~~",
  "~~~~~~~~LLLLLLLLLLLLL~~~~~~~~~~~",
  "~~~~~~LLLLLLLLLLLLL~~~~~~~~~~~~~",
  "~~~~LLLLLLLLLLLLL~~~~~~~~~~~~~~~",
  "~~LGLLLLLLLLL~~~~~~~~~~~~~~~~~~~",
  "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
];

const phase56Questions = [
  {
    card:"type",
    question:"知床は、どの種類の世界遺産？",
    choices:["文化遺産","自然遺産","複合遺産","無形文化遺産"],
    answer:1
  },
  {
    card:"place",
    question:"知床半島があるのはどこ？",
    choices:["北海道の北東部","本州の中央部","四国の南部","九州の西部"],
    answer:0
  },
  {
    card:"ice",
    question:"オホーツク海から流氷がやってくる知床周辺の海のように、季節によって海氷におおわれる海域を何という？",
    choices:["季節海氷域","永久凍土域","サンゴ礁域","潮間帯"],
    answer:0
  },
  {
    card:"owl",
    question:"知床で見つけた、希少な鳥はどれ？",
    choices:["シマフクロウ","ライチョウ","タンチョウ","ヤンバルクイナ"],
    answer:0
  },
  {
    card:"bear",
    question:"知床に生息する大型の野生動物はどれ？",
    choices:["ヒグマ","ツキノワグマ","ニホンザル","イリオモテヤマネコ"],
    answer:0
  },
  {
    card:"ecosystem",
    question:"知床の生態系を考えるとき、大切なつながりはどれ？",
    choices:["海・川・森のつながり","砂漠と氷河のつながり","都市と工場のつながり","火山と古墳のつながり"],
    answer:0
  },
  {
    card:"year",
    question:"知床が世界自然遺産に登録されたのは何年？",
    choices:["1993年","2000年","2005年","2011年"],
    answer:2
  },
  {
    card:"criteria",
    question:"知床で認められている世界遺産の登録基準はどれ？",
    choices:["(i)・(ii)","(iv)・(vi)","(vii)・(viii)","(ix)・(x)"],
    answer:3
  }
];

function phase56MountPiramiton(){
  const guide = document.querySelector(".guideSection");
  const mapSide = document.querySelector(".gameMapSide");
  if(!guide || !mapSide) return;
  if(guide.parentElement !== mapSide) mapSide.appendChild(guide);
  guide.classList.add("phaseMapGuide");
}

function phase56EnsureQuizUi(){
  if(document.getElementById("phaseSiteQuiz")) return;
  const panel = document.createElement("section");
  panel.id = "phaseSiteQuiz";
  panel.className = "panel hidden phaseMapWindow phaseSiteQuiz";
  panel.innerHTML = `
    <div class="phaseActionKicker">SHIRETOKO QUIZ</div>
    <div class="phaseQuizTopline"><span id="phaseQuizProgress"></span><span id="phaseQuizScore"></span></div>
    <h2 id="phaseQuizQuestion"></h2>
    <div id="phaseQuizAnswers" class="phaseQuizAnswers"></div>
    <div id="phaseQuizFeedback" class="phaseQuizFeedback"></div>
    <div id="phaseQuizFooter" class="phaseQuizFooter"></div>
  `;
  document.querySelector(".gameMapSide")?.appendChild(panel);
}

function phase56SetWindow(open){
  if(typeof phase41SetWindowOpen === "function") phase41SetWindowOpen(open);
}

function phase56HideQuiz(){
  document.getElementById("phaseSiteQuiz")?.classList.add("hidden");
  phase56SetWindow(false);
}

function phase56Shuffle(list){
  const out = [...list];
  for(let i=out.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [out[i],out[j]]=[out[j],out[i]];
  }
  return out;
}

function phase56GateOpen(){
  return acquiredCardCount() >= PHASE56_GATE_CARD_COUNT;
}

function phase56AvailableQuestions(){
  return phase56Questions.filter(q => isCardAcquired(q.card));
}

function startShiretokoGateQuiz(){
  phase56EnsureQuizUi();
  const available = phase56Shuffle(phase56AvailableQuestions());
  if(available.length < 5){
    showAction(
      "まだ問いに進めないみたい",
      "もう少し知床について調べてみよう。",
      [{label:"里にもどる",action:closeAction}],
      "LOCKED"
    );
    return;
  }
  phase56QuizQuestions = available.slice(0,5);
  phase56QuizIndex = 0;
  phase56QuizCorrect = 0;
  phase56QuizAnswered = false;
  document.getElementById("phaseAction")?.classList.add("hidden");
  document.getElementById("phaseCodex")?.classList.add("hidden");
  const panel = document.getElementById("phaseSiteQuiz");
  panel.classList.remove("hidden");
  phase56SetWindow(true);
  renderShiretokoQuizQuestion();
}

function renderShiretokoQuizQuestion(){
  const q = phase56QuizQuestions[phase56QuizIndex];
  if(!q){
    finishShiretokoQuiz();
    return;
  }
  phase56QuizAnswered = false;
  document.getElementById("phaseQuizProgress").textContent = `${phase56QuizIndex+1} / 5`;
  document.getElementById("phaseQuizScore").textContent = `正解 ${phase56QuizCorrect}`;
  document.getElementById("phaseQuizQuestion").textContent = q.question;
  document.getElementById("phaseQuizFeedback").textContent = "";
  document.getElementById("phaseQuizFooter").innerHTML = "";
  const answers = document.getElementById("phaseQuizAnswers");
  answers.innerHTML = "";
  q.choices.forEach((choice,index)=>{
    const b=document.createElement("button");
    b.className="bigbtn phaseQuizAnswer";
    b.textContent=choice;
    b.onclick=()=>answerShiretokoQuiz(index);
    answers.appendChild(b);
  });
}

function answerShiretokoQuiz(index){
  if(phase56QuizAnswered) return;
  phase56QuizAnswered = true;
  const q = phase56QuizQuestions[phase56QuizIndex];
  const ok = index === q.answer;
  if(ok) phase56QuizCorrect++;
  document.querySelectorAll(".phaseQuizAnswer").forEach((b,i)=>{
    b.disabled=true;
    if(i===q.answer) b.classList.add("correct");
    if(i===index && !ok) b.classList.add("wrong");
  });
  document.getElementById("phaseQuizFeedback").textContent = ok ? "正解！" : `おしい！ 正解は「${q.choices[q.answer]}」`;
  const footer=document.getElementById("phaseQuizFooter");
  const next=document.createElement("button");
  next.className="bigbtn";
  next.textContent=phase56QuizIndex===4 ? "結果を見る" : "つぎの問い";
  next.onclick=()=>{
    phase56QuizIndex++;
    if(phase56QuizIndex>=5) finishShiretokoQuiz();
    else renderShiretokoQuizQuestion();
  };
  footer.appendChild(next);
}

function finishShiretokoQuiz(){
  const passed = phase56QuizCorrect >= 4;
  const panel=document.getElementById("phaseSiteQuiz");
  document.getElementById("phaseQuizProgress").textContent="RESULT";
  document.getElementById("phaseQuizScore").textContent=`${phase56QuizCorrect} / 5`;
  document.getElementById("phaseQuizAnswers").innerHTML="";
  document.getElementById("phaseQuizFeedback").textContent="";
  const footer=document.getElementById("phaseQuizFooter");
  footer.innerHTML="";

  if(passed){
    phase56ShiretokoCleared = true;
    document.getElementById("phaseQuizQuestion").textContent="知床 CLEAR！";
    document.getElementById("phaseQuizFeedback").textContent=`5問中${phase56QuizCorrect}問正解！ 知床についての調査をクリアした。`;

    const backArea=document.createElement("button");
    backArea.className="bigbtn";
    backArea.textContent="北海道へもどる";
    backArea.onclick=()=>{
      phase56HideQuiz();
      mode="japan";
      px=14; py=13;
      render();
      setGuideMessage("次に気になる場所を探してみよう！");
    };
    const stay=document.createElement("button");
    stay.className="bigbtn";
    stay.textContent="もう少し知床を見ていく";
    stay.onclick=()=>{
      phase56HideQuiz();
      render();
    };
    footer.append(backArea,stay);
  }else{
    document.getElementById("phaseQuizQuestion").textContent="あと少し！";
    document.getElementById("phaseQuizFeedback").textContent=`5問中${phase56QuizCorrect}問正解。4問正解でCLEAR！`;
    const retry=document.createElement("button");
    retry.className="bigbtn";
    retry.textContent="もう一度やってみる";
    retry.onclick=startShiretokoGateQuiz;
    const review=document.createElement("button");
    review.className="bigbtn";
    review.textContent="里にもどる";
    review.onclick=()=>{phase56HideQuiz();render();};
    footer.append(retry,review);
  }
}

// Override the old locked-gate interaction. The gate itself changes appearance
// as soon as enough cards have been recorded.
showLockedGate = function(){
  if(phase56ShiretokoCleared){
    showAction(
      "門は開いている",
      "知床はCLEAR済み。もう一度、問いに挑戦することもできる。",
      [
        {label:"もう一度やってみる",action:startShiretokoGateQuiz},
        {label:"またあとで",action:closeAction}
      ],
      "CLEAR"
    );
    return;
  }

  const remaining = Math.max(0, PHASE56_GATE_CARD_COUNT - acquiredCardCount());
  if(remaining > 0){
    showAction(
      "鍵のかかった門がある！",
      `門を開けるには、知床のカードがあと${remaining}枚必要みたいだ。`,
      [{label:"またあとで",action:closeAction}],
      "LOCKED"
    );
    return;
  }

  showAction(
    "門が開いている！",
    "中へ進むと、知床についての問いが現れた。",
    [
      {label:"問いに挑戦する",action:startShiretokoGateQuiz},
      {label:"またあとで",action:closeAction}
    ],
    "OPEN"
  );
};

rows = function(){
  if(mode === "japan") return phase56HokkaidoRows;
  return phase56BaseRows();
};

function phase56RenderHokkaido(){
  phase56MountPiramiton();
  phase56EnsureQuizUi();
  const r=phase56HokkaidoRows;
  const map=document.getElementById("map");
  const W=r[0].length,H=r.length;
  map.innerHTML="";
  map.dataset.mode="hokkaidoDetailed";
  map.style.gridTemplateColumns=`repeat(${W},var(--tile))`;
  map.style.gridTemplateRows=`repeat(${H},var(--tile))`;

  const shape=document.createElement("div");
  shape.className="hokkaidoSilhouette";
  map.appendChild(shape);
  const areaName=document.createElement("div");
  areaName.className="hokkaidoName";
  areaName.textContent="北海道";
  map.appendChild(areaName);

  for(let y=0;y<H;y++){
    for(let x=0;x<W;x++){
      const d=document.createElement("div");
      const c=r[y][x];
      let cls=c==="~"?"areaSea detailedCell":"areaLand detailedCell";
      if(c==="S") cls="areaSite detailedCell "+(phase56ShiretokoCleared?"areaCleared":discovered["知床"]?"areaDiscovered":"areaUndiscovered");
      if(c==="G") cls="areaNextGate detailedCell";
      d.className="tile "+cls+(x===px&&y===py?" player":"");
      d.dataset.x=x;d.dataset.y=y;
      if(x===px&&y===py){
        const av=document.createElement("div");
        av.className="mapAvatar";
        av.innerHTML=typeof phase41AvatarHtml==="function"?phase41AvatarHtml():'<div class="mapHair"></div><div class="mapFace"></div><div class="mapBody"></div>';
        d.appendChild(av);
      }
      if(c==="S" && (discovered["知床"]||phase56ShiretokoCleared)){
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
  document.getElementById("legend").textContent="？＝未発見　！＝調査中　✓＝CLEAR　🔒＝次のエリアへの道";
  requestAnimationFrame(updateMapScale);
}

// Re-render the Shiretoko village so the gate visibly opens at 6 cards.
renderShiretokoVillage = function(){
  phase56MountPiramiton();
  phase56EnsureQuizUi();
  ensurePhaseUi();
  const r=shiretokoRows;
  const W=r[0].length,H=r.length;
  const map=document.getElementById("map");
  map.innerHTML="";
  map.dataset.mode="site";
  map.style.gridTemplateColumns=`repeat(${W},var(--tile))`;
  map.style.gridTemplateRows=`repeat(${H},var(--tile))`;

  for(let y=0;y<H;y++){
    for(let x=0;x<W;x++){
      const d=document.createElement("div");
      const c=r[y][x];
      let cls="grass";
      if(c==="F") cls="forest";
      if(c==="N") cls="heritageNature";
      if(c==="R") cls="npc researcher siteNpc";
      if(c==="B") cls="siteBook";
      if(c==="K") cls=phase56GateOpen()?"siteGateOpen":"siteGateLocked";
      if(c==="E") cls="siteExit";
      d.className="tile "+cls+(x===px&&y===py?" player":"");
      d.dataset.x=x;d.dataset.y=y;
      if(x===px&&y===py){
        const av=document.createElement("div");
        av.className="mapAvatar";
        av.innerHTML=typeof phase41AvatarHtml==="function"?phase41AvatarHtml():'';
        d.appendChild(av);
      }
      map.appendChild(d);
    }
  }

  document.getElementById("progressHud")?.classList.add("phaseHidden");
  document.getElementById("phaseCodexButton")?.classList.remove("hidden");
  updateCodexBadge();
  setMapTitle("知床の里");
  setGuideMessage("気になるところに触れてみよう！");
  document.getElementById("status").textContent=`知床の図鑑：${acquiredCardCount()} / ${shiretokoCards.length} 記録`;
  document.getElementById("legend").textContent=phase56GateOpen()?"門が開いているようだ":"気になる場所に近づいてみよう";
  requestAnimationFrame(updateMapScale);
};

render = function(){
  phase56MountPiramiton();
  phase56EnsureQuizUi();
  if(mode==="japan"){
    phase56RenderHokkaido();
    return;
  }
  phase56BaseRender();
  if(mode==="site"){
    setGuideMessage("気になるところに触れてみよう！");
  }
};

move = function(dx,dy){
  if((typeof phase41WindowOpen!=="undefined" && phase41WindowOpen)||transitionLock) return;

  if(mode==="japan"){
    const nx=px+dx,ny=py+dy;
    if(ny<0||ny>=phase56HokkaidoRows.length||nx<0||nx>=phase56HokkaidoRows[0].length) return;
    const c=phase56HokkaidoRows[ny][nx];
    if(c==="~"){
      setGuideMessage("海の向こうには進めないみたい。");
      return;
    }
    if(c==="G"){
      setGuideMessage("🔒 この先はまだ開いていないみたい。");
      return;
    }
    px=nx;py=ny;render();
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
      px=14;py=13;
      if(phase56QuizAnswered) phase56HideQuiz();
      render();
      return;
    }
  }

  phase56BaseMove(dx,dy);
};

enterJapanMap = function(){
  mode="japan";
  px=14;py=13;
  if(typeof phase41HideWindows==="function") phase41HideWindows();
  phase56HideQuiz();
  render();
};

phase56MountPiramiton();
phase56EnsureQuizUi();
render();
