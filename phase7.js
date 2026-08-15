// v17 Phase 7: data-driven heritage sites + second-site reuse test
// Goal: one reusable exploration/card/gate/quiz loop driven by per-site data.

const phase7BaseRender = render;
const phase7BaseRows = rows;
const phase7BaseMove = move;
const phase7BaseContinueFromDiscovery = continueFromDiscovery;
const phase7BaseOpenSiteDialog = openSiteDialog;

const phase7JomonRows = [
  "FFFFFFFFFFFFFF",
  "F.....K......F",
  "F............F",
  "F....R.......F",
  "F............F",
  "F.....CC.....F",
  "F.....CC..B..F",
  "F............F",
  "F............F",
  "F.....E......F",
  "FFFFFFFFFFFFFF"
];

const phase7Sites = {
  "知床": {
    id:"shiretoko",
    name:"知床",
    shortName:"知床",
    type:"natural",
    marker:"S",
    map:{x:27,y:4},
    returnPos:{x:14,y:12},
    villageRows: shiretokoRows,
    start:{x:6,y:8},
    centralCode:"N",
    centralClass:"heritageNature",
    cards:[
      {id:"type",property:"遺産の種類",icon:"◆",value:"自然遺産",description:"知床は、自然そのものの価値が認められた世界自然遺産。"},
      {id:"place",property:"場所",icon:"📍",value:"北海道北東部・知床半島",description:"知床は北海道の北東部にある半島で、周辺の海域も世界遺産の範囲に含まれる。"},
      {id:"ice",property:"自然現象",icon:"❄️",value:"流氷",description:"冬にはオホーツク海から流氷がやってくる。知床周辺は、季節によって海氷におおわれる「季節海氷域」にあたる。"},
      {id:"owl",property:"生き物",icon:"🐾",value:"シマフクロウ",description:"知床で見られる代表的な希少な鳥のひとつ。"},
      {id:"bear",property:"生き物",icon:"🐾",value:"ヒグマ",description:"知床に生息する大型の野生動物。海や川の恵みとも深く関わって暮らしている。"},
      {id:"ecosystem",property:"生態系",icon:"🔗",value:"海・川・森のつながり",description:"海の栄養が魚やサケを通して川や森へ運ばれ、海と陸の生き物がつながっている。"},
      {id:"year",property:"登録年",icon:"🗓️",value:"2005年",description:"知床が世界自然遺産に登録されたのは2005年。"},
      {id:"criteria",property:"登録基準",icon:"📜",value:"(ix)・(x)",description:"生態系の営みと、生物多様性・希少な生き物の生息地としての価値が認められている。"}
    ],
    autoCards:["type","place"],
    field:{
      title:"知床をしらべてみよう！",
      text:"森や海のようすが気になる。",
      actions:[
        {id:"ice",kind:"card",label:"流氷をしらべる",cards:["ice"],title:"流氷をしらべた！",newText:"海に白い氷がうかんでいる！\n\n冬になるとオホーツク海から流氷がやってくるんだ。\n\n「流氷」を図鑑に記録した！",knownText:"流氷が海をおおっている。\n\nこのことは、もう図鑑に記録してあるよ。"},
        {id:"animals",kind:"search",label:"生き物をさがす",cards:["owl","bear"]}
      ]
    },
    npc:{promptTitle:"ちょうさいんがいる！",promptText:"知床のことを調べているみたいだ。",label:"はなしてみる",cards:["ecosystem"],title:"ちょうさいんの話を聞いた！",newText:"「知床では、海の栄養が魚やサケを通して川や森へ運ばれているんだ。海と陸の生き物は、深くつながっているんだよ。」\n\n「海・川・森のつながり」を図鑑に記録した！",knownText:"「流氷、魚、サケ、森の生き物。知床では海と陸がつながっているんだよ。」\n\nこのことは、もう図鑑に記録してあるよ。"},
    book:{promptTitle:"本をみつけた！",promptText:"知床の世界遺産登録について書かれているみたいだ。",label:"読んでみる",cards:["year","criteria"],title:"本を読んだ！",newText:"知床が世界自然遺産に登録されたのは2005年。\n登録基準は (ix) と (x) なんだ。\n\n2つのカードを図鑑に記録した！",knownText:"知床が登録されたのは2005年。登録基準は (ix) と (x)。\n\nこの内容は、もう図鑑に記録してあるよ。"},
    gateCards:6,
    quiz:[
      {card:"type",question:"知床は、どの種類の世界遺産？",choices:["文化遺産","自然遺産","複合遺産","無形文化遺産"],answer:1},
      {card:"place",question:"知床半島があるのはどこ？",choices:["北海道の北東部","本州の中央部","四国の南部","九州の西部"],answer:0},
      {card:"ice",question:"季節によって海氷におおわれる知床周辺のような海域を何という？",choices:["季節海氷域","永久凍土域","サンゴ礁域","潮間帯"],answer:0},
      {card:"owl",question:"知床で見つけた、希少な鳥はどれ？",choices:["シマフクロウ","ライチョウ","タンチョウ","ヤンバルクイナ"],answer:0},
      {card:"bear",question:"知床に生息する大型の野生動物はどれ？",choices:["ヒグマ","ツキノワグマ","ニホンザル","イリオモテヤマネコ"],answer:0},
      {card:"ecosystem",question:"知床の生態系を考えるとき、大切なつながりはどれ？",choices:["海・川・森のつながり","砂漠と氷河のつながり","都市と工場のつながり","火山と古墳のつながり"],answer:0},
      {card:"year",question:"知床が世界自然遺産に登録されたのは何年？",choices:["1993年","2000年","2005年","2011年"],answer:2},
      {card:"criteria",question:"知床で認められている世界遺産の登録基準はどれ？",choices:["(i)・(ii)","(iv)・(vi)","(vii)・(viii)","(ix)・(x)"],answer:3}
    ]
  },
  "北海道・北東北の縄文遺跡群": {
    id:"jomon",
    name:"北海道・北東北の縄文遺跡群",
    shortName:"縄文遺跡群",
    type:"cultural",
    marker:"J",
    map:{x:5,y:15},
    returnPos:{x:7,y:14},
    villageRows:phase7JomonRows,
    start:{x:6,y:8},
    centralCode:"C",
    centralClass:"heritageCulture",
    cards:[
      {id:"type",property:"遺産の種類",icon:"◆",value:"文化遺産",description:"北海道・北東北の縄文遺跡群は、縄文文化を伝える世界文化遺産。"},
      {id:"place",property:"場所",icon:"📍",value:"北海道・青森・岩手・秋田",description:"構成資産は北海道と北東北3県（青森・岩手・秋田）にまたがっている。"},
      {id:"era",property:"時代",icon:"⌛",value:"縄文時代",description:"1万年以上にわたり、環境の変化に適応しながら定住生活が続いた縄文文化を伝えている。"},
      {id:"lifestyle",property:"暮らし",icon:"🏠",value:"定住した狩猟・漁労・採集生活",description:"農耕を中心とせず、狩猟・漁労・採集で食料を得ながら、一か所に住み続ける定住生活を発達させた。"},
      {id:"spiritual",property:"信仰・文化",icon:"◯",value:"複雑な精神文化",description:"墓や祭祀の場、盛土、環状列石などから、儀礼や祭祀をともなう精神文化がわかる。"},
      {id:"components",property:"構成資産",icon:"▦",value:"17遺跡",description:"世界遺産は北海道6遺跡、青森県8遺跡、岩手県1遺跡、秋田県2遺跡の合計17遺跡で構成される。"},
      {id:"year",property:"登録年",icon:"🗓️",value:"2021年",description:"北海道・北東北の縄文遺跡群が世界文化遺産に登録されたのは2021年。"},
      {id:"criteria",property:"登録基準",icon:"📜",value:"(iii)・(v)",description:"定住した狩猟・漁労・採集社会と、その土地利用・精神文化を示す価値が認められている。"}
    ],
    autoCards:["type","place"],
    field:{
      title:"縄文の遺跡をしらべてみよう！",
      text:"地面や石のならびに、昔のくらしのあとが残っている。",
      actions:[
        {id:"dwelling",kind:"card",label:"住まいのあとをしらべる",cards:["lifestyle"],title:"住まいのあとをしらべた！",newText:"同じ場所で長く暮らした住まいのあとがある。\n\n縄文の人びとは、狩猟・漁労・採集で食べ物を得ながら定住していたんだ。\n\n「定住した狩猟・漁労・採集生活」を図鑑に記録した！",knownText:"住まいのあとから、縄文の人びとの定住生活がわかる。\n\nこのことは、もう図鑑に記録してあるよ。"},
        {id:"stones",kind:"card",label:"石のならびをしらべる",cards:["spiritual"],title:"石のならびをしらべた！",newText:"石が輪のようにならんでいる場所がある。\n\n縄文の遺跡には、墓や祭祀の場、環状列石なども残されている。\n\n「複雑な精神文化」を図鑑に記録した！",knownText:"石のならびは、縄文の人びとの祭祀や精神文化を考える手がかりになる。\n\nこのことは、もう図鑑に記録してあるよ。"}
      ]
    },
    npc:{promptTitle:"ちょうさいんがいる！",promptText:"遺跡の時代について調べているみたいだ。",label:"はなしてみる",cards:["era"],title:"ちょうさいんの話を聞いた！",newText:"「この遺跡群が伝えているのは縄文時代のくらしだよ。1万年以上にわたって、環境に合わせながら定住生活が続いたんだ。」\n\n「縄文時代」を図鑑に記録した！",knownText:"「縄文時代の長い時間の中で、定住のしかたも少しずつ発展していったんだ。」\n\nこのことは、もう図鑑に記録してあるよ。"},
    book:{promptTitle:"本をみつけた！",promptText:"縄文遺跡群の世界遺産登録について書かれているみたいだ。",label:"読んでみる",cards:["components","year","criteria"],title:"本を読んだ！",newText:"この世界遺産は17の遺跡でできている。\n世界文化遺産への登録は2021年、登録基準は (iii) と (v)。\n\n3つのカードを図鑑に記録した！",knownText:"17遺跡で構成され、2021年登録。登録基準は (iii) と (v)。\n\nこの内容は、もう図鑑に記録してあるよ。"},
    gateCards:6,
    quiz:[
      {card:"type",question:"北海道・北東北の縄文遺跡群は、どの種類の世界遺産？",choices:["文化遺産","自然遺産","複合遺産","無形文化遺産"],answer:0},
      {card:"place",question:"縄文遺跡群の構成資産がある4道県の組み合わせはどれ？",choices:["北海道・青森・岩手・秋田","北海道・宮城・山形・福島","青森・岩手・宮城・福島","北海道・青森・宮城・秋田"],answer:0},
      {card:"era",question:"この遺跡群が主に伝えているのは、どの時代の文化？",choices:["縄文時代","古墳時代","奈良時代","江戸時代"],answer:0},
      {card:"lifestyle",question:"縄文の人びとの暮らしとして、この遺跡群が示しているものはどれ？",choices:["定住した狩猟・漁労・採集生活","大規模な水田農耕","城下町での商業生活","工場での生産生活"],answer:0},
      {card:"spiritual",question:"墓や祭祀の場、環状列石などから読み取れるものは？",choices:["複雑な精神文化","近代工業の発達","仏教寺院の建立","武家社会の成立"],answer:0},
      {card:"components",question:"北海道・北東北の縄文遺跡群はいくつの遺跡で構成される？",choices:["8遺跡","12遺跡","17遺跡","25遺跡"],answer:2},
      {card:"year",question:"北海道・北東北の縄文遺跡群が世界文化遺産に登録されたのは何年？",choices:["2005年","2011年","2019年","2021年"],answer:3},
      {card:"criteria",question:"北海道・北東北の縄文遺跡群の登録基準はどれ？",choices:["(i)・(ii)","(iii)・(v)","(iv)・(vi)","(ix)・(x)"],answer:1}
    ]
  }
};

const phase7Progress = Object.fromEntries(Object.entries(phase7Sites).map(([name,config])=>[
  name,
  {cleared:false,introPending:false,searchCounters:{},cards:Object.fromEntries(config.cards.map(card=>[card.id,{acquired:false,isNew:false}]))}
]));

discovered["北海道・北東北の縄文遺跡群"] = false;

function phase7Config(name=currentSite){ return phase7Sites[name] || null; }
function phase7State(name=currentSite){ return phase7Progress[name] || null; }
function phase7Card(id,name=currentSite){ return phase7Config(name)?.cards.find(card=>card.id===id) || null; }
function phase7CardState(id,name=currentSite){ return phase7State(name)?.cards[id] || null; }
function phase7AcquiredCount(name=currentSite){
  const config=phase7Config(name), state=phase7State(name);
  if(!config||!state) return 0;
  return config.cards.filter(card=>state.cards[card.id]?.acquired).length;
}
function phase7NewCount(name=currentSite){
  const config=phase7Config(name), state=phase7State(name);
  if(!config||!state) return 0;
  return config.cards.filter(card=>state.cards[card.id]?.isNew).length;
}
function phase7Acquire(id,markNew=true,name=currentSite){
  const state=phase7CardState(id,name);
  if(!state||state.acquired) return false;
  state.acquired=true;
  state.isNew=markNew;
  updateCodexBadge();
  return true;
}
function phase7AcquireMany(ids,name=currentSite){
  let added=0;
  ids.forEach(id=>{if(phase7Acquire(id,true,name)) added++;});
  return added;
}
function phase7EnsureAutoCards(name=currentSite){
  const config=phase7Config(name), state=phase7State(name);
  if(!config||!state) return;
  const added=phase7AcquireMany(config.autoCards,name);
  if(added) state.introPending=true;
}

getPhaseCard = function(id){ return phase7Card(id); };
isCardAcquired = function(id){ return !!phase7CardState(id)?.acquired; };
acquiredCardCount = function(){ return phase7AcquiredCount(); };
newCardCount = function(){ return phase7NewCount(); };
acquireCard = function(id,markNew=true){ return phase7Acquire(id,markNew); };
ensureDiscoveryCards = function(){ return phase7EnsureAutoCards(); };

updateCodexBadge = function(){
  ensurePhaseUi();
  const badge=document.getElementById("phaseCodexBadge");
  if(!badge) return;
  const count=phase7NewCount();
  badge.textContent=count>1?`NEW ${count}`:"NEW";
  badge.classList.toggle("hidden",count===0);
};

renderCodex = function(selectedId=null){
  ensurePhaseUi();
  const config=phase7Config(), state=phase7State();
  if(!config||!state) return;
  const title=document.querySelector("#phaseCodex h2");
  if(title) title.textContent=`${config.shortName}の図鑑`;
  const grid=document.getElementById("phaseCardGrid");
  grid.innerHTML="";
  document.getElementById("phaseCodexCount").textContent=`${phase7AcquiredCount()} / ${config.cards.length} 記録`;
  config.cards.forEach(card=>{
    const cardState=state.cards[card.id];
    const item=document.createElement("button");
    item.className="phaseCardSlot "+(cardState.acquired?"acquired":"missing")+(selectedId===card.id?" selected":"");
    item.innerHTML=`<span class="phaseCardProperty"><span class="phaseCardIcon">${card.icon}</span>${card.property}</span><span class="phaseCardValue">${cardState.acquired?card.value:"？？？"}</span>${cardState.isNew?'<span class="phaseCardNew">NEW</span>':''}`;
    if(cardState.acquired){
      item.onclick=()=>{
        cardState.isNew=false;
        phaseCodexSelected=card.id;
        updateCodexBadge();
        renderCodex(card.id);
      };
    }
    grid.appendChild(item);
  });
  const detail=document.getElementById("phaseCodexDetail");
  const selected=selectedId?phase7Card(selectedId):null;
  if(selected&&phase7CardState(selected.id)?.acquired){
    detail.innerHTML=`<strong>${selected.icon} ${selected.property}｜${selected.value}</strong><br>${selected.description}`;
  }else{
    detail.textContent="未取得のカードは、属性を手がかりに里を調べてみよう。";
  }
};

function phase7RunCardAction(action){
  const added=phase7AcquireMany(action.cards);
  showAction(action.title,added?action.newText:action.knownText,[{label:"もどる",action:closeAction}],added?"FOUND":"CHECK");
}

function phase7RemainingSearchCards(action){ return action.cards.filter(id=>!phase7CardState(id)?.acquired); }
function phase7RunSearchAction(action){
  const state=phase7State();
  const remaining=phase7RemainingSearchCards(action);
  if(!remaining.length){
    showAction("生き物をさがした！","ほかにもたくさんの生き物がくらしているようだ。\n\nこの場所で図鑑に記録できる生き物は、全部見つけた！",[{label:"もどる",action:closeAction}],"COMPLETE");
    return;
  }
  const count=(state.searchCounters[action.id]||0)+1;
  state.searchCounters[action.id]=count;
  const first=remaining.length===action.cards.length;
  let found=false;
  if(first){
    if(count>=3) found=true;
    else if(count===2) found=Math.random()<0.45;
  }else{
    if(count>=2) found=true;
    else found=Math.random()<0.45;
  }
  if(!found){
    showAction("生き物をさがした！","…………。\n\nなにも見つからなかった。\nまたさがしてみよう。",[{label:"もう一度さがす",action:()=>phase7RunSearchAction(action)},{label:"いったんもどる",action:closeAction}],"SEARCH");
    return;
  }
  const id=remaining[Math.floor(Math.random()*remaining.length)];
  const card=phase7Card(id);
  state.searchCounters[action.id]=0;
  phase7Acquire(id,true);
  const more=phase7RemainingSearchCards(action).length>0;
  const text=more?`${card.value}をみつけた！\n\n図鑑に記録した！\n\nほかにもまだ生き物がいそうだ。`:`${card.value}をみつけた！\n\n図鑑に記録した！\n\nほかにもたくさんの生き物がくらしているようだ。\nこの場所で図鑑に記録できる生き物は、全部見つけた！`;
  const options=more?[{label:"もう少しさがす",action:()=>phase7RunSearchAction(action)},{label:"いったんもどる",action:closeAction}]:[{label:"もどる",action:closeAction}];
  showAction(`${card.value}をみつけた！`,text,options,"FOUND");
}

openHeritageActions = function(){
  const field=phase7Config()?.field;
  if(!field) return;
  const options=field.actions.map(action=>({label:action.label,action:()=>action.kind==="search"?phase7RunSearchAction(action):phase7RunCardAction(action)}));
  options.push({label:"またあとで",action:closeAction});
  showAction(field.title,field.text,options);
};

function phase7RunSource(source,kicker){
  const added=phase7AcquireMany(source.cards);
  showAction(source.title,added?source.newText:source.knownText,[{label:"もどる",action:closeAction}],kicker);
}
openResearcherActions = function(){
  const source=phase7Config()?.npc;
  if(!source) return;
  showAction(source.promptTitle,source.promptText,[{label:source.label,action:()=>phase7RunSource(source,"LEARNED")},{label:"またあとで",action:closeAction}]);
};
openBookActions = function(){
  const source=phase7Config()?.book;
  if(!source) return;
  showAction(source.promptTitle,source.promptText,[{label:source.label,action:()=>phase7RunSource(source,"READ")},{label:"またあとで",action:closeAction}]);
};

const phase7AreaRows = phase57PlanDBase.map(row=>row);
function phase7PlaceMarker(rows,x,y,char){ rows[y]=rows[y].slice(0,x)+char+rows[y].slice(x+1); }
phase7PlaceMarker(phase7AreaRows,phase7Sites["知床"].map.x,phase7Sites["知床"].map.y,"S");
phase7PlaceMarker(phase7AreaRows,phase7Sites["北海道・北東北の縄文遺跡群"].map.x,phase7Sites["北海道・北東北の縄文遺跡群"].map.y,"J");
phase7PlaceMarker(phase7AreaRows,5,19,"G");

rows = function(){
  if(mode==="site" && phase7Config()) return phase7Config().villageRows;
  if(mode==="japan") return phase7AreaRows;
  return phase7BaseRows();
};

function phase7SiteDisplayState(name){
  if(phase7State(name)?.cleared) return "cleared";
  if(discovered[name]) return "discovered";
  return "undiscovered";
}

function phase7RenderArea(){
  phase56MountPiramiton?.();
  const r=phase7AreaRows,W=r[0].length,H=r.length;
  const map=document.getElementById("map");
  map.innerHTML="";
  map.dataset.mode="hokkaidoGridD";
  map.classList.remove("phase57Zooming");
  map.style.gridTemplateColumns=`repeat(${W},var(--tile))`;
  map.style.gridTemplateRows=`repeat(${H},var(--tile))`;
  const markerNames={S:"知床",J:"北海道・北東北の縄文遺跡群"};
  for(let y=0;y<H;y++) for(let x=0;x<W;x++){
    const d=document.createElement("div"),c=r[y][x];
    let cls="phase57Sea";
    if(c==="L") cls="phase57Land";
    if(c==="G") cls="phase57Gate";
    if(markerNames[c]){
      const name=markerNames[c], siteState=phase7SiteDisplayState(name);
      cls="phase57Site "+(siteState==="cleared"?"areaCleared":siteState==="discovered"?"areaDiscovered":"areaUndiscovered");
    }
    d.className="tile "+cls+(x===px&&y===py?" player":"");
    d.dataset.x=x;d.dataset.y=y;
    if(x===px&&y===py){const av=document.createElement("div");av.className="mapAvatar";av.innerHTML=phase57AvatarHtml();d.appendChild(av);}
    if(markerNames[c]&&(discovered[markerNames[c]]||phase7State(markerNames[c])?.cleared)){
      const label=document.createElement("span");label.className="areaSiteLabel";label.textContent=phase7Sites[markerNames[c]].shortName;d.appendChild(label);
    }
    map.appendChild(d);
  }
  document.getElementById("progressHud")?.classList.add("phaseHidden");
  document.getElementById("phaseCodexButton")?.classList.add("hidden");
  setMapTitle("北海道エリア");
  const clearCount=Object.keys(phase7Sites).filter(name=>phase7State(name).cleared).length;
  setGuideMessage(clearCount===2?"北海道の遺産をすべてCLEAR！":"気になるところへ行ってみよう！");
  document.getElementById("status").textContent=`北海道エリア：${clearCount} / 2 CLEAR`;
  document.getElementById("legend").textContent="緑＝移動できる　青＝海　？＝未発見　！＝調査中　✓＝CLEAR　🔒＝次のエリア";
  requestAnimationFrame(updateMapScale);
}

function phase7RenderVillage(){
  const config=phase7Config(); if(!config) return;
  phase56MountPiramiton?.(); phase56EnsureQuizUi?.(); ensurePhaseUi();
  const r=config.villageRows,W=r[0].length,H=r.length,map=document.getElementById("map");
  map.innerHTML="";map.dataset.mode="site";map.style.gridTemplateColumns=`repeat(${W},var(--tile))`;map.style.gridTemplateRows=`repeat(${H},var(--tile))`;
  for(let y=0;y<H;y++) for(let x=0;x<W;x++){
    const d=document.createElement("div"),c=r[y][x];let cls="grass";
    if(c==="F") cls="forest";
    if(c===config.centralCode) cls=config.centralClass;
    if(c==="R") cls="npc researcher siteNpc";
    if(c==="B") cls="siteBook";
    if(c==="K") cls=phase7AcquiredCount()>=config.gateCards?"siteGateOpen":"siteGateLocked";
    if(c==="E") cls="siteExit";
    d.className="tile "+cls+(x===px&&y===py?" player":"");d.dataset.x=x;d.dataset.y=y;
    if(x===px&&y===py){const av=document.createElement("div");av.className="mapAvatar";av.innerHTML=phase57AvatarHtml();d.appendChild(av);}
    map.appendChild(d);
  }
  document.getElementById("progressHud")?.classList.add("phaseHidden");
  const codexButton=document.getElementById("phaseCodexButton");
  codexButton?.classList.remove("hidden");
  if(codexButton) codexButton.querySelector("span").textContent=`📖 ${config.shortName}の図鑑`;
  updateCodexBadge();
  setMapTitle(`${config.shortName}の里`);setGuideMessage("気になるところに触れてみよう！");
  document.getElementById("status").textContent=`${config.shortName}の図鑑：${phase7AcquiredCount()} / ${config.cards.length} 記録`;
  document.getElementById("legend").textContent=phase7AcquiredCount()>=config.gateCards?"門が開いているようだ":"気になる場所に近づいてみよう";
  requestAnimationFrame(updateMapScale);
}

render = function(){
  if(mode==="japan"){phase7RenderArea();return;}
  if(mode==="site"&&phase7Config()){phase7RenderVillage();return;}
  phase7BaseRender();
};

function phase7EnterSite(name){
  const config=phase7Config(name);if(!config)return;
  currentSite=name;phase7EnsureAutoCards(name);mode="site";px=config.start.x;py=config.start.y;
  document.getElementById("discovery")?.classList.add("hidden");
  document.getElementById("siteDialog")?.classList.add("hidden");
  document.getElementById("quiz")?.classList.add("hidden");
  if(typeof phase41SetWindowOpen==="function") phase41SetWindowOpen(false);
  document.getElementById("game")?.classList.remove("hidden");render();
}
enterShiretokoVillage = function(){ phase7EnterSite("知床"); };

continueFromDiscovery = function(){
  if(phase7Config(currentSite)){
    document.getElementById("discovery")?.classList.add("hidden");
    if(typeof phase41SetWindowOpen==="function") phase41SetWindowOpen(false);
    phase7EnterSite(currentSite);return;
  }
  phase7BaseContinueFromDiscovery();
};
openSiteDialog = function(){ if(phase7Config(currentSite)) phase7EnterSite(currentSite); else phase7BaseOpenSiteDialog(); };

let phase7QuizQuestions=[],phase7QuizIndex=0,phase7QuizCorrect=0,phase7QuizAnswered=false;
function phase7Shuffle(list){const out=[...list];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
function phase7StartQuiz(){
  phase56EnsureQuizUi?.();const config=phase7Config();
  const available=phase7Shuffle(config.quiz.filter(q=>phase7CardState(q.card)?.acquired));
  if(available.length<5){showAction("まだ問いに進めないみたい","もう少し調べてみよう。",[{label:"里にもどる",action:closeAction}],"LOCKED");return;}
  phase7QuizQuestions=available.slice(0,5);phase7QuizIndex=0;phase7QuizCorrect=0;phase7QuizAnswered=false;
  document.getElementById("phaseAction")?.classList.add("hidden");document.getElementById("phaseCodex")?.classList.add("hidden");
  document.getElementById("phaseSiteQuiz")?.classList.remove("hidden");if(typeof phase41SetWindowOpen==="function") phase41SetWindowOpen(true);phase7RenderQuiz();
}
function phase7RenderQuiz(){
  const q=phase7QuizQuestions[phase7QuizIndex];if(!q){phase7FinishQuiz();return;}
  phase7QuizAnswered=false;document.getElementById("phaseQuizProgress").textContent=`${phase7QuizIndex+1} / 5`;document.getElementById("phaseQuizScore").textContent=`正解 ${phase7QuizCorrect}`;document.getElementById("phaseQuizQuestion").textContent=q.question;document.getElementById("phaseQuizFeedback").textContent="";document.getElementById("phaseQuizFooter").innerHTML="";
  const answers=document.getElementById("phaseQuizAnswers");answers.innerHTML="";
  q.choices.forEach((choice,index)=>{const b=document.createElement("button");b.className="bigbtn phaseQuizAnswer";b.textContent=choice;b.onclick=()=>phase7AnswerQuiz(index);answers.appendChild(b);});
}
function phase7AnswerQuiz(index){
  if(phase7QuizAnswered)return;phase7QuizAnswered=true;const q=phase7QuizQuestions[phase7QuizIndex],ok=index===q.answer;if(ok)phase7QuizCorrect++;
  document.querySelectorAll(".phaseQuizAnswer").forEach((b,i)=>{b.disabled=true;if(i===q.answer)b.classList.add("correct");if(i===index&&!ok)b.classList.add("wrong");});
  document.getElementById("phaseQuizFeedback").textContent=ok?"正解！":`おしい！ 正解は「${q.choices[q.answer]}」`;
  const next=document.createElement("button");next.className="bigbtn";next.textContent=phase7QuizIndex===4?"結果を見る":"つぎの問い";next.onclick=()=>{phase7QuizIndex++;phase7QuizIndex>=5?phase7FinishQuiz():phase7RenderQuiz();};document.getElementById("phaseQuizFooter").appendChild(next);
}
function phase7FinishQuiz(){
  const config=phase7Config(),state=phase7State(),passed=phase7QuizCorrect>=4;
  document.getElementById("phaseQuizProgress").textContent="RESULT";document.getElementById("phaseQuizScore").textContent=`${phase7QuizCorrect} / 5`;document.getElementById("phaseQuizAnswers").innerHTML="";const footer=document.getElementById("phaseQuizFooter");footer.innerHTML="";
  if(passed){
    state.cleared=true;if(currentSite==="知床")phase56ShiretokoCleared=true;
    document.getElementById("phaseQuizQuestion").textContent=`${config.shortName} CLEAR！`;document.getElementById("phaseQuizFeedback").textContent=`5問中${phase7QuizCorrect}問正解！ ${config.shortName}についての調査をクリアした。`;
    const area=document.createElement("button");area.className="bigbtn";area.textContent="北海道へもどる";area.onclick=()=>{phase56HideQuiz?.();if(typeof phase41SetWindowOpen==="function")phase41SetWindowOpen(false);mode="japan";px=config.returnPos.x;py=config.returnPos.y;render();};
    const stay=document.createElement("button");stay.className="bigbtn";stay.textContent=`もう少し${config.shortName}を見ていく`;stay.onclick=()=>{phase56HideQuiz?.();if(typeof phase41SetWindowOpen==="function")phase41SetWindowOpen(false);render();};footer.append(area,stay);
  }else{
    document.getElementById("phaseQuizQuestion").textContent="あと少し！";document.getElementById("phaseQuizFeedback").textContent=`5問中${phase7QuizCorrect}問正解。4問正解でCLEAR！`;
    const retry=document.createElement("button");retry.className="bigbtn";retry.textContent="もう一度やってみる";retry.onclick=phase7StartQuiz;const back=document.createElement("button");back.className="bigbtn";back.textContent="里にもどる";back.onclick=()=>{phase56HideQuiz?.();if(typeof phase41SetWindowOpen==="function")phase41SetWindowOpen(false);render();};footer.append(retry,back);
  }
}
startShiretokoGateQuiz = phase7StartQuiz;
showLockedGate = function(){
  const config=phase7Config(),state=phase7State();if(!config||!state)return;
  if(state.cleared){showAction("門は開いている",`${config.shortName}はCLEAR済み。もう一度、問いに挑戦することもできる。`,[{label:"もう一度やってみる",action:phase7StartQuiz},{label:"またあとで",action:closeAction}],"CLEAR");return;}
  const remaining=Math.max(0,config.gateCards-phase7AcquiredCount());
  if(remaining>0){showAction("鍵のかかった門がある！",`門を開けるには、${config.shortName}のカードがあと${remaining}枚必要みたいだ。`,[{label:"またあとで",action:closeAction}],"LOCKED");return;}
  showAction("門が開いている！",`中へ進むと、${config.shortName}についての問いが現れた。`,[{label:"問いに挑戦する",action:phase7StartQuiz},{label:"またあとで",action:closeAction}],"OPEN");
};

move = function(dx,dy){
  if(mode==="japanOverview"||transitionLock)return;
  if(typeof phase41WindowOpen!=="undefined"&&phase41WindowOpen)return;
  if(mode==="japan"){
    const nx=px+dx,ny=py+dy;if(ny<0||ny>=phase7AreaRows.length||nx<0||nx>=phase7AreaRows[0].length)return;const c=phase7AreaRows[ny][nx];
    if(c==="~"){setGuideMessage("そこは海だよ。");return;}if(c==="G"){setGuideMessage("🔒 この先はまだ開いていないみたい。");return;}
    px=nx;py=ny;render();const markerNames={S:"知床",J:"北海道・北東北の縄文遺跡群"};if(markerNames[c]){currentSite=markerNames[c];if(!discovered[currentSite])discoverCurrentSite();else phase7EnterSite(currentSite);}return;
  }
  if(mode==="site"&&phase7Config()){
    const config=phase7Config(),r=config.villageRows,nx=px+dx,ny=py+dy;if(ny<0||ny>=r.length||nx<0||nx>=r[0].length)return;const c=r[ny][nx];
    if(c===config.centralCode){openHeritageActions();return;}if(c==="R"){openResearcherActions();return;}if(c==="B"){openBookActions();return;}if(c==="K"){showLockedGate();return;}
    if(c==="E"){mode="japan";px=config.returnPos.x;py=config.returnPos.y;phase56HideQuiz?.();render();return;}
    if(c!=="."){setGuideMessage("そこには進めないみたい。");return;}px=nx;py=ny;render();return;
  }
  phase7BaseMove(dx,dy);
};

render();
