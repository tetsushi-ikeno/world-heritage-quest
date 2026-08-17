// World Heritage Quest Phase 8 - single state store + transition engine.
(function(global){
'use strict';
const C=global.Phase8Content;

function initialCards(){
 const out={};
 Object.keys(C.sites).forEach(id=>{out[id]={};C.sites[id].cards.forEach(card=>out[id][card.id]=false);});
 return out;
}
function createInitialState(){
 return {
  screen:'avatar',
  areaId:'hokkaido',
  siteId:null,
  position:{x:C.hokkaido.start.x,y:C.hokkaido.start.y},
  introIndex:0,
  progress:{criteriaBranchCleared:false,discovered:{shiretoko:false,jomon:false},siteCards:initialCards(),siteCleared:{shiretoko:false,jomon:false}},
  branch:{step:0,quizIndex:0,correct:0,answered:false,feedback:''},
  quiz:{questions:[],index:0,correct:0,answered:false,feedback:''},
  ui:{overlay:null,action:null,guide:'',status:'',legend:''}
 };
}
let state=createInitialState();
const listeners=new Set();
function getState(){return state;}
function emit(prev){listeners.forEach(fn=>fn(state,prev));}
function subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);}
function site(){return state.siteId?C.sites[state.siteId]:null;}
function acquiredCount(siteId){const cards=state.progress.siteCards[siteId]||{};return Object.values(cards).filter(Boolean).length;}
function acquire(siteId,ids){const cards=state.progress.siteCards[siteId];(ids||[]).forEach(id=>{if(Object.prototype.hasOwnProperty.call(cards,id))cards[id]=true;});}
function setAreaGuide(){
 state.ui.guide=state.progress.criteriaBranchCleared?'支部での準備はOK！ 気になる「？」へ行って世界遺産を発見しよう！':'すぐ近くに登録基準支部があるよ。まず行ってみよう！';
 state.ui.status=state.progress.criteriaBranchCleared?'北海道エリアを探索中':'最初の目的：登録基準支部へ行ってみよう';
 state.ui.legend='緑＝移動できる　青＝海　🏛＝登録基準支部　？＝未発見　✓＝CLEAR　🔒＝次のエリア';
}
function setSiteGuide(){
 const s=site(); if(!s)return;
 state.ui.guide='気になるところを調べてみよう！';
 state.ui.status=`${s.shortName}の図鑑：${acquiredCount(s.id)} / ${s.cards.length} 記録`;
 state.ui.legend=acquiredCount(s.id)>=s.gateCards?'門が開いているようだ':'中央＝調べる　人＝聞く　📖＝読む　🔒＝問い　↓＝北海道へもどる';
}
function openAction(title,text,buttons,kicker='GUIDE'){
 state.ui.overlay='action';
 state.ui.action={title,text,buttons,kicker};
}
function enterSite(siteId){
 const s=C.sites[siteId]; if(!s)return;
 state.siteId=siteId; state.screen='site'; state.position={...s.start}; state.ui.overlay=null; state.ui.action=null;
 acquire(siteId,s.autoCards);
 setSiteGuide();
}
function backToArea(){
 const s=site();
 state.screen='area'; state.areaId='hokkaido'; state.position=s?{...s.returnPos}:{...C.hokkaido.start}; state.siteId=null;state.ui.overlay=null;state.ui.action=null;setAreaGuide();
}
function areaMove(dx,dy){
 const rows=C.hokkaido.rows,nx=state.position.x+dx,ny=state.position.y+dy;
 if(ny<0||ny>=rows.length||nx<0||nx>=rows[0].length)return;
 const cell=rows[ny][nx];
 if(cell==='~')return;
 if(cell==='G'){openAction('この先はまだ開いていないみたい','まずは北海道の世界遺産を調べよう。',[{label:'わかった！',event:{type:'CLOSE_OVERLAY'}}],'LOCKED');return;}
 if(cell==='C'){
  if(!state.progress.criteriaBranchCleared){state.ui.overlay='branch';state.branch={step:0,quizIndex:0,correct:0,answered:false,feedback:''};return;}
  state.position={x:nx,y:ny};return;
 }
 const siteId=C.markerToSite[cell];
 if(siteId){
  if(!state.progress.criteriaBranchCleared){openAction('先に登録基準支部へ行ってみよう！','研究センターの支部で、世界遺産を見るためのヒントを教えてもらえるよ。',[{label:'わかった！',event:{type:'CLOSE_OVERLAY'}}],'GUIDE');return;}
  state.position={x:nx,y:ny};state.siteId=siteId;
  if(!state.progress.discovered[siteId]){state.progress.discovered[siteId]=true;state.ui.overlay='discovery';}
  else enterSite(siteId);
  return;
 }
 if(cell==='L')state.position={x:nx,y:ny};
}
function siteMove(dx,dy){
 const s=site();if(!s)return;const rows=s.rows,nx=state.position.x+dx,ny=state.position.y+dy;
 if(ny<0||ny>=rows.length||nx<0||nx>=rows[0].length)return;
 const cell=rows[ny][nx];if(cell==='F')return;
 if(cell===s.centralCode){
  openAction(s.field.title,s.field.text,[...s.field.actions.map((a,i)=>({label:a.label,event:{type:'SITE_FIELD_ACTION',index:i}})),{label:'またあとで',event:{type:'CLOSE_OVERLAY'}}],s.shortName.toUpperCase());return;
 }
 if(cell==='R'){openAction('ちょうさいんがいる！','この世界遺産のことを調べているみたいだ。',[{label:'はなしてみる',event:{type:'SITE_NPC'}},{label:'またあとで',event:{type:'CLOSE_OVERLAY'}}],s.shortName.toUpperCase());return;}
 if(cell==='B'){openAction('本をみつけた！','世界遺産登録について書かれているみたいだ。',[{label:'読んでみる',event:{type:'SITE_BOOK'}},{label:'またあとで',event:{type:'CLOSE_OVERLAY'}}],s.shortName.toUpperCase());return;}
 if(cell==='K'){
  const remaining=Math.max(0,s.gateCards-acquiredCount(s.id));
  if(remaining>0)openAction('鍵のかかった門がある！',`門を開けるには、${s.shortName}のカードがあと${remaining}枚必要みたいだ。`,[{label:'またあとで',event:{type:'CLOSE_OVERLAY'}}],'LOCKED');
  else openAction('門が開いている！',`${s.shortName}についての問いに挑戦しよう。`,[{label:'問いに挑戦する',event:{type:'START_SITE_QUIZ'}},{label:'またあとで',event:{type:'CLOSE_OVERLAY'}}],'OPEN');
  return;
 }
 if(cell==='E'){backToArea();return;}
 if(cell==='.')state.position={x:nx,y:ny};
}
function startSiteQuiz(){
 const s=site();if(!s)return;
 const available=s.quiz.filter(q=>state.progress.siteCards[s.id][q.card]);
 if(available.length<5){openAction('まだ問いに進めないみたい','もう少し里を調べてみよう。',[{label:'里にもどる',event:{type:'CLOSE_OVERLAY'}}],'LOCKED');return;}
 state.quiz={questions:available.slice(0,5),index:0,correct:0,answered:false,feedback:''};state.ui.overlay='quiz';state.ui.action=null;
}
function finishQuiz(){
 const s=site(),passed=state.quiz.correct>=4;if(passed)state.progress.siteCleared[s.id]=true;
 state.ui.overlay='quizResult';state.quiz.feedback=passed?`${s.shortName} CLEAR！ 5問中${state.quiz.correct}問正解！`:`あと少し！ 5問中${state.quiz.correct}問正解。4問正解でCLEAR！`;
}
function dispatch(event){
 const prev=state;state=structuredClone(state);
 switch(event.type){
  case 'RESET': state=createInitialState();break;
  case 'AVATAR_CONFIRM':state.screen='intro';state.introIndex=0;state.ui.overlay=null;break;
  case 'INTRO_NEXT':if(state.introIndex<C.intro.length-1)state.introIndex++;else state.screen='orientation';break;
  case 'START_JOURNEY':state.screen='area';state.areaId='hokkaido';state.siteId=null;state.position={...C.hokkaido.start};state.ui.overlay=null;setAreaGuide();break;
  case 'MOVE':if(state.ui.overlay)return;if(state.screen==='area')areaMove(event.dx,event.dy);else if(state.screen==='site')siteMove(event.dx,event.dy);break;
  case 'BRANCH_NEXT':if(state.branch.step<2)state.branch.step++;else{state.branch.step=3;state.branch.quizIndex=0;state.branch.correct=0;state.branch.answered=false;state.branch.feedback='';}break;
  case 'BRANCH_PREV':if(state.branch.step>0&&state.branch.step<3)state.branch.step--;break;
  case 'BRANCH_ANSWER':if(state.branch.step!==3||state.branch.answered)break;{const q=C.branchQuiz[state.branch.quizIndex];state.branch.answered=true;if(event.index===q.answer)state.branch.correct++;state.branch.feedback=(event.index===q.answer?'正解！ ':'おしい！ ')+q.explain;}break;
  case 'BRANCH_QUIZ_NEXT':if(!state.branch.answered)break;if(state.branch.quizIndex<C.branchQuiz.length-1){state.branch.quizIndex++;state.branch.answered=false;state.branch.feedback='';}else{state.progress.criteriaBranchCleared=true;state.ui.overlay=null;state.branch.step=0;setAreaGuide();}break;
  case 'DISCOVERY_CONTINUE':if(state.siteId)enterSite(state.siteId);break;
  case 'CLOSE_OVERLAY':state.ui.overlay=null;state.ui.action=null;if(state.screen==='area')setAreaGuide();if(state.screen==='site')setSiteGuide();break;
  case 'SITE_FIELD_ACTION':{const s=site(),a=s?.field.actions[event.index];if(a){acquire(s.id,a.cards);openAction(a.title,a.text,[{label:'もどる',event:{type:'CLOSE_OVERLAY'}}],'FOUND');setSiteGuide();}}break;
  case 'SITE_NPC':{const s=site();if(s){acquire(s.id,s.npc.cards);openAction(s.npc.title,s.npc.text,[{label:'もどる',event:{type:'CLOSE_OVERLAY'}}],'FOUND');setSiteGuide();}}break;
  case 'SITE_BOOK':{const s=site();if(s){acquire(s.id,s.book.cards);openAction(s.book.title,s.book.text,[{label:'もどる',event:{type:'CLOSE_OVERLAY'}}],'FOUND');setSiteGuide();}}break;
  case 'OPEN_CODEX':if(state.screen==='site')state.ui.overlay='codex';break;
  case 'START_SITE_QUIZ':startSiteQuiz();break;
  case 'QUIZ_ANSWER':if(state.ui.overlay!=='quiz'||state.quiz.answered)break;{const q=state.quiz.questions[state.quiz.index];state.quiz.answered=true;if(event.index===q.answer)state.quiz.correct++;state.quiz.feedback=event.index===q.answer?'正解！':`おしい！ 正解は「${q.choices[q.answer]}」`;}break;
  case 'QUIZ_NEXT':if(!state.quiz.answered)break;if(state.quiz.index<state.quiz.questions.length-1){state.quiz.index++;state.quiz.answered=false;state.quiz.feedback='';}else finishQuiz();break;
  case 'QUIZ_RETRY':startSiteQuiz();break;
  case 'QUIZ_BACK_AREA':backToArea();break;
  case 'QUIZ_STAY':state.ui.overlay=null;setSiteGuide();break;
  default:break;
 }
 const blockNow=state.ui.overlay!==null||state.screen!==prev.screen;
 if(blockNow&&global.Phase8Input?.stop)global.Phase8Input.stop();
 emit(prev);return state;
}

global.Phase8Engine={getState,dispatch,subscribe,acquiredCount};
})(window);
