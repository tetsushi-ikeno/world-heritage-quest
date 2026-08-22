(()=>{'use strict';
const KEY='whqBetaSaveV1';
const fresh=()=>({version:1,playerName:'',tutorialComplete:false,map:{position:null,path:[],returnLockSiteId:null},discovered:[],centers:{}});
function normalize(v){const d=fresh(),s=v&&typeof v==='object'?v:{};return{version:1,playerName:typeof s.playerName==='string'?s.playerName:'',tutorialComplete:!!s.tutorialComplete,map:{position:s.map?.position&&Number.isFinite(+s.map.position.x)&&Number.isFinite(+s.map.position.y)?{x:+s.map.position.x,y:+s.map.position.y}:null,path:Array.isArray(s.map?.path)?s.map.path.filter(r=>Array.isArray(r)&&'UDLR'.includes(r[0])&&Number.isFinite(+r[1])&&+r[1]>0).map(r=>[r[0],Math.floor(+r[1])]):[],returnLockSiteId:s.map?.returnLockSiteId==null?null:Number(s.map.returnLockSiteId)},discovered:Array.isArray(s.discovered)?[...new Set(s.discovered.map(Number).filter(Number.isFinite))]:[],centers:s.centers&&typeof s.centers==='object'?s.centers:{}}}
function load(){try{return normalize(JSON.parse(localStorage.getItem(KEY)||'null'))}catch(_){return fresh()}}
function save(state){const n=normalize(state);localStorage.setItem(KEY,JSON.stringify(n));return n}
function update(fn){const s=load();const r=fn(s)||s;return save(r)}
function reset(){localStorage.removeItem(KEY);for(let i=sessionStorage.length-1;i>=0;i--){const k=sessionStorage.key(i)||'';if(k.startsWith('whq'))sessionStorage.removeItem(k)}}
function centerState(slug){const s=load(),c=s.centers?.[slug]||{};return{book:!!c.book,researcher:!!c.researcher,display:!!c.display,quiz:!!c.quiz}}
function setCenterState(slug,patch){return update(s=>{const prev=s.centers[slug]||{};s.centers[slug]={book:!!(patch.book??prev.book),researcher:!!(patch.researcher??prev.researcher),display:!!(patch.display??prev.display),quiz:!!(patch.quiz??prev.quiz)};return s})}
window.WHQBetaSave={KEY,fresh,load,save,update,reset,centerState,setCenterState};

// Load beta-only compatibility patches only from the outer beta entrypoint.
// Other pages also use beta-save.js, so guard on the title screen element.
if(document.getElementById('titleScreen')&&!document.querySelector('script[data-whq-beta-hotfix]')){
  const script=document.createElement('script');
  script.src='beta-hotfix.js?v=20260822-2';
  script.dataset.whqBetaHotfix='1';
  document.head.appendChild(script);
}
})();
