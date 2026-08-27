(()=>{'use strict';
const KEY='whqBetaSaveV1';
const BETA_REV='beta2';
const fresh=()=>({version:2,playerName:'',tutorialComplete:false,piramitonSpotIntroSeen:false,map:{position:null,path:[],returnLockSiteId:null,returnLockBranchId:null},discovered:[],branches:[],branchQuizDone:[],centers:{}});
function normalize(v){const s=v&&typeof v==='object'?v:{};return{version:2,playerName:typeof s.playerName==='string'?s.playerName:'',tutorialComplete:!!s.tutorialComplete,piramitonSpotIntroSeen:!!s.piramitonSpotIntroSeen,map:{position:s.map?.position&&Number.isFinite(+s.map.position.x)&&Number.isFinite(+s.map.position.y)?{x:+s.map.position.x,y:+s.map.position.y}:null,path:Array.isArray(s.map?.path)?s.map.path.filter(r=>Array.isArray(r)&&'UDLR'.includes(r[0])&&Number.isFinite(+r[1])&&+r[1]>0).map(r=>[r[0],Math.floor(+r[1])]):[],returnLockSiteId:s.map?.returnLockSiteId==null?null:Number(s.map.returnLockSiteId),returnLockBranchId:typeof s.map?.returnLockBranchId==='string'?s.map.returnLockBranchId:null},discovered:Array.isArray(s.discovered)?[...new Set(s.discovered.map(Number).filter(Number.isFinite))]:[],branches:Array.isArray(s.branches)?[...new Set(s.branches.filter(x=>typeof x==='string'))]:[],branchQuizDone:Array.isArray(s.branchQuizDone)?[...new Set(s.branchQuizDone.filter(x=>typeof x==='string'))]:[],centers:s.centers&&typeof s.centers==='object'?s.centers:{}}}
function load(){try{return normalize(JSON.parse(localStorage.getItem(KEY)||'null'))}catch(_){return fresh()}}
function save(state){const n=normalize(state);localStorage.setItem(KEY,JSON.stringify(n));return n}
function update(fn){const s=load();const r=fn(s)||s;return save(r)}
function reset(){localStorage.removeItem(KEY);for(let i=sessionStorage.length-1;i>=0;i--){const k=sessionStorage.key(i)||'';if(k.startsWith('whq'))sessionStorage.removeItem(k)}}
function centerState(slug){const s=load(),c=s.centers?.[slug]||{};return{book:!!c.book,researcher:!!c.researcher,display:!!c.display,quiz:!!c.quiz}}
function setCenterState(slug,patch){return update(s=>{const prev=s.centers[slug]||{};s.centers[slug]={book:!!(patch.book??prev.book),researcher:!!(patch.researcher??prev.researcher),display:!!(patch.display??prev.display),quiz:!!(patch.quiz??prev.quiz)};return s})}
function discoverBranch(id){return update(s=>{if(!s.branches.includes(id))s.branches.push(id);return s})}
function finishBranchQuiz(id){return update(s=>{if(!s.branchQuizDone.includes(id))s.branchQuizDone.push(id);return s})}
window.WHQBetaSave={KEY,fresh,load,save,update,reset,centerState,setCenterState,discoverBranch,finishBranchQuiz,BETA_REV};

function revisionBadge(){return document.getElementById('revisionBadge')}
function setRevisionStatus(patch){const el=revisionBadge();if(el)el.textContent=`BETA ${BETA_REV} / PATCH ${patch}`}
setRevisionStatus('loading…');

if(document.getElementById('titleScreen')&&!document.querySelector('script[data-whq-beta-hotfix]')){
  const script=document.createElement('script');
  script.src='beta-hotfix-loader.js?v=20260825-1';
  script.dataset.whqBetaHotfix='1';
  script.onload=()=>{Promise.resolve(window.WHQBetaHotfixReady).then(()=>setRevisionStatus(BETA_REV)).catch(()=>setRevisionStatus('ERROR'))};
  script.onerror=()=>setRevisionStatus('ERROR');
  document.head.appendChild(script);
}else if(document.getElementById('titleScreen'))setRevisionStatus(BETA_REV);
})();