// v17 Phase 7.2 stabilization hotfix
// - remove the forced registration-criteria branch from the Hokkaido loop
// - restore direct entry into heritage sites
// - standardize the 10 criterion names used by the app
// - make Piramiton reliably visible with the original expression sheet
// - keep the direct Hokkaido transition stable

(function(){
  // ---------------------------------------------------------------------------
  // 1. Standard app names for the ten World Heritage criteria
  // ---------------------------------------------------------------------------
  const appCriteria=[
    {title:"人類の創造力",note:"人が生み出した、特にすぐれた傑作"},
    {title:"文化の交流",note:"建築や技術などを通じた文化や考え方の交流"},
    {title:"文化・文明の証言",note:"ある文化や文明を今に伝える大切な証拠"},
    {title:"歴史を伝える建築・技術",note:"歴史の大切な時代を伝える建物や技術"},
    {title:"伝統的な暮らし・土地利用",note:"人々の伝統的な暮らしや土地との関わり"},
    {title:"出来事・思想・信仰・芸術",note:"大切な出来事、考え方、信仰、芸術などとの結びつき"},
    {title:"すばらしい自然景観",note:"とても美しい自然や、すばらしい自然現象"},
    {title:"地球の歴史・地形",note:"地球の歴史や地形のでき方を伝えている"},
    {title:"生態系のしくみ",note:"生きものと環境が関わりながら変化・発展していくしくみ"},
    {title:"生物多様性・生息地",note:"さまざまな生きものを守るために大切な場所"}
  ];

  try{
    if(typeof phase71Criteria!=="undefined"){
      appCriteria.forEach((m,i)=>{
        if(!phase71Criteria[i]) return;
        phase71Criteria[i].title=m.title;
        phase71Criteria[i].note=m.note;
      });
    }
    if(typeof phase72CriteriaMeta!=="undefined"){
      appCriteria.forEach((m,i)=>{
        if(!phase72CriteriaMeta[i]) return;
        phase72CriteriaMeta[i].title=m.title;
        phase72CriteriaMeta[i].note=m.note;
      });
    }

    // Keep the branch quiz internally coherent even though the branch is no
    // longer part of the mandatory game loop.
    if(typeof phase72BranchQuiz!=="undefined" && phase72BranchQuiz[2]){
      phase72BranchQuiz[2]={
        q:"基準9「生態系のしくみ」が見ているのは、どんなこと？",
        choices:[
          "地球の歴史や地形のでき方",
          "生きものと環境が関わりながら変化していくこと",
          "自然の景色がとても美しいこと",
          "文化や技術が交流したこと"
        ],
        answer:1,
        explain:"基準9は、生きものと環境が関わりながら変化・発展していく『生態系のしくみ』を見る基準だよ。正式表記は (ix)。"
      };
    }

    if(typeof phase7Sites!=="undefined"){
      const shire=phase7Sites["知床"];
      if(shire){
        const card=shire.cards?.find(c=>c.id==="criteria");
        if(card){
          card.value="9 生態系のしくみ / 10 生物多様性・生息地";
          card.description="知床は、基準9『生態系のしくみ』と基準10『生物多様性・生息地』で評価されている。正式表記では (ix)・(x)。";
        }
        if(shire.book){
          shire.book.newText="知床が世界自然遺産に登録されたのは2005年。\n登録基準は 9『生態系のしくみ』と 10『生物多様性・生息地』。\n正式表記では (ix) と (x) だ。\n\n2つのカードを図鑑に記録した！";
          shire.book.knownText="知床は2005年登録。基準9『生態系のしくみ』と基準10『生物多様性・生息地』。\n正式表記では (ix)・(x)。";
        }
        const q=shire.quiz?.find(q=>q.card==="criteria");
        if(q){
          q.question="知床で認められている登録基準の組み合わせはどれ？";
          q.choices=[
            "1 人類の創造力 ＋ 2 文化の交流",
            "4 歴史を伝える建築・技術 ＋ 6 出来事・思想・信仰・芸術",
            "7 すばらしい自然景観 ＋ 8 地球の歴史・地形",
            "9 生態系のしくみ ＋ 10 生物多様性・生息地"
          ];
          q.answer=3;
        }
      }

      const jomon=phase7Sites["北海道・北東北の縄文遺跡群"];
      if(jomon){
        const card=jomon.cards?.find(c=>c.id==="criteria");
        if(card){
          card.value="3 文化・文明の証言 / 5 伝統的な暮らし・土地利用";
          card.description="縄文遺跡群は、基準3『文化・文明の証言』と基準5『伝統的な暮らし・土地利用』で評価されている。正式表記では (iii)・(v)。";
        }
      }
    }
  }catch(e){
    console.warn("Phase 7.2 criterion naming patch skipped",e);
  }

  // ---------------------------------------------------------------------------
  // 2. Remove the forced registration-criteria branch from the core loop
  // ---------------------------------------------------------------------------
  // Phase 7.2 had inserted invisible/special C tiles and blocked S/J until the
  // branch quiz was cleared. That made the map feel arbitrary and prevented
  // players from entering a heritage site. For the game-loop prototype,
  // criteria are learned inside each heritage site instead.
  try{
    if(typeof phase72BranchCleared!=="undefined") phase72BranchCleared=true;
    if(typeof phase72BranchTiles!=="undefined" && typeof phase7PlaceMarker==="function" && typeof phase7AreaRows!=="undefined"){
      phase72BranchTiles.forEach(({x,y})=>phase7PlaceMarker(phase7AreaRows,x,y,"L"));
    }
    if(typeof phase72DecorateBranch==="function") phase72DecorateBranch=function(){};
    if(typeof phase72BaseUpdateProgress==="function") phase71UpdateProgress=phase72BaseUpdateProgress;
    if(typeof phase72BaseMove==="function") move=phase72BaseMove;
    if(typeof phase72BaseRender==="function") render=phase72BaseRender;
    document.getElementById("phase72Branch")?.classList.add("hidden");
  }catch(e){
    console.warn("Phase 7.2 branch bypass skipped",e);
  }

  // ---------------------------------------------------------------------------
  // 3. Piramiton: reliably use the original expression sheet
  // ---------------------------------------------------------------------------
  const moodPosition={
    normal:"0% 0%",
    happy:"50% 0%",
    surprised:"100% 0%",
    sad:"25% 100%",
    sparkle:"75% 100%"
  };

  function installPiramitonStyle(){
    let style=document.getElementById("phase72PiramitonStyle");
    if(!style){
      style=document.createElement("style");
      style.id="phase72PiramitonStyle";
      document.head.appendChild(style);
    }
    style.textContent=`
      .piramitonOriginal{
        background-repeat:no-repeat!important;
        background-color:transparent!important;
        background-size:300% auto!important;
        overflow:hidden!important;
        image-rendering:pixelated;
      }
      .piramitonOriginal>.pyramidBody,
      .piramitonOriginal>.pyramidFace,
      .piramitonOriginal>.pyramidMouth,
      .piramitonOriginal>.pyramidHand{display:none!important}
      .phaseMapGuide .guideBox{grid-template-columns:70px 1fr!important}
      .guidePortrait.piramitonOriginal{
        width:66px!important;
        min-width:66px!important;
        height:60px!important;
        min-height:60px!important;
        border:0!important;
      }
      .phase71MiniPiramiton.piramitonOriginal{
        width:64px!important;
        height:60px!important;
        transform:none!important;
      }
      .phase71BigPiramiton.piramitonOriginal{
        width:140px!important;
        height:130px!important;
        transform:none!important;
      }
    `;
  }

  function setPiramitonMood(el,mood="normal"){
    if(!el || !window.PIRAMITON_EXPR_SHEET) return false;
    installPiramitonStyle();
    el.classList.add("piramitonOriginal");
    el.dataset.piramitonMood=mood;
    el.style.setProperty("background-image",`url("${window.PIRAMITON_EXPR_SHEET}")`,"important");
    el.style.setProperty("background-position",moodPosition[mood]||moodPosition.normal,"important");
    el.style.setProperty("background-repeat","no-repeat","important");
    return true;
  }
  window.setPiramitonMood=setPiramitonMood;

  function guideMoodFromText(text){
    const t=text||"";
    if(/CLEAR|正解|できた|カード|発見|到着|記録/.test(t)) return "sparkle";
    if(/おしい|あと少し|まだ|できない|入れない/.test(t)) return "sad";
    if(/\?|？|なに|何/.test(t)) return "surprised";
    if(/行って|歩いて|話して|調べ|めぐって/.test(t)) return "happy";
    return "normal";
  }

  function refreshGuidePiramiton(){
    const portrait=document.querySelector(".guidePortrait");
    const msg=document.getElementById("guideMessage");
    if(portrait) setPiramitonMood(portrait,guideMoodFromText(msg?.textContent));
  }

  function introMood(){
    if(typeof phase71IntroIndex==="undefined") return "normal";
    if(phase71IntroIndex===1) return "surprised";
    if(phase71IntroIndex>=2) return "happy";
    return "normal";
  }

  if(typeof phase71RenderIntro==="function"){
    const baseIntro=phase71RenderIntro;
    phase71RenderIntro=function(){
      baseIntro();
      requestAnimationFrame(()=>setPiramitonMood(document.querySelector(".phase71BigPiramiton"),introMood()));
    };
  }

  // Re-apply after every map render/mount so later phase code cannot bring back
  // the old CSS-only face.
  if(typeof phase56MountPiramiton==="function"){
    const baseMount=phase56MountPiramiton;
    phase56MountPiramiton=function(){
      baseMount();
      requestAnimationFrame(refreshGuidePiramiton);
    };
  }

  const guideMessage=document.getElementById("guideMessage");
  if(guideMessage){
    new MutationObserver(refreshGuidePiramiton).observe(guideMessage,{childList:true,subtree:true,characterData:true});
  }

  // ---------------------------------------------------------------------------
  // 4. Simple HQ orientation; no detailed criterion lesson before the map
  // ---------------------------------------------------------------------------
  phase71RenderOrientationLesson=function(){
    const head=document.querySelector("#phase71Orientation .phase71OrientationHead h2");
    if(head) head.textContent="本部オリエンテーション";
    const main=document.getElementById("phase71OrientationMain");
    if(!main) return;
    main.innerHTML=`
      <div class="phase71Speech">
        <strong>ピラミトン：</strong> 世界遺産には、「なぜ世界的に大切なのか」を判断するための<strong>登録基準が10個</strong>あるよ。<br><br>
        今は覚えなくて大丈夫。旅をしながら、世界遺産ごとに少しずつ知っていこう！
      </div>
      <div class="phase71StoryActions"><button id="phase72LeaveHQ" class="bigbtn">北海道へ行ってみよう</button></div>
    `;
    setPiramitonMood(document.querySelector("#phase71Orientation .phase71MiniPiramiton"),"happy");
    document.getElementById("phase72LeaveHQ").onclick=phase71BeginJourney;
  };

  // ---------------------------------------------------------------------------
  // 5. Stable direct transition to Hokkaido
  // ---------------------------------------------------------------------------
  function arriveHokkaido(){
    clearTimeout(typeof phase57ZoomTimer1!=="undefined"?phase57ZoomTimer1:null);
    clearTimeout(typeof phase57ZoomTimer2!=="undefined"?phase57ZoomTimer2:null);
    if(typeof phase62StopJoystick==="function") phase62StopJoystick();
    if(typeof phase41SetWindowOpen==="function") phase41SetWindowOpen(false);
    if(typeof phase57OverviewActive!=="undefined") phase57OverviewActive=false;
    transitionLock=false;
    mode="japan";
    // Keep the existing north-Hokkaido start point, but without a mandatory branch.
    if(typeof phase72NorthStart!=="undefined"){
      px=phase72NorthStart.x;
      py=phase72NorthStart.y;
    }
    document.getElementById("game")?.classList.remove("hidden");
    document.getElementById("map")?.classList.remove("phase57Zooming");
    render();
    requestAnimationFrame(()=>{
      transitionLock=false;
      if(typeof phase41SetWindowOpen==="function") phase41SetWindowOpen(false);
      setGuideMessage("北海道に到着！ 気になる世界遺産を探してみよう！");
      refreshGuidePiramiton();
    });
  }

  phase57StartZoomToHokkaido=function(){ arriveHokkaido(); };

  // Apply immediately to already-created UI.
  installPiramitonStyle();
  requestAnimationFrame(()=>{
    setPiramitonMood(document.querySelector(".phase71BigPiramiton"),introMood());
    setPiramitonMood(document.querySelector("#phase71Orientation .phase71MiniPiramiton"),"happy");
    refreshGuidePiramiton();
  });
})();
