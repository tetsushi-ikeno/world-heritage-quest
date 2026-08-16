// v17 Phase 7.2 hotfix
// 1) Remove the unexplained 1-10 boxes from HQ orientation.
// 2) Bypass the Japan-overview transition that could leave the player unable to move.
// 3) Use the original Piramiton expression sheet in the actual UI.
// 4) Replace difficult criterion-9 wording with child-friendly Japanese.

(function(){
  // ---- Registration-criteria wording ----
  // Phase 7.2 originally used "固有の生態系" as a memorisation label.
  // That wording is too abstract for the target age, so keep the official
  // criterion number while explaining its meaning in ordinary Japanese.
  try{
    if(typeof phase72CriteriaMeta!=="undefined"){
      phase72CriteriaMeta[8].title="生きものと自然のつながり";
      phase72CriteriaMeta[8].note="生きものと環境が関わりながら、変化していくしくみ";
      phase72CriteriaMeta[9].title="大切な生きもののすみか";
      phase72CriteriaMeta[9].note="貴重な生きものや多様な生物を守る重要な場所";
    }
    if(typeof phase71Criteria!=="undefined"){
      phase71Criteria[8].title="生きものと自然のつながり";
      phase71Criteria[8].note="生きものと環境が関わりながら、変化していくしくみ";
      phase71Criteria[9].title="大切な生きもののすみか";
      phase71Criteria[9].note="貴重な生きものや多様な生物を守る重要な場所";
    }
    if(typeof phase72BranchQuiz!=="undefined"){
      phase72BranchQuiz[2]={
        q:"基準9で大切にされているのは、どんなこと？",
        choices:["地球の歴史や地形","生きものと自然のつながり","美しい自然の景色","文化どうしの交流"],
        answer:1,
        explain:"基準9は、生きものと環境が関わりながら変化していく『生態系のしくみ』を大切にする基準だよ。正式表記は (ix)。"
      };
    }

    if(typeof phase7Sites!=="undefined"){
      const shire=phase7Sites["知床"];
      if(shire){
        const card=shire.cards?.find(c=>c.id==="criteria");
        if(card){
          card.value="9 生きものと自然のつながり / 10 大切な生きもののすみか";
          card.description="知床は、基準9『生きものと自然のつながり』と基準10『大切な生きもののすみか』で評価されている。正式表記では (ix)・(x)。";
        }
        if(shire.book){
          shire.book.newText="知床が世界自然遺産に登録されたのは2005年。\n登録基準は 9『生きものと自然のつながり』と 10『大切な生きもののすみか』。\n正式表記では (ix) と (x) だ。\n\n2つのカードを図鑑に記録した！";
          shire.book.knownText="知床は2005年登録。基準9『生きものと自然のつながり』と基準10『大切な生きもののすみか』。\n正式表記では (ix)・(x)。";
        }
        const q=shire.quiz?.find(q=>q.card==="criteria");
        if(q){
          q.question="知床で認められている登録基準の組み合わせはどれ？";
          q.choices=[
            "1 人間が作った傑作 ＋ 2 文化交流",
            "4 建築・科学技術 ＋ 6 出来事や宗教、芸術",
            "7 自然の景観美 ＋ 8 地球の歴史",
            "9 生きものと自然のつながり ＋ 10 大切な生きもののすみか"
          ];
          q.answer=3;
        }
      }
    }
  }catch(e){
    console.warn("Phase 7.2 criteria wording patch skipped",e);
  }

  // ---- Original Piramiton sprite sheet ----
  const piramitonMoodPosition={
    normal:"0% 0%",
    happy:"50% 0%",
    surprised:"100% 0%",
    sad:"25% 100%",
    sparkle:"75% 100%"
  };

  function installPiramitonStyle(){
    if(document.getElementById("phase72PiramitonStyle")) return;
    const style=document.createElement("style");
    style.id="phase72PiramitonStyle";
    style.textContent=`
      .piramitonOriginal{
        background-repeat:no-repeat!important;
        background-size:300% auto!important;
        background-color:transparent!important;
        image-rendering:pixelated;
      }
      .piramitonOriginal > *{display:none!important}
      .phase71BigPiramiton.piramitonOriginal{background-size:300% auto!important}
      .phase71MiniPiramiton.piramitonOriginal,
      .guidePortrait.piramitonOriginal{background-size:300% auto!important}
    `;
    document.head.appendChild(style);
  }

  function setPiramitonMood(el,mood="normal"){
    if(!el || !window.PIRAMITON_EXPR_SHEET) return;
    installPiramitonStyle();
    el.classList.add("piramitonOriginal");
    el.dataset.piramitonMood=mood;
    el.style.backgroundImage=`url(${window.PIRAMITON_EXPR_SHEET})`;
    el.style.backgroundPosition=piramitonMoodPosition[mood]||piramitonMoodPosition.normal;
  }
  window.setPiramitonMood=setPiramitonMood;

  function introMood(){
    if(typeof phase71IntroIndex==="undefined") return "normal";
    if(phase71IntroIndex===0) return "normal";
    if(phase71IntroIndex===1) return "surprised";
    return "happy";
  }

  // Story: surprise when the parcel arrives, happy when Piramiton introduces himself.
  if(typeof phase71RenderIntro==="function"){
    const baseIntro=phase71RenderIntro;
    phase71RenderIntro=function(){
      baseIntro();
      requestAnimationFrame(()=>setPiramitonMood(document.querySelector(".phase71BigPiramiton"),introMood()));
    };
  }

  // HQ onboarding now does only one job: establish that there are ten criteria.
  phase71RenderOrientationLesson = function(){
    const head=document.querySelector("#phase71Orientation .phase71OrientationHead h2");
    if(head) head.textContent="本部オリエンテーション";
    const main=document.getElementById("phase71OrientationMain");
    if(!main) return;

    main.innerHTML=`
      <div class="phase71Speech">
        <strong>ピラミトン：</strong> 世界遺産には、「なぜ世界的に大切なのか」を判断するための<strong>登録基準が10個</strong>あるよ。<br><br>
        今は10個の内容まで覚えなくて大丈夫。旅の途中で、実物と結びつけながら少しずつ覚えていこう！
      </div>
      <div class="phase71StoryActions"><button id="phase72LeaveHQ" class="bigbtn">北海道へ行ってみよう</button></div>
    `;

    setPiramitonMood(document.querySelector("#phase71Orientation .phase71MiniPiramiton"),"happy");
    document.getElementById("phase72LeaveHQ").onclick=phase71BeginJourney;
  };

  // Branch screens: neutral while learning, thinking during questions,
  // then clearly happy/sad after the result.
  if(typeof phase72RenderBranchStep==="function"){
    const baseBranchStep=phase72RenderBranchStep;
    phase72RenderBranchStep=function(){
      baseBranchStep();
      requestAnimationFrame(()=>setPiramitonMood(document.querySelector("#phase72Branch .phase71MiniPiramiton"),phase72BranchStep===2?"happy":"normal"));
    };
  }

  if(typeof phase72RenderBranchQuestion==="function"){
    const baseBranchQuestion=phase72RenderBranchQuestion;
    phase72RenderBranchQuestion=function(){
      baseBranchQuestion();
      requestAnimationFrame(()=>setPiramitonMood(document.querySelector("#phase72Branch .phase71MiniPiramiton"),"normal"));
    };
  }

  if(typeof phase72AnswerBranchQuestion==="function"){
    const baseBranchAnswer=phase72AnswerBranchQuestion;
    phase72AnswerBranchQuestion=function(index){
      let ok=false;
      try{ ok=index===phase72BranchQuiz[phase72BranchQuizIndex].answer; }catch(_e){}
      baseBranchAnswer(index);
      requestAnimationFrame(()=>setPiramitonMood(document.querySelector("#phase72Branch .phase71MiniPiramiton"),ok?"sparkle":"sad"));
    };
  }

  if(typeof phase72FinishBranchQuiz==="function"){
    const baseBranchFinish=phase72FinishBranchQuiz;
    phase72FinishBranchQuiz=function(){
      const passed=phase72BranchQuizCorrect>=2;
      baseBranchFinish();
      requestAnimationFrame(()=>setPiramitonMood(document.querySelector("#phase72Branch .phase71MiniPiramiton"),passed?"sparkle":"sad"));
    };
  }

  // Persistent guide portrait follows the tone of Piramiton's current message.
  function guideMoodFromText(text){
    const t=text||"";
    if(/CLEAR|正解|できた|カード|発見|到着/.test(t)) return "sparkle";
    if(/おしい|あと少し|まだ|先に/.test(t)) return "sad";
    if(/\?|？|なに|何/.test(t)) return "surprised";
    if(/行って|歩いて|話しかけ|調べ/.test(t)) return "happy";
    return "normal";
  }

  function refreshGuidePiramiton(){
    const msg=document.getElementById("guideMessage");
    const portrait=document.querySelector(".guidePortrait");
    if(portrait) setPiramitonMood(portrait,guideMoodFromText(msg?.textContent));
  }

  const guideMessage=document.getElementById("guideMessage");
  if(guideMessage){
    new MutationObserver(refreshGuidePiramiton).observe(guideMessage,{childList:true,subtree:true,characterData:true});
  }

  // Apply to already-created UI immediately (Phase 7.1/7.2 build their panels before this file loads).
  requestAnimationFrame(()=>{
    setPiramitonMood(document.querySelector(".phase71BigPiramiton"),introMood());
    setPiramitonMood(document.querySelector("#phase71Orientation .phase71MiniPiramiton"),"happy");
    setPiramitonMood(document.querySelector("#phase72Branch .phase71MiniPiramiton"),"normal");
    refreshGuidePiramiton();
  });

  // ---- Hokkaido transition hotfix ----
  function phase72FixArriveHokkaido(){
    clearTimeout(phase57ZoomTimer1);
    clearTimeout(phase57ZoomTimer2);

    if(typeof phase62StopJoystick==="function") phase62StopJoystick();
    if(typeof phase41SetWindowOpen==="function") phase41SetWindowOpen(false);

    phase57OverviewActive=false;
    transitionLock=false;
    mode="japan";
    px=phase72NorthStart.x;
    py=phase72NorthStart.y;

    document.getElementById("game")?.classList.remove("hidden");
    document.getElementById("map")?.classList.remove("phase57Zooming");
    render();

    requestAnimationFrame(()=>{
      phase57OverviewActive=false;
      transitionLock=false;
      if(typeof phase41SetWindowOpen==="function") phase41SetWindowOpen(false);
      setGuideMessage("北海道に到着！ すぐ先を歩いてみよう！");
      refreshGuidePiramiton();
    });
  }

  phase57StartZoomToHokkaido = function(){
    phase72FixArriveHokkaido();
  };
})();
