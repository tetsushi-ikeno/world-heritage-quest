(()=>{'use strict';

// Beta-only compatibility layer.
// Keep approved tutorial/map baseline files untouched and adapt only the beta runtime.

const POLL_MS=100;
const SCALE=6;
const TILE=28;
const SAVE_KEY='whqBetaSaveV1';
let piramitonLoading=false;

const HERITAGE=[
{id:1,name:'法隆寺地域の仏教建造物',x:44,y:49},{id:2,name:'姫路城',x:40,y:48},{id:3,name:'屋久島',x:25,y:59},{id:4,name:'白神山地',x:57,y:29},{id:5,name:'古都京都の文化財',x:46,y:47},{id:6,name:'白川郷・五箇山の合掌造り集落',x:50,y:42},{id:7,name:'原爆ドーム',x:36,y:48},{id:8,name:'厳島神社',x:35,y:49},{id:9,name:'古都奈良の文化財',x:45,y:48},{id:10,name:'日光の社寺',x:54,y:44},{id:11,name:'琉球王国のグスク及び関連遺産群',x:20,y:65},{id:12,name:'紀伊山地の霊場と参詣道',x:47,y:50},{id:13,name:'知床',x:77,y:9},{id:14,name:'石見銀山遺跡とその文化的景観',x:36,y:47},{id:15,name:'小笠原諸島',x:61,y:49},{id:16,name:'平泉',x:57,y:34},{id:17,name:'富士山―信仰の対象と芸術の源泉',x:51,y:44},{id:18,name:'富岡製糸場と絹産業遺産群',x:53,y:43},{id:19,name:'明治日本の産業革命遺産',x:24,y:53},{id:20,name:'ル・コルビュジエの建築作品（国立西洋美術館）',x:56,y:46},{id:21,name:'「神宿る島」宗像・沖ノ島と関連遺産群',x:26,y:50},{id:22,name:'長崎と天草地方の潜伏キリシタン関連遺産',x:23,y:54},{id:23,name:'百舌鳥・古市古墳群',x:43,y:50},{id:24,name:'奄美大島、徳之島、沖縄島北部及び西表島',x:23,y:62},{id:25,name:'北海道・北東北の縄文遺跡群',x:56,y:27},{id:26,name:'佐渡島の金山',x:50,y:37},{id:27,name:'飛鳥・藤原の宮都',x:45,y:49}
];

function ensurePiramitonLibrary(){
  if(typeof window.createPiramitonSVG==='function'||piramitonLoading)return;
  piramitonLoading=true;
  const script=document.createElement('script');
  script.src='piramiton-svg.js?v=approved-svg-1';
  script.dataset.whqApprovedPiramiton='1';
  script.onload=()=>{piramitonLoading=false;patchTutorialPiramiton()};
  script.onerror=()=>{piramitonLoading=false};
  document.head.appendChild(script);
}

function innerTutorialDocument(){
  try{
    const betaFrame=document.getElementById('gameFrame');
    const tutorialWrapper=betaFrame?.contentDocument;
    return tutorialWrapper?.getElementById('tutorialFrame')?.contentDocument||null;
  }catch(_){return null}
}

function patchTutorialPiramiton(){
  const doc=innerTutorialDocument();
  if(!doc)return;
  if(typeof window.createPiramitonSVG!=='function'){
    ensurePiramitonLibrary();
    return;
  }

  if(!doc.getElementById('betaApprovedPiramitonStyle')){
    const style=doc.createElement('style');
    style.id='betaApprovedPiramitonStyle';
    style.textContent=`
      .pyraminton{
        width:132px!important;
        height:120px!important;
        clip-path:none!important;
        background:none!important;
        background-image:none!important;
        display:grid!important;
        place-items:center!important;
        filter:drop-shadow(0 8px 0 rgba(0,0,0,.10))!important;
      }
      .pyraminton:after{content:none!important;display:none!important}
      .pyraminton svg{display:block!important;overflow:visible!important;max-width:100%!important;height:auto!important}
    `;
    doc.head.appendChild(style);
  }

  doc.querySelectorAll('.pyraminton').forEach(el=>{
    if(el.dataset.betaApprovedPiramiton==='1'&&el.querySelector('svg.piramitonSvg'))return;
    el.dataset.betaApprovedPiramiton='1';
    el.innerHTML='';
    const svg=window.createPiramitonSVG({size:120,expression:'normal',pose:'idle',animated:false});
    if(svg)el.appendChild(doc.importNode(svg,true));
  });

  doc.querySelectorAll('.small').forEach(el=>{
    if(el.textContent.trim()==='ピラミトン（仮）')el.textContent='ピラミトン';
  });
}

function areaMapDocument(){
  try{
    const frame=document.getElementById('gameFrame');
    const doc=frame?.contentDocument;
    return doc?.getElementById('centerLayer')?doc:null;
  }catch(_){return null}
}

function innerMapContext(){
  try{
    const areaDoc=areaMapDocument();
    const mapFrame=areaDoc?.getElementById('mapFrame');
    const mapDoc=mapFrame?.contentDocument;
    const camera=mapDoc?.getElementById('camera');
    if(!areaDoc||!mapDoc||!camera)return null;
    return{areaDoc,mapDoc,camera};
  }catch(_){return null}
}

function discoveredSet(){
  try{
    const state=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');
    return new Set(Array.isArray(state?.discovered)?state.discovered.map(Number):[]);
  }catch(_){return new Set()}
}

function playerPosition(mapDoc){
  const text=mapDoc.getElementById('posChip')?.textContent||'';
  const m=text.match(/(-?\d+)\s*,\s*(-?\d+)/);
  return m?{x:Number(m[1]),y:Number(m[2])}:null;
}

function siteFine(site){return{x:(site.x+.5)*SCALE,y:(site.y+.5)*SCALE}}

function installMapFacilityStyle(areaDoc,mapDoc){
  if(!areaDoc.getElementById('betaHideOuterFacilities')){
    const style=areaDoc.createElement('style');
    style.id='betaHideOuterFacilities';
    style.textContent='#centerLayer{display:none!important}';
    areaDoc.head.appendChild(style);
  }
  if(mapDoc.getElementById('betaMapFacilityStyle'))return;
  const style=mapDoc.createElement('style');
  style.id='betaMapFacilityStyle';
  style.textContent=`
    #betaFacilityLayer{position:absolute;inset:0;pointer-events:none;overflow:hidden}
    .betaFacility{position:absolute;width:54px;height:50px;transform:translate(-50%,-50%);filter:drop-shadow(0 2px 2px rgba(0,0,0,.28))}
    .betaFacilityMask{position:absolute;left:50%;top:50%;width:30px;height:30px;transform:translate(-50%,-50%);background:#82b85d;border-radius:50%}
    .betaFacilityRoof{position:absolute;left:7px;top:2px;width:40px;height:13px;background:#46536a;clip-path:polygon(8% 100%,25% 0,75% 0,92% 100%)}
    .betaFacilityBody{position:absolute;left:10px;top:12px;width:34px;height:29px;background:#e5efe1;border:2px solid #3f4a5d;border-radius:2px}
    .betaFacilityDoor{position:absolute;left:5px;bottom:0;width:10px;height:14px;background:#8ea8b8;border:1px solid #38465b}
    .betaFacilityWindow{position:absolute;right:4px;top:6px;width:9px;height:9px;background:#b9dce8;border:1px solid #40516b}
    .betaFacilityLabel{position:absolute;left:50%;top:46px;transform:translateX(-50%);max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:rgba(255,255,255,.96);border:1px solid #b8c5d3;border-radius:999px;padding:3px 7px;font:1000 9px/1.25 -apple-system,BlinkMacSystemFont,"Segoe UI","Yu Gothic",sans-serif;color:#243952;box-shadow:0 2px 7px rgba(0,0,0,.15)}
  `;
  mapDoc.head.appendChild(style);
}

function ensureFacilityLayer(camera,mapDoc){
  let layer=mapDoc.getElementById('betaFacilityLayer');
  if(layer)return layer;
  layer=mapDoc.createElement('div');
  layer.id='betaFacilityLayer';
  const canvas=mapDoc.getElementById('map');
  if(canvas?.nextSibling)camera.insertBefore(layer,canvas.nextSibling);else camera.appendChild(layer);
  return layer;
}

function facilityHtml(site){
  const esc=String(site.name).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  return `<span class="betaFacilityMask"></span><span class="betaFacilityRoof"></span><span class="betaFacilityBody"><span class="betaFacilityDoor"></span><span class="betaFacilityWindow"></span></span><span class="betaFacilityLabel">${esc}</span>`;
}

function renderDiscoveredFacilities(){
  const ctx=innerMapContext();
  if(!ctx)return;
  const{areaDoc,mapDoc,camera}=ctx;
  installMapFacilityStyle(areaDoc,mapDoc);
  const layer=ensureFacilityLayer(camera,mapDoc);
  const player=playerPosition(mapDoc);
  if(!player)return;
  const found=discoveredSet();
  const cw=camera.clientWidth,ch=camera.clientHeight;
  const wanted=new Set();

  for(const site of HERITAGE){
    if(!found.has(site.id))continue;
    const q=siteFine(site);
    const x=cw/2+(q.x-player.x-.5)*TILE;
    const y=ch/2+(q.y-player.y-.5)*TILE;
    if(x<-110||y<-90||x>cw+110||y>ch+110)continue;
    const key='betaFacility-'+site.id;
    wanted.add(key);
    let el=mapDoc.getElementById(key);
    if(!el){
      el=mapDoc.createElement('div');
      el.id=key;
      el.className='betaFacility';
      el.innerHTML=facilityHtml(site);
      layer.appendChild(el);
    }
    el.style.left=x+'px';
    el.style.top=y+'px';
  }

  [...layer.children].forEach(el=>{if(!wanted.has(el.id))el.remove()});
}

ensurePiramitonLibrary();
setInterval(()=>{
  patchTutorialPiramiton();
  renderDiscoveredFacilities();
},POLL_MS);
})();
