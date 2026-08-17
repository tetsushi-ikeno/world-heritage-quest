// World Heritage Quest Phase 8 - the only renderer.
(function(global){
'use strict';
const C=global.Phase8Content,E=global.Phase8Engine;
const $=id=>document.getElementById(id);
function hide(id){$(id)?.classList.add('hidden');}
function show(id){$(id)?.classList.remove('hidden');}
function ensurePanel(id,className='phaseMapWindow'){
 let el=$(id);if(el)return el;el=document.createElement('section');el.id=id;el.className=`panel hidden ${className}`;document.querySelector('.gameMapSide')?.appendChild(el);return el;
}
function ensureUi(){
 const story=ensurePanel('phase8Story','phaseMapWindow phase8Story');
 const branch=ensurePanel('phase8Branch','phaseMapWindow phase72Branch phase8Branch');
 const overlay=ensurePanel('phase8Overlay','phaseMapWindow phaseActionPanel phase8Overlay');
 const codex=ensurePanel('phase8Codex','phaseMapWindow phaseCodexPanel phase8Codex');
 const quiz=ensurePanel('phase8Quiz','phaseMapWindow phaseSiteQuiz phase8Quiz');
 if(!$('phase8CodexButton')){
  const b=document.createElement('button');b.id='phase8CodexButton';b.className='phaseCodexButton hidden';b.innerHTML='<span>📖 世界遺産の書</span>';b.onclick=()=>E.dispatch({type:'OPEN_CODEX'});document.querySelector('.recordSection')?.appendChild(b);
 }
 return {story,branch,overlay,codex,quiz};
}
function allPanelsHidden(){['phase8Story','phase8Branch','phase8Overlay','phase8Codex','phase8Quiz','discovery','siteDialog','quiz','dialog'].forEach(hide);}
function playerHtml(){const item=global.Phase8AvatarItem||'✦';return `<div class="mapAvatar"><div class="mapHair"></div><div class="mapFace"></div><div class="mapBody"></div><div class="mapItem">${item}</div></div>`;}
function updateText(state){
 if($('guideMessage'))$('guideMessage').textContent=state.ui.guide||'';
 if($('status'))$('status').textContent=state.ui.status||'';
 if($('legend'))$('legend').textContent=state.ui.legend||'';
}
function scaleMap(rows,cap=40){
 requestAnimationFrame(()=>{const wrap=$('mapWrap');if(!wrap||!rows.length)return;const w=rows[0].length,h=rows.length;const fit=Math.floor(Math.min(Math.max(0,wrap.clientWidth-18)/w,Math.max(0,wrap.clientHeight-18)/h));const tile=Math.max(20,Math.min(cap,fit||cap));document.documentElement.style.setProperty('--tile',`${tile}px`);});
}
function renderArea(state){
 const rows=C.hokkaido.rows,map=$('map');if(!map)return;map.innerHTML='';map.dataset.mode='phase8Hokkaido';map.style.gridTemplateColumns=`repeat(${rows[0].length},var(--tile))`;map.style.gridTemplateRows=`repeat(${rows.length},var(--tile))`;
 rows.forEach((row,y)=>[...row].forEach((cell,x)=>{
  const d=document.createElement('div');let cls=cell==='~'?'phase57Sea':'phase57Land';
  if(cell==='C')cls='phase57Land phase8BranchTile';
  if(cell==='G')cls='phase57Gate';
  const siteId=C.markerToSite[cell];if(siteId){const discovered=state.progress.discovered[siteId],cleared=state.progress.siteCleared[siteId];cls=`phase57Site ${cleared?'areaCleared':discovered?'areaDiscovered':'areaUndiscovered'}`;}
  d.className=`tile ${cls}${x===state.position.x&&y===state.position.y?' player':''}`;d.dataset.x=x;d.dataset.y=y;
  if(x===state.position.x&&y===state.position.y)d.insertAdjacentHTML('beforeend',playerHtml());
  if(cell==='C'){const label=document.createElement('span');label.className='phase8TileLabel';label.textContent=state.progress.criteriaBranchCleared?'🏛✓':'🏛';d.appendChild(label);}
  if(siteId&&(state.progress.discovered[siteId]||state.progress.siteCleared[siteId])){const label=document.createElement('span');label.className='areaSiteLabel';label.textContent=C.sites[siteId].shortName;d.appendChild(label);}
  map.appendChild(d);
 }));
 if($('mapTitle'))$('mapTitle').textContent='北海道エリア';updateText(state);scaleMap(rows,34);
 $('phase8CodexButton')?.classList.add('hidden');
}
function renderSite(state){
 const s=C.sites[state.siteId],rows=s.rows,map=$('map');if(!map)return;map.innerHTML='';map.dataset.mode='phase8Site';map.style.gridTemplateColumns=`repeat(${rows[0].length},var(--tile))`;map.style.gridTemplateRows=`repeat(${rows.length},var(--tile))`;
 rows.forEach((row,y)=>[...row].forEach((cell,x)=>{
  const d=document.createElement('div');let cls='grass';if(cell==='F')cls='forest';if(cell===s.centralCode)cls=s.centralClass;if(cell==='R')cls='npc researcher siteNpc';if(cell==='B')cls='siteBook';if(cell==='K')cls=E.acquiredCount(s.id)>=s.gateCards?'siteGateOpen':'siteGateLocked';if(cell==='E')cls='siteExit';
  d.className=`tile ${cls}${x===state.position.x&&y===state.position.y?' player':''}`;d.dataset.x=x;d.dataset.y=y;
  if(x===state.position.x&&y===state.position.y)d.insertAdjacentHTML('beforeend',playerHtml());
  if(cell==='R')d.insertAdjacentHTML('beforeend','<span class="phase8Object">人</span>');
  if(cell==='B')d.insertAdjacentHTML('beforeend','<span class="phase8Object">📖</span>');
  if(cell==='K')d.insertAdjacentHTML('beforeend',`<span class="phase8Object">${E.acquiredCount(s.id)>=s.gateCards?'🚪':'🔒'}</span>`);
  if(cell==='E')d.insertAdjacentHTML('beforeend','<span class="phase8Object">↓</span>');
  map.appendChild(d);
 }));
 if($('mapTitle'))$('mapTitle').textContent=`${s.shortName}の里`;updateText(state);scaleMap(rows,58);$('phase8CodexButton')?.classList.remove('hidden');
}
function renderStory(state,ui){
 show('game');ui.story.classList.remove('hidden');
 if(state.screen==='intro'){
  const slide=C.intro[state.introIndex];ui.story.innerHTML=`<div class="phase71StoryKicker">WORLD HERITAGE QUEST</div><div class="phase71StoryRow"><div class="phase71BigPiramiton"><div class="pyramidBody"></div><div class="pyramidFace"></div><div class="pyramidMouth"></div></div><div class="phase71StoryCopy"><div class="phase71Step">${state.introIndex+1} / ${C.intro.length}</div><h2>${slide.title}</h2><div class="phase71IntroText">${slide.text}</div></div></div><div class="phase71StoryActions"><button class="bigbtn" id="phase8IntroNext">${state.introIndex===C.intro.length-1?'研究センターへ':'つぎへ'}</button></div>`;
  $('phase8IntroNext').onclick=()=>E.dispatch({type:'INTRO_NEXT'});return;
 }
 ui.story.innerHTML=`<div class="phase71OrientationHead"><div class="phase71MiniPiramiton"><div class="pyramidBody"></div><div class="pyramidFace"></div><div class="pyramidMouth"></div></div><div><div class="phase71StoryKicker">世界遺産研究センター</div><h2>本部オリエンテーション</h2></div></div><div class="phase71Speech"><strong>ピラミトン：</strong> 世界遺産には、「なぜ世界的に大切なのか」を判断するための<strong>登録基準が10個</strong>あるよ。<br><br>今は覚えなくて大丈夫。北海道の登録基準支部で、実際の世界遺産と結びつけながら見ていこう！</div><div class="phase72TenCriteriaHint">${C.criteria.map(c=>`<span>${c.n}</span>`).join('')}</div><div class="phase71StoryActions"><button class="bigbtn" id="phase8StartJourney">北海道へ行ってみよう</button></div>`;
 $('phase8StartJourney').onclick=()=>E.dispatch({type:'START_JOURNEY'});
}
function renderBranch(state,ui){
 const b=state.branch;ui.branch.classList.remove('hidden');
 if(b.step===0)ui.branch.innerHTML=`<div class="phase72BranchHead"><div class="phase71MiniPiramiton"><div class="pyramidBody"></div><div class="pyramidFace"></div><div class="pyramidMouth"></div></div><div><div class="phase71StoryKicker">世界遺産研究センター</div><h2>北海道・登録基準支部</h2></div></div><div class="phase72Step">1 / 3　正式表記を読めるようになろう</div><h3>登録基準はローマ数字で書かれる</h3><div class="phase72RomanKeys"><div><b>I</b><span>= 1</span></div><div><b>V</b><span>= 5</span></div><div><b>X</b><span>= 10</span></div></div><div class="phase72RuleGrid"><div><strong>右側の I は足す</strong><span>VI = 6</span></div><div><strong>左側の I は1引く</strong><span>IX = 9</span></div></div><div class="phase72Actions"><button class="bigbtn" id="phase8BranchNext">10個の基準を見る</button></div>`;
 else if(b.step===1)ui.branch.innerHTML=`<div class="phase72BranchHead"><div><div class="phase71StoryKicker">世界遺産研究センター</div><h2>北海道・登録基準支部</h2></div></div><div class="phase72Step">2 / 3　10個の基準を見渡そう</div><div class="phase72CriteriaGrid">${C.criteria.map(c=>`<div class="phase72Criterion"><span class="phase72CriterionIcon">${c.icon}</span><span class="phase72CriterionNum">${c.n}</span><span class="phase72CriterionText"><b>${c.title}</b><small>${c.note}</small></span><span class="phase72CriterionRoman">(${c.roman})</span></div>`).join('')}</div><div class="phase72Actions"><button class="bigbtn" id="phase8BranchPrev">もどる</button><button class="bigbtn" id="phase8BranchNext">知床のヒントを見る</button></div>`;
 else if(b.step===2)ui.branch.innerHTML=`<div class="phase72BranchHead"><div><div class="phase71StoryKicker">世界遺産研究センター</div><h2>北海道・登録基準支部</h2></div></div><div class="phase72Step">3 / 3　北海道の世界遺産につなげよう</div><h3>知床は基準9と10</h3><div class="phase71Speech">知床では、海・川・森がつながる<strong>生態系のしくみ（9）</strong>と、貴重な生きものを守る<strong>生物多様性・生息地（10）</strong>が大切なポイント。<br><br>正式表記では <strong>(ix)・(x)</strong> だよ。</div><div class="phase72Actions"><button class="bigbtn" id="phase8BranchPrev">もどる</button><button class="bigbtn" id="phase8BranchNext">3問だけ確認する</button></div>`;
 else {const q=C.branchQuiz[b.quizIndex];ui.branch.innerHTML=`<div class="phase72BranchHead"><div><div class="phase71StoryKicker">CHECK</div><h2>登録基準支部</h2></div></div><div class="phase71CheckHead">確認 ${b.quizIndex+1} / ${C.branchQuiz.length}</div><h3 class="phase71CheckQuestion">${q.q}</h3><div class="phase71CheckChoices">${q.choices.map((c,i)=>`<button class="bigbtn phase8BranchChoice" data-i="${i}" ${b.answered?'disabled':''}>${c}</button>`).join('')}</div><div class="phaseQuizFeedback">${b.feedback||''}</div>${b.answered?`<div class="phase72Actions"><button class="bigbtn" id="phase8BranchQuizNext">${b.quizIndex===C.branchQuiz.length-1?'支部を出る':'つぎの問い'}</button></div>`:''}`;document.querySelectorAll('.phase8BranchChoice').forEach(btn=>btn.onclick=()=>E.dispatch({type:'BRANCH_ANSWER',index:Number(btn.dataset.i)}));$('phase8BranchQuizNext')&&($('phase8BranchQuizNext').onclick=()=>E.dispatch({type:'BRANCH_QUIZ_NEXT'}));return;}
 $('phase8BranchPrev')&&($('phase8BranchPrev').onclick=()=>E.dispatch({type:'BRANCH_PREV'}));$('phase8BranchNext')&&($('phase8BranchNext').onclick=()=>E.dispatch({type:'BRANCH_NEXT'}));
}
function renderDiscovery(state,ui){const s=C.sites[state.siteId];ui.overlay.classList.remove('hidden');ui.overlay.innerHTML=`<div class="discoveryKicker">NEW WORLD HERITAGE</div><div class="discoveryMark">!</div><div>新しい世界遺産を発見！</div><h2>${s.name}</h2><button class="bigbtn" id="phase8DiscoveryContinue">${s.shortName}の里へ</button>`;$('phase8DiscoveryContinue').onclick=()=>E.dispatch({type:'DISCOVERY_CONTINUE'});}
function renderAction(state,ui){const a=state.ui.action;if(!a)return;ui.overlay.classList.remove('hidden');ui.overlay.innerHTML=`<div class="phaseActionKicker">${a.kicker}</div><h2>${a.title}</h2><div class="phaseActionText">${a.text}</div><div class="phaseActionButtons">${a.buttons.map((b,i)=>`<button class="bigbtn${i===0?' phasePrimary':''}" data-i="${i}">${b.label}</button>`).join('')}</div>`;ui.overlay.querySelectorAll('button[data-i]').forEach(btn=>btn.onclick=()=>E.dispatch(a.buttons[Number(btn.dataset.i)].event));}
function renderCodex(state,ui){const s=C.sites[state.siteId],cards=state.progress.siteCards[s.id];ui.codex.classList.remove('hidden');ui.codex.innerHTML=`<div class="phaseCodexHeader"><div><div class="phaseActionKicker">WORLD HERITAGE BOOK</div><h2>${s.shortName}の図鑑</h2></div><button class="bigbtn phaseSmallButton" id="phase8CodexClose">里にもどる</button></div><div class="phaseCodexCount">${E.acquiredCount(s.id)} / ${s.cards.length} 記録</div><div class="phaseCardGrid">${s.cards.map(c=>`<div class="phaseCardSlot ${cards[c.id]?'acquired':'missing'}"><span class="phaseCardProperty"><span class="phaseCardIcon">${c.icon}</span>${c.property}</span><span class="phaseCardValue">${cards[c.id]?c.value:'？？？'}</span>${cards[c.id]?`<small>${c.description}</small>`:''}</div>`).join('')}</div>`;$('phase8CodexClose').onclick=()=>E.dispatch({type:'CLOSE_OVERLAY'});}
function renderQuiz(state,ui){const s=C.sites[state.siteId];ui.quiz.classList.remove('hidden');if(state.ui.overlay==='quizResult'){const passed=state.progress.siteCleared[s.id];ui.quiz.innerHTML=`<div class="phaseActionKicker">RESULT</div><h2>${state.quiz.feedback}</h2><div class="phaseQuizFooter">${passed?'<button class="bigbtn" id="phase8QuizArea">北海道へもどる</button><button class="bigbtn" id="phase8QuizStay">もう少し見ていく</button>':'<button class="bigbtn" id="phase8QuizRetry">もう一度やってみる</button><button class="bigbtn" id="phase8QuizStay">里にもどる</button>'}</div>`;$('phase8QuizArea')&&($('phase8QuizArea').onclick=()=>E.dispatch({type:'QUIZ_BACK_AREA'}));$('phase8QuizRetry')&&($('phase8QuizRetry').onclick=()=>E.dispatch({type:'QUIZ_RETRY'}));$('phase8QuizStay').onclick=()=>E.dispatch({type:'QUIZ_STAY'});return;}
 const q=state.quiz.questions[state.quiz.index];ui.quiz.innerHTML=`<div class="phaseActionKicker">${s.shortName.toUpperCase()} QUIZ</div><div class="phaseQuizTopline"><span>${state.quiz.index+1} / ${state.quiz.questions.length}</span><span>正解 ${state.quiz.correct}</span></div><h2>${q.question}</h2><div class="phaseQuizAnswers">${q.choices.map((c,i)=>`<button class="bigbtn phaseQuizAnswer" data-i="${i}" ${state.quiz.answered?'disabled':''}>${c}</button>`).join('')}</div><div class="phaseQuizFeedback">${state.quiz.feedback}</div>${state.quiz.answered?`<div class="phaseQuizFooter"><button class="bigbtn" id="phase8QuizNext">${state.quiz.index===state.quiz.questions.length-1?'結果を見る':'つぎの問い'}</button></div>`:''}`;ui.quiz.querySelectorAll('.phaseQuizAnswer').forEach(btn=>btn.onclick=()=>E.dispatch({type:'QUIZ_ANSWER',index:Number(btn.dataset.i)}));$('phase8QuizNext')&&($('phase8QuizNext').onclick=()=>E.dispatch({type:'QUIZ_NEXT'}));}
function render(state){
 const ui=ensureUi();allPanelsHidden();
 document.title=`世界遺産クエスト ${C.version}`;const title=document.querySelector('#app > h1');if(title)title.textContent=`世界遺産クエスト ${C.version}`;
 if(state.screen==='avatar'){hide('game');show('avatarScreen');return;}hide('avatarScreen');show('game');
 if(state.screen==='intro'||state.screen==='orientation'){renderStory(state,ui);return;}
 if(state.screen==='area')renderArea(state);else if(state.screen==='site')renderSite(state);
 if(state.ui.overlay==='branch')renderBranch(state,ui);else if(state.ui.overlay==='discovery')renderDiscovery(state,ui);else if(state.ui.overlay==='action')renderAction(state,ui);else if(state.ui.overlay==='codex')renderCodex(state,ui);else if(state.ui.overlay==='quiz'||state.ui.overlay==='quizResult')renderQuiz(state,ui);
}
E.subscribe(render);global.Phase8Render={render};
})(window);
