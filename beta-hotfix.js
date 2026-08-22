(()=>{'use strict';

// Beta-only compatibility layer.
// r8 keeps the approved Piramiton fix only.
// Map position/facility restore is handled by the beta map loaders directly.

const POLL_MS=120;
let piramitonLoading=false;

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

function cleanupLegacyFacilityPatch(){
  try{
    const areaDoc=document.getElementById('gameFrame')?.contentDocument;
    areaDoc?.getElementById('betaHideOuterFacilities')?.remove();
    const mapDoc=areaDoc?.getElementById('mapFrame')?.contentDocument;
    mapDoc?.getElementById('betaFacilityLayer')?.remove();
    mapDoc?.getElementById('betaMapFacilityStyle')?.remove();
  }catch(_){ }
}

ensurePiramitonLibrary();
setInterval(()=>{
  patchTutorialPiramiton();
  cleanupLegacyFacilityPatch();
},POLL_MS);
})();
