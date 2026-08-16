// v17 Phase 7.2 corrective hotfix
// - restore the registration-criteria branch on the Hokkaido map
// - guarantee entry when stepping onto a heritage marker
// - replace the fragile sprite-sheet Piramiton with stable CSS expressions/actions
// - keep child-friendly criterion wording consistent

(function(){
  // ---------------------------------------------------------------------------
  // 1. Consistent, child-friendly names for the ten World Heritage criteria
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
          card.description="縄文遺跡群は、基準3『文化・文明の証言』と基準5『伝統的な暮らし・土地利用』で評価されている。正式表記は (iii)・(v)。";
        }
      }
    }
  }catch(e){
    console.warn("Phase 7.2 criterion copy patch skipped",e);
  }

  // ---------------------------------------------------------------------------
  // 2. Restore and harden the registration-criteria branch
  // ---------------------------------------------------------------------------
  try{
    if(typeof phase72BranchCleared!=="undefined") phase72BranchCleared=false;
    if(typeof phase72BranchTiles!=="undefined" && typeof phase7PlaceMarker==="function" && typeof phase7AreaRows!=="undefined"){
      phase72BranchTiles.forEach(({x,y})=>phase7PlaceMarker(phase7AreaRows,x,y,"C"));
    }
  }catch(e){
    console.warn("Phase 7.2 branch restore skipped",e);
  }

  // The final movement wrapper handles special tiles itself. This avoids the
  // previous state in which the player could visually stand on a ? tile without
  // the discovery/entry event firing.
  move=function(dx,dy){
    if(mode==="japanOverview" || transitionLock) return;
    if(typeof phase41WindowOpen!=="undefined" && phase41WindowOpen) return;

    if(mode==="japan"){
      const nx=px+dx, ny=py+dy;
      if(ny<0 || ny>=phase7AreaRows.length || nx<0 || nx>=phase7AreaRows[0].length) return;
      const c=phase7AreaRows[ny][nx];

      if(c==="~" || c==="G") return;

      if(c==="C"){
        px=nx; py=ny;
        render();
        if(!phase72BranchCleared){
          phase62StopJoystick?.();
          phase72OpenBranch();
        }
        return;
      }

      if(c==="S" || c==="J"){
        if(!phase72BranchCleared){
          phase62StopJoystick?.();
          showAction(
            "先に登録基準支部へ行ってみよう",
            "世界遺産を調べる前に、すぐ近くの『登録基準支部』で、世界遺産を見るためのヒントを教えてもらおう。",
            [{label:"わかった",action:closeAction}],
            "GUIDE"
          );
          return;
        }

        px=nx; py=ny;
        render();
        phase62StopJoystick?.();
        currentSite=c==="S"?"知床":"北海道・北東北の縄文遺跡群";
        if(!discovered[currentSite]) discoverCurrentSite();
        else phase7EnterSite(currentSite);
        return;
      }
    }

    return phase72BaseMove(dx,dy);
  };

  // ---------------------------------------------------------------------------
  // 3. Stable Piramiton expressions/actions using the existing CSS character
  // ---------------------------------------------------------------------------
  function installPiramitonStyle(){
    let style=document.getElementById("phase72PiramitonMoodStyle");
    if(!style){
      style=document.createElement("style");
      style.id="phase72PiramitonMoodStyle";
      document.head.appendChild(style);
    }
    style.textContent=`
      .piramitonMood{
        background-image:none!important;
        background-color:transparent!important;
        background-position:initial!important;
        background-size:auto!important;
        background-repeat:no-repeat!important;
        overflow:visible!important;
        image-rendering:pixelated;
      }
      .piramitonMood>.pyramidBody,
      .piramitonMood>.pyramidFace,
      .piramitonMood>.pyramidMouth,
      .piramitonMood>.pyramidHand{display:block!important}
      .piramitonMood>.pyramidBody,
      .piramitonMood>.pyramidFace,
      .piramitonMood>.pyramidMouth,
      .piramitonMood>.pyramidHand{transition:transform .18s ease,top .18s ease,left .18s ease,right .18s ease,width .18s ease,height .18s ease,border .18s ease}
      .piramitonMood::after{position:absolute;z-index:10;right:-2px;top:-8px;font-size:18px;font-weight:1000;line-height:1;text-shadow:1px 1px #111;pointer-events:none}

      .piramitonMood.mood-normal .pyramidMouth{width:10px;height:3px;background:#6c3229;border:0;border-radius:0}

      .piramitonMood.mood-happy .pyramidFace::before,
      .piramitonMood.mood-happy .pyramidFace::after{height:2px;top:2px;border-radius:50%}
      .piramitonMood.mood-happy .pyramidMouth{width:12px;height:7px;background:transparent;border:0;border-bottom:3px solid #6c3229;border-radius:0 0 12px 12px;transform:translate(-1px,-2px)}
      .piramitonMood.mood-happy .pyramidHand.left{transform:rotate(-35deg) translateY(-2px)}
      .piramitonMood.mood-happy .pyramidHand.right{transform:rotate(35deg) translateY(-2px)}

      .piramitonMood.mood-surprised::after{content:"!";color:#ffe68a}
      .piramitonMood.mood-surprised .pyramidFace::before,
      .piramitonMood.mood-surprised .pyramidFace::after{width:5px;height:6px;top:-1px;border-radius:50%}
      .piramitonMood.mood-surprised .pyramidMouth{width:8px;height:8px;background:transparent;border:2px solid #6c3229;border-radius:50%;transform:translate(1px,-2px)}
      .piramitonMood.mood-surprised .pyramidBody{animation:piramitonPop .38s ease}

      .piramitonMood.mood-thinking::after{content:"?";color:#9fe8ff}
      .piramitonMood.mood-thinking .pyramidBody{transform:rotate(-3deg)}
      .piramitonMood.mood-thinking .pyramidMouth{width:8px;height:2px;background:#6c3229;transform:rotate(-8deg)}
      .piramitonMood.mood-thinking .pyramidHand.right{top:42px!important;right:4px!important;transform:rotate(-58deg)}

      .piramitonMood.mood-point .pyramidHand.right{width:18px!important;right:-7px!important;top:47px!important;transform:rotate(-8deg)}
      .piramitonMood.mood-point .pyramidHand.left{transform:rotate(-8deg)}
      .piramitonMood.mood-point .pyramidMouth{width:11px;height:6px;background:transparent;border:0;border-bottom:3px solid #6c3229;border-radius:0 0 10px 10px;transform:translate(0,-2px)}

      .piramitonMood.mood-sad::after{content:"…";color:#cbd3e6}
      .piramitonMood.mood-sad .pyramidBody{transform:translateY(2px)}
      .piramitonMood.mood-sad .pyramidMouth{width:11px;height:6px;background:transparent;border:0;border-top:3px solid #6c3229;border-radius:10px 10px 0 0;transform:translate(0,2px)}
      .piramitonMood.mood-sad .pyramidHand.left{transform:rotate(26deg) translateY(3px)}
      .piramitonMood.mood-sad .pyramidHand.right{transform:rotate(-26deg) translateY(3px)}

      .piramitonMood.mood-celebrate::after{content:"✦";color:#ffe68a;animation:piramitonSparkle .7s ease-in-out infinite alternate}
      .piramitonMood.mood-celebrate .pyramidBody{animation:piramitonBounce .55s ease-in-out infinite alternate}
      .piramitonMood.mood-celebrate .pyramidMouth{width:13px;height:8px;background:transparent;border:0;border-bottom:3px solid #6c3229;border-radius:0 0 12px 12px;transform:translate(-1px,-3px)}
      .piramitonMood.mood-celebrate .pyramidHand.left{top:42px!important;left:-1px!important;transform:rotate(-58deg)}
      .piramitonMood.mood-celebrate .pyramidHand.right{top:42px!important;right:-1px!important;transform:rotate(58deg)}

      .piramitonMood.mood-wave .pyramidHand.right{top:41px!important;right:0!important;transform-origin:left center;animation:piramitonWave .48s ease-in-out infinite alternate}
      .piramitonMood.mood-wave .pyramidMouth{width:12px;height:7px;background:transparent;border:0;border-bottom:3px solid #6c3229;border-radius:0 0 12px 12px;transform:translate(-1px,-2px)}

      .phase71BigPiramiton.piramitonMood::after{right:12px;top:28px;font-size:22px}
      .phase71BigPiramiton.piramitonMood.mood-thinking .pyramidHand.right{top:72px!important;right:30px!important}
      .phase71BigPiramiton.piramitonMood.mood-point .pyramidHand.right{top:78px!important;right:20px!important;width:23px!important}
      .phase71BigPiramiton.piramitonMood.mood-celebrate .pyramidHand.left{top:70px!important;left:30px!important}
      .phase71BigPiramiton.piramitonMood.mood-celebrate .pyramidHand.right{top:70px!important;right:30px!important}
      .phase71BigPiramiton.piramitonMood.mood-wave .pyramidHand.right{top:70px!important;right:30px!important}

      .phase71MiniPiramiton.piramitonMood::after{right:-6px;top:-5px;font-size:15px}
      .phase71MiniPiramiton.piramitonMood.mood-thinking .pyramidHand.right{top:28px!important;right:-5px!important}
      .phase71MiniPiramiton.piramitonMood.mood-point .pyramidHand.right{top:31px!important;right:-10px!important;width:16px!important}
      .phase71MiniPiramiton.piramitonMood.mood-celebrate .pyramidHand.left{top:25px!important;left:-5px!important}
      .phase71MiniPiramiton.piramitonMood.mood-celebrate .pyramidHand.right{top:25px!important;right:-5px!important}
      .phase71MiniPiramiton.piramitonMood.mood-wave .pyramidHand.right{top:24px!important;right:-4px!important}

      @keyframes piramitonPop{0%{transform:scale(.85)}60%{transform:scale(1.08)}100%{transform:scale(1)}}
      @keyframes piramitonBounce{from{transform:translateY(2px)}to{transform:translateY(-3px)}}
      @keyframes piramitonWave{from{transform:rotate(42deg)}to{transform:rotate(78deg)}}
      @keyframes piramitonSparkle{from{transform:scale(.8);opacity:.65}to{transform:scale(1.25);opacity:1}}
    `;
  }

  function ensurePiramitonParts(el){
    if(!el) return;
    el.classList.remove("piramitonOriginal");
    el.style.removeProperty("background-image");
    el.style.removeProperty("background-position");
    el.style.removeProperty("background-size");
    el.style.removeProperty("background-repeat");
    if(!el.querySelector(".pyramidBody")){
      const body=document.createElement("div"); body.className="pyramidBody"; el.appendChild(body);
    }
    if(!el.querySelector(".pyramidFace")){
      const face=document.createElement("div"); face.className="pyramidFace"; el.appendChild(face);
    }
    if(!el.querySelector(".pyramidMouth")){
      const mouth=document.createElement("div"); mouth.className="pyramidMouth"; el.appendChild(mouth);
    }
    if(!el.querySelector(".pyramidHand.left")){
      const hand=document.createElement("div"); hand.className="pyramidHand left"; el.appendChild(hand);
    }
    if(!el.querySelector(".pyramidHand.right")){
      const hand=document.createElement("div"); hand.className="pyramidHand right"; el.appendChild(hand);
    }
  }

  function setPiramitonMood(el,mood="normal"){
    if(!el) return false;
    installPiramitonStyle();
    ensurePiramitonParts(el);
    el.classList.add("piramitonMood");
    ["normal","happy","surprised","thinking","point","sad","celebrate","wave"].forEach(m=>el.classList.remove(`mood-${m}`));
    el.classList.add(`mood-${mood}`);
    el.dataset.piramitonMood=mood;
    return true;
  }
  window.setPiramitonMood=setPiramitonMood;

  function guideMoodFromText(text){
    const t=text||"";
    if(/CLEAR|正解|できた|カード|発見|到着|記録|すべて/.test(t)) return "celebrate";
    if(/おしい|あと少し|まだ|できない|入れない|海だよ|進めない/.test(t)) return "sad";
    if(/先に|行って|向か|支部|歩いて|話して/.test(t)) return "point";
    if(/なぜ|どうして|考え|調べ|気になる|\?|？/.test(t)) return "thinking";
    return "normal";
  }

  function refreshGuidePiramiton(){
    const portrait=document.querySelector(".guidePortrait");
    const msg=document.getElementById("guideMessage");
    if(portrait) setPiramitonMood(portrait,guideMoodFromText(msg?.textContent));
  }

  if(typeof phase71RenderIntro==="function"){
    const baseIntro=phase71RenderIntro;
    phase71RenderIntro=function(){
      baseIntro();
      requestAnimationFrame(()=>{
        const moods=["thinking","surprised","wave"];
        setPiramitonMood(document.querySelector(".phase71BigPiramiton"),moods[phase71IntroIndex]||"normal");
      });
    };
  }

  if(typeof phase71RenderOrientationLesson==="function"){
    const baseOrientation=phase71RenderOrientationLesson;
    phase71RenderOrientationLesson=function(){
      baseOrientation();
      requestAnimationFrame(()=>setPiramitonMood(document.querySelector("#phase71Orientation .phase71MiniPiramiton"),"point"));
    };
  }

  if(typeof phase72OpenBranch==="function"){
    const baseOpenBranch=phase72OpenBranch;
    phase72OpenBranch=function(){
      baseOpenBranch();
      requestAnimationFrame(()=>setPiramitonMood(document.querySelector("#phase72Branch .phase71MiniPiramiton"),"wave"));
    };
  }

  if(typeof phase72RenderBranchStep==="function"){
    const baseRenderBranchStep=phase72RenderBranchStep;
    phase72RenderBranchStep=function(){
      baseRenderBranchStep();
      requestAnimationFrame(()=>{
        const mood=phase72BranchStep===0?"thinking":phase72BranchStep===1?"point":"happy";
        setPiramitonMood(document.querySelector("#phase72Branch .phase71MiniPiramiton"),mood);
      });
    };
  }

  if(typeof phase72CompleteBranch==="function"){
    const baseCompleteBranch=phase72CompleteBranch;
    phase72CompleteBranch=function(){
      baseCompleteBranch();
      requestAnimationFrame(refreshGuidePiramiton);
    };
  }

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

  installPiramitonStyle();
  requestAnimationFrame(()=>{
    const moods=["thinking","surprised","wave"];
    setPiramitonMood(document.querySelector(".phase71BigPiramiton"),moods[phase71IntroIndex]||"normal");
    setPiramitonMood(document.querySelector("#phase71Orientation .phase71MiniPiramiton"),"point");
    refreshGuidePiramiton();
  });
})();
