(()=>{'use strict';

// Beta-only compatibility layer.
// Keep approved tutorial/map baseline files untouched and adapt only the beta runtime.

const POLL_MS=140;
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

function patchDiscoveredCenterAlignment(){
  const doc=areaMapDocument();
  if(!doc||doc.getElementById('betaCenterAlignmentFix'))return;
  const style=doc.createElement('style');
  style.id='betaCenterAlignmentFix';
  style.textContent=`
    /*
      The approved 6x map renders a heritage marker at
      screenCenter + (siteFine - player - .5) * TILE.
      area-map-game positions its DOM facility without the -.5 term,
      so compensate exactly half a tile (14px at TILE=28).
    */
    .centerMarker{
      transform:translate(calc(-50% - 14px),calc(-50% - 14px))!important;
    }
    /* The heritage clearing is always plain in beta. Cover the original ? completely. */
    .centerMarker .cover{
      left:0!important;
      top:0!important;
      width:46px!important;
      height:42px!important;
      border-radius:6px!important;
      background:var(--plain)!important;
    }
  `;
  doc.head.appendChild(style);
}

ensurePiramitonLibrary();
setInterval(()=>{
  patchTutorialPiramiton();
  patchDiscoveredCenterAlignment();
},POLL_MS);
})();
