// v17 Phase 7.1: story onboarding + criteria orientation + persistent guide/progress UX
// This layer intentionally keeps Phase 7's reusable site loop intact.

const phase71BaseRender = render;
const phase71BaseMove = move;
const phase71BaseEnterSite = phase7EnterSite;

const phase71Criteria = [
  {n:1, title:"人類の創造力", note:"人が生み出した、特にすぐれた傑作", count:5},
  {n:2, title:"文化の交流", note:"建築や技術などに見られる価値観の交流", count:13},
  {n:3, title:"文化・文明の証言", note:"文化や文明を伝える特別な証拠", count:10},
  {n:4, title:"歴史を伝える建築・技術", note:"歴史の重要な段階を伝える建築や技術", count:12},
  {n:5, title:"伝統的な暮らし・土地利用", note:"人々の暮らしや土地との関わり", count:3},
  {n:6, title:"出来事・思想・信仰・芸術", note:"大切な出来事、考え方、信仰や芸術との結びつき", count:10},
  {n:7, title:"すばらしい自然景観", note:"特に美しい自然や自然現象", count:1},
  {n:8, title:"地球の歴史・地形", note:"地球の歴史や地形のでき方を伝える", count:0},
  {n:9, title:"生態系のしくみ", note:"生き物と環境が変化・発展していくしくみ", count:4},
  {n:10,title:"生物多様性・生息地", note:"貴重な生き物や多様な生物を守る重要な場所", count:2}
];

const phase71EntryPoints = {};
let phase71IntroIndex = 0;
let phase71OrientationQuizIndex = 0;
let phase71OrientationCorrect = 0;
let phase71Started = false;

const phase71IntroSlides = [
  {
    title:"もっと世界遺産を知りたい",
    text:"ある日、主人公は世界遺産の本を読んでいた。\n\n写真だけでもおもしろい。けれど、どうして世界遺産になったのか、もっと詳しく知りたくなった。"
  },
  {
    title:"世界遺産研究センターからの荷物",
    text:"そのとき、小さな荷物が届いた。\n送り主は「世界遺産研究センター」。\n\n箱の中から、三角形のふしぎな相棒が飛び出した！"
  },
  {
    title:"ぼくはピラミトン！",
    text:"「ぼくはピラミトン！ 世界遺産研究センターから来たんだ。\n本で読むのもいいけれど、実際に日本をめぐって調べてみない？」\n\nこうして、世界遺産をめぐる旅が始まる。"
  }
];

const phase71OrientationQuiz = [
  {
    q:"日本の世界遺産で、2026年8月時点ではまだ一度も使われていない登録基準は？",
    choices:["2 文化の交流","4 歴史を伝える建築・技術","8 地球の歴史・地形","9 生態系のしくみ"],
    answer:2
  },
  {
    q:"生態系が変化・発展していく大切なしくみが評価されるのは？",
    choices:["1 人類の創造力","5 伝統的な暮らし・土地利用","8 地球の歴史・地形","9 生態系のしくみ"],
    answer:3
  }
];

function phase71PatchCriteriaData(){
  const shire = phase7Sites["知床"];
  const jomon = phase7Sites["北海道・北東北の縄文遺跡群"];
  if(shire){
    const card=shire.cards.find(c=>c.id==="criteria");
    if(card){
      card.value="9 生態系のしくみ / 10 生物多様性・生息地";
      card.description="知床は基準9「生態系のしくみ」と、基準10「生物多様性・生息地」で評価されている。正式表記では (ix)・(x)。";
    }
    shire.book.newText="知床が世界自然遺産に登録されたのは2005年。\n登録基準は 9「生態系のしくみ」と 10「生物多様性・生息地」。\n\n2つのカードを図鑑に記録した！";
    shire.book.knownText="知床は2005年登録。基準9「生態系のしくみ」と基準10「生物多様性・生息地」。\n正式表記では (ix)・(x)。";
    const q=shire.quiz.find(q=>q.card==="criteria");
    if(q){
      q.question="知床で認められている登録基準の組み合わせはどれ？";
      q.choices=["1 人類の創造力 ＋ 2 文化の交流","4 歴史を伝える建築・技術 ＋ 6 出来事・思想・信仰・芸術","7 すばらしい自然景観 ＋ 8 地球の歴史・地形","9 生態系のしくみ ＋ 10 生物多様性・生息地"];
      q.answer=3;
    }
  }
  if(jomon){
    const card=jomon.cards.find(c=>c.id==="criteria");
    if(card){
      card.value="3 文化・文明の証言 / 5 伝統的な暮らし・土地利用";
      card.description="縄文遺跡群は基準3「文化・文明の証言」と、基準5「伝統的な暮らし・土地利用」で評価されている。正式表記では (iii)・(v)。";
    }
    if(jomon.book){
      jomon.book.newText="縄文遺跡群は17の遺跡で構成され、2021年に登録された。\n登録基準は 3「文化・文明の証言」と 5「伝統的な暮らし・土地利用」。\n\n図鑑に記録した！";
      jomon.book.knownText="17の遺跡、2021年登録。基準3「文化・文明の証言」と基準5「伝統的な暮らし・土地利用」。\n正式表記では (iii)・(v)。";
    }
    const q=jomon.quiz.find(q=>q.card==="criteria");
    if(q){
      q.question="縄文遺跡群で認められている登録基準の組み合わせはどれ？";
      q.choices=["1 人類の創造力 ＋ 2 文化の交流","3 文化・文明の証言 ＋ 5 伝統的な暮らし・土地利用","4 歴史を伝える建築・技術 ＋ 6 出来事・思想・信仰・芸術","9 生態系のしくみ ＋ 10 生物多様性・生息地"];
      q.answer=1;
    }
  }
}

function phase71EnsureUi(){
  if(!document.getElementById("phase71Intro")){
    const intro=document.createElement("section");
    intro.id="phase71Intro";
    intro.className="panel phase71Intro";
    intro.innerHTML=`
      <div class="phase71StoryKicker">WORLD HERITAGE QUEST</div>
      <div class="phase71StoryRow">
        <div class="phase71BigPiramiton" aria-hidden="true">
          <div class="pyramidBody"></div><div class="pyramidFace"></div><div class="pyramidMouth"></div><div class="pyramidHand left"></div><div class="pyramidHand right"></div>
        </div>
        <div class="phase71StoryCopy">
          <div id="phase71IntroStep" class="phase71Step"></div>
          <h2 id="phase71IntroTitle"></h2>
          <div id="phase71IntroText" class="phase71IntroText"></div>
        </div>
      </div>
      <div class="phase71StoryActions"><button id="phase71IntroNext" class="bigbtn">つぎへ</button></div>
    `;
    document.getElementById("app").appendChild(intro);
    document.getElementById("phase71IntroNext").onclick=phase71NextIntro;
  }

  if(!document.getElementById("phase71Orientation")){
    const panel=document.createElement("section");
    panel.id="phase71Orientation";
    panel.className="panel hidden phase71Orientation";
    panel.innerHTML=`
      <div class="phase71OrientationHead">
        <div class="phase71MiniPiramiton"><div class="pyramidBody"></div><div class="pyramidFace"></div><div class="pyramidMouth"></div></div>
        <div><div class="phase71StoryKicker">世界遺産研究センター</div><h2>旅立ち前オリエンテーション</h2></div>
      </div>
      <div id="phase71OrientationMain"></div>
    `;
    document.getElementById("app").appendChild(panel);
  }

  const record=document.querySelector(".recordSection");
  if(record && !document.getElementById("phase71Progress")){
    const progress=document.createElement("button");
    progress.id="phase71Progress";
    progress.className="phase71Progress";
    progress.type="button";
    progress.innerHTML='<div class="phase71ProgressTitle">世界遺産の書</div><div id="phase71ProgressBody"></div><div id="phase71ProgressHint" class="phase71ProgressHint"></div>';
    record.appendChild(progress);
    progress.onclick=()=>{
      if(mode==="site" && phase7Config()) openCodex();
    };
  }
}

function phase71RenderIntro(){
  phase71EnsureUi();
  const slide=phase71IntroSlides[phase71IntroIndex];
  document.getElementById("phase71IntroStep").textContent=`${phase71IntroIndex+1} / ${phase71IntroSlides.length}`;
  document.getElementById("phase71IntroTitle").textContent=slide.title;
  document.getElementById("phase71IntroText").textContent=slide.text;
  document.getElementById("phase71IntroNext").textContent=phase71IntroIndex===phase71IntroSlides.length-1?"研究センターへ":"つぎへ";
}

function phase71NextIntro(){
  if(phase71IntroIndex < phase71IntroSlides.length-1){
    phase71IntroIndex++;
    phase71RenderIntro();
    return;
  }
  document.getElementById("phase71Intro").classList.add("hidden");
  document.getElementById("phase71Orientation").classList.remove("hidden");
  phase71RenderOrientationLesson();
}

function phase71RenderOrientationLesson(){
  const main=document.getElementById("phase71OrientationMain");
  main.innerHTML=`
    <div class="phase71Speech"><strong>ピラミトン：</strong> 世界遺産には「なぜ世界的に大切なのか」を見る10個の登録基準があるよ。全部を暗記しなくて大丈夫。まずは<strong>番号には意味がある</strong>ことを知っておこう！</div>
    <div class="phase71CriteriaGrid">
      ${phase71Criteria.map(c=>`<div class="phase71Criterion"><span class="phase71CriterionNum">${c.n}</span><span><b>${c.title}</b><small>${c.note}</small></span></div>`).join("")}
    </div>
    <div class="phase71Stats">
      <h3>日本の27件では、どの基準が多い？</h3>
      <p>1つの遺産が複数の基準を持つので、合計は27を超えるよ。</p>
      <div class="phase71Bars">
        ${phase71Criteria.map(c=>`<div class="phase71BarRow"><span>${c.n}</span><div class="phase71BarTrack"><i style="width:${Math.round(c.count/13*100)}%"></i></div><b>${c.count}件</b></div>`).join("")}
      </div>
      <div class="phase71Insight"><b>発見：</b> 日本では「2 文化の交流」が13件で最多。「4 歴史を伝える建築・技術」も12件。一方、「8 地球の歴史・地形」は現在0件だ。</div>
      <div class="phase71WorldNote">世界全体では現在1273件。日本とは違う基準の偏りもある。世界との比較は、旅の途中にある研究センターでも少しずつ調べていこう。</div>
    </div>
    <div class="phase71StoryActions"><button id="phase71StartCheck" class="bigbtn">2問だけ確認する</button></div>
  `;
  document.getElementById("phase71StartCheck").onclick=phase71StartOrientationQuiz;
}

function phase71StartOrientationQuiz(){
  phase71OrientationQuizIndex=0;
  phase71OrientationCorrect=0;
  phase71RenderOrientationQuestion();
}

function phase71RenderOrientationQuestion(){
  const main=document.getElementById("phase71OrientationMain");
  const q=phase71OrientationQuiz[phase71OrientationQuizIndex];
  main.innerHTML=`
    <div class="phase71CheckHead">確認 ${phase71OrientationQuizIndex+1} / ${phase71OrientationQuiz.length}</div>
    <h3 class="phase71CheckQuestion">${q.q}</h3>
    <div class="phase71CheckChoices">${q.choices.map((c,i)=>`<button class="bigbtn phase71CheckChoice" data-i="${i}">${c}</button>`).join("")}</div>
    <div id="phase71CheckFeedback" class="phase71CheckFeedback"></div>
  `;
  main.querySelectorAll(".phase71CheckChoice").forEach(btn=>btn.onclick=()=>phase71AnswerOrientation(Number(btn.dataset.i)));
}

function phase71AnswerOrientation(index){
  const q=phase71OrientationQuiz[phase71OrientationQuizIndex];
  const ok=index===q.answer;
  if(ok) phase71OrientationCorrect++;
  document.querySelectorAll(".phase71CheckChoice").forEach((b,i)=>{
    b.disabled=true;
    if(i===q.answer)b.classList.add("correct");
    if(i===index&&!ok)b.classList.add("wrong");
  });
  const fb=document.getElementById("phase71CheckFeedback");
  fb.innerHTML=`<b>${ok?"正解！":"おしい！"}</b> ${ok?"":`答えは「${q.choices[q.answer]}」。`}<br><button id="phase71CheckNext" class="bigbtn">${phase71OrientationQuizIndex===phase71OrientationQuiz.length-1?"旅に出る":"つぎの問題"}</button>`;
  document.getElementById("phase71CheckNext").onclick=()=>{
    phase71OrientationQuizIndex++;
    if(phase71OrientationQuizIndex>=phase71OrientationQuiz.length) phase71BeginJourney();
    else phase71RenderOrientationQuestion();
  };
}

function phase71BeginJourney(){
  phase71Started=true;
  document.getElementById("phase71Orientation").classList.add("hidden");
  applyAvatarToGame();
  document.getElementById("game").classList.remove("hidden");
  if(typeof phase62StopJoystick==="function") phase62StopJoystick();
  enterJapanMap();
}

function phase71UpdateProgress(){
  const panel=document.getElementById("phase71Progress");
  const body=document.getElementById("phase71ProgressBody");
  const hint=document.getElementById("phase71ProgressHint");
  if(!panel||!body||!hint) return;

  if(mode==="site" && phase7Config()){
    const config=phase7Config();
    const state=phase7State();
    const count=phase7AcquiredCount();
    body.innerHTML=`
      <div class="phase71SiteProgressName">${config.shortName}</div>
      <div class="phase71Meter"><i style="width:${Math.round(count/config.cards.length*100)}%"></i></div>
      <div class="phase71Count">${count} / ${config.cards.length} 記録</div>
      <div class="phase71MiniList">${config.cards.map(c=>`<span class="${state.cards[c.id]?.acquired?"done":"missing"}">${state.cards[c.id]?.acquired?"✓":"?"} ${c.property}</span>`).join("")}</div>
    `;
    hint.textContent="タップして図鑑をひらく";
    panel.classList.add("canOpen");
    return;
  }

  const sh=phase7SiteState["知床"];
  const jo=phase7SiteState["北海道・北東北の縄文遺跡群"];
  const countFor=(name)=>Object.values(phase7SiteState[name]?.cards||{}).filter(v=>v.acquired).length;
  body.innerHTML=`
    <div class="phase71AreaRow"><span>知床</span><b>${sh?.cleared?"✓ CLEAR":`${countFor("知床")}/8`}</b></div>
    <div class="phase71AreaRow"><span>縄文遺跡群</span><b>${jo?.cleared?"✓ CLEAR":`${countFor("北海道・北東北の縄文遺跡群")}/8`}</b></div>
  `;
  hint.textContent="北海道エリアの調査状況";
  panel.classList.remove("canOpen");
}

phase7EnterSite = function(name){
  // Save the exact area tile used to enter. Both ordinary exit and post-quiz exit
  // return to this same point, avoiding stranded positions on irregular coastlines.
  if(mode==="japan"){
    phase71EntryPoints[name]={x:px,y:py};
    if(phase7Sites[name]) phase7Sites[name].returnPos={x:px,y:py};
  }
  return phase71BaseEnterSite(name);
};
enterShiretokoVillage = function(){ return phase7EnterSite("知床"); };

move = function(dx,dy){
  // Sea/walls simply stop movement. Repeated joystick contact must not flash guide text.
  if(mode==="japan"){
    const nx=px+dx, ny=py+dy;
    if(ny>=0&&ny<phase7AreaRows.length&&nx>=0&&nx<phase7AreaRows[0].length){
      const c=phase7AreaRows[ny][nx];
      if(c==="~" || c==="G") return;
    }
  }
  return phase71BaseMove(dx,dy);
};

render = function(){
  phase71BaseRender();
  phase71UpdateProgress();
  // Piramiton is a stable guide strip. Normal movement does not overwrite it with collision chatter.
  if(mode==="site") setGuideMessage("気になるところを調べてみよう！");
  else if(mode==="japan") setGuideMessage("北海道をめぐって、世界遺産を調べよう！");
};

function phase71Boot(){
  phase71PatchCriteriaData();
  phase71EnsureUi();
  applyAvatarToGame();
  document.getElementById("avatarScreen")?.classList.add("hidden");
  document.getElementById("game")?.classList.add("hidden");
  document.getElementById("phase71Orientation")?.classList.add("hidden");
  document.getElementById("phase71Intro")?.classList.remove("hidden");
  // Old village/tutorial state is bypassed by the new research-centre onboarding.
  phase71RenderIntro();
}

phase71Boot();
