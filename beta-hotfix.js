(()=>{'use strict';

// Beta-only compatibility layer.
// Approved tutorial/map baseline files stay untouched; beta behavior is adapted at runtime.

const POLL_MS=100;
const SCALE=6;
const TILE=28;
const SAVE_KEY='whqBetaSaveV1';
const CAL_KEY='whqBetaMapCalibrationR6';
let piramitonLoading=false;
let calibration=loadCalibration();

const HERITAGE=[
{id:1,name:'法隆寺地域の仏教建造物',x:44,y:49},{id:2,name:'姫路城',x:40,y:48},{id:3,name:'屋久島',x:25,y:59},{id:4,name:'白神山地',x:57,y:29},{id:5,name:'古都京都の文化財',x:46,y:47},{id:6,name:'白川郷・五箇山の合掌造り集落',x:50,y:42},{id:7,name:'原爆ドーム',x:36,y:48},{id:8,name:'厳島神社',x:35,y:49},{id:9,name:'古都奈良の文化財',x:45,y:48},{id:10,name:'日光の社寺',x:54,y:44},{id:11,name:'琉球王国のグスク及び関連遺産群',x:20,y:65},{id:12,name:'紀伊山地の霊場と参詣道',x:47,y:50},{id:13,name:'知床',x:77,y:9},{id:14,name:'石見銀山遺跡とその文化的景観',x:36,y:47},{id:15,name:'小笠原諸島',x:61,y:49},{id:16,name:'平泉',x:57,y:34},{id:17,name:'富士山―信仰の対象と芸術の源泉',x:51,y:44},{id:18,name:'富岡製糸場と絹産業遺産群',x:53,y:43},{id:19,name:'明治日本の産業革命遺産',x:24,y:53},{id:20,name:'ル・コルビュジエの建築作品（国立西洋美術館）',x:56,y:46},{id:21,name:'「神宿る島」宗像・沖ノ島と関連遺産群',x:26,y:50},{id:22,name:'長崎と天草地方の潜伏キリシタン関連遺産',x:23,y:54},{id:23,name:'百舌鳥・古市古墳群',x:43,y:50},{id:24,name:'奄美大島、徳之島、沖縄島北部及び西表島',x:23,y:62},{id:25,name:'北海道・北東北の縄文遺跡群',x:56,y:27},{id:26,name:'佐渡島の金山',x:50,y:37},{id:27,name:'飛鳥・藤原の宮都',x:45,y:49}
];
const BY_NAME=new Map(HERITAGE.map(s=>[s.name,s]));
const BY_ID=new Map(HERITAGE.map(s=>[s.id,s]));

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
      .pyraminton{width:132px!important;height:120px!important;clip-path:none!important;background:none!important;background-image:none!important;display:grid!important;place-items:center!important;filter:drop-shadow(0 8px 0 rgba(0,0,0,.10))!important}
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

function rawState(){
  try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')||{}}
  catch(_){return{}}
}
function discoveredSet(){
  const state=rawState();
  return new Set(Array.isArray(state.discovered)?state.discovered.map(Number):[]);
}
function playerPosition(mapDoc){
  const text=mapDoc.getElementById('posChip')?.textContent||'';
  const m=text.match(/(-?\d+)\s*,\s*(-?\d+)/);
  return m?{x:Number(m[1]),y:Number(m[2])}:null;
}
function siteFine(site){return{x:(site.x+.5)*SCALE,y:(site.y+.5)*SCALE}}
function predictedPoint(site,camera,mapDoc){
  const p=playerPosition(mapDoc);
  if(!p)return null;
  const q=siteFine(site);
  return{x:camera.clientWidth/2+(q.x-p.x-.5)*TILE,y:camera.clientHeight/2+(q.y-p.y-.5)*TILE};
}

function loadCalibration(){
  try{
    const c=JSON.parse(sessionStorage.getItem(CAL_KEY)||'null');
    return c&&Number.isFinite(c.dx)&&Number.isFinite(c.dy)?c:null;
  }catch(_){return null}
}
function saveCalibration(c){
  calibration=c;
  try{sessionStorage.setItem(CAL_KEY,JSON.stringify(c))}catch(_){ }
}

function installQuestionMarkProbe(mapDoc){
  const win=mapDoc.defaultView;
  const canvas=mapDoc.getElementById('map');
  const proto=win?.CanvasRenderingContext2D?.prototype;
  if(!win||!canvas||!proto)return false;
  if(win.__whqQuestionProbeInstalled)return true;
  const originalClearRect=proto.clearRect;
  const originalFillText=proto.fillText;
  win.__whqQuestionMarks=[];
  proto.clearRect=function(x,y,w,h){
    if(this.canvas===canvas)win.__whqQuestionMarks=[];
    return originalClearRect.call(this,x,y,w,h);
  };
  proto.fillText=function(text,x,y,...rest){
    if(this.canvas===canvas&&text==='?')win.__whqQuestionMarks.push({x:Number(x),y:Number(y)});
    return originalFillText.call(this,text,x,y,...rest);
  };
  win.__whqQuestionProbeInstalled=true;
  setTimeout(()=>win.dispatchEvent(new win.Event('resize')),0);
  return true;
}

function nearestMark(marks,x,y,max=Infinity){
  let best=null,bestD=max;
  for(const m of marks){
    const d=Math.hypot(m.x-x,m.y-y);
    if(d<bestD){best=m;bestD=d}
  }
  return best?{mark:best,distance:bestD}:null;
}

function exactSiteId(areaDoc,mapDoc){
  const state=rawState();
  const lock=Number(state?.map?.returnLockSiteId);
  if(BY_ID.has(lock))return lock;

  const action=areaDoc.getElementById('actionBtn');
  const label=areaDoc.getElementById('actionSub')?.textContent?.trim()||'';
  if(action&&!action.disabled&&BY_NAME.has(label))return BY_NAME.get(label).id;

  const p=playerPosition(mapDoc);
  if(p){
    for(const site of HERITAGE){
      const q=siteFine(site);
      if(Math.hypot(q.x-p.x,q.y-p.y)<0.15)return site.id;
    }
  }
  return null;
}

function calibrateFromExactSite(areaDoc,mapDoc,camera,marks){
  const id=exactSiteId(areaDoc,mapDoc);
  const site=BY_ID.get(Number(id));
  if(!site||!marks.length)return false;
  const pred=predictedPoint(site,camera,mapDoc);
  if(!pred)return false;

  // When the player is touching/standing on a known site, that site's ? is near screen center.
  // This gives us an ID-safe anchor and avoids assigning a discovered label to another marker.
  const cx=camera.clientWidth/2,cy=camera.clientHeight/2;
  const hit=nearestMark(marks,cx,cy,120);
  if(!hit)return false;
  saveCalibration({dx:hit.mark.x-pred.x,dy:hit.mark.y-pred.y,sourceId:site.id,at:Date.now()});
  return true;
}

function structuralCalibration(camera,mapDoc,marks){
  if(marks.length<3)return null;
  const predicted=[];
  for(const site of HERITAGE){
    const p=predictedPoint(site,camera,mapDoc);
    if(p&&p.x>-120&&p.y>-120&&p.x<camera.clientWidth+120&&p.y<camera.clientHeight+120)predicted.push({site,...p});
  }
  if(predicted.length<3)return null;
  let best=null;
  for(const mark of marks){
    for(const pred of predicted){
      const dx=mark.x-pred.x,dy=mark.y-pred.y;
      let score=0,error=0;
      for(const m of marks){
        let d=Infinity;
        for(const q of predicted)d=Math.min(d,Math.hypot((q.x+dx)-m.x,(q.y+dy)-m.y));
        if(d<3)score++;
        error+=Math.min(d,30);
      }
      const c={dx,dy,score,error};
      if(!best||c.score>best.score||c.score===best.score&&c.error<best.error)best=c;
    }
  }
  return best&&best.score>=3?best:null;
}

function ensureCalibration(areaDoc,mapDoc,camera,marks){
  if(calibrateFromExactSite(areaDoc,mapDoc,camera,marks))return calibration;
  if(calibration)return calibration;
  const structural=structuralCalibration(camera,mapDoc,marks);
  if(structural){
    saveCalibration({dx:structural.dx,dy:structural.dy,sourceId:null,at:Date.now()});
    return calibration;
  }
  return null;
}

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
    #betaFacilityLayer{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:9}
    .betaFacility{position:absolute;width:54px;height:50px;transform:translate(-50%,-50%);filter:drop-shadow(0 2px 2px rgba(0,0,0,.28))}
    .betaFacilityMask{position:absolute;left:50%;top:50%;width:34px;height:34px;transform:translate(-50%,-50%);background:#82b85d;border-radius:50%}
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
  const esc=String(site.name).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[m]));
  return `<span class="betaFacilityMask"></span><span class="betaFacilityRoof"></span><span class="betaFacilityBody"><span class="betaFacilityDoor"></span><span class="betaFacilityWindow"></span></span><span class="betaFacilityLabel">${esc}</span>`;
}

function renderDiscoveredFacilities(){
  const ctx=innerMapContext();
  if(!ctx)return;
  const{areaDoc,mapDoc,camera}=ctx;
  installMapFacilityStyle(areaDoc,mapDoc);
  const layer=ensureFacilityLayer(camera,mapDoc);
  if(!installQuestionMarkProbe(mapDoc))return;
  const marks=Array.isArray(mapDoc.defaultView.__whqQuestionMarks)?mapDoc.defaultView.__whqQuestionMarks:[];
  const cal=ensureCalibration(areaDoc,mapDoc,camera,marks);
  const found=discoveredSet();
  const wanted=new Set();

  // If we cannot prove the site identity yet, show the original ? rather than a wrong facility label.
  if(!cal){layer.innerHTML='';return}

  for(const site of HERITAGE){
    if(!found.has(site.id))continue;
    const pred=predictedPoint(site,camera,mapDoc);
    if(!pred)continue;
    const targetX=pred.x+cal.dx,targetY=pred.y+cal.dy;
    const hit=nearestMark(marks,targetX,targetY,4);
    if(!hit)continue;
    const key='betaFacility-'+site.id;
    wanted.add(key);
    let el=mapDoc.getElementById(key);
    if(!el){
      el=mapDoc.createElement('div');
      el.id=key;
      el.className='betaFacility';
      el.dataset.heritageId=String(site.id);
      el.innerHTML=facilityHtml(site);
      layer.appendChild(el);
    }
    el.style.left=hit.mark.x+'px';
    el.style.top=hit.mark.y+'px';
  }
  [...layer.children].forEach(el=>{if(!wanted.has(el.id))el.remove()});
}

ensurePiramitonLibrary();
setInterval(()=>{
  patchTutorialPiramiton();
  renderDiscoveredFacilities();
},POLL_MS);
})();
