// v17 Phase 7.2: research-centre branch for registration criteria
// HQ only introduces the existence of 10 criteria. Detailed learning happens on the Hokkaido map.

const phase72BaseRender = render;
const phase72BaseMove = move;
const phase72BaseUpdateProgress = phase71UpdateProgress;

const phase72NorthStart = {x:11,y:1};
const phase72BranchTiles = [{x:11,y:2},{x:12,y:2}];
let phase72BranchCleared = false;
let phase72BranchStep = 0;
let phase72BranchQuizIndex = 0;
let phase72BranchQuizCorrect = 0;

const phase72CriteriaMeta = [
  {icon:"🏛", title:"人間が作った傑作", roman:"i", note:"人が生み出した、特にすぐれた傑作"},
  {icon:"↔", title:"文化交流", roman:"ii", note:"建築や技術などを通した文化・価値観の交流"},
  {icon:"🗿", title:"文明の証拠", roman:"iii", note:"文化や文明を伝える特別な証拠"},
  {icon:"⚙", title:"建築・科学技術", roman:"iv", note:"歴史の重要な段階を伝える建築や技術"},
  {icon:"🏘", title:"伝統的集落", roman:"v", note:"伝統的な暮らしや土地との関わり"},
  {icon:"🎨", title:"出来事や宗教、芸術", roman:"vi", note:"重要な出来事・思想・信仰・芸術との結びつき"},
  {icon:"🏔", title:"自然の景観美", roman:"vii", note:"特に美しい自然やすばらしい自然現象"},
  {icon:"🪨", title:"地球の歴史", roman:"viii", note:"地球の歴史や地形のでき方を伝える"},
  {icon:"🌿", title:"固有の生態系", roman:"ix", note:"生態系が変化・発展していく重要なしくみ"},
  {icon:"🐾", title:"絶滅危惧種", roman:"x", note:"生物多様性を守る重要な生息地"}
];

const phase72BranchQuiz = [
  {q:"正式表記の基準 (vi) は、数字では何番？", choices:["4","5","6","9"], answer:2, explain:"V=5 の右に I=1 があるので、VI=6。"},
  {q:"正式表記の基準 (ix) は、数字では何番？", choices:["4","8","9","10"], answer:2, explain:"X=10 の左に I=1 があるので、IX=9。"},
  {q:"基準9を覚えるための短い呼び名はどれ？", choices:["地球の歴史","固有の生態系","自然の景観美","文化交流"], answer:1, explain:"基準9は「固有の生態系」。正式表記は (ix)。"}
];

function phase72PatchCriteriaLabels(){
  phase71Criteria.forEach((c,i)=>{
    const m=phase72CriteriaMeta[i];
    c.title=m.title;
    c.note=m.note;
    c.icon=m.icon;
    c.roman=m.roman;
  });

  const shire=phase7Sites["知床"];
  const jomon=phase7Sites["北海道・北東北の縄文遺跡群"];
  if(shire){
    const card=shire.cards.find(c=>c.id==="criteria");
    if(card){
      card.value="9 固有の生態系 / 10 絶滅危惧種";
      card.description="知床は基準9「固有の生態系」と基準10「絶滅危惧種」で覚えよう。正式表記は (ix)・(x)。基準10は、絶滅のおそれがある種を含む生物多様性の重要な生息地を評価する基準。";
    }
    shire.book.newText="知床が世界自然遺産に登録されたのは2005年。\n登録基準は 9「固有の生態系」と 10「絶滅危惧種」。\n正式表記では (ix) と (x) だ。\n\n2つのカードを図鑑に記録した！";
    shire.book.knownText="知床は2005年登録。基準9「固有の生態系」と基準10「絶滅危惧種」。\n正式表記では (ix)・(x)。";
    const q=shire.quiz.find(q=>q.card==="criteria");
    if(q){
      q.question="知床で認められている登録基準の組み合わせはどれ？";
      q.choices=["1 人間が作った傑作 ＋ 2 文化交流","4 建築・科学技術 ＋ 6 出来事や宗教、芸術","7 自然の景観美 ＋ 8 地球の歴史","9 固有の生態系 ＋ 10 絶滅危惧種"];
      q.answer=3;
    }
  }
  if(jomon){
    const card=jomon.cards.find(c=>c.id==="criteria");
    if(card){
      card.value="3 文明の証拠 / 5 伝統的集落";
      card.description="縄文遺跡群は基準3「文明の証拠」と基準5「伝統的集落」で覚えよう。正式表記は (iii)・(v)。";
    }
    if(jomon.book){
      jomon.book.newText="縄文遺跡群は17の遺跡で構成され、2021年に登録された。\n登録基準は 3「文明の証拠」と 5「伝統的集落」。\n正式表記では (iii) と (v) だ。\n\n図鑑に記録した！";
      jomon.book.knownText="17の遺跡、2021年登録。基準3「文明の証拠」と基準5「伝統的集落」。\n正式表記では (iii)・(v)。";
    }
    const q=jomon.quiz.find(q=>q.card==="criteria");
    if(q){
      q.question="縄文遺跡群で認められている登録基準の組み合わせはどれ？";
      q.choices=["1 人間が作った傑作 ＋ 2 文化交流","3 文明の証拠 ＋ 5 伝統的集落","4 建築・科学技術 ＋ 6 出来事や宗教、芸術","9 固有の生態系 ＋ 10 絶滅危惧種"];
      q.answer=1;
    }
  }
}

function phase72InstallBranchTiles(){
  phase72BranchTiles.forEach(({x,y})=>phase7PlaceMarker(phase7AreaRows,x,y,"C"));
}

// The HQ onboarding now does only one job: establish that there are ten registration criteria.
phase71RenderOrientationLesson = function(){
  const head=document.querySelector("#phase71Orientation .phase71OrientationHead h2");
  if(head) head.textContent="本部オリエンテーション";
  const main=document.getElementById("phase71OrientationMain");
  main.innerHTML=`
    <div class="phase71Speech">
      <strong>ピラミトン：</strong> 世界遺産には、「なぜ世界的に大切なのか」を判断するための<strong>登録基準が10個</strong>あるよ。<br><br>
      今は10個の内容まで覚えなくて大丈夫。旅の途中にある研究センターの支部で、実物と結びつけながら覚えていこう！
    </div>
    <div class="phase72TenCriteriaHint" aria-label="登録基準は10個">
      ${Array.from({length:10},(_,i)=>`<span>${i+1}</span>`).join("")}
    </div>
    <div class="phase71StoryActions"><button id="phase72LeaveHQ" class="bigbtn">北海道へ出発する</button></div>
  `;
  document.getElementById("phase72LeaveHQ").onclick=phase71BeginJourney;
};

// Keep the existing Japan -> Hokkaido transition, but land at Hokkaido's northern edge.
phase57StartZoomToHokkaido = function(){
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
    px=phase72NorthStart.x;
    py=phase72NorthStart.y;
    transitionLock=false;
    render();
  },1450);
};

function phase72EnsureBranchUi(){
  if(document.getElementById("phase72Branch")) return;
  const panel=document.createElement("section");
  panel.id="phase72Branch";
  panel.className="panel hidden phase72Branch";
  panel.innerHTML=`
    <div class="phase72BranchHead">
      <div class="phase71MiniPiramiton"><div class="pyramidBody"></div><div class="pyramidFace"></div><div class="pyramidMouth"></div></div>
      <div><div class="phase71StoryKicker">世界遺産研究センター</div><h2>北海道・登録基準支部</h2></div>
    </div>
    <div id="phase72BranchMain"></div>
  `;
  document.getElementById("app").appendChild(panel);
}

function phase72OpenBranch(){
  phase72EnsureBranchUi();
  if(typeof phase62StopJoystick==="function") phase62StopJoystick();
  if(typeof phase41SetWindowOpen==="function") phase41SetWindowOpen(true);
  document.getElementById("game")?.classList.add("hidden");
  document.getElementById("phase72Branch")?.classList.remove("hidden");
  phase72BranchStep=0;
  phase72RenderBranchStep();
}

function phase72CloseBranch(){
  document.getElementById("phase72Branch")?.classList.add("hidden");
  document.getElementById("game")?.classList.remove("hidden");
  if(typeof phase41SetWindowOpen==="function") phase41SetWindowOpen(false);
  render();
}

function phase72RenderBranchStep(){
  const main=document.getElementById("phase72BranchMain");
  if(!main) return;

  if(phase72BranchStep===0){
    main.innerHTML=`
      <div class="phase72Step">1 / 3　正式表記を読めるようになろう</div>
      <h3>登録基準はローマ数字で書かれる</h3>
      <div class="phase72RomanKeys">
        <div><b>I</b><span>= 1</span></div><div><b>V</b><span>= 5</span></div><div><b>X</b><span>= 10</span></div>
      </div>
      <div class="phase72RuleGrid">
        <div><strong>右側の I は足す</strong><span>VI = 5 + 1 = <b>6</b></span><span>VII = 7　／　VIII = 8</span></div>
        <div><strong>左側の I は1引く</strong><span>IV = 5 - 1 = <b>4</b></span><span>IX = 10 - 1 = <b>9</b></span></div>
      </div>
      <div class="phase72Tip">I・V・X の3つと、4と9の「1引く」ルールが分かれば、登録基準の (i)〜(x) は全部読めるよ。</div>
      <div class="phase72Actions"><button class="bigbtn" id="phase72BranchBack">いったん戻る</button><button class="bigbtn" id="phase72BranchNext">10個の基準を見る</button></div>
    `;
  }else if(phase72BranchStep===1){
    main.innerHTML=`
      <div class="phase72Step">2 / 3　10個の基準を見渡そう</div>
      <h3>数字・意味・正式表記をセットにする</h3>
      <div class="phase72IconNote">マークはゲームで覚えやすくするための目印だよ。</div>
      <div class="phase72CriteriaGrid">
        ${phase71Criteria.map(c=>`<div class="phase72Criterion"><span class="phase72CriterionIcon">${c.icon}</span><span class="phase72CriterionNum">${c.n}</span><span class="phase72CriterionText"><b>${c.title}</b><small>${c.note}</small></span><span class="phase72CriterionRoman">(${c.roman})</span></div>`).join("")}
      </div>
      <div class="phase72Actions"><button class="bigbtn" id="phase72BranchPrev">もどる</button><button class="bigbtn" id="phase72BranchNext">日本の特徴を見る</button></div>
    `;
  }else{
    const max=Math.max(...phase71Criteria.map(c=>c.count));
    main.innerHTML=`
      <div class="phase72Step">3 / 3　日本の世界遺産を数字で見よう</div>
      <h3>日本では、どの登録基準が多い？</h3>
      <p class="phase72StatsLead">1つの遺産に複数の基準が認められるため、件数を足すと遺産数より多くなるよ。</p>
      <div class="phase72Bars">
        ${phase71Criteria.map(c=>`<div class="phase72BarRow"><span>${c.icon} ${c.n}</span><div><i style="width:${Math.round(c.count/max*100)}%"></i></div><b>${c.count}件</b><small>${c.title}</small></div>`).join("")}
      </div>
      <div class="phase72Tip"><b>見つけてみよう：</b> 日本では基準2「文化交流」や基準4「建築・科学技術」が多く、基準8「地球の歴史」は現在0件。旅をしながら、この違いがどこから生まれるのか考えてみよう。</div>
      <div class="phase72Actions"><button class="bigbtn" id="phase72BranchPrev">もどる</button><button class="bigbtn" id="phase72BranchQuizStart">3問だけ確認する</button></div>
    `;
  }

  document.getElementById("phase72BranchBack")?.addEventListener("click",phase72CloseBranch);
  document.getElementById("phase72BranchPrev")?.addEventListener("click",()=>{phase72BranchStep--;phase72RenderBranchStep();});
  document.getElementById("phase72BranchNext")?.addEventListener("click",()=>{phase72BranchStep++;phase72RenderBranchStep();});
  document.getElementById("phase72BranchQuizStart")?.addEventListener("click",phase72StartBranchQuiz);
}

function phase72StartBranchQuiz(){
  phase72BranchQuizIndex=0;
  phase72BranchQuizCorrect=0;
  phase72RenderBranchQuestion();
}

function phase72RenderBranchQuestion(){
  const main=document.getElementById("phase72BranchMain");
  const q=phase72BranchQuiz[phase72BranchQuizIndex];
  main.innerHTML=`
    <div class="phase72Step">登録基準チェック ${phase72BranchQuizIndex+1} / ${phase72BranchQuiz.length}</div>
    <h3 class="phase72Question">${q.q}</h3>
    <div class="phase72Choices">${q.choices.map((c,i)=>`<button class="bigbtn phase72Choice" data-i="${i}">${c}</button>`).join("")}</div>
    <div id="phase72QuizFeedback" class="phase72QuizFeedback"></div>
  `;
  main.querySelectorAll(".phase72Choice").forEach(btn=>btn.onclick=()=>phase72AnswerBranchQuestion(Number(btn.dataset.i)));
}

function phase72AnswerBranchQuestion(index){
  const q=phase72BranchQuiz[phase72BranchQuizIndex];
  const ok=index===q.answer;
  if(ok) phase72BranchQuizCorrect++;
  document.querySelectorAll(".phase72Choice").forEach((b,i)=>{
    b.disabled=true;
    if(i===q.answer) b.classList.add("correct");
    if(i===index&&!ok) b.classList.add("wrong");
  });
  const last=phase72BranchQuizIndex===phase72BranchQuiz.length-1;
  const fb=document.getElementById("phase72QuizFeedback");
  fb.innerHTML=`<b>${ok?"正解！":"おしい！"}</b> ${q.explain}<br><button class="bigbtn" id="phase72QuizNext">${last?"結果を見る":"つぎの問題"}</button>`;
  document.getElementById("phase72QuizNext").onclick=()=>{
    phase72BranchQuizIndex++;
    if(phase72BranchQuizIndex>=phase72BranchQuiz.length) phase72FinishBranchQuiz();
    else phase72RenderBranchQuestion();
  };
}

function phase72FinishBranchQuiz(){
  const main=document.getElementById("phase72BranchMain");
  const passed=phase72BranchQuizCorrect>=2;
  if(passed){
    main.innerHTML=`
      <div class="phase72BranchClear">✓</div>
      <h3>登録基準支部 CLEAR！</h3>
      <p>${phase72BranchQuiz.length}問中${phase72BranchQuizCorrect}問正解！<br>I・V・Xの読み方と、10個の登録基準を確認できた。</p>
      <div class="phase72Tip">ここから先は、実際の世界遺産で「どの基準が、なぜ認められたのか」を調べていこう。</div>
      <div class="phase72Actions"><button class="bigbtn" id="phase72BranchComplete">北海道の旅を続ける</button></div>
    `;
    document.getElementById("phase72BranchComplete").onclick=phase72CompleteBranch;
  }else{
    main.innerHTML=`
      <h3>あと少し！</h3><p>${phase72BranchQuiz.length}問中${phase72BranchQuizCorrect}問正解。2問正解でCLEARだよ。</p>
      <div class="phase72Actions"><button class="bigbtn" id="phase72Review">もう一度見直す</button><button class="bigbtn" id="phase72Retry">もう一度挑戦する</button></div>
    `;
    document.getElementById("phase72Review").onclick=()=>{phase72BranchStep=0;phase72RenderBranchStep();};
    document.getElementById("phase72Retry").onclick=phase72StartBranchQuiz;
  }
}

function phase72CompleteBranch(){
  phase72BranchCleared=true;
  document.getElementById("phase72Branch")?.classList.add("hidden");
  document.getElementById("game")?.classList.remove("hidden");
  if(typeof phase41SetWindowOpen==="function") phase41SetWindowOpen(false);
  px=phase72BranchTiles[0].x;
  py=phase72BranchTiles[0].y;
  render();
  setGuideMessage("登録基準支部 CLEAR！ 知床や縄文遺跡群へ行ってみよう！");
}

function phase72DecorateBranch(){
  if(mode!=="japan") return;
  const map=document.getElementById("map");
  if(!map) return;
  phase72BranchTiles.forEach(({x,y},i)=>{
    const tile=map.querySelector(`.tile[data-x="${x}"][data-y="${y}"]`);
    if(!tile) return;
    tile.classList.remove("phase57Sea","phase57Land");
    tile.classList.add("phase72BranchTile",phase72BranchCleared?"cleared":"active",i===0?"branchLeft":"branchRight");
    if(i===0 && !tile.querySelector(".phase72BranchLabel")){
      const label=document.createElement("span");
      label.className="phase72BranchLabel";
      label.textContent=phase72BranchCleared?"登録基準支部 ✓":"登録基準支部";
      tile.appendChild(label);
    }
  });
}

phase71UpdateProgress = function(){
  phase72BaseUpdateProgress();
  if(mode!=="japan") return;
  const body=document.getElementById("phase71ProgressBody");
  if(!body) return;
  const row=document.createElement("div");
  row.className="phase71AreaRow phase72BranchProgress";
  row.innerHTML=`<span>登録基準支部</span><b>${phase72BranchCleared?"✓ CLEAR":"まずここへ"}</b>`;
  body.prepend(row);
};

move = function(dx,dy){
  if(mode==="japan"){
    const nx=px+dx,ny=py+dy;
    if(ny>=0&&ny<phase7AreaRows.length&&nx>=0&&nx<phase7AreaRows[0].length){
      const c=phase7AreaRows[ny][nx];
      if(c==="C"){
        if(!phase72BranchCleared){ phase72OpenBranch(); return; }
        px=nx;py=ny;render();return;
      }
      if((c==="S"||c==="J")&&!phase72BranchCleared){
        showAction("先に登録基準支部へ行こう","世界遺産を調べる前に、北海道の北にある登録基準支部で基礎を確認しよう。",[{label:"もどる",action:closeAction}],"GUIDE");
        return;
      }
    }
  }
  return phase72BaseMove(dx,dy);
};

render = function(){
  phase72BaseRender();
  if(mode==="japan"){
    phase72DecorateBranch();
    const status=document.getElementById("status");
    const legend=document.getElementById("legend");
    if(!phase72BranchCleared){
      setGuideMessage("すぐ先に登録基準を教えてくれる支部があるよ。まずそこへ行ってみよう！");
      if(status) status.textContent="最初の目的：登録基準支部をCLEARしよう";
    }
    if(legend) legend.textContent="緑＝移動できる　青＝海　🏛＝研究センター支部　？＝未発見　✓＝CLEAR　🔒＝次のエリア";
  }
};

phase72PatchCriteriaLabels();
phase72InstallBranchTiles();
phase72EnsureBranchUi();
